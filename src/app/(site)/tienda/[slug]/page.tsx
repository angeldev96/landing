import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailGallery } from "@/components/gallery/product-detail-gallery";
import { buildStoragePublicUrl, type ProductDetail } from "@/lib/crochet-landing";
import { getProductDetail } from "@/lib/catalog";
import { categoryHref, resolveCategory } from "@/lib/categories";
import { SOCIAL_LINKS, buildWhatsappUrl } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata, productJsonLd, toDescription } from "@/lib/seo";
import { SocialIcon } from "@/components/site/social-icon";
import { JsonLd } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

function productDescription(product: ProductDetail, categoryName: string) {
  return (
    toDescription(product.description) ||
    `${product.name} (${categoryName}): pieza de crochet hecha a mano en Honduras por Crochet CasRey. Pedí la tuya o una versión personalizada por WhatsApp.`
  );
}

// Cover first, then the rest of the gallery in the order the owner set.
function productImages(product: ProductDetail) {
  return [...product.images]
    .sort((left, right) => Number(right.isCover) - Number(left.isCover) || left.sortOrder - right.sortOrder)
    .map((image) => ({ url: buildStoragePublicUrl(image.storagePath), alt: image.altText ?? product.name }))
    .filter((image) => image.url);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProductDetail((await params).slug);

  if (!product) {
    return { title: "Producto no encontrado", robots: { index: false } };
  }

  const category = resolveCategory(product.badge);

  return pageMetadata({
    title: `${product.name} · ${category.name} de crochet`,
    description: productDescription(product, category.name),
    path: `/tienda/${product.slug}`,
    images: productImages(product).slice(0, 4),
  });
}

export default async function ProductDetailPage({ params }: Params) {
  const product = await getProductDetail((await params).slug);

  if (!product) {
    notFound();
  }

  const cover = product.images.find((image) => image.isCover) ?? product.images[0] ?? null;
  const category = resolveCategory(product.badge);
  const whatsappUrl = buildWhatsappUrl(`¡Hola Crochet CasRey! Me interesa "${product.name}" que vi en la tienda 🧶`);

  return (
    <main className="pb-16">
      <JsonLd
        data={[
          productJsonLd({
            name: product.name,
            description: productDescription(product, category.name),
            path: `/tienda/${product.slug}`,
            images: productImages(product).map((image) => image.url),
            category: category.name,
          }),
          breadcrumbJsonLd([
            { name: "Tienda", path: "/tienda" },
            { name: category.name, path: categoryHref(category) },
            { name: product.name, path: `/tienda/${product.slug}` },
          ]),
        ]}
      />
      <section className="border-b border-primary/10 bg-surface/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-10">
          <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-2 text-sm font-bold text-foreground-light">
            <Link href="/tienda" className="rounded-full border border-primary/20 bg-surface px-4 py-2 text-foreground transition hover:bg-primary/10">
              ← Tienda
            </Link>
            <span>/</span>
            <Link href={categoryHref(category)} className="transition hover:text-primary-dark">
              {category.name}
            </Link>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary-light px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-primary-dark">
              {category.name}
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
              {product.description ||
                "Pieza de crochet hecha a mano en Honduras con el estilo delicado de Crochet CasRey. Podés pedirla igual o personalizada con tus colores por WhatsApp."}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-primary/15 bg-background p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-dark">Portada</p>
                <p className="mt-2 text-sm text-foreground-light">
                  {cover?.altText || "Imagen principal del producto seleccionada por la tienda."}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-primary/15 bg-background p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-dark">Galería</p>
                <p className="mt-2 text-sm text-foreground-light">
                  Toca una miniatura para cambiar la foto principal en celular o escritorio.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.2rem] border border-primary/15 bg-background-dark text-white shadow-2xl shadow-primary/10">
            <div className="space-y-4 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">¿Te gustó esta pieza?</p>
              <h2 className="font-display text-4xl leading-none">Escribinos por WhatsApp y la hacemos tuya.</h2>
              <p className="text-sm leading-relaxed text-white/70">
                Revisá los detalles y escribinos directamente para pedir tu versión o una personalizada.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-foreground transition hover:bg-primary-dark hover:text-white"
                >
                  <SocialIcon network="whatsapp" className="h-4 w-4" />
                  Pedir por WhatsApp
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <SocialIcon network="instagram" className="h-4 w-4" />
                  Ver en Instagram
                </a>
              </div>
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
