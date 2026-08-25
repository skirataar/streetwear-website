export interface CollectionData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  active: boolean;
}

export interface ProductImageData {
  id: string;
  staticUrl: string;
  videoUrl?: string;
  altText: string;
  position: number;
}

export interface ProductVariantData {
  id: string;
  productId: string;
  size: "S" | "M" | "L" | "XL" | "XXL";
  colorway: string;
  sku: string;
  stock: number;
  priceOverride?: number | null;
}

export interface ProductData {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number; // in paise (e.g. 185000 = ₹1,850.00)
  fit: "OVERSIZED" | "REGULAR";
  era: string;
  collectionId: string;
  collectionSlug?: string;
  collectionName?: string;
  active: boolean;
  featured: boolean;
  images: ProductImageData[];
  variants: ProductVariantData[];
}

export const MOCK_COLLECTIONS: CollectionData[] = [];

export const MOCK_PRODUCTS: ProductData[] = [];

export async function getCollections(): Promise<CollectionData[]> {
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import("@/lib/prisma");
      const collections = await prisma.collection.findMany({
        where: { active: true },
        orderBy: { createdAt: "asc" },
      });
      if (collections && collections.length > 0) {
        return collections;
      }
    }
  } catch {
    // Fallback gracefully to mock data
  }
  return MOCK_COLLECTIONS;
}

export async function getProducts(options?: {
  collectionSlug?: string;
  fit?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  featuredOnly?: boolean;
}): Promise<ProductData[]> {
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import("@/lib/prisma");
      const where: any = { active: true };

    if (options?.featuredOnly) {
      where.featured = true;
    }
    if (options?.fit) {
      where.fit = options.fit.toUpperCase();
    }
    if (options?.collectionSlug) {
      where.collection = { slug: options.collectionSlug };
    }
    if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
      where.basePrice = {};
      if (options.minPrice !== undefined) where.basePrice.gte = options.minPrice;
      if (options.maxPrice !== undefined) where.basePrice.lte = options.maxPrice;
    }
    if (options?.size) {
      where.variants = {
        some: {
          size: options.size.toUpperCase(),
          stock: { gt: 0 },
        },
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: "asc" } },
        variants: { orderBy: { size: "asc" } },
        collection: true,
      },
      orderBy: { createdAt: "desc" },
    });

      if (products && products.length > 0) {
        return products.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          description: p.description,
          basePrice: p.basePrice,
          fit: p.fit as "OVERSIZED" | "REGULAR",
          era: p.era,
          collectionId: p.collectionId || "",
          collectionSlug: p.collection?.slug,
          collectionName: p.collection?.name,
          active: p.active,
          featured: p.featured,
          images: p.images.map((img) => ({
            id: img.id,
            staticUrl: img.staticUrl,
            videoUrl: img.videoUrl || undefined,
            altText: img.altText,
            position: img.position,
          })),
          variants: p.variants.map((v) => ({
            id: v.id,
            productId: v.productId,
            size: v.size as any,
            colorway: v.colorway,
            sku: v.sku,
            stock: v.stock,
            priceOverride: v.priceOverride,
          })),
        }));
      }
    }
  } catch {
    // Fallback to mock data with filter logic
  }

  let filtered = [...MOCK_PRODUCTS];
  if (options?.featuredOnly) {
    filtered = filtered.filter((p) => p.featured);
  }
  if (options?.collectionSlug) {
    filtered = filtered.filter((p) => p.collectionSlug === options.collectionSlug);
  }
  if (options?.fit) {
    filtered = filtered.filter((p) => p.fit.toLowerCase() === options.fit?.toLowerCase());
  }
  if (options?.size) {
    filtered = filtered.filter((p) =>
      p.variants.some((v) => v.size.toLowerCase() === options.size?.toLowerCase() && v.stock > 0)
    );
  }
  if (options?.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.basePrice >= (options.minPrice || 0));
  }
  if (options?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.basePrice <= (options.maxPrice || 0));
  }

  return filtered;
}

export async function getProductBySlug(slug: string): Promise<ProductData | null> {
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import("@/lib/prisma");
      const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: { orderBy: { size: "asc" } },
        collection: true,
      },
    });
    if (product) {
      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        fit: product.fit as "OVERSIZED" | "REGULAR",
        era: product.era,
        collectionId: product.collectionId || "",
        collectionSlug: product.collection?.slug,
        collectionName: product.collection?.name,
        active: product.active,
        featured: product.featured,
        images: product.images.map((img) => ({
          id: img.id,
          staticUrl: img.staticUrl,
          videoUrl: img.videoUrl || undefined,
          altText: img.altText,
          position: img.position,
        })),
        variants: product.variants.map((v) => ({
          id: v.id,
          productId: v.productId,
          size: v.size as any,
          colorway: v.colorway,
          sku: v.sku,
          stock: v.stock,
          priceOverride: v.priceOverride,
        })),
      };
    }
  }
  } catch {
    // Fallback to mock lookup
  }
  return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
}
