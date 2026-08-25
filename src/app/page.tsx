import React from "react";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getCollections, getProducts } from "@/lib/db";
import { ArrowRight, Radio, Flame } from "lucide-react";

export const revalidate = 60; // ISR revalidate every 60s

export default async function HomePage() {
  const [collections, featuredProducts, allProducts] = await Promise.all([
    getCollections(),
    getProducts({ featuredOnly: true }),
    getProducts(),
  ]);

  const latestProduct = allProducts.length > 0 ? allProducts[0] : (featuredProducts.length > 0 ? featuredProducts[0] : null);

  return (
    <div className="flex flex-col w-full">
      {/* 1. CRT Hero Section */}
      <Hero latestProduct={latestProduct} />

      {/* 2. Dynamic Collection Marquee (Pulls from live Collection & Product data) */}
      <Marquee collections={collections} products={allProducts} />

      {/* 3. Featured Drops Section — sits on hype green (body default) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b-4 border-ink gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-flash tracking-widest mb-1">
              <Flame className="w-4 h-4" />
              <span>CURRENT BROADCAST ARCHIVE</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight leading-none">
              FEATURED DROPS
            </h2>
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-ink text-white hover:bg-flash font-mono font-bold text-xs uppercase px-4 py-2.5 border border-ink transition-colors self-start md:self-auto"
          >
            <span>VIEW COMPLETE ARCHIVE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 2} />
          ))}
        </div>
      </section>

      {/* 4. New Arrivals & Dynamic Product Showcase — ink section */}
      <section className="bg-ink text-white py-16 border-y-4 border-flash relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
              // FREQUENCY BROADCAST ARCHIVE
            </span>
            <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-white">
              NEW ARRIVALS
            </h2>
            <p className="font-body text-sm sm:text-base text-neutral-400 leading-relaxed">
              Heavyweight 240+ GSM streetwear crafted with high-density graphics, boxy oversized drapes, and Indian subculture nostalgia.
            </p>
          </div>

          {/* Dynamic 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {[0, 1, 2].map((idx) => {
              const product = allProducts[idx];
              const isAvailable = Boolean(product);
              const cardBorder = idx % 2 === 0 ? "hover:border-hype" : "hover:border-flash";
              const accentColor = idx % 2 === 0 ? "text-hype" : "text-flash";

              if (isAvailable && product) {
                return (
                  <div
                    key={product.id}
                    className={`bg-white/5 border-2 border-white/10 p-6 space-y-3 relative group ${cardBorder} transition-colors flex flex-col justify-between`}
                  >
                    <div className="space-y-3">
                      <div className={`${accentColor} text-lg font-bold font-display uppercase`}>
                        0{idx + 1} // {product.fit || "OVERSIZED"} DROP
                      </div>
                      <h3 className="font-display text-2xl uppercase tracking-tight text-white line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-neutral-400 font-body text-xs leading-relaxed line-clamp-3">
                        {product.description || "Heavyweight 240+ GSM Indian streetwear tee. Built for structural drape and long-lasting durability."}
                      </p>
                    </div>
                    <div className="pt-4">
                      <Link
                        href={`/product/${product.slug}`}
                        className={`inline-flex items-center gap-1.5 ${accentColor} hover:text-white font-bold uppercase`}
                      >
                        <span>VIEW PRODUCT</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={`coming-soon-${idx}`}
                  className="bg-white/5 border-2 border-white/10 p-6 space-y-3 relative group hover:border-hype transition-colors flex flex-col justify-between opacity-80"
                >
                  <div className="space-y-3">
                    <div className="text-neutral-500 text-lg font-bold font-display uppercase">
                      0{idx + 1} // NEXT DROP
                    </div>
                    <h3 className="font-display text-2xl uppercase tracking-tight text-white/70">
                      COMING SOON...
                    </h3>
                    <p className="text-neutral-400 font-body text-xs leading-relaxed">
                      Next heavyweight 240+ GSM release is currently in production. Join the broadcast list below for early drop passwords.
                    </p>
                  </div>
                  <div className="pt-4">
                    <span className="inline-flex items-center gap-1.5 text-neutral-500 font-bold uppercase cursor-default">
                      <span>COMING SOON</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Newsletter / Drop Alert — ink section (hard cut from hype) */}
      <section className="bg-ink text-white py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-std p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8" style={{ borderColor: "#c5fe02", boxShadow: "4px 4px 0px #c5fe02" }}>
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-hype">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>EARLY FREQUENCY TRANSMISSION</span>
              </div>
              <h3 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-white">
                GET NOTIFIED BEFORE THE NEXT TAPE DROPS
              </h3>
              <p className="text-xs sm:text-sm font-body text-neutral-400 leading-relaxed">
                Limited runs of 200 pieces per drop. Enter your mobile / email to receive the frequency broadcast password 30 minutes before public launch.
              </p>
            </div>

            <form className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="ENTER EMAIL OR PHONE"
                className="bg-ink border-2 border-white/20 text-white px-4 py-3 text-xs font-mono uppercase focus:outline-hidden focus:border-hype min-w-[240px] placeholder:text-neutral-500"
              />
              <button
                type="submit"
                className="bg-flash text-white hover:bg-flash/90 px-6 py-3 font-mono font-bold text-xs uppercase border-2 border-flash shadow-sm transition-colors whitespace-nowrap"
              >
                JOIN BROADCAST
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
