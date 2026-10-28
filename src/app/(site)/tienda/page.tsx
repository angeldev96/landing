import type { Metadata } from "next";
import Link from "next/link";
import { getCatalogProducts, groupByCategory } from "@/lib/catalog";
import { STORE_CATEGORIES, categoryHref, findCategoryBySlug } from "@/lib/categories";
import { buildWhatsappUrl } from "@/lib/site";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";
import { ProductCard } from "@/components/site/product-card";
import { JsonLd } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

type StoreSearchParams = Promise<{ categoria?: string }>;

const STORE_TITLE = "Tienda de crochet en Honduras: amigurumis, flores y bolsos";
const STORE_DESCRIPTION =
  "Comprá crochet hecho a mano en Honduras: amigurumis, flores eternas, bolsos, cojines, accesorios, ropa de bebé y regalos personalizados. Pedí por WhatsApp.";

function categoryTitle(name: string) {
  return `${name} de crochet en Honduras`;
}

function categoryDescription(desc: string) {
  return `${desc} Tejidos a mano en Honduras por Crochet CasRey. Pedí el tuyo o uno personalizado por WhatsApp.`;
}

// Each category is its own indexable URL (?categoria=slug); unknown values fall back to /tienda.
export async function generateMetadata({ searchParams }: { searchParams: StoreSearchParams }): Promise<Metadata> {
  const category = findCategoryBySlug((await searchParams).categoria);

  return category
    ? pageMetadata({
        title: categoryTitle(category.name),
        description: categoryDescription(category.desc),
        path: categoryHref(category),
      })
    : pageMetadata({ title: STORE_TITLE, description: STORE_DESCRIPTION, path: "/tienda" });
}

// How many products each category shows on the "Ver todo" view before linking to its own page.
const PREVIEW_COUNT = 4;

export default async function StorePage({
  searchParams,
}: {
  searchParams: StoreSearchParams;
}) {
  const params = await searchParams;
  const activeCategory = findCategoryBySlug(params.categoria);
  const products = await getCatalogProducts();
  const groups = groupByCategory(products);
  const visibleGroups = groups.filter((group) => group.products.length > 0);
  const activeGroup = activeCategory ? groups.find((group) => group.category.slug === activeCategory.slug) : null;
  const countFor = (slug: string) => groups.find((group) => group.category.slug === slug)?.products.length ?? 0;
  const hasOthers = countFor("otros") > 0;
  const listedProducts = activeGroup ? activeGroup.products : products;

  return (
    <main className="pb-16">
      <JsonLd
        data={[
          collectionPageJsonLd({
            name: activeCategory ? categoryTitle(activeCategory.name) : STORE_TITLE,
            description: activeCategory ? categoryDescription(activeCategory.desc) : STORE_DESCRIPTION,
            path: activeCategory ? categoryHref(activeCategory) : "/tienda",
            items: listedProducts.map((product) => ({
              name: product.name,
              path: `/tienda/${product.slug}`,
              image: buildStoragePublicUrl(product.coverPath) || undefined,
            })),
          }),
          breadcrumbJsonLd([
            { name: "Tienda", path: "/tienda" },
            ...(activeCategory ? [{ name: activeCategory.name, path: categoryHref(activeCategory) }] : []),
          ]),
        ]}
      />
      {/* ─── HEADER ─── */}
      <section className="relative overflow-hidden border-b border-primary/10 bg-background-dark text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(195,180,253,0.22),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.14),_transparent_26%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-primary">
              {activeCategory ? "Tienda · Categoría" : "Tienda"}
            </p>
            <h1 className="font-display text-5xl leading-none sm:text-6xl lg:text-7xl">
              {activeCategory ? `${activeCategory.name} de crochet` : "Cada pieza tiene su propia historia tejida."}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              {activeCategory
                ? activeCategory.desc
                : "Crochet hecho a mano en Honduras. Explorá nuestras creaciones por categoría, entrá al detalle de cada producto y escribinos por WhatsApp para pedir la tuya."}
            </p>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY CHIPS ─── */}
      <div className="sticky top-16 z-30 border-b border-primary/10 bg-background/85 backdrop-blur-xl lg:top-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            <CategoryChip href="/tienda" label="Todos" count={products.length} active={!activeCategory} />
            {STORE_CATEGORIES.map((category) => (
              <CategoryChip
                key={category.slug}
                href={categoryHref(category)}
                label={category.name}
                count={countFor(category.slug)}
                active={activeCategory?.slug === category.slug}
              />
            ))}
            {hasOthers ? (
              <CategoryChip
                href="/tienda?categoria=otros"
                label="Más creaciones"
                count={countFor("otros")}
                active={activeCategory?.slug === "otros"}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {activeGroup ? (
          activeGroup.products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {activeGroup.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyCategory name={activeGroup.category.name} />
          )
        ) : visibleGroups.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-primary/30 bg-surface/70 p-8 text-center shadow-xl shadow-primary/5">
            <h2 className="font-display text-4xl text-foreground">La tienda aún está vacía</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground-light">
              Cuando publiquemos productos nuevos, aparecerán aquí automáticamente.
            </p>
          </div>
        ) : (
          <div className="space-y-14 lg:space-y-20">
            {visibleGroups.map(({ category, products: items }) => (
              <section key={category.slug} id={category.slug} className="scroll-mt-36">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
                  <div>
                    <h2 className="font-display text-4xl text-foreground lg:text-5xl">{category.name}</h2>
                    <p className="mt-1 text-sm text-foreground-light lg:text-base">{category.desc}</p>
                  </div>
                  {items.length > PREVIEW_COUNT ? (
                    <Link
                      href={categoryHref(category)}
                      className="shrink-0 text-sm font-bold text-primary-dark underline-offset-4 hover:underline"
                    >
                      Ver las {items.length} piezas →
                    </Link>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                  {items.slice(0, PREVIEW_COUNT).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ─── CUSTOM ORDER CTA ─── */}
        <div className="mt-14 flex flex-col gap-4 rounded-[2rem] border border-primary/20 bg-primary-light/45 p-6 md:flex-row md:items-center md:justify-between lg:mt-20 lg:p-8">
          <div>
            <p className="font-display text-3xl text-foreground">¿No encontrás lo que buscás?</p>
            <p className="mt-1 text-sm text-foreground-light">Tejemos regalos personalizados a la medida de tu idea.</p>
          </div>
          <a
            href={buildWhatsappUrl("¡Hola Crochet CasRey! Me gustaría pedir una pieza personalizada 🧶")}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-primary px-6 py-3 text-center text-sm font-bold text-foreground transition hover:bg-primary-dark hover:text-white"
          >
            Pedir personalizado por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}

function CategoryChip({ href, label, count, active }: { href: string; label: string; count: number; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
        active
          ? "border-primary-dark bg-primary text-foreground"
          : count > 0
            ? "border-primary/20 bg-surface text-foreground hover:bg-primary/10"
            : "border-primary/10 bg-surface/50 text-foreground-light/60 hover:bg-primary/5"
      }`}
    >
      {label}
      <span className={`text-xs ${active ? "text-foreground/70" : "text-foreground-light/70"}`}>
        {count > 0 ? count : "pronto"}
      </span>
    </Link>
  );
}

function EmptyCategory({ name }: { name: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-primary/30 bg-surface/70 p-8 text-center shadow-xl shadow-primary/5 lg:p-12">
      <h2 className="font-display text-4xl text-foreground">{name}: muy pronto</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-foreground-light">
        Todavía no hay piezas publicadas en esta categoría, pero podemos tejer una especialmente para vos.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href={buildWhatsappUrl(`¡Hola Crochet CasRey! Me interesa algo de ${name} 🧶`)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-foreground transition hover:bg-primary-dark hover:text-white"
        >
          Consultar por WhatsApp
        </a>
        <Link
          href="/tienda"
          className="rounded-full border border-primary/30 bg-surface px-6 py-3 text-sm font-bold text-foreground transition hover:bg-primary/10"
        >
          Ver toda la tienda
        </Link>
      </div>
    </div>
  );
}
