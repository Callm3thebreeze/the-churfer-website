# Propuesta de PR a EmDash

## Titulo sugerido

fix(admin+cloudflare): evitar truncado en 50 items al listar media provider de Cloudflare Images

## Resumen

En entornos con Cloudflare Images, el panel de media puede quedarse en 50 resultados iniciales en la pestana del provider. En algunos casos la API no devuelve continuation_token util para seguir paginando en cliente con el flujo actual. Esto produce una experiencia editorial incompleta.

La propuesta introduce un limite efectivo mayor para Cloudflare Images en la carga del provider y mantiene compatibilidad con el comportamiento actual del resto de providers.

## Problema

- Comportamiento actual:
  - La vista de media provider muestra una primera tanda de 50.
  - Dependencia fuerte de nextCursor para seguir cargando.
  - Si no llega continuation_token, el usuario no accede al resto del catalogo.

- Comportamiento esperado:
  - Primera carga suficiente para escenarios reales de catalogo mediano.
  - No quedarse bloqueado en 50 cuando la API no devuelve cursor.

## Evidencia funcional

En un caso real de produccion:

- per_page=50 -> 50 items
- per_page=100 -> 100 items
- per_page=500 -> total esperado (sin continuation_token)

Esto indica que el bloqueo en 50 no era un limite duro del servicio, sino del flujo de consumo.

## Cambio propuesto

## 1) Admin client

En la funcion de fetch de media provider:

- aplicar effectiveLimit para cloudflare-images con minimo alto (por ejemplo 500)
- mantener comportamiento actual para providers distintos

Pseudo logica:

- si providerId es cloudflare-images
  - effectiveLimit = max(limitSolicitado, 500)
- si no
  - effectiveLimit = limitSolicitado

## 2) Provider runtime cloudflare

En list():

- aplicar effectivePerPage para cloudflare-images con minimo alto (por ejemplo 500)
- objetivo: blindar backend incluso si el cliente envia limit bajo

## 3) Opcional UX

- Mantener soporte de load more cuando exista nextCursor.
- No depender de load more para salir del primer corte de 50 en cloudflare-images.

## Compatibilidad

- Impacto limitado al provider cloudflare-images.
- Sin cambios de contrato para otros providers.
- Sin cambios de schema ni migraciones de datos.

## Plan de pruebas

## Manual

1. Configurar EmDash con provider cloudflare-images.
2. Tener mas de 50 imagenes en la cuenta.
3. Abrir /_emdash/admin/media y seleccionar provider.
4. Confirmar que la primera carga supera 50 cuando exista inventario.
5. Confirmar que no hay regresion en busqueda y filtros por mimeType.

## Tecnica

- Test de funcion de construccion de query para cloudflare-images.
- Test de regresion para otros providers.

## Criterios de aceptacion

- No se bloquea en 50 items en la primera carga para cloudflare-images cuando hay mas inventario.
- El flujo sigue funcionando con y sin cursor.
- No hay regresiones en providers no cloudflare.

## Riesgos y mitigacion

- Riesgo: payload mayor en primera carga.
- Mitigacion: limite efectivo razonable (500) y posibilidad de ajuste configurable si el equipo lo considera.

## Borrador de descripcion del PR

Este PR corrige un caso donde Media Library podia quedarse en 50 items para Cloudflare Images. En algunos escenarios la API no devuelve continuation_token util y la paginacion cliente no puede continuar. Se aplica un limite efectivo mayor para la primera carga de cloudflare-images y se mantiene el comportamiento existente para el resto de providers. El cambio mejora la experiencia editorial sin romper contratos actuales.

## Checklist de contribuidor

- [ ] Confirmar en rama limpia del repo oficial de EmDash
- [ ] Implementar cambios en codigo fuente (no en dist)
- [ ] Ejecutar test y lint del repo
- [ ] Adjuntar evidencia antes/despues en PR
- [ ] Abrir issue vinculado si el equipo prefiere discutir antes del merge
