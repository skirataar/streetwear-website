"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Menu, X, User } from "lucide-react";

export function Header() {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-hype border-b-2 border-ink">
      {/* Top Banner / Ticker — black bg */}
      <div className="bg-black text-white text-[11px] sm:text-xs font-mono font-bold tracking-wider py-1 px-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="uppercase">STD PCO // LIVE BROADCAST ARCHIVE</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>FREE SHIPPING OVER ₹1,999</span>
          <span>•</span>
          <span>100% HEAVYWEIGHT COTTON</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest bg-white/10 text-white px-1.5 py-0.5 rounded-sm border border-white/20">
          IND // 90S-00S
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-ink hover:text-ink/70 focus:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-ink text-white flex items-center justify-center font-display text-base tracking-tighter border border-ink group-hover:bg-white group-hover:text-ink transition-colors">
            THC
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl sm:text-3xl tracking-tight leading-none text-ink uppercase">
              THE HYPE // CO.
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-ink/60 font-bold leading-none uppercase">
              THE HYPE CO. STREETWEAR
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider uppercase text-ink" aria-label="Main navigation">
          <Link
            href="/catalog"
            className="hover:text-ink/70 hover:underline decoration-2 underline-offset-4 transition-colors"
          >
            All Products
          </Link>
          <Link
            href="/about"
            className="hover:text-ink/70 hover:underline decoration-2 underline-offset-4 transition-colors"
          >
            About Us
          </Link>
        </nav>

        {/* Action Buttons: Account & Cart */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/account/orders"
            className="p-1.5 sm:p-2 text-ink hover:text-ink/70 transition-colors rounded-sm hover:bg-ink/10"
            aria-label="Account and orders"
            title="My Orders"
          >
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 sm:gap-2 bg-ink text-white px-2 sm:px-3 py-1.5 rounded-none border-2 border-ink hover:bg-white hover:text-ink hover:border-ink transition-all font-mono text-xs font-bold active:translate-y-0.5"
            aria-label={`Open shopping cart with ${totalItemsCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">CART</span>
            <span className="bg-hype text-ink px-1.5 py-0.5 rounded-sm text-[11px] font-mono font-bold">
              {totalItemsCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-hype border-b-2 border-ink px-4 pt-2 pb-6 space-y-3 font-mono text-sm">
          <div className="text-[10px] text-ink/60 tracking-widest uppercase font-bold border-b border-ink/20 pb-1">
            NAVIGATION
          </div>
          <Link
            href="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-bold text-ink hover:underline"
          >
            ▶ ALL PRODUCTS
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-bold text-ink hover:underline"
          >
            ▶ ABOUT US
          </Link>
          <Link
            href="/account/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-bold text-ink/70 border-t border-ink/20 pt-2 hover:underline"
          >
            ▶ MY ACCOUNT / ORDERS
          </Link>
        </div>
      )}
    </header>
  );
}
