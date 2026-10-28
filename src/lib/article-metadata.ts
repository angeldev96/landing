import type { Metadata } from "next";
import { getPublishedArticle } from "@/lib/article-data";
import { articleHref, articleSummary, type ArticleSection } from "@/lib/articles";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { pageMetadata, toDescription } from "@/lib/seo";

// Shared by /patrones/[slug] and /aprende/[slug].
export async function generateArticleMetadata(section: ArticleSection, slug: string): Promise<Metadata> {
  const article = await getPublishedArticle(section, slug);

  if (!article) {
    return { title: "Artículo no encontrado", robots: { index: false } };
  }

  const cover = buildStoragePublicUrl(article.coverPath);

  return pageMetadata({
    title: article.title,
    description:
      toDescription(articleSummary(article)) ||
      `${article.title}: guía de crochet paso a paso de Crochet CasRey, Honduras.`,
    path: articleHref(article),
    images: cover ? [{ url: cover, alt: article.title }] : undefined,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}
