/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CF_ACCOUNT_ID: string;
  readonly CF_IMAGES_ACCOUNT_HASH: string;
  readonly CF_IMAGES_TOKEN: string;
  readonly RESEND_API_KEY: string;
  readonly CONTACT_FORM_TO_EMAIL: string;
  readonly CONTACT_FORM_FROM_EMAIL: string;
  readonly EMDASH_AUTH_SECRET: string;
  readonly EMDASH_PREVIEW_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "cloudflare:workers" {
  export const env: {
    RESEND_API_KEY?: string;
    CONTACT_FORM_TO_EMAIL?: string;
    CONTACT_FORM_FROM_EMAIL?: string;
    [key: string]: string | undefined;
  };
}
