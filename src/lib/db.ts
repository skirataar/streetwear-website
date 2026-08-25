/**
 * db.ts — Re-exports the data fetching layer from mock-data.
 *
 * mock-data.ts already tries Prisma first and falls back to static mock arrays.
 * This file provides a clean import alias so pages can import from "@/lib/db"
 * and we can later swap the implementation without touching every page.
 *
 * All prices are integers in paise — never float.
 */

export {
  getCollections,
  getProducts,
  getProductBySlug,
} from "@/lib/mock-data";

export type {
  CollectionData,
  ProductData,
  ProductImageData,
  ProductVariantData,
} from "@/lib/mock-data";
