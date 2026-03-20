import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";

/* ─── Product Data ─── */
const fallbackProducts = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMpHDTmSNzyAZdcjQhOjazwz-w2Afr3UCUfFx9S2BudTfzTaefWQBxR0x0rCMwx1vy_-7RkQiOxQgJo4WmGlX4-Ar8f6EZB0Gk0bJ4hEZKEmBB7eb3h4zj5KBjoAlRVda6yPARRU04x5ddPidFwax8MMUpWqhZKt8tehNF4ARQ39KQP2T1z9nLG67UV58iHx-N0cz9YlzhWSN8hZwhssQwPQF0k-0kmWBzvyqz34hluHk-EAA8reyfxNymCF9wlAd5A64HRqy3HA",
    alt: "Pop Style Star amigurumi",
    tag: "Favorito",
    name: "Pop Style Star",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqNcYRfb46-_BeY_Qc6zig2WS0PPxJi963j_lX-IzbZFxDyVRNSosRrFc9ZlkDsQGd34R5ZeZOFf4w_4DrwbhyczilFWZ8FKi4wsniTU0u8Q2ZSSsQD0Pfpypi64piz774aPChNsmzHs3rEdC8352krmfvUCraruerwh1qnsqEm8_wkfYb2Knu_TftufT9sCBdJ7GOMQBwUqz-9-wDMCQXgFutjHdRzRpN9OUNmZ4RwQXPqo-Ry38aZUPmshH0CmzYxhJw52XAjQ",
    alt: "Conejito Soft amigurumi",
    tag: "Tierno",
    name: "Conejito Soft",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjsz4o5X71MIq4j5lzcjKnk9DY1R5y25QV6nVSw0uwv9Mlcj3NiwSQa_cwwOTdZHzWar0yq8uvLJ2sgF5BIOM1_c0F2gQ72Dt5PzXOynk88RAguqb1CaSEyiT4ugwE6_R6D9X6vW5XONNTrhsOwcBDjw9Lsav57VkYNkKmDgvAk-1W0MDRBsuThjYyHzytGWu9W0xdWpwL3XGmLNjr9Zei1p0FjxppgRoUq28f8BhjJa3aQJPHB5lCzdZ3Pz9VyDxu7JtZ-NDkYg",
    alt: "Muneca personalizada crochet",
    tag: "Custom",
    name: "Muneca Personalizada",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaNRG3XeoMVcYODhOhzOk1Kep9xN68dcOse_KbyNZ7-ORH_UpoIN0n3pMfsY8C-fXYdZ7hLQ5mrE6pXivsoq8JOTb3rxZjLGYu8K7rZbmtQbzNor32bIabohwDKUQPHTFV0oUyiUrDqqhrMNw5pwPIjqFVE-HBkpzUHhv0S9ccYABuqDLZEbwfaMA-FLwPLb7F2axMkWgCcs3E0PJWlMDJKgBPkUV82JxiaO65_LNN0sInNRfhu5KZPuJ7HOHfZqvIzi5uUJnEXg",
    alt: "Flores eternas de crochet",
    tag: "Hogar",
    name: "Flores Eternas",
  },
];

async function getLandingProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_crochet_landing_gallery");

  if (error || !data?.length) {
    return fallbackProducts;
  }

  return data.map((product) => ({
    src: buildStoragePublicUrl(product.cover_path) || fallbackProducts[0]?.src,
    alt: product.cover_alt || product.name,
    tag: product.badge || "Nuevo",
    name: product.name,
  }));
}

const steps = [
  {
    num: "01",
    title: "Elige tu diseno",
    desc: "Enviame una foto o referencia por Instagram de lo que te gustaria que tejiera. Cualquier idea puede convertirse en hilo.",
  },
  {
    num: "02",
    title: "Presupuesto y Senia",
    desc: "Acordamos detalles, tamano, colores y precio. Se reserva con un pequeno adelanto.",
  },
  {
    num: "03",
    title: "Magia lista",
    desc: "Te aviso cuando tu pedido este terminado para ser entregado o enviado a donde quieras.",
  },
];

/* ─── SVG decorations ─── */
function YarnBall({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="50" fill="currentColor" opacity="0.12" />
      <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path
        d="M30 60C30 60 45 30 60 30C75 30 90 60 90 60C90 60 75 90 60 90C45 90 30 60 30 60Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.2"
      />
      <path
        d="M60 10C60 10 30 45 30 60C30 75 60 110 60 110"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.15"
      />
      <path
        d="M60 10C60 10 90 45 90 60C90 75 60 110 60 110"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.15"
      />
    </svg>
  );
}

/* ─── Page ─── */
export default async function Home() {
  const products = await getLandingProducts();

  return (
    <div className="relative min-h-screen bg-background grain-overlay">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative size-10 lg:size-12 rounded-full bg-primary/20 border border-primary/30 overflow-hidden flex items-center justify-center">
              <Image
                src="/android-chrome-512x512.png"
                alt="Logo Crochet CasRey"
                fill
                  sizes="40px"
                className="object-cover"
              />
            </div>
            <span className="text-lg lg:text-xl font-extrabold tracking-tight text-foreground">
              Crochet CasRey
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {["Inicio", "Galeria", "Como pedir", "Contacto"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                className="text-sm font-semibold text-foreground-light hover:text-primary-dark transition-colors"
              >
                {item}
              </a>
            ))}
            <a
              href="https://www.instagram.com/crochetcasrey/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-6 py-2.5 rounded-full bg-primary text-foreground font-bold text-sm hover:bg-primary-dark hover:text-white transition-all shadow-lg shadow-primary/20 hover:shadow-primary-dark/30"
            >
              Escribime ✨
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-full hover:bg-primary/10 transition-colors" aria-label="Menu">
            <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section id="inicio" className="relative overflow-hidden">
        {/* Decorative elements */}
        <YarnBall className="absolute -top-10 -right-10 w-40 h-40 text-primary animate-spin-slow hidden lg:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
            {/* Text side */}
            <div className="lg:w-1/2 space-y-6 lg:space-y-8 animate-fade-in-up">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-dark text-xs font-bold uppercase tracking-widest border border-primary/30">
                Artesania Premium
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground leading-[1.08] tracking-tight">
                Amigurumis y tejidos{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">personalizados</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 lg:h-4 bg-primary/30 -skew-x-3 rounded-sm" />
                </span>
              </h2>
              <p className="text-foreground-light text-base lg:text-lg max-w-lg leading-relaxed font-medium">
                Regalos unicos y eternos, hechos a mano con amor. Cada punto cuenta una historia diferente pensada especialmente para vos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="https://www.instagram.com/crochetcasrey/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-primary text-foreground font-bold shadow-xl shadow-primary/25 hover:bg-primary-dark hover:text-white hover:shadow-primary-dark/30 transition-all active:scale-95 text-base"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  Escribime por Instagram
                </a>
                <a
                  href="#galeria"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-primary/40 text-foreground font-bold hover:bg-primary/10 transition-all text-base"
                >
                  Ver creaciones
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Image side */}
            <div className="lg:w-1/2 mt-8 lg:mt-0 animate-fade-in-up delay-200">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] shadow-2xl shadow-primary/15">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU9qIUSMfJ0BHbxCddEahL3U44sT2cDcXtNzigC_e5gAQotBA8Av_WcWRYBEA-ZWYeFmvSfN_WZAHDPXbQRNg15-HnDolbyl_xaHGFK0UG5xb3CA8AOAX8vl5cTcinZ-1IGz_Hhry9d7oTgV36RKBz2AfBRCxkA_SHkK3yz--EABpkcX48k8P43LijMrNIUH4RMjJYSeV0TnZOlm0EhZRigyHNCaCGj8hI6Hv2IBLuPa38p7wEZaLIhT_E3-fXogqFW7seRosWAA"
                  alt="Amigurumi handmade hero"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/50 via-transparent to-transparent" />
                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-8 glass-card rounded-2xl p-4 lg:p-6 animate-fade-in-up delay-500">
                  <p className="text-foreground font-bold text-sm lg:text-base">
                    ✨ Tejiendo historias punto a punto
                  </p>
                  <p className="text-foreground-light text-xs lg:text-sm mt-1">
                    Cada pieza es unica — como vos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-2xl mx-auto text-center space-y-5 animate-fade-in-up">
            <h3 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Hecho a Mano con Amor
            </h3>
            <p className="text-foreground-light leading-relaxed text-base lg:text-lg font-medium">
              Regalos unicos y eternos que cobran vida entre hilos y agujas. Cada punto, cada color, cada detalle es pensado especialmente para vos o para esa persona que queres sorprender.
            </p>
            <div className="flex justify-center gap-3 pt-3">
              <span className="size-2.5 rounded-full bg-primary" />
              <span className="size-2.5 rounded-full bg-primary/40" />
              <span className="size-2.5 rounded-full bg-primary/20" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─── */}
      <section id="galeria" className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between mb-8 lg:mb-12">
            <div>
              <span className="text-primary-dark text-xs font-bold uppercase tracking-widest">Galeria</span>
              <h3 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">
                Nuestras Creaciones
              </h3>
            </div>
            <Link
              href="/galeria"
              className="text-primary-dark text-sm font-bold hover:underline underline-offset-4 transition-all"
            >
              Ver todo →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, i) => (
              <Link
                key={product.name}
                href="/galeria"
                className={`group relative aspect-square rounded-2xl lg:rounded-3xl overflow-hidden bg-surface shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 animate-scale-in`}
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <Image
                  src={product.src}
                  alt={product.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-3 right-3 lg:bottom-4 lg:left-4 lg:right-4 glass-card rounded-xl p-3 lg:p-4 flex flex-col items-start translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] lg:text-xs font-bold uppercase text-primary-dark tracking-wider">
                    {product.tag}
                  </span>
                  <span className="text-xs lg:text-sm font-bold text-foreground truncate w-full mt-0.5">
                    {product.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex justify-center lg:mt-10">
            <Link
              href="/galeria"
              className="rounded-full border border-primary/30 bg-surface px-7 py-3 text-sm font-bold text-foreground transition hover:bg-primary/10"
            >
              Explorar galeria completa
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW TO ORDER ─── */}
      <section id="como-pedir" className="py-16 lg:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/8 to-primary/5 rounded-[3rem] mx-4 lg:mx-0" />
        <YarnBall className="absolute -bottom-16 -left-16 w-48 h-48 text-primary opacity-30 hidden lg:block" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10 lg:mb-16">
            <span className="text-primary-dark text-xs font-bold uppercase tracking-widest">Proceso</span>
            <h3 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">
              Como pedir tu personalizado
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="flex-1 relative bg-surface/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-primary/15 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 animate-fade-in-up"
                style={{ animationDelay: `${(i + 1) * 200}ms` }}
              >
                {/* Step number */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl lg:text-6xl font-black text-primary/25 font-display leading-none">
                    {step.num}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                </div>
                <h4 className="text-lg lg:text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h4>
                <p className="text-sm lg:text-base text-foreground-light leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL / HIGHLIGHT ─── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative bg-background-dark rounded-3xl lg:rounded-[3rem] overflow-hidden p-8 lg:p-16">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/15 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
              <div className="lg:w-1/2 space-y-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                  Lo que dicen
                </span>
                <blockquote className="font-display text-2xl lg:text-4xl font-bold text-white leading-snug">
                  &ldquo;Le regale un amigurumi personalizado a mi hija y fue el regalo mas especial que recibio. La calidad es increible!&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                    MC
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Maria C.</p>
                    <p className="text-white/50 text-xs">Cliente feliz</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 flex gap-4">
                <div className="flex-1 relative rounded-2xl overflow-hidden aspect-[3/4]">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjsz4o5X71MIq4j5lzcjKnk9DY1R5y25QV6nVSw0uwv9Mlcj3NiwSQa_cwwOTdZHzWar0yq8uvLJ2sgF5BIOM1_c0F2gQ72Dt5PzXOynk88RAguqb1CaSEyiT4ugwE6_R6D9X6vW5XONNTrhsOwcBDjw9Lsav57VkYNkKmDgvAk-1W0MDRBsuThjYyHzytGWu9W0xdWpwL3XGmLNjr9Zei1p0FjxppgRoUq28f8BhjJa3aQJPHB5lCzdZ3Pz9VyDxu7JtZ-NDkYg"
                    alt="Muneca personalizada"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 relative rounded-2xl overflow-hidden aspect-[3/4] translate-y-8">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqNcYRfb46-_BeY_Qc6zig2WS0PPxJi963j_lX-IzbZFxDyVRNSosRrFc9ZlkDsQGd34R5ZeZOFf4w_4DrwbhyczilFWZ8FKi4wsniTU0u8Q2ZSSsQD0Pfpypi64piz774aPChNsmzHs3rEdC8352krmfvUCraruerwh1qnsqEm8_wkfYb2Knu_TftufT9sCBdJ7GOMQBwUqz-9-wDMCQXgFutjHdRzRpN9OUNmZ4RwQXPqo-Ry38aZUPmshH0CmzYxhJw52XAjQ"
                    alt="Conejito amigurumi"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="font-display text-3xl lg:text-5xl font-bold text-foreground">
              Tenes una idea en mente?
            </h3>
            <p className="text-foreground-light text-base lg:text-lg font-medium">
              Dale vida con hilo y aguja. Contame que te gustaria y lo hacemos realidad juntos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <a
                href="https://www.instagram.com/crochetcasrey/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-primary text-foreground font-bold shadow-xl shadow-primary/25 hover:bg-primary-dark hover:text-white hover:shadow-primary-dark/30 transition-all active:scale-95 text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Hablemos por Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer id="contacto" className="relative bg-background-dark text-white rounded-t-[2rem] lg:rounded-t-[4rem] mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-10 lg:gap-20">
            {/* Brand */}
            <div className="lg:w-1/3 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-full bg-primary/20 border border-primary/30 overflow-hidden">
                  <Image
                    src="/android-chrome-512x512.png"
                    alt="Logo"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <span className="text-lg font-extrabold tracking-tight">Crochet CasRey</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                Artesania hecha con amor, hilo por hilo. Cada creacion es una pieza unica pensada para vos.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-16 lg:gap-20">
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white/70">Navegacion</h4>
                <div className="flex flex-col gap-2">
                  {["Inicio", "Galeria", "Como pedir", "Contacto"].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                      className="text-white/50 hover:text-primary transition-colors text-sm font-medium"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white/70">Redes</h4>
                <div className="flex flex-col gap-2">
                  <a href="https://www.instagram.com/crochetcasrey/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-primary transition-colors text-sm font-medium">Instagram</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 lg:mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              © 2026 Crochet CasRey. Hecho con amor 💜
            </p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-white/40 text-xs ml-2">5.0 de nuestros clientes</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-primary/15 md:hidden z-50">
        <div className="flex items-center justify-around h-16 px-4">
          {[
            { href: "#inicio", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Inicio", active: true },
            { href: "#galeria", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z", label: "Galeria", active: false },
            { href: "#como-pedir", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", label: "Pedidos", active: false },
            { href: "#contacto", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", label: "Contacto", active: false },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 ${item.active ? "text-primary-dark" : "text-foreground-light/50"}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={item.active ? 2.5 : 1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-[10px] font-bold">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Bottom spacer for mobile nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
