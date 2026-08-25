import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us // THE HYPE CO.",
  description: "Learn more about THE HYPE CO., our Indian streetwear legacy, heavyweight cotton fits, and culture.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-hype text-ink">
      {/* Hero Section */}
      <section className="border-b-4 border-ink py-20 px-4 sm:px-6 lg:px-8 bg-flash text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-ink text-white font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest border border-white">
            <Sparkles className="w-4 h-4 text-hype" />
            <span>EST. 1998 // BHARAT STREETWEAR</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl uppercase tracking-tight leading-none text-white">
            THE HYPE CO.
          </h1>
          <p className="font-mono text-sm sm:text-base max-w-2xl mx-auto opacity-90 leading-relaxed">
            Crafting premium Indian streetwear inspired by 90s nostalga, CRT tuning bars, STD booths, and cybercafé culture. High-density graphics, heavyweight cotton, and oversized fits.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-ink">
              HEAVYWEIGHT FIT. NO COMPROMISE.
            </h2>
            <p className="font-mono text-sm leading-relaxed text-ink/80">
              Every garment is custom-milled from 240+ GSM 100% combed cotton, screen-printed with high-density puff and discharge inks that age gracefully with wear.
            </p>
            <p className="font-mono text-sm leading-relaxed text-ink/80">
              We design every collection to reflect real subcultures — from vintage broadcast aesthetics to classic Indian street culture.
            </p>
            <div className="pt-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-ink text-white hover:bg-flash font-mono font-bold text-xs uppercase px-6 py-3.5 border-2 border-ink transition-colors"
              >
                <span>EXPLORE ALL PRODUCTS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-ink text-white p-8 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(240,23,92,1)] space-y-6 font-mono text-xs">
            <div className="border-b border-white/20 pb-4">
              <span className="text-flash font-bold text-sm block">01. HEAVYWEIGHT FABRIC</span>
              <span className="text-white/70">240 GSM pre-shrunk combed cotton for structural drape.</span>
            </div>
            <div className="border-b border-white/20 pb-4">
              <span className="text-flash font-bold text-sm block">02. OVERSIZED CUT</span>
              <span className="text-white/70">Boxy streetwear silhouette with drop shoulders.</span>
            </div>
            <div>
              <span className="text-flash font-bold text-sm block">03. PAN-INDIA DISPATCH</span>
              <span className="text-white/70">Tracked shipping across India with secure packaging.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-ink text-white py-12 border-t-4 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center font-mono text-xs">
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-6 h-6 text-flash" />
            <span className="font-bold text-sm">FREE EXPRESS SHIPPING</span>
            <span className="text-white/60">On orders above ₹1,999</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-flash" />
            <span className="font-bold text-sm">SECURE PAYMENTS</span>
            <span className="text-white/60">UPI, Cards, Netbanking & COD</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RotateCcw className="w-6 h-6 text-flash" />
            <span className="font-bold text-sm">7-DAY EASY EXCHANGES</span>
            <span className="text-white/60">Hassle-free size replacements</span>
          </div>
        </div>
      </section>
    </div>
  );
}
