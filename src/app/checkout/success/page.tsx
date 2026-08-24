"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Printer, ArrowRight, ShieldCheck, PhoneCall } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || `ord_${Date.now()}`;
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 font-mono text-ink">
      {/* STD Booth Paper Receipt Box */}
      <div className="bg-paper border-std p-6 sm:p-10 space-y-6 shadow-xl relative bg-newsprint">
        {/* Receipt Header */}
        <div className="text-center border-b-2 border-dashed border-ink pb-6 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-signal text-paper rounded-full mb-1">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="text-xs font-bold uppercase text-signal tracking-widest">
            // TRANSMISSION SUCCESSFUL • PAYMENT CAPTURED
          </div>
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-ink">
            ORDER CONFIRMED
          </h1>
          <div className="text-xs font-bold text-ink/70 uppercase">
            POSTER CLUB STREETWEAR • STD / ISD RECEIPT
          </div>
        </div>

        {/* Transmission & Order Details */}
        <div className="grid grid-cols-2 gap-4 text-xs border-b-2 border-dashed border-ink pb-6">
          <div>
            <span className="text-ink/60 uppercase block text-[10px]">ORDER DOCKET NUMBER</span>
            <span className="font-bold text-sm text-ink">{orderId}</span>
          </div>
          <div className="text-right">
            <span className="text-ink/60 uppercase block text-[10px]">PAYMENT STATUS</span>
            <span className="font-bold text-sm text-crt bg-crt/20 px-2 py-0.5 border border-crt inline-block">
              PAID // RAZORPAY
            </span>
          </div>
          <div>
            <span className="text-ink/60 uppercase block text-[10px]">DISPATCH TIMELINE</span>
            <span className="font-bold text-xs text-ink">24-48 HOURS (EXPRESS)</span>
          </div>
          <div className="text-right">
            <span className="text-ink/60 uppercase block text-[10px]">TIMESTAMP</span>
            <span className="font-bold text-xs text-ink">{currentDate || "LIVE"}</span>
          </div>
        </div>

        {/* Liner Note Message */}
        <div className="bg-paper border-2 border-ink p-4 space-y-2 text-xs">
          <div className="font-bold uppercase text-signal flex items-center gap-1.5">
            <span>● DISPATCH INSTRUCTIONS</span>
          </div>
          <p className="font-body text-ink/80 text-xs leading-relaxed">
            Your streetwear batch is currently being inspected and boxed with custom archival sticker packs and cassette liner notes. We have sent the tracking link via SMS & Email.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-dashed border-ink">
          <button
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-paper text-ink border-2 border-ink py-3 px-4 text-xs font-bold uppercase hover:bg-static/20 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT RECEIPT</span>
          </button>

          <Link
            href="/catalog"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-signal text-paper border-2 border-ink py-3 px-4 text-xs font-bold uppercase hover:bg-signal/90 transition-colors shadow-sm"
          >
            <span>BACK TO ARCHIVE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="pt-2 text-center text-[10px] text-ink/60 font-bold uppercase">
          THANK YOU FOR PRESERVING INDIAN POP CULTURE • PAL-B COMPLIANT
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono">LOADING TRANSMISSION...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
