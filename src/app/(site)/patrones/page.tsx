import type { Metadata } from "next";
import { PATTERN_SECTIONS } from "@/lib/site";
import { ResourceHub } from "@/components/site/resource-hub";

export const metadata: Metadata = {
  title: "Biblioteca de patrones — Crochet CasRey",
  description: "Patrones de crochet gratuitos y de pago para tejer tus propios amigurumis, flores y más.",
};

export default function PatternsPage() {
  return (
    <ResourceHub
      eyebrow="Biblioteca de patrones"
      title="Tejé tus propias creaciones."
      intro="Patrones gratuitos y de pago de nuestras piezas, explicados paso a paso para que los puedas tejer en casa."
      sections={PATTERN_SECTIONS}
      notifyMessage="¡Hola Crochet CasRey! Quiero que me avisen cuando publiquen los patrones 🧶"
    />
  );
}
