import { hasPermission, type Permission } from "@emdash-cms/auth";
import type { APIRoute } from "astro";
import { sql } from "kysely";

export const prerender = false;

const COLLECTION = "photos";
const PAGE_LIMIT = 100;
const ORDER_STEP = 10;
const ORDER_FIELD_SLUG = "front_order";
const ORDER_FIELD_LABEL = "Orden en galeria";

interface ContentItem {
  id: string;
  data: Record<string, unknown>;
  publishedAt?: string | null;
  createdAt?: string;
}

interface PhotoOrderItem {
  id: string;
  title: string;
  frontOrder: number | null;
  publishedAt: string | null;
  imageSrc: string | null;
}

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error?: { code?: string; message?: string } };

interface EmdashRuntimeLike {
  handleContentList: (
    collection: string,
    params: { cursor?: string; limit?: number; status?: string },
  ) => Promise<ApiResult<{ items?: unknown[]; nextCursor?: string }>>;
  handleContentGet: (
    collection: string,
    id: string,
  ) => Promise<ApiResult<{ item?: unknown; _rev?: string }>>;
  handleContentUpdate: (
    collection: string,
    id: string,
    input: { data?: Record<string, unknown>; _rev?: string },
  ) => Promise<ApiResult<{ item?: unknown; _rev?: string }>>;
  handleContentPublish: (
    collection: string,
    id: string,
  ) => Promise<ApiResult<{ item?: unknown; _rev?: string }>>;
  invalidateManifest?: () => Promise<void> | void;
  db?: unknown;
}

function toObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function toString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.trunc(parsed);
    }
  }
  return null;
}

function getFrontOrder(data: Record<string, unknown>): number | null {
  return toNumber(data.front_order) ?? toNumber(data.frontOrder);
}

function parseMediaValue(raw: unknown): Record<string, unknown> | null {
  const obj = toObject(raw);
  if (obj) {
    return obj;
  }

  if (typeof raw === "string") {
    const candidate = raw.trim();
    if (!candidate.startsWith("{") && !candidate.startsWith("[")) {
      return null;
    }
    try {
      const parsed = JSON.parse(candidate) as unknown;
      return toObject(parsed);
    } catch {
      return null;
    }
  }

  return null;
}

function getImageSrc(data: Record<string, unknown>): string | null {
  const imageField = data.image;

  if (typeof imageField === "string") {
    const plain = imageField.trim();
    if (plain.length > 0 && !plain.startsWith("{")) {
      return plain;
    }
  }

  const media = parseMediaValue(imageField);
  if (!media) {
    return null;
  }

  const direct = toString(media.src);
  if (direct) {
    return direct;
  }

  const preview = toString(media.previewUrl);
  if (preview) {
    return preview;
  }

  const meta = toObject(media.meta);
  const variants = meta?.variants;
  if (Array.isArray(variants)) {
    for (const variant of variants) {
      const value = toString(variant);
      if (value) {
        return value;
      }
    }
  }

  return null;
}

function parseContentItem(value: unknown): ContentItem | null {
  const obj = toObject(value);
  if (!obj) {
    return null;
  }

  const id = toString(obj.id);
  const data = toObject(obj.data);
  if (!id || !data) {
    return null;
  }

  const publishedAt = typeof obj.publishedAt === "string" ? obj.publishedAt : null;
  const createdAt = typeof obj.createdAt === "string" ? obj.createdAt : undefined;

  return {
    id,
    data,
    publishedAt,
    createdAt,
  };
}

function comparePhotos(a: PhotoOrderItem, b: PhotoOrderItem): number {
  const aOrder = a.frontOrder ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.frontOrder ?? Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  const aDate = Date.parse(a.publishedAt ?? "");
  const bDate = Date.parse(b.publishedAt ?? "");
  const safeA = Number.isFinite(aDate) ? aDate : 0;
  const safeB = Number.isFinite(bDate) ? bDate : 0;

  if (safeA !== safeB) {
    return safeB - safeA;
  }

  return a.id.localeCompare(b.id);
}

function apiError(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status });
}

function buildInternalHeaders(request: Request, withJson: boolean): Headers {
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) {
    headers.set("cookie", cookie);
  }

  if (withJson) {
    headers.set("Content-Type", "application/json");
    headers.set("X-EmDash-Request", "1");
  }

  return headers;
}

async function readApiErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as unknown;
    const payloadObj = toObject(payload);
    const errorObj = toObject(payloadObj?.error);
    return toString(errorObj?.message) ?? fallback;
  } catch {
    return fallback;
  }
}

async function hasOrderFieldInDb(runtime: EmdashRuntimeLike): Promise<boolean> {
  if (!runtime.db) {
    return false;
  }

  const result = await sql<{ count: number | string }>`
    SELECT COUNT(*) AS count
    FROM _emdash_fields f
    JOIN _emdash_collections c ON c.id = f.collection_id
    WHERE c.slug = ${COLLECTION}
      AND f.slug = ${ORDER_FIELD_SLUG}
  `.execute(runtime.db as never);

  const row = result.rows[0] as Record<string, unknown> | undefined;
  const value = row?.count;
  const count = typeof value === "string" ? Number(value) : typeof value === "number" ? value : 0;

  return Number.isFinite(count) && count > 0;
}

async function createOrderField(request: Request): Promise<void> {
  const url = new URL(`/_emdash/api/schema/collections/${COLLECTION}/fields`, request.url);
  const response = await fetch(url, {
    method: "POST",
    headers: buildInternalHeaders(request, true),
    body: JSON.stringify({
      slug: ORDER_FIELD_SLUG,
      label: ORDER_FIELD_LABEL,
      type: "integer",
      required: false,
      validation: { min: 0 },
    }),
  });

  if (response.ok) {
    return;
  }

  const message = await readApiErrorMessage(response, `Failed to create ${ORDER_FIELD_SLUG} field (${response.status})`);

  // Race-safe: another request could have created it first.
  if (/already exists|duplicate/i.test(message)) {
    return;
  }

  throw new Error(message);
}

async function ensureOrderField(request: Request, runtime: EmdashRuntimeLike): Promise<void> {
  if (await hasOrderFieldInDb(runtime)) {
    return;
  }

  await createOrderField(request);

  if (!(await hasOrderFieldInDb(runtime))) {
    throw new Error(`Field ${ORDER_FIELD_SLUG} is still missing after creation attempt`);
  }

  if (typeof runtime.invalidateManifest === "function") {
    await runtime.invalidateManifest();
  }
}

function getRuntime(locals: Record<string, unknown>): EmdashRuntimeLike | null {
  const emdash = toObject(locals.emdash);
  if (!emdash) {
    return null;
  }

  if (
    typeof emdash.handleContentList !== "function" ||
    typeof emdash.handleContentGet !== "function" ||
    typeof emdash.handleContentUpdate !== "function" ||
    typeof emdash.handleContentPublish !== "function"
  ) {
    return null;
  }

  return emdash as unknown as EmdashRuntimeLike;
}

function hasEditPermission(user: unknown): boolean {
  if (!user || typeof user !== "object") {
    return false;
  }

  return hasPermission(user as Parameters<typeof hasPermission>[0], "content:edit_any" as Permission);
}

async function loadPublishedPhotos(runtime: EmdashRuntimeLike): Promise<ContentItem[]> {
  const items: ContentItem[] = [];
  let cursor: string | undefined;

  do {
    const result = await runtime.handleContentList(COLLECTION, {
      status: "published",
      limit: PAGE_LIMIT,
      cursor,
    });

    if (!result.success) {
      const message = result.error?.message ?? "Failed to list photos";
      throw new Error(message);
    }

    const data = toObject(result.data) ?? {};
    const pageItems = Array.isArray(data.items) ? data.items : [];

    for (const item of pageItems) {
      const parsed = parseContentItem(item);
      if (parsed) {
        items.push(parsed);
      }
    }

    const nextCursor = toString(data.nextCursor);
    cursor = nextCursor ?? undefined;
  } while (cursor);

  return items;
}

function toPhotoOrderItem(item: ContentItem): PhotoOrderItem {
  return {
    id: item.id,
    title: toString(item.data.title) ?? item.id,
    frontOrder: getFrontOrder(item.data),
    publishedAt: item.publishedAt ?? null,
    imageSrc: getImageSrc(item.data),
  };
}

export const GET: APIRoute = async ({ locals }) => {
  const safeLocals = locals as unknown as Record<string, unknown>;
  const user = safeLocals.user;
  const runtime = getRuntime(safeLocals);

  if (!user) {
    return apiError(401, "NOT_AUTHENTICATED", "Not authenticated");
  }

  if (!hasEditPermission(user)) {
    return apiError(403, "FORBIDDEN", "Insufficient permissions");
  }

  if (!runtime) {
    return apiError(500, "NOT_CONFIGURED", "EmDash runtime is not initialized");
  }

  try {
    const published = await loadPublishedPhotos(runtime);
    const items = published.map(toPhotoOrderItem).sort(comparePhotos);
    return Response.json({ data: { items } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load photos";
    return apiError(500, "ORDER_LIST_FAILED", message);
  }
};

export const POST: APIRoute = async ({ request, locals, cache }) => {
  const safeLocals = locals as unknown as Record<string, unknown>;
  const user = safeLocals.user;
  const runtime = getRuntime(safeLocals);

  if (!user) {
    return apiError(401, "NOT_AUTHENTICATED", "Not authenticated");
  }

  if (!hasEditPermission(user)) {
    return apiError(403, "FORBIDDEN", "Insufficient permissions");
  }

  if (!runtime) {
    return apiError(500, "NOT_CONFIGURED", "EmDash runtime is not initialized");
  }

  try {
    await ensureOrderField(request, runtime);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Missing order field in schema";
    return apiError(409, "ORDER_FIELD_MISSING", message);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiError(400, "INVALID_JSON", "Invalid JSON body");
  }

  const body = toObject(payload);
  const orderedIdsRaw = body?.orderedIds;

  if (!Array.isArray(orderedIdsRaw)) {
    return apiError(400, "INVALID_INPUT", "orderedIds must be an array");
  }

  const uniqueOrderedIds: string[] = [];
  const seen = new Set<string>();
  for (const rawId of orderedIdsRaw) {
    const id = toString(rawId);
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    uniqueOrderedIds.push(id);
  }

  if (uniqueOrderedIds.length === 0) {
    return apiError(400, "INVALID_INPUT", "orderedIds cannot be empty");
  }

  try {
    const currentItems = await loadPublishedPhotos(runtime);
    const byId = new Map(currentItems.map((item) => [item.id, item]));

    const currentIds = currentItems.map((item) => item.id);
    const validOrderedIds = uniqueOrderedIds.filter((id) => byId.has(id));
    const remainingIds = currentIds.filter((id) => !seen.has(id));
    const finalIds = [...validOrderedIds, ...remainingIds];

    const failed: Array<{ id: string; message: string }> = [];
    let updatedCount = 0;

    for (let index = 0; index < finalIds.length; index += 1) {
      const id = finalIds[index]!;
      const desiredOrder = (index + 1) * ORDER_STEP;
      const current = byId.get(id);

      if (!current) {
        failed.push({ id, message: "Photo not found" });
        continue;
      }

      const existingOrder = getFrontOrder(current.data);
      if (existingOrder === desiredOrder) {
        continue;
      }

      const getResult = await runtime.handleContentGet(COLLECTION, id);
      if (!getResult.success) {
        failed.push({ id, message: getResult.error?.message ?? "Failed to fetch entry" });
        continue;
      }

      const getData = toObject(getResult.data);
      const getItem = parseContentItem(getData?.item);
      const rev = toString(getData?._rev);

      if (!getItem) {
        failed.push({ id, message: "Invalid content payload" });
        continue;
      }

      const updateResult = await runtime.handleContentUpdate(COLLECTION, getItem.id, {
        data: { ...getItem.data, front_order: desiredOrder },
        _rev: rev ?? undefined,
      });

      if (!updateResult.success) {
        failed.push({ id, message: updateResult.error?.message ?? "Failed to update entry" });
        continue;
      }

      const publishResult = await runtime.handleContentPublish(COLLECTION, getItem.id);
      if (!publishResult.success) {
        failed.push({
          id,
          message: `Draft saved but publish failed: ${publishResult.error?.message ?? "Unknown error"}`,
        });
        continue;
      }

      updatedCount += 1;
    }

    if (cache.enabled) {
      await cache.invalidate({ tags: [COLLECTION] });
    }

    return Response.json(
      {
        data: {
          ok: failed.length === 0,
          total: finalIds.length,
          updatedCount,
          failed,
        },
      },
      { status: failed.length === 0 ? 200 : 207 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save order";
    return apiError(500, "ORDER_SAVE_FAILED", message);
  }
};
