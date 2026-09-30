"use client";

import React from "react";
import Link from "next/link";
import { CartView } from "@/components/cart/CartView";
import { ArrowLeft } from "lucide-react";

export default function CartPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-4 border-ink pb-4 mb-6">
        <div>
          <div className="text-xs font-mono font-bold uppercase text-ink tracking-widest mb-1">
            // CASSETTE DECK
          </div>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-ink">
            SHOPPING CART
          </h1>
        </div>

        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-mono font-bold uppercase text-ink hover:underline transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>CONTINUE BROWSING</span>
        </Link>
      </div>

      {/* Cart Container Card — white interior for readability */}
      <div className="bg-white border-std p-6 sm:p-8">
        <CartView isPage={true} />
      </div>
    </div>
  );
}
