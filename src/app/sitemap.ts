import { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thehypeco.in";

  const [collections, products] = await Promise.all([
    getCollections(),
    getProducts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.2,
    },
  ];

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((col) => ({
    url: `${baseUrl}/catalog/${col.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
