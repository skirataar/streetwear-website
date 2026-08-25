"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPaise } from "@/lib/currency";
import { Trash2, ArrowRight, Tag, ShieldCheck, ShoppingBag } from "lucide-react";

interface CartViewProps {
  onClose?: () => void;
  isPage?: boolean;
}

export function CartView({ onClose, isPage = false }: CartViewProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotalPaise,
    shippingPaise,
    discountPaise,
    totalPaise,
    promoCode,
    applyPromoCode,
    removePromoCode,
    promoError,
  } = useCart();

  const [inputCode, setInputCode] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    applyPromoCode(inputCode);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center font-mono space-y-4">
        <div className="w-16 h-16 rounded-full bg-ink/10 border-2 border-ink flex items-center justify-center text-ink/40">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="font-display text-2xl uppercase tracking-tight text-ink">
          YOUR CART IS EMPTY
        </h3>
        <p className="text-xs text-ink/60 max-w-xs font-body">
          No drops loaded in the cassette deck yet. Check out the latest DD National and Cybercafé collections.
        </p>
        <Link
          href="/catalog"
          onClick={onClose}
          className="inline-flex items-center gap-2 bg-flash text-white px-6 py-2.5 font-mono font-bold text-xs uppercase border-2 border-ink hover:bg-flash/90 transition-colors shadow-sm"
        >
          <span>EXPLORE CATALOGUE</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Free shipping threshold = ₹1,999 (199900 paise)
  const remainingForFreeShipping = Math.max(0, 199900 - subtotalPaise);
  const freeShippingProgress = Math.min(100, Math.round((subtotalPaise / 199900) * 100));

  return (
    <div className="flex flex-col font-mono text-ink">
      {/* Free Shipping Progress Bar */}
      <div className="bg-hype/30 border-2 border-ink p-3 mb-4 text-xs">
        <div className="flex justify-between font-bold text-[11px] uppercase mb-1">
          <span>
            {remainingForFreeShipping === 0
              ? "🎉 QUALIFIED FOR FREE EXPRESS SHIPPING!"
              : `ADD ${formatPaise(remainingForFreeShipping)} MORE FOR FREE SHIPPING`}
          </span>
          <span>{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-ink/10 border border-ink h-2.5 overflow-hidden">
          <div
            className="bg-hype h-full transition-all duration-300"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Cart Items List */}
      <div className="divide-y-2 divide-ink/10 space-y-4 pb-4">
        {items.map((item) => (
          <div key={item.variantId} className="pt-4 first:pt-0 flex gap-3 sm:gap-4">
            {/* Thumbnail */}
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 border-2 border-ink overflow-hidden shrink-0 bg-ink/5">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-display text-base sm:text-lg uppercase leading-tight tracking-tight text-ink">
                    <Link
                      href={`/product/${item.productSlug}`}
                      onClick={onClose}
                      className="hover:text-flash transition-colors"
                    >
                      {item.name}
                    </Link>
                  </h4>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-ink/40 hover:text-flash p-1"
                    aria-label={`Remove ${item.name} size ${item.size} from cart`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-ink/60 font-bold uppercase mt-1">
                  <span className="bg-ink/10 px-1.5 py-0.5 border border-ink/30">
                    SIZE: {item.size}
                  </span>
                  <span className="bg-ink/10 px-1.5 py-0.5 border border-ink/30">
                    {item.fit}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Price */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center border border-ink bg-white">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="px-2 py-0.5 text-xs font-bold hover:bg-ink/5"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="px-2 py-0.5 text-xs font-bold hover:bg-ink/5 disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="font-mono text-sm font-bold">
                  {formatPaise(item.price * item.quantity)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code Form */}
      <div className="border-t-2 border-ink pt-4 mt-2">
        {promoCode ? (
          <div className="flex items-center justify-between bg-hype/30 border border-ink p-2 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-ink">
              <Tag className="w-3.5 h-3.5 text-flash" />
              <span>CODE {promoCode} APPLIED</span>
            </div>
            <button
              onClick={removePromoCode}
              className="text-flash hover:underline text-[11px] uppercase"
            >
              REMOVE
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <input
              type="text"
              placeholder="PROMO CODE (e.g. DD10, PCO50)"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 bg-white border border-ink px-3 py-1.5 text-xs font-mono uppercase focus:outline-hidden"
            />
            <button
              type="submit"
              className="bg-ink text-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-flash transition-colors border border-ink"
            >
              APPLY
            </button>
          </form>
        )}
        {promoError && (
          <div className="text-flash text-[11px] mt-1 font-bold">{promoError}</div>
        )}
      </div>

      {/* Summary Calculations */}
      <div className="border-t-2 border-ink pt-4 mt-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-ink/60">SUBTOTAL</span>
          <span className="font-bold">{formatPaise(subtotalPaise)}</span>
        </div>

        {discountPaise > 0 && (
          <div className="flex justify-between text-flash font-bold">
            <span>PROMO DISCOUNT</span>
            <span>-{formatPaise(discountPaise)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-ink/60">SHIPPING (PAN-INDIA)</span>
          <span className="font-bold">
            {shippingPaise === 0 ? "FREE" : formatPaise(shippingPaise)}
          </span>
        </div>

        <div className="flex justify-between text-base font-bold border-t border-ink pt-2 text-ink">
          <span>TOTAL ESTIMATE</span>
          <span className="text-flash">{formatPaise(totalPaise)}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <div className="pt-6 space-y-2">
        <Link
          href="/checkout"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 bg-flash hover:bg-flash/90 text-white py-3.5 px-4 font-mono font-bold text-sm uppercase border-2 border-ink shadow-md transition-all active:translate-y-0.5 text-center"
        >
          <span>PROCEED TO CHECKOUT</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-ink/50 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-ink/50 shrink-0" />
          <span>RAZORPAY HOSTED ENCRYPTED PAYMENT (UPI / CARDS / NETBANKING)</span>
        </div>
      </div>
    </div>
  );
}
