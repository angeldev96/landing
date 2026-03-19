"use client";

import { useState } from "react";
import { buildStoragePublicUrl, type ProductDetailImage } from "@/lib/crochet-landing";

type ProductDetailGalleryProps = {
  productName: string;
  images: ProductDetailImage[];
};

export function ProductDetailGallery({ productName, images }: ProductDetailGalleryProps) {
  const [activeId, setActiveId] = useState(images[0]?.id ?? null);
  const activeImage = images.find((image) => image.id === activeId) ?? images[0] ?? null;

  if (!activeImage) {
    return (
      <div className="rounded-[2rem] border border-primary/15 bg-surface/80 p-6 text-sm text-foreground-light shadow-xl shadow-primary/5">
        Este producto todavia no tiene fotos publicadas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2.3rem] border border-primary/15 bg-surface shadow-2xl shadow-primary/10">
        <div className="relative aspect-[4/5] bg-primary/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={buildStoragePublicUrl(activeImage.storagePath)}
            alt={activeImage.altText ?? productName}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image) => {
            const isActive = image.id === activeImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveId(image.id)}
                className={`overflow-hidden rounded-[1.2rem] border transition ${
                  isActive
                    ? "border-primary/60 ring-2 ring-primary/30"
                    : "border-primary/15 hover:border-primary/35"
                }`}
              >
                <div className="relative aspect-square bg-primary/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={buildStoragePublicUrl(image.storagePath)}
                    alt={image.altText ?? productName}
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
