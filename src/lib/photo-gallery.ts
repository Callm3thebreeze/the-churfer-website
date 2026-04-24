import type { ImageMetadata } from "astro";
import { getEmDashCollection, type MediaValue } from "emdash";
import {
  galleryPhotos as localGalleryPhotos,
  photoFilters as localPhotoFilters,
  type PhotoCategory,
} from "../data/photos";

export interface GalleryPhoto {
  id: string;
  title: string;
  alt: string;
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
      return value;
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
  return value.src ?? "";
}

function buildFilters(photos: GalleryPhoto[]): PhotoCategory[] {
  const uniqueCategories = new Map<string, string>();

  for (const photo of photos) {
    if (!uniqueCategories.has(photo.category)) {
      uniqueCategories.set(photo.category, photo.filterLabel);
    }
  }

  return [
    { id: "all", label: "Todo" },
    ...Array.from(uniqueCategories.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "es")),
  ];
}

function getFallbackGallery(): GalleryData {
  const photos: GalleryPhoto[] = localGalleryPhotos.map((photo) => ({
    id: String(photo.id),
    title: photo.title,
    alt: photo.alt,
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

  const rawCategory =
    getString(entry.data, "category", "categorySlug", "filter", "tag") ??
    "Sin categoria";
  const category = toCategoryId(rawCategory) || "sin-categoria";
  const filterLabel =
    getString(entry.data, "filterLabel", "categoryLabel") ??
    formatCategoryLabel(rawCategory);
  const displayCategory =
    getString(entry.data, "displayCategory", "categoryDisplay") ?? filterLabel;
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
    const { entries, error } = await getEmDashCollection("photos", {
      orderBy: { published_at: "desc" },
      status: "published",
    });

    if (error || entries.length === 0) {
      return getFallbackGallery();
    }

    const photos = entries
      .map((entry) => mapEmDashPhoto(entry as { id: string; data: Record<string, unknown> }))
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