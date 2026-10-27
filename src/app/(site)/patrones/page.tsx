import type { Metadata } from "next";
import { PATTERN_SECTIONS } from "@/lib/site";
import { ResourceHub } from "@/components/site/resource-hub";
import { getPublishedArticles } from "@/lib/article-data";

export const metadata: Metadata = {
  title: "Biblioteca de patrones — Crochet CasRey",
  description: "Patrones de crochet gratuitos y de pago para tejer tus propios amigurumis, flores y más.",
};

export const dynamic = "force-dynamic";

export default async function PatternsPage() {
  const articles = await getPublishedArticles("patrones");

  return (
    <ResourceHub
      eyebrow="Biblioteca de patrones"
      title="Tejé tus propias creaciones."
      intro="Patrones gratuitos y de pago de nuestras piezas, explicados paso a paso para que los puedas tejer en casa."
      sections={PATTERN_SECTIONS}
      articles={articles}
      notifyMessage="¡Hola Crochet CasRey! Quiero que me avisen cuando publiquen los patrones 🧶"
    />
  );
}
