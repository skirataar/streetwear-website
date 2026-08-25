import React from "react";
import Link from "next/link";
import { TrackingMedia } from "@/components/ui/TrackingMedia";
import { ArrowUpRight, Flame } from "lucide-react";
import { ProductData } from "@/lib/mock-data";

interface HeroProps {
  latestProduct?: ProductData | null;
}

export function Hero({ latestProduct }: HeroProps) {
  const dropLink = latestProduct ? `/product/${latestProduct.slug}` : "/catalog";
  const dropBadge = latestProduct
    ? `LATEST DROP // ${latestProduct.name.toUpperCase()}`
    : "THE HYPE CO. // MONSOON ARCHIVE";
  const heroImage = latestProduct?.images?.[0]?.staticUrl || "/images/hero/hero-1.jpg";

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* CRT Bezel Frame — thick ink border on hype green page */}
      <div className="relative rounded-2xl border-4 border-ink bg-ink text-white overflow-hidden crt-bezel shadow-2xl">
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 crt-overlay z-20 pointer-events-none" />

        {/* Top CRT Hardware Header Bar */}
        <div className="bg-ink/90 border-b-2 border-white/10 px-4 py-2 flex items-center justify-between z-30 relative font-mono text-[11px] text-white/80">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-hype font-bold">
              <span className="w-2 h-2 rounded-full bg-hype animate-ping" />
              {latestProduct ? `LIVE DROP: ${latestProduct.name.toUpperCase()}` : "THE HYPE CO. BROADCAST"}
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline">PAL-B // 625 LINES</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/10 text-white px-2 py-0.5 rounded-sm border border-white/20 text-[10px] uppercase font-bold">
              MONO SOUND
            </span>
            <span className="text-neutral-400">VOL [ ■■■■□□ ]</span>
          </div>
        </div>

        {/* Main Hero Media & Headline Content */}
        <div className="relative min-h-[480px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-end p-6 sm:p-10 lg:p-12 z-10">
          {/* Background Full-bleed Shot with Tracking Glitch */}
          <div className="absolute inset-0 z-0">
            <TrackingMedia
              staticUrl={heroImage}
              videoUrl={latestProduct?.images?.[0]?.videoUrl || "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_1200/dog.mp4"}
              altText={latestProduct?.name || "Indian Streetwear Broadcast Collection Hero"}
              aspectRatio="aspect-auto h-full w-full"
              priority={true}
              className="opacity-75 h-full w-full object-cover"
            />
            {/* Dark gradient for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent z-10 pointer-events-none" />
          </div>

          {/* Overlaid Headline & Interactive Elements */}
          <div className="relative z-20 max-w-4xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 bg-flash text-white px-3 py-1 text-xs font-mono font-bold tracking-widest uppercase border border-white/20 shadow-sm">
              <Flame className="w-3.5 h-3.5" />
              <span>{dropBadge}</span>
            </div>

            {/* Large Anton Headline */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.9] text-white drop-shadow-md">
              POP CULTURE <br />
              <span className="text-hype">FROM THE 90S</span> <br />
              STREETS OF BHARAT
            </h1>

            <p className="font-body text-base sm:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              {latestProduct?.description
                ? latestProduct.description
                : "Heavyweight 240 GSM tees inspired by Doordarshan test signals, cassette rewind hacks, yellow STD booths, and Sharjah cricket glory."}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href={dropLink}
                className="inline-flex items-center gap-2 bg-flash hover:bg-flash/90 text-white font-mono font-bold text-sm sm:text-base px-6 py-3 border-2 border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg uppercase"
              >
                <span>{latestProduct ? "SHOP THIS DROP" : "SHOP ALL DROPS"}</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>

              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-mono font-bold text-sm sm:text-base px-6 py-3 border-2 border-white/40 transition-all uppercase"
              >
                <span>VIEW ALL DROPS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CRT Bezel Control Knobs */}
        <div className="bg-ink border-t-2 border-white/10 px-4 py-2.5 flex items-center justify-between font-mono text-[10px] text-white/40 z-30 relative">
          <div className="flex items-center gap-4">
            <span>TUNING: 98.4 MHZ</span>
            <span>•</span>
            <span>V-HOLD: LOCKED</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-hype animate-pulse" />
            <span className="text-white/60 font-bold uppercase">ON AIR</span>
          </div>
        </div>
      </div>
    </section>
  );
}
