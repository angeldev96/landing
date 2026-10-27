import type { Json } from "@/lib/supabase/database.types";
import { LEARN_SECTIONS, PATTERN_SECTIONS } from "@/lib/site";

// Articles feed the /patrones and /aprende hubs. Each hub ("section" in the DB) has fixed
// categories that must match the check constraint in the crochet_landing_articles migration.
export type ArticleSection = "patrones" | "aprende";

export type ArticleCategory = {
  id: string;
  title: string;
  desc: string;
};

export const ARTICLE_HUBS: Record<ArticleSection, { label: string; path: string; categories: readonly ArticleCategory[] }> = {
  patrones: { label: "Biblioteca de patrones", path: "/patrones", categories: PATTERN_SECTIONS },
  aprende: { label: "Aprende", path: "/aprende", categories: LEARN_SECTIONS },
};

export const ARTICLE_SECTIONS = Object.keys(ARTICLE_HUBS) as ArticleSection[];

export type Article = {
  id: string;
  section: ArticleSection;
  category: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  coverPath: string | null;
  videoUrl: string | null;
  priceLabel: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ArticleFormPayload = {
  id?: string;
  section: ArticleSection;
  category: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverPath: string;
  videoUrl: string;
  priceLabel: string;
  isPublished: boolean;
  sortOrder: number;
};

type JsonRecord = Record<string, Json | undefined>;

function isJsonRecord(value: Json | undefined): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: Json | undefined, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNullableString(value: Json | undefined) {
  return typeof value === "string" ? value : null;
}

function isArticleSection(value: string): value is ArticleSection {
  return value in ARTICLE_HUBS;
}

export function findArticleCategory(section: ArticleSection, categoryId: string) {
  return ARTICLE_HUBS[section].categories.find((category) => category.id === categoryId) ?? null;
}

export function articleHref(article: Pick<Article, "section" | "slug">) {
  return `${ARTICLE_HUBS[article.section].path}/${article.slug}`;
}

export function parseArticle(input: Json | undefined): Article | null {
  if (!isJsonRecord(input)) {
    return null;
  }

  const section = asString(input.section);

  if (!asString(input.id) || !isArticleSection(section)) {
    return null;
  }

  return {
    id: asString(input.id),
    section,
    category: asString(input.category),
    slug: asString(input.slug),
    title: asString(input.title),
    excerpt: asNullableString(input.excerpt),
    body: asNullableString(input.body),
    coverPath: asNullableString(input.cover_path),
    videoUrl: asNullableString(input.video_url),
    priceLabel: asNullableString(input.price_label),
    isPublished: input.is_published === true,
    publishedAt: asNullableString(input.published_at),
    sortOrder: typeof input.sort_order === "number" ? input.sort_order : 0,
    createdAt: asString(input.created_at),
    updatedAt: asString(input.updated_at),
  };
}

export function parseArticles(input: Json): Article[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.map(parseArticle).filter((article): article is Article => Boolean(article));
}

// Returns an embeddable URL for YouTube links; other video links are shown as a plain button.
export function getYoutubeEmbedUrl(url: string | null) {
  if (!url) {
    return null;
  }

  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}
