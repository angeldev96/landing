// Dynamic route params arrive percent-encoded for non-ASCII slugs ("Niña_tejida" -> "Ni%C3%B1a_tejida"),
// but the database stores them decoded.
export function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
