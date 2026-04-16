/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CLOUDINARY_CLOUD_NAME: string;
  readonly EMDASH_API_URL: string;
  readonly EMDASH_API_KEY: string;
  readonly EMDASH_SITE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
