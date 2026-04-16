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
  category: "session" | "event" | "shortfilm";
  youtubeId: string;
  date: string;
}

export const videoCategories = [
  { id: "all", label: "Todo" },
  { id: "session", label: "Sesiones" },
  { id: "event", label: "Eventos" },
  { id: "shortfilm", label: "Cortometrajes" },
] as const;

export const videos: Video[] = [
  {
    id: 1,
    slug: "dawn-patrol-invierno",
    title: "Dawn Patrol — Sesión de invierno",
    description:
      "Las primeras luces sobre un swell consistente de noroeste. Sesión épica con el lineup vacío.",
    body: `Hay algo mágico en ser el primero en llegar al agua cuando todavía no ha salido el sol. Esta sesión de invierno fue una de esas mañanas que no se olvidan.

El swell de noroeste había entrado durante la noche y las previsiones apuntaban a un pico consistente al amanecer. Salí de casa a las 6:30, con el neopreno ya puesto y la cámara protegida en la carcasa estanca.

Cuando llegué al spot, el lineup estaba completamente vacío. Solo el sonido de las series rompiendo con una regularidad casi hipnótica. La luz fue apareciendo poco a poco — primero un tono violeta en el horizonte, después los naranjas y dorados que tiñeron cada labio de ola.

Estuve en el agua casi tres horas. El frío del invierno se olvida cuando estás ahí dentro, cazando el encuadre perfecto entre set y set. Los riders que fueron llegando encontraron olas limpias de metro y medio con paredes largas que permitían maniobras de sobra.

Este vídeo resume esa sesión: la calma antes de la primera serie, la explosión de energía cuando las olas empezaron a romper con fuerza, y esa luz de invierno que solo dura unos minutos pero que convierte cada fotograma en algo especial.`,
    category: "session",
    youtubeId: "dQw4w9WgXcQ",
    date: "2025-12-15",
  },
  {
    id: 2,
    slug: "open-mediterraneo-2025",
    title: "Open Mediterráneo 2025",
    description:
      "Cobertura completa del campeonato regional. Los mejores momentos de la final.",
    body: `El Open Mediterráneo es uno de esos eventos que marca el calendario surfero de la costa. Este año la competición se celebró con condiciones perfectas: olas de metro y medio a dos metros, viento offshore y sol.

Cubrir un campeonato de surf es un reto diferente a una sesión libre. Hay que estar pendiente de la estructura de la competición, conocer a los riders, anticipar las heat y tener siempre la cámara lista para la acción decisiva que puede durar apenas dos segundos.

Para esta edición monté un setup doble: cámara de agua para las mangas con riders que surfean la sección interior, y teleobjetivo desde la orilla para los aerials y tubos en la zona de fuera. Contar con un equipo así permite capturar perspectivas muy distintas del mismo momento.

La final fue épica. Dos locales que se conocen de toda la vida, compitiendo tubos against the clock en los últimos cinco minutos de la manga. El nivel fue altísimo y la tensión se palpaba desde la orilla.

Este recap condensa dos días de competición en los mejores momentos: las maniobras más radicales, la emoción de los heats, el ambiente en la playa y la ceremonia de entrega de premios al atardecer.`,
    category: "event",
    youtubeId: "dQw4w9WgXcQ",
    date: "2025-09-22",
  },
  {
    id: 3,
    slug: "salt-and-light",
    title: "Salt & Light",
    description:
      "Cortometraje documental sobre la comunidad de surf local y su conexión con el mar.",
    body: `Salt & Light nació de una idea que llevaba tiempo rondándome la cabeza: contar la historia de nuestra comunidad de surf no a través de las olas, sino a través de las personas que las surfean.

Aquí en la costa mediterránea, el surf no es lo mismo que en el Atlántico o en las islas. Las olas son más pequeñas, menos consistentes. Pero eso no importa. Lo que hace especial esta comunidad es precisamente esa resiliencia, esa pasión por meterse al agua aunque las condiciones no sean las "perfectas" del Instagram.

El documental sigue a cinco personas de la escena local: un shaper veterano que lleva 30 años dando forma a tablas en su taller, una surfista que compagina competición con su trabajo de enfermera, un grupo de groms que se levantan antes de ir al instituto para pillar las primeras olas, un fotógrafo submarino (sí, yo también salgo brevemente) y un pescador retirado que aprendió a surfear a los 60 años.

La producción duró tres meses. Rodamos al amanecer, al atardecer, en días de temporal y en las calmas de verano. Quería capturar todo el espectro emocional: la euforia de una buena sesión, la frustración de semanas sin olas, la camaradería en el parking después de surfear.

La banda sonora es de un músico local que compuso piezas originales mezclando guitarra acústica con samples del sonido del mar grabados en nuestras playas.

Salt & Light es un homenaje a esta comunidad. A todos los que madrugan, enceran su tabla y se meten al agua sabiendo que no importa el tamaño de la ola, sino lo que sientes al montarla.`,
    category: "shortfilm",
    youtubeId: "dQw4w9WgXcQ",
    date: "2025-06-10",
  },
  {
    id: 4,
    slug: "summer-highlights-2025",
    title: "Summer Highlights 2025",
    description:
      "Lo mejor de las sesiones de verano compilado en un recap de alta energía.",
    body: `Cada verano acumulo cientos de horas de material. Sesiones al amanecer, tardes interminables con olas pequeñas pero divertidas, viajes relámpago siguiendo swells que entran por sorpresa.

Este recap es un destilado de todo eso. Tres meses comprimidos en unos minutos de pura energía, editados para que cada corte vaya al ritmo de la música y cada transición lleve al siguiente momento de acción.

Lo que más disfruté de este verano fue la variedad. Tuvimos de todo: días de olas grandes con el Levante soplando fuerte, sesiones de longboard en plan mellow con amigos, y una semana de agosto donde un swell del sur trajo olas que nadie esperaba.

La edición de este tipo de vídeos es un trabajo de paciencia. Revisar cada clip, marcar los mejores momentos, buscar la música que encaje con el feeling general. Para este recap elegí un tema con buildup progresivo que empieza tranquilo (las primeras sesiones de junio) y va subiendo hasta el clímax de las mejores olas de agosto.

También experimenté con ralentís extremos en algunos clips — grabados a 240fps para capturar detalles que el ojo no ve: las gotas de agua desprendiéndose del labio, el spray de un cutback, la expresión de concentración justo antes del take-off.`,
    category: "session",
    youtubeId: "dQw4w9WgXcQ",
    date: "2025-08-30",
  },
  {
    id: 5,
    slug: "pro-surf-tour-etapa-local",
    title: "Pro Surf Tour — Etapa local",
    description:
      "Resumen de la etapa del circuito profesional que pasó por nuestra costa.",
    body: `Cuando confirmaron que una etapa del circuito profesional pasaría por nuestra costa, la escena local se revolucionó. Era la primera vez que riders de nivel WQS competirían en nuestras olas.

La organización montó una estructura impresionante: torres de jueces, zona VIP, pantalla gigante retransmitiendo en directo. Para los que estamos acostumbrados a surfear aquí en plan tranquilo, ver todo ese despliegue era surrealista.

Me acreditaron como fotógrafo/videógrafo oficial del evento, lo que me dio acceso a zonas privilegiadas: la primera fila del agua, la zona técnica y el backstage donde los riders se preparaban entre heats.

El nivel de surf fue una locura. Maniobras que solo había visto en vídeos de Hawái o Tahití, ejecutadas en olas de nuestra playa de toda la vida. Aerials con rotaciones completas, tubos profundos aprovechando las secciones del fondo de roca, y una intensidad competitiva que electrizaba el ambiente.

La producción de este vídeo fue más compleja que mis trabajos habituales. Tuve que coordinar con el equipo de realización del circuito, respetar los tiempos de embargo y adaptar mi estilo a un formato más "deportivo" sin perder mi sello personal. El resultado es un balance entre la cobertura periodística del evento y la mirada más cinematográfica que me caracteriza.`,
    category: "event",
    youtubeId: "dQw4w9WgXcQ",
    date: "2025-07-18",
  },
  {
    id: 6,
    slug: "chasing-swells",
    title: "Chasing Swells",
    description:
      "Mini-documental: persiguiendo las mejores olas a lo largo de la costa mediterránea.",
    body: `Chasing Swells es un proyecto que me tenía obsesionado desde hacía tiempo: un road trip a lo largo de la costa mediterránea persiguiendo swells durante un mes entero.

La idea era simple pero ambiciosa: seguir las previsiones de oleaje y desplazarme por la costa buscando el mejor spot para cada día. Desde Cadaqués hasta Almería, pasando por calas escondidas, playas urbanas y rompientes que solo funcionan con condiciones muy específicas.

El equipamiento tuvo que ser compacto pero versátil: dos cámeras (una para agua, otra para tierra), drone, trípode de viaje y un portátil para revisar y hacer backups cada noche. Todo cabía en la furgoneta que me prestó un colega.

Cada capítulo del documental cubre una zona de la costa. El primero arranca en la Costa Brava con sus olas de Tramontana, cortas pero potentes. Después el Delta del Ebro, donde las playas infinitas crean picos de beach break impredecibles. La zona de Valencia con sus spots más conocidos. Y el final en la costa de Almería, donde el paisaje casi desértico contrasta con olas sorprendentemente buenas cuando entra el swell correcto.

Más allá del surf, el documental captura el viaje en sí: las noches durmiendo en la furgo con el sonido del mar de fondo, los encuentros con surfistas locales que te enseñan SU ola secreta, las comidas en chiringuitos de carretera, y esa libertad absoluta de no tener un plan fijo más allá de lo que diga el parte de olas.

Chasing Swells es mi proyecto más personal. No es solo un vídeo de surf — es la historia de por qué hago lo que hago.`,
    category: "shortfilm",
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
