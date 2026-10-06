import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

type SectionBridgeProps = {
  children: ReactNode
}

/**
 * GSAP Scroll-Driven Section Bridge with MotionPath particle gliding & DrawSVG stroke drawing.
 */
export function SectionBridge({ children }: SectionBridgeProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const sparkRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const text = textRef.current
    const path = pathRef.current
    const spark = sparkRef.current
    if (!root || !text || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      // 1. Text marquee scrub
      gsap.fromTo(
        text,
        {
          xPercent: 12,
          scale: 0.92,
          opacity: 0.4,
          letterSpacing: '-0.04em',
        },
        {
          xPercent: -12,
          scale: 1.05,
          opacity: 1,
          letterSpacing: '0.04em',
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      )

      // 2. DrawSVG stroke reveal
      if (path) {
        gsap.fromTo(
          path,
          { drawSVG: '0% 0%' },
          {
            drawSVG: '0% 100%',
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top 90%',
              end: 'bottom 20%',
              scrub: 1,
            },
          },
        )
      }

      // 3. MotionPath particle gliding along path
      if (spark && path) {
        gsap.to(spark, {
          motionPath: {
            path: path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={rootRef}
      className="section-bridge relative overflow-hidden py-20 my-16 border-y border-[#e2b872]/20 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_70%)]"
      role="presentation"
    >
      {/* MotionPath SVG Curve & DrawSVG Line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d="M 0 60 Q 300 10 600 60 T 1200 60"
          fill="none"
          stroke="url(#bridgeGrad)"
          strokeWidth="2"
        />
        <circle
          ref={sparkRef}
          r="5"
          fill="#e2b872"
          className="shadow-lg shadow-[#e2b872]"
        />
        <defs>
          <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#e2b872" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="w-full text-center overflow-hidden relative z-10">
        <h2
          ref={textRef}
          className="section-bridge__title font-display text-4xl md:text-7xl font-light tracking-tight text-white/90 will-change-transform whitespace-nowrap"
        >
          {children}
        </h2>
      </div>
    </div>
  )
}
