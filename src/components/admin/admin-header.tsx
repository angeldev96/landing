import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

const ADMIN_TABS = [
  { id: "productos", label: "Productos", href: "/admin" },
  { id: "articulos", label: "Patrones y Aprende", href: "/admin/articulos" },
  { id: "guia", label: "Guía", href: "/admin/guia" },
] as const;

export function AdminHeader({ active }: { active: (typeof ADMIN_TABS)[number]["id"] }) {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-primary/20 bg-surface/80 px-6 py-5 shadow-xl shadow-primary/5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary-dark">Crochet CasRey</p>
          <h1 className="font-display text-4xl text-foreground">Administrador de la landing</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {ADMIN_TABS.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={tab.id === active ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                tab.id === active
                  ? "bg-primary text-foreground"
                  : "border border-primary/25 text-foreground-light hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-full border border-primary/30 px-5 py-3 text-sm font-bold text-foreground transition hover:bg-primary/10"
        >
          Cerrar sesion
        </button>
      </form>
    </div>
  );
}
