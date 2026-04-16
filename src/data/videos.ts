/**
 * Datos de ejemplo de vídeos.
 * Reemplazar por fetch a Emdash cuando esté configurado.
 */

export interface Video {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  category: "surf" | "commercial" | "musicvideo" | "event";
  youtubeId: string;
  date: string;
}

export const videoCategories = [
  { id: "all", label: "Todo" },
  { id: "surf", label: "Surf & Deporte" },
  { id: "commercial", label: "Comercial" },
  { id: "musicvideo", label: "Videoclips" },
  { id: "event", label: "Eventos" },
] as const;

export const videos: Video[] = [
  {
    id: 1,
    slug: "dawn-patrol-el-palmar",
    title: "Dawn Patrol — El Palmar",
    description:
      "Las primeras luces sobre un swell de noroeste en El Palmar. Sesión épica con el lineup vacío.",
    body: `Hay algo mágico en ser el primero en llegar al agua cuando todavía no ha salido el sol. Esta sesión de invierno en El Palmar fue una de esas mañanas que no se olvidan.

El swell de noroeste había entrado durante la noche y las previsiones apuntaban a un pico consistente al amanecer. Salí de casa con el neopreno ya puesto y la cámara protegida en la carcasa estanca. Vivir aquí tiene esa ventaja: en cinco minutos estás en el agua.

Cuando llegué al spot, el lineup estaba completamente vacío. Solo el sonido de las series rompiendo con una regularidad casi hipnótica. La luz fue apareciendo poco a poco — primero un tono violeta en el horizonte, después los naranjas y dorados que tiñeron cada labio de ola.

Estuve en el agua casi tres horas. El frío del invierno se olvida cuando estás ahí dentro, cazando el encuadre perfecto entre set y set. Los riders que fueron llegando encontraron olas limpias de metro y medio con paredes largas que permitían maniobras de sobra.

Este vídeo resume esa sesión: la calma antes de la primera serie, la explosión de energía cuando las olas empezaron a romper con fuerza, y esa luz de invierno que solo dura unos minutos pero que convierte cada fotograma en algo especial.`,
    category: "surf",
    youtubeId: "dQw4w9WgXcQ",
    date: "2025-12-15",
  },
  {
    id: 2,
    slug: "spot-comercial-santa-killa",
    title: "Santa Killa — Spot de temporada",
    description:
      "Producción del vídeo comercial de temporada para Santa Killa, la marca de surf de El Palmar.",
    body: `Producir el spot de temporada de Santa Killa es un proyecto especial: es mi marca, mi tienda, y conozco cada detalle de lo que queremos transmitir.

La idea para este vídeo era clara: mostrar el lifestyle real de El Palmar, sin postureo. Surfistas locales con el producto puesto, sesiones reales en nuestras olas, atardeceres en la playa y el ambiente de la tienda cuando cae la tarde y la gente se junta después de surfear.

El rodaje duró tres jornadas: amanecer en el agua con dos riders del team, tomas de producto en la tienda con luz natural, y una sesión de tarde con drone para capturar la escala de la playa y las rompientes desde el aire.

La edición buscaba un ritmo chill pero con momentos de energía — como una buena sesión de surf. Transiciones suaves en los planos de lifestyle, cortes rápidos en las maniobras, y una paleta de color dorada que refleja la identidad de la marca.

El resultado es un vídeo que funciona en redes y en la web, con cortes de 15, 30 y 60 segundos además de la pieza completa. Para mí es la combinación perfecta entre lo que más me gusta hacer y lo que necesita la marca.`,
    category: "commercial",
    youtubeId: "dQw4w9WgXcQ",
    date: "2025-11-20",
  },
  {
    id: 3,
    slug: "videoclip-mareas",
    title: "Mareas — Videoclip",
    description:
      "Videoclip musical rodado entre El Palmar y Tarifa. Dirección de fotografía y edición.",
    body: `Cuando la banda me contactó para rodar su nuevo videoclip, la propuesta encajaba perfectamente: querían algo que mezclara el mar, la arena y la energía cruda de su sonido.

El concepto giraba alrededor de la idea de las mareas como metáfora — subidas y bajadas, calma y caos. Planteamos dos escenarios principales: la playa de El Palmar al amanecer, con la banda tocando con el océano de fondo, y una nave industrial en Tarifa para los planos más oscuros e intensos.

Rodamos durante dos días con un equipo reducido: yo en cámara, un asistente de iluminación y la propia banda. Me gusta trabajar así, ágil, adaptándome a lo que la luz y el momento dan. Usé una mezcla de planos estabilizados a mano y trípode para los planos fijos de la actuación.

La postproducción fue donde realmente cobró vida. Hice un etalonaje contrastado — azules profundos para las escenas de mar, tonos ámbar para la nave — y sincronicé los cortes con los cambios de ritmo de la canción. Cada golpe de batería tiene su transición.

Fue de esos proyectos en los que todo fluye: buena música, buenos escenarios, gente comprometida con el resultado. El videoclip ya acumula miles de reproducciones y la banda lo usa como pieza central en sus directos.`,
    category: "musicvideo",
    youtubeId: "dQw4w9WgXcQ",
    date: "2025-10-05",
  },
  {
    id: 4,
    slug: "campeonato-jiu-jitsu-cadiz",
    title: "Campeonato de Jiu-Jitsu — Cádiz 2025",
    description:
      "Cobertura audiovisual completa del campeonato regional de jiu-jitsu en Cádiz.",
    body: `Cubrir un campeonato de jiu-jitsu es un reto muy diferente al surf. No hay olas ni luz natural — hay un tatami, fluorescentes, y una acción que se decide en fracciones de segundo.

Me acreditaron para la cobertura audiovisual completa del campeonato de Cádiz. El encargo incluía vídeo resumen del evento, highlights de las finales y clips individuales para los competidores que lo solicitaran.

Monté dos cámaras: una fija en ángulo cenital para capturar la técnica de las llaves y sumisiones, y otra a hombro con la que me movía alrededor del tatami para los planos cortos — las expresiones de concentración, el agarre, el momento exacto del tap.

Lo que me gusta del jiu-jitsu es su intensidad silenciosa. No hay gritos ni explosiones de sonido como en otros deportes. La tensión se siente, se ve en los músculos, en la respiración, en los ojos. Capturar eso en vídeo requiere estar muy atento y anticipar los momentos clave.

La edición combina los mejores combates con entrevistas breves a los ganadores y tomas del ambiente general: calentamientos, la espera entre combates, la emoción del podio. El resultado es una pieza que transmite la esencia del deporte y que los organizadores usan para la promoción de las siguientes ediciones.`,
    category: "event",
    youtubeId: "dQw4w9WgXcQ",
    date: "2025-09-22",
  },
  {
    id: 5,
    slug: "promo-escuela-surf",
    title: "Vídeo promocional — Escuela de surf",
    description:
      "Producción de vídeo comercial para una escuela de surf de la costa de Cádiz.",
    body: `Una escuela de surf local necesitaba renovar su material audiovisual. El vídeo anterior tenía varios años y no reflejaba ni las instalaciones actuales ni el equipo de monitores.

El briefing era claro: un vídeo de entre uno y dos minutos que mostrara la experiencia completa — desde la llegada del alumno hasta su primera ola. Algo fresco, dinámico, que generara ganas de apuntarse.

Planificamos el rodaje en una mañana de condiciones ideales: olas suaves, sol, marea baja. Grabé la clase real, sin actores ni situaciones forzadas. Los alumnos eran reales, las olas eran reales y los monitores hacían su trabajo como cualquier otro día. Esa autenticidad se nota en el resultado.

Complementé con planos de drone para mostrar la playa y el setup de la escuela desde arriba, tomas detalle del material (tablas, neoprenos, la furgoneta con el logo) y algunos planos ralentizados de alumnos poniéndose de pie por primera vez — esas sonrisas no se pueden fingir.

La entrega incluyó la pieza principal, cortes para Instagram Reels y Stories, y fotogramas extraídos del vídeo para usar en la web. Un pack completo que la escuela puede utilizar durante toda la temporada.`,
    category: "commercial",
    youtubeId: "dQw4w9WgXcQ",
    date: "2025-07-18",
  },
  {
    id: 6,
    slug: "sal-y-viento",
    title: "Sal y Viento",
    description:
      "Videoclip para un artista gaditano. Rodaje íntegro en localizaciones de la costa atlántica.",
    body: `Sal y Viento fue un videoclip rodado con un artista gaditano cuya música tiene raíces flamencas mezcladas con sonidos electrónicos. El tema habla de la relación entre el ser humano y el mar, así que la propuesta visual encajaba como anillo al dedo con lo que hago cada día.

Elegimos tres localizaciones en la costa atlántica de Cádiz: los acantilados de Barbate al amanecer, la playa de El Palmar a mediodía con la marea vacía, y una azotea en el pueblo viejo de Conil al atardecer.

El rodaje fue intenso — todo en un solo día, persiguiendo la luz en cada localización. Empezamos a las 6:30 en los acantilados con el artista cantando frente al mar embravecido. A mediodía, planos más calmados en la playa desierta. Y al caer la tarde, la azotea con vistas al Atlántico y esa luz dorada que solo Cádiz te da.

En la edición jugué mucho con los tiempos: ralentís en los versos, velocidad real en los estribillos, y algunos planos en reverse que le daban un toque onírico. El etalonaje apuesta por tonos desaturados con puntos de calidez — algo entre lo editorial y lo cinematográfico.

El resultado es un videoclip que respira sal, viento y la esencia del sur. El artista lo estrenó en un directo en Cádiz y desde entonces es la pieza principal de su press kit.`,
    category: "musicvideo",
    youtubeId: "dQw4w9WgXcQ",
    date: "2025-04-05",
  },
];

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
  });
}

export function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getVideoBySlug(slug: string): Video | undefined {
  return videos.find((v) => v.slug === slug);
}

export function getCategoryLabel(categoryId: string): string | undefined {
  return videoCategories.find((c) => c.id === categoryId)?.label;
}
