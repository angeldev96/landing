import Link from "next/link";
import Image from "next/image";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { getCatalogProducts, groupByCategory, type CatalogProduct } from "@/lib/catalog";
import { categoryHref } from "@/lib/categories";
import { SOCIAL_LABELS, SOCIAL_LINKS, buildWhatsappUrl, type SocialNetwork } from "@/lib/site";
import { ProductCard } from "@/components/site/product-card";
import { SocialIcon } from "@/components/site/social-icon";

/* ─── Fallback images (used when the catalog can't be loaded) ─── */
const fallbackImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDU9qIUSMfJ0BHbxCddEahL3U44sT2cDcXtNzigC_e5gAQotBA8Av_WcWRYBEA-ZWYeFmvSfN_WZAHDPXbQRNg15-HnDolbyl_xaHGFK0UG5xb3CA8AOAX8vl5cTcinZ-1IGz_Hhry9d7oTgV36RKBz2AfBRCxkA_SHkK3yz--EABpkcX48k8P43LijMrNIUH4RMjJYSeV0TnZOlm0EhZRigyHNCaCGj8hI6Hv2IBLuPa38p7wEZaLIhT_E3-fXogqFW7seRosWAA",
    alt: "Amigurumi hecho a mano",
    href: "/tienda",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMpHDTmSNzyAZdcjQhOjazwz-w2Afr3UCUfFx9S2BudTfzTaefWQBxR0x0rCMwx1vy_-7RkQiOxQgJo4WmGlX4-Ar8f6EZB0Gk0bJ4hEZKEmBB7eb3h4zj5KBjoAlRVda6yPARRU04x5ddPidFwax8MMUpWqhZKt8tehNF4ARQ39KQP2T1z9nLG67UV58iHx-N0cz9YlzhWSN8hZwhssQwPQF0k-0kmWBzvyqz34hluHk-EAA8reyfxNymCF9wlAd5A64HRqy3HA",
    alt: "Pop Style Star amigurumi",
    href: "/tienda",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqNcYRfb46-_BeY_Qc6zig2WS0PPxJi963j_lX-IzbZFxDyVRNSosRrFc9ZlkDsQGd34R5ZeZOFf4w_4DrwbhyczilFWZ8FKi4wsniTU0u8Q2ZSSsQD0Pfpypi64piz774aPChNsmzHs3rEdC8352krmfvUCraruerwh1qnsqEm8_wkfYb2Knu_TftufT9sCBdJ7GOMQBwUqz-9-wDMCQXgFutjHdRzRpN9OUNmZ4RwQXPqo-Ry38aZUPmshH0CmzYxhJw52XAjQ",
    alt: "Conejito Soft amigurumi",
    href: "/tienda",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjsz4o5X71MIq4j5lzcjKnk9DY1R5y25QV6nVSw0uwv9Mlcj3NiwSQa_cwwOTdZHzWar0yq8uvLJ2sgF5BIOM1_c0F2gQ72Dt5PzXOynk88RAguqb1CaSEyiT4ugwE6_R6D9X6vW5XONNTrhsOwcBDjw9Lsav57VkYNkKmDgvAk-1W0MDRBsuThjYyHzytGWu9W0xdWpwL3XGmLNjr9Zei1p0FjxppgRoUq28f8BhjJa3aQJPHB5lCzdZ3Pz9VyDxu7JtZ-NDkYg",
    alt: "Muñeca personalizada crochet",
    href: "/tienda",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaNRG3XeoMVcYODhOhzOk1Kep9xN68dcOse_KbyNZ7-ORH_UpoIN0n3pMfsY8C-fXYdZ7hLQ5mrE6pXivsoq8JOTb3rxZjLGYu8K7rZbmtQbzNor32bIabohwDKUQPHTFV0oUyiUrDqqhrMNw5pwPIjqFVE-HBkpzUHhv0S9ccYABuqDLZEbwfaMA-FLwPLb7F2axMkWgCcs3E0PJWlMDJKgBPkUV82JxiaO65_LNN0sInNRfhu5KZPuJ7HOHfZqvIzi5uUJnEXg",
    alt: "Flores eternas de crochet",
    href: "/tienda",
  },
];

const HERO_IMAGE_COUNT = 5;
const FEATURED_COUNT = 8;

async function loadCatalog() {
  try {
    return await getCatalogProducts();
  } catch {
    return [];
  }
}

// Picks one product per category first so the cover shows the variety of the catalog.
function pickHeroProducts(products: CatalogProduct[]) {
  const withCover = products.filter((product) => product.coverPath);
  const picked: CatalogProduct[] = [];

  for (const product of withCover) {
    if (!picked.some((item) => item.category.slug === product.category.slug)) {
      picked.push(product);
    }
  }

  for (const product of withCover) {
    if (picked.length >= HERO_IMAGE_COUNT) break;
    if (!picked.includes(product)) picked.push(product);
  }

  return picked.slice(0, HERO_IMAGE_COUNT);
}

const steps = [
  {
    num: "01",
    title: "Elegí tu pieza",
    desc: "Mirá la tienda o enviame por WhatsApp una foto o referencia de lo que te gustaría que tejiera. Cualquier idea puede convertirse en un pedido único.",
  },
  {
    num: "02",
    title: "Presupuesto y anticipo",
    desc: "Acordamos detalles, tamaño, colores y precio. Se reserva con un pequeño anticipo.",
  },
  {
    num: "03",
    title: "Pedido listo",
    desc: "Te aviso cuando tu pedido esté terminado para ser entregado o enviado a donde quieras.",
  },
];

const contactNetworks: { network: SocialNetwork; cta: string }[] = [
  { network: "whatsapp", cta: "Escribime" },
  { network: "instagram", cta: "Seguime" },
  { network: "facebook", cta: "Visitame" },
  { network: "tiktok", cta: "Mirá mis videos" },
];

/* ─── SVG decorations ─── */
function YarnBall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="currentColor" opacity="0.12" />
      <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path
        d="M30 60C30 60 45 30 60 30C75 30 90 60 90 60C90 60 75 90 60 90C45 90 30 60 30 60Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.2"
      />
      <path d="M60 10C60 10 30 45 30 60C30 75 60 110 60 110" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <path d="M60 10C60 10 90 45 90 60C90 75 60 110 60 110" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
    </svg>
  );
}

// Collage cells: one big tile and four small ones.
const collageCells = [
  "col-span-2 row-span-2",
  "col-start-3 row-start-1",
  "col-start-3 row-start-2",
  "col-start-1 row-start-3",
  "col-span-2 col-start-2 row-start-3",
];

/* ─── Page ─── */
export default async function Home() {
  const products = await loadCatalog();
  const heroProducts = pickHeroProducts(products);
  const heroImages =
    heroProducts.length >= HERO_IMAGE_COUNT
      ? heroProducts.map((product) => ({
          src: buildStoragePublicUrl(product.coverPath),
          alt: product.coverAlt ?? product.name,
          href: `/tienda/${product.slug}`,
        }))
      : fallbackImages;
  const categoryGroups = groupByCategory(products).filter(
    (group) => group.products.length > 0 && group.category.slug !== "regalos-personalizados",
  );
  const featured = products.slice(0, FEATURED_COUNT);

  return (
    <main>
      {/* ─── HERO ─── */}
      <section id="inicio" className="relative overflow-hidden">
        <YarnBall className="absolute -right-10 -top-10 hidden h-40 w-40 animate-spin-slow text-primary lg:block" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
            {/* Text side */}
            <div className="animate-fade-in-up space-y-6 lg:w-1/2 lg:space-y-8">
              <span className="inline-block rounded-full border border-primary/30 bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-dark">
                Hecho a mano en Honduras
              </span>
              <h1 className="font-display text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
                Amigurumis y tejidos{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">personalizados</span>
                  <span className="absolute bottom-1 left-0 h-3 w-full -skew-x-3 rounded-sm bg-primary/30 lg:h-4" />
                </span>
              </h1>
              <p className="max-w-lg text-base font-medium leading-relaxed text-foreground-light lg:text-lg">
                Regalos únicos y eternos, hechos a mano con amor. Cada punto cuenta una historia diferente pensada
                especialmente para vos.
              </p>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-bold text-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary-dark hover:text-white hover:shadow-primary-dark/30 active:scale-95"
                >
                  <SocialIcon network="whatsapp" />
                  Pedí por WhatsApp
                </a>
                <Link
                  href="/tienda"
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-primary/40 px-8 py-4 text-base font-bold text-foreground transition-all hover:bg-primary/10"
                >
                  Ver productos →
                </Link>
              </div>
            </div>

            {/* Catalog collage */}
            <div className="mt-10 animate-fade-in-up delay-200 lg:mt-0 lg:w-1/2">
              <div className="grid aspect-square grid-cols-3 grid-rows-3 gap-3 lg:gap-4">
                {heroImages.map((image, index) => (
                  <Link
                    key={`${image.src}-${index}`}
                    href={image.href}
                    className={`group relative overflow-hidden rounded-2xl bg-primary/10 shadow-lg shadow-primary/10 lg:rounded-3xl ${collageCells[index]}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes={index === 0 ? "(min-width: 1024px) 33vw, 66vw" : "(min-width: 1024px) 17vw, 33vw"}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={index === 0}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      {categoryGroups.length > 0 ? (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mb-8 flex items-end justify-between lg:mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary-dark">Tienda</span>
                <h2 className="mt-2 font-display text-3xl font-bold text-foreground lg:text-4xl">Explorá por categoría</h2>
              </div>
              <Link href="/tienda" className="text-sm font-bold text-primary-dark underline-offset-4 hover:underline">
                Ver todo →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {categoryGroups.map(({ category, products: items }) => {
                const cover = items.find((item) => item.coverPath);

                return (
                  <Link
                    key={category.slug}
                    href={categoryHref(category)}
                    className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-primary/10 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 lg:rounded-3xl"
                  >
                    {cover ? (
                      <Image
                        src={buildStoragePublicUrl(cover.coverPath)}
                        alt={category.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6">
                      <h3 className="font-display text-2xl text-white lg:text-4xl">{category.name}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                        {items.length} pieza{items.length === 1 ? "" : "s"} →
                      </p>
                    </div>
                  </Link>
                );
              })}
              <a
                href={buildWhatsappUrl("¡Hola Crochet CasRey! Me gustaría pedir una pieza personalizada 🧶")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex aspect-[4/5] flex-col justify-end rounded-2xl border-2 border-dashed border-primary/40 bg-primary/10 p-4 transition-all duration-500 hover:bg-primary/20 lg:rounded-3xl lg:p-6"
              >
                <span className="font-display text-2xl text-foreground lg:text-4xl">Regalos personalizados</span>
                <span className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-primary-dark">
                  Pedí el tuyo por WhatsApp →
                </span>
              </a>
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── FEATURED ─── */}
      {featured.length > 0 ? (
        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mb-8 lg:mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-dark">Recién tejidos</span>
              <h2 className="mt-2 font-display text-3xl font-bold text-foreground lg:text-4xl">Nuestras creaciones</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 flex justify-center lg:mt-10">
              <Link
                href="/tienda"
                className="rounded-full border border-primary/30 bg-surface px-7 py-3 text-sm font-bold text-foreground transition hover:bg-primary/10"
              >
                Ver toda la tienda
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── HOW TO ORDER ─── */}
      <section id="como-pedir" className="relative scroll-mt-20 overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 mx-4 rounded-[3rem] bg-gradient-to-b from-primary/5 via-primary/8 to-primary/5 lg:mx-0" />
        <YarnBall className="absolute -bottom-16 -left-16 hidden h-48 w-48 text-primary opacity-30 lg:block" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mb-10 text-center lg:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-dark">Proceso</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground lg:text-4xl">Cómo hacer tu pedido</h2>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="relative flex-1 animate-fade-in-up rounded-2xl border border-primary/15 bg-surface/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 lg:rounded-3xl lg:p-8"
                style={{ animationDelay: `${(i + 1) * 200}ms` }}
              >
                <div className="mb-4 flex items-center gap-4">
                  <span className="font-display text-5xl font-black leading-none text-primary/25 lg:text-6xl">{step.num}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground lg:text-xl">{step.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-foreground-light lg:text-base">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-bold text-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary-dark hover:text-white active:scale-95"
            >
              <SocialIcon network="whatsapp" />
              Empezar mi pedido
            </a>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL / HIGHLIGHT ─── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-background-dark p-8 lg:rounded-[3rem] lg:p-16">
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/15 blur-2xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
              <div className="space-y-6 lg:w-1/2">
                <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                  Lo que dicen
                </span>
                <blockquote className="font-display text-2xl font-bold leading-snug text-white lg:text-4xl">
                  &ldquo;Le regalé un amigurumi personalizado a mi hija y fue el regalo más especial que recibió. ¡La
                  calidad es increíble!&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/30 text-sm font-bold text-primary">
                    MC
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">María C.</p>
                    <p className="text-xs text-white/50">Cliente feliz</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 lg:w-1/2">
                {heroImages.slice(1, 3).map((image, index) => (
                  <div
                    key={`${image.src}-${index}`}
                    className={`relative aspect-[3/4] flex-1 overflow-hidden rounded-2xl ${index === 1 ? "translate-y-8" : ""}`}
                  >
                    <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contacto" className="scroll-mt-20 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mx-auto mb-10 max-w-2xl space-y-4 text-center lg:mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-dark">Contacto</span>
            <h2 className="font-display text-3xl font-bold text-foreground lg:text-5xl">¿Tenés una idea en mente?</h2>
            <p className="text-base font-medium text-foreground-light lg:text-lg">
              Dale vida con hilo y aguja. Contame qué te gustaría y lo hacemos realidad juntos.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {contactNetworks.map(({ network, cta }) => (
              <a
                key={network}
                href={SOCIAL_LINKS[network]}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 lg:flex-col lg:items-start lg:rounded-3xl lg:p-7 ${
                  network === "whatsapp" ? "border-primary/40 bg-primary/15" : "border-primary/15 bg-surface"
                }`}
              >
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
                    network === "whatsapp" ? "bg-[#25D366] text-white" : "bg-primary/20 text-foreground"
                  }`}
                >
                  <SocialIcon network={network} className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-bold text-foreground">{SOCIAL_LABELS[network].name}</span>
                  <span className="block truncate text-sm text-foreground-light">{SOCIAL_LABELS[network].handle}</span>
                  <span className="mt-2 hidden text-sm font-bold text-primary-dark transition group-hover:translate-x-1 lg:inline-block">
                    {cta} →
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
