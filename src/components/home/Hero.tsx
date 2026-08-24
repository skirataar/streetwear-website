import React from "react";
import Link from "next/link";
import { TrackingMedia } from "@/components/ui/TrackingMedia";
import { ArrowUpRight, Radio, Tv, Flame } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* CRT Bezel Frame */}
      <div className="relative rounded-2xl border-4 border-ink bg-ink text-paper overflow-hidden crt-bezel shadow-2xl">
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 crt-overlay z-20 pointer-events-none" />

        {/* Top CRT Hardware Header Bar */}
        <div className="bg-ink/90 border-b-2 border-static/40 px-4 py-2 flex items-center justify-between z-30 relative font-mono text-[11px] text-paper/80">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-signal font-bold">
              <span className="w-2 h-2 rounded-full bg-signal animate-ping" />
              CH-04 DD NATIONAL
            </span>
            <span className="hidden sm:inline text-static">|</span>
            <span className="hidden sm:inline">PAL-B // 625 LINES</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-crt/40 text-paper px-2 py-0.5 rounded-xs border border-crt text-[10px] uppercase font-bold">
              MONO SOUND
            </span>
            <span className="text-tape">VOL [ ■■■■□□ ]</span>
          </div>
        </div>

        {/* Main Hero Media & Headline Content */}
        <div className="relative min-h-[480px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-end p-6 sm:p-10 lg:p-12 z-10">
          {/* Background Full-bleed Shot with Tracking Glitch */}
          <div className="absolute inset-0 z-0">
            <TrackingMedia
              staticUrl="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop&q=85"
              videoUrl="https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto,w_1200/dog.mp4"
              altText="Indian Streetwear 90s Broadcast Collection Hero"
              aspectRatio="aspect-auto h-full w-full"
              priority={true}
              className="opacity-75 h-full w-full object-cover"
            />
            {/* Dark gradient for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent z-10 pointer-events-none" />
          </div>

          {/* Overlaid Headline & Interactive Elements */}
          <div className="relative z-20 max-w-4xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 bg-signal text-paper px-3 py-1 text-xs font-mono font-bold tracking-widest uppercase border border-ink shadow-sm">
              <Flame className="w-3.5 h-3.5" />
              DROP #04 // MONSOON ARCHIVE
            </div>

            {/* Large Anton Headline */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.9] text-paper drop-shadow-md">
              POP CULTURE <br />
              <span className="text-tape">FROM THE 90S</span> <br />
              STREETS OF BHARAT
            </h1>

            <p className="font-body text-base sm:text-xl text-paper/90 max-w-2xl font-medium leading-relaxed">
              Heavyweight 240 GSM tees inspired by Doordarshan test signals, cassette rewind hacks, yellow STD booths, and Sharjah cricket glory.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-signal hover:bg-signal/90 text-paper font-mono font-bold text-sm sm:text-base px-6 py-3 border-2 border-paper transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg uppercase"
              >
                <span>SHOP THE DROP</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>

              <Link
                href="/catalog/dd-national"
                className="inline-flex items-center gap-2 bg-paper/10 hover:bg-paper/20 backdrop-blur-xs text-paper font-mono font-bold text-sm sm:text-base px-6 py-3 border-2 border-paper/40 transition-all uppercase"
              >
                <span>VIEW DD NATIONAL</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CRT Bezel Control Knobs (Retro Aesthetic) */}
        <div className="bg-ink border-t-2 border-static/40 px-4 py-2.5 flex items-center justify-between font-mono text-[10px] text-paper/60 z-30 relative">
          <div className="flex items-center gap-4">
            <span>TUNING: 98.4 MHZ</span>
            <span>•</span>
            <span>V-HOLD: LOCKED</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
            <span className="text-paper/80 font-bold uppercase">ON AIR</span>
          </div>
        </div>
      </div>
    </section>
  );
}
