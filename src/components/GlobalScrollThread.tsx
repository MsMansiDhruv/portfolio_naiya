import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function GlobalScrollThread() {
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pathRef.current || !dotRef.current) return

    const length = pathRef.current.getTotalLength()
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length })

    // Animate the golden thread
    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1
      }
    })

    // Animate the tracking dot
    gsap.to(dotRef.current, {
      top: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1
      }
    })
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed top-0 right-4 md:right-12 bottom-0 w-[4px] z-50 pointer-events-none flex flex-col items-center mix-blend-difference hidden md:flex"
    >
      <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 10 100">
        <path
          d="M5 0 Q2 10 5 20 T5 40 T5 60 T5 80 T5 100"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={pathRef}
          d="M5 0 Q2 10 5 20 T5 40 T5 60 T5 80 T5 100"
          stroke="#D4AF37"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
        />
      </svg>
      <div 
        ref={dotRef} 
        className="absolute top-0 w-3 h-3 rounded-full bg-amber-400 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(251,191,36,0.9)]" 
      />
    </div>
  )
}
