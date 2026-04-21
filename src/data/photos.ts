import type { ImageMetadata } from "astro";

export interface PhotoItem {
  id: number;
  title: string;
  alt: string;
  category: string;
  filterLabel: string;
  displayCategory: string;
  image: ImageMetadata;
  src: string;
  width: number;
  height: number;
  aspect: string;
  relativePath: string;
}

export interface PhotoCategory {
  id: string;
  label: string;
}

const ROOT_LABELS: Record<string, string> = {
  ANIMALES: "Animales",
  CLABORACIONES: "Colaboraciones",
  JUJITSU: "Jiu-Jitsu",
  LUGARES: "Lugares",
  MAR: "Mar",
  MONOCROMA: "Monocroma",
  NATURALEZA: "Naturaleza",
  RETRATOS: "Retratos",
  SKATE: "Skate",
  SURF: "Surf",
};

const photoModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/images/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  { eager: true },
);

function toCategoryId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatSegment(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function titleFromFilename(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  return withoutExt
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const mapped = Object.entries(photoModules)
  .map(([path, module]) => {
    const relativePath = path.replace("../assets/images/", "");
    const parts = relativePath.split("/");
    const filename = parts[parts.length - 1] ?? "";
    const rootFolder = parts[0] ?? "OTROS";
    const subfolder = parts.length > 2 ? parts[1] : "";
    const rootLabel = ROOT_LABELS[rootFolder] ?? formatSegment(rootFolder);
    const category = toCategoryId(rootFolder);
    const title = titleFromFilename(filename);

    return {
      title,
      alt: `Sergi Ortega - ${title}`,
      category,
      filterLabel: rootLabel,
      displayCategory: subfolder
        ? `${rootLabel} / ${formatSegment(subfolder)}`
        : rootLabel,
      image: module.default,
      src: module.default.src,
      width: module.default.width,
      height: module.default.height,
      aspect: `${module.default.width}/${module.default.height}`,
      relativePath,
    };
  })
  .sort((a, b) => a.relativePath.localeCompare(b.relativePath, "es"));

export const galleryPhotos: PhotoItem[] = mapped.map((photo, index) => ({
  id: index + 1,
  ...photo,
}));

const uniqueCategories = new Map<string, string>();
for (const photo of galleryPhotos) {
  if (!uniqueCategories.has(photo.category)) {
    uniqueCategories.set(photo.category, photo.filterLabel);
  }
}

export const photoCategories: PhotoCategory[] = Array.from(
  uniqueCategories.entries(),
)
  .map(([id, label]) => ({ id, label }))
  .sort((a, b) => a.label.localeCompare(b.label, "es"));

export const photoFilters: PhotoCategory[] = [
  { id: "all", label: "Todo" },
  ...photoCategories,
];

export function getPanoramaTileClass(photo: PhotoItem, index: number): string {
  const isPortrait = photo.height > photo.width * 1.12;

  if (index % 19 === 0) return "pano-tile--lg";
  if (isPortrait) return "pano-tile--tall";
  if (index % 7 === 0) return "pano-tile--wide";
  return "";
}
