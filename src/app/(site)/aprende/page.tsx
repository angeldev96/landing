import type { Metadata } from "next";
import { LEARN_SECTIONS } from "@/lib/site";
import { ResourceHub } from "@/components/site/resource-hub";
import { getPublishedArticles } from "@/lib/article-data";
import { articleHref } from "@/lib/articles";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

const TITLE = "Aprendé crochet: tutoriales, técnicas y consejos";
const DESCRIPTION =
  "Aprendé a tejer crochet desde cero: tutoriales en video, puntos básicos, anillo mágico, materiales y solución de errores frecuentes, de la mano de Crochet CasRey.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/aprende" });

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const articles = await getPublishedArticles("aprende");

  return (
    <>
      <JsonLd
        data={[
          collectionPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/aprende",
            items: articles.map((article) => ({
              name: article.title,
              path: articleHref(article),
              image: buildStoragePublicUrl(article.coverPath) || undefined,
            })),
          }),
          breadcrumbJsonLd([{ name: "Aprende", path: "/aprende" }]),
        ]}
      />
      <ResourceHub
        eyebrow="Aprende"
        title="Aprendé a tejer con nosotras."
        intro="Tutoriales, consejos y técnicas para que empieces o mejores en el mundo del crochet, punto a punto."
        sections={LEARN_SECTIONS}
        articles={articles}
        notifyMessage="¡Hola Crochet CasRey! Quiero que me avisen cuando publiquen tutoriales 🧶"
      />
    </>
  );
}
