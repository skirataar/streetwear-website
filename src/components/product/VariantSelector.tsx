"use client";

import React, { useState } from "react";
import { ProductData, ProductVariantData } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { formatPaise } from "@/lib/currency";
import { ShoppingBag, Check, Info } from "lucide-react";

interface VariantSelectorProps {
  product: ProductData;
}

export function VariantSelector({ product }: VariantSelectorProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants.find((v) => v.stock > 0)?.size || "M"
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const activeVariant =
    product.variants.find((v) => v.size === selectedSize) || product.variants[0];
  const isOutOfStock = !activeVariant || activeVariant.stock <= 0;
  const currentPrice = activeVariant?.priceOverride ?? product.basePrice;

  const handleAddToCart = () => {
    if (isOutOfStock || !activeVariant) return;

    addItem({
      variantId: activeVariant.id,
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      fit: product.fit,
      size: activeVariant.size,
      colorway: activeVariant.colorway,
      price: currentPrice,
      quantity,
      image: product.images[0]?.staticUrl || "",
      maxStock: activeVariant.stock,
    });

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Price Display */}
      <div className="border-b-2 border-ink pb-4">
        <div className="text-xs text-ink/60 font-bold uppercase tracking-wider mb-1">
          MRP (INCL. OF ALL TAXES)
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-bold font-mono text-ink tracking-tight">
            {formatPaise(currentPrice)}
          </span>
          {product.originalPrice && product.originalPrice > currentPrice && (
            <span className="text-xl sm:text-2xl font-bold font-mono text-ink/40 line-through">
              {formatPaise(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Size Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold uppercase">
          <span className="text-ink">SELECT SIZE:</span>
          <button
            type="button"
            onClick={() => setShowSizeGuide(!showSizeGuide)}
            className="text-flash hover:underline inline-flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            {showSizeGuide ? "HIDE SIZE CHART" : "SIZE GUIDE (INCHES)"}
          </button>
        </div>

        {/* Size Buttons Matrix */}
        <div className="grid grid-cols-5 gap-2">
          {product.variants.map((v) => {
            const outOfStock = v.stock <= 0;
            const isSelected = selectedSize === v.size;

            return (
              <button
                key={v.id}
                type="button"
                disabled={outOfStock}
                onClick={() => {
                  setSelectedSize(v.size);
                  setQuantity(1);
                }}
                className={`py-3 px-2 text-center font-mono font-bold text-sm border-2 transition-all relative ${
                  outOfStock
                    ? "bg-ink/10 border-ink/20 text-ink/30 cursor-not-allowed line-through"
                    : isSelected
                    ? "bg-ink text-white border-ink shadow-md"
                    : "bg-white text-ink border-ink hover:bg-hype/20"
                }`}
              >
                {v.size}
                {v.stock > 0 && v.stock <= 5 && (
                  <span className="absolute -top-2 -right-1 bg-flash text-white text-[8px] px-1 py-0.5 rounded-sm font-bold border border-ink">
                    {v.stock}L
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Stock status indicator */}
        <div className="text-xs font-bold pt-1">
          {isOutOfStock ? (
            <span className="text-flash uppercase">● SOLD OUT IN THIS SIZE</span>
          ) : activeVariant.stock <= 5 ? (
            <span className="text-flash uppercase animate-pulse">
              ● HURRY: ONLY {activeVariant.stock} UNITS LEFT IN BATCH
            </span>
          ) : (
            <span className="text-flash uppercase font-bold">● IN STOCK // READY TO DISPATCH</span>
          )}
        </div>
      </div>

      {/* Size Guide Table (collapsible) */}
      {showSizeGuide && (
        <div className="bg-white border-2 border-ink p-4 text-xs font-mono space-y-2">
          <div className="font-bold text-ink uppercase border-b border-ink/20 pb-1">
            {product.fit} FIT MEASUREMENT CHART (INCHES)
          </div>
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-ink text-white text-[10px]">
                <th className="p-1">SIZE</th>
                <th className="p-1">CHEST</th>
                <th className="p-1">LENGTH</th>
                <th className="p-1">SHOULDER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 text-[11px]">
              <tr><td className="p-1 font-bold">S</td><td>42&quot;</td><td>28&quot;</td><td>20&quot;</td></tr>
              <tr><td className="p-1 font-bold">M</td><td>44&quot;</td><td>29&quot;</td><td>21&quot;</td></tr>
              <tr><td className="p-1 font-bold">L</td><td>46&quot;</td><td>30&quot;</td><td>22&quot;</td></tr>
              <tr><td className="p-1 font-bold">XL</td><td>48&quot;</td><td>31&quot;</td><td>23&quot;</td></tr>
              <tr><td className="p-1 font-bold">XXL</td><td>50&quot;</td><td>32&quot;</td><td>24&quot;</td></tr>
            </tbody>
          </table>
          <p className="text-[10px] text-ink/50 italic">
            *Oversized fit is cut 2 inches wider than standard Indian streetwear specs. Order your regular size for intended drape.
          </p>
        </div>
      )}

      {/* Quantity Picker & Add to Cart Button */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center border-2 border-ink bg-white">
            <button
              type="button"
              disabled={quantity <= 1 || isOutOfStock}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-3 text-sm font-bold hover:bg-ink/5 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-4 py-3 text-sm font-bold text-center min-w-[40px]">
              {quantity}
            </span>
            <button
              type="button"
              disabled={isOutOfStock || quantity >= (activeVariant?.stock || 1)}
              onClick={() =>
                setQuantity(Math.min(activeVariant?.stock || 1, quantity + 1))
              }
              className="px-3 py-3 text-sm font-bold hover:bg-ink/5 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart — flash is the ONE CTA color per brief */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 font-mono font-bold text-sm sm:text-base uppercase border-2 border-ink transition-all ${
              isOutOfStock
                ? "bg-ink/10 text-ink/30 border-ink/20 cursor-not-allowed"
                : addedAnimation
                ? "bg-hype text-ink"
                : "bg-flash hover:bg-flash/90 text-white border-std-hover shadow-md active:translate-y-0.5"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-5 h-5" />
                <span>ADDED TO TAPE DECK</span>
              </>
            ) : isOutOfStock ? (
              <span>OUT OF STOCK</span>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>ADD TO CART • {formatPaise(currentPrice * quantity)}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Streetwear Garment Specs */}
      <div className="bg-white border-2 border-ink p-4 space-y-3 text-xs">
        <div className="font-bold text-ink uppercase tracking-wider border-b border-ink/20 pb-1">
          // ARCHIVE GARMENT SPECIFICATIONS
        </div>
        <ul className="space-y-1.5 text-ink/70 text-[11px]">
          <li>• <strong>FABRIC:</strong> 240 GSM 100% Combed Compact Cotton</li>
          <li>• <strong>PRINT:</strong> High-Density Plastisol &amp; Vintage Screenprint</li>
          <li>• <strong>WASH:</strong> Pre-shrunk silicone &amp; enzyme bio-washed</li>
          <li>• <strong>ORIGIN:</strong> Knitted, dyed, and crafted in Tirupur, India</li>
        </ul>
      </div>
    </div>
  );
}
