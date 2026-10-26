"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/lib/site";

export function MobileMenu({ links, whatsappUrl }: { links: NavLink[]; whatsappUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setOpenSection(null);
  };

  const panel = (
    <div className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-primary/10 bg-background px-4 pb-28 pt-4">
      <nav className="flex flex-col gap-1">
        {links.map((link) =>
          link.children ? (
            <div key={link.label} className="rounded-2xl border border-primary/10 bg-surface/70">
              <button
                type="button"
                onClick={() => setOpenSection((current) => (current === link.label ? null : link.label))}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-base font-bold text-foreground"
                aria-expanded={openSection === link.label}
              >
                {link.label}
                <svg
                  className={`h-4 w-4 transition-transform ${openSection === link.label ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSection === link.label ? (
                <div className="flex flex-col gap-0.5 px-2 pb-2">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={close}
                      className="rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground-light transition-colors hover:bg-primary/10 hover:text-foreground"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              onClick={close}
              className={`rounded-2xl px-4 py-3.5 text-base font-bold transition-colors hover:bg-primary/10 ${
                pathname === link.href ? "text-primary-dark" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ),
        )}
      </nav>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={close}
        className="mt-6 flex items-center justify-center rounded-full bg-primary px-6 py-4 text-base font-bold text-foreground shadow-xl shadow-primary/25"
      >
        Escribime por WhatsApp
      </a>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-full p-2 transition-colors hover:bg-primary/10"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
      >
        <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Portal: the header's backdrop-filter would otherwise trap this fixed panel inside it */}
      {isOpen ? createPortal(panel, document.body) : null}
    </div>
  );
}
