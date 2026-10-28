import type { JsonLdNode } from "@/lib/seo";

// Renders schema.org nodes as one @graph so search engines and AI crawlers read them together.
export function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  const graph = Array.isArray(data) ? data : [data];
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
