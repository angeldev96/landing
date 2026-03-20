"use client";

import { startTransition, useEffect, useState } from "react";
import {
  addProductImageAction,
  deleteProductAction,
  deleteProductImageAction,
  refreshAdminProductsAction,
  saveProductAction,
  setProductCoverAction,
} from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";
import {
  buildStoragePublicUrl,
  CROCHET_LANDING_BUCKET,
  type AdminProduct,
  type AdminProductImage,
  type ProductFormPayload,
} from "@/lib/crochet-landing";

type DashboardProps = {
  initialProducts: AdminProduct[];
  adminName: string;
  adminEmail: string;
};

const emptyForm: ProductFormPayload = {
  name: "",
  slug: "",
  description: "",
  badge: "",
  isPublished: true,
  sortOrder: 0,
};

function productToForm(product: AdminProduct): ProductFormPayload {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    badge: product.badge ?? "",
    isPublished: product.is_published,
    sortOrder: product.sort_order,
  };
}

function normalizeFilename(filename: string) {
  return filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
}

export function AdminDashboard({ initialProducts, adminName, adminEmail }: DashboardProps) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedId, setSelectedId] = useState<string | null>(initialProducts[0]?.id ?? null);
  const [form, setForm] = useState<ProductFormPayload>(
    initialProducts[0] ? productToForm(initialProducts[0]) : emptyForm,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [uploadAltText, setUploadAltText] = useState("");
  const [markAsCover, setMarkAsCover] = useState(true);

  const selectedProduct = products.find((product) => product.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    setForm(productToForm(selectedProduct));
  }, [selectedProduct]);

  function syncProducts(nextProducts: AdminProduct[], nextSelectedId?: string | null) {
    setProducts(nextProducts);
    const fallbackId = nextProducts[0]?.id ?? null;
    const resolvedSelectedId =
      nextSelectedId && nextProducts.some((product) => product.id === nextSelectedId)
        ? nextSelectedId
        : fallbackId;

    setSelectedId(resolvedSelectedId);

    if (!resolvedSelectedId) {
      setForm(emptyForm);
      return;
    }

    const nextSelectedProduct = nextProducts.find((product) => product.id === resolvedSelectedId);
    if (nextSelectedProduct) {
      setForm(productToForm(nextSelectedProduct));
    }
  }

  function runAsyncTask(task: () => Promise<void>) {
    setIsBusy(true);
    setMessage(null);

    startTransition(async () => {
      try {
        await task();
      } finally {
        setIsBusy(false);
      }
    });
  }

  function handleSelectProduct(product: AdminProduct) {
    setSelectedId(product.id);
    setForm(productToForm(product));
    setMessage(null);
  }

  function handleNewProduct() {
    setSelectedId(null);
    setForm(emptyForm);
    setMessage("Preparando un producto nuevo.");
  }

  function handleSave() {
    if (!form.name.trim()) {
      setMessage("El nombre es obligatorio.");
      return;
    }

    runAsyncTask(async () => {
      const result = await saveProductAction({
        ...form,
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        badge: form.badge.trim(),
      });

      if (result.error || !result.products) {
        setMessage(result.error ?? "No pudimos guardar el producto.");
        return;
      }

      syncProducts(result.products, result.selectedId);
      setMessage("Producto guardado correctamente.");
    });
  }

  function handleDelete() {
    if (!selectedProduct) {
      return;
    }

    const confirmed = window.confirm(`Eliminar "${selectedProduct.name}" tambien borrara sus imagenes registradas. Continuamos?`);
    if (!confirmed) {
      return;
    }

    runAsyncTask(async () => {
      const storagePaths = selectedProduct.images.map((image) => image.storage_path);
      const result = await deleteProductAction(selectedProduct.id);

      if (result.error || !result.products) {
        setMessage(result.error ?? "No pudimos eliminar el producto.");
        return;
      }

      if (storagePaths.length) {
        const supabase = createClient();
        await supabase.storage.from(CROCHET_LANDING_BUCKET).remove(storagePaths);
      }

      syncProducts(result.products, result.selectedId);
      setMessage("Producto eliminado.");
    });
  }

  async function uploadImage(file: File) {
    if (!selectedProduct) {
      setMessage("Primero guarda el producto para poder subir imagenes.");
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Tu sesion expiro. Vuelve a iniciar sesion.");
      return;
    }

    const extension = file.name.split(".").pop() ?? "jpg";
    const safeFileName = normalizeFilename(file.name.replace(/\.[^.]+$/, ""));
    const storagePath = `${user.id}/${selectedProduct.id}/${crypto.randomUUID()}-${safeFileName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(CROCHET_LANDING_BUCKET)
      .upload(storagePath, file, {
        cacheControl: "3600",
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      setMessage(uploadError.message);
      return;
    }

    const result = await addProductImageAction({
      productId: selectedProduct.id,
      storagePath,
      altText: uploadAltText.trim(),
      sortOrder: selectedProduct.images.length,
      isCover: markAsCover || selectedProduct.images.length === 0,
    });

    if (result.error || !result.products) {
      await supabase.storage.from(CROCHET_LANDING_BUCKET).remove([storagePath]);
      setMessage(result.error ?? "Subimos la imagen, pero no pudimos registrarla.");
      return;
    }

    syncProducts(result.products, result.selectedId);
    setUploadAltText("");
    setMarkAsCover(false);
    setMessage("Imagen subida correctamente.");
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    runAsyncTask(async () => {
      await uploadImage(file);
    });
  }

  function handleSetCover(image: AdminProductImage) {
    if (!selectedProduct) {
      return;
    }

    runAsyncTask(async () => {
      const result = await setProductCoverAction(image.id, selectedProduct.id);

      if (result.error || !result.products) {
        setMessage(result.error ?? "No pudimos actualizar la portada.");
        return;
      }

      syncProducts(result.products, result.selectedId);
      setMessage("Portada actualizada.");
    });
  }

  function handleDeleteImage(image: AdminProductImage) {
    if (!selectedProduct) {
      return;
    }

    runAsyncTask(async () => {
      const result = await deleteProductImageAction(image.id, selectedProduct.id);

      if (result.error || !result.products) {
        setMessage(result.error ?? "No pudimos eliminar la imagen.");
        return;
      }

      const supabase = createClient();
      await supabase.storage.from(CROCHET_LANDING_BUCKET).remove([image.storage_path]);
      syncProducts(result.products, result.selectedId);
      setMessage("Imagen eliminada.");
    });
  }

  function handleRefresh() {
    runAsyncTask(async () => {
      const result = await refreshAdminProductsAction();

      if (result.error || !result.products) {
        setMessage(result.error ?? "No pudimos refrescar el panel.");
        return;
      }

      syncProducts(result.products, selectedId);
      setMessage("Datos actualizados.");
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] border border-primary/20 bg-surface/80 p-5 shadow-xl shadow-primary/5 backdrop-blur-xl">
        <div className="space-y-2 border-b border-primary/15 pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary-dark">Panel privado</p>
          <h2 className="font-display text-3xl text-foreground">Hola, {adminName}</h2>
          <p className="text-sm text-foreground-light">{adminEmail}</p>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleNewProduct}
            className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-bold text-foreground transition hover:bg-primary-dark hover:text-white"
          >
            Nuevo producto
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-full border border-primary/30 px-4 py-3 text-sm font-bold text-foreground transition hover:bg-primary/10"
          >
            Refrescar
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-primary/30 bg-background p-5 text-sm text-foreground-light">
              Aun no hay productos cargados para esta landing.
            </div>
          ) : (
            products.map((product) => {
              const cover = product.images.find((image) => image.is_cover) ?? product.images[0];

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelectProduct(product)}
                  className={`w-full rounded-[1.6rem] border p-3 text-left transition ${
                    selectedId === product.id
                      ? "border-primary/50 bg-primary-light/70 shadow-lg shadow-primary/10"
                      : "border-primary/15 bg-background/80 hover:border-primary/35 hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-primary/15">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={buildStoragePublicUrl(cover.storage_path)}
                          alt={cover.alt_text ?? product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary-dark">
                          Sin foto
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{product.name}</p>
                      <p className="mt-1 truncate text-xs text-foreground-light">/{product.slug}</p>
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-dark">
                        {product.is_published ? "Visible" : "Oculto"} • {product.images.length} foto(s)
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className="space-y-6">
        <div className="rounded-[2rem] border border-primary/20 bg-surface/85 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary-dark">Editor</p>
              <h3 className="font-display text-3xl text-foreground">
                {selectedProduct ? `Editar ${selectedProduct.name}` : "Crear producto"}
              </h3>
            </div>
            <div className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm font-semibold text-foreground-light">
              {isBusy ? "Guardando cambios..." : "Listo para trabajar"}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-bold text-foreground">Nombre</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-primary/20 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:bg-white"
                placeholder="Ej. Conejita pastel"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-foreground">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                className="w-full rounded-2xl border border-primary/20 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:bg-white"
                placeholder="Opcional. Se autogenera si lo dejas vacio."
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-foreground">Etiqueta</span>
              <input
                value={form.badge}
                onChange={(event) => setForm((current) => ({ ...current, badge: event.target.value }))}
                className="w-full rounded-2xl border border-primary/20 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:bg-white"
                placeholder="Favorito, Custom, Hogar..."
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-foreground">Orden</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sortOrder: Number.parseInt(event.target.value || "0", 10),
                  }))
                }
                className="w-full rounded-2xl border border-primary/20 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:bg-white"
              />
            </label>
          </div>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-bold text-foreground">Descripcion</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="min-h-32 w-full rounded-3xl border border-primary/20 bg-background px-4 py-4 text-sm outline-none transition focus:border-primary/50 focus:bg-white"
              placeholder="Describe el producto o la idea detras de la pieza."
            />
          </label>

          <label className="mt-4 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-background px-4 py-3 text-sm font-semibold text-foreground">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
              className="h-4 w-4 accent-primary-dark"
            />
            Mostrar este producto en la landing
          </label>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-foreground transition hover:bg-primary-dark hover:text-white disabled:opacity-60"
              disabled={isBusy}
            >
              {selectedProduct ? "Guardar cambios" : "Crear producto"}
            </button>
            {selectedProduct ? (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-rose-300 bg-rose-50 px-6 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                disabled={isBusy}
              >
                Eliminar producto
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-[2rem] border border-primary/20 bg-background-dark p-6 text-white shadow-2xl shadow-primary/10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Galeria del producto</p>
              <h3 className="font-display text-3xl">
                {selectedProduct ? `Fotos de ${selectedProduct.name}` : "Guarda primero tu producto"}
              </h3>
            </div>
            <p className="text-sm text-white/60">
              Las imagenes se almacenan en el bucket privado de esta landing dentro del mismo proyecto Supabase.
            </p>
          </div>

          {selectedProduct ? (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
                <label className="space-y-2">
                  <span className="text-sm font-bold text-white">Texto alternativo</span>
                  <input
                    value={uploadAltText}
                    onChange={(event) => setUploadAltText(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-primary/60"
                    placeholder="Ej. Conejita tejida con vestido durazno"
                  />
                </label>
                <label className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={markAsCover}
                    onChange={(event) => setMarkAsCover(event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  Marcar como portada
                </label>
              </div>

              <label className="mt-4 flex cursor-pointer items-center justify-center rounded-[1.6rem] border border-dashed border-primary/40 bg-white/5 px-6 py-8 text-center transition hover:bg-white/8">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <span className="max-w-sm text-sm text-white/75">
                  Haz clic aqui para subir una foto. Soporta `jpg`, `png`, `webp` y `avif` hasta 10 MB.
                </span>
              </label>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {selectedProduct.images.length === 0 ? (
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                    Este producto todavia no tiene imagenes.
                  </div>
                ) : (
                  selectedProduct.images.map((image) => (
                    <div key={image.id} className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/6">
                      <div className="relative aspect-square bg-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={buildStoragePublicUrl(image.storage_path)}
                          alt={image.alt_text ?? selectedProduct.name}
                          className="h-full w-full object-cover"
                        />
                        {image.is_cover ? (
                          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                            Portada
                          </span>
                        ) : null}
                      </div>
                      <div className="space-y-3 p-4">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {image.alt_text || "Sin texto alternativo"}
                          </p>
                          <p className="mt-1 break-all text-xs text-white/40">{image.storage_path}</p>
                        </div>
                        <div className="flex gap-2">
                          {!image.is_cover ? (
                            <button
                              type="button"
                              onClick={() => handleSetCover(image)}
                              className="flex-1 rounded-full border border-primary/40 px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-foreground"
                            >
                              Poner portada
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(image)}
                            className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/70 transition hover:bg-white/10"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-white/5 p-6 text-sm text-white/65">
              Guarda un producto primero y luego aqui mismo podras subirle imagenes.
            </div>
          )}
        </div>

        {message ? (
          <div className="rounded-[1.4rem] border border-primary/20 bg-primary-light/60 px-5 py-4 text-sm font-semibold text-foreground">
            {message}
          </div>
        ) : null}
      </section>
    </div>
  );
}
