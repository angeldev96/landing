import { STORE_CATEGORIES, categoryHref } from "@/lib/categories";

export const WHATSAPP_NUMBER = "50497464797";
export const WHATSAPP_DISPLAY = "+504 9746-4797";

export const DEFAULT_WHATSAPP_MESSAGE = "¡Hola Crochet CasRey! Vi su página y me gustaría hacer un pedido 🧶";

export function buildWhatsappUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const SOCIAL_LINKS = {
  whatsapp: buildWhatsappUrl(),
  instagram: "https://www.instagram.com/crochetcasrey/",
  facebook: "https://www.facebook.com/share/19dThiy49U/",
  tiktok: "https://www.tiktok.com/@crochetcasrey",
} as const;

export type SocialNetwork = keyof typeof SOCIAL_LINKS;

export const SOCIAL_LABELS: Record<SocialNetwork, { name: string; handle: string }> = {
  whatsapp: { name: "WhatsApp", handle: WHATSAPP_DISPLAY },
  instagram: { name: "Instagram", handle: "@crochetcasrey" },
  facebook: { name: "Facebook", handle: "Crochet CasRey" },
  tiktok: { name: "TikTok", handle: "@crochetcasrey" },
};

export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const PATTERN_SECTIONS = [
  {
    id: "gratuitos",
    title: "Patrones gratuitos",
    desc: "Patrones sencillos para que empieces a tejer desde casa, paso a paso y sin costo.",
  },
  {
    id: "de-pago",
    title: "Patrones de pago",
    desc: "Patrones completos de nuestras piezas favoritas, con fotos de cada vuelta y lista de materiales.",
  },
  {
    id: "novedades",
    title: "Novedades",
    desc: "Los patrones más recientes que vamos sumando a la biblioteca.",
  },
] as const;

export const LEARN_SECTIONS = [
  {
    id: "tutoriales",
    title: "Tutoriales",
    desc: "Videos y guías paso a paso para tejer tus propias piezas.",
  },
  {
    id: "consejos",
    title: "Consejos",
    desc: "Trucos del día a día para que tus tejidos queden parejos y bonitos.",
  },
  {
    id: "tecnicas",
    title: "Técnicas",
    desc: "Puntos básicos, aumentos, disminuciones, anillo mágico y mucho más.",
  },
  {
    id: "materiales",
    title: "Materiales",
    desc: "Qué hilos, agujas y rellenos usar según el proyecto que quieras tejer.",
  },
  {
    id: "errores-frecuentes",
    title: "Solución de errores frecuentes",
    desc: "Qué hacer cuando el tejido se tuerce, se abre o no te da la medida.",
  },
] as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/" },
  {
    label: "Tienda",
    href: "/tienda",
    children: [
      { label: "Ver todo", href: "/tienda" },
      ...STORE_CATEGORIES.map((category) => ({ label: category.name, href: categoryHref(category) })),
    ],
  },
  {
    label: "Patrones",
    href: "/patrones",
    children: PATTERN_SECTIONS.map((section) => ({ label: section.title, href: `/patrones#${section.id}` })),
  },
  { label: "Cómo pedir", href: "/#como-pedir" },
  {
    label: "Aprende",
    href: "/aprende",
    children: LEARN_SECTIONS.map((section) => ({ label: section.title, href: `/aprende#${section.id}` })),
  },
  { label: "Contacto", href: "/#contacto" },
];

// Shown on the home page and published as FAQPage schema and in /llms.txt, so answers must stay
// true to how the shop works. Plain question/answer text is what search engines and AI assistants quote.
export const FAQS = [
  {
    question: "¿Dónde comprar crochet hecho a mano en Honduras?",
    answer:
      "En Crochet CasRey tejemos a mano en Honduras amigurumis, flores eternas, bolsos y carteras, cojines, accesorios, ropa de bebé y regalos personalizados. Podés ver las piezas en la tienda de crochetcasrey.com y hacer tu pedido por WhatsApp al +504 9746-4797.",
  },
  {
    question: "¿Puedo pedir un amigurumi o regalo de crochet personalizado?",
    answer:
      "Sí. Enviame por WhatsApp una foto o referencia de lo que te gustaría y lo tejemos a la medida de tu idea; cualquier idea puede convertirse en un pedido único. Acordamos juntos el tamaño, los colores y los detalles.",
  },
  {
    question: "¿Cómo hago un pedido en Crochet CasRey?",
    answer:
      "Son tres pasos: elegís una pieza de la tienda o nos mandás tu idea por WhatsApp, acordamos detalles y precio y reservás con un pequeño anticipo, y te avisamos cuando tu pedido está listo para entregarlo o enviarlo a donde quieras.",
  },
  {
    question: "¿Cuánto cuesta una pieza de crochet?",
    answer:
      "El precio depende del tamaño, los colores y el nivel de detalle, porque cada pieza se teje a mano punto a punto. Escribinos por WhatsApp y te damos un presupuesto sin compromiso.",
  },
  {
    question: "¿Cuánto tarda en estar listo un pedido?",
    answer:
      "Depende del tamaño y la complejidad de la pieza. Te confirmamos el tiempo de elaboración al cotizar y te avisamos apenas tu pedido esté terminado.",
  },
  {
    question: "¿Hacen envíos?",
    answer:
      "Sí. Cuando tu pedido está listo coordinamos por WhatsApp la entrega o el envío a donde lo necesités.",
  },
  {
    question: "¿Qué es un amigurumi?",
    answer:
      "Amigurumi es una técnica de origen japonés para tejer a crochet muñecos y figuras pequeñas, normalmente en espiral y rellenos de fibra. Son suaves, duraderos y se pueden personalizar, por eso son un regalo único para niños, parejas, cumpleaños y baby showers.",
  },
  {
    question: "¿Tienen patrones y tutoriales para aprender crochet?",
    answer:
      "Sí. En la Biblioteca de patrones publicamos patrones de crochet gratuitos y de pago, y en la sección Aprende compartimos tutoriales, técnicas, consejos, materiales y soluciones a errores frecuentes para tejer desde casa.",
  },
] as const;
