"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CollectionData } from "@/lib/mock-data";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface FilterBarProps {
  collections: CollectionData[];
  totalResults: number;
}

export function FilterBar({ collections, totalResults }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFit = searchParams.get("fit") || "all";
  const currentSize = searchParams.get("size") || "all";
  const currentEra = searchParams.get("era") || "all";
  const currentSort = searchParams.get("sort") || "latest";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = currentFit !== "all" || currentSize !== "all" || currentEra !== "all";

  return (
    <div className="w-full bg-paper border-std p-4 mb-8 space-y-4 font-mono">
      {/* Top Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-static pb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
          <SlidersHorizontal className="w-4 h-4 text-signal" />
          <span>FILTER ARCHIVE MATRIX</span>
          <span className="bg-ink text-paper px-2 py-0.5 text-[10px] rounded-xs font-bold">
            {totalResults} {totalResults === 1 ? "PIECE" : "PIECES"}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-[11px] text-signal font-bold uppercase hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            RESET FILTERS
          </button>
        )}
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Fit Filter */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-ink/70 uppercase tracking-wider">
            FIT SILHOUETTE
          </label>
          <div className="grid grid-cols-3 gap-1">
            {["all", "oversized", "regular"].map((fit) => (
              <button
                key={fit}
                onClick={() => updateParam("fit", fit)}
                className={`py-1.5 px-2 text-center text-[11px] font-bold uppercase border border-ink transition-all ${
                  currentFit === fit
                    ? "bg-ink text-paper"
                    : "bg-paper text-ink hover:bg-static/20"
                }`}
              >
                {fit}
              </button>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-ink/70 uppercase tracking-wider">
            SIZE (IN STOCK)
          </label>
          <div className="flex flex-wrap gap-1">
            {["all", "S", "M", "L", "XL", "XXL"].map((sz) => (
              <button
                key={sz}
                onClick={() => updateParam("size", sz === "all" ? "all" : sz)}
                className={`w-9 py-1.5 text-center text-[11px] font-bold uppercase border border-ink transition-all ${
                  currentSize.toUpperCase() === sz.toUpperCase()
                    ? "bg-signal text-paper"
                    : "bg-paper text-ink hover:bg-static/20"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Era / Collection Filter */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-ink/70 uppercase tracking-wider">
            ERA / BROADCAST DROP
          </label>
          <select
            value={currentEra}
            onChange={(e) => updateParam("era", e.target.value)}
            className="w-full bg-paper border border-ink py-1.5 px-2 text-xs font-bold text-ink rounded-none focus:ring-0 focus:outline-hidden"
          >
            <option value="all">ALL ERAS // COMPLETE ARCHIVE</option>
            {collections.map((col) => (
              <option key={col.id} value={col.slug}>
                {col.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-ink/70 uppercase tracking-wider">
            PRICE / SORT
          </label>
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="w-full bg-paper border border-ink py-1.5 px-2 text-xs font-bold text-ink rounded-none focus:ring-0 focus:outline-hidden"
          >
            <option value="latest">LATEST DROPS</option>
            <option value="price-asc">PRICE: LOW TO HIGH</option>
            <option value="price-desc">PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>
    </div>
  );
}
