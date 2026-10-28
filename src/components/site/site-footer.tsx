import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SOCIAL_LABELS, SOCIAL_LINKS, type SocialNetwork } from "@/lib/site";
import { SocialIcon } from "@/components/site/social-icon";

const NETWORKS: SocialNetwork[] = ["whatsapp", "instagram", "facebook", "tiktok"];

export function SiteFooter() {
  return (
    <footer className="relative mt-8 rounded-t-[2rem] bg-background-dark text-white lg:rounded-t-[4rem]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-20">
          {/* Brand */}
          <div className="space-y-4 lg:w-1/3">
            <div className="flex items-center gap-3">
              <div className="relative size-10 overflow-hidden rounded-full border border-primary/30 bg-primary/20">
                <Image src="/android-chrome-512x512.png" alt="Logo Crochet CasRey" fill sizes="40px" className="object-cover" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">Crochet CasRey</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              Artesanía hecha con amor, hilo por hilo. Cada creación es una pieza única pensada para vos.
            </p>
            <div className="flex items-center gap-3">
              {NETWORKS.map((network) => (
                <a
                  key={network}
                  href={SOCIAL_LINKS[network]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={SOCIAL_LABELS[network].name}
                  className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-primary hover:text-foreground"
                >
                  <SocialIcon network={network} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16 lg:gap-20">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white/70">Navegación</h4>
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link key={link.label} href={link.href} className="text-sm font-medium text-white/50 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white/70">Contacto</h4>
              <div className="flex flex-col gap-2">
                {NETWORKS.map((network) => (
                  <a
                    key={network}
                    href={SOCIAL_LINKS[network]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-white/50 transition-colors hover:text-primary"
                  >
                    {SOCIAL_LABELS[network].name}
                    <span className="block text-xs text-white/30">{SOCIAL_LABELS[network].handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row lg:mt-16">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Crochet CasRey · Honduras. Hecho con amor 💜</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-xs text-white/40">5.0 de nuestros clientes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
