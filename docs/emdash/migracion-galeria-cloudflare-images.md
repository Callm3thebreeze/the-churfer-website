# Migracion de la galeria a Cloudflare Images

Este flujo evita que Astro copie las fotos locales al build y permite servir la galeria desde `imagedelivery.net`.

## Requisitos

- Tener activado Cloudflare Images con una variant publica llamada `public`.
- Crear `.env` en la raiz a partir de `.env.example`.
- Rellenar estas variables:
  - `CF_ACCOUNT_ID`
  - `CF_IMAGES_ACCOUNT_HASH`
  - `CF_IMAGES_TOKEN`

## Que hace el script

- Recorre `src/assets/images`.
- Recomprimi las imagenes que superan el limite de 10 MiB de Cloudflare Images.
- Sube cada foto a Cloudflare Images con un ID estable derivado de la ruta relativa.
- Genera `src/data/photos.remote.ts` con URLs de `imagedelivery.net`.
- Cambia `src/data/photos.ts` para que la galeria use la fuente remota.
- Si se ejecuta con `--delete-local`, elimina los archivos locales despues de una migracion correcta.

## Comandos

Subir y activar la fuente remota:

```bash
npm run photos:migrate:cloudflare
```

Subir, activar la fuente remota y borrar las fotos locales:

```bash
npm run photos:migrate:cloudflare -- --delete-local
```

Volver temporalmente a la fuente local:

```bash
npm run photos:restore:local
```

## Notas

- En este repo habia al menos 45 imagenes por encima de 10 MiB, asi que la recompresion automatica no es opcional para una migracion completa a Cloudflare Images.
- Mientras `src/data/photos.ts` apunte a `photos.local.ts`, Astro seguira empaquetando las fotos del repositorio en el build.
- Cuando `src/data/photos.ts` pase a `photos.remote.ts`, el frontend seguira funcionando porque la galeria ya soporta fotos remotas por URL.