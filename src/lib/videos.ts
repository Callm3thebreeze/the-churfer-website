import {
  getEmDashCollection,
  getEmDashEntry,
  type PortableTextBlock,
} from "emdash";
import {
  videos as localVideos,
  videoCategories as localVideoCategories,
  type Video as LocalVideo,
} from "../data/videos";

const BASE_VIDEO_CATEGORIES = localVideoCategories.filter(({ id }) => id !== "all");
const BASE_VIDEO_CATEGORY_LABELS = new Map<string, string>(
  BASE_VIDEO_CATEGORIES.map(({ id, label }) => [id, label]),
);
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface VideoCategory {
  id: string;
  label: string;
}

export interface VideoEntry {
  id: string;
  slug: string;
  title: string;
  description: string;
  contentText: string;
  contentBlocks?: PortableTextBlock[];
  videoUrl: string;
  youtubeId?: string;
  category: string;
  date: string;
  source: "emdash" | "local";
}

export interface VideoLibrary {
  categories: VideoCategory[];
  videos: VideoEntry[];
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

function getDateString(
  data: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = data[key];

    if (typeof value === "string" && value.trim()) {
      const trimmed = value.trim();
      if (ISO_DATE_PATTERN.test(trimmed)) {
        return trimmed;
      }

      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.valueOf())) {
        return parsed.toISOString().slice(0, 10);
      }
    }

    if (value instanceof Date && !Number.isNaN(value.valueOf())) {
      return value.toISOString().slice(0, 10);
    }
  }

  return undefined;
}

function isPortableTextBlock(value: unknown): value is PortableTextBlock {
  return !!value && typeof value === "object" && "_type" in value;
}

function getPortableText(
  data: Record<string, unknown>,
  ...keys: string[]
): PortableTextBlock[] | undefined {
  for (const key of keys) {
    const value = data[key];
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((item) => isPortableTextBlock(item))
    ) {
      return value;
    }
  }

  return undefined;
}

function portableTextToPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks) {
    return "";
  }

  return blocks
    .map((block) => {
      if (
        block._type === "block" &&
        Array.isArray(block.children)
      ) {
        return block.children
          .filter(
            (child): child is { _type: string; text?: string } =>
              !!child && typeof child === "object" && "_type" in child,
          )
          .map((child) => (typeof child.text === "string" ? child.text : ""))
          .join("")
          .trim();
      }

      if (block._type === "code" && typeof block.code === "string") {
        return block.code.trim();
      }

      if (block._type === "image" && typeof block.alt === "string") {
        return block.alt.trim();
      }

      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function createExcerpt(text: string, maxLength = 180): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const sliced = normalized.slice(0, maxLength + 1);
  const lastWhitespace = sliced.lastIndexOf(" ");
  const safeSlice = lastWhitespace > maxLength * 0.65
    ? sliced.slice(0, lastWhitespace)
    : normalized.slice(0, maxLength);

  return `${safeSlice.trimEnd()}...`;
}

function getVideoCategoryLabel(categoryId: string): string {
  return BASE_VIDEO_CATEGORY_LABELS.get(categoryId) ?? formatCategoryLabel(categoryId);
}

function extractYouTubeId(input: string): string | undefined {
  const trimmed = input.trim();
  if (!trimmed) {
    return undefined;
  }

  if (YOUTUBE_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const candidate = url.pathname.split("/").filter(Boolean)[0] ?? "";
      return YOUTUBE_ID_PATTERN.test(candidate) ? candidate : undefined;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const watchId = url.searchParams.get("v") ?? "";
      if (YOUTUBE_ID_PATTERN.test(watchId)) {
        return watchId;
      }

      const segments = url.pathname.split("/").filter(Boolean);
      const candidate =
        (segments[0] === "embed" || segments[0] === "shorts" || segments[0] === "live")
          ? segments[1] ?? ""
          : "";

      return YOUTUBE_ID_PATTERN.test(candidate) ? candidate : undefined;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function buildCategories(videos: VideoEntry[]): VideoCategory[] {
  const seen = new Set(
    videos
      .map((video) => video.category)
      .filter((category) => category && category !== "all"),
  );

  if (seen.size === 0) {
    return [{ id: "all", label: "Todo" }];
  }

  const ordered = BASE_VIDEO_CATEGORIES.filter(({ id }) => seen.has(id));
  const extras = Array.from(seen)
    .filter((id) => !BASE_VIDEO_CATEGORY_LABELS.has(id))
    .sort((a, b) => getVideoCategoryLabel(a).localeCompare(getVideoCategoryLabel(b), "es"))
    .map((id) => ({ id, label: getVideoCategoryLabel(id) }));

  return [{ id: "all", label: "Todo" }, ...ordered, ...extras];
}

function mapLocalVideo(video: LocalVideo): VideoEntry {
  return {
    id: String(video.id),
    slug: video.slug,
    title: video.title,
    description: video.description,
    contentText: video.body,
    videoUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    youtubeId: video.youtubeId,
    category: video.category,
    date: video.date,
    source: "local",
  };
}

function getFallbackLibrary(): VideoLibrary {
  return {
    categories: [...localVideoCategories],
    videos: localVideos.map(mapLocalVideo),
    source: "local",
  };
}

function mapEmDashVideo(entry: { id: string; data: Record<string, unknown> }): VideoEntry | null {
  const title = getString(entry.data, "title") ?? entry.id;
  const slug = getString(entry.data, "slug") ?? entry.id;
  const videoUrl = getString(entry.data, "video_url", "videoUrl", "url") ?? "";

  if (!videoUrl) {
    return null;
  }

  const contentBlocks = getPortableText(entry.data, "content", "body");
  const contentText =
    portableTextToPlainText(contentBlocks) ||
    getString(entry.data, "content", "body") ||
    "";
  const description =
    getString(entry.data, "excerpt", "description") ||
    createExcerpt(contentText) ||
    title;
  const category =
    toCategoryId(getString(entry.data, "category", "video_category") ?? "") ||
    "all";
  const date =
    getDateString(
      entry.data,
      "publishedAt",
      "published_at",
      "createdAt",
      "created_at",
      "updatedAt",
      "updated_at",
    ) ?? new Date().toISOString().slice(0, 10);

  return {
    id: entry.id,
    slug,
    title,
    description,
    contentText,
    ...(contentBlocks ? { contentBlocks } : {}),
    videoUrl,
    youtubeId: extractYouTubeId(videoUrl),
    category,
    date,
    source: "emdash",
  };
}

export async function getVideoLibrary(): Promise<VideoLibrary> {
  try {
    const { entries, error } = await getEmDashCollection("videos", {
      orderBy: { published_at: "desc" },
      status: "published",
    });

    if (error || entries.length === 0) {
      return getFallbackLibrary();
    }

    const videos = entries
      .map((entry) => mapEmDashVideo(entry as { id: string; data: Record<string, unknown> }))
      .filter((video): video is VideoEntry => video !== null);

    if (videos.length === 0) {
      return getFallbackLibrary();
    }

    return {
      categories: buildCategories(videos),
      videos,
      source: "emdash",
    };
  } catch {
    return getFallbackLibrary();
  }
}

export async function getVideoEntryBySlug(slug: string): Promise<VideoEntry | null> {
  try {
    const { entry, error } = await getEmDashEntry("videos", slug);
    if (!error && entry) {
      return mapEmDashVideo(entry as { id: string; data: Record<string, unknown> });
    }
  } catch {
    // Fall through to local fallback.
  }

  const localVideo = localVideos.find((video) => video.slug === slug);
  return localVideo ? mapLocalVideo(localVideo) : null;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
  });
}

export function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getCategoryLabel(categoryId: string): string | undefined {
  if (categoryId === "all") {
    return undefined;
  }

  return getVideoCategoryLabel(categoryId);
}

export function getVideoOgImage(video: VideoEntry): string | undefined {
  return video.youtubeId
    ? `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`
    : undefined;
}

export function getVideoEmbedUrl(video: VideoEntry): string {
  return video.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${video.youtubeId}`
    : video.videoUrl;
}