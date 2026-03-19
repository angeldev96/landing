import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdminContext } from "@/lib/auth";
import type { Json } from "@/lib/supabase/database.types";
import { parseAdminProducts } from "@/lib/crochet-landing";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const context = await requireAdminContext();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_crochet_landing_admin_products");

  if (error) {
    throw new Error(error.message);
  }

  const products = parseAdminProducts((data ?? []) as Json);

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-primary/20 bg-surface/80 px-6 py-5 shadow-xl shadow-primary/5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary-dark">Crochet CasRey</p>
            <h1 className="font-display text-4xl text-foreground">Administrador de la landing</h1>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-primary/30 px-5 py-3 text-sm font-bold text-foreground transition hover:bg-primary/10"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        <AdminDashboard
          initialProducts={products}
          adminName={context.profile.full_name || "Admin"}
          adminEmail={context.profile.email}
        />
      </div>
    </main>
  );
}
