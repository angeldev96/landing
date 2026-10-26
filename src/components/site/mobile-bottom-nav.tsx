"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    href: "/",
    match: "/",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    label: "Inicio",
  },
  {
    href: "/tienda",
    match: "/tienda",
    icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    label: "Tienda",
  },
  {
    href: "/patrones",
    match: "/patrones",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    label: "Patrones",
  },
  {
    href: "/aprende",
    match: "/aprende",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0121 17.5c-2.5 1.5-5.5 2.5-9 2.5s-6.5-1-9-2.5c0-2.5.32-4.86.84-6.922L12 14z",
    label: "Aprende",
  },
  {
    href: "/#contacto",
    match: null,
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    label: "Contacto",
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/15 bg-surface/90 backdrop-blur-xl md:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {ITEMS.map((item) => {
            const isActive = item.match === "/" ? pathname === "/" : Boolean(item.match && pathname.startsWith(item.match));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 ${isActive ? "text-primary-dark" : "text-foreground-light/50"}`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom spacer for mobile nav */}
      <div className="h-16 md:hidden" />
    </>
  );
}
