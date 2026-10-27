"use server";

import { revalidatePath } from "next/cache";
import type { Json } from "@/lib/supabase/database.types";
import { ARTICLE_HUBS, parseArticles, type Article, type ArticleFormPayload } from "@/lib/articles";
import { createClient } from "@/lib/supabase/server";

type AdminArticlesActionResult = {
  error?: string;
  articles?: Article[];
  selectedId?: string | null;
};

async function fetchAdminArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_crochet_landing_admin_articles");

  if (error) {
    throw new Error(error.message);
  }

  return parseArticles((data ?? []) as Json);
}

function revalidateArticlePages() {
  for (const hub of Object.values(ARTICLE_HUBS)) {
    revalidatePath(hub.path, "layout");
  }
  revalidatePath("/admin/articulos");
}

export async function saveArticleAction(payload: ArticleFormPayload): Promise<AdminArticlesActionResult> {
  const supabase = await createClient();
  const fields = {
    article_section: payload.section,
    article_category: payload.category,
    article_title: payload.title,
    article_slug: payload.slug,
    article_excerpt: payload.excerpt,
    article_body: payload.body,
    article_cover_path: payload.coverPath,
    article_video_url: payload.videoUrl,
    article_price_label: payload.priceLabel,
    article_is_published: payload.isPublished,
    article_sort_order: payload.sortOrder,
  };

  const { data, error } = payload.id
    ? await supabase.rpc("update_crochet_landing_article", { article_id: payload.id, ...fields })
    : await supabase.rpc("create_crochet_landing_article", fields);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidateArticlePages();

  const selectedId = typeof data === "object" && data && "id" in data ? String(data.id) : payload.id ?? null;

  return {
    articles: await fetchAdminArticles(),
    selectedId,
  };
}

export async function deleteArticleAction(articleId: string): Promise<AdminArticlesActionResult & { coverPath?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("delete_crochet_landing_article", {
    article_id: articleId,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidateArticlePages();

  return {
    coverPath: data ?? undefined,
    articles: await fetchAdminArticles(),
    selectedId: null,
  };
}

export async function refreshAdminArticlesAction(): Promise<AdminArticlesActionResult> {
  try {
    return {
      articles: await fetchAdminArticles(),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "No pudimos refrescar los artículos.",
    };
  }
}
