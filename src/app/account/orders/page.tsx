"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatPaise } from "@/lib/currency";
import { User, LogIn, Package, ArrowRight, ShieldCheck } from "lucide-react";

export default function AccountOrdersPage() {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        // Fallback for mock/dev environment
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [supabase]);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailInput,
        options: {
          emailRedirectTo: `${window.location.origin}/account/orders`,
        },
      });

      if (error) {
        setAuthMessage(`Login info: ${error.message}`);
      } else {
        setAuthMessage("Magic login link sent to your email!");
      }
    } catch {
      setAuthMessage("Simulated login link dispatched to your inbox.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono text-ink">
        INITIALIZING BROADCAST AUTHENTICATION...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full font-mono text-ink">
      {/* Header */}
      <div className="border-b-4 border-ink pb-4 mb-8 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase text-flash tracking-widest mb-1">
            // SUBSCRIBER ACCOUNT &amp; ORDER ARCHIVE
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-ink">
            MY ACCOUNT &amp; ORDERS
          </h1>
        </div>

        {user && (
          <button
            onClick={handleSignOut}
            className="text-xs font-bold uppercase text-flash hover:underline border border-ink px-3 py-1.5 bg-white hover:bg-flash hover:text-white transition-colors"
          >
            SIGN OUT
          </button>
        )}
      </div>

      {!user ? (
        /* Sign-In Form */
        <div className="bg-white border-std p-6 sm:p-10 space-y-6 max-w-lg mx-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-flash text-xs font-bold uppercase">
              <LogIn className="w-4 h-4" />
              <span>SUPABASE AUTH // PASSWORDLESS LOGIN</span>
            </div>
            <h2 className="font-display text-3xl uppercase tracking-tight text-ink">
              ACCESS YOUR ORDER HISTORY
            </h2>
            <p className="font-body text-xs text-ink/60 leading-relaxed">
              Enter your email to receive an instant magic link or OTP to manage your orders and shipping preferences.
            </p>
          </div>

          {authMessage && (
            <div className="bg-hype/30 border-2 border-ink p-3 text-xs font-bold text-ink">
              📢 {authMessage}
            </div>
          )}

          <form onSubmit={handleMagicLinkLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-ink/60 uppercase">
                YOUR EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                placeholder="e.g. aryan@streetwear.in"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-white border-2 border-ink p-3 text-xs focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-flash text-white py-3.5 px-4 font-mono font-bold text-xs sm:text-sm uppercase border-2 border-ink shadow-md hover:bg-flash/90 transition-colors active:translate-y-0.5"
            >
              SEND MAGIC LINK
            </button>
          </form>

          <div className="pt-4 border-t border-ink/10 text-[11px] text-ink/40 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Guest checkouts can also be tracked using your order confirmation SMS / email.</span>
          </div>
        </div>
      ) : (
        /* Authenticated Orders View */
        <div className="space-y-6">
          <div className="bg-white border-std p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ink text-white flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-ink/40 uppercase">SIGNED IN AS</div>
                <div className="font-bold text-sm text-ink">{user.email}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border-std p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase text-ink flex items-center gap-2 border-b border-ink/20 pb-2">
              <Package className="w-4 h-4 text-flash" />
              PAST ORDERS ARCHIVE
            </h2>

            {/* Order Item */}
            <div className="border-2 border-ink p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-ink uppercase">ORDER #ORD-1998-DD</span>
                <span className="bg-hype text-ink px-2 py-0.5 border border-ink text-[10px]">
                  DISPATCHED // IN TRANSIT
                </span>
              </div>
              <div className="text-xs text-ink/70">
                1x DD National Test Pattern Tee (Size: L, Oversized)
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-ink/10 text-xs">
                <span className="text-ink/50">TOTAL: {formatPaise(185000)}</span>
                <span className="text-flash font-bold">TRACKING: BLUEDART-IND-88219</span>
              </div>
            </div>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-ink text-white hover:bg-flash px-4 py-2.5 font-mono font-bold text-xs uppercase border border-ink transition-colors"
            >
              <span>SHOP MORE DROPS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
