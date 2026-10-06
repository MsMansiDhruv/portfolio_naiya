import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/**
 * Simplified Boat / Path Artwork Component with .yourPath CSS styling:
 * stroke-width: 10px; stroke: red;
 * Animated via GSAP DrawSVGPlugin.
 */
export function TechnicalSailboat() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const svg = svgRef.current
    if (!container || !svg || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const paths = svg.querySelectorAll<SVGPathElement>('.yourPath')
      if (paths.length === 0) return

      // Set initial draw state
      gsap.set(paths, { drawSVG: '0% 0%', opacity: 1 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        },
      })

      // Sequence: hull → mast → sail → rigging → details → guides
      tl.to(svg.querySelectorAll('.yourPath.hull'), {
        drawSVG: '0% 100%',
        duration: 1.0,
        stagger: 0.12,
        ease: 'power2.out',
      })
        .to(
          svg.querySelectorAll('.yourPath.mast'),
          {
            drawSVG: '0% 100%',
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '-=0.15',
        )
        .to(
          svg.querySelectorAll('.yourPath.sail'),
          {
            drawSVG: '0% 100%',
            duration: 1.1,
            stagger: 0.12,
            ease: 'power2.inOut',
          },
          '-=0.15',
        )
        .to(
          svg.querySelectorAll('.yourPath.rigging'),
          {
            drawSVG: '0% 100%',
            duration: 0.9,
            stagger: 0.08,
            ease: 'power1.out',
          },
          '-=0.15',
        )
        .to(
          svg.querySelectorAll('.yourPath.details'),
          {
            drawSVG: '0% 100%',
            duration: 0.8,
            stagger: 0.06,
            ease: 'power2.out',
          },
          '-=0.15',
        )
        .to(
          svg.querySelectorAll('.yourPath.guides'),
          {
            drawSVG: '0% 100%',
            duration: 1.2,
            stagger: 0.05,
            ease: 'power1.inOut',
          },
          '-=0.15',
        )
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="technical-sailboat-wrapper relative w-full bg-transparent text-red-500 p-4 sm:p-6 border border-red-500/20 rounded-2xl backdrop-blur-md overflow-hidden font-mono"
      aria-label="Red Stroke Boat Drawing"
    >
      {/* Explicit CSS declaration for .yourPath as requested */}
      <style>{`
        .yourPath {
          stroke-width: 10px;
          stroke: red;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-red-500/20 pb-2.5 mb-3 text-[0.68rem] uppercase tracking-widest text-red-500">
        <div className="flex items-center gap-2 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          VECTOR STROKE ART ✦ .yourPath
        </div>
        <span className="text-red-400/80 font-mono">10PX RED STROKE</span>
      </div>

      {/* Responsive Inline SVG with .yourPath & stroke="red" stroke-width="10px" */}
      <div className="relative z-10 w-full overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 700 480"
          className="w-full h-auto max-h-[340px] overflow-visible"
          aria-hidden="true"
        >
          {/* —— 1. CONSTRUCTION GUIDES (.guides) —— */}
          <g className="guides-group">
            <path
              className="yourPath guides"
              d="M 40 435 L 660 435"
              stroke-width="10px"
              stroke="red"
            />
            <path
              className="yourPath guides"
              d="M 345 30 L 345 450"
              stroke-width="10px"
              stroke="red"
            />
          </g>

          {/* —— 2. HULL GEOMETRY (.hull) —— */}
          <g className="hull-group">
            <path
              className="yourPath hull"
              d="M 80 280 C 180 340, 480 340, 600 290 L 615 280 Z"
              stroke-width="10px"
              stroke="red"
            />
            <path
              className="yourPath hull"
              d="M 320 325 L 340 420 L 410 420 L 390 325 Z"
              stroke-width="10px"
              stroke="red"
            />
          </g>

          {/* —— 3. MAST & SPARS (.mast) —— */}
          <g className="mast-group">
            <path
              className="yourPath mast"
              d="M 345 280 L 340 45"
              stroke-width="10px"
              stroke="red"
            />
            <path
              className="yourPath mast"
              d="M 345 266 L 575 272"
              stroke-width="10px"
              stroke="red"
            />
          </g>

          {/* —— 4. SAILS (.sail) —— */}
          <g className="sail-group">
            <path
              className="yourPath sail"
              d="M 344 55 Q 470 160 570 265 L 345 265 Z"
              stroke-width="10px"
              stroke="red"
            />
            <path
              className="yourPath sail"
              d="M 338 72 Q 220 180 100 276 L 338 276 Z"
              stroke-width="10px"
              stroke="red"
            />
          </g>

          {/* —— 5. RIGGING & STAYS (.rigging) —— */}
          <g className="rigging-group">
            <path
              className="yourPath rigging"
              d="M 340 48 L 95 278"
              stroke-width="10px"
              stroke="red"
            />
            <path
              className="yourPath rigging"
              d="M 340 48 L 605 280"
              stroke-width="10px"
              stroke="red"
            />
          </g>

          {/* —— 6. TECHNICAL DETAILS (.details) —— */}
          <g className="details-group">
            <path
              className="yourPath details"
              d="M 560 262 A 12 12 0 1 0 560 286"
              stroke-width="10px"
              stroke="red"
            />
          </g>
        </svg>
      </div>

      {/* Footer Meta */}
      <div className="relative z-10 flex items-center justify-between border-t border-red-500/20 pt-2 mt-3 text-[0.65rem] text-red-400">
        <span>CSS STROKE: .yourPath &#123; stroke-width: 10px; stroke: red; &#125;</span>
        <span>GSAP DRAWSVG</span>
      </div>
    </div>
  )
}
