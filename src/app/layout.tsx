import type { Metadata } from "next";
import { Anton, Karla, Space_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "POSTER CLUB // Indian 90s & 2000s Streetwear Archive",
  description: "Heavyweight oversized & regular streetwear inspired by DD National broadcast test patterns, cassette culture, STD booths, and Sharjah cricket glory.",
  keywords: ["Indian streetwear", "oversized t-shirts", "DD National", "STD PCO", "90s Indian fashion", "vintage streetwear India"],
  openGraph: {
    title: "POSTER CLUB // 90s Indian Pop Culture Streetwear",
    description: "Heavyweight streetwear inspired by DD National, cassette culture, STD booths, and 90s nostalgia.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${karla.variable} ${spaceMono.variable} antialiased selection:bg-signal selection:text-paper`}
    >
      <body className="min-h-screen flex flex-col bg-paper text-ink">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
