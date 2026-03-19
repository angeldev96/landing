import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminContext = {
  user: {
    id: string;
    email: string | undefined;
  };
  profile: {
    full_name: string | null;
    email: string;
  };
};

export async function getAdminContext(): Promise<AdminContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      full_name: profile.full_name,
      email: profile.email,
    },
  };
}

export async function requireAdminContext() {
  const context = await getAdminContext();

  if (!context) {
    redirect("/admin/login");
  }

  return context;
}
