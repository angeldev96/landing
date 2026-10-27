import { SOCIAL_LINKS, buildWhatsappUrl } from "@/lib/site";
import type { Article, ArticleCategory } from "@/lib/articles";
import { ArticleCard } from "@/components/site/article-card";
import { SocialIcon } from "@/components/site/social-icon";

// Shared layout for content hubs (patterns library, learning). Sections with published articles
// list them; the rest stay as "Próximamente" cards until the owner adds content from the admin.
export function ResourceHub({
  eyebrow,
  title,
  intro,
  sections,
  articles,
  notifyMessage,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly ArticleCategory[];
  articles: Article[];
  notifyMessage: string;
}) {
  const groups = sections.map((section) => ({
    section,
    articles: articles.filter((article) => article.category === section.id),
  }));
  const filledGroups = groups.filter((group) => group.articles.length > 0);
  const emptyGroups = groups.filter((group) => group.articles.length === 0);

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
            {groups.map(({ section, articles: sectionArticles }) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/75 transition hover:bg-white/10"
              >
                {section.title}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                  {sectionArticles.length || "pronto"}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        {filledGroups.length ? (
          <div className="space-y-14 lg:space-y-20">
            {filledGroups.map(({ section, articles: sectionArticles }) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="max-w-2xl">
                  <h2 className="font-display text-4xl text-foreground lg:text-5xl">{section.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-light lg:text-base">{section.desc}</p>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {sectionArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}

        {emptyGroups.length ? (
          <div className={filledGroups.length ? "mt-14 lg:mt-20" : undefined}>
            {filledGroups.length ? (
              <h2 className="mb-6 font-display text-3xl text-foreground lg:text-4xl">Muy pronto</h2>
            ) : null}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {emptyGroups.map(({ section }) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="flex scroll-mt-24 flex-col rounded-[2rem] border border-primary/15 bg-surface p-6 shadow-lg shadow-primary/5 lg:p-8"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display text-5xl leading-none text-primary/30">
                      {String(sections.indexOf(section) + 1).padStart(2, "0")}
                    </span>
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
          </div>
        ) : null}

        <div className="mt-12 flex flex-col gap-6 rounded-[2rem] border border-primary/20 bg-primary-light/45 p-6 lg:mt-16 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="max-w-xl">
            <p className="font-display text-3xl text-foreground lg:text-4xl">
              {emptyGroups.length ? "Estamos preparando todo con mucho cariño" : "¿Querés ver más?"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground-light lg:text-base">
              Seguinos en TikTok e Instagram para ver videos y novedades, o escribinos para que te avisemos cuando
              publiquemos algo nuevo.
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
