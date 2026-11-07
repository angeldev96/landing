import Link from "next/link";
import Image from "next/image";
import { STORE_CATEGORIES, categoryHref } from "@/lib/categories";
import {
  LEARN_SECTIONS,
  MAIN_ACTION_LABEL,
  PATTERN_SECTIONS,
  SOCIAL_LABELS,
  SOCIAL_LINKS,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
  type SocialNetwork,
} from "@/lib/site";
import { SocialIcon } from "@/components/site/social-icon";

// Each channel with its real full-colour mark (public/icons, fetched by tasteskill's icons.mjs).
const CHANNELS: { network: SocialNetwork; href: string; icon: string }[] = [
  { network: "whatsapp", href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: "/icons/whatsapp.svg" },
  { network: "facebook", href: SOCIAL_LINKS.facebook, icon: "/icons/facebook.svg" },
  { network: "tiktok", href: SOCIAL_LINKS.tiktok, icon: "/icons/tiktok.svg" },
  { network: "instagram", href: SOCIAL_LINKS.instagram, icon: "/icons/instagram.svg" },
];

/*
 * The closing section of every page (tasteskill footer.closing): row 1 is the contact block with the
 * main action set large, row 2 the directory and the legal line. "Contacto" in the nav lands here.
 */
export function SiteFooter() {
  // Server Component: renders once per request on the server, so reading the clock is safe here.
  // oxlint-disable-next-line react/purity
  const year = new Date().getFullYear();

  return (
    <footer className="closing" id="contacto" aria-labelledby="contacto-h">
      <div className="wrap closing__wrap">
        <div className="closing__cta">
          <div className="closing__head">
            <h2 id="contacto-h" className="t-h2">
              Contacto y pedidos
            </h2>
            <p className="t-lead closing__lead">
              Te respondemos por WhatsApp al {WHATSAPP_DISPLAY}. En Facebook y TikTok publicamos cada pieza nueva.
            </p>
          </div>
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--xl"
            data-main-cta
          >
            {MAIN_ACTION_LABEL}
            <SocialIcon network="whatsapp" className="btn__icon" />
          </a>
          <ul className="channels">
            {CHANNELS.map((channel) => (
              <li key={channel.network}>
                <a href={channel.href} target="_blank" rel="noopener noreferrer" className="channel">
                  <Image src={channel.icon} alt="" width={32} height={32} className="channel__icon" unoptimized />
                  <span>
                    <span className="channel__name">{SOCIAL_LABELS[channel.network].name}</span>
                    <span className="channel__handle">{SOCIAL_LABELS[channel.network].handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="closing__dir">
          <div className="closing__cols">
            <Link href="/" className="closing__brand" aria-label="Crochet CasRey, inicio">
              <Image src="/android-chrome-192x192.png" alt="" width={48} height={48} className="closing__logo" />
              <span>Crochet CasRey</span>
            </Link>
            <div>
              <h3 className="closing__colhead">Tienda</h3>
              <ul>
                {STORE_CATEGORIES.slice(0, 6).map((category) => (
                  <li key={category.slug}>
                    <Link href={categoryHref(category)}>{category.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="closing__colhead">Patrones</h3>
              <ul>
                {PATTERN_SECTIONS.map((section) => (
                  <li key={section.id}>
                    <Link href={`/patrones#${section.id}`}>{section.title}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/#como-pedir">Cómo pedir</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="closing__colhead">Aprende</h3>
              <ul>
                {LEARN_SECTIONS.map((section) => (
                  <li key={section.id}>
                    <Link href={`/aprende#${section.id}`}>{section.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="closing__legal">
            <p>© {year} Crochet CasRey, tejido a mano en Honduras.</p>
            <p>WhatsApp, Facebook, TikTok e Instagram son marcas de sus dueños.</p>
            <p className="closing__credit">
              Sitio hecho por{" "}
              <a href="https://angelvalladares.dev" target="_blank" rel="noopener">
                angelvalladares.dev
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
