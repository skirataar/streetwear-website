"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Menu, X, Radio, User, Sparkles } from "lucide-react";

export function Header() {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-paper border-b-2 border-ink">
      {/* Top Banner / Ticker */}
      <div className="bg-signal text-paper text-[11px] sm:text-xs font-mono font-bold tracking-wider py-1 px-4 flex items-center justify-between border-b border-ink">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-paper animate-pulse" />
          <span className="uppercase">STD PCO // LIVE BROADCAST ARCHIVE</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>FREE SHIPPING OVER ₹1,999</span>
          <span>•</span>
          <span>100% HEAVYWEIGHT COTTON</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest bg-ink text-paper px-1.5 py-0.5 rounded-xs">
          IND // 90S-00S
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-ink hover:text-signal focus:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-ink text-paper flex items-center justify-center font-display text-lg tracking-tighter border border-ink group-hover:bg-signal transition-colors">
            DD
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl sm:text-3xl tracking-tight leading-none text-ink uppercase">
              POSTER // CLUB
            </span>
            <span className="font-mono text-[9px] tracking-widest text-crt font-bold leading-none uppercase">
              BHARAT STREETWEAR '98
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold tracking-wider uppercase text-ink">
          <Link
            href="/catalog"
            className="hover:text-signal hover:underline decoration-2 underline-offset-4 transition-colors"
          >
            All Drops
          </Link>
          <Link
            href="/catalog/dd-national"
            className="hover:text-signal hover:underline decoration-2 underline-offset-4 transition-colors"
          >
            DD National
          </Link>
          <Link
            href="/catalog/std-isd-pco"
            className="hover:text-signal hover:underline decoration-2 underline-offset-4 transition-colors"
          >
            STD PCO
          </Link>
          <Link
            href="/catalog/y2k-cybercafe"
            className="hover:text-signal hover:underline decoration-2 underline-offset-4 transition-colors"
          >
            Cybercafé
          </Link>
          <Link
            href="/catalog/sharjah-cricket"
            className="hover:text-signal hover:underline decoration-2 underline-offset-4 transition-colors"
          >
            Sharjah '98
          </Link>
        </nav>

        {/* Action Buttons: Account & Cart */}
        <div className="flex items-center gap-3">
          <Link
            href="/account/orders"
            className="p-2 text-ink hover:text-signal transition-colors rounded-sm hover:bg-static/20"
            aria-label="Account and orders"
            title="My Orders"
          >
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-ink text-paper px-3 py-1.5 rounded-none border-2 border-ink hover:bg-signal hover:text-paper transition-all font-mono text-xs font-bold active:translate-y-0.5"
            aria-label={`Open shopping cart with ${totalItemsCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">CART</span>
            <span className="bg-paper text-ink px-1.5 py-0.2 rounded-xs text-[11px] font-mono font-bold">
              {totalItemsCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-paper border-b-2 border-ink px-4 pt-2 pb-6 space-y-3 font-mono text-sm">
          <div className="text-[10px] text-crt tracking-widest uppercase font-bold border-b border-static pb-1">
            SELECT ERA / DROP
          </div>
          <Link
            href="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-bold hover:text-signal"
          >
            ▶ ALL DROPS (FULL CATALOGUE)
          </Link>
          <Link
            href="/catalog/dd-national"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-bold hover:text-signal"
          >
            ▶ DD NATIONAL // TEST CARD
          </Link>
          <Link
            href="/catalog/std-isd-pco"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-bold hover:text-signal"
          >
            ▶ STD // ISD // PCO BOOTHS
          </Link>
          <Link
            href="/catalog/y2k-cybercafe"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-bold hover:text-signal"
          >
            ▶ Y2K CYBERCAFÉ 56KBPS
          </Link>
          <Link
            href="/catalog/sharjah-cricket"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-bold hover:text-signal"
          >
            ▶ SHARJAH '98 DESERT STORM
          </Link>
          <Link
            href="/account/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-bold text-crt border-t border-static pt-2"
          >
            ▶ MY ACCOUNT / ORDERS
          </Link>
        </div>
      )}
    </header>
  );
}
