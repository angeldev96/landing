import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/site";
import { MobileMenu } from "@/components/site/mobile-menu";
import { SocialIcon } from "@/components/site/social-icon";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-primary/20 lg:size-12">
            <Image src="/android-chrome-512x512.png" alt="Logo Crochet CasRey" fill sizes="48px" className="object-cover" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-foreground lg:text-xl">Crochet CasRey</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className="flex items-center gap-1 py-2 text-sm font-semibold text-foreground-light transition-colors hover:text-primary-dark"
                >
                  {link.label}
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="invisible absolute left-1/2 top-full w-60 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-2xl border border-primary/15 bg-surface p-2 shadow-xl shadow-primary/10">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground-light transition-colors hover:bg-primary/10 hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="py-2 text-sm font-semibold text-foreground-light transition-colors hover:text-primary-dark"
              >
                {link.label}
              </Link>
            ),
          )}
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:text-white hover:shadow-primary-dark/30"
          >
            <SocialIcon network="whatsapp" className="h-4 w-4" />
            Escribime
          </a>
        </nav>

        <MobileMenu links={NAV_LINKS} whatsappUrl={SOCIAL_LINKS.whatsapp} />
      </div>
    </header>
  );
}
