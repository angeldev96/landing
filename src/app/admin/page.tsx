import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdminContext } from "@/lib/auth";
import type { Json } from "@/lib/supabase/database.types";
import { parseAdminProducts } from "@/lib/crochet-landing";
import { createClient } from "@/lib/supabase/server";

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
        <AdminHeader active="productos" />

        <AdminDashboard
          initialProducts={products}
          adminName={context.profile.full_name || "Admin"}
          adminEmail={context.profile.email}
        />
      </div>
    </main>
  );
}
