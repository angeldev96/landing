import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import { parseGalleryPageData, parseProductDetail, type GalleryPageProduct } from "@/lib/crochet-landing";
import { decodeSlug } from "@/lib/slug";
import { OTHER_CATEGORY, STORE_CATEGORIES, resolveCategory, type StoreCategory } from "@/lib/categories";

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

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
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
}

export function groupByCategory(products: CatalogProduct[]): CatalogGroup[] {
  return [...STORE_CATEGORIES, OTHER_CATEGORY].map((category) => ({
    category,
    products: products.filter((product) => product.category.slug === category.slug),
  }));
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
