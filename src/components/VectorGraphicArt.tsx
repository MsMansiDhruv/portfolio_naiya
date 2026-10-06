import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/**
 * Custom Vector Graphic Designer Artwork Component.
 * Features animated Bézier curve pen tools, control node handles, and CMYK color plates.
 * Animated dynamically with GSAP DrawSVG & ScrollTrigger.
 */
export function VectorGraphicArt() {
  const svgRef = useRef<SVGSVGElement>(null)
  const curvePathRef = useRef<SVGPathElement>(null)
  const penGroupRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    const curvePath = curvePathRef.current
    const penGroup = penGroupRef.current
    if (!svg || !curvePath || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      // 1. DrawSVG Bézier Path Reveal
      gsap.fromTo(
        curvePath,
        { drawSVG: '0% 0%' },
        {
          drawSVG: '0% 100%',
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: svg,
            start: 'top 85%',
            end: 'bottom 40%',
            scrub: 1,
          },
        },
      )

      // 2. MotionPath Pen Tool tracking along Bézier curve
      if (penGroup) {
        gsap.to(penGroup, {
          motionPath: {
            path: curvePath,
            align: curvePath,
            alignOrigin: [0.1, 0.9],
            autoRotate: true,
          },
          scrollTrigger: {
            trigger: svg,
            start: 'top 85%',
            end: 'bottom 40%',
            scrub: 1,
          },
        })
      }
    }, svg)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative w-full max-w-xl mx-auto my-8 p-6 rounded-3xl bg-[#0d1322]/80 border border-[#06b6d4]/30 backdrop-blur-xl shadow-2xl shadow-[#06b6d4]/10 overflow-hidden">
      {/* Background Micro Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.06)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs font-mono text-[#06b6d4]">
        <span>✦ BÉZIER CURVE VECTOR ENGINE</span>
        <span className="text-slate-400">CMYK 100% REGISTRATION</span>
      </div>

      {/* Vector Canvas */}
      <svg
        ref={svgRef}
        viewBox="0 0 500 220"
        className="w-full h-auto overflow-visible relative z-10"
        aria-hidden="true"
      >
        {/* Alignment Baseline */}
        <line
          x1="20"
          y1="110"
          x2="480"
          y2="110"
          stroke="rgba(224, 242, 254, 0.15)"
          strokeDasharray="4 4"
        />

        {/* Animated Bézier Curve */}
        <path
          ref={curvePathRef}
          d="M 40 160 C 140 10 360 210 460 60"
          fill="none"
          stroke="url(#bezierGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Bézier Node Control Points */}
        <g className="nodes">
          {/* Node 1 */}
          <circle cx="40" cy="160" r="5" fill="#06b6d4" stroke="#090d16" strokeWidth="2" />
          <line x1="40" y1="160" x2="90" y2="85" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="90" cy="85" r="3.5" fill="#a855f7" />

          {/* Node 2 */}
          <circle cx="460" cy="60" r="5" fill="#06b6d4" stroke="#090d16" strokeWidth="2" />
          <line x1="460" y1="60" x2="410" y2="135" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="410" cy="135" r="3.5" fill="#a855f7" />
        </g>

        {/* Vector Pen Icon tracking along path */}
        <g ref={penGroupRef} className="pen-tool pointer-events-none">
          <path
            d="M0 0 L14 -22 L22 -14 L0 0 Z M14 -22 L26 -34 L34 -26 L22 -14 Z"
            fill="#06b6d4"
            stroke="#e0f2fe"
            strokeWidth="1.5"
          />
          <circle cx="0" cy="0" r="2.5" fill="#ec4899" />
        </g>

        <defs>
          <linearGradient id="bezierGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* CMYK Color Swatch Overlay */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 mt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            <span className="w-5 h-5 rounded-full bg-[#06b6d4] opacity-90 ring-1 ring-white/20" title="Cyan" />
            <span className="w-5 h-5 rounded-full bg-[#ec4899] opacity-90 ring-1 ring-white/20" title="Magenta" />
            <span className="w-5 h-5 rounded-full bg-[#facc15] opacity-90 ring-1 ring-white/20" title="Yellow" />
            <span className="w-5 h-5 rounded-full bg-[#0f172a] opacity-90 ring-1 ring-white/20" title="Key Black" />
          </div>
          <span className="text-xs font-mono text-slate-300">CMYK COLOR PROFILES</span>
        </div>
        <span className="text-xs font-mono text-[#a855f7]">300 DPI VECTOR READY</span>
      </div>
    </div>
  )
}
