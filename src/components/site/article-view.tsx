import Image from "next/image";
import Link from "next/link";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { ARTICLE_HUBS, findArticleCategory, getYoutubeEmbedUrl, type Article } from "@/lib/articles";
import { buildWhatsappUrl } from "@/lib/site";
import { SocialIcon } from "@/components/site/social-icon";

type BodyBlock =
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; lines: string[] };

// Minimal formatting for owner-written text: blank line = new block, "## " = subheading, "- " = list item.
function parseBody(body: string): BodyBlock[] {
  return body
    .split(/\n\s*\n/)
    .map((chunk) => chunk.split("\n").map((line) => line.trimEnd()).filter(Boolean))
    .filter((lines) => lines.length > 0)
    .flatMap((lines): BodyBlock[] => {
      if (lines.length === 1 && lines[0].startsWith("## ")) {
        return [{ type: "heading", text: lines[0].slice(3).trim() }];
      }

      if (lines.every((line) => /^\s*[-*] /.test(line))) {
        return [{ type: "list", items: lines.map((line) => line.replace(/^\s*[-*] /, "")) }];
      }

      if (lines[0].startsWith("## ")) {
        return [{ type: "heading", text: lines[0].slice(3).trim() }, ...parseBody(lines.slice(1).join("\n"))];
      }

      return [{ type: "paragraph", lines }];
    });
}

function ArticleBody({ body }: { body: string }) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-foreground-light sm:text-lg">
      {parseBody(body).map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2 key={index} className="pt-4 font-display text-3xl text-foreground sm:text-4xl">
              {block.text}
            </h2>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="space-y-2 pl-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3">
                  <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index}>
            {block.lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function ArticleView({ article }: { article: Article }) {
  const hub = ARTICLE_HUBS[article.section];
  const category = findArticleCategory(article.section, article.category);
  const embedUrl = getYoutubeEmbedUrl(article.videoUrl);
  const isPaidPattern = article.section === "patrones" && Boolean(article.priceLabel);
  const whatsappUrl = buildWhatsappUrl(
    isPaidPattern
      ? `¡Hola Crochet CasRey! Quiero comprar el patrón "${article.title}" 🧶`
      : `¡Hola Crochet CasRey! Tengo una consulta sobre "${article.title}" 🧶`,
  );

  return (
    <main className="pb-16">
      <section className="border-b border-primary/10 bg-surface/60">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-4 py-6 text-sm font-bold text-foreground-light sm:px-6">
          <Link
            href={hub.path}
            className="rounded-full border border-primary/20 bg-surface px-4 py-2 text-foreground transition hover:bg-primary/10"
          >
            ← {hub.label}
          </Link>
          {category ? (
            <>
              <span>/</span>
              <Link href={`${hub.path}#${category.id}`} className="transition hover:text-primary-dark">
                {category.title}
              </Link>
            </>
          ) : null}
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {category ? (
              <span className="rounded-full bg-primary-light px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-primary-dark">
                {category.title}
              </span>
            ) : null}
            {article.section === "patrones" ? (
              <span className="rounded-full border border-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-foreground-light">
                {article.priceLabel || "Gratis"}
              </span>
            ) : null}
          </div>
          <h1 className="font-display text-5xl leading-none text-foreground sm:text-6xl">{article.title}</h1>
          {article.excerpt ? (
            <p className="text-lg leading-relaxed text-foreground-light sm:text-xl">{article.excerpt}</p>
          ) : null}
        </header>

        {embedUrl ? (
          <div className="mt-8 aspect-video overflow-hidden rounded-[2rem] border border-primary/15 bg-background-dark shadow-xl shadow-primary/10">
            <iframe
              src={embedUrl}
              title={article.title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : article.coverPath ? (
          <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[2rem] border border-primary/15 bg-primary-light/60 shadow-xl shadow-primary/10">
            <Image
              src={buildStoragePublicUrl(article.coverPath)}
              alt={article.title}
              fill
              priority
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        {article.videoUrl && !embedUrl ? (
          <a
            href={article.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-background-dark px-6 py-3 text-sm font-bold text-white transition hover:bg-foreground"
          >
            ▶ Ver el video
          </a>
        ) : null}

        {article.body ? (
          <div className="mt-10">
            <ArticleBody body={article.body} />
          </div>
        ) : null}

        <div className="mt-12 flex flex-col gap-4 rounded-[2rem] border border-primary/20 bg-primary-light/45 p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <div>
            <p className="font-display text-3xl text-foreground">
              {isPaidPattern ? `Patrón completo · ${article.priceLabel}` : "¿Te quedó alguna duda?"}
            </p>
            <p className="mt-1 text-sm text-foreground-light">
              {isPaidPattern
                ? "Escribinos por WhatsApp y te enviamos el patrón con fotos de cada vuelta."
                : "Escribinos por WhatsApp y te ayudamos con gusto."}
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition hover:brightness-95"
          >
            <SocialIcon network="whatsapp" className="h-4 w-4" />
            {isPaidPattern ? "Pedir patrón" : "Escribinos"}
          </a>
        </div>
      </article>
    </main>
  );
}
