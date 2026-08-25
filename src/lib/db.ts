/**
 * db.ts — Re-exports the data fetching layer from mock-data.
 *
 * mock-data.ts already tries Prisma first and falls back to static mock arrays.
 * This file provides a clean import alias so pages can import from "@/lib/db"
 * and we can later swap the implementation without touching every page.
 *
 * All prices are integers in paise — never float.
 */

import {
  getCollections as getMockCollections,
  getProducts as getMockProducts,
  getProductBySlug as getMockProductBySlug,
} from "@/lib/mock-data";
import {
  isWooCommerceConfigured,
  getWooCommerceCollections,
  getWooCommerceProducts,
  getWooCommerceProductBySlug,
} from "@/lib/woocommerce";

export async function getCollections() {
  if (isWooCommerceConfigured()) {
    const wooCols = await getWooCommerceCollections();
    if (wooCols.length > 0) return wooCols;
  }
  return getMockCollections();
}

export async function getProducts(options?: {
  featuredOnly?: boolean;
  collectionSlug?: string;
  fit?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  if (isWooCommerceConfigured()) {
    const wooProducts = await getWooCommerceProducts(options);
    if (wooProducts.length > 0) return wooProducts;
  }
  return getMockProducts(options);
}

export async function getProductBySlug(slug: string) {
  if (isWooCommerceConfigured()) {
    const wooProduct = await getWooCommerceProductBySlug(slug);
    if (wooProduct) return wooProduct;
  }
  return getMockProductBySlug(slug);
}

export type {
  CollectionData,
  ProductData,
  ProductImageData,
  ProductVariantData,
} from "@/lib/mock-data";

