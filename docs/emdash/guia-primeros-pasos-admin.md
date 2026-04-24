# Guia Rapida del Admin Panel de EmDash

Esta guia resume las opciones principales del admin de EmDash que tienes instalado en este proyecto, para orientarte rapido sin tener que explorar a ciegas.

Esta basada en la version real integrada en el repo y en las rutas del panel, no en una descripcion generica.

## 1. Antes de entrar

URL del panel:

- http://localhost:4322/_emdash/admin

Notas importantes para este proyecto:

- usa localhost y no 127.0.0.1 si vas a configurar passkeys
- algunas secciones solo aparecen si el setup inicial esta completado
- otras solo aparecen si EmDash detecta colecciones, taxonomias, plugins o themes disponibles

## 2. Mapa mental del panel

Piensa el admin en 5 bloques:

1. contenido
2. estructura del contenido
3. media
4. operativa del sitio
5. administracion y seguridad

Si entiendes esos 5 bloques, el resto del panel deja de parecer opaco.

## 3. Lo primero que suele aparecer

### Setup

Ruta:

- /_emdash/admin/setup

Sirve para completar la puesta en marcha inicial del CMS. En tu caso ha sido especialmente relevante por:

- definicion basica del sitio
- creacion del usuario admin
- configuracion de passkey

Que tocar aqui:

- el email del admin puede cambiarse mas adelante
- la passkey conviene crearla solo entrando por localhost

## 4. Secciones principales del admin

## Dashboard

Ruta base:

- /_emdash/admin/

Que es:

- la portada del panel
- sirve como punto de entrada y resumen de actividad

Que puedes esperar ver:

- bienvenida
- accesos rapidos
- widgets del sistema o de plugins
- actividad reciente

Para que sirve de verdad:

- entrar rapido a contenido, media o ajustes
- detectar si hay contenido, comentarios o integraciones pendientes

## Content

Rutas reales:

- /_emdash/admin/content/[collection]
- /_emdash/admin/content/[collection]/new
- /_emdash/admin/content/[collection]/[id]

Que es:

- la zona donde se crean, editan, publican y archivan entries de una coleccion

Que puedes hacer aqui:

- listar entradas por coleccion
- crear un item nuevo
- guardar borradores
- publicar o despublicar
- programar publicacion si la coleccion lo soporta
- mover a papelera o borrar
- revisar revisiones si esa capacidad esta activa
- previsualizar contenido

Que debes entender:

- no existe contenido sin coleccion
- si aun no has creado la coleccion photos, esta parte tendra poco valor practico en este proyecto

En este proyecto, esta sera la seccion clave cuando migremos la galeria a EmDash.

## Content Types

Rutas reales:

- /_emdash/admin/content-types
- /_emdash/admin/content-types/new
- /_emdash/admin/content-types/[slug]

Que es:

- el modelador del CMS
- aqui defines la estructura de cada tipo de contenido

Que puedes hacer:

- crear una nueva coleccion
- editar label y slug
- anadir campos
- configurar tipo de campo
- marcar campos requeridos
- activar opciones como busqueda full-text si procede
- reordenar campos
- borrar campos o colecciones completas

Cuando tocarlo:

- antes de cargar contenido real
- cuando necesites cambiar el schema de una coleccion

Para este proyecto, el primer uso claro es crear la coleccion photos con sus campos editoriales.

## Media Library

Ruta real:

- /_emdash/admin/media

Que es:

- la biblioteca de medios del CMS

Que puedes hacer:

- subir imagenes, videos o documentos
- buscar media
- cambiar vista grid o list
- revisar detalles del archivo
- usar media desde el editor de contenido
- borrar media si el provider lo permite

En este proyecto:

- EmDash esta conectado a Cloudflare Images
- esta seccion sera la puerta de entrada para probar el flujo editorial de imagenes

Que revisar siempre:

- alt text
- provider activo
- que la URL servida resuelva correctamente

## Menus

Rutas reales:

- /_emdash/admin/menus
- /_emdash/admin/menus/[name]

Que es:

- el gestor de navegacion del sitio

Que puedes hacer:

- crear menus como primary o footer
- anadir enlaces internos o externos
- ordenar items
- definir destino y comportamiento del enlace

Cuando te importa:

- cuando quieras que la navegacion del front sea editable desde CMS

## Sections

Rutas reales:

- /_emdash/admin/sections
- /_emdash/admin/sections/[slug]

Que es:

- biblioteca de secciones o bloques reutilizables

Que puedes hacer:

- crear secciones reutilizables
- insertarlas luego en contenido o paginas que usen ese sistema
- duplicar o editar secciones propias

Matiz importante:

- algunas secciones pueden venir del theme y no ser borrables directamente

## Taxonomies

Ruta real:

- /_emdash/admin/taxonomies/[taxonomy]

Que es:

- clasificaciones compartidas para el contenido, como categorias o tags

Que puedes hacer:

- crear taxonomias
- crear terminos
- asignarlas a determinadas colecciones

Cuando toca usarlo:

- si quieres reutilizar categorias o etiquetas entre multiples items sin hardcodearlas

Para este proyecto puede ser util si acabas sacando categorias fotograficas de campos sueltos y las conviertes en una taxonomia real.

## Users

Ruta real:

- /_emdash/admin/users

Que es:

- gestion de usuarios del panel

Que puedes hacer:

- invitar usuarios
- asignar roles
- revisar ultimo acceso
- cambiar datos de cuenta
- gestionar detalles del usuario

Utilidad real:

- preparar el traspaso al cliente
- separar permisos de admin, editor o contributor

Importante:

- el email del usuario admin no esta congelado; puede cambiarse despues si hace falta

## Comments

Ruta real:

- /_emdash/admin/comments

Que es:

- bandeja de moderacion de comentarios

Que puedes hacer:

- revisar pendientes
- aprobar
- marcar como spam
- borrar

Matiz:

- solo tendra sentido si el proyecto activa comentarios o algun plugin que los use

## Redirects

Ruta real:

- /_emdash/admin/redirects

Que es:

- gestor de redirecciones y errores 404

Que puedes hacer:

- crear reglas de redireccion
- definir source y destination
- elegir codigo 301, 302, 307 o 308 segun el caso
- detectar loops de redireccion
- revisar rutas que estan fallando

Cuando te interesa:

- migraciones de URLs
- cambios de slugs
- limpieza SEO tras reorganizar contenido

## Bylines

Ruta real:

- /_emdash/admin/bylines

Que es:

- gestion de firmas o autores editoriales separadas del usuario tecnico

Que puedes hacer:

- crear perfiles de autor
- asignarlos a contenido

Solo te importa si quieres separar la autoria visible del usuario que edita.

## Widgets

Ruta real:

- /_emdash/admin/widgets

Que es:

- una superficie para widgets del dashboard o extensiones del admin

En la practica:

- depende mucho de plugins o funcionalidades activas
- si no hay plugins, puede ser una zona secundaria

## Plugins

Rutas reales:

- /_emdash/admin/plugins-manager
- /_emdash/admin/plugins/marketplace
- /_emdash/admin/plugins/marketplace/[pluginId]
- /_emdash/admin/plugins/[pluginId]/

Que es:

- la capa de extensibilidad del panel

Que puedes hacer:

- ver plugins instalados
- habilitar o deshabilitar plugins
- revisar permisos solicitados
- abrir paginas admin aportadas por plugins
- explorar marketplace si esta habilitado

Muy importante:

- no todo lo que aparece aqui existe en tu proyecto hoy
- depende de plugins declarados en la integracion de EmDash

## Themes

Rutas reales detectadas:

- /_emdash/admin/themes/marketplace
- /_emdash/admin/themes/marketplace/[themeId]

Que es:

- capa de temas o plantillas si el marketplace de themes esta activo

En este proyecto:

- no es la prioridad ahora mismo
- el foco real sigue siendo contenido, media y schema

## Import from WordPress

Ruta real:

- /_emdash/admin/import/wordpress

Que es:

- asistente de importacion desde WordPress

Que puede hacer:

- conectar con WordPress
- analizar sitio o export
- importar contenido
- importar media
- importar menus
- importar SEO segun disponibilidad
- mapear autores

Cuando sirve:

- migraciones desde WordPress
- no es una necesidad inmediata para este portfolio, pero existe en el panel

## 5. Ajustes: que significa cada subseccion

## General Settings

Ruta real:

- /_emdash/admin/settings/general

Sirve para:

- identidad general del sitio
- site title
- tagline
- site URL
- logo y favicon
- locale, idioma, formato de fecha o zona horaria segun configuracion

Para este proyecto, aqui importa especialmente:

- fijar bien la URL publica final del sitio
- revisar identidad basica y metadatos globales

## Social

Ruta real:

- /_emdash/admin/settings/social

Sirve para:

- guardar perfiles sociales del sitio o marca
- exponer esos datos al theme

Uso tipico:

- Instagram, YouTube, LinkedIn, GitHub, Facebook, X

## SEO

Ruta real:

- /_emdash/admin/settings/seo

Sirve para:

- ajustes globales de SEO
- title separator
- homepage SEO
- verificacion para buscadores
- OG image global
- noindex u otros metadatos segun la UI activa

Importancia:

- util para la capa global del sitio
- no sustituye el SEO especifico de cada entry si la coleccion tambien lo soporta

## Security

Ruta real:

- /_emdash/admin/settings/security

Sirve para:

- gestionar passkeys
- revisar configuracion de autenticacion
- ver opciones ligadas a seguridad del acceso

Matiz clave:

- si el auth mode es externo, por ejemplo Cloudflare Access, algunas opciones de passkeys pueden desaparecer o quedar bloqueadas

## Allowed Domains o Self-Signup Domains

Ruta real:

- /_emdash/admin/settings/allowed-domains

Sirve para:

- permitir auto-registro por dominio de email
- asignar rol por defecto a nuevos usuarios de esos dominios

Cuando usarlo:

- si quieres que miembros de una organizacion entren sin invitacion manual

## API Tokens

Ruta real:

- /_emdash/admin/settings/api-tokens

Sirve para:

- crear tokens de acceso para CLI o integraciones
- definir scopes y expiracion

Uso real:

- automatizaciones
- integraciones de despliegue o sincronizacion
- scripts internos

## Email Settings

Ruta real:

- /_emdash/admin/settings/email

Sirve para:

- configurar o validar el pipeline de email
- probar envio de emails

Importante:

- si no hay provider de email configurado, invitaciones o magic links pueden requerir compartir enlaces manualmente

## 6. Que partes veras mas en este proyecto

Si el objetivo es usar EmDash para gestionar la galeria y preparar el handoff al cliente, las pantallas que de verdad importan primero son estas:

1. Content Types
2. Media Library
3. Content
4. Users
5. General Settings
6. SEO Settings

Todo lo demas es secundario hasta que el contenido este modelado y el flujo editorial funcione.

## 7. Recorrido recomendado de 15 minutos

Si quieres entender el panel rapido, entra en este orden:

1. Dashboard: para ver el mapa general
2. Settings > General: para ubicar identidad, URL y configuracion basica
3. Content Types: para entender como modela EmDash el contenido
4. Media Library: para ver el flujo de subida y gestion de archivos
5. Content: para comprobar como se edita una coleccion real
6. Users: para entender roles e invitaciones
7. Settings > Security: para revisar passkeys y acceso

## 8. Traduccion practica de cada area

- Dashboard: que esta pasando
- Content: editar contenido
- Content Types: definir estructura
- Media: gestionar archivos
- Menus: controlar navegacion
- Sections: reutilizar bloques
- Taxonomies: clasificar contenido
- Users: gestionar equipo
- Redirects: corregir URLs
- Settings: configurar el sitio y la seguridad
- Plugins/Themes/Marketplace: extender el CMS
- Import: migrar desde WordPress

## 9. Donde no perder tiempo al principio

En este proyecto, al principio no merece la pena profundizar demasiado en:

- marketplace
- themes
- importacion WordPress
- comments
- widgets

No porque no existan, sino porque no son el cuello de botella actual.

## 10. Siguiente paso recomendado en este repo

Si quieres usar esta guia con valor practico inmediato, el siguiente paso natural es:

1. entrar en Content Types
2. crear la coleccion photos
3. definir los campos editoriales minimos
4. subir media de prueba
5. crear 2 o 3 items reales
6. validar que el front deja de depender del fallback local