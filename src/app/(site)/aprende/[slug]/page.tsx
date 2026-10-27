import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/site/article-view";
import { getPublishedArticle } from "@/lib/article-data";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const article = await getPublishedArticle("aprende", (await params).slug);

  return article
    ? { title: `${article.title} — Crochet CasRey`, description: article.excerpt ?? undefined }
    : { title: "Crochet CasRey" };
}

export default async function ArticlePage({ params }: Params) {
  const article = await getPublishedArticle("aprende", (await params).slug);

  if (!article) {
    notFound();
  }

  return <ArticleView article={article} />;
}
