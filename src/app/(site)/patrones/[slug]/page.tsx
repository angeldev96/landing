import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/site/article-view";
import { getPublishedArticle } from "@/lib/article-data";
import { generateArticleMetadata } from "@/lib/article-metadata";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return generateArticleMetadata("patrones", (await params).slug);
}

export default async function ArticlePage({ params }: Params) {
  const article = await getPublishedArticle("patrones", (await params).slug);

  if (!article) {
    notFound();
  }

  return <ArticleView article={article} />;
}
