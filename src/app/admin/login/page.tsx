import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/auth";
import { loginAction } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const adminContext = await getAdminContext();

  if (adminContext) {
    redirect("/admin");
  }

  const params = await searchParams;
  const message = params.message;

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-10">
        <section className="relative overflow-hidden rounded-[2.5rem] bg-background-dark p-8 text-white shadow-2xl shadow-primary/10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(195,180,253,0.22),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.16),_transparent_30%)]" />
          <div className="relative space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Acceso privado</p>
              <h1 className="font-display text-5xl leading-none lg:text-6xl">Tu taller digital para la galería.</h1>
              <p className="max-w-xl text-base leading-relaxed text-white/70">
                Desde aquí puedes crear productos, subir imágenes al bucket exclusivo de esta landing y decidir qué
                piezas se muestran públicamente.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Autenticación estándar de Supabase",
                "Datos aislados en un esquema dedicado",
                "Imágenes guardadas en un bucket propio",
                "Publicación inmediata en la landing",
              ].map((item) => (
                <div key={item} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/"
              className="inline-flex rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/75 transition hover:bg-white/10"
            >
              Volver a la landing
            </Link>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2.5rem] border border-primary/20 bg-surface/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur-xl lg:p-10">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-dark">Admin login</p>
              <h2 className="font-display text-4xl text-foreground">Entrar al panel</h2>
              <p className="text-sm leading-relaxed text-foreground-light">
                Usa el usuario admin que ya existe en el proyecto Supabase para gestionar esta web.
              </p>
            </div>

            <form action={loginAction} className="mt-8 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-bold text-foreground">Correo</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-2xl border border-primary/20 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:bg-white"
                  placeholder="admin@ejemplo.com"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-bold text-foreground">Contraseña</span>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-2xl border border-primary/20 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:bg-white"
                  placeholder="Tu contraseña segura"
                />
              </label>

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-foreground transition hover:bg-primary-dark hover:text-white"
              >
                Iniciar sesión
              </button>
            </form>

            {message ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                {message}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
