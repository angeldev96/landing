"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { NavLink } from "@/lib/site";

type CategoryLink = { label: string; href: string; count: number };

/*
 * Under 1280px the words move into a full-screen sheet: 56px rows, the shop's categories listed under
 * Tienda with their piece counts, and any tap on a link closes it.
 */
export function MobileMenu({ links, categories }: { links: NavLink[]; categories: CategoryLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("Tienda");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const childrenFor = (link: NavLink) =>
    link.label === "Tienda"
      ? [
          { label: "Toda la tienda", href: "/tienda", meta: "" },
          ...categories.map((category) => ({
            label: category.label,
            href: category.href,
            meta: category.count ? String(category.count) : "",
          })),
        ]
      : (link.children ?? []).map((child) => ({ ...child, meta: "" }));

  const sheet = (
    <div className="menu-sheet" id="menu-sheet">
      <nav aria-label="Menú" className="wrap">
        <ul className="menu-sheet__list">
          {links.map((link) =>
            link.children ? (
              <li key={link.label}>
                <button
                  type="button"
                  className="menu-sheet__row"
                  aria-expanded={openSection === link.label}
                  onClick={() => setOpenSection((current) => (current === link.label ? null : link.label))}
                >
                  {link.label}
                  <svg aria-hidden="true" viewBox="0 0 12 12" className="menu-sheet__chev">
                    <path d="M2.5 4.5 6 8l3.5-3.5" />
                  </svg>
                </button>
                {openSection === link.label ? (
                  <ul className="menu-sheet__sub">
                    {childrenFor(link).map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} onClick={close} className="menu-sheet__subrow">
                          {child.label}
                          {child.meta ? <span className="muted">{child.meta}</span> : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ) : (
              <li key={link.label}>
                <Link href={link.href} onClick={close} className="menu-sheet__row">
                  {link.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="nav__menu"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
        aria-controls="menu-sheet"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          {isOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {/* Portal: the sheet covers the page under the fixed bar. */}
      {isOpen ? createPortal(sheet, document.body) : null}
    </>
  );
}
