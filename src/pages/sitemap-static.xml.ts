import { getVideoLibrary } from "../lib/videos";

export const prerender = false;

const siteUrl = import.meta.env.SITE ?? "https://thechurfer.com";

function toAbsoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const { videos } = await getVideoLibrary();
  const pages = ["/", "/video", "/sobre-mi", "/contacto"];
  const entries: Array<{ loc: string; lastmod?: string }> = [
    ...pages.map((path) => ({ loc: toAbsoluteUrl(path) })),
    ...videos.map((video) => ({
      loc: toAbsoluteUrl(`/video/${video.slug}`),
      lastmod: video.date || undefined,
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ""}\n  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}