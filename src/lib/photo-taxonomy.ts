export interface PhotoSubfilterDefinition {
  id: string;
  label: string;
  aliases?: string[];
}

export interface PhotoFilterGroupDefinition {
  id: string;
  label: string;
  aliases?: string[];
  filters: PhotoSubfilterDefinition[];
}

export const PHOTO_FILTER_GROUPS: PhotoFilterGroupDefinition[] = [
  {
    id: "action-sport",
    label: "ACTION SPORT",
    aliases: ["action-sports", "deporte-de-accion"],
    filters: [
      { id: "surf", label: "SURF" },
      { id: "skate", label: "SKATE" },
      {
        id: "grappling",
        label: "GRAPPLING",
        aliases: ["jiu-jitsu", "jujitsu", "jiu-jitsu-brasileno"],
      },
      {
        id: "polo",
        label: "POLO",
        aliases: ["club-polo", "colabs", "colaboraciones", "claboraciones"],
      },
    ],
  },
  {
    id: "motorsport",
    label: "MOTORSPORT",
    aliases: ["motor-sport"],
    filters: [
      { id: "moto-gp", label: "MOTO GP", aliases: ["motogp"] },
      { id: "mxgp", label: "MXGP", aliases: ["mx-gp", "motocross"] },
    ],
  },
  {
    id: "light-water",
    label: "LIGHT & WATER",
    aliases: [
      "light-and-water",
      "agua",
      "mar",
      "natura",
      "naturaleza",
      "fauna",
      "animales",
      "lugares",
    ],
    filters: [
      {
        id: "light-water",
        label: "LIGHT & WATER",
        aliases: [
          "light-and-water",
          "agua",
          "mar",
          "natura",
          "naturaleza",
          "fauna",
          "animales",
          "lugares",
        ],
      },
    ],
  },
  {
    id: "other",
    label: "OTHER",
    aliases: ["otros", "otras", "otro"],
    filters: [
      {
        id: "other",
        label: "OTHER",
        aliases: ["otros", "otras", "otro", "monocroma", "retratos"],
      },
    ],
  },
];

export const PHOTO_SUBFILTERS = PHOTO_FILTER_GROUPS.flatMap(
  (group) => group.filters,
);

export const PHOTO_SUBFILTER_LABELS = new Map(
  PHOTO_SUBFILTERS.map((filter) => [filter.id, filter.label]),
);

export function getTaxonomyIds(
  item: Pick<PhotoSubfilterDefinition, "id" | "aliases">,
): string[] {
  return [item.id, ...(item.aliases ?? [])];
}

export function getTaxonomyGroupIds(group: PhotoFilterGroupDefinition): string[] {
  return [
    ...getTaxonomyIds(group),
    ...group.filters.flatMap((filter) => getTaxonomyIds(filter)),
  ];
}

export function getCanonicalPhotoFilterIds(values: string[]): string[] {
  const sourceIds = new Set(values.filter(Boolean));
  const canonicalIds = new Set<string>();

  for (const filter of PHOTO_SUBFILTERS) {
    if (getTaxonomyIds(filter).some((id) => sourceIds.has(id))) {
      canonicalIds.add(filter.id);
    }
  }

  return Array.from(canonicalIds);
}