import type { MetadataRoute } from "next";
import { getCatalogProducts } from "@/lib/catalog";
import { getPublishedArticles } from "@/lib/article-data";
import { articleHref } from "@/lib/articles";
import { STORE_CATEGORIES, categoryHref } from "@/lib/categories";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

async function loadProducts() {
  try {
    return await getCatalogProducts();
  } catch (error) {
    console.error("sitemap: no pudimos cargar el catálogo:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, patterns, lessons] = await Promise.all([
    loadProducts(),
    getPublishedArticles("patrones"),
    getPublishedArticles("aprende"),
  ]);
  const now = new Date();
  const usedCategories = new Set(products.map((product) => product.category.slug));

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tienda"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...STORE_CATEGORIES.filter((category) => usedCategories.has(category.slug)).map((category) => ({
      url: absoluteUrl(categoryHref(category)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/tienda/${product.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: product.coverPath ? [buildStoragePublicUrl(product.coverPath)] : undefined,
    })),
    { url: absoluteUrl("/patrones"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/aprende"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...[...patterns, ...lessons].map((article) => ({
      url: absoluteUrl(articleHref(article)),
      lastModified: article.updatedAt || article.publishedAt || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: article.coverPath ? [buildStoragePublicUrl(article.coverPath)] : undefined,
    })),
  ];
}
