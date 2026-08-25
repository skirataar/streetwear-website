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

export const MOCK_COLLECTIONS: CollectionData[] = [
  {
    id: "col-dd-national",
    slug: "dd-national",
    name: "DD NATIONAL",
    description: "Broadcast calibration charts, 8-bit tuning bars, and evening national hookups.",
    active: true,
  },
  {
    id: "col-std-isd-pco",
    slug: "std-isd-pco",
    name: "STD // ISD // PCO",
    description: "Illuminated yellow signboards, 1-rupee brass coins, and timed pulse meter calls.",
    active: true,
  },
  {
    id: "col-y2k-cybercafe",
    slug: "y2k-cybercafe",
    name: "Y2K // CYBERCAFÉ",
    description: "56kbps dial-up modems, smoky corner booths, Yahoo Messenger, and Winamp skins.",
    active: true,
  },
  {
    id: "col-sharjah-cricket",
    slug: "sharjah-cricket",
    name: "SHARJAH '98 CRICKET",
    description: "CRT sandstorm broadcasts, manual scorecards, and golden desert storm knocks.",
    active: true,
  },
  {
    id: "col-vhs-cassette",
    slug: "vhs-cassette",
    name: "VHS // CASSETTE CULTURE",
    description: "Magnetic tape spools, pencil rewind hacks, tracking glitch scanlines, and mixtape liners.",
    active: true,
  },
  {
    id: "col-90s-bollywood",
    slug: "90s-bollywood",
    name: "90S BOLLYWOOD HOARDINGS",
    description: "Single-screen cinema facades, hand-painted action typography, and dramatic pulp titles.",
    active: true,
  },
];

export const MOCK_PRODUCTS: ProductData[] = [
  {
    id: "prod-1",
    slug: "dd-national-test-pattern-tee",
    name: "DD National Test Pattern Tee",
    description: "Heavyweight 240 GSM French Terry drop featuring the iconic circular Doordarshan test card broadcast spectrum. Complete with 8-bit calibration stripes, frequency dial coordinates, and raw edge collar finishing.",
    basePrice: 185000,
    fit: "OVERSIZED",
    era: "DD NATIONAL",
    collectionId: "col-dd-national",
    collectionSlug: "dd-national",
    collectionName: "DD NATIONAL",
    active: true,
    featured: true,
    images: [
      {
        id: "img-1-1",
        staticUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_800/dog.mp4",
        altText: "DD National Test Pattern Oversized Tee front visual",
        position: 0,
      },
      {
        id: "img-1-2",
        staticUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
        altText: "DD National Test Pattern Tee back print detail",
        position: 1,
      },
      {
        id: "img-1-3",
        staticUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80",
        altText: "DD National Test Pattern collar and label weave",
        position: 2,
      },
    ],
    variants: [
      { id: "var-1-s", productId: "prod-1", size: "S", colorway: "Vintage Paper", sku: "DD-TST-S", stock: 8 },
      { id: "var-1-m", productId: "prod-1", size: "M", colorway: "Vintage Paper", sku: "DD-TST-M", stock: 14 },
      { id: "var-1-l", productId: "prod-1", size: "L", colorway: "Vintage Paper", sku: "DD-TST-L", stock: 19 },
      { id: "var-1-xl", productId: "prod-1", size: "XL", colorway: "Vintage Paper", sku: "DD-TST-XL", stock: 6 },
      { id: "var-1-xxl", productId: "prod-1", size: "XXL", colorway: "Vintage Paper", sku: "DD-TST-XXL", stock: 3 },
    ],
  },
  {
    id: "prod-2",
    slug: "std-pco-one-rupee-booth-tee",
    name: "STD PCO 1-Rupee Booth Tee",
    description: "Tribute to the yellow-and-black illuminated booths and the legendary brass ₹1 coin telephone drop. Screenprinted with 3D high-density puff ink detailing STD pulse codes and rate charts across the spine.",
    basePrice: 165000,
    fit: "REGULAR",
    era: "STD-ISD-PCO",
    collectionId: "col-std-isd-pco",
    collectionSlug: "std-isd-pco",
    collectionName: "STD // ISD // PCO",
    active: true,
    featured: true,
    images: [
      {
        id: "img-2-1",
        staticUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_800/sea-turtle.mp4",
        altText: "STD PCO 1-Rupee Booth Regular Tee front view",
        position: 0,
      },
      {
        id: "img-2-2",
        staticUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=80",
        altText: "STD PCO coin receiver diagram detail",
        position: 1,
      },
    ],
    variants: [
      { id: "var-2-s", productId: "prod-2", size: "S", colorway: "Mustard Tape", sku: "STD-1RS-S", stock: 5 },
      { id: "var-2-m", productId: "prod-2", size: "M", colorway: "Mustard Tape", sku: "STD-1RS-M", stock: 12 },
      { id: "var-2-l", productId: "prod-2", size: "L", colorway: "Mustard Tape", sku: "STD-1RS-L", stock: 9 },
      { id: "var-2-xl", productId: "prod-2", size: "XL", colorway: "Mustard Tape", sku: "STD-1RS-XL", stock: 4 },
      { id: "var-2-xxl", productId: "prod-2", size: "XXL", colorway: "Mustard Tape", sku: "STD-1RS-XXL", stock: 2 },
    ],
  },
  {
    id: "prod-3",
    slug: "y2k-cybercafe-56kbps-tee",
    name: "Y2K Cybercafé 56kbps Dial-Up Tee",
    description: "Dedicated to smoky cabin counters, Yahoo! Chat ASL rooms, Winamp equalizer skins, and floppy disk archives. Cut in our signature boxy oversized drape with CRT scanline typography.",
    basePrice: 195000,
    fit: "OVERSIZED",
    era: "Y2K CYBERCAFÉ",
    collectionId: "col-y2k-cybercafe",
    collectionSlug: "y2k-cybercafe",
    collectionName: "Y2K // CYBERCAFÉ",
    active: true,
    featured: true,
    images: [
      {
        id: "img-3-1",
        staticUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_800/flower.mp4",
        altText: "Y2K Cybercafé 56kbps Dial-Up Tee front",
        position: 0,
      },
      {
        id: "img-3-2",
        staticUrl: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&auto=format&fit=crop&q=80",
        altText: "Y2K Cybercafé back layout and modem schematic",
        position: 1,
      },
    ],
    variants: [
      { id: "var-3-s", productId: "prod-3", size: "S", colorway: "Signal Red", sku: "Y2K-56K-S", stock: 7 },
      { id: "var-3-m", productId: "prod-3", size: "M", colorway: "Signal Red", sku: "Y2K-56K-M", stock: 15 },
      { id: "var-3-l", productId: "prod-3", size: "L", colorway: "Signal Red", sku: "Y2K-56K-L", stock: 11 },
      { id: "var-3-xl", productId: "prod-3", size: "XL", colorway: "Signal Red", sku: "Y2K-56K-XL", stock: 5 },
      { id: "var-3-xxl", productId: "prod-3", size: "XXL", colorway: "Signal Red", sku: "Y2K-56K-XXL", stock: 1 },
    ],
  },
  {
    id: "prod-4",
    slug: "sharjah-98-desert-storm-tee",
    name: "Sharjah '98 Desert Storm Scoreboard Tee",
    description: "Commemorating the golden era of CRT television sandstorms, late-night antenna adjustments, and masterclass desert centuries. Digitally pixelated manual scoreboard layout on 240 GSM carded cotton.",
    basePrice: 185000,
    fit: "OVERSIZED",
    era: "SHARJAH CRICKET",
    collectionId: "col-sharjah-cricket",
    collectionSlug: "sharjah-cricket",
    collectionName: "SHARJAH '98 CRICKET",
    active: true,
    featured: true,
    images: [
      {
        id: "img-4-1",
        staticUrl: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_800/dog.mp4",
        altText: "Sharjah 98 Desert Storm Scoreboard Tee front",
        position: 0,
      },
      {
        id: "img-4-2",
        staticUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
        altText: "Sharjah 98 Scoreboard matrix detail",
        position: 1,
      },
    ],
    variants: [
      { id: "var-4-s", productId: "prod-4", size: "S", colorway: "Deep CRT Teal", sku: "SHJ-98-S", stock: 4 },
      { id: "var-4-m", productId: "prod-4", size: "M", colorway: "Deep CRT Teal", sku: "SHJ-98-M", stock: 10 },
      { id: "var-4-l", productId: "prod-4", size: "L", colorway: "Deep CRT Teal", sku: "SHJ-98-L", stock: 8 },
      { id: "var-4-xl", productId: "prod-4", size: "XL", colorway: "Deep CRT Teal", sku: "SHJ-98-XL", stock: 3 },
      { id: "var-4-xxl", productId: "prod-4", size: "XXL", colorway: "Deep CRT Teal", sku: "SHJ-98-XXL", stock: 0 },
    ],
  },
  {
    id: "prod-5",
    slug: "vhs-tracking-glitch-cassette-tee",
    name: "VHS Tracking Glitch Cassette Tee",
    description: "Gold-embossed cassette tape mechanics with magnetic spool illustrations, pencil rewind diagrams, and Hindi side A/B mixtape tracklist liner notes. Built for tape deck purists.",
    basePrice: 175000,
    fit: "REGULAR",
    era: "VHS & CASSETTE",
    collectionId: "col-vhs-cassette",
    collectionSlug: "vhs-cassette",
    collectionName: "VHS // CASSETTE CULTURE",
    active: true,
    featured: false,
    images: [
      {
        id: "img-5-1",
        staticUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=80",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_800/flower.mp4",
        altText: "VHS Cassette Culture Regular Tee",
        position: 0,
      },
    ],
    variants: [
      { id: "var-5-s", productId: "prod-5", size: "S", colorway: "Charcoal Ink", sku: "VHS-CS-S", stock: 6 },
      { id: "var-5-m", productId: "prod-5", size: "M", colorway: "Charcoal Ink", sku: "VHS-CS-M", stock: 11 },
      { id: "var-5-l", productId: "prod-5", size: "L", colorway: "Charcoal Ink", sku: "VHS-CS-L", stock: 14 },
      { id: "var-5-xl", productId: "prod-5", size: "XL", colorway: "Charcoal Ink", sku: "VHS-CS-XL", stock: 5 },
      { id: "var-5-xxl", productId: "prod-5", size: "XXL", colorway: "Charcoal Ink", sku: "VHS-CS-XXL", stock: 2 },
    ],
  },
  {
    id: "prod-6",
    slug: "90s-bollywood-handpainted-hoarding-tee",
    name: "90s Bollywood Action Hoarding Tee",
    description: "Distressed cinema hoarding aesthetic inspired by iconic Mumbai single-screen cinema artists. Ultra-heavy 260 GSM raw cotton with multi-layer screenprint vibrancy.",
    basePrice: 215000,
    fit: "OVERSIZED",
    era: "90S BOLLYWOOD",
    collectionId: "col-90s-bollywood",
    collectionSlug: "90s-bollywood",
    collectionName: "90S BOLLYWOOD HOARDINGS",
    active: true,
    featured: false,
    images: [
      {
        id: "img-6-1",
        staticUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_800/sea-turtle.mp4",
        altText: "90s Bollywood Action Hoarding Tee",
        position: 0,
      },
    ],
    variants: [
      { id: "var-6-s", productId: "prod-6", size: "S", colorway: "Vintage Kraft", sku: "BW-HDR-S", stock: 3 },
      { id: "var-6-m", productId: "prod-6", size: "M", colorway: "Vintage Kraft", sku: "BW-HDR-M", stock: 8 },
      { id: "var-6-l", productId: "prod-6", size: "L", colorway: "Vintage Kraft", sku: "BW-HDR-L", stock: 12 },
      { id: "var-6-xl", productId: "prod-6", size: "XL", colorway: "Vintage Kraft", sku: "BW-HDR-XL", stock: 7 },
      { id: "var-6-xxl", productId: "prod-6", size: "XXL", colorway: "Vintage Kraft", sku: "BW-HDR-XXL", stock: 2 },
    ],
  },
];

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
