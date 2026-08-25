import React from "react";
import { getCollections, getProducts } from "@/lib/db";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FilterBar } from "@/components/catalog/FilterBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ALL DROPS // Indian Streetwear Catalogue",
  description: "Browse the complete 90s & 2000s Indian streetwear archive — oversized & regular fits inspired by DD National, STD booths, and Cybercafés.",
};

export const revalidate = 60; // ISR revalidate every 60s

interface CatalogPageProps {
  searchParams: Promise<{
    fit?: string;
    size?: string;
    era?: string;
    sort?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const collections = await getCollections();

  const products = await getProducts({
    fit: params.fit,
    size: params.size,
    collectionSlug: params.era === "all" ? undefined : params.era,
  });

  // Handle in-memory sorting if requested
  const sortedProducts = [...products].sort((a, b) => {
    if (params.sort === "price-asc") {
      return a.basePrice - b.basePrice;
    }
    if (params.sort === "price-desc") {
      return b.basePrice - a.basePrice;
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Page Title Header — sits on hype green body */}
      <div className="border-b-4 border-ink pb-6 mb-8">
        <div className="text-xs font-mono font-bold uppercase text-flash tracking-widest mb-1">
          // ARCHIVE CATALOGUE • INDEX
        </div>
        <h1 className="font-display text-4xl sm:text-7xl uppercase tracking-tight text-ink">
          ALL DROPS &amp; CASSETTE CUTS
        </h1>
        <p className="font-body text-sm sm:text-base text-ink/70 max-w-2xl mt-2 leading-relaxed">
          Screenprinted on 240+ GSM heavyweight cotton. Filter by silhouette, size, or historical pop-culture era.
        </p>
      </div>

      {/* Filter Toolbar */}
      <FilterBar collections={collections} totalResults={sortedProducts.length} />

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border-2 border-ink font-mono space-y-3">
          <div className="text-flash text-xl font-bold">NO MATCHING DROPS FOUND</div>
          <p className="text-xs text-ink/60 font-body">
            No items matched your current filter criteria. Try resetting filters to view all archive pieces.
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
