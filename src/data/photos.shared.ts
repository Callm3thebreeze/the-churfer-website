import type { ImageMetadata } from "astro";

export interface PhotoItem {
  id: number;
  title: string;
  alt: string;
  category: string;
  filterLabel: string;
  displayCategory: string;
  image?: ImageMetadata;
  src: string;
  width: number;
  height: number;
  aspect: string;
  relativePath: string;
}

export interface PhotoDimensions {
  width: number;
  height: number;
}

export interface PhotoCategory {
  id: string;
  label: string;
}

export function getPanoramaTileClass(
  photo: PhotoDimensions,
  index: number,
): string {
  const isPortrait = photo.height > photo.width * 1.12;

  if (index % 19 === 0) return "pano-tile--lg";
  if (isPortrait) return "pano-tile--tall";
  if (index % 7 === 0) return "pano-tile--wide";
  return "";
}