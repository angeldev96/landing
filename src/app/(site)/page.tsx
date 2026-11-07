import { ViewTransition } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { displayProductName, getCatalogProductsSafe, productTransitionName, type CatalogProduct } from "@/lib/catalog";
import { categoryHref } from "@/lib/categories";
import { planHomePhotos } from "@/lib/home-photos";
import {
  CUSTOM_ORDER_MESSAGE,
  FAQS,
  LEARN_SECTIONS,
  MAIN_ACTION_LABEL,
  PATTERN_SECTIONS,
  SOCIAL_LINKS,
  buildWhatsappUrl,
} from "@/lib/site";
import { SITE_DESCRIPTION, SITE_TITLE, collectionPageJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { SocialIcon } from "@/components/site/social-icon";
import { WallPause } from "@/components/site/wall-pause";

export const metadata: Metadata = pageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

/*
 * tasteskill plan (product, site-kind other)
 * deal: hero photo (the catalog as a full-bleed wall, the words in a solid box) · palette brand
 * (paper, plum-brown ink, rose action, logo pink band) · type Fraunces / Figtree · radius soft ·
 * nav-split · footer-columns · close-type · rhythm brand-band · buttons arrow
 * 1 inicio          the catalog wall, h1, the main action                      1 screen
 * 2 categorias      five categories and the whole shop, six photo tiles (3 x 2)  1 screen
 * 3 recien          the four newest pieces                                     1 screen
 * 4 como-pedir      three steps beside one photograph (the page's split)       1 screen
 * 5 personalizados  custom gifts on the brand band, three photographs (trio)   1 screen
 * 6 aprende         patterns and lessons, two linked cards                     1 screen
 * 7 preguntas       four questions, open, beside one photograph               1 screen
 * footer.closing    contact: the main action set large, the four channels      1 screen (2 on a phone)
 * motion (the client asked for a livelier page, past tasteskill's hover-only rule for shops): the hero
 * wall drifts with a pause button, blocks rise in on scroll, large photographs drift in their frames,
 * a product's photograph travels into its page. All of it rests under reduced motion.
 */

const HOME_FAQ_QUESTIONS = [
  "¿Cuánto cuesta una pieza de crochet?",
  "¿Cuánto tarda en estar listo un pedido?",
  "¿Hacen envíos?",
  // The fourth answer shows from 640px up (a phone screen holds three).
  "¿Puedo pedir un amigurumi o regalo de crochet personalizado?",
];

const STEPS = [
  {
    title: "Elegí una pieza o mandá tu idea",
    desc: "Mirá la tienda o enviá por WhatsApp una foto de lo que te gustaría.",
  },
  {
    title: "Acordamos detalles y precio",
    desc: "Definimos tamaño, colores y precio, y reservás con un pequeño anticipo.",
  },
  {
    title: "Recibí tu pedido",
    desc: "Te avisamos cuando está listo y coordinamos la entrega o el envío.",
  },
];

// The hero wall: 7 columns of 3 photographs at 1440 (fewer columns on narrower screens, see globals.css).
// Column 0 sits on the right, where the words never cover it. A short catalog repeats its photographs
// so every column still holds a full set.
const HERO_COLUMNS = 7;
const HERO_ROWS = 3;

function heroColumns(products: CatalogProduct[]) {
  return Array.from({ length: HERO_COLUMNS }, (_, col) =>
    Array.from({ length: HERO_ROWS }, (_, row) => products[(col * HERO_ROWS + row) % products.length]),
  );
}

function piezas(count: number) {
  return `${count} pieza${count === 1 ? "" : "s"}`;
}

function productPhoto(product: CatalogProduct) {
  return {
    src: buildStoragePublicUrl(product.coverPath),
    alt: product.coverAlt ?? `${displayProductName(product.name)}, crochet hecho a mano`,
    href: `/tienda/${product.slug}`,
  };
}

export default async function Home() {
  const products = await getCatalogProductsSafe();
  const photos = planHomePhotos(products);
  const faqs = FAQS.filter((faq) => HOME_FAQ_QUESTIONS.includes(faq.question));
  const listed = [...photos.recent, ...photos.hero];

  return (
    <main className="home" id="contenido">
      <JsonLd
        data={[
          faqJsonLd(faqs),
          ...(listed.length
            ? [
                collectionPageJsonLd({
                  name: "Crochet hecho a mano en Honduras",
                  description: SITE_DESCRIPTION,
                  path: "/",
                  items: listed.map((product) => ({
                    name: displayProductName(product.name),
                    path: `/tienda/${product.slug}`,
                    image: buildStoragePublicUrl(product.coverPath) || undefined,
                  })),
                }),
              ]
            : []),
        ]}
      />

      {/* ─── 1 · INICIO: the catalog as a wall, the words in a solid box ─── */}
      <section className="hero hero--photo" id="inicio" aria-labelledby="inicio-h">
        {photos.hero.length ? (
          <>
            <div className="hero__wall" aria-hidden="true">
              {heroColumns(photos.hero).map((column, col) => (
                <div key={col} className="hero__col" style={{ "--col": col } as React.CSSProperties}>
                  {/* Each column holds its photographs twice and slides by one set, so the loop has no seam. */}
                  <div className="hero__reel">
                    {[...column, ...column].map((product, index) => (
                      <div key={`${product.id}-${index}`} className="hero__tile">
                        <Image
                          src={productPhoto(product).src}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 15vw, (min-width: 640px) 20vw, 34vw"
                          priority={col < 2 && index < HERO_ROWS}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <WallPause />
          </>
        ) : null}
        <div className="wrap hero__inner">
          <div className="hero-text">
            <div className="hero__text">
            <h1 id="inicio-h" className="t-h1 hero__h1">
              Crochet hecho a mano en Honduras
            </h1>
            <p className="t-lead hero__lead">
              Amigurumis, flores, bolsos y ropa de bebé tejidos punto a punto. Elegí entre las {products.length || "50"}{" "}
              piezas de la tienda o mandanos una foto de tu idea.
            </p>
            <div className="btn-row">
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
                data-main-cta
              >
                <SocialIcon network="whatsapp" className="btn__icon" />
                {MAIN_ACTION_LABEL}
              </a>
              <Link href="/tienda" className="btn btn--secondary">
                Ver la tienda
              </Link>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2 · CATEGORÍAS: the shop as sections, each with its photograph ─── */}
      {photos.categories.length ? (
        <section className="section" id="categorias" aria-labelledby="categorias-h">
          <div className="wrap section__wrap">
            <div className="section-head">
              <div>
                <h2 id="categorias-h" className="t-h2">
                  Amigurumis, flores, bolsos y ropa de bebé
                </h2>
                <p className="t-lead">Cada categoría tiene su página con las fotos de todas sus piezas.</p>
              </div>
            </div>
            <ul className="cats fill">
              {photos.categories.map(({ group, cover }) => (
                <li key={group.category.slug}>
                  <Link href={categoryHref(group.category)} className="card cat">
                    <span className="card__media">
                      <Image
                        src={buildStoragePublicUrl(cover.coverPath)}
                        alt={`${group.category.name} de crochet: ${displayProductName(cover.name)}`}
                        fill
                        sizes="(min-width: 1024px) 34vw, 60vw"
                        className="frame__img"
                      />
                    </span>
                    <span className="card__body">
                      <span className="card__title">{group.category.name}</span>
                      <span className="card__meta">{piezas(group.products.length)}</span>
                    </span>
                  </Link>
                </li>
              ))}
              {photos.all ? (
                <li>
                  <Link href="/tienda" className="card cat">
                    <span className="card__media">
                      <Image
                        src={buildStoragePublicUrl(photos.all.coverPath)}
                        alt={`${displayProductName(photos.all.name)}, crochet hecho a mano`}
                        fill
                        sizes="(min-width: 1024px) 34vw, 60vw"
                        className="frame__img"
                      />
                    </span>
                    <span className="card__body">
                      <span className="card__title">Toda la tienda</span>
                      <span className="card__meta">{piezas(products.length)}</span>
                    </span>
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ─── 3 · RECIÉN TEJIDAS ─── */}
      {photos.recent.length ? (
        <section className="section" id="recien" aria-labelledby="recien-h">
          <div className="wrap section__wrap">
            <div className="section-head">
              <h2 id="recien-h" className="t-h2">
                4 piezas recién tejidas
              </h2>
              <p className="t-lead">Lo último que salió del taller, listo para pedir igual o con tus colores.</p>
            </div>
            <ul className="picks fill">
              {photos.recent.map((product) => {
                const photo = productPhoto(product);

                return (
                  <li key={product.id}>
                    <Link href={photo.href} className="card pick">
                      <ViewTransition name={productTransitionName(product.id)} share="morph" default="none">
                        <span className="card__media">
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 60vw"
                            className="frame__img"
                          />
                        </span>
                      </ViewTransition>
                      <span className="card__body">
                        <span className="card__title">{displayProductName(product.name)}</span>
                        <span className="card__meta">{product.category.name}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ─── 4 · CÓMO PEDIR: the page's one split ─── */}
      <section className="section" id="como-pedir" aria-labelledby="como-pedir-h">
        <div className="wrap section__wrap split">
          <div className="split__text">
            <div className="section-head">
              <h2 id="como-pedir-h" className="t-h2">
                Pedidos por WhatsApp en 3 pasos
              </h2>
              <p className="t-lead">Todo se coordina por WhatsApp, directo con nosotras, sin formularios ni cuentas.</p>
            </div>
            <ol className="steps">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <span className="steps__n" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <p className="steps__title">{step.title}</p>
                    <p>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {photos.howToOrder ? (
            <Link href={productPhoto(photos.howToOrder).href} className="split__photo m-zoom">
              <Image
                src={productPhoto(photos.howToOrder).src}
                alt={productPhoto(photos.howToOrder).alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </Link>
          ) : null}
        </div>
      </section>

      {/* ─── 5 · PERSONALIZADOS: the brand band, three photographs ─── */}
      <section className="section ground-brand" id="personalizados" aria-labelledby="personalizados-h">
        <div className="wrap section__wrap">
          <div className="section-head section-head--row">
            <div>
              <h2 id="personalizados-h" className="t-h2">
                Crochet personalizado a partir de tu foto
              </h2>
              <p className="t-lead">
                Una muñeca con la ropa de tu hija, tu mascota en amigurumi o un ramo con sus colores favoritos.
              </p>
            </div>
            <a
              href={buildWhatsappUrl(CUSTOM_ORDER_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--secondary"
            >
              Enviar mi idea por WhatsApp
            </a>
          </div>
          {photos.custom.length ? (
            <ul className="trio fill">
              {photos.custom.map((product) => {
                const photo = productPhoto(product);

                return (
                  <li key={product.id}>
                    <Link href={photo.href} className="trio__photo m-zoom">
                      <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 34vw, 70vw" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </section>

      {/* ─── 6 · PATRONES Y APRENDE ─── */}
      <section className="section" id="aprende" aria-labelledby="aprende-h">
        <div className="wrap section__wrap">
          <div className="section-head">
            <h2 id="aprende-h" className="t-h2">
              Patrones y clases de crochet
            </h2>
            <p className="t-lead">Para quien quiere tejer sus propias piezas en casa, desde el primer punto.</p>
          </div>
          <div className="hubs fill">
            {[
              {
                title: "Biblioteca de patrones",
                href: "/patrones",
                photo: photos.patterns,
                links: PATTERN_SECTIONS.map((section) => ({ label: section.title, href: `/patrones#${section.id}` })),
              },
              {
                title: "Aprende crochet",
                href: "/aprende",
                photo: photos.learn,
                links: LEARN_SECTIONS.map((section) => ({ label: section.title, href: `/aprende#${section.id}` })),
              },
            ].map((hub) => (
              <article key={hub.href} className="card hub m-nolift">
                {hub.photo ? (
                  <Link href={hub.href} className="card__media m-zoom" tabIndex={-1} aria-hidden="true">
                    <Image
                      src={buildStoragePublicUrl(hub.photo.coverPath)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                    />
                  </Link>
                ) : null}
                <div className="hub__body">
                  <h3 className="t-h3">
                    <Link href={hub.href} className="hub__title">
                      {hub.title}
                    </Link>
                  </h3>
                  <ul className="hub__links">
                    {hub.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="link">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7 · PREGUNTAS FRECUENTES: every answer open ─── */}
      <section className="section" id="preguntas-frecuentes" aria-labelledby="preguntas-h">
        <div className="wrap section__wrap split split--faq">
          <div className="faq__side">
            <div className="section-head">
              <h2 id="preguntas-h" className="t-h2">
                Preguntas frecuentes
              </h2>
              <p className="t-lead">Si tu duda no está acá, escribinos por WhatsApp y te respondemos.</p>
            </div>
            {photos.faq ? (
              <Link href={productPhoto(photos.faq).href} className="faq__photo m-zoom">
                <Image
                  src={productPhoto(photos.faq).src}
                  alt={productPhoto(photos.faq).alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                />
              </Link>
            ) : null}
          </div>
          <dl className="faq">
            {faqs.map((faq, index) => (
              <div key={faq.question} className={index === 3 ? "faq__extra" : undefined}>
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
