"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useCart } from "@/lib/cart-context";
import { formatPaise } from "@/lib/currency";
import { ShieldCheck, ArrowLeft, Lock, ArrowRight } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Indian states list for shipping form
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi NCR",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotalPaise,
    shippingPaise,
    discountPaise,
    totalPaise,
    promoCode,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Delhi NCR",
    pincode: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !isLoading) {
      // Let user fill or navigate back
    }
  }, [items, isLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName || !formData.email || !formData.phone || !formData.addressLine1 || !formData.pincode) {
      setErrorMessage("Please complete all required shipping fields.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add an item from the catalogue.");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Attempt WooCommerce Checkout Redirect for WooCommerce Payment Gateways
      try {
        const wooRes = await fetch("/api/woocommerce/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((it) => ({
              variantId: it.variantId,
              productId: it.productId,
              productSlug: it.productSlug,
              quantity: it.quantity,
              price: it.price,
            })),
            customer: {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              addressLine1: formData.addressLine1,
              addressLine2: formData.addressLine2,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
            },
          }),
        });

        const wooData = await wooRes.json();
        if (wooRes.ok && wooData.checkoutUrl) {
          clearCart();
          window.location.href = wooData.checkoutUrl;
          return;
        }
      } catch {
        // Fallback to Razorpay direct server modal
      }

      // Step 2: Fallback Order Creation
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((it) => ({
            variantId: it.variantId,
            productId: it.productId,
            productSlug: it.productSlug,
            quantity: it.quantity,
            price: it.price,
          })),
          email: formData.email,
          phone: formData.phone,
          shippingAddress: {
            fullName: formData.fullName,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          promoCode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.orderId) {
        throw new Error(data.error || "Failed to initialize payment order.");
      }

      // Step 2: Initialize Razorpay Hosted Checkout Modal
      const options = {
        key: data.keyId || "rzp_test_placeholder",
        amount: data.amount,
        currency: "INR",
        name: "THE HYPE CO. STREETWEAR",
        description: `Order #${data.orderId} • Pan-India Dispatch`,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200",
        order_id: data.razorpayOrderId.startsWith("rzp_") ? data.razorpayOrderId : undefined,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#F0175C", // flash color
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || data.razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || "mock_signature",
                localOrderId: data.orderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              clearCart();
              router.push(`/checkout/success?orderId=${data.orderId}`);
            } else {
              setErrorMessage(verifyData.error || "Payment verification issue");
              setIsLoading(false);
            }
          } catch (err: any) {
            setErrorMessage("Error verifying payment");
            setIsLoading(false);
          }
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp: any) {
          setErrorMessage(resp.error.description || "Payment attempt failed");
          setIsLoading(false);
        });
        rzp.open();
      } else {
        // Fallback for test / simulation mode
        setTimeout(async () => {
          await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: data.razorpayOrderId,
              razorpay_payment_id: `pay_test_${Date.now()}`,
              razorpay_signature: "mock_test_signature",
              localOrderId: data.orderId,
            }),
          });
          clearCart();
          router.push(`/checkout/success?orderId=${data.orderId}`);
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  if (items.length === 0 && !isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center font-mono space-y-4">
        <h2 className="font-display text-3xl uppercase text-ink">YOUR CART IS EMPTY</h2>
        <p className="text-xs text-ink/60 font-body">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-flash text-white px-6 py-3 font-mono font-bold text-xs uppercase border-2 border-ink"
        >
          <span>VIEW CATALOGUE</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayScriptLoaded(true)}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full font-mono text-ink">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-4 border-ink pb-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase text-flash tracking-widest mb-1">
              // EXPRESS CHECKOUT • GUEST &amp; AUTH
            </div>
            <h1 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-ink">
              SHIPPING &amp; PAYMENT
            </h1>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase text-ink hover:text-flash transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>EDIT CART</span>
          </Link>
        </div>

        {errorMessage && (
          <div className="bg-flash text-white p-3 text-xs font-bold border-2 border-ink mb-6">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Minimal Single-Column Checkout Form */}
        <form onSubmit={handleCheckoutSubmit} className="space-y-8">
          {/* 1. Contact Info */}
          <div className="bg-white border-std p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/20 pb-2">
              <h2 className="text-sm font-bold uppercase text-ink flex items-center gap-2">
                <span className="w-5 h-5 bg-ink text-white flex items-center justify-center text-xs">
                  1
                </span>
                CONTACT DETAILS
              </h2>
              <span className="text-[11px] text-ink/40">GUEST CHECKOUT SUPPORTED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-ink/60 uppercase">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-white border border-ink p-2 text-xs uppercase focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-ink/60 uppercase">
                  WHATSAPP / PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white border border-ink p-2 text-xs uppercase focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[10px] font-bold text-ink/60 uppercase">
                  EMAIL ADDRESS (FOR ORDER RECEIPT) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. aryan@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-ink p-2 text-xs focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 2. Indian Shipping Address */}
          <div className="bg-white border-std p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/20 pb-2">
              <h2 className="text-sm font-bold uppercase text-ink flex items-center gap-2">
                <span className="w-5 h-5 bg-ink text-white flex items-center justify-center text-xs">
                  2
                </span>
                DELIVERY ADDRESS (PAN-INDIA)
              </h2>
              <span className="text-[11px] text-flash font-bold">EXPRESS COURIER</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[10px] font-bold text-ink/60 uppercase">
                  HOUSE / FLAT / STREET ADDRESS *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  placeholder="e.g. Flat 402, Shanti Niketan Apts, MG Road"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className="w-full bg-white border border-ink p-2 text-xs uppercase focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[10px] font-bold text-ink/60 uppercase">
                  LANDMARK / AREA (OPTIONAL)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  placeholder="e.g. Near STD Booth / Metro Pillar 140"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full bg-white border border-ink p-2 text-xs uppercase focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-ink/60 uppercase">
                  CITY *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Mumbai / Delhi / Bengaluru"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-white border border-ink p-2 text-xs uppercase focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-ink/60 uppercase">
                  STATE *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-white border border-ink p-2 text-xs uppercase focus:outline-hidden"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-ink/60 uppercase">
                  PINCODE (6-DIGIT) *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="e.g. 110001"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full bg-white border border-ink p-2 text-xs focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 3. Order Summary & Razorpay Trigger */}
          <div className="bg-white border-std p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/20 pb-2">
              <h2 className="text-sm font-bold uppercase text-ink flex items-center gap-2">
                <span className="w-5 h-5 bg-ink text-white flex items-center justify-center text-xs">
                  3
                </span>
                PAYMENT SUMMARY
              </h2>
              <span className="text-[11px] text-ink/40">{items.length} ITEMS</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink/60">ITEMS SUBTOTAL</span>
                <span className="font-bold">{formatPaise(subtotalPaise)}</span>
              </div>

              {discountPaise > 0 && (
                <div className="flex justify-between text-flash font-bold">
                  <span>PROMO DISCOUNT ({promoCode})</span>
                  <span>-{formatPaise(discountPaise)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-ink/60">SHIPPING</span>
                <span className="font-bold">
                  {shippingPaise === 0 ? "FREE" : formatPaise(shippingPaise)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold border-t-2 border-ink pt-3 text-ink">
                <span>TOTAL AMOUNT TO PAY</span>
                <span className="text-flash">{formatPaise(totalPaise)}</span>
              </div>
            </div>

            {/* Pay with Razorpay CTA — only flash button on page */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-flash hover:bg-flash/90 text-white py-4 px-6 font-mono font-bold text-sm sm:text-base uppercase border-2 border-ink shadow-lg transition-all active:translate-y-0.5 disabled:opacity-50"
            >
              {isLoading ? (
                <span>INITIALIZING SECURE RAZORPAY GATEWAY...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>PAY {formatPaise(totalPaise)} VIA RAZORPAY</span>
                </>
              )}
            </button>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-[10px] text-ink/40 text-center">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                PCI-DSS Encrypted (Hosted Razorpay Modal)
              </span>
              <span>•</span>
              <span>UPI / GPay / PhonePe / Cards / Netbanking</span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
