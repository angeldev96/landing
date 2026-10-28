import { getCatalogProducts, groupByCategory } from "@/lib/catalog";
import { getPublishedArticles } from "@/lib/article-data";
import { ARTICLE_HUBS, articleHref, findArticleCategory, type Article } from "@/lib/articles";
import { categoryHref } from "@/lib/categories";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, toDescription } from "@/lib/seo";
import { FAQS, SOCIAL_LINKS, WHATSAPP_DISPLAY } from "@/lib/site";

// llms.txt (https://llmstxt.org): a plain markdown map of the site for AI assistants and agents.
export const dynamic = "force-dynamic";

async function loadProducts() {
  try {
    return await getCatalogProducts();
  } catch (error) {
    console.error("llms.txt: no pudimos cargar el catálogo:", error);
    return [];
  }
}

function articleLines(articles: Article[]) {
  return articles.map((article) => {
    const category = findArticleCategory(article.section, article.category);
    const summary = toDescription(article.excerpt || article.body, 200);
    const tags = [category?.title, article.section === "patrones" ? article.priceLabel || "Gratis" : null]
      .filter(Boolean)
      .join(", ");

    return `- [${article.title}](${absoluteUrl(articleHref(article))})${tags ? ` (${tags})` : ""}${summary ? `: ${summary}` : ""}`;
  });
}

export async function GET() {
  const [products, patterns, lessons] = await Promise.all([
    loadProducts(),
    getPublishedArticles("patrones"),
    getPublishedArticles("aprende"),
  ]);
  const groups = groupByCategory(products).filter((group) => group.products.length > 0);

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${SITE_NAME} es un emprendimiento de crochet de Honduras. Cada pieza se teje a mano, punto a punto, y se puede personalizar. Los pedidos se hacen por WhatsApp (${WHATSAPP_DISPLAY}): el cliente elige una pieza o envía su idea, se acuerdan detalles y precio, se reserva con un anticipo y se coordina la entrega o el envío.`,
    "",
    "## Datos clave",
    "",
    `- Sitio oficial: ${absoluteUrl("/")}`,
    "- País: Honduras",
    "- Idioma: español",
    `- Pedidos y consultas: WhatsApp ${WHATSAPP_DISPLAY} (${SOCIAL_LINKS.whatsapp.split("?")[0]})`,
    `- Instagram: ${SOCIAL_LINKS.instagram}`,
    `- TikTok: ${SOCIAL_LINKS.tiktok}`,
    `- Facebook: ${SOCIAL_LINKS.facebook}`,
    "",
    "## Tienda",
    "",
    `- [Toda la tienda](${absoluteUrl("/tienda")}): catálogo completo de piezas de crochet hechas a mano.`,
    ...groups.map(
      ({ category, products: items }) =>
        `- [${category.name}](${absoluteUrl(categoryHref(category))}): ${category.desc} (${items.length} pieza${items.length === 1 ? "" : "s"})`,
    ),
    "",
    ...(products.length
      ? [
          "## Productos",
          "",
          ...products.map((product) => {
            const summary = toDescription(product.description, 200);
            return `- [${product.name}](${absoluteUrl(`/tienda/${product.slug}`)}) (${product.category.name})${summary ? `: ${summary}` : ""}`;
          }),
          "",
        ]
      : []),
    `## ${ARTICLE_HUBS.patrones.label}`,
    "",
    `- [Patrones de crochet](${absoluteUrl("/patrones")}): patrones gratuitos y de pago explicados paso a paso.`,
    ...articleLines(patterns),
    "",
    `## ${ARTICLE_HUBS.aprende.label}`,
    "",
    `- [Aprende crochet](${absoluteUrl("/aprende")}): tutoriales, consejos, técnicas, materiales y solución de errores frecuentes.`,
    ...articleLines(lessons),
    "",
    "## Preguntas frecuentes",
    "",
    ...FAQS.flatMap((faq) => [`### ${faq.question}`, "", faq.answer, ""]),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
