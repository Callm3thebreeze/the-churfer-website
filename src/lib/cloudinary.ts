/**
 * Utilidades para generar URLs optimizadas de Cloudinary.
 *
 * Uso: buildImageUrl('portfolio/foto1', { width: 800, height: 600, quality: 'auto' })
 */

const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
  quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  gravity?: 'auto' | 'face' | 'center';
}

function buildTransformString(options: CloudinaryTransformOptions): string {
  const parts: string[] = [];

  if (options.width) parts.push(`w_${options.width}`);
  if (options.height) parts.push(`h_${options.height}`);
  if (options.crop) parts.push(`c_${options.crop}`);
  if (options.quality) parts.push(`q_${options.quality}`);
  if (options.format) parts.push(`f_${options.format}`);
  if (options.gravity) parts.push(`g_${options.gravity}`);

  return parts.join(',');
}

/**
 * Genera una URL de imagen optimizada de Cloudinary.
 * @param publicId - ID público de la imagen en Cloudinary (ej: "portfolio/foto1")
 * @param options - Opciones de transformación
 */
export function buildImageUrl(
  publicId: string,
  options: CloudinaryTransformOptions = {},
): string {
  const defaults: CloudinaryTransformOptions = {
    quality: 'auto',
    format: 'auto',
  };

  const merged = { ...defaults, ...options };
  const transforms = buildTransformString(merged);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`;
}

/**
 * Genera un set de srcset para imágenes responsivas.
 */
export function buildSrcSet(
  publicId: string,
  widths: number[] = [400, 800, 1200, 1600],
  options: Omit<CloudinaryTransformOptions, 'width'> = {},
): string {
  return widths
    .map((w) => `${buildImageUrl(publicId, { ...options, width: w })} ${w}w`)
    .join(', ');
}
