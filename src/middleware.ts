import type { MiddlewareHandler } from "astro";
import { getBaseSecurityHeaders } from "./lib/security-headers";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  const headers = getBaseSecurityHeaders(context.url);

  for (const [name, value] of Object.entries(headers)) {
    if (!response.headers.has(name)) {
      response.headers.set(name, value);
    }
  }

  return response;
};
