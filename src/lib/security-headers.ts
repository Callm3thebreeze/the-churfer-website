const YOUTUBE_IFRAME_ORIGINS = [
  "https://www.youtube-nocookie.com",
  "https://www.youtube.com",
];

const GOOGLE_FONTS_STYLE_ORIGIN = "https://fonts.googleapis.com";
const GOOGLE_FONTS_FONT_ORIGIN = "https://fonts.gstatic.com";

function compactDirectives(directives: Array<string | false | null | undefined>): string {
  return directives.filter(Boolean).join("; ");
}

export function buildContentSecurityPolicy(): string {
  return compactDirectives([
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline'",
    `style-src 'self' 'unsafe-inline' ${GOOGLE_FONTS_STYLE_ORIGIN}`,
    `font-src 'self' data: ${GOOGLE_FONTS_FONT_ORIGIN}`,
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    `frame-src 'self' ${YOUTUBE_IFRAME_ORIGINS.join(" ")}`,
    "media-src 'self' blob: https:",
    "worker-src 'self' blob:",
  ]);
}

export function getBaseSecurityHeaders(url: URL): Record<string, string> {
  return {
    "Content-Security-Policy": buildContentSecurityPolicy(),
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    ...(url.protocol === "https:"
      ? { "Strict-Transport-Security": "max-age=15552000" }
      : {}),
  };
}
