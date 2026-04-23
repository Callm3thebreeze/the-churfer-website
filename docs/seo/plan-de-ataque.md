# Plan de Ataque SEO

## Objetivo

Potenciar al maximo el SEO tecnico y la capacidad de citacion en motores generativos sin modificar los literales visibles actuales de la web durante la primera fase.

## Restricciones de esta fase

- No tocar titulos, parrafos, botones, labels ni otros textos visibles publicados.
- No aplicar nuevos titles, meta descriptions, alt text o textos de schema con carga editorial sin aprobacion previa.
- Priorizar cambios tecnicos invisibles o de bajo impacto visual.

## Diagnostico inicial

1. La capa SEO global era minima: solo habia title y description basicos en el layout.
2. Existia duplicidad tecnica entre la home y la ruta de fotografia, que servian la misma intencion y el mismo contenido.
3. No habia robots.txt ni sitemap.xml generados desde el proyecto.
4. Faltaba una base reutilizable para canonical, Open Graph, Twitter Cards y schema.
5. La entidad local y profesional sigue presente en el contenido, pero todavia no esta suficientemente estructurada para buscadores.

## Estado actual tras la primera implementacion

1. La capa SEO global ya esta desplegada en el layout base con canonical, robots, Open Graph, Twitter Cards y JSON-LD.
2. La duplicidad entre / y /fotografia ya esta contenida a nivel tecnico mediante canonical a la home y noindex en la ruta duplicada.
3. robots.txt y sitemap.xml ya existen y se generan correctamente dentro del proyecto.
4. Las fichas de video ya incorporan datos estructurados especificos de tipo VideoObject.
5. La propuesta editorial separada ya existe, pero sigue pendiente de aprobacion antes de tocar literales visibles o literales SEO con carga comercial.

## Fases

### Fase 1. Base SEO invisible

Impacto: muy alto
Esfuerzo: bajo-medio
Estado: completada

Acciones:

1. Crear utilidades SEO reutilizables para URL canonica, OG y schema.
2. Ampliar el layout base con canonical, robots meta, Open Graph, Twitter Cards y JSON-LD sin alterar la interfaz.
3. Añadir imagen social por defecto reutilizable.
4. Mantener todos los textos visibles intactos.

Resultado:

1. La base SEO ya esta centralizada y operativa en el layout global.
2. La interfaz visible no se ha modificado en esta fase.

### Fase 2. Indexacion y consolidacion de URLs

Impacto: muy alto
Esfuerzo: bajo
Estado: completada en su bloque inicial

Acciones:

1. Resolver la duplicidad entre / y /fotografia sin tocar el contenido visible.
2. Marcar una unica URL canonica para la intencion de fotografia.
3. Evitar que rutas duplicadas contaminen el sitemap.

Resultado:

1. /fotografia apunta canonicamente a /.
2. /fotografia queda fuera de la estrategia de indexacion principal mediante noindex.
3. El sitemap prioriza la URL principal y no incluye la ruta duplicada.

### Fase 3. Rastreo tecnico

Impacto: muy alto
Esfuerzo: bajo
Estado: completada

Acciones:

1. Crear robots.txt.
2. Generar sitemap.xml desde rutas reales del proyecto.
3. Incluir la URL canonica del sitio y excluir duplicados tecnicos.

Resultado:

1. robots.txt ya esta publicado dentro del proyecto.
2. sitemap.xml ya se genera desde rutas reales y videos dinamicos.

### Fase 4. Datos estructurados

Impacto: alto
Esfuerzo: medio
Estado: parcial

Acciones:

1. Añadir schema base reutilizable a nivel de WebSite y WebPage usando datos ya existentes.
2. Preparar schema especifico para video en las fichas de proyecto.
3. Dejar para aprobacion los textos editoriales que harian falta para enriquecer Person, Organization o ProfessionalService.

Resultado:

1. WebSite y WebPage ya estan implementados a nivel base.
2. VideoObject ya esta implementado en las fichas de video.
3. Sigue pendiente la capa de entidad profesional enriquecida.

### Fase 5. Propuestas editoriales SEO

Impacto: muy alto
Esfuerzo: medio
Estado: preparada y pendiente de aprobacion

Acciones:

1. Preparar un documento con propuestas de titles, meta descriptions, alt text y textos de schema.
2. Revisar contigo las variantes por intencion: fotografo de surf, fotografo deportivo, videografo, editor de video, eventos, comercial y musica.
3. Aplicar solo los literales aprobados.

Resultado:

1. El documento de propuesta ya esta creado.
2. Ningun literal visible ni literal SEO editorial se ha aplicado aun.

## Cambios tecnicos completados en esta iteracion

1. Refuerzo del layout SEO global con canonical, robots meta, Open Graph, Twitter Cards y JSON-LD.
2. Consolidacion tecnica de la ruta duplicada de fotografia con canonical a la home y noindex.
3. Alta de robots.txt con referencia a sitemap y permisos explicitos para bots relevantes.
4. Generacion de sitemap.xml con paginas clave y fichas de video.
5. Implementacion de schema base y schema de video.

## Validacion realizada

1. Se ejecuto el build del proyecto correctamente.
2. Se reviso el HTML generado para comprobar canonical, meta tags, robots y JSON-LD.
3. Se verifico la presencia de sitemap.xml y robots.txt en la salida generada.

## Siguientes pasos tras esta fase

1. Validar en Google Search Console y Bing Webmaster Tools.
2. Revisar y aprobar el documento de propuestas de literales.
3. Abrir una segunda fase centrada en schema de entidad profesional, servicios y cobertura geografica.
4. Diseñar paginas objetivo por servicio y localidad una vez quede aprobada la capa editorial.