import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { getCatalogProducts, groupByCategory, type CatalogProduct } from "@/lib/catalog";
import { categoryHref } from "@/lib/categories";
import { FAQS, SOCIAL_LABELS, SOCIAL_LINKS, buildWhatsappUrl, type SocialNetwork } from "@/lib/site";
import { SITE_DESCRIPTION, SITE_TITLE, collectionPageJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductCard } from "@/components/site/product-card";
import { SocialIcon } from "@/components/site/social-icon";
import { StitchLine, Stitches } from "@/components/site/stitches";

export const metadata: Metadata = pageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

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
    title: "Elegí tu pieza o contame tu idea",
    desc: "Mirá la tienda o mandame por WhatsApp una foto o referencia de lo que te gustaría. Cualquier idea puede convertirse en un pedido único.",
  },
  {
    title: "Acordamos detalles y precio",
    desc: "Definimos tamaño, colores y precio. Reservás tu pedido con un pequeño anticipo.",
  },
  {
    title: "Recibí tu pedido",
    desc: "Te aviso cuando esté terminado y coordinamos la entrega o el envío a donde lo necesités.",
  },
];

const heroFacts = ["Tejido a mano en Honduras", "Diseños a tu medida", "Entregas y envíos"];

const otherNetworks: SocialNetwork[] = ["instagram", "facebook", "tiktok"];

const CUSTOM_ORDER_MESSAGE = "¡Hola Crochet CasRey! Me gustaría pedir una pieza personalizada 🧶";

// Hero mosaic: one tall tile and four small ones on a 3×3 grid.
const collageCells = [
  "col-span-2 row-span-2",
  "col-start-3 row-start-1",
  "col-start-3 row-start-2",
  "col-start-1 row-start-3",
  "col-span-2 col-start-2 row-start-3",
];

/* Small heart used as the bullet for the hero facts. */
function HeartBullet() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 shrink-0 text-foreground">
      <path
        fill="currentColor"
        d="M8 14.2 6.9 13.2C3 9.7.5 7.4.5 4.6.5 2.3 2.3.5 4.6.5c1.3 0 2.5.6 3.4 1.6C8.9 1.1 10.1.5 11.4.5c2.3 0 4.1 1.8 4.1 4.1 0 2.8-2.5 5.1-6.4 8.6L8 14.2Z"
      />
    </svg>
  );
}

function WhatsappButton({
  href = SOCIAL_LINKS.whatsapp,
  children,
  tone = "ink",
  className = "",
}: {
  href?: string;
  children: React.ReactNode;
  tone?: "ink" | "pink";
  className?: string;
}) {
  const tones = {
    ink: "bg-foreground text-white hover:bg-primary-dark",
    pink: "bg-pink text-foreground hover:bg-white",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-base font-bold transition-colors active:scale-[0.98] ${tones[tone]} ${className}`}
    >
      <SocialIcon network="whatsapp" className="size-5" />
      {children}
    </a>
  );
}

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
      <JsonLd
        data={[
          faqJsonLd(FAQS),
          ...(featured.length
            ? [
                collectionPageJsonLd({
                  name: "Crochet hecho a mano en Honduras",
                  description: SITE_DESCRIPTION,
                  path: "/",
                  items: featured.map((product) => ({
                    name: product.name,
                    path: `/tienda/${product.slug}`,
                    image: buildStoragePublicUrl(product.coverPath) || undefined,
                  })),
                }),
              ]
            : []),
        ]}
      />

      {/* ─── HERO: a pink patch sewn onto the page ─── */}
      <section id="inicio" className="px-3 pt-3 sm:px-6 lg:px-10 lg:pt-6">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-pink lg:rounded-[3rem]">
          <Stitches className="inset-2.5 text-white lg:inset-4" radius={26} animate />

          <div className="relative grid gap-10 px-6 pb-8 pt-10 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:px-16 lg:py-20">
            <div className="animate-fade-in-up">
              <h1 className="font-display text-[2.6rem] leading-[1.02] text-foreground sm:text-6xl lg:text-[4.4rem]">
                Amigurumis y regalos de crochet tejidos a mano
              </h1>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-foreground/80 lg:text-xl">
                Elegí una pieza de la tienda o mandame una foto de tu idea y la tejemos a tu medida, punto a punto, desde
                Honduras.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <WhatsappButton>Pedir por WhatsApp</WhatsappButton>
                <Link
                  href="/tienda"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-bold text-foreground transition-colors hover:bg-pink-light"
                >
                  Ver la tienda
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-foreground">
                {heroFacts.map((fact) => (
                  <li key={fact} className="flex items-center gap-2">
                    <HeartBullet />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid aspect-square grid-cols-3 grid-rows-3 gap-2.5 sm:gap-3 lg:gap-4">
              {heroImages.map((image, index) => (
                <Link
                  key={`${image.src}-${index}`}
                  href={image.href}
                  className={`group relative animate-scale-in overflow-hidden rounded-2xl bg-pink-light ring-4 ring-white lg:rounded-3xl ${collageCells[index]}`}
                  style={{ animationDelay: `${200 + index * 90}ms` }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={index === 0 ? "(min-width: 1024px) 30vw, 66vw" : "(min-width: 1024px) 15vw, 33vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index === 0}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      {categoryGroups.length > 0 ? (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mb-8 flex items-end justify-between gap-6 lg:mb-10">
              <h2 className="font-display text-3xl text-foreground lg:text-5xl">Elegí por categoría</h2>
              <Link
                href="/tienda"
                className="shrink-0 text-sm font-bold text-primary-dark underline decoration-2 underline-offset-4 hover:text-foreground"
              >
                Ver toda la tienda
              </Link>
            </div>

            <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4 lg:gap-6">
              {categoryGroups.map(({ category, products: items }) => {
                const cover = items.find((item) => item.coverPath);

                return (
                  <Link
                    key={category.slug}
                    href={categoryHref(category)}
                    className="group w-[44%] shrink-0 snap-start rounded-3xl sm:w-auto"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-pink-light">
                      {cover ? (
                        <Image
                          src={buildStoragePublicUrl(cover.coverPath)}
                          alt={`${category.name}: crochet hecho a mano en Honduras`}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 45vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <h3 className="mt-3 font-display text-xl text-foreground group-hover:text-primary-dark lg:text-2xl">
                      {category.name}
                    </h3>
                    <p className="text-sm text-foreground-light">
                      {items.length} pieza{items.length === 1 ? "" : "s"}
                    </p>
                  </Link>
                );
              })}

              <a
                href={buildWhatsappUrl(CUSTOM_ORDER_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-[44%] shrink-0 snap-start rounded-3xl sm:w-auto"
              >
                <div className="relative flex aspect-[4/5] flex-col justify-end rounded-3xl bg-primary-light p-5 transition-colors group-hover:bg-primary lg:p-7">
                  <Stitches className="inset-2.5 text-primary-dark/50" radius={16} />
                  <p className="relative text-base font-semibold leading-snug text-foreground lg:text-lg">
                    ¿No encontrás lo que buscás? Lo tejemos a partir de tu foto o idea.
                  </p>
                </div>
                <h3 className="mt-3 font-display text-xl text-foreground group-hover:text-primary-dark lg:text-2xl">
                  Regalos personalizados
                </h3>
                <p className="text-sm text-foreground-light">Pedilo por WhatsApp</p>
              </a>
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── HOW TO ORDER ─── */}
      <section id="como-pedir" className="scroll-mt-20 bg-primary-light py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-foreground lg:text-5xl">Cómo hacer tu pedido</h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground-light">
              Todo se coordina por WhatsApp, directo conmigo. Sin formularios ni cuentas.
            </p>
          </div>

          <ol className="relative mt-12 grid gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-12">
            {steps.map((step, index) => (
              <li key={step.title} className="relative flex gap-5 lg:block">
                {/* The thread that runs from this step's number to the next one. */}
                {index < steps.length - 1 ? (
                  <>
                    <StitchLine
                      vertical
                      className="absolute -bottom-8 left-[27px] top-16 w-px text-primary-dark/60 lg:hidden"
                    />
                    <StitchLine className="absolute -right-10 left-16 top-[27px] hidden h-px text-primary-dark/60 lg:block" />
                  </>
                ) : null}
                <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-foreground font-display text-2xl text-white">
                  {index + 1}
                </span>
                <div className="lg:mt-6">
                  <h3 className="text-xl font-bold text-foreground lg:text-2xl">{step.title}</h3>
                  <p className="mt-2 max-w-sm leading-relaxed text-foreground-light">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 lg:mt-14">
            <WhatsappButton>Empezar mi pedido</WhatsappButton>
          </div>
        </div>
      </section>

      {/* ─── FEATURED ─── */}
      {featured.length > 0 ? (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mb-8 flex items-end justify-between gap-6 lg:mb-10">
              <h2 className="font-display text-3xl text-foreground lg:text-5xl">Recién tejidos</h2>
              <Link
                href="/tienda"
                className="shrink-0 text-sm font-bold text-primary-dark underline decoration-2 underline-offset-4 hover:text-foreground"
              >
                Ver toda la tienda
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── CUSTOM ORDERS + TESTIMONIAL ─── */}
      <section className="px-3 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-background-dark text-white lg:rounded-[3rem]">
          <div className="grid gap-12 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-16 lg:py-20">
            <div>
              <h2 className="font-display text-3xl leading-tight lg:text-5xl">¿Tenés una idea? Mandame una foto y la tejemos.</h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/75">
                Tu mascota en amigurumi, un ramo con los colores favoritos de alguien o un detalle para un baby shower.
                Acordamos juntos el tamaño, los colores y cada detalle.
              </p>
              <WhatsappButton href={buildWhatsappUrl(CUSTOM_ORDER_MESSAGE)} tone="pink" className="mt-8">
                Pedir una pieza personalizada
              </WhatsappButton>
            </div>

            <figure className="relative rounded-3xl bg-white/[0.06] p-6 lg:p-8">
              <blockquote className="text-xl font-medium leading-relaxed lg:text-2xl">
                “Le regalé un amigurumi personalizado a mi hija y fue el regalo más especial que recibió. ¡La calidad es
                increíble!”
              </blockquote>
              <figcaption className="mt-5 text-sm text-white/65">María C., clienta</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="preguntas-frecuentes" className="scroll-mt-20 py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:px-10">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-3xl text-foreground lg:text-5xl">Preguntas frecuentes</h2>
            <p className="mt-4 max-w-sm text-lg leading-relaxed text-foreground-light">
              ¿Tu duda no está acá?{" "}
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary-dark underline decoration-2 underline-offset-4 hover:text-foreground"
              >
                Escribime por WhatsApp
              </a>{" "}
              y te respondo.
            </p>
          </div>

          <div className="border-t border-foreground/15">
            {FAQS.map((faq, index) => (
              <details key={faq.question} open={index === 0} className="group border-b border-foreground/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg font-bold text-foreground lg:text-xl">{faq.question}</h3>
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pink-light text-xl leading-none text-foreground transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 leading-relaxed text-foreground-light lg:text-lg">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT: closes the page with the same pink patch as the hero ─── */}
      <section id="contacto" className="scroll-mt-20 px-3 pb-16 sm:px-6 lg:px-10 lg:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-pink lg:rounded-[3rem]">
          <Stitches className="inset-2.5 text-white lg:inset-4" radius={26} />
          <div className="relative flex flex-col gap-10 px-6 py-12 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-16 lg:py-20">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl leading-tight text-foreground lg:text-6xl">Escribime y empezamos tu pedido</h2>
              <p className="mt-5 text-lg leading-relaxed text-foreground/80">
                Te respondo por WhatsApp al {SOCIAL_LABELS.whatsapp.handle}. También podés ver lo último que tejí en mis
                redes.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <WhatsappButton>Escribir por WhatsApp</WhatsappButton>
              <ul className="flex flex-wrap gap-2">
                {otherNetworks.map((network) => (
                  <li key={network}>
                    <a
                      href={SOCIAL_LINKS[network]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-pink-light"
                    >
                      <SocialIcon network={network} className="size-4" />
                      {SOCIAL_LABELS[network].name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
