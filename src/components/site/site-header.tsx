import Link from "next/link";
import Image from "next/image";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { categoryCover, getCatalogProductsSafe, groupByCategory } from "@/lib/catalog";
import { STORE_CATEGORIES, categoryHref } from "@/lib/categories";
import { LEARN_SECTIONS, MAIN_ACTION_LABEL, NAV_LINKS, PATTERN_SECTIONS, SOCIAL_LINKS } from "@/lib/site";
import { MobileMenu } from "@/components/site/mobile-menu";
import { SocialIcon } from "@/components/site/social-icon";

function piezas(count: number) {
  return `${count} pieza${count === 1 ? "" : "s"}`;
}

/*
 * The fixed, opaque bar (tasteskill nav-split): the words on the left, the logo in the middle and the
 * one main action on the right. Tienda, Patrones and Aprende open a full-width flat panel on hover or
 * focus; Tienda's panel shows every category with its photograph so the shop reads as sections,
 * not as one long list of names.
 */
export async function SiteHeader() {
  const groups = groupByCategory(await getCatalogProductsSafe()).filter((group) => group.products.length > 0);
  const shopCards = groups
    .map((group) => ({ group, cover: categoryCover(group) }))
    .filter((item) => item.cover && item.group.category.slug !== "otros")
    .slice(0, 5);
  const countFor = (slug: string) => groups.find((group) => group.category.slug === slug)?.products.length ?? 0;

  const panels: Record<string, React.ReactNode> = {
    Tienda: (
      <div className="nav-panel__grid">
        <ul className="nav-panel__links">
          <li>
            <Link href="/tienda" className="nav-panel__link">
              Toda la tienda
            </Link>
          </li>
          {STORE_CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link href={categoryHref(category)} className="nav-panel__link">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
        {shopCards.length ? (
          <ul className="nav-panel__cards" style={{ "--n": shopCards.length } as React.CSSProperties}>
            {shopCards.map(({ group, cover }) => (
              <li key={group.category.slug}>
                <Link href={categoryHref(group.category)} className="card nav-card">
                  <span className="card__media">
                    <Image
                      src={buildStoragePublicUrl(cover!.coverPath)}
                      alt=""
                      fill
                      sizes="200px"
                      className="frame__img"
                    />
                  </span>
                  <span className="card__body">
                    <span className="card__title">{group.category.name}</span>
                    <span className="card__meta">{piezas(countFor(group.category.slug))}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    ),
    Patrones: (
      <ul className="nav-panel__cols">
        {PATTERN_SECTIONS.map((section) => (
          <li key={section.id}>
            <Link href={`/patrones#${section.id}`} className="nav-panel__link">
              {section.title}
            </Link>
            <p className="muted">{section.desc}</p>
          </li>
        ))}
      </ul>
    ),
    Aprende: (
      <ul className="nav-panel__cols">
        {LEARN_SECTIONS.map((section) => (
          <li key={section.id}>
            <Link href={`/aprende#${section.id}`} className="nav-panel__link">
              {section.title}
            </Link>
            <p className="muted">{section.desc}</p>
          </li>
        ))}
      </ul>
    ),
  };

  return (
    <header className="nav nav--split" id="top">
      <div className="wrap nav__bar">
        <a href="#contenido" className="nav__skip">
          Saltar al contenido
        </a>

        <nav className="nav__words" aria-label="Principal">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="nav__item">
                <Link href={link.href} className="nav__word">
                  {link.label}
                </Link>
                {panels[link.label] ? (
                  <div className="nav-panel">
                    <div className="wrap">{panels[link.label]}</div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/" className="nav__brand nav__logo" aria-label="Crochet CasRey, inicio">
          <Image src="/android-chrome-192x192.png" alt="" width={40} height={40} className="nav__mark" priority />
          <span className="nav__name">Crochet CasRey</span>
        </Link>

        <div className="nav__actions">
          <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn--primary nav__cta">
            <SocialIcon network="whatsapp" className="btn__icon" />
            {MAIN_ACTION_LABEL}
          </a>
          <MobileMenu
            links={NAV_LINKS}
            categories={STORE_CATEGORIES.map((category) => ({
              label: category.name,
              href: categoryHref(category),
              count: countFor(category.slug),
            }))}
          />
        </div>
      </div>
    </header>
  );
}
