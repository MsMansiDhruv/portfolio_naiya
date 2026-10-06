import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-stagger',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 text-[#0a0a0a] overflow-hidden"
    >
      {/* Top Header / Metadata Grid */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#0a0a0a]/15 pb-4 font-mono text-xs uppercase tracking-widest">
        <div className="hero-stagger flex items-center gap-3">
          <span className="crop-mark text-[#0a0a0a]" />
          <span>SYS_ID: ND-2026</span>
          <span className="text-[#0038ff]">✦ EDITORIAL MESH</span>
        </div>
        <div className="hero-stagger flex items-center gap-6">
          <span>CREATIVE DIRECTION &amp; BRAND ARCHITECTURE</span>
          <span className="hidden sm:inline-block text-[#0a0a0a]/40">LAT: 23°01′N · LON: 72°35′E</span>
        </div>
      </div>

      {/* Main Asymmetric Hero Typography & Graphic Grid */}
      <div className="relative z-10 my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl">
        {/* Left Column: Typography & Sub-line */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="hero-stagger inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#0038ff] uppercase">
            <span className="w-2 h-2 bg-[#0038ff]" />
            01 / ENTER THE SYSTEM
          </div>

          <h1
            ref={titleRef}
            className="hero-stagger font-display text-6xl sm:text-8xl lg:text-9xl font-extrabold tracking-tighter uppercase leading-[0.88] text-[#0a0a0a]"
          >
            NAIYA <br />
            <span className="text-stroke text-transparent stroke-black stroke-2 hover:text-[#0038ff] transition-colors">
              DHRUV
            </span>
          </h1>

          <div className="hero-stagger flex flex-wrap items-center gap-3 font-mono text-sm sm:text-base text-[#4a4a4a] pt-2">
            <span className="font-extrabold text-[#0a0a0a] uppercase tracking-wider">
              GRAPHIC DESIGNER
            </span>
            <span className="text-[#0038ff]">•</span>
            <span className="tracking-widest">Identity / Campaigns / Print / Digital</span>
          </div>
        </div>

        {/* Right Column: Physical Graphic Composition Card */}
        <div className="lg:col-span-4 relative">
          <div className="hero-stagger acetate-panel p-6 rounded-lg relative overflow-hidden border border-[#0a0a0a]/20 shadow-2xl">
            {/* Cobalt Accent Box */}
            <div className="w-12 h-3 bg-[#0038ff] mb-4" />

            <div className="aspect-[4/5] bg-[#f0ebd9] relative overflow-hidden mb-4 border border-[#0a0a0a]/10">
              <img
                src="/work/vi-oil/cover.jpg"
                alt="Naiya Dhruv Visual Architecture"
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
              />
              {/* Crop mark overlay */}
              <span className="absolute top-2 left-2 crop-mark text-[#0a0a0a]" />
              <span className="absolute top-2 right-2 crop-mark text-[#0a0a0a]" />
              <span className="absolute bottom-2 left-2 crop-mark text-[#0a0a0a]" />
              <span className="absolute bottom-2 right-2 crop-mark text-[#0a0a0a]" />
            </div>

            <div className="flex justify-between items-end font-mono text-[0.7rem] uppercase tracking-widest text-[#0a0a0a]">
              <div>
                <p className="font-bold">SPEC_SHEET 01</p>
                <p className="text-[#737373]">TRANSLUCENT ACETATE</p>
              </div>
              <span className="text-[#0038ff] font-bold">POS: 0.0 Z</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-10 flex justify-between items-end border-t border-[#0a0a0a]/15 pt-4 font-mono text-xs tracking-widest text-[#737373]">
        <div className="hero-stagger flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#0038ff] animate-pulse" />
          <span className="text-[#0038ff]">↓</span>
          <span>SCROLL TO MOVE THROUGH THE MESH</span>
        </div>
        <div className="hero-stagger hidden sm:block">
          <span>01 / 06 — SYSTEM LOADED</span>
        </div>
      </div>
    </section>
  )
}
