"use client";

import { useState, ViewTransition } from "react";
import { buildStoragePublicUrl, type ProductDetailImage } from "@/lib/crochet-landing";

type ProductDetailGalleryProps = {
  productName: string;
  // The name the product's cards give its photograph, so the card's photograph lands here.
  transitionName: string;
  images: ProductDetailImage[];
};

export function ProductDetailGallery({ productName, transitionName, images }: ProductDetailGalleryProps) {
  const [activeId, setActiveId] = useState(images[0]?.id ?? null);
  // Only a tapped thumbnail fades in; the first photograph is in place at once (and is what the card's
  // photograph travels to).
  const [swapped, setSwapped] = useState(false);
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
      <ViewTransition name={transitionName} share="morph" default="none">
        <div className="overflow-hidden rounded-[2.3rem] border border-primary/15 bg-surface shadow-2xl shadow-primary/10">
          <div className="relative aspect-[4/5] bg-primary/10">
            {/* Keyed by photo, so each tapped thumbnail fades in again. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activeImage.id}
              src={buildStoragePublicUrl(activeImage.storagePath)}
              alt={activeImage.altText ?? productName}
              className={`${swapped ? "photo-swap " : ""}h-full w-full object-cover`}
            />
          </div>
        </div>
      </ViewTransition>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image) => {
            const isActive = image.id === activeImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => {
                  setActiveId(image.id);
                  setSwapped(true);
                }}
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
