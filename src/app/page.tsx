import React from "react";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getCollections, getProducts } from "@/lib/mock-data";
import { ArrowRight, Radio, Disc, Flame, Sparkles } from "lucide-react";

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

      {/* 3. Featured Drops Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b-4 border-ink gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-signal tracking-widest mb-1">
              <Flame className="w-4 h-4" />
              <span>CURRENT BROADCAST ARCHIVE</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight leading-none">
              FEATURED DROPS
            </h2>
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-ink text-paper hover:bg-signal font-mono font-bold text-xs uppercase px-4 py-2.5 border border-ink transition-colors self-start md:self-auto"
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

      {/* 4. Cultural Storytelling / Era Selector Banner */}
      <section className="bg-ink text-paper py-16 border-y-4 border-signal relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-mono font-bold text-tape uppercase tracking-widest">
              // NOSTALGIA ARCHIVED IN COTTON
            </span>
            <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-paper">
              THE 90S & 2000S BHARAT EXPERIENCE
            </h2>
            <p className="font-body text-sm sm:text-base text-paper/80 leading-relaxed">
              Before algorithms and high-speed fibre, culture lived in physical spaces. Every tee in our collection is an ode to the sounds, screens, and signage that shaped a generation.
            </p>
          </div>

          {/* Era Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* DD National Card */}
            <div className="bg-paper/10 border-2 border-paper/30 p-6 space-y-3 relative group hover:border-signal transition-colors">
              <div className="text-signal text-lg font-bold font-display">01 // DOORDARSHAN</div>
              <h3 className="font-display text-2xl uppercase tracking-tight text-paper">
                TEST BAR CALIBRATION
              </h3>
              <p className="text-paper/70 font-body text-xs leading-relaxed">
                The hypnotic electronic drone before evening transmission. Circular test cards tuned by rabbit-ear antennae across every Indian living room.
              </p>
              <Link
                href="/catalog/dd-national"
                className="inline-flex items-center gap-1.5 text-tape hover:text-signal font-bold uppercase pt-2"
              >
                <span>EXPLORE ERA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* STD PCO Card */}
            <div className="bg-paper/10 border-2 border-paper/30 p-6 space-y-3 relative group hover:border-tape transition-colors">
              <div className="text-tape text-lg font-bold font-display">02 // STD BOOTHS</div>
              <h3 className="font-display text-2xl uppercase tracking-tight text-paper">
                1-RUPEE COIN DROPS
              </h3>
              <p className="text-paper/70 font-body text-xs leading-relaxed">
                Yellow backlit signs in every street corner, dial-tone beeps, and the frantic race to speak before the red pulse timer hit zero.
              </p>
              <Link
                href="/catalog/std-isd-pco"
                className="inline-flex items-center gap-1.5 text-tape hover:text-signal font-bold uppercase pt-2"
              >
                <span>EXPLORE ERA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Cybercafé Card */}
            <div className="bg-paper/10 border-2 border-paper/30 p-6 space-y-3 relative group hover:border-crt transition-colors">
              <div className="text-crt text-lg font-bold font-display">03 // CYBERCAFÉ</div>
              <h3 className="font-display text-2xl uppercase tracking-tight text-paper">
                56KBPS DIAL-UP ERA
              </h3>
              <p className="text-paper/70 font-body text-xs leading-relaxed">
                Curtained wooden cubicles, screeching modems, Yahoo! Messenger chat rooms, Winamp visualizers, and 1.44MB floppy disk archives.
              </p>
              <Link
                href="/catalog/y2k-cybercafe"
                className="inline-flex items-center gap-1.5 text-tape hover:text-signal font-bold uppercase pt-2"
              >
                <span>EXPLORE ERA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STD Booth Style Newsletter & Drop Alert */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="bg-paper border-std p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-signal">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>EARLY FREQUENCY TRANSMISSION</span>
            </div>
            <h3 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-ink">
              GET NOTIFIED BEFORE THE NEXT TAPE DROPS
            </h3>
            <p className="text-xs sm:text-sm font-body text-ink/80 leading-relaxed">
              Limited runs of 200 pieces per drop. Enter your mobile / email to receive the frequency broadcast password 30 minutes before public launch.
            </p>
          </div>

          <form className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="ENTER EMAIL OR PHONE"
              className="bg-paper border-2 border-ink px-4 py-3 text-xs font-mono uppercase focus:outline-hidden min-w-[240px]"
            />
            <button
              type="submit"
              className="bg-signal text-paper hover:bg-signal/90 px-6 py-3 font-mono font-bold text-xs uppercase border-2 border-ink shadow-sm transition-colors whitespace-nowrap"
            >
              JOIN BROADCAST
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
