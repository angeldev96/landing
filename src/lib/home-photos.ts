import { categoryCover, groupByCategory, type CatalogGroup, type CatalogProduct } from "@/lib/catalog";

/*
 * Deals the catalog's photographs out to the home page so no photograph shows twice. Each slot names
 * the products it prefers (by slug); a slug that is gone is replaced by the next unused photograph, so
 * the page keeps working as the owner adds, renames or hides products in the admin.
 */

// The hero wall: up to 21 tiles (7 x 3 at 1440). The first tiles sit on the right, where the words
// never cover them, and the first six are the phone's wall. Mixed so neighbours differ.
const HERO_SLUGS = [
  "Abejita",
  "TULIPS_02",
  "Set_jirafa",
  "UNICOR_BALLENA",
  "GIRASOLES",
  "Vaquita",
  "TEJIBUCHON",
  "Astronauta_Universo",
  "ROSAS_YELLOW",
  "Set_panda",
  "Fantasma",
  "TULIPS_ESPECIAL",
  "GATITO_AMIGURUMI",
  "BRISA",
  "PERRITO_AMIGURUMI",
  "GIRASOL_UNICO",
  "Vaquita_Cojin",
  "DUO_TULIPS",
  "CARTUCHOS",
];

const HOW_TO_ORDER_SLUG = "GIRA_POMS";
const CUSTOM_SLUGS = ["Niña_tejida", "TITI_CONEJITA", "Messi_Futbol"];
const PATTERNS_SLUG = "Patito";
const LEARN_SLUG = "MINI_TULIP";
const ALL_SLUG = "Set_azul";
const FAQ_SLUG = "Set_rosa";

export const HERO_TILE_COUNT = 21;
const RECENT_COUNT = 4;

export type HomePhotos = {
  categories: { group: CatalogGroup; cover: CatalogProduct }[];
  hero: CatalogProduct[];
  recent: CatalogProduct[];
  howToOrder: CatalogProduct | null;
  custom: CatalogProduct[];
  patterns: CatalogProduct | null;
  learn: CatalogProduct | null;
  all: CatalogProduct | null;
  faq: CatalogProduct | null;
};

export function planHomePhotos(products: CatalogProduct[]): HomePhotos {
  const pool = products.filter((product) => product.coverPath);
  const used = new Set<string>();
  const bySlug = new Map(pool.map((product) => [product.slug, product]));

  const take = (slugs: string[], count: number, from: CatalogProduct[] = pool) => {
    const picked: CatalogProduct[] = [];

    for (const slug of slugs) {
      const product = bySlug.get(slug);
      if (picked.length >= count) break;
      if (product && !used.has(product.id)) picked.push(product);
      if (product) used.add(product.id);
    }

    for (const product of from) {
      if (picked.length >= count) break;
      if (!used.has(product.id)) {
        picked.push(product);
        used.add(product.id);
      }
    }

    return picked;
  };

  const categories = groupByCategory(pool)
    .filter((group) => group.products.length > 0 && group.category.slug !== "otros")
    .map((group) => ({ group, cover: categoryCover(group) }))
    .filter((item): item is { group: CatalogGroup; cover: CatalogProduct } => item.cover !== null)
    .slice(0, 5);
  categories.forEach((item) => used.add(item.cover.id));

  const [howToOrder = null] = take([HOW_TO_ORDER_SLUG], 1);
  const custom = take(CUSTOM_SLUGS, 3);
  const [patterns = null] = take([PATTERNS_SLUG], 1);
  const [learn = null] = take([LEARN_SLUG], 1);
  const [all = null] = take([ALL_SLUG], 1);
  const [faq = null] = take([FAQ_SLUG], 1);

  // The newest pieces (the admin's order), leaving the hero's chosen photographs for the hero.
  const heroChosen = new Set(HERO_SLUGS);
  const recent = take([], RECENT_COUNT, pool.filter((product) => !heroChosen.has(product.slug)));
  const hero = take(HERO_SLUGS, HERO_TILE_COUNT);

  return { categories, hero, recent, howToOrder, custom, patterns, learn, all, faq };
}
