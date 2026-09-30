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
          className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-ink text-white"
        >
          {product.fit}
        </span>
        <span className="text-ink/70 tracking-widest uppercase font-bold truncate max-w-[150px]">
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
          <h3 className="font-display text-xl sm:text-2xl text-ink uppercase tracking-tight leading-snug line-clamp-2">
            <Link href={`/product/${product.slug}`} className="text-ink hover:text-ink transition-colors focus:outline-hidden">
              {product.name}
            </Link>
          </h3>

          {/* Description snippet */}
          <p className="mt-1.5 text-xs text-ink/80 font-body line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Footer */}
        <div className="mt-4 pt-3 border-t border-ink/20 flex items-end justify-between gap-3 font-mono">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-ink/70 font-bold tracking-widest leading-none mb-1">
              PRICE
            </span>
            <span className="text-base font-bold text-ink tracking-tight leading-tight">
              {formatPaise(product.basePrice)}
            </span>
            {product.originalPrice && product.originalPrice > product.basePrice ? (
              <span className="text-[11px] font-bold text-ink/50 line-through leading-tight">
                {formatPaise(product.originalPrice)}
              </span>
            ) : (
              <span className="text-[11px] font-bold opacity-0 leading-tight">
                &nbsp;
              </span>
            )}
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="group/btn inline-flex items-center gap-1.5 bg-ink text-white hover:bg-white hover:text-ink text-xs font-bold px-3.5 py-2 border-2 border-ink transition-all duration-200 uppercase shrink-0 font-mono shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            aria-label={`View details and select size for ${product.name}`}
          >
            <span className="text-white group-hover/btn:text-ink transition-colors">SELECT</span>
            <ArrowRight className="w-3.5 h-3.5 text-white group-hover/btn:text-ink group-hover/btn:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
