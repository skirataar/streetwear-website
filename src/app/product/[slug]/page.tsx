import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/mock-data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { VariantSelector } from "@/components/product/VariantSelector";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, RotateCcw, Share2 } from "lucide-react";

export const revalidate = 60; // ISR revalidate every 60s

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found // Poster Club",
    };
  }

  const staticImage = product.images[0]?.staticUrl || "";

  return {
    title: `${product.name} // Indian Streetwear Archive`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Poster Club Streetwear`,
      description: product.description,
      images: [
        {
          url: staticImage, // Static shot only as required
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products from same era / collection
  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.era === product.era)
    .slice(0, 3);

  const fallbackRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs text-ink/70">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href="/" className="hover:text-signal transition-colors">
              HOME
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/catalog" className="hover:text-signal transition-colors">
              CATALOGUE
            </Link>
          </li>
          <li>/</li>
          {product.collectionSlug && (
            <>
              <li>
                <Link
                  href={`/catalog/${product.collectionSlug}`}
                  className="hover:text-signal transition-colors uppercase"
                >
                  {product.era}
                </Link>
              </li>
              <li>/</li>
            </>
          )}
          <li className="font-bold text-ink uppercase truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main PDP Grid (Gallery Left + Variant Selector Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16">
        {/* Left Column: Media Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            name={product.name}
            fit={product.fit}
          />
        </div>

        {/* Right Column: Title, Description, Variants & Add to Cart */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-signal tracking-widest mb-1.5">
              <span>{product.era} // DROP #04</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-ink leading-tight">
              {product.name}
            </h1>
            <p className="font-body text-sm text-ink/80 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Interactive Size, Quantity and Add to Cart Section */}
          <VariantSelector product={product} />

          {/* Value Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-static text-[11px] font-mono text-ink/80">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-signal shrink-0" />
              <span>FREE DELIVERY OVER ₹1,999</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-crt shrink-0" />
              <span>100% SECURE RAZORPAY CHECKOUT</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-tape shrink-0" />
              <span>7-DAY EASY SIZE EXCHANGE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-signal inline-block shrink-0" />
              <span>MADE IN TIRUPUR, INDIA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Archive Drops Section */}
      {fallbackRelated.length > 0 && (
        <section className="border-t-4 border-ink pt-12 mt-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs font-mono font-bold uppercase text-signal">
                // COMPATIBLE FREQUENCIES
              </div>
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-ink">
                MORE FROM THE ARCHIVE
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-mono font-bold uppercase text-ink hover:text-signal hover:underline"
            >
              VIEW ALL
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {fallbackRelated.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
