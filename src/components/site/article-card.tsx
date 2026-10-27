import Image from "next/image";
import Link from "next/link";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { articleHref, findArticleCategory, type Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  const category = findArticleCategory(article.section, article.category);

  return (
    <Link
      href={articleHref(article)}
      className="group flex flex-col overflow-hidden rounded-[2rem] border border-primary/15 bg-surface shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-primary-light/60">
        {article.coverPath ? (
          <Image
            src={buildStoragePublicUrl(article.coverPath)}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-6xl text-primary/40">🧶</div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {article.videoUrl ? (
            <span className="rounded-full bg-background-dark/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              ▶ Video
            </span>
          ) : null}
          {article.section === "patrones" ? (
            <span className="rounded-full bg-surface/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
              {article.priceLabel || "Gratis"}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {category ? (
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-dark">{category.title}</p>
        ) : null}
        <h3 className="mt-2 font-display text-2xl leading-tight text-foreground">{article.title}</h3>
        {article.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground-light">{article.excerpt}</p>
        ) : null}
        <span className="mt-4 text-sm font-bold text-primary-dark transition group-hover:translate-x-1">Leer más →</span>
      </div>
    </Link>
  );
}
