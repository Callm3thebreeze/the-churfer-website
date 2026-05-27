# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Contact Form Email

El formulario de [src/pages/contacto.astro](src/pages/contacto.astro) publica a [src/pages/api/contact.ts](src/pages/api/contact.ts) y el envio real se hace desde servidor con Resend.

Variables necesarias:

- `RESEND_API_KEY`: API key de Resend.
- `CONTACT_FORM_TO_EMAIL`: bandeja que recibira los mensajes.
- `CONTACT_FORM_FROM_EMAIL`: remitente verificado en Resend, por ejemplo `contacto@thechurfer.com`.

Configuracion en Cloudflare:

```sh
wrangler secret put RESEND_API_KEY
wrangler secret put CONTACT_FORM_TO_EMAIL
wrangler secret put CONTACT_FORM_FROM_EMAIL
```

Para desarrollo local, crea un fichero `.dev.vars` en la raiz con esas tres variables.

Notas:

- `CONTACT_FORM_FROM_EMAIL` debe pertenecer a un dominio verificado en Resend.
- El endpoint aplica validacion same-origin, sanea el contenido enviado al email y usa un honeypot basico contra bots.

## Cloudflare Secrets

No guardes secretos en [wrangler.jsonc](wrangler.jsonc). Ese archivo debe contener solo configuracion versionable de infraestructura, como bindings, rutas y nombres de recursos.

Variables sensibles que deben cargarse como secretos remotos con Wrangler o mantenerse solo en ficheros locales ignorados por Git:

- `CF_ACCOUNT_ID`
- `CF_IMAGES_ACCOUNT_HASH`
- `CF_IMAGES_TOKEN`
- `RESEND_API_KEY`
- `CONTACT_FORM_TO_EMAIL`
- `CONTACT_FORM_FROM_EMAIL`
- `EMDASH_AUTH_SECRET`
- `EMDASH_PREVIEW_SECRET`

Carga de secretos remotos:

```sh
wrangler secret put CF_ACCOUNT_ID
wrangler secret put CF_IMAGES_ACCOUNT_HASH
wrangler secret put CF_IMAGES_TOKEN
wrangler secret put RESEND_API_KEY
wrangler secret put CONTACT_FORM_TO_EMAIL
wrangler secret put CONTACT_FORM_FROM_EMAIL
wrangler secret put EMDASH_AUTH_SECRET
wrangler secret put EMDASH_PREVIEW_SECRET
```

Comprobacion remota:

```sh
wrangler secret list --config wrangler.jsonc
```

Rotacion recomendada:

- Si algun token o API key estuvo en [wrangler.jsonc](wrangler.jsonc) o se subio al historial de Git, rotalo antes del siguiente deploy.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
