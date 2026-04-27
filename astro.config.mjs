// @ts-check
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";
import { cloudflareImages, d1, r2 } from "@emdash-cms/cloudflare";
import emdash from "emdash/astro";

const emdashSsrOptimizeDepsInclude = [
  "emdash/runtime",
  "emdash/middleware",
  "emdash/middleware/setup",
  "emdash/middleware/auth",
  "emdash/middleware/redirect",
  "emdash/middleware/request-context",
  "emdash/media/local-runtime",
  "astro/zod",
  "@emdash-cms/cloudflare/db/d1",
  "@emdash-cms/cloudflare/media/images-runtime",
  "@emdash-cms/cloudflare/storage/r2",
];

// https://astro.build/config
export default defineConfig({
  site: "https://thechurfer.com",
  output: "server",
  adapter: cloudflare(),
  vite: {
    ssr: {
      optimizeDeps: {
        noDiscovery: true,
        include: emdashSsrOptimizeDepsInclude,
      },
    },
  },
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB" }),
      storage: r2({ binding: "MEDIA" }),
      mediaProviders: [
        /** @type {import("emdash/media").MediaProviderDescriptor<Record<string, unknown>>} */ (
          cloudflareImages({
            defaultVariant: "public",
          })
        ),
      ],
    }),
  ],
  image: {
    domains: ["res.cloudinary.com", "imagedelivery.net"],
  },
});
