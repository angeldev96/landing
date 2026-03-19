import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailGallery } from "@/components/gallery/product-detail-gallery";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import { buildStoragePublicUrl, parseProductDetail } from "@/lib/crochet-landing";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_crochet_landing_product_detail", {
    input_slug: slug,
  });

  if (error) {
    throw new Error(error.message);
  }

  const product = parseProductDetail((data ?? null) as Json);

  if (!product) {
    notFound();
  }

  const cover = product.images.find((image) => image.isCover) ?? product.images[0] ?? null;

  return (
    <main className="min-h-screen bg-background pb-16">
      <section className="border-b border-primary/10 bg-surface/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-10">
          <Link
            href="/galeria"
            className="inline-flex w-fit rounded-full border border-primary/20 bg-surface px-4 py-2 text-sm font-bold text-foreground transition hover:bg-primary/10"
          >
            ← Volver a la galeria
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary-light px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-primary-dark">
              {product.badge || "Pieza artesanal"}
            </span>
            <span className="rounded-full border border-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-foreground-light">
              {product.images.length} foto{product.images.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:px-10 lg:py-12">
        <ProductDetailGallery productName={product.name} images={product.images} />

        <div className="space-y-6">
          <div className="rounded-[2.2rem] border border-primary/15 bg-surface/85 p-6 shadow-xl shadow-primary/5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-dark">Detalle del producto</p>
            <h1 className="mt-3 font-display text-5xl leading-none text-foreground sm:text-6xl">{product.name}</h1>
            <p className="mt-5 text-base leading-relaxed text-foreground-light sm:text-lg">
              {product.description || "Pieza artesanal hecha a mano con el estilo delicado de Crochet CasRey."}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-primary/15 bg-background p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-dark">Portada</p>
                <p className="mt-2 text-sm text-foreground-light">
                  {cover?.altText || "Imagen principal del producto seleccionada por la tienda."}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-primary/15 bg-background p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-dark">Galeria</p>
                <p className="mt-2 text-sm text-foreground-light">
                  Toca una miniatura para cambiar la foto principal en celular o escritorio.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.2rem] border border-primary/15 bg-background-dark text-white shadow-2xl shadow-primary/10">
            <div className="space-y-4 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Te gusto esta pieza?</p>
              <h2 className="font-display text-4xl leading-none">Conversemos por Instagram y la hacemos tuya.</h2>
              <p className="text-sm leading-relaxed text-white/70">
                Puedes usar esta pagina para revisar detalles y luego escribir directamente para pedir tu version o una
                personalizada.
              </p>
              <a
                href="https://www.instagram.com/crochetcasrey/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-foreground transition hover:bg-primary-dark hover:text-white"
              >
                Pedir por Instagram
              </a>
            </div>

            {cover ? (
              <div className="relative aspect-[16/9] border-t border-white/10 bg-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={buildStoragePublicUrl(cover.storagePath)}
                  alt={cover.altText ?? product.name}
                  className="h-full w-full object-cover opacity-85"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
