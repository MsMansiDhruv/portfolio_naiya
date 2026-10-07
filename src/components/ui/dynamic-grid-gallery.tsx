"use client";

import { useState } from "react";

export interface GalleryItem {
  id: string | number;
  src: string;
  backSrc?: string;
  alt?: string;
  title?: string;
  category?: string;
  subtitle?: string;
}

export interface DynamicGridGalleryProps {
  /** Array of image items (2 items for dual flyers, 3 items for pitch deck dynamic 2-top-1-bottom layout, or 4-6 items for multi-grid) */
  items: GalleryItem[];
  /** Grid gap in pixels (default: 14) */
  gap?: number;
  /** Hover expansion ratio for multi-row grid (default: 1.9) */
  expandFactor?: number;
  /** Border radius tailwind class (default: "rounded-xl") */
  rounded?: string;
  /** Custom container class */
  className?: string;
  /** Callback when an image is clicked */
  onItemClick?: (item: GalleryItem, index: number) => void;
}

/**
 * DynamicGridGallery - High-performance interactive expandable gallery.
 * Supports:
 * - 3-Item Pitch Deck Layout (2 on Top, 1 on Bottom with Continuous Smooth Slide Animation):
 *   Default: 2 landscape slides side-by-side on top, 1 wide landscape slide on bottom.
 *   Hover top image: The companion top image smoothly slides down to the bottom row,
 *   while the hovered image smoothly slides and expands across the entire top row in wide landscape format.
 *   Uses 100% uncropped object-contain rendering with ambient presentation backdrops so ZERO slide content is cut off.
 * - 2-Item Dual Flyer Layout: 2 side-by-side 3D flippable cards with 180° front-to-back rotation on hover.
 * - Multi-Item Layout: Dynamic 3x2 / 2x2 cubic-bezier grid expansion.
 */
export function DynamicGridGallery({
  items,
  gap = 14,
  expandFactor = 1.9,
  rounded = "rounded-xl",
  className = "",
  onItemClick,
}: DynamicGridGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string | number, boolean>>({});

  const toggleCardFlip = (idOrIndex: string | number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [idOrIndex]: !prev[idOrIndex],
    }));
  };

  const hasAnyBackSrc = items.some((it) => Boolean(it.backSrc));
  const isPrintMediaThreeItems = items.length === 3 && hasAnyBackSrc;
  const isThreeItems = items.length === 3 && !hasAnyBackSrc;
  const isTwoItems = items.length === 2;

  // Continuous Fluid Bounds Calculator for 3-Item Smooth Slide & Glide Animation
  const getThreeItemBounds = (index: number) => {
    const halfGap = gap / 2; // e.g. 7px

    if (hoveredIndex === 0) {
      // Item 0 is hovered: smoothly slides & expands full-width on top row (58% height), Item 1 slides to bottom right, Item 2 slides to bottom left
      if (index === 0) {
        return {
          left: "0%",
          top: "0%",
          width: "100%",
          height: `calc(58% - ${halfGap}px)`,
          zIndex: 25,
        };
      }
      if (index === 1) {
        return {
          left: `calc(50% + ${halfGap}px)`,
          top: `calc(58% + ${halfGap}px)`,
          width: `calc(50% - ${halfGap}px)`,
          height: `calc(42% - ${halfGap}px)`,
          zIndex: 10,
        };
      }
      if (index === 2) {
        return {
          left: "0%",
          top: `calc(58% + ${halfGap}px)`,
          width: `calc(50% - ${halfGap}px)`,
          height: `calc(42% - ${halfGap}px)`,
          zIndex: 10,
        };
      }
    }

    if (hoveredIndex === 1) {
      // Item 1 is hovered: smoothly slides & expands full-width on top row (58% height), Item 0 slides to bottom left, Item 2 slides to bottom right
      if (index === 1) {
        return {
          left: "0%",
          top: "0%",
          width: "100%",
          height: `calc(58% - ${halfGap}px)`,
          zIndex: 25,
        };
      }
      if (index === 0) {
        return {
          left: "0%",
          top: `calc(58% + ${halfGap}px)`,
          width: `calc(50% - ${halfGap}px)`,
          height: `calc(42% - ${halfGap}px)`,
          zIndex: 10,
        };
      }
      if (index === 2) {
        return {
          left: `calc(50% + ${halfGap}px)`,
          top: `calc(58% + ${halfGap}px)`,
          width: `calc(50% - ${halfGap}px)`,
          height: `calc(42% - ${halfGap}px)`,
          zIndex: 10,
        };
      }
    }

    if (hoveredIndex === 2) {
      // Item 2 is hovered: smoothly expands taller on bottom (62% height), Items 0 & 1 remain side-by-side on top (38% height)
      if (index === 0) {
        return {
          left: "0%",
          top: "0%",
          width: `calc(50% - ${halfGap}px)`,
          height: `calc(38% - ${halfGap}px)`,
          zIndex: 10,
        };
      }
      if (index === 1) {
        return {
          left: `calc(50% + ${halfGap}px)`,
          top: "0%",
          width: `calc(50% - ${halfGap}px)`,
          height: `calc(38% - ${halfGap}px)`,
          zIndex: 10,
        };
      }
      if (index === 2) {
        return {
          left: "0%",
          top: `calc(38% + ${halfGap}px)`,
          width: "100%",
          height: `calc(62% - ${halfGap}px)`,
          zIndex: 25,
        };
      }
    }

    // Default (no hover): 2 items on top (46% height), 1 full-width item on bottom (54% height)
    if (index === 0) {
      return {
        left: "0%",
        top: "0%",
        width: `calc(50% - ${halfGap}px)`,
        height: `calc(46% - ${halfGap}px)`,
        zIndex: 10,
      };
    }
    if (index === 1) {
      return {
        left: `calc(50% + ${halfGap}px)`,
        top: "0%",
        width: `calc(50% - ${halfGap}px)`,
        height: `calc(46% - ${halfGap}px)`,
        zIndex: 10,
      };
    }
    return {
      left: "0%",
      top: `calc(46% + ${halfGap}px)`,
      width: "100%",
      height: `calc(54% - ${halfGap}px)`,
      zIndex: 10,
    };
  };

  // Dynamic Grid Template calculation for 2-item and 4-6 item layouts
  const getStandardGridTemplate = () => {
    if (isTwoItems) {
      // If items have backSrc (like dual-sided flyers), display side-by-side:
      if (hasAnyBackSrc) {
        if (hoveredIndex === null) {
          return {
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr",
          };
        }
        return {
          gridTemplateColumns:
            hoveredIndex === 0 ? "1.4fr 0.8fr" : "0.8fr 1.4fr",
          gridTemplateRows: "1fr",
        };
      }

      // For 2 static landscape logo items: stack TOP and BOTTOM (1 full-width column, 2 stacked rows)
      if (hoveredIndex === null) {
        return {
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr 1fr",
        };
      }
      return {
        gridTemplateColumns: "1fr",
        gridTemplateRows:
          hoveredIndex === 0 ? "1.25fr 0.75fr" : "0.75fr 1.25fr",
      };
    }

    const cols = 3;
    const rows = 2;

    if (hoveredIndex === null) {
      return {
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
      };
    }

    const hoveredRow = Math.floor(hoveredIndex / cols);
    const hoveredCol = hoveredIndex % cols;

    const rowTemplates = Array.from({ length: rows }, (_, r) =>
      r === hoveredRow ? `${expandFactor}fr` : "0.9fr"
    ).join(" ");

    const colTemplates = Array.from({ length: cols }, (_, c) =>
      c === hoveredCol ? `${expandFactor}fr` : "0.9fr"
    ).join(" ");

    return {
      gridTemplateColumns: colTemplates,
      gridTemplateRows: rowTemplates,
    };
  };

  const gridStyles = getStandardGridTemplate();
  const displayItems = items.slice(0, 6);

  // Height preset based on item count
  const containerHeightClass =
    isPrintMediaThreeItems
      ? "h-[660px] lg:h-[760px]"
      : isThreeItems
      ? "h-[540px] lg:h-[620px]"
      : isTwoItems
      ? (hasAnyBackSrc ? "h-[560px] lg:h-[660px]" : "h-[720px] lg:h-[820px]")
      : "h-[540px] lg:h-[640px]";

  return (
    <div
      className={`relative w-full select-none ${className}`}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* ── CASE 1A: PRINT MEDIA 3-ITEM LAYOUT (2 DUAL FLIPPABLE FLYERS ON TOP + 1 STALL BACKDROP BANNER ON BOTTOM) ── */}
      {isPrintMediaThreeItems ? (
        <div className="hidden md:flex flex-col gap-3.5 w-full h-[660px] lg:h-[760px] overflow-hidden rounded-2xl">
          {/* Top Row: 2 Flippable Flyers */}
          <div className="grid grid-cols-2 gap-3.5 w-full h-[58%]">
            {displayItems.slice(0, 2).map((item, index) => {
              const cardKey = item.id || index;
              const hasBackSide = Boolean(item.backSrc);
              const isHovered = hoveredIndex === index;
              const isCardManuallyFlipped = Boolean(flippedCards[cardKey]);
              const isFlipped = hasBackSide ? (isHovered !== isCardManuallyFlipped) : false;

              return (
                <div
                  key={cardKey}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={() => onItemClick?.(item, index)}
                  style={{ perspective: "1200px" }}
                  className={`relative w-full h-full overflow-hidden ${rounded} cursor-pointer select-none bg-[#09090d] group border transition-all duration-500 shadow-xl ${
                    isHovered
                      ? "border-amber-400/60 shadow-amber-500/10 shadow-2xl z-20"
                      : "border-white/10 z-10"
                  }`}
                >
                  {/* PROMINENT ALWAYS-VISIBLE FLOATING FLIP BUTTON */}
                  <div className="absolute top-3 right-3 z-30 pointer-events-auto">
                    <button
                      type="button"
                      onClick={(e) => toggleCardFlip(cardKey, e)}
                      className={`group/btn flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono font-bold text-xs shadow-2xl transition-all duration-300 cursor-pointer border-2 active:scale-95 ${
                        isFlipped
                          ? "bg-emerald-400 text-black border-emerald-200 shadow-[0_0_22px_rgba(52,211,153,0.7)] hover:bg-emerald-300"
                          : "bg-amber-400 text-black border-amber-200 shadow-[0_0_22px_rgba(251,191,36,0.7)] hover:bg-amber-300 hover:scale-105"
                      }`}
                      title="Click to flip between front cover and reverse architecture"
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? "rotate-180" : "group-hover/btn:rotate-180"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span className="tracking-wide uppercase font-semibold">
                        {isFlipped ? "FLIP TO FRONT ↻" : "FLIP TO BACK ↻"}
                      </span>
                    </button>
                  </div>

                  {/* 3D ROTATION WRAPPER */}
                  <div
                    className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.34,1.25,0.64,1)]"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* FRONT FACE */}
                    <div
                      className="absolute inset-0 w-full h-full overflow-hidden bg-[#0c0c10] flex items-center justify-center p-2 sm:p-3"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-20 scale-110 pointer-events-none"
                        style={{ backgroundImage: `url(${item.src})` }}
                      />
                      <img
                        src={item.src}
                        alt={item.alt || `${item.title} (Front)`}
                        loading="eager"
                        className="relative z-10 w-full h-full object-contain object-center filter brightness-[1.03] contrast-[1.02]"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20 pointer-events-none">
                        <span className="font-mono text-[9px] tracking-wider text-amber-400 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 shadow-md">
                          [PAGE 01 · FRONT]
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                        <div className="flex flex-col">
                          <span className="font-sans font-medium text-xs sm:text-sm text-white drop-shadow-md">
                            {item.title}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-300">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div
                      className="absolute inset-0 w-full h-full overflow-hidden bg-[#0a0a0e] flex items-center justify-center p-2 sm:p-3"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-20 scale-110 pointer-events-none"
                        style={{ backgroundImage: `url(${item.backSrc || item.src})` }}
                      />
                      <img
                        src={item.backSrc || item.src}
                        alt={`${item.title} (Back Architecture)`}
                        loading="eager"
                        className="relative z-10 w-full h-full object-contain object-center filter brightness-[1.03] contrast-[1.02]"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20 pointer-events-none">
                        <span className="font-mono text-[9px] tracking-wider text-emerald-400 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-400/30 shadow-md">
                          [PAGE 02 · BACK]
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                        <div className="flex flex-col">
                          <span className="font-sans font-medium text-xs sm:text-sm text-white drop-shadow-md">
                            {item.title} (Reverse Side)
                          </span>
                          <span className="font-mono text-[10px] text-emerald-300/80">
                            Detailed System Breakdown
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Row: Print Banners & Backdrops */}
          {displayItems.length > 2 && (
            <div
              className={`grid ${
                displayItems.length - 2 >= 3
                  ? "grid-cols-3"
                  : displayItems.length - 2 === 2
                  ? "grid-cols-2"
                  : "grid-cols-1"
              } gap-3.5 w-full h-[42%]`}
            >
              {displayItems.slice(2).map((bannerItem, bIdx) => {
                const actualIdx = bIdx + 2;
                const isHovered = hoveredIndex === actualIdx;
                return (
                  <div
                    key={bannerItem.id || actualIdx}
                    onMouseEnter={() => setHoveredIndex(actualIdx)}
                    onClick={() => onItemClick?.(bannerItem, actualIdx)}
                    className={`relative w-full h-full overflow-hidden ${rounded} cursor-pointer select-none bg-[#09090d] group border transition-all duration-500 shadow-xl ${
                      isHovered
                        ? "border-amber-400/60 shadow-amber-500/10 shadow-2xl z-20"
                        : "border-white/10 z-10"
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-20 scale-110 pointer-events-none"
                      style={{ backgroundImage: `url(${bannerItem.src})` }}
                    />
                    <img
                      src={bannerItem.src}
                      alt={bannerItem.alt || bannerItem.title || "Print Banner"}
                      loading="eager"
                      className="relative z-10 w-full h-full object-contain object-center filter brightness-[1.03] contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                    />
                    {/* Top Badge */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
                      <span className="font-mono text-[9px] tracking-wider text-amber-400 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 shadow-md">
                        [{String(actualIdx + 1).padStart(2, "0")}] {bannerItem.category?.toUpperCase() || "PRINT BANNER"}
                      </span>
                    </div>
                    {/* Bottom Caption */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-sans font-medium text-xs sm:text-sm text-white drop-shadow-md truncate">
                          {bannerItem.title}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-300 truncate">
                          {bannerItem.subtitle}
                        </span>
                      </div>
                      <div
                        className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition-all ${
                          isHovered
                            ? "bg-amber-400 text-black shadow-md"
                            : "bg-white/10 backdrop-blur-md border border-white/20 text-white/80"
                        }`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : isThreeItems ? (
        <div className={`hidden md:block relative w-full ${containerHeightClass} overflow-hidden rounded-2xl`}>
          {displayItems.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const isCompanion = hoveredIndex !== null && hoveredIndex !== index;
            const bounds = getThreeItemBounds(index);
            const isFullWidthSpan = bounds.width === "100%";

            return (
              <div
                key={item.id || index}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => onItemClick?.(item, index)}
                style={{
                  position: "absolute",
                  left: bounds.left,
                  top: bounds.top,
                  width: bounds.width,
                  height: bounds.height,
                  zIndex: bounds.zIndex,
                  transition:
                    "top 0.7s cubic-bezier(0.2, 0.9, 0.25, 1), left 0.7s cubic-bezier(0.2, 0.9, 0.25, 1), width 0.7s cubic-bezier(0.2, 0.9, 0.25, 1), height 0.7s cubic-bezier(0.2, 0.9, 0.25, 1), border-color 0.4s ease, box-shadow 0.4s ease",
                }}
                className={`overflow-hidden ${rounded} cursor-pointer select-none bg-[#09090d] group border shadow-xl will-change-[top,left,width,height] ${
                  isHovered
                    ? "border-amber-400/60 shadow-amber-500/10 shadow-2xl"
                    : isCompanion
                    ? "border-white/5 opacity-85"
                    : "border-white/10"
                }`}
              >
                <div className="relative w-full h-full overflow-hidden bg-[#09090d] flex items-center justify-center p-1.5 sm:p-2">
                  {/* Subtle soft ambient blurred backdrop to fill letterbox bars elegantly */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-20 scale-110 pointer-events-none"
                    style={{ backgroundImage: `url(${item.src})` }}
                  />

                  {/* Complete, 100% Un-cropped Slide Artwork */}
                  <img
                    src={item.src}
                    alt={item.alt || item.title || ""}
                    loading={index < 3 ? "eager" : "lazy"}
                    className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.01] filter brightness-[0.99] contrast-[1.03]"
                  />

                  {/* Ambient gradient vignette */}
                  <div
                    className={`absolute inset-0 z-15 bg-gradient-to-t from-black/85 via-black/10 to-black/20 transition-opacity duration-300 pointer-events-none ${
                      isHovered ? "opacity-20" : "opacity-45"
                    }`}
                  />

                  {/* Top Index & Category Badge */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] tracking-wider text-amber-400 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 flex items-center gap-1 shadow-md">
                        {isHovered && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                        <span>[{String(index + 1).padStart(2, "0")}]</span>
                      </span>
                      {isFullWidthSpan && isHovered && (
                        <span className="font-mono text-[9px] text-amber-300 uppercase tracking-widest bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded border border-amber-400/30">
                          EXPANDED FULL VIEW
                        </span>
                      )}
                    </div>

                    {item.category && (
                      <span className={`font-mono text-[9px] uppercase tracking-widest bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border transition-all ${
                        isHovered
                          ? "border-amber-400/30 text-amber-300 opacity-100"
                          : "border-white/5 text-neutral-300 opacity-80"
                      }`}>
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Bottom Caption Bar */}
                  <div
                    className={`absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between transition-all duration-300 pointer-events-none z-20 ${
                      isHovered
                        ? "opacity-100 translate-y-0"
                        : "opacity-85 translate-y-0.5"
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      {item.title && (
                        <span className="font-sans font-medium text-xs sm:text-sm text-white drop-shadow-md truncate">
                          {item.title}
                        </span>
                      )}
                      {item.subtitle && (
                        <span className="font-mono text-[10px] text-neutral-300 truncate">
                          {item.subtitle}
                        </span>
                      )}
                    </div>

                    <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition-all ${
                      isHovered
                        ? "bg-amber-400 text-black shadow-md"
                        : "bg-white/10 backdrop-blur-md border border-white/20 text-white/80"
                    }`}>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : isTwoItems && !hasAnyBackSrc ? (
        /* ── CASE 1C: 2-ITEM LOGO PRESENTATION (SQUARE SHAPE SIDE BY SIDE WITH ELEGANT GALLERY FRAMING) ── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-5xl mx-auto py-2">
          {displayItems.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const cardKey = item.id || index;

            return (
              <div
                key={cardKey}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => onItemClick?.(item, index)}
                className={`relative aspect-square w-full overflow-hidden ${rounded} cursor-pointer select-none bg-[#09090d] group border transition-all duration-500 shadow-2xl flex items-center justify-center p-3 sm:p-5 pb-12 sm:pb-14 ${
                  isHovered
                    ? "border-amber-400/70 shadow-amber-500/15 shadow-2xl -translate-y-1"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Subtle Ambient Blurred Glow Backdrop */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-15 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url(${item.src})` }}
                />

                {/* Inner Architectural Gallery Frame Border */}
                <div className="absolute inset-2.5 sm:inset-3.5 rounded-xl border border-white/5 pointer-events-none group-hover:border-amber-400/20 transition-colors" />

                {/* 100% Uncropped Presentation Board */}
                <img
                  src={item.src}
                  alt={item.alt || item.title || ""}
                  loading={index < 2 ? "eager" : "lazy"}
                  className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.02] filter brightness-[1.01] contrast-[1.02] drop-shadow-xl"
                />

                {/* Top Index & Category Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-20">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-amber-400 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded border border-amber-400/30 shadow-md">
                    [{String(index + 1).padStart(2, "0")}]
                  </span>
                  {item.category && (
                    <span className="font-mono text-[9px] sm:text-[10px] text-neutral-300 uppercase tracking-widest bg-black/75 backdrop-blur-sm px-2.5 py-0.5 rounded border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Bottom Caption Pill with Zoom Prompt */}
                <div
                  className={`absolute bottom-3 left-3 right-3 flex items-center justify-between transition-all duration-300 pointer-events-none z-20 bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-lg ${
                    isHovered
                      ? "border-amber-400/40 opacity-100 translate-y-0"
                      : "opacity-90 translate-y-0.5"
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    {item.title && (
                      <span className="font-sans font-medium text-xs sm:text-sm text-white drop-shadow-md truncate">
                        {item.title}
                      </span>
                    )}
                    {item.subtitle && (
                      <span className="font-mono text-[10px] text-amber-300/80 truncate">
                        {item.subtitle}
                      </span>
                    )}
                  </div>

                  <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition-all ${
                    isHovered
                      ? "bg-amber-400 text-black shadow-md"
                      : "bg-white/10 text-white/80"
                  }`}>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── CASE 2: 2-ITEM DUAL FLYERS & MULTI-ITEM GRID ── */
        <div
          className={`hidden md:grid w-full ${containerHeightClass} transition-[grid-template-columns,grid-template-rows] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]`}
          style={{
            gridTemplateColumns: gridStyles.gridTemplateColumns,
            gridTemplateRows: gridStyles.gridTemplateRows,
            gap: `${gap}px`,
          }}
        >
          {displayItems.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const hasBackSide = Boolean(item.backSrc);
            const isCompanion = hoveredIndex !== null && hoveredIndex !== index;
            const cardKey = item.id || index;
            const isCardManuallyFlipped = Boolean(flippedCards[cardKey]);
            const isFlipped = hasBackSide ? isHovered !== isCardManuallyFlipped : false;

            return (
              <div
                key={cardKey}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => onItemClick?.(item, index)}
                style={{
                  perspective: hasBackSide ? "1200px" : undefined,
                }}
                className={`relative w-full h-full overflow-hidden ${rounded} col-span-1 cursor-pointer select-none bg-[#111116] group border transition-all duration-500 shadow-xl ${
                  isHovered
                    ? "border-amber-400/60 shadow-amber-500/10 shadow-2xl z-20"
                    : isCompanion
                    ? "border-white/5 opacity-85 z-10"
                    : "border-white/10 z-10"
                }`}
              >
                {hasBackSide ? (
                  /* ── 3D FLIPPABLE FLYER CONTAINER (FRONT & BACK 180° ROTATION) ── */
                  <div className="relative w-full h-full">
                    {/* PROMINENT ALWAYS-VISIBLE FLOATING FLIP BUTTON */}
                    <div className="absolute top-3 right-3 z-30 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => toggleCardFlip(cardKey, e)}
                        className={`group/btn flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-mono font-bold text-xs shadow-2xl transition-all duration-300 cursor-pointer border-2 active:scale-95 ${
                          isFlipped
                            ? "bg-emerald-400 text-black border-emerald-200 shadow-[0_0_22px_rgba(52,211,153,0.7)] hover:bg-emerald-300"
                            : "bg-amber-400 text-black border-amber-200 shadow-[0_0_22px_rgba(251,191,36,0.7)] hover:bg-amber-300 hover:scale-105"
                        }`}
                        title="Click to flip between front cover and reverse architecture"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-500 ${isFlipped ? "rotate-180" : "group-hover/btn:rotate-180"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span className="tracking-wide uppercase font-semibold">
                          {item.category?.includes('Logo') || item.category?.includes('Brand')
                            ? (isFlipped ? "FLIP TO CARDS ↻" : "FLIP TO LOGO ↻")
                            : (isFlipped ? "FLIP TO FRONT ↻" : "FLIP TO BACK ↻")}
                        </span>
                      </button>
                    </div>

                    {/* 3D ROTATION WRAPPER */}
                    <div
                      className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.34,1.25,0.64,1)]"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      }}
                    >
                      {/* FRONT FACE OF FLYER / BRAND CARD */}
                      <div
                        className="absolute inset-0 w-full h-full overflow-hidden bg-[#0c0c10] flex items-center justify-center p-2 sm:p-3"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <img
                          src={item.src}
                          alt={item.alt || `${item.title} (Front)`}
                          loading={index < 2 ? "eager" : "lazy"}
                          className="w-full h-full object-contain object-center filter brightness-[1.03] contrast-[1.02]"
                        />

                        {/* Front Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-10">
                          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-amber-400 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded border border-amber-400/30 flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span>
                              {item.category?.includes('Logo') || item.category?.includes('Brand')
                                ? 'BRAND APPLICATION · CARDS'
                                : 'PAGE 01 · FRONT'}
                            </span>
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                          <div className="flex flex-col">
                            <span className="font-sans font-medium text-xs text-white drop-shadow-md">
                              {item.title}
                            </span>
                            <span className="font-mono text-[10px] text-amber-300/90">
                              {item.category?.includes('Logo') || item.category?.includes('Brand')
                                ? 'Stationery & Identity Cards'
                                : 'Dual-Sided Flyer (Front Cover)'}
                            </span>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-400/40 flex items-center justify-center text-amber-300 text-xs">
                            ↻
                          </div>
                        </div>
                      </div>

                      {/* BACK FACE OF FLYER / LOGO CONSTRUCTION (ROTATED 180 DEG) */}
                      <div
                        className="absolute inset-0 w-full h-full overflow-hidden bg-[#0e0e14] flex items-center justify-center p-2 sm:p-3"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <img
                          src={item.backSrc!}
                          alt={item.alt || `${item.title} (Back)`}
                          loading="lazy"
                          className="w-full h-full object-contain object-center filter brightness-[1.03] contrast-[1.02]"
                        />

                        {/* Back Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-10">
                          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-emerald-400 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded border border-emerald-400/30 flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>
                              {item.category?.includes('Logo') || item.category?.includes('Brand')
                                ? 'LOGO & MEANING'
                                : 'PAGE 02 · REVERSE'}
                            </span>
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                          <div className="flex flex-col">
                            <span className="font-sans font-medium text-xs text-white drop-shadow-md">
                              {item.title}
                            </span>
                            <span className="font-mono text-[10px] text-emerald-300/90">
                              {item.category?.includes('Logo') || item.category?.includes('Brand')
                                ? 'Logo Breakdown & Meaning'
                                : 'Dual-Sided Flyer (Reverse Side)'}
                            </span>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-emerald-400/20 backdrop-blur-md border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xs">
                            ✓
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── STANDARD STATIC IMAGE WITH VIGNETTE & CAPTION ── */
                  <div className="relative w-full h-full overflow-hidden bg-[#0c0c10] flex items-center justify-center p-2 sm:p-4 pb-12 sm:pb-14">
                    {/* Blurred Ambient Glow Backdrop */}
                    <div
                      className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-15 scale-110 pointer-events-none"
                      style={{ backgroundImage: `url(${item.src})` }}
                    />

                    {/* 100% Un-cropped Slide/Artwork */}
                    <img
                      src={item.src}
                      alt={item.alt || item.title || ""}
                      loading={index < 3 ? "eager" : "lazy"}
                      className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.01] filter brightness-[0.99] contrast-[1.03]"
                    />

                    {/* Top Index & Category Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                      <span className="font-mono text-[9px] tracking-wider text-amber-400 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 shadow-md">
                        [{String(index + 1).padStart(2, "0")}]
                      </span>
                      {item.category && (
                        <span className="font-mono text-[9px] text-neutral-300 uppercase tracking-widest bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Bottom Caption Pill */}
                    <div
                      className={`absolute bottom-3 left-3 right-3 flex items-center justify-between transition-all duration-300 pointer-events-none z-20 ${
                        isHovered
                          ? "opacity-100 translate-y-0"
                          : "opacity-80 translate-y-0.5"
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        {item.title && (
                          <span className="font-sans font-medium text-xs text-white drop-shadow-md truncate">
                            {item.title}
                          </span>
                        )}
                        {item.subtitle && (
                          <span className="font-mono text-[10px] text-neutral-300 truncate">
                            {item.subtitle}
                          </span>
                        )}
                      </div>

                      <div className="w-6 h-6 shrink-0 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all shadow-md">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile: Responsive grid with interactive 3D flip support and click-to-inspect (for 3-6 item layouts & flippable flyers) */}
      {(!isTwoItems || hasAnyBackSrc) && (
        <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {displayItems.map((item, index) => {
            const cardKey = item.id || index;
            const hasBackSide = Boolean(item.backSrc);
            const isFlipped = Boolean(flippedCards[cardKey]);

            return (
              <div
                key={cardKey}
                onClick={() => onItemClick?.(item, index)}
                style={{
                  perspective: hasBackSide ? "1200px" : undefined,
                }}
                className={`relative ${isTwoItems ? 'aspect-[16/11] min-h-[260px]' : 'aspect-[16/10]'} w-full overflow-hidden ${rounded} cursor-pointer bg-[#09090d] border border-white/10 active:scale-98 transition-all shadow-md group flex items-center justify-center p-1.5 pb-8`}
              >
                {hasBackSide ? (
                  <div className="relative w-full h-full">
                    {/* Mobile Prominent Flip Button */}
                    <div className="absolute top-2 right-2 z-30 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => toggleCardFlip(cardKey, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-bold text-[10px] shadow-xl transition-all duration-200 cursor-pointer border ${
                          isFlipped
                            ? "bg-emerald-400 text-black border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                            : "bg-amber-400 text-black border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                        }`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span>
                          {item.category?.includes('Logo') || item.category?.includes('Brand')
                            ? (isFlipped ? "CARDS ↻" : "LOGO ↻")
                            : (isFlipped ? "FRONT ↻" : "FLIP BACK ↻")}
                        </span>
                      </button>
                    </div>

                    <div
                      className="relative w-full h-full transition-transform duration-700 ease-out"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      }}
                    >
                      {/* Front Face */}
                      <div
                        className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-[#09090d] p-1.5"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <img
                          src={item.src}
                          alt={item.alt || item.title || ""}
                          loading="lazy"
                          className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center filter brightness-[1.03] contrast-[1.02]"
                        />
                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 shadow-md">
                          <span className="font-mono text-[9px] text-amber-400 font-semibold">
                            {item.category?.includes('Logo') || item.category?.includes('Brand')
                              ? 'Brand Cards'
                              : 'Page 01 · Front'}
                          </span>
                          {item.title && (
                            <span className="font-sans text-[10px] text-white truncate max-w-[130px]">
                              {item.title}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Back Face */}
                      <div
                        className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-[#0e0e14] p-1.5"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <img
                          src={item.backSrc!}
                          alt={`${item.title} (Back)`}
                          loading="lazy"
                          className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center filter brightness-[1.03] contrast-[1.02]"
                        />
                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 shadow-md">
                          <span className="font-mono text-[9px] text-emerald-400 font-semibold">
                            {item.category?.includes('Logo') || item.category?.includes('Brand')
                              ? 'Logo & Meaning'
                              : 'Page 02 · Back'}
                          </span>
                          {item.title && (
                            <span className="font-sans text-[10px] text-white truncate max-w-[130px]">
                              {item.title}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard non-flippable mobile item */
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-20 scale-110 pointer-events-none"
                      style={{ backgroundImage: `url(${item.src})` }}
                    />
                    <img
                      src={item.src}
                      alt={item.alt || item.title || ""}
                      loading="lazy"
                      className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center"
                    />
                    <div className="absolute inset-0 z-15 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                      <span className="font-mono text-[9px] text-amber-400 bg-black/70 px-1.5 py-0.5 rounded">
                        0{index + 1}
                      </span>
                      {item.title && (
                        <span className="font-sans text-[11px] text-white truncate max-w-[180px]">
                          {item.title}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DynamicGridGallery;
