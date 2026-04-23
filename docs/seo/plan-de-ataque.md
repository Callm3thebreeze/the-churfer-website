# Plan de Ataque SEO

## Objetivo

Potenciar al maximo el SEO tecnico y la capacidad de citacion en motores generativos sin modificar los literales visibles actuales de la web durante la primera fase.

## Restricciones de esta fase

- No tocar titulos, parrafos, botones, labels ni otros textos visibles publicados.
- No aplicar nuevos titles, meta descriptions, alt text o textos de schema con carga editorial sin aprobacion previa.
- Priorizar cambios tecnicos invisibles o de bajo impacto visual.

## Diagnostico actual

1. La capa SEO global es minima: actualmente solo hay title y description basicos en el layout.
2. Existe duplicidad tecnica entre la home y la ruta de fotografia, que hoy sirven la misma intencion y el mismo contenido.
3. No hay robots.txt ni sitemap.xml generados desde el proyecto.
4. Falta una base reutilizable para canonical, Open Graph, Twitter Cards y schema.
5. La entidad local y profesional existe en el contenido, pero todavia no esta suficientemente estructurada para buscadores.

## Fases

### Fase 1. Base SEO invisible

Impacto: muy alto
Esfuerzo: bajo-medio
Estado: en curso

Acciones:

1. Crear utilidades SEO reutilizables para URL canonica, OG y schema.
2. Ampliar el layout base con canonical, robots meta, Open Graph, Twitter Cards y JSON-LD sin alterar la interfaz.
3. Añadir imagen social por defecto reutilizable.
4. Mantener todos los textos visibles intactos.

### Fase 2. Indexacion y consolidacion de URLs

Impacto: muy alto
Esfuerzo: bajo
Estado: pendiente

Acciones:

1. Resolver la duplicidad entre / y /fotografia sin tocar el contenido visible.
2. Marcar una unica URL canonica para la intencion de fotografia.
3. Evitar que rutas duplicadas contaminen el sitemap.

### Fase 3. Rastreo tecnico

Impacto: muy alto
Esfuerzo: bajo
Estado: en curso

Acciones:

1. Crear robots.txt.
2. Generar sitemap.xml desde rutas reales del proyecto.
3. Incluir la URL canonica del sitio y excluir duplicados tecnicos.

### Fase 4. Datos estructurados

Impacto: alto
Esfuerzo: medio
Estado: parcial

Acciones:

1. Añadir schema base reutilizable a nivel de WebSite y WebPage usando datos ya existentes.
2. Preparar schema especifico para video en las fichas de proyecto.
3. Dejar para aprobacion los textos editoriales que harian falta para enriquecer Person, Organization o ProfessionalService.

### Fase 5. Propuestas editoriales SEO

Impacto: muy alto
Esfuerzo: medio
Estado: pendiente de aprobacion

Acciones:

1. Preparar un documento con propuestas de titles, meta descriptions, alt text y textos de schema.
2. Revisar contigo las variantes por intencion: fotografo de surf, fotografo deportivo, videografo, editor de video, eventos, comercial y musica.
3. Aplicar solo los literales aprobados.

## Cambios tecnicos iniciados en esta iteracion

1. Refuerzo del layout SEO global.
2. Consolidacion tecnica de la ruta duplicada de fotografia.
3. Alta de robots.txt.
4. Generacion de sitemap.xml.

## Validacion prevista

1. Ejecutar build del proyecto.
2. Revisar el HTML generado para comprobar canonical, meta tags y JSON-LD.
3. Verificar que sitemap.xml y robots.txt aparecen en dist.

## Siguientes pasos tras esta fase

1. Validar en Google Search Console y Bing Webmaster Tools.
2. Revisar el documento de propuestas de literales.
3. Abrir una segunda fase centrada en paginas objetivo por servicio y localidad.