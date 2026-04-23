export const SITE_NAME = "The Churfer";
export const DEFAULT_LOCALE = "es_ES";

export interface SeoSchema {
  [key: string]: unknown;
}

interface BaseSchemaInput {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
}

export function buildAbsoluteUrl(pathOrUrl: string, siteUrl: string): string {
  return new URL(pathOrUrl, siteUrl).toString();
}

export function buildDocumentTitle(title: string): string {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

export function buildBaseSchemas({
  title,
  description,
  canonicalUrl,
  imageUrl,
}: BaseSchemaInput): SeoSchema[] {
  const webSiteSchema: SeoSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: canonicalUrl === new URL(canonicalUrl).origin + "/" ? canonicalUrl : new URL("/", canonicalUrl).toString(),
    inLanguage: "es",
  };

  const webPageSchema: SeoSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: "es",
  };

  if (imageUrl) {
    webPageSchema.image = imageUrl;
  }

  return [webSiteSchema, webPageSchema];
}

interface VideoSchemaInput extends BaseSchemaInput {
  uploadDate: string;
  embedUrl: string;
}

export function buildVideoSchema({
  title,
  description,
  canonicalUrl,
  imageUrl,
  uploadDate,
  embedUrl,
}: VideoSchemaInput): SeoSchema {
  const schema: SeoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description,
    url: canonicalUrl,
    embedUrl,
    uploadDate,
    inLanguage: "es",
  };

  if (imageUrl) {
    schema.thumbnailUrl = [imageUrl];
  }

  return schema;
}