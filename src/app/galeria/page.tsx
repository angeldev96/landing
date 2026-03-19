import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import { buildStoragePublicUrl, parseGalleryPageData } from "@/lib/crochet-landing";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

function resolvePage(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function createPageHref(page: number) {
  return page <= 1 ? "/galeria" : `/galeria?page=${page}`;
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = resolvePage(params.page);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_crochet_landing_gallery_page", {
    input_page: currentPage,
    input_page_size: PAGE_SIZE,
  });

  if (error) {
    throw new Error(error.message);
  }

  const gallery = parseGalleryPageData((data ?? null) as Json);
  const previousPage = Math.max(1, gallery.page - 1);
  const nextPage = Math.min(gallery.totalPages, gallery.page + 1);

  return (
    <main className="min-h-screen bg-background pb-16">
      <section className="relative overflow-hidden border-b border-primary/10 bg-background-dark text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(195,180,253,0.22),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.14),_transparent_26%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/75 transition hover:bg-white/10"
          >
            ← Volver al inicio
          </Link>
          <div className="mt-8 max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-primary">Galeria completa</p>
            <h1 className="font-display text-5xl leading-none sm:text-6xl lg:text-7xl">
              Cada pieza tiene su propia historia tejida.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Explora todas las creaciones disponibles, entra al detalle de cada producto y mira sus fotos con calma
              antes de escribir por Instagram.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-primary/20 bg-surface/75 px-5 py-5 shadow-xl shadow-primary/5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-dark">Resultados</p>
            <h2 className="font-display text-3xl text-foreground">
              {gallery.totalProducts} producto{gallery.totalProducts === 1 ? "" : "s"} en catalogo
            </h2>
          </div>
          <div className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm font-semibold text-foreground-light">
            Pagina {gallery.page} de {gallery.totalPages}
          </div>
        </div>

        {gallery.items.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-primary/30 bg-surface/70 p-8 text-center shadow-xl shadow-primary/5">
            <h3 className="font-display text-4xl text-foreground">La galeria aun esta vacia</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground-light">
              Cuando el admin publique productos nuevos, apareceran aqui automaticamente.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {gallery.items.map((product, index) => (
              <Link
                key={product.id}
                href={`/galeria/${product.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-primary/15 bg-surface shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-primary/10">
                  {product.coverPath ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={buildStoragePublicUrl(product.coverPath)}
                        alt={product.coverAlt ?? product.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/70 to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-bold uppercase tracking-[0.22em] text-primary-dark">
                      Sin foto principal
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <span className="rounded-full bg-surface/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-dark backdrop-blur-sm">
                      {product.badge || "Hecho a mano"}
                    </span>
                    <span className="rounded-full bg-foreground/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                      {product.imageCount} foto{product.imageCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="font-display text-3xl text-foreground">{product.name}</h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-foreground-light">
                    {product.description || "Descubre esta pieza en detalle y revisa su galeria completa."}
                  </p>
                  <span className="inline-flex text-sm font-bold text-primary-dark transition group-hover:translate-x-1">
                    Ver producto →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 rounded-[2rem] border border-primary/20 bg-primary-light/45 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">Navegacion de la galeria</p>
            <p className="text-sm text-foreground-light">
              Mostramos {gallery.pageSize} productos por pagina para que todo cargue rapido y se vea fluido.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={createPageHref(previousPage)}
              aria-disabled={gallery.page <= 1}
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                gallery.page <= 1
                  ? "pointer-events-none border border-primary/15 bg-surface/60 text-foreground-light/40"
                  : "border border-primary/30 bg-surface text-foreground hover:bg-primary/10"
              }`}
            >
              ← Anterior
            </Link>
            <Link
              href={createPageHref(nextPage)}
              aria-disabled={gallery.page >= gallery.totalPages}
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                gallery.page >= gallery.totalPages
                  ? "pointer-events-none bg-primary/30 text-foreground-light/40"
                  : "bg-primary text-foreground hover:bg-primary-dark hover:text-white"
              }`}
            >
              Siguiente →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
