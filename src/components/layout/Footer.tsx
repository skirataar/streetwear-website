import React from "react";
import Link from "next/link";
import { Disc, PhoneCall, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-white border-t-4 border-flash pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-white/10 text-xs font-mono">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-hype shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block uppercase">PAN-INDIA SHIPPING</span>
              <span className="text-neutral-400">Free dispatch over ₹1,999. Express 3-5 day delivery.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Disc className="w-5 h-5 text-flash shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block uppercase">240+ GSM HEAVYWEIGHT</span>
              <span className="text-neutral-400">100% combed cotton, bio-washed, pre-shrunk boxy fits.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-hype shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block uppercase">RAZORPAY SECURED</span>
              <span className="text-neutral-400">UPI (GPay/PhonePe), Credit/Debit Cards, Netbanking.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-hype shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block uppercase">7-DAY SIZE EXCHANGE</span>
              <span className="text-neutral-400">Hassle-free reverse pickups for size adjustments.</span>
            </div>
          </div>
        </div>

        {/* Cassette J-Card Liner / Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10">
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl uppercase tracking-tight text-white">
                POSTER // CLUB
              </span>
              <span className="bg-flash text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm">
                EST. 1998
              </span>
            </div>
            <p className="text-xs font-body text-neutral-400 leading-relaxed max-w-md">
              An archive of Indian street memories — from the hypnotic Doordarshan test signal tone to the yellow-black STD booth coin drops and Sharjah desert storm centuries. Manufactured in Tirupur with heavyweight Indian cotton.
            </p>
            <div className="font-mono text-[11px] text-neutral-400 space-y-1">
              <div>// CASSETTE SIDE A: DD NATIONAL • SHAKTIMAAN • CRICKET</div>
              <div>// CASSETTE SIDE B: CYBERCAFÉ 56KBPS • STD PCO • WINAMP</div>
            </div>
          </div>

          {/* Era Navigation */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-1">
              ARCHIVE DROPS
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link href="/catalog/dd-national" className="hover:text-hype transition-colors">
                  ▶ DD National Spectrum
                </Link>
              </li>
              <li>
                <Link href="/catalog/std-isd-pco" className="hover:text-hype transition-colors">
                  ▶ STD PCO 1-Rupee Booth
                </Link>
              </li>
              <li>
                <Link href="/catalog/y2k-cybercafe" className="hover:text-hype transition-colors">
                  ▶ Y2K Cybercafé Dial-Up
                </Link>
              </li>
              <li>
                <Link href="/catalog/sharjah-cricket" className="hover:text-hype transition-colors">
                  ▶ Sharjah &#39;98 Desert Storm
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-hype transition-colors">
                  ▶ View All Tees
                </Link>
              </li>
            </ul>
          </div>

          {/* STD Booth Dial Codes & Contact */}
          <div className="md:col-span-4 space-y-3 font-mono text-xs">
            <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider border-b border-white/10 pb-1 flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5" />
              STD DIAL CODES &amp; SUPPORT
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400">
              <div>DELHI: 011</div>
              <div>MUMBAI: 022</div>
              <div>BANGALORE: 080</div>
              <div>KOLKATA: 033</div>
              <div>CHENNAI: 044</div>
              <div>HYDERABAD: 040</div>
            </div>
            <div className="pt-2 text-xs text-neutral-400">
              <div>Support: help@posterclub.in</div>
              <div className="text-[11px] text-neutral-500">Hours: Mon-Sat 10:00 - 19:00 IST</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} POSTER CLUB STREETWEAR. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>RAZORPAY VERIFIED</span>
            <span>•</span>
            <span>MADE IN BHARAT</span>
            <span>•</span>
            <span>PAL / NTSC COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
