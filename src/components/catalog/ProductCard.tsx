"use client";

import React from "react";
import Link from "next/link";
import { ProductData } from "@/lib/mock-data";
import { TrackingMedia } from "@/components/ui/TrackingMedia";
import { formatPaise } from "@/lib/currency";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: ProductData;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const primaryImage = product.images[0] || {
    staticUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    altText: product.name,
    videoUrl: null,
  };

  const isOversized = product.fit === "OVERSIZED";

  return (
    <div className="group relative flex flex-col bg-white border-std border-std-hover transition-all duration-200">
      {/* Product Fit Badge & Era tag header */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b-2 border-ink text-[11px] font-mono font-bold">
        <span
          className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
            isOversized
              ? "bg-flash text-white"
              : "bg-ink text-white"
          }`}
        >
          {product.fit}
        </span>
        <span className="text-neutral-400 tracking-widest uppercase truncate max-w-[150px]">
          {product.era}
        </span>
      </div>

      {/* Signature Tracking Glitch Media Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block border-b-2 border-ink overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        <TrackingMedia
          staticUrl={primaryImage.staticUrl}
          videoUrl={primaryImage.videoUrl}
          altText={primaryImage.altText}
          aspectRatio="aspect-[4/5]"
          priority={priority}
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-white">
        <div>
          {/* Name */}
          <h3 className="font-display text-xl sm:text-2xl text-ink uppercase tracking-tight leading-snug group-hover:text-flash transition-colors line-clamp-2">
            <Link href={`/product/${product.slug}`} className="focus:outline-hidden">
              {product.name}
            </Link>
          </h3>

          {/* Description snippet */}
          <p className="mt-1.5 text-xs text-ink/75 font-body line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Footer */}
        <div className="mt-4 pt-3 border-t border-ink/20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase text-ink/50 font-bold tracking-widest">
              PRICE
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-ink tracking-tight">
              {formatPaise(product.basePrice)}
            </span>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center gap-1.5 bg-ink text-white hover:bg-flash text-xs font-mono font-bold px-3 py-2 border border-ink transition-colors uppercase"
            aria-label={`View details and select size for ${product.name}`}
          >
            <span>SELECT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
