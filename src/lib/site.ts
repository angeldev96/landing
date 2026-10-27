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
