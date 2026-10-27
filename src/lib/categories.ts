// Store categories. Products don't have a category column yet, so each product is
// assigned to a category by matching its badge ("Etiqueta" in the admin) against the aliases.
export type StoreCategory = {
  slug: string;
  name: string;
  desc: string;
  aliases: string[];
};

export const STORE_CATEGORIES: StoreCategory[] = [
  {
    slug: "amigurumis",
    name: "Amigurumis",
    desc: "Muñequitos tejidos a mano, suaves y llenos de personalidad.",
    aliases: ["amigurumi", "amigurumis", "muneco", "munecos", "muneca", "munecas", "peluche", "peluches"],
  },
  {
    slug: "flores",
    name: "Flores",
    desc: "Flores eternas y ramos que nunca se marchitan.",
    aliases: ["flor", "flores", "ramo", "ramos", "tulipan", "tulipanes", "tulips", "girasol", "girasoles"],
  },
  {
    slug: "bolsos",
    name: "Bolsos y carteras",
    desc: "Carteras y bolsos tejidos con identidad y estilo.",
    aliases: ["bolso", "bolsos", "cartera", "carteras"],
  },
  {
    slug: "cojines",
    name: "Cojines",
    desc: "Cojines tejidos para darle calidez a tu hogar.",
    aliases: ["cojin", "cojines", "almohada", "almohadas", "hogar"],
  },
  {
    slug: "accesorios",
    name: "Accesorios",
    desc: "Llaveros, diademas, scrunchies y detalles para llevar contigo.",
    aliases: ["accesorio", "accesorios", "llavero", "llaveros", "diadema", "diademas", "scrunchie", "scrunchies"],
  },
  {
    slug: "ropa-de-bebe",
    name: "Ropa de bebé",
    desc: "Gorritos, zapatitos y conjuntos tejidos para los más pequeños.",
    aliases: ["ropa de bebe", "bebe", "bebes", "ropa", "ropita"],
  },
  {
    slug: "regalos-personalizados",
    name: "Regalos personalizados",
    desc: "Piezas únicas hechas a la medida de tu idea.",
    aliases: ["regalo", "regalos", "personalizado", "personalizados", "regalos personalizados", "custom"],
  },
  {
    slug: "colecciones",
    name: "Colecciones",
    desc: "Series especiales y ediciones de temporada.",
    aliases: ["coleccion", "colecciones", "temporada", "edicion especial"],
  },
];

export const OTHER_CATEGORY: StoreCategory = {
  slug: "otros",
  name: "Más creaciones",
  desc: "Otras piezas tejidas a mano.",
  aliases: [],
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function resolveCategory(badge: string | null | undefined): StoreCategory {
  if (!badge) {
    return OTHER_CATEGORY;
  }

  const normalized = normalize(badge);

  return (
    STORE_CATEGORIES.find(
      (category) => normalize(category.name) === normalized || category.aliases.includes(normalized),
    ) ?? OTHER_CATEGORY
  );
}

export function findCategoryBySlug(slug: string | null | undefined) {
  if (!slug) {
    return null;
  }

  return [...STORE_CATEGORIES, OTHER_CATEGORY].find((category) => category.slug === slug) ?? null;
}

export function categoryHref(category: StoreCategory) {
  return `/tienda?categoria=${category.slug}`;
}
