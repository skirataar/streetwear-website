import React from "react";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getCollections, getProducts } from "@/lib/db";
import { ArrowRight, Radio, Flame } from "lucide-react";

export const revalidate = 60; // ISR revalidate every 60s

export default async function HomePage() {
  const [collections, featuredProducts] = await Promise.all([
    getCollections(),
    getProducts({ featuredOnly: true }),
  ]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. CRT Hero Section */}
      <Hero />

      {/* 2. Dynamic Collection Marquee (Pulls from live Collection data) */}
      <Marquee collections={collections} />

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
            <span>VIEW COMPLETE ARCHIVE ({collections.length} ERAS)</span>
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

      {/* 4. Cultural Storytelling / Era Selector Banner — ink section */}
      <section className="bg-ink text-white py-16 border-y-4 border-flash relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
              // NOSTALGIA ARCHIVED IN COTTON
            </span>
            <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-white">
              THE 90S &amp; 2000S BHARAT EXPERIENCE
            </h2>
            <p className="font-body text-sm sm:text-base text-neutral-400 leading-relaxed">
              Before algorithms and high-speed fibre, culture lived in physical spaces. Every tee in our collection is an ode to the sounds, screens, and signage that shaped a generation.
            </p>
          </div>

          {/* Era Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* DD National Card */}
            <div className="bg-white/5 border-2 border-white/10 p-6 space-y-3 relative group hover:border-hype transition-colors">
              <div className="text-hype text-lg font-bold font-display">01 // DOORDARSHAN</div>
              <h3 className="font-display text-2xl uppercase tracking-tight text-white">
                TEST BAR CALIBRATION
              </h3>
              <p className="text-neutral-400 font-body text-xs leading-relaxed">
                The hypnotic electronic drone before evening transmission. Circular test cards tuned by rabbit-ear antennae across every Indian living room.
              </p>
              <Link
                href="/catalog/dd-national"
                className="inline-flex items-center gap-1.5 text-hype hover:text-white font-bold uppercase pt-2"
              >
                <span>EXPLORE ERA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* STD PCO Card */}
            <div className="bg-white/5 border-2 border-white/10 p-6 space-y-3 relative group hover:border-flash transition-colors">
              <div className="text-flash text-lg font-bold font-display">02 // STD BOOTHS</div>
              <h3 className="font-display text-2xl uppercase tracking-tight text-white">
                1-RUPEE COIN DROPS
              </h3>
              <p className="text-neutral-400 font-body text-xs leading-relaxed">
                Yellow backlit signs in every street corner, dial-tone beeps, and the frantic race to speak before the red pulse timer hit zero.
              </p>
              <Link
                href="/catalog/std-isd-pco"
                className="inline-flex items-center gap-1.5 text-flash hover:text-white font-bold uppercase pt-2"
              >
                <span>EXPLORE ERA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Cybercafé Card */}
            <div className="bg-white/5 border-2 border-white/10 p-6 space-y-3 relative group hover:border-hype transition-colors">
              <div className="text-hype text-lg font-bold font-display">03 // CYBERCAFÉ</div>
              <h3 className="font-display text-2xl uppercase tracking-tight text-white">
                56KBPS DIAL-UP ERA
              </h3>
              <p className="text-neutral-400 font-body text-xs leading-relaxed">
                Curtained wooden cubicles, screeching modems, Yahoo! Messenger chat rooms, Winamp visualizers, and 1.44MB floppy disk archives.
              </p>
              <Link
                href="/catalog/y2k-cybercafe"
                className="inline-flex items-center gap-1.5 text-hype hover:text-white font-bold uppercase pt-2"
              >
                <span>EXPLORE ERA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Newsletter / Drop Alert — ink section (hard cut from hype) */}
      <section className="bg-ink text-white py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-std p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8" style={{ borderColor: "#46E621", boxShadow: "4px 4px 0px #46E621" }}>
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
