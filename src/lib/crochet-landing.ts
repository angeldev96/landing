import type { Json } from "@/lib/supabase/database.types";

export const CROCHET_LANDING_BUCKET = "crochet-landing-images";

export type GalleryProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  badge: string | null;
  coverPath: string | null;
  coverAlt: string | null;
};

export type AdminProductImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  badge: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  images: AdminProductImage[];
};

export type ProductFormPayload = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  badge: string;
  isPublished: boolean;
  sortOrder: number;
};

type JsonRecord = Record<string, Json | undefined>;

function isJsonRecord(value: Json | undefined): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: Json | undefined, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNullableString(value: Json | undefined) {
  return typeof value === "string" ? value : null;
}

function asBoolean(value: Json | undefined, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asNumber(value: Json | undefined, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

export function buildStoragePublicUrl(path: string | null | undefined) {
  if (!path || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return "";
  }

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${CROCHET_LANDING_BUCKET}/${path}`;
}

export function parseAdminProducts(input: Json): AdminProduct[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!isJsonRecord(item)) {
        return null;
      }

      const images = Array.isArray(item.images)
        ? item.images
            .map((image) => {
              if (!isJsonRecord(image)) {
                return null;
              }

              return {
                id: asString(image.id),
                storage_path: asString(image.storage_path),
                alt_text: asNullableString(image.alt_text),
                sort_order: asNumber(image.sort_order),
                is_cover: asBoolean(image.is_cover),
                created_at: asString(image.created_at),
              } satisfies AdminProductImage;
            })
            .filter((image): image is AdminProductImage => Boolean(image?.id))
        : [];

      return {
        id: asString(item.id),
        slug: asString(item.slug),
        name: asString(item.name),
        description: asNullableString(item.description),
        badge: asNullableString(item.badge),
        is_published: asBoolean(item.is_published, true),
        sort_order: asNumber(item.sort_order),
        created_at: asString(item.created_at),
        updated_at: asString(item.updated_at),
        images,
      } satisfies AdminProduct;
    })
    .filter((item): item is AdminProduct => Boolean(item?.id))
    .sort((left, right) => left.sort_order - right.sort_order);
}

export function parseGalleryProducts(items: Awaited<GalleryProduct[]>) {
  return items.map((item) => ({
    ...item,
    imageUrl: buildStoragePublicUrl(item.coverPath),
    imageAlt: item.coverAlt || item.name,
  }));
}
