import type { ImageMetadata } from "astro";
import type { PhotoCategory, PhotoItem } from "./photos.shared";
import { formatCategoryLabel, toCategoryId } from "../lib/category";
export type { PhotoCategory, PhotoDimensions, PhotoItem } from "./photos.shared";
export { getPanoramaTileClass } from "./photos.shared";

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
    const rootLabel = ROOT_LABELS[rootFolder] ?? formatCategoryLabel(rootFolder);
    const category = toCategoryId(rootFolder);
    const title = titleFromFilename(filename);

    return {
      title,
      alt: `Sergi Ortega - ${title}`,
      category,
      filterLabel: rootLabel,
      displayCategory: subfolder
        ? `${rootLabel} / ${formatCategoryLabel(subfolder)}`
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