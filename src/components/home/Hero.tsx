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
        <div className="bg-ink/90 border-b-2 border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between z-30 relative font-mono text-[10px] sm:text-[11px] text-white/80 whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="flex items-center gap-1.5 text-hype font-bold truncate">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-hype animate-ping shrink-0" />
              <span className="truncate">
                {latestProduct ? `LIVE DROP: ${latestProduct.name.toUpperCase()}` : "THE HYPE CO. BROADCAST"}
              </span>
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline">PAL-B // 625 LINES</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[9px] sm:text-[10px]">
            <span className="bg-white/10 text-white px-1.5 sm:px-2 py-0.5 rounded-sm border border-white/20 uppercase font-bold shrink-0 whitespace-nowrap">
              MONO SOUND
            </span>
            <span className="text-neutral-400 shrink-0 whitespace-nowrap hidden min-[360px]:inline">
              VOL [ ■■■■□□ ]
            </span>
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
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-mono font-bold tracking-wider sm:tracking-widest uppercase border border-white/20 shadow-sm max-w-full">
              <Flame className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="truncate">{dropBadge}</span>
            </div>

            {/* Large Anton Headline */}
            <h1 className="font-display text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.95] sm:leading-[0.9] text-white drop-shadow-md">
              POP CULTURE <br />
              <span className="text-hype">FROM THE 90S</span> <br />
              STREETS OF BHARAT
            </h1>

            <p className="font-body text-xs sm:text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              {latestProduct?.description
                ? latestProduct.description
                : "Heavyweight 240 GSM tees inspired by Doordarshan test signals, cassette rewind hacks, yellow STD booths, and Sharjah cricket glory."}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={dropLink}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-[10px] text-white font-mono font-bold text-xs sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-white/40 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg uppercase"
              >
                <span>{latestProduct ? "SHOP THIS DROP" : "SHOP ALL DROPS"}</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-[10px] text-white font-mono font-bold text-xs sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-white/40 transition-all uppercase"
              >
                <span>VIEW ALL DROPS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CRT Bezel Control Knobs */}
        <div className="bg-ink border-t-2 border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-white/40 z-30 relative whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span>TUNING: 98.4 MHZ</span>
            <span>•</span>
            <span>V-HOLD: LOCKED</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="inline-block w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-hype animate-pulse" />
            <span className="text-white/60 font-bold uppercase">ON AIR</span>
          </div>
        </div>
      </div>
    </section>
  );
}
