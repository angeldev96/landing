"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Json } from "@/lib/supabase/database.types";
import { parseAdminProducts, type ProductFormPayload } from "@/lib/crochet-landing";
import { createClient } from "@/lib/supabase/server";

type AdminProductsActionResult = {
  error?: string;
  products?: ReturnType<typeof parseAdminProducts>;
  selectedId?: string | null;
};

async function fetchAdminProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_crochet_landing_admin_products");

  if (error) {
    throw new Error(error.message);
  }

  return parseAdminProducts((data ?? []) as Json);
}

export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/admin/login?message=${encodeURIComponent("No pudimos iniciar sesión. Revisa tus datos.")}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/admin/login?message=${encodeURIComponent("La sesión no pudo validarse.")}`);
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    redirect(`/admin/login?message=${encodeURIComponent("Tu cuenta no tiene acceso al panel.")}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveProductAction(payload: ProductFormPayload): Promise<AdminProductsActionResult> {
  const supabase = await createClient();

  const rpcName = payload.id ? "update_crochet_landing_product" : "create_crochet_landing_product";
  const args = payload.id
    ? {
        product_id: payload.id,
        product_name: payload.name,
        product_description: payload.description,
        product_badge: payload.badge,
        product_slug: payload.slug,
        product_is_published: payload.isPublished,
        product_sort_order: payload.sortOrder,
      }
    : {
        product_name: payload.name,
        product_description: payload.description,
        product_badge: payload.badge,
        product_slug: payload.slug,
        product_is_published: payload.isPublished,
        product_sort_order: payload.sortOrder,
      };

  const { data, error } = await supabase.rpc(rpcName, args);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  const products = await fetchAdminProducts();
  const selectedId = typeof data === "object" && data && "id" in data ? String(data.id) : payload.id ?? null;

  return {
    products,
    selectedId,
  };
}

export async function deleteProductAction(productId: string): Promise<AdminProductsActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_crochet_landing_product", {
    product_id: productId,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    products: await fetchAdminProducts(),
    selectedId: null,
  };
}

export async function addProductImageAction(args: {
  productId: string;
  storagePath: string;
  altText: string;
  sortOrder: number;
  isCover: boolean;
}): Promise<AdminProductsActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("add_crochet_landing_product_image", {
    input_product_id: args.productId,
    input_storage_path: args.storagePath,
    input_alt_text: args.altText,
    input_sort_order: args.sortOrder,
    input_is_cover: args.isCover,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    products: await fetchAdminProducts(),
    selectedId: args.productId,
  };
}

export async function setProductCoverAction(imageId: string, productId: string): Promise<AdminProductsActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_crochet_landing_cover_image", {
    input_image_id: imageId,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    products: await fetchAdminProducts(),
    selectedId: productId,
  };
}

export async function deleteProductImageAction(imageId: string, productId: string): Promise<{
  error?: string;
  storagePath?: string;
  products?: ReturnType<typeof parseAdminProducts>;
  selectedId?: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("delete_crochet_landing_product_image", {
    input_image_id: imageId,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    storagePath: data ?? undefined,
    products: await fetchAdminProducts(),
    selectedId: productId,
  };
}

export async function refreshAdminProductsAction(): Promise<AdminProductsActionResult> {
  try {
    return {
      products: await fetchAdminProducts(),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "No pudimos refrescar el panel.",
    };
  }
}
