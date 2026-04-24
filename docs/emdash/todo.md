# To-Do EmDash + Cloudflare Images

## Prioridad alta

- [ ] Sustituir los placeholders de [wrangler.jsonc](wrangler.jsonc) con IDs reales:
  - `REPLACE_WITH_D1_DATABASE_ID`
  - `REPLACE_WITH_SESSION_KV_NAMESPACE_ID`
- [ ] Confirmar que el bucket R2 `the-churfer-media` existe y está enlazado al binding `MEDIA`.
- [ ] Crear o verificar en Cloudflare Images:
  - `CF_ACCOUNT_ID`
  - `CF_IMAGES_ACCOUNT_HASH`
  - `CF_IMAGES_TOKEN`
- [ ] Crear el archivo local `.dev.vars` a partir de [.dev.vars.example](.dev.vars.example) con:
  - `EMDASH_AUTH_SECRET`
  - `EMDASH_PREVIEW_SECRET`
  - `CF_ACCOUNT_ID`
  - `CF_IMAGES_ACCOUNT_HASH`
  - `CF_IMAGES_TOKEN`
- [ ] Replicar esas mismas variables como secretos/variables en Cloudflare para el entorno remoto.

## Validación de infraestructura

- [ ] Ejecutar `npx wrangler d1 create the-churfer-emdash` si la base aún no existe.
- [ ] Ejecutar `npx wrangler kv namespace create SESSION` si el namespace KV aún no existe.
- [ ] Verificar que la app arranca con `npm run dev` sin errores de bindings o variables.
- [ ] Comprobar que el panel de EmDash responde en `/_emdash/admin`.
- [ ] Comprobar que la API de EmDash responde en `/_emdash/api`.

## Cloudflare Images

- [ ] Confirmar que el provider activo en [astro.config.mjs](astro.config.mjs) sigue siendo `cloudflareImages({ defaultVariant: "public" })`.
- [ ] Crear o revisar la variant `public` en Cloudflare Images para que coincida con la configuración actual.
- [ ] Subir una imagen de prueba desde el admin de EmDash y validar:
  - que aparece en la librería de medios
  - que resuelve una URL de `imagedelivery.net`
  - que no falla el borrado desde el admin

## Integración con contenido

- [ ] Crear la colección `photos` en EmDash.
- [ ] Definir al menos estos campos para la primera migración:
  - `title`
  - `image`
  - `alt`
  - `category`
  - `filterLabel`
  - `displayCategory`
  - `width`
  - `height`
- [ ] Cargar un lote pequeño de fotos de prueba y confirmar que [src/lib/photo-gallery.ts](src/lib/photo-gallery.ts) empieza a devolver contenido desde EmDash en lugar del fallback local.
- [ ] Validar en el front que los filtros siguen funcionando en [src/components/PhotographyPage.astro](src/components/PhotographyPage.astro).

## Limpieza posterior

- [ ] Revisar si todavía hace falta mantener compatibilidad con Cloudinary en [astro.config.mjs](astro.config.mjs).
- [ ] Revisar si conviene retirar código legado no usado tras la migración parcial de la galería.
- [ ] Documentar el flujo editorial final para subir y etiquetar fotos desde EmDash.

## Comprobación final

- [ ] Ejecutar `npm run check`.
- [ ] Ejecutar `npm run build`.
- [ ] Verificar `robots.txt`, `sitemap.xml` y `sitemap-static.xml` tras la configuración final.