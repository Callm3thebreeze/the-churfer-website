# Hotfix Media Cloudflare Images en EmDash

## Objetivo

Dejar documentada la incidencia donde el panel de EmDash mostraba solo 50 imagenes en el provider de Cloudflare Images, aunque en Cloudflare existieran mas.

## Contexto del proyecto

- Stack: Astro SSR con runtime Cloudflare.
- CMS: EmDash 0.6.0.
- Provider de media: Cloudflare Images.
- Sintoma principal: en admin de media se veian 50 items.

## Sintoma observable

- En /_emdash/admin/media, la pestana del provider mostraba 50 elementos.
- En Cloudflare habia mas imagenes disponibles.
- En este escenario no aparecia cursor util para paginar desde el cliente.

## Causa raiz confirmada

1. El flujo de carga del admin hacia provider salia con limite bajo.
2. En esta cuenta de Cloudflare Images, la API no devolvia continuation_token en ese flujo concreto, por lo que una UI basada solo en load more no resolvia el primer corte.
3. Vite podia servir un prebundle viejo aunque node_modules estuviera parcheado.

## Solucion aplicada

Se aplico una estrategia en dos capas para evitar quedarse en 50:

1. Capa admin EmDash
- Archivo afectado en patch: patches/@emdash-cms+admin+0.6.0.patch
- Cambio clave: limit efectivo minimo alto para cloudflare-images en fetchProviderMedia.

2. Capa provider Cloudflare
- Archivo afectado en patch: patches/@emdash-cms+cloudflare+0.6.0.patch
- Cambio clave: per_page efectivo minimo alto en list(), aunque el cliente pida un valor bajo.

3. Capa tooling local
- Limpieza de cache de Vite: borrar node_modules/.vite y reiniciar dev con --force.
- Motivo: garantizar que el navegador use el bundle regenerado con el fix.

## Por que hay archivos .patch

- Los archivos en patches/ guardan el diff contra el codigo original de node_modules.
- patch-package reaplica esos cambios tras npm install.
- Asi el hotfix no se pierde al reinstalar dependencias.

## Operativa de mantenimiento

## Cuando reinstales dependencias

1. Ejecutar npm install.
2. Verificar que postinstall aplica patch-package.
3. Si tocas un parche en node_modules, limpiar cache de Vite antes de validar UI.

## Cuando actualices EmDash

1. Revisar si el fix ya viene nativo en la version nueva.
2. Si ya viene nativo, retirar patches obsoletos.
3. Si no viene nativo, regenerar patches para la nueva version.

## Checklist rapido de validacion

- El admin media carga mas de 50 items en provider cloudflare-images.
- El bundle servido contiene la logica de limit/per_page efectivo.
- npm run check termina sin errores.

## Riesgos conocidos

- Cualquier update de version del paquete puede invalidar el patch.
- Si no se limpia cache de Vite tras tocar node_modules, la UI puede parecer sin cambios.

## Referencias

- patches/@emdash-cms+admin+0.6.0.patch
- patches/@emdash-cms+cloudflare+0.6.0.patch
- docs/emdash/guia-primeros-pasos-admin.md
- .agents/skills/emdash-troubleshooting/SKILL.md
