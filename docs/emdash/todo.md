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

- [ ] Si la instancia de EmDash aún no está configurada, completar el setup inicial para que se aplique automáticamente [.emdash/seed.json](.emdash/seed.json).
- [ ] Si EmDash ya está configurado en la D1 actual, replicar o sincronizar en el panel las colecciones definidas en [.emdash/seed.json](.emdash/seed.json):
  - `photos` con `title`, `image`, `alt`, `tags`
  - `videos` con `title`, `video_url`, `content`
- [ ] Crear la colección `photos` en EmDash.
- [ ] Definir al menos estos campos para la primera migración:
  - `title`
  - `image`
  - `alt`
  - `tags`
- [ ] Cargar un lote pequeño de fotos de prueba y confirmar que [src/lib/photo-gallery.ts](src/lib/photo-gallery.ts) empieza a devolver contenido desde EmDash en lugar del fallback local.
- [ ] Validar en el front que los filtros siguen funcionando en [src/components/PhotographyPage.astro](src/components/PhotographyPage.astro).
- [ ] Crear la colección `videos` en EmDash o verificar que ha sido sembrada desde la seed.
- [ ] Publicar una entrada de prueba con `title`, `video_url` y `content` y validar el render en [src/pages/video/index.astro](src/pages/video/index.astro) y [src/pages/video/[slug].astro](src/pages/video/[slug].astro).

## Limpieza posterior

- [ ] Revisar si conviene retirar código legado no usado tras la migración parcial de la galería.
- [ ] Documentar el flujo editorial final para subir y etiquetar fotos desde EmDash.

## Comprobación final

- [ ] Ejecutar `npm run check`.
- [ ] Ejecutar `npm run build`.
- [ ] Verificar `robots.txt`, `sitemap.xml` y `sitemap-static.xml` tras la configuración final.

## Documentacion y contribucion

- [x] Documentar la incidencia de media en Cloudflare Images y su hotfix en [docs/emdash/hotfix-media-cloudflare-images.md](docs/emdash/hotfix-media-cloudflare-images.md).
- [x] Preparar propuesta de PR para EmDash en [docs/emdash/propuesta-pr-emdash-media-pagination-cloudflare.md](docs/emdash/propuesta-pr-emdash-media-pagination-cloudflare.md).