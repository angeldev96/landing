import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import { parseGalleryPageData, parseProductDetail, type GalleryPageProduct } from "@/lib/crochet-landing";
import { decodeSlug } from "@/lib/slug";
import {
  CATEGORY_COVER_SLUGS,
  OTHER_CATEGORY,
  STORE_CATEGORIES,
  resolveCategory,
  type StoreCategory,
} from "@/lib/categories";

// The gallery RPC caps page size, so the full catalog is read page by page.
const CATALOG_PAGE_SIZE = 24;
const MAX_CATALOG_PAGES = 20;

export type CatalogProduct = GalleryPageProduct & {
  category: StoreCategory;
};

export type CatalogGroup = {
  category: StoreCategory;
  products: CatalogProduct[];
};

// Cached per request: the header's shop panel and the page read the same catalog with one set of RPC calls.
export const getCatalogProducts = cache(async (): Promise<CatalogProduct[]> => {
  const supabase = await createClient();
  const products: CatalogProduct[] = [];

  for (let page = 1; page <= MAX_CATALOG_PAGES; page++) {
    const { data, error } = await supabase.rpc("get_crochet_landing_gallery_page", {
      input_page: page,
      input_page_size: CATALOG_PAGE_SIZE,
    });

    if (error) {
      throw new Error(error.message);
    }

    const gallery = parseGalleryPageData((data ?? null) as Json);

    products.push(...gallery.items.map((item) => ({ ...item, category: resolveCategory(item.badge) })));

    if (gallery.page >= gallery.totalPages || gallery.items.length === 0) {
      break;
    }
  }

  return products;
});

// The header and the home page degrade to their photo-less state when the catalog can't be read.
export async function getCatalogProductsSafe(): Promise<CatalogProduct[]> {
  try {
    return await getCatalogProducts();
  } catch {
    return [];
  }
}

// The view-transition name a product's photograph carries on every card and on its own page, so it
// travels from the card to the page when the visitor opens it.
export function productTransitionName(productId: string) {
  return `product-${productId}`;
}

export function groupByCategory(products: CatalogProduct[]): CatalogGroup[] {
  return [...STORE_CATEGORIES, OTHER_CATEGORY].map((category) => ({
    category,
    products: products.filter((product) => product.category.slug === category.slug),
  }));
}

// One photograph stands for each category wherever the category is shown (the shop panel in the header,
// the category tiles on the home page): the product named in CATEGORY_COVER_SLUGS, else its first photo.
export function categoryCover(group: CatalogGroup) {
  const preferred = CATEGORY_COVER_SLUGS[group.category.slug];
  const withCover = group.products.filter((product) => product.coverPath);

  return withCover.find((product) => product.slug === preferred) ?? withCover[0] ?? null;
}

// Cached per request so generateMetadata and the product page share one RPC call.
export const getProductDetail = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_crochet_landing_product_detail", {
    input_slug: decodeSlug(slug),
  });

  if (error) {
    throw new Error(error.message);
  }

  return parseProductDetail((data ?? null) as Json);
});

// Some product names are typed in ALL CAPS in the admin. Shown as-is they shout next to the
// mixed-case ones, so all-caps names are rendered in title case ("SET SANTA CLAUS" → "Set Santa Claus").
export function displayProductName(name: string) {
  if (name !== name.toLocaleUpperCase("es") || name === name.toLocaleLowerCase("es")) {
    return name;
  }

  return name
    .toLocaleLowerCase("es")
    .replace(/(^|[\s-])(\p{L})/gu, (_, gap: string, letter: string) => gap + letter.toLocaleUpperCase("es"));
}
