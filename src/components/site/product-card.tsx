import Link from "next/link";
import Image from "next/image";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import type { CatalogProduct } from "@/lib/catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const imageUrl = buildStoragePublicUrl(product.coverPath);

  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="group overflow-hidden rounded-[1.75rem] border border-primary/15 bg-surface shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-primary/10">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.coverAlt ?? product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-6 text-center text-xs font-bold uppercase tracking-[0.22em] text-primary-dark">
            Foto próximamente
          </div>
        )}
        {product.imageCount > 1 ? (
          <span className="absolute right-3 top-3 rounded-full bg-foreground/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            {product.imageCount} fotos
          </span>
        ) : null}
      </div>
      <div className="space-y-1 p-4 lg:p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-dark lg:text-xs">{product.category.name}</p>
        <h3 className="truncate font-display text-2xl text-foreground lg:text-3xl">{product.name}</h3>
        <span className="inline-flex text-sm font-bold text-foreground-light transition group-hover:translate-x-1 group-hover:text-primary-dark">
          Ver producto →
        </span>
      </div>
    </Link>
  );
}
