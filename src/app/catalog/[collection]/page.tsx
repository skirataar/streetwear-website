import React from "react";
import { notFound } from "next/navigation";
import { getCollections, getProducts } from "@/lib/db";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const revalidate = 60; // ISR revalidate every 60s

interface CollectionPageProps {
  params: Promise<{ collection: string }>;
}

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((col) => ({ collection: col.slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { collection: slug } = await params;
  const collections = await getCollections();
  const col = collections.find((c) => c.slug === slug);

  if (!col) {
    return { title: "Collection Not Found // Poster Club" };
  }

  return {
    title: `${col.name} // Indian Streetwear Drop`,
    description:
      col.description ||
      `Shop the ${col.name} collection — heavyweight Indian streetwear from Poster Club.`,
    openGraph: {
      title: `${col.name} | Poster Club Streetwear`,
      description: col.description || `Shop the ${col.name} collection.`,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection: slug } = await params;
  const [collections, allProducts] = await Promise.all([
    getCollections(),
    getProducts({ collectionSlug: slug }),
  ]);

  const col = collections.find((c) => c.slug === slug);

  if (!col) {
    notFound();
  }

  // Era number for display (position in collection list)
  const colIndex = collections.findIndex((c) => c.slug === slug);
  const eraNum = String(colIndex + 1).padStart(2, "0");

  return (
    <div className="flex flex-col w-full">
      {/* Full-bleed ink collection header (hard cut from hype body — matches reference pattern) */}
      <section className="bg-ink text-white border-b-4 border-flash">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs text-neutral-400">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="hover:text-hype transition-colors">HOME</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/catalog" className="hover:text-hype transition-colors">CATALOGUE</Link>
              </li>
              <li>/</li>
              <li className="text-white font-bold uppercase">{col.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold text-flash uppercase tracking-widest">
                ERA {eraNum} // BROADCAST ARCHIVE
              </div>
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-none">
                {col.name}
              </h1>
              {col.description && (
                <p className="font-body text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
                  {col.description}
                </p>
              )}
            </div>

            <div className="shrink-0 font-mono text-right">
              <div className="text-6xl sm:text-8xl font-bold text-flash/20 leading-none select-none">
                {eraNum}
              </div>
              <div className="text-xs text-neutral-400 uppercase tracking-widest">
                {allProducts.length} {allProducts.length === 1 ? "PIECE" : "PIECES"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid — back on hype green */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {allProducts.length === 0 ? (
          <div className="text-center py-24 bg-white border-2 border-ink font-mono space-y-4">
            <div className="text-flash text-xl font-bold">TRANSMISSION OFFLINE</div>
            <p className="text-xs text-ink/60 font-body max-w-sm mx-auto">
              No pieces are live in this era yet. New drops are loaded regularly — check back soon.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-ink text-white px-6 py-2.5 font-mono font-bold text-xs uppercase border-2 border-ink hover:bg-flash transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              VIEW ALL DROPS
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 4} />
              ))}
            </div>

            {/* Browse other collections */}
            <div className="mt-16 pt-8 border-t-2 border-ink">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold uppercase text-flash tracking-widest mb-1">
                    // OTHER ERAS IN THE ARCHIVE
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-ink">
                    EXPLORE MORE DROPS
                  </h2>
                </div>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 bg-ink text-white hover:bg-flash px-4 py-2.5 font-mono font-bold text-xs uppercase border border-ink transition-colors"
                >
                  <span>FULL CATALOGUE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {collections
                  .filter((c) => c.slug !== slug)
                  .map((c) => (
                    <Link
                      key={c.id}
                      href={`/catalog/${c.slug}`}
                      className="inline-flex items-center gap-2 bg-white border-2 border-ink px-4 py-2 font-mono text-xs font-bold uppercase text-ink hover:bg-flash hover:text-white hover:border-flash transition-all"
                    >
                      {c.name}
                    </Link>
                  ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
