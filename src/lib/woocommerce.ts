import { CollectionData, ProductData, ProductImageData, ProductVariantData } from "@/lib/mock-data";

/**
 * WooCommerce REST API Integration Helper
 * Connects Next.js storefront dynamically to Hostinger WooCommerce backend.
 */

function getWooConfig() {
  return {
    url: (process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WOOCOMMERCE_URL || "").replace(/\/$/, ""),
    key: process.env.WOOCOMMERCE_CONSUMER_KEY || "",
    secret: process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
  };
}

export function isWooCommerceConfigured(): boolean {
  const { url, key, secret } = getWooConfig();
  return Boolean(url && key && secret);
}

/**
 * Helper to fetch data dynamically from WooCommerce REST API v3
 */
async function fetchWooCommerce(endpoint: string, params: Record<string, string> = {}) {
  const { url: baseUrl, key: consumerKey, secret: consumerSecret } = getWooConfig();

  if (!baseUrl || !consumerKey || !consumerSecret) {
    throw new Error("WooCommerce API keys or WordPress URL not configured.");
  }

  const url = new URL(`${baseUrl}/wp-json/wc/v3/${endpoint}`);
  url.searchParams.set("consumer_key", consumerKey);
  url.searchParams.set("consumer_secret", consumerSecret);

  Object.entries(params).forEach(([k, v]) => {
    url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // Fetch fresh data dynamically from WooCommerce
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[WooCommerce API Error ${res.status}]:`, errorText);
    throw new Error(`WooCommerce API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Map WooCommerce Product to App ProductData format
 */
function mapWooProductToProductData(wcProduct: any): ProductData {
  const basePriceRupees = parseFloat(wcProduct.price || wcProduct.regular_price || "0");
  const basePricePaise = Math.round(basePriceRupees * 100);

  const images: ProductImageData[] = (wcProduct.images || []).map((img: any, idx: number) => ({
    id: String(img.id || idx),
    staticUrl: img.src || "",
    altText: img.alt || wcProduct.name,
    position: idx,
  }));

  const sizes: ("S" | "M" | "L" | "XL" | "XXL")[] = ["S", "M", "L", "XL", "XXL"];
  const variants: ProductVariantData[] = (wcProduct.variations?.length ? wcProduct.variations : sizes).map(
    (item: any, idx: number) => {
      const isSize = typeof item === "string";
      const sizeVal = isSize ? item : item.attributes?.find((a: any) => a.name.toLowerCase() === "size")?.option || "M";
      return {
        id: isSize ? `${wcProduct.id}-${item}` : String(item.id),
        productId: String(wcProduct.id),
        size: (["S", "M", "L", "XL", "XXL"].includes(sizeVal) ? sizeVal : "M") as any,
        colorway: "VINTAGE WASH",
        sku: isSize ? `${wcProduct.sku || wcProduct.slug}-${item}` : item.sku || `${wcProduct.slug}-${idx}`,
        stock: isSize ? (wcProduct.stock_quantity ?? 10) : item.stock_quantity ?? 10,
        priceOverride: null,
      };
    }
  );

  const primaryCategory = wcProduct.categories?.[0];

  return {
    id: String(wcProduct.id),
    slug: wcProduct.slug,
    name: wcProduct.name,
    description: wcProduct.description?.replace(/<[^>]*>/g, "") || wcProduct.short_description?.replace(/<[^>]*>/g, "") || "",
    basePrice: basePricePaise,
    fit: wcProduct.attributes?.find((a: any) => a.name.toLowerCase() === "fit")?.options?.[0]?.toUpperCase() === "REGULAR" ? "REGULAR" : "OVERSIZED",
    era: wcProduct.attributes?.find((a: any) => a.name.toLowerCase() === "era")?.options?.[0] || "90S / Y2K",
    collectionId: primaryCategory ? String(primaryCategory.id) : "",
    collectionSlug: primaryCategory?.slug,
    collectionName: primaryCategory?.name,
    active: wcProduct.status === "publish",
    featured: Boolean(wcProduct.featured),
    images,
    variants,
  };
}

/**
 * Fetch all categories/collections from Hostinger WooCommerce
 */
export async function getWooCommerceCollections(): Promise<CollectionData[]> {
  try {
    const categories = await fetchWooCommerce("products/categories", { per_page: "50" });
    if (Array.isArray(categories)) {
      return categories
        .filter((c: any) => c.slug !== "uncategorized")
        .map((c: any) => ({
          id: String(c.id),
          slug: c.slug,
          name: c.name,
          description: c.description || null,
          active: true,
        }));
    }
    return [];
  } catch (error) {
    console.error("[WooCommerce] Error fetching collections:", error);
    return [];
  }
}

/**
 * Fetch products from Hostinger WooCommerce
 */
export async function getWooCommerceProducts(options?: {
  featuredOnly?: boolean;
  collectionSlug?: string;
}): Promise<ProductData[]> {
  try {
    const params: Record<string, string> = { per_page: "50" };
    if (options?.featuredOnly) {
      params.featured = "true";
    }

    const wcProducts = await fetchWooCommerce("products", params);
    if (!Array.isArray(wcProducts)) return [];

    let mapped = wcProducts.map(mapWooProductToProductData);

    if (options?.collectionSlug) {
      mapped = mapped.filter((p: ProductData) => p.collectionSlug === options.collectionSlug);
    }

    return mapped;
  } catch (error) {
    console.error("[WooCommerce] Error fetching products:", error);
    return [];
  }
}

/**
 * Fetch single product by slug from Hostinger WooCommerce
 */
export async function getWooCommerceProductBySlug(slug: string): Promise<ProductData | null> {
  try {
    const wcProducts = await fetchWooCommerce("products", { slug });
    if (Array.isArray(wcProducts) && wcProducts.length > 0) {
      return mapWooProductToProductData(wcProducts[0]);
    }
    return null;
  } catch (error) {
    console.error(`[WooCommerce] Error fetching product ${slug}:`, error);
    return null;
  }
}
