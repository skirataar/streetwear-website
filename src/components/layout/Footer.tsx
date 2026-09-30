import React from "react";
import Link from "next/link";
import { Disc, PhoneCall, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-[#EBE6DF] border-t-4 border-flash pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-[#EBE6DF]/20 text-xs font-mono">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-flash shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#EBE6DF] block uppercase">PAN-INDIA SHIPPING</span>
              <span className="text-[#EBE6DF]/80">Free dispatch over ₹1,999. Express 3-5 day delivery.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Disc className="w-5 h-5 text-flash shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#EBE6DF] block uppercase">240+ GSM HEAVYWEIGHT</span>
              <span className="text-[#EBE6DF]/80">100% combed cotton, bio-washed, pre-shrunk boxy fits.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-flash shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#EBE6DF] block uppercase">RAZORPAY SECURED</span>
              <span className="text-[#EBE6DF]/80">UPI (GPay/PhonePe), Credit/Debit Cards, Netbanking.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-flash shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#EBE6DF] block uppercase">7-DAY SIZE EXCHANGE</span>
              <span className="text-[#EBE6DF]/80">Hassle-free reverse pickups for size adjustments.</span>
            </div>
          </div>
        </div>

        {/* Cassette J-Card Liner / Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10">
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl uppercase tracking-tight text-[#EBE6DF]">
                THE HYPE // CO.
              </span>
              <span className="bg-flash text-ink text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm">
                EST. 1998
              </span>
            </div>
            <p className="text-xs font-body text-[#EBE6DF]/80 leading-relaxed max-w-md">
              An archive of Indian street memories — from the hypnotic Doordarshan test signal tone to the yellow-black STD booth coin drops and Sharjah desert storm centuries. Manufactured in Tirupur with heavyweight Indian cotton.
            </p>
            <div className="font-mono text-[9px] sm:text-[11px] tracking-tight sm:tracking-normal text-[#EBE6DF]/80 space-y-1">
              <div>// CASSETTE SIDE A: DD NATIONAL • SHAKTIMAAN • CRICKET</div>
              <div>// CASSETTE SIDE B: CYBERCAFÉ 56KBPS • STD PCO • WINAMP</div>
            </div>
          </div>

          {/* Era Navigation */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <h4 className="text-sm font-bold text-[#EBE6DF] uppercase tracking-wider border-b border-[#EBE6DF]/20 pb-1">
              ARCHIVE DROPS
            </h4>
            <ul className="space-y-2 text-[#EBE6DF]/80">
              <li>
                <Link href="/catalog/dd-national" className="hover:text-flash transition-colors">
                  ▶ DD National Spectrum
                </Link>
              </li>
              <li>
                <Link href="/catalog/std-isd-pco" className="hover:text-flash transition-colors">
                  ▶ STD PCO 1-Rupee Booth
                </Link>
              </li>
              <li>
                <Link href="/catalog/y2k-cybercafe" className="hover:text-flash transition-colors">
                  ▶ Y2K Cybercafé Dial-Up
                </Link>
              </li>
              <li>
                <Link href="/catalog/sharjah-cricket" className="hover:text-flash transition-colors">
                  ▶ Sharjah &#39;98 Desert Storm
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-flash transition-colors">
                  ▶ View All Tees
                </Link>
              </li>
            </ul>
          </div>

          {/* STD Booth Dial Codes & Contact */}
          <div className="md:col-span-4 space-y-3 font-mono text-xs">
            <h4 className="text-sm font-bold text-[#EBE6DF]/80 uppercase tracking-wider border-b border-[#EBE6DF]/20 pb-1 flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5" />
              STD DIAL CODES &amp; SUPPORT
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#EBE6DF]/80">
              <div>DELHI: 011</div>
              <div>MUMBAI: 022</div>
              <div>BANGALORE: 080</div>
              <div>KOLKATA: 033</div>
              <div>CHENNAI: 044</div>
              <div>HYDERABAD: 040</div>
            </div>
            <div className="pt-2 text-xs text-[#EBE6DF]/80">
              <div>Support: help@thehypeco.in</div>
              <div className="text-[11px] text-[#EBE6DF]/60">Hours: Mon-Sat 10:00 - 19:00 IST</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#EBE6DF]/20 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#EBE6DF]/70 gap-3 sm:gap-4 text-center sm:text-left">
          <div className="tracking-tight sm:tracking-normal">
            © {new Date().getFullYear()} THE HYPE CO. STREETWEAR. ALL RIGHTS RESERVED.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-4 gap-y-1 text-[9px] sm:text-[11px]">
            <span className="whitespace-nowrap">RAZORPAY VERIFIED</span>
            <span className="text-[#EBE6DF]/40">•</span>
            <span className="whitespace-nowrap">MADE IN BHARAT</span>
            <span className="text-[#EBE6DF]/40">•</span>
            <span className="whitespace-nowrap">PAL / NTSC COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
