import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Layers,
  CheckCircle2,
  Scissors,
  PackageCheck,
  Flame,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us // THE HYPE CO.",
  description: "Learn more about THE HYPE CO. — our heavyweight cotton engineering, boxy oversized fits, and Indian streetwear ethos.",
};

export default function AboutPage() {
  const specs = [
    {
      number: "01",
      title: "240+ GSM COMBED COTTON",
      detail: "Custom-milled from long-staple cotton for structural drape, zero transparency, and a substantial, premium hand-feel.",
    },
    {
      number: "02",
      title: "BOXY OVERSIZED SILHOUETTE",
      detail: "Calculated drop shoulders, widened chest dimensions, and clean torso proportions built for an effortless streetwear drape.",
    },
    {
      number: "03",
      title: "BIO-WASHED & PRE-SHRUNK",
      detail: "Double pre-shrunk and silicone bio-washed so your oversized fit stays true through routine domestic laundry cycles.",
    },
    {
      number: "04",
      title: "HIGH-DENSITY GRAPHICS",
      detail: "Screen-printed with premium layered inks designed to withstand extended wear without peeling, cracking, or stiffening.",
    },
  ];

  const pillars = [
    {
      icon: Scissors,
      title: "STRUCTURAL CRAFTSMANSHIP",
      description: "We don't use generic stock blanks. Every garment is cut, stitched, and finished with reinforced collar ribbing and heavy seam construction.",
    },
    {
      icon: Flame,
      title: "LIMITED BATCH DROPS",
      description: "We design focused releases rather than mass-market fast fashion, keeping quality strictly controlled from first cut to final dispatch.",
    },
    {
      icon: PackageCheck,
      title: "PAN-INDIA DISPATCH",
      description: "Based in India and serving streetwear culture across the country with reliable express couriers and real-time shipment tracking.",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen text-ink">
      {/* 1. Header / Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 w-full">
        <div className="border-b-4 border-ink pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-ink tracking-widest mb-3">
            <Sparkles className="w-4 h-4" />
            <span>DOSSIER // THE HYPE CO. STREETWEAR</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-ink leading-none">
            HEAVYWEIGHT FIT. <br />
            NO COMPROMISE.
          </h1>

          <p className="mt-6 text-sm sm:text-base font-body text-ink/80 max-w-3xl leading-relaxed">
            THE HYPE CO. is an independent streetwear brand built around heavyweight cotton, boxy oversized cuts, and raw street aesthetics. We build daily essentials engineered to hold their shape, silhouette, and character wear after wear.
          </p>
        </div>

        {/* Quick Specs Ribbon */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-mono font-bold uppercase text-ink/80">
          <span className="bg-ink text-white px-2.5 py-1 text-[11px]">THE HYPE CO.</span>
          <span>•</span>
          <span>100% COMBED COTTON</span>
          <span>•</span>
          <span>240+ GSM FABRIC</span>
          <span>•</span>
          <span>OVERSIZED CUT</span>
          <span>•</span>
          <span>PAN-INDIA DISPATCH</span>
        </div>
      </section>

      {/* 2. Brand Story & Fabric Blueprint Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Brand Story Card */}
          <div className="lg:col-span-7 bg-white border-std p-6 sm:p-10 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-ink/70 border-b border-ink/20 pb-2">
              <Sparkles className="w-4 h-4" />
              <span>OUR STORY &amp; ETHOS</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-ink leading-tight">
              BUILT FOR ROTATION. <br />
              NOT DISPOSABLE TRENDS.
            </h2>

            <div className="space-y-4 font-body text-sm sm:text-base text-ink/80 leading-relaxed">
              <p>
                We started THE HYPE CO. with a straightforward conviction: Indian streetwear deserves heavyweight, structurally sound garments that don't lose their shape after two washes.
              </p>
              <p>
                Too much contemporary streetwear relies on paper-thin polyester blends and generic blanks with inflated price tags. We focused entirely on the garment itself — dialing in the fabric weight, neck ribbing elasticity, sleeve drops, and boxy torso drape.
              </p>
              <p className="font-mono text-xs font-bold text-ink uppercase border-l-4 border-ink pl-4 py-1.5 bg-ink/5">
                "Heavyweight fabric, clean oversized silhouette, and long-lasting durability. That is the core standard for every piece we drop."
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/catalog"
                className="group/btn inline-flex items-center gap-2 bg-ink text-white hover:bg-white hover:text-ink text-xs font-mono font-bold uppercase px-6 py-3.5 border-2 border-ink shadow-sm transition-all duration-200"
              >
                <span>EXPLORE ALL PRODUCTS</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Fabric Blueprint Card */}
          <div className="lg:col-span-5 bg-white border-std p-6 sm:p-8 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-ink/70 border-b border-ink/20 pb-2 w-full justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                FABRIC SPECIFICATIONS
              </span>
              <span className="text-[10px] bg-ink text-white px-2 py-0.5 font-mono">SPEC 240</span>
            </div>

            <div className="space-y-5">
              {specs.map((spec) => (
                <div key={spec.number} className="border-b border-ink/15 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink mb-1">
                    <span className="w-5 h-5 bg-ink text-white flex items-center justify-center text-[10px] shrink-0">
                      {spec.number}
                    </span>
                    <span className="tracking-tight">{spec.title}</span>
                  </div>
                  <p className="text-xs font-body text-ink/70 leading-relaxed pl-7">
                    {spec.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-ink/5 border border-ink/20 p-4 text-[11px] font-mono text-ink/80 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-ink shrink-0" />
              <span>Pre-shrunk fabric ensures consistent fit and zero shrinkage post-wash.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Brand Standards / Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="border-t-4 border-ink pt-8 mb-8">
          <div className="text-xs font-mono font-bold uppercase text-ink tracking-widest mb-1">
            // CORE STANDARDS
          </div>
          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-ink">
            HOW WE MAKE IT
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white border-std border-std-hover p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-ink/20 pb-2">
                    <span className="bg-ink text-white px-2 py-0.5 text-[10px] font-bold">
                      0{idx + 1}
                    </span>
                    <Icon className="w-5 h-5 text-ink/70" />
                  </div>

                  <h3 className="font-display text-2xl uppercase tracking-tight text-ink">
                    {pillar.title}
                  </h3>

                  <p className="font-body text-xs text-ink/70 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Trust & Service Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center font-mono">
          <div className="bg-white border-std p-6 flex flex-col items-center gap-3">
            <Truck className="w-6 h-6 text-ink" />
            <span className="font-bold text-sm uppercase">FREE EXPRESS SHIPPING</span>
            <span className="text-xs font-body text-ink/70">
              Orders above ₹1,999 ship via express tracked couriers across India.
            </span>
          </div>

          <div className="bg-white border-std p-6 flex flex-col items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-ink" />
            <span className="font-bold text-sm uppercase">SECURE PAYMENT RAILS</span>
            <span className="text-xs font-body text-ink/70">
              Razorpay encrypted checkout with UPI, NetBanking, Credit/Debit cards, and COD.
            </span>
          </div>

          <div className="bg-white border-std p-6 flex flex-col items-center gap-3">
            <RotateCcw className="w-6 h-6 text-ink" />
            <span className="font-bold text-sm uppercase">7-DAY SIZE EXCHANGES</span>
            <span className="text-xs font-body text-ink/70">
              Need to adjust your fit? Swap sizes seamlessly within 7 days of delivery.
            </span>
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-ink text-white border-std p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-neutral-400">
              <Sparkles className="w-4 h-4 text-white" />
              <span>THE HYPE CO. STOREFRONT</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              EXPLORE THE LATEST DROPS
            </h2>
            <p className="font-body text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Check out our available heavyweight tees, boxy fits, and clean streetwear cuts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/catalog"
              className="group/btn inline-flex items-center justify-center gap-2 bg-white text-ink hover:bg-ink hover:text-white hover:border-white text-xs font-mono font-bold uppercase px-8 py-4 border-2 border-white shadow-md transition-all duration-200"
            >
              <span>BROWSE ALL PRODUCTS</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
