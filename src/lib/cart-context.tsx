"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  variantId: string;
  productId: string;
  productSlug: string;
  name: string;
  fit: string;
  size: string;
  colorway: string;
  price: number; // in paise
  quantity: number;
  image: string;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  promoCode: string;
  discountPaise: number;
  promoError: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "streetwear_cart_v1";

// Sample promo codes for Indian 90s theme
const VALID_PROMOS: Record<string, { discountPercent: number; name: string }> = {
  DD10: { discountPercent: 10, name: "DD National 10% Off" },
  PCO50: { discountPercent: 50, name: "STD PCO 50% Off" },
  Y2K20: { discountPercent: 20, name: "Cybercafé 20% Off" },
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore storage errors
      }
    }
  }, [items, isHydrated]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.variantId === newItem.variantId);
      if (existing) {
        const newQty = Math.min(existing.quantity + newItem.quantity, newItem.maxStock);
        return prev.map((item) =>
          item.variantId === newItem.variantId ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const clamped = Math.min(quantity, item.maxStock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode("");
    setDiscountPercent(0);
    setPromoError(null);
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const match = VALID_PROMOS[clean];
    if (match) {
      setPromoCode(clean);
      setDiscountPercent(match.discountPercent);
      setPromoError(null);
      return true;
    } else {
      setPromoError("Invalid code. Try 'DD10', 'PCO50', or 'Y2K20'");
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setDiscountPercent(0);
    setPromoError(null);
  };

  const subtotalPaise = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountPaise = Math.round((subtotalPaise * discountPercent) / 100);
  // Free delivery over ₹1,999 (199900 paise), else ₹100 (10000 paise)
  const shippingPaise = subtotalPaise > 0 ? (subtotalPaise >= 199900 ? 0 : 10000) : 0;
  const totalPaise = Math.max(0, subtotalPaise - discountPaise + shippingPaise);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        promoCode,
        discountPaise,
        promoError,
        applyPromoCode,
        removePromoCode,
        subtotalPaise,
        shippingPaise,
        totalPaise,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
