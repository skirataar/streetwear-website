import React from "react";
import Link from "next/link";
import { CollectionData } from "@/lib/mock-data";

interface MarqueeProps {
  collections: CollectionData[];
}

export function Marquee({ collections }: MarqueeProps) {
  // If no collections passed, provide safe default empty array
  const collectionList = collections && collections.length > 0 ? collections : [];

  // Repeat items to ensure seamless loop
  const repeatedItems = [...collectionList, ...collectionList, ...collectionList, ...collectionList];

  return (
    <div
      className="w-full bg-ink text-white border-y-2 border-ink overflow-hidden py-2.5 relative select-none"
      aria-label="Live Collection Ticker"
    >
      <div className="flex w-max animate-marquee space-x-6 items-center">
        {repeatedItems.map((col, idx) => (
          <Link
            key={`${col.id}-${idx}`}
            href={`/catalog/${col.slug}`}
            className="flex items-center space-x-4 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase hover:text-hype transition-colors group whitespace-nowrap"
          >
            <span className="text-flash text-base sm:text-lg group-hover:rotate-45 transition-transform">
              ✦
            </span>
            <span className="group-hover:underline decoration-flash decoration-2 underline-offset-4">
              {col.name}
            </span>
            <span className="text-neutral-400 text-[11px] bg-white/10 px-1.5 py-0.5 rounded-sm">
              DROP #{idx % collectionList.length + 1}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
