import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import { parseArticle, parseArticles, type ArticleSection } from "@/lib/articles";

// PostgREST code for "function not found": the articles migration hasn't been applied yet.
const MISSING_FUNCTION_CODE = "PGRST202";

function reportError(context: string, error: { code: string; message: string }) {
  if (error.code === MISSING_FUNCTION_CODE) {
    console.warn(`${context}: falta aplicar la migración crochet_landing_articles en Supabase.`);
    return;
  }

  console.error(`${context}:`, error.message);
}

// Hubs degrade to their "Próximamente" state when the articles RPCs fail.
export const getPublishedArticles = cache(async (section: ArticleSection) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_crochet_landing_articles", {
    input_section: section,
  });

  if (error) {
    reportError(`No pudimos cargar los artículos de ${section}`, error);
    return [];
  }

  return parseArticles((data ?? []) as Json);
});

// Cached per request so generateMetadata and the page share one RPC call.
export const getPublishedArticle = cache(async (section: ArticleSection, slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_crochet_landing_article", {
    input_section: section,
    input_slug: slug,
  });

  if (error) {
    reportError(`No pudimos cargar el artículo ${section}/${slug}`, error);
    return null;
  }

  return parseArticle((data ?? null) as Json);
});
