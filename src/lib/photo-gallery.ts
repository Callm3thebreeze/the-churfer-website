import type { ImageMetadata } from "astro";
import { getEmDashCollection, type MediaValue } from "emdash";
import {
  galleryPhotos as localGalleryPhotos,
  photoFilters as localPhotoFilters,
  type PhotoCategory,
} from "../data/photos";

const BASE_FILTERS = localPhotoFilters.filter(({ id }) => id !== "all");
const FILTER_LABELS = new Map(BASE_FILTERS.map(({ id, label }) => [id, label]));

export interface GalleryPhoto {
  id: string;
  title: string;
  alt: string;
  tags: string[];
  category: string;
  filterLabel: string;
  displayCategory: string;
  image?: ImageMetadata;
  media?: MediaValue | string;
  src: string;
  width: number;
  height: number;
  aspect: string;
  relativePath: string;
}

export interface GalleryData {
  filters: PhotoCategory[];
  photos: GalleryPhoto[];
  source: "emdash" | "local";
}

function toCategoryId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatCategoryLabel(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getCategoryLabel(value: string): string {
  return FILTER_LABELS.get(value) ?? formatCategoryLabel(value);
}

function getString(
  data: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function getStringArray(
  data: Record<string, unknown>,
  ...keys: string[]
): string[] | undefined {
  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) {
      const items = value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);

      if (items.length > 0) {
        return items;
      }
    }

    if (typeof value === "string" && value.trim()) {
      const items = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (items.length > 0) {
        return items;
      }
    }
  }

  return undefined;
}

function getNumber(
  data: Record<string, unknown>,
  ...keys: string[]
): number | undefined {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return undefined;
}

function isMediaValue(value: unknown): value is MediaValue {
  return !!value && typeof value === "object" && ("id" in value || "src" in value);
}

function getMediaValue(
  data: Record<string, unknown>,
  ...keys: string[]
): MediaValue | string | undefined {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) {
      const raw = value.trim();

      // EmDash can persist media fields as JSON strings in SQL-backed collections.
      if (raw.startsWith("{") || raw.startsWith("[")) {
        try {
          const parsed = JSON.parse(raw);
          if (isMediaValue(parsed)) {
            return parsed;
          }
        } catch {
          // Fall back to treating it as a plain URL string.
        }
      }

      return raw;
    }
    if (isMediaValue(value)) {
      return value;
    }
  }

  return undefined;
}

function getMediaSrc(value: MediaValue | string | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (typeof value.src === "string" && value.src.trim()) {
    return value.src.trim();
  }

  // Prefer stable variant URLs when providers persist them in metadata.
  const variants = value.meta?.variants;
  if (Array.isArray(variants)) {
    const firstVariant = variants.find(
      (variant): variant is string =>
        typeof variant === "string" && variant.trim().length > 0,
    );
    if (firstVariant) {
      return firstVariant;
    }
  }

  if (typeof value.previewUrl === "string" && value.previewUrl.trim()) {
    return value.previewUrl.trim();
  }

  // Last resort for Cloudflare Images values without explicit URL.
  if (value.provider === "cloudflare-images" && value.id && import.meta.env.CF_IMAGES_ACCOUNT_HASH) {
    return `https://imagedelivery.net/${import.meta.env.CF_IMAGES_ACCOUNT_HASH}/${value.id}/public`;
  }

  return "";
}

function buildFilters(photos: GalleryPhoto[]): PhotoCategory[] {
  const seen = new Set<string>();

  for (const photo of photos) {
    const sourceTags = photo.tags.length > 0 ? photo.tags : [photo.category];
    for (const tag of sourceTags) {
      if (tag) {
        seen.add(tag);
      }
    }
  }

  const ordered = BASE_FILTERS.filter(({ id }) => seen.has(id));
  const extras = Array.from(seen)
    .filter((id) => !FILTER_LABELS.has(id))
    .sort((a, b) => getCategoryLabel(a).localeCompare(getCategoryLabel(b), "es"))
    .map((id) => ({ id, label: getCategoryLabel(id) }));

  return [
    { id: "all", label: "Todo" },
    ...ordered,
    ...extras,
  ];
}

function getFallbackGallery(): GalleryData {
  const photos: GalleryPhoto[] = localGalleryPhotos.map((photo) => ({
    id: String(photo.id),
    title: photo.title,
    alt: photo.alt,
    tags: [photo.category],
    category: photo.category,
    filterLabel: photo.filterLabel,
    displayCategory: photo.displayCategory,
    image: photo.image,
    media: photo.src,
    src: photo.src,
    width: photo.width,
    height: photo.height,
    aspect: photo.aspect,
    relativePath: photo.relativePath,
  }));

  return {
    filters: localPhotoFilters,
    photos,
    source: "local",
  };
}

function mapEmDashPhoto(entry: { id: string; data: Record<string, unknown> }): GalleryPhoto | null {
  const title = getString(entry.data, "title") ?? entry.id;
  const media = getMediaValue(entry.data, "image", "featured_image", "photo", "media");
  const src = getMediaSrc(media);

  if (!src && !isMediaValue(media)) {
    return null;
  }

  const rawTags = getStringArray(entry.data, "tags", "categories");
  const normalizedTags = Array.from(
    new Set(
      (rawTags ?? [])
        .map((tag) => toCategoryId(tag))
        .filter(Boolean),
    ),
  );
  const legacyCategory = toCategoryId(
    getString(entry.data, "category", "categorySlug", "filter", "tag") ?? "",
  );
  const tags = normalizedTags.length > 0
    ? normalizedTags
    : legacyCategory
      ? [legacyCategory]
      : ["sin-categoria"];
  const category = tags[0];
  const filterLabel = getCategoryLabel(category);
  const displayCategory =
    getString(entry.data, "displayCategory", "categoryDisplay") ??
    tags.map((tag) => getCategoryLabel(tag)).join(" / ");
  const width =
    getNumber(entry.data, "width") ??
    (isMediaValue(media) && typeof media.width === "number" ? media.width : undefined) ??
    1600;
  const height =
    getNumber(entry.data, "height") ??
    (isMediaValue(media) && typeof media.height === "number" ? media.height : undefined) ??
    1067;

  return {
    id: entry.id,
    title,
    alt:
      getString(entry.data, "alt") ??
      (isMediaValue(media) && typeof media.alt === "string" ? media.alt : undefined) ??
      `Sergi Ortega - ${title}`,
    tags,
    category,
    filterLabel,
    displayCategory,
    media,
    src,
    width,
    height,
    aspect: `${width}/${height}`,
    relativePath: getString(entry.data, "slug") ?? entry.id,
  };
}

export async function getGalleryData(): Promise<GalleryData> {
  try {
    const allEntries: Array<{ id: string; data: Record<string, unknown> }> = [];
    let cursor: string | undefined;

    do {
      const { entries, error, nextCursor } = await getEmDashCollection("photos", {
        orderBy: { published_at: "desc" },
        status: "published",
        limit: 100,
        cursor,
      });

      if (error) {
        return getFallbackGallery();
      }

      allEntries.push(
        ...entries.map((entry) => ({
          id: entry.id,
          data:
            entry.data && typeof entry.data === "object"
              ? (entry.data as unknown as Record<string, unknown>)
              : {},
        })),
      );

      cursor = nextCursor;
    } while (cursor);

    if (allEntries.length === 0) {
      return getFallbackGallery();
    }

    const photos = allEntries
      .map((entry) => mapEmDashPhoto(entry))
      .filter((photo): photo is GalleryPhoto => photo !== null);

    if (photos.length === 0) {
      return getFallbackGallery();
    }

    return {
      filters: buildFilters(photos),
      photos,
      source: "emdash",
    };
  } catch {
    return getFallbackGallery();
  }
}