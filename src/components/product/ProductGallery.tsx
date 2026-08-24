"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImageData } from "@/lib/mock-data";
import { TrackingMedia } from "@/components/ui/TrackingMedia";

interface ProductGalleryProps {
  images: ProductImageData[];
  name: string;
  fit: string;
}

export function ProductGallery({ images, name, fit }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeImage = images[selectedIndex] || {
    id: "default",
    staticUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    videoUrl: null,
    altText: name,
    position: 0,
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Image with Tracking Glitch */}
      <div className="relative border-std overflow-hidden bg-paper">
        {/* Fit Ribbon */}
        <div className="absolute top-3 left-3 z-30 font-mono text-xs font-bold px-2.5 py-1 uppercase bg-signal text-paper border border-ink shadow-sm">
          {fit} FIT
        </div>

        <TrackingMedia
          key={activeImage.id}
          staticUrl={activeImage.staticUrl}
          videoUrl={activeImage.videoUrl}
          altText={activeImage.altText || name}
          aspectRatio="aspect-[4/5]"
          priority={true}
          className="w-full"
        />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square border-2 overflow-hidden transition-all ${
                selectedIndex === idx
                  ? "border-signal shadow-md scale-95 ring-2 ring-signal/50"
                  : "border-ink hover:border-signal/70 opacity-80 hover:opacity-100"
              }`}
              aria-label={`View image ${idx + 1} for ${name}`}
            >
              <Image
                src={img.staticUrl}
                alt={img.altText || `${name} thumbnail ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 15vw"
                className="object-cover"
              />
              {img.videoUrl && (
                <span className="absolute bottom-1 right-1 bg-ink/90 text-paper text-[8px] font-mono px-1 rounded-xs">
                  ▶ VIDEO
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
