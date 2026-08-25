"use client";

import React, { useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { CartView } from "./CartView";
import { X, ShoppingBag } from "lucide-react";

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, totalItemsCount } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping cart">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l-4 border-ink shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-white border-b-2 border-ink flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-flash" />
              <h2 className="font-display text-2xl uppercase tracking-tight text-ink">
                YOUR CASSETTE DECK ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-ink hover:text-flash border border-ink hover:border-flash transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 flex-1">
            <CartView onClose={() => setIsCartOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}
