// @ts-check
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";
import { cloudflareImages, d1, r2 } from "@emdash-cms/cloudflare";
import emdash from "emdash/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://thechurfer.com",
  output: "server",
  adapter: cloudflare(),
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
