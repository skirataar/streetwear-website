import React from "react";
import { notFound } from "next/navigation";
import { getCollections, getProducts } from "@/lib/mock-data";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FilterBar } from "@/components/catalog/FilterBar";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60; // ISR revalidate every 60s

interface CollectionPageProps {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{
    fit?: string;
    size?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection: collectionSlug } = await params;
  const collections = await getCollections();
  const currentCollection = collections.find((c) => c.slug === collectionSlug);

  if (!currentCollection) {
    return {
      title: "Collection Not Found",
    };
  }

  return {
    title: `${currentCollection.name} // Indian Streetwear Archive`,
    description: currentCollection.description,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { collection: collectionSlug } = await params;
  const sParams = await searchParams;

  const collections = await getCollections();
  const currentCollection = collections.find((c) => c.slug === collectionSlug);

  if (!currentCollection) {
    notFound();
  }

  const products = await getProducts({
    collectionSlug,
    fit: sParams.fit,
    size: sParams.size,
  });

  const sortedProducts = [...products].sort((a, b) => {
    if (sParams.sort === "price-asc") {
      return a.basePrice - b.basePrice;
    }
    if (sParams.sort === "price-desc") {
      return b.basePrice - a.basePrice;
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Back Link */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-ink/70 hover:text-signal transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO ALL ARCHIVES</span>
      </Link>

      {/* Collection Header Banner */}
      <div className="bg-ink text-paper border-4 border-ink p-6 sm:p-10 mb-8 space-y-4 crt-bezel">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-tape uppercase tracking-widest">
          <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
          <span>BROADCAST ERA // CASSETTE SIDE A</span>
        </div>

        <h1 className="font-display text-4xl sm:text-7xl uppercase tracking-tight text-paper">
          {currentCollection.name}
        </h1>

        <p className="font-body text-sm sm:text-base text-paper/85 max-w-3xl leading-relaxed">
          {currentCollection.description}
        </p>

        <div className="pt-2 flex items-center gap-3 font-mono text-xs text-paper/70">
          <span className="bg-signal text-paper px-2 py-0.5 font-bold uppercase text-[10px]">
            {products.length} {products.length === 1 ? "PIECE" : "PIECES"} IN ARCHIVE
          </span>
          <span>•</span>
          <span>100% HEAVYWEIGHT 240+ GSM</span>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar collections={collections} totalResults={sortedProducts.length} />

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-paper border-2 border-ink font-mono space-y-3">
          <div className="text-signal text-xl font-bold">NO MATCHING DROPS IN THIS ERA</div>
          <p className="text-xs text-ink/70 font-body">
            No items matched your specific filter in this collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
