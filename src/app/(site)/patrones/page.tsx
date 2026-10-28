import type { Metadata } from "next";
import { PATTERN_SECTIONS } from "@/lib/site";
import { ResourceHub } from "@/components/site/resource-hub";
import { getPublishedArticles } from "@/lib/article-data";
import { articleHref } from "@/lib/articles";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

const TITLE = "Patrones de crochet gratis y de pago";
const DESCRIPTION =
  "Patrones de crochet en español, gratuitos y de pago, para tejer amigurumis, flores y más paso a paso. Creados en Honduras por Crochet CasRey.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/patrones" });

export const dynamic = "force-dynamic";

export default async function PatternsPage() {
  const articles = await getPublishedArticles("patrones");

  return (
    <>
      <JsonLd
        data={[
          collectionPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/patrones",
            items: articles.map((article) => ({
              name: article.title,
              path: articleHref(article),
              image: buildStoragePublicUrl(article.coverPath) || undefined,
            })),
          }),
          breadcrumbJsonLd([{ name: "Biblioteca de patrones", path: "/patrones" }]),
        ]}
      />
      <ResourceHub
        eyebrow="Biblioteca de patrones"
        title="Tejé tus propias creaciones."
        intro="Patrones gratuitos y de pago de nuestras piezas, explicados paso a paso para que los puedas tejer en casa."
        sections={PATTERN_SECTIONS}
        articles={articles}
        notifyMessage="¡Hola Crochet CasRey! Quiero que me avisen cuando publiquen los patrones 🧶"
      />
    </>
  );
}
