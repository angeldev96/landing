import type { Metadata } from "next";
import { LEARN_SECTIONS } from "@/lib/site";
import { ResourceHub } from "@/components/site/resource-hub";

export const metadata: Metadata = {
  title: "Aprende crochet — Crochet CasRey",
  description: "Tutoriales, consejos, técnicas, materiales y solución de errores frecuentes para aprender crochet.",
};

export default function LearnPage() {
  return (
    <ResourceHub
      eyebrow="Aprende"
      title="Aprendé a tejer con nosotras."
      intro="Tutoriales, consejos y técnicas para que empieces o mejores en el mundo del crochet, punto a punto."
      sections={LEARN_SECTIONS}
      notifyMessage="¡Hola Crochet CasRey! Quiero que me avisen cuando publiquen tutoriales 🧶"
    />
  );
}
