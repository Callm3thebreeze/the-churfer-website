/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CLOUDINARY_CLOUD_NAME: string;
  readonly CF_ACCOUNT_ID: string;
  readonly CF_IMAGES_ACCOUNT_HASH: string;
  readonly CF_IMAGES_TOKEN: string;
  readonly EMDASH_AUTH_SECRET: string;
  readonly EMDASH_PREVIEW_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
