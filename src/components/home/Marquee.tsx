import React from "react";
import Link from "next/link";
import { CollectionData, ProductData } from "@/lib/mock-data";

interface MarqueeProps {
  collections?: CollectionData[];
  products?: ProductData[];
}

export function Marquee({ collections = [], products = [] }: MarqueeProps) {
  // Build ticker items dynamically based on live data
  let items: { name: string; href: string; badge: string }[] = [];

  if (collections.length > 0) {
    items = collections.map((col, idx) => ({
      name: col.name,
      href: `/catalog/${col.slug}`,
      badge: `DROP #${idx + 1}`,
    }));
  } else if (products.length > 0) {
    items = products.map((prod, idx) => ({
      name: prod.name,
      href: `/product/${prod.slug}`,
      badge: `DROP #${idx + 1}`,
    }));
  }

  if (items.length === 0) {
    return null;
  }

  // Only scroll if there are 5 or more items to fill the strip; otherwise keep static on the left
  const shouldScroll = items.length >= 5;

  return (
    <div
      className="w-full bg-ink text-white border-y-2 border-ink overflow-hidden py-3 relative select-none z-20"
      aria-label="Live Ticker"
    >
      {shouldScroll ? (
        /* Animated continuous marquee loop when 5+ items fill the strip */
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {[0, 1].map((setIndex) => (
            <div key={setIndex} className="flex items-center gap-8 px-4 shrink-0">
              {items.map((item, idx) => (
                <Link
                  key={`${item.name}-${setIndex}-${idx}`}
                  href={item.href}
                  className="flex items-center gap-3 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase hover:text-hype transition-colors group shrink-0"
                >
                  <span className="text-flash text-sm sm:text-base group-hover:rotate-45 transition-transform inline-block">
                    ✦
                  </span>
                  <span className="group-hover:underline decoration-flash decoration-2 underline-offset-4">
                    {item.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] bg-white/10 text-neutral-300 px-2 py-0.5 rounded-xs font-mono font-semibold">
                    {item.badge}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      ) : (
        /* Static layout aligned to the left when there are fewer items (< 5) */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 overflow-x-auto whitespace-nowrap">
          {items.map((item, idx) => (
            <Link
              key={`${item.name}-${idx}`}
              href={item.href}
              className="flex items-center gap-3 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase hover:text-hype transition-colors group shrink-0"
            >
              <span className="text-flash text-sm sm:text-base group-hover:rotate-45 transition-transform inline-block">
                ✦
              </span>
              <span className="group-hover:underline decoration-flash decoration-2 underline-offset-4">
                {item.name}
              </span>
              <span className="text-[10px] sm:text-[11px] bg-white/10 text-neutral-300 px-2 py-0.5 rounded-xs font-mono font-semibold">
                {item.badge}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
