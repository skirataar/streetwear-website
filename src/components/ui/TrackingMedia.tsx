"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface TrackingMediaProps {
  staticUrl: string;
  videoUrl?: string | null;
  altText: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-[4/5]" or "aspect-square"
  priority?: boolean;
  onGlitchComplete?: () => void;
}

// Global session store to ensure mobile IntersectionObserver only auto-triggers once per image per session
const triggeredInSession = new Set<string>();

export function TrackingMedia({
  staticUrl,
  videoUrl,
  altText,
  className = "",
  aspectRatio = "aspect-[4/5]",
  priority = false,
}: TrackingMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check system prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Trigger glitch and subsequent video swap
  const triggerGlitchSequence = () => {
    if (prefersReducedMotion || !videoUrl) return;

    setIsGlitching(true);
    // Glitch runs for ~220ms as specified
    const timer = setTimeout(() => {
      setIsGlitching(false);
      setShowVideo(true);
    }, 220);

    return () => clearTimeout(timer);
  };

  // Mobile viewport entry (IntersectionObserver - autoplay once per session)
  useEffect(() => {
    if (prefersReducedMotion || !videoUrl) return;

    const el = containerRef.current;
    if (!el) return;

    // Check if on touch/mobile device
    const isMobile = window.innerWidth <= 768 || "ontouchstart" in window;
    if (!isMobile) return;

    const sessionKey = `${staticUrl}-${videoUrl}`;
    if (triggeredInSession.has(sessionKey)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !triggeredInSession.has(sessionKey)) {
          triggeredInSession.add(sessionKey);
          triggerGlitchSequence();
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticUrl, videoUrl, prefersReducedMotion]);

  // Desktop hover handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (prefersReducedMotion || !videoUrl) return;
    if (!showVideo && !isGlitching) {
      triggerGlitchSequence();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // On desktop leave, return to static image for crispness
    setShowVideo(false);
    setIsGlitching(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden bg-ink/10 select-none ${aspectRatio} ${className}`}
      data-testid="tracking-media-container"
    >
      {/* Glitch Overlay effect bar */}
      {isGlitching && !prefersReducedMotion && (
        <div className="absolute inset-0 z-20 pointer-events-none bg-flash/20 mix-blend-color-dodge animate-tracking" />
      )}

      {/* VHS Tracking scanline jitter effect during animation */}
      {isGlitching && !prefersReducedMotion && (
        <div className="absolute inset-x-0 h-4 bg-white/60 backdrop-blur-sm top-1/3 animate-pulse z-30 pointer-events-none" />
      )}

      {/* Static Image (always rendered, hidden only if video active and not reduced motion) */}
      <Image
        src={staticUrl}
        alt={altText}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        className={`object-cover object-center transition-transform duration-300 ${
          isGlitching && !prefersReducedMotion ? "animate-tracking" : ""
        } ${isHovered ? "scale-105" : "scale-100"} ${
          showVideo && !prefersReducedMotion ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Cloudinary Looped Video Layer */}
      {videoUrl && showVideo && !prefersReducedMotion && (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          className="absolute inset-0 w-full h-full object-cover object-center z-10"
        />
      )}

      {/* Subtle VHS corner watermark */}
      <div className="absolute bottom-2 left-2 z-10 text-[9px] font-mono tracking-widest text-white/80 bg-ink/80 px-1.5 py-0.5 rounded-sm border border-white/20 uppercase">
        {showVideo ? "▶ PLAY // VHS" : "SP // 90MIN"}
      </div>
    </div>
  );
}
