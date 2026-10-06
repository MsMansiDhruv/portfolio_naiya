"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

export interface ReelItem {
  id: string | number;
  src: string;
  title: string;
  subtitle?: string;
  category?: string;
  views?: string;
  alt?: string;
}

export interface ReelGalleryProps {
  /** Array of social media / reel image items (including festive posts) */
  items: ReelItem[];
  /** Optional container class */
  className?: string;
  /** Speed in seconds for a full loop (default: 95s for slow, graceful glide) */
  speed?: number;
  /** Optional tilt angle in degrees (default: 0 for level soft wave) */
  tiltAngle?: number;
  /** Callback when an item is clicked */
  onItemClick?: (item: ReelItem, index: number) => void;
}

/**
 * ReelGallery - Full-screen immersive soft wave reel of social media creatives and festive campaign posts.
 * Includes interactive social media engagement icons (Heart, Comment, Share, Bookmark) at the bottom of each post.
 */
export function ReelGallery({
  items = [],
  className = "",
  tiltAngle = 0,
  speed = 95,
  onItemClick,
}: ReelGalleryProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (!items || items.length === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden select-none py-6 sm:py-10 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Left/Right Edge Ambient Vignette Fade */}
      <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#050508] via-[#050508]/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#050508] via-[#050508]/80 to-transparent z-20 pointer-events-none" />

      {/* Main Container */}
      <div
        className="w-full flex items-center justify-center"
        style={{
          transform: `rotate(${tiltAngle}deg)`,
          transformOrigin: "center center",
        }}
      >
        <div className="w-full overflow-hidden">
          {/* Continuous Gliding Track with 2 identical runs for seamless loop */}
          <div className="flex w-max will-change-transform">
            {/* Run 1 */}
            <div
              className="flex gap-4 sm:gap-6 md:gap-8 shrink-0 items-center pr-4 sm:pr-6 md:pr-8"
              style={{
                animationName: "reel-slide-left",
                animationDuration: `${speed}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {items.map((item, index) => (
                <ReelCard
                  key={`r1-${item.id}-${index}`}
                  item={item}
                  index={index}
                  totalItems={items.length}
                  isPaused={isPaused}
                  onItemClick={onItemClick}
                />
              ))}
            </div>

            {/* Run 2 (Seamless Duplicate) */}
            <div
              className="flex gap-4 sm:gap-6 md:gap-8 shrink-0 items-center pr-4 sm:pr-6 md:pr-8"
              aria-hidden="true"
              style={{
                animationName: "reel-slide-left",
                animationDuration: `${speed}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {items.map((item, index) => (
                <ReelCard
                  key={`r1-dup-${item.id}-${index}`}
                  item={item}
                  index={index}
                  totalItems={items.length}
                  isPaused={isPaused}
                  onItemClick={onItemClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Inline CSS: Horizontal Gliding + Soft Wave Undulation */}
      <style>{`
        @keyframes reel-slide-left {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }

        /* Harmonic Soft Sinusoidal (~) Wave Animation */
        @keyframes soft-wave-float {
          0% {
            transform: translateY(-22px) rotate(-1.4deg);
          }
          50% {
            transform: translateY(22px) rotate(1.4deg);
          }
          100% {
            transform: translateY(-22px) rotate(-1.4deg);
          }
        }

        @media (max-width: 640px) {
          @keyframes soft-wave-float {
            0% {
              transform: translateY(-12px) rotate(-1deg);
            }
            50% {
              transform: translateY(12px) rotate(1deg);
            }
            100% {
              transform: translateY(-12px) rotate(-1deg);
            }
          }
        }
      `}</style>
    </div>
  );
}

interface ReelCardProps {
  item: ReelItem;
  index: number;
  totalItems?: number;
  isPaused: boolean;
  onItemClick?: (item: ReelItem, index: number) => void;
}

function ReelCard({ item, index, isPaused, onItemClick }: ReelCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Wave calculation: Wavelength of 6 cards creates an organic sinusoidal (~) wave ribbon
  const wavelength = 6;
  const wavePeriod = 6.2; // seconds for graceful undulating breath
  const phase = (index % wavelength) / wavelength;
  const waveDelay = -(phase * wavePeriod).toFixed(3);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved((prev) => !prev);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out ${item.title} by Naiya Dhruv`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  return (
    <div
      className="shrink-0 will-change-transform py-3 sm:py-4"
      style={{
        animationName: "soft-wave-float",
        animationDuration: `${wavePeriod}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDelay: `${waveDelay}s`,
        animationPlayState: isPaused ? "paused" : "running",
      }}
    >
      <div
        onClick={() => onItemClick?.(item, index)}
        className="group relative w-48 sm:w-64 md:w-72 lg:w-80 xl:w-[22rem] aspect-[4/5] bg-[#111116] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/60 shadow-[0_15px_35px_rgba(0,0,0,0.7)] cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:z-30 flex flex-col justify-between"
      >
        {/* Artwork */}
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Dark Ambient Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 group-hover:from-black/90 transition-opacity pointer-events-none" />

        {/* Top Header: Category Tag */}
        <div className="relative top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-amber-400 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
            {item.category || "Creative Post"}
          </span>
        </div>

        {/* Bottom Area: Info + Social Media Action Icons (Heart, Message, Share, Bookmark) */}
        <div className="relative z-10 p-2.5 sm:p-3.5 flex flex-col gap-2">
          {/* Post Title & Subtitle */}
          <div className="flex flex-col gap-0.5 pointer-events-none">
            <span className="font-sans font-semibold text-xs sm:text-sm text-white drop-shadow-md truncate">
              {item.title}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-neutral-300 truncate">
              {item.subtitle || "Social Media Campaign"}
            </span>
          </div>

          {/* Social Media Interactive Engagement Bar (Icons only - no numbers) */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-white/90">
            {/* Left Icons: Heart, Comment, Share */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Like / Heart Icon */}
              <button
                type="button"
                onClick={handleLike}
                className={`p-1 transition-transform active:scale-125 cursor-pointer ${
                  liked ? "text-rose-500" : "text-neutral-200 hover:text-rose-400"
                }`}
                title="Like this creative"
              >
                <Heart
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${
                    liked ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
              </button>

              {/* Message / Comment Icon */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick?.(item, index);
                }}
                className="p-1 text-neutral-200 hover:text-sky-400 transition-colors cursor-pointer"
                title="View comments & case study"
              >
                <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Share / Send Icon */}
              <button
                type="button"
                onClick={handleShare}
                className="p-1 text-neutral-200 hover:text-amber-400 transition-colors cursor-pointer"
                title="Share creative"
              >
                <Send className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>

            {/* Right Icon: Bookmark / Save */}
            <button
              type="button"
              onClick={handleSave}
              className={`p-1 transition-colors cursor-pointer ${
                saved ? "text-amber-400" : "text-neutral-200 hover:text-amber-300"
              }`}
              title="Save to collection"
            >
              <Bookmark
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${
                  saved ? "fill-amber-400 text-amber-400" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReelGallery;
