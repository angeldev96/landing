import { ViewTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { buildStoragePublicUrl } from "@/lib/crochet-landing";
import { displayProductName, productTransitionName, type CatalogProduct } from "@/lib/catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const imageUrl = buildStoragePublicUrl(product.coverPath);
  const name = displayProductName(product.name);

  return (
    <Link href={`/tienda/${product.slug}`} className="group block rounded-[1.75rem] focus-visible:outline-offset-4">
      {/* The photograph travels to the top of the product page (see ::view-transition-group(.morph)). */}
      <ViewTransition name={productTransitionName(product.id)} share="morph" default="none">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-pink-light">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.coverAlt ?? name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-semibold text-foreground-light">
              Foto próximamente
            </div>
          )}
          {product.imageCount > 1 ? (
            <span className="absolute right-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
              {product.imageCount} fotos
            </span>
          ) : null}
        </div>
      </ViewTransition>
      <div className="px-1 pt-3">
        <h3 className="truncate text-base font-bold text-foreground group-hover:text-primary-dark lg:text-lg">{name}</h3>
        <p className="text-sm text-foreground-light">{product.category.name}</p>
      </div>
    </Link>
  );
}
