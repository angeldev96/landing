import { AdminArticles } from "@/components/admin/admin-articles";
import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdminContext } from "@/lib/auth";
import type { Json } from "@/lib/supabase/database.types";
import { parseArticles } from "@/lib/articles";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  await requireAdminContext();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_crochet_landing_admin_articles");

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeader active="articulos" />

        {error ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
            <p className="font-bold">No pudimos cargar los artículos.</p>
            <p className="mt-1">
              Revisa que la migración <code>crochet_landing_articles</code> esté aplicada en Supabase. Detalle: {error.message}
            </p>
          </div>
        ) : (
          <AdminArticles initialArticles={parseArticles((data ?? []) as Json)} />
        )}
      </div>
    </main>
  );
}
