import { SOCIAL_LINKS, buildWhatsappUrl } from "@/lib/site";
import { SocialIcon } from "@/components/site/social-icon";

type ResourceSection = {
  id: string;
  title: string;
  desc: string;
};

// Shared layout for content hubs (patterns library, learning) whose content is still being prepared.
export function ResourceHub({
  eyebrow,
  title,
  intro,
  sections,
  notifyMessage,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly ResourceSection[];
  notifyMessage: string;
}) {
  return (
    <main className="pb-16">
      <section className="relative overflow-hidden border-b border-primary/10 bg-background-dark text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(195,180,253,0.22),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.14),_transparent_26%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-primary">{eyebrow}</p>
            <h1 className="font-display text-5xl leading-none sm:text-6xl lg:text-7xl">{title}</h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{intro}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/75 transition hover:bg-white/10"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="flex scroll-mt-24 flex-col rounded-[2rem] border border-primary/15 bg-surface p-6 shadow-lg shadow-primary/5 lg:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="font-display text-5xl leading-none text-primary/30">{String(index + 1).padStart(2, "0")}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              </div>
              <h2 className="mt-4 font-display text-3xl text-foreground lg:text-4xl">{section.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-light lg:text-base">{section.desc}</p>
              <span className="mt-6 inline-flex w-fit rounded-full bg-primary-light px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary-dark">
                Próximamente
              </span>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 rounded-[2rem] border border-primary/20 bg-primary-light/45 p-6 lg:mt-16 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="max-w-xl">
            <p className="font-display text-3xl text-foreground lg:text-4xl">Estamos preparando todo con mucho cariño</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground-light lg:text-base">
              Mientras tanto, seguinos en TikTok e Instagram para ver videos y novedades, o escribinos para que te avisemos
              apenas esté listo.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={buildWhatsappUrl(notifyMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-foreground transition hover:bg-primary-dark hover:text-white"
            >
              <SocialIcon network="whatsapp" className="h-4 w-4" />
              Avisame
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-surface px-6 py-3 text-sm font-bold text-foreground transition hover:bg-primary/10"
            >
              <SocialIcon network="tiktok" className="h-4 w-4" />
              TikTok
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-surface px-6 py-3 text-sm font-bold text-foreground transition hover:bg-primary/10"
            >
              <SocialIcon network="instagram" className="h-4 w-4" />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
