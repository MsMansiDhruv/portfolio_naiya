import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const section = sectionRef.current
    const card = cardRef.current
    if (!section || !card) return

    const ctx = gsap.context(() => {
      // 1. 3D Perspective Card Flip Scrub
      gsap.fromTo(
        card,
        {
          rotateX: 20,
          rotateY: -12,
          translateZ: -150,
          scale: 0.9,
          opacity: 0.4,
        },
        {
          rotateX: 0,
          rotateY: 0,
          translateZ: 0,
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1,
          },
        },
      )

      // 2. Line-by-Line Stagger Reveal for Headline
      const lines = linesRef.current.filter(Boolean) as HTMLSpanElement[]
      if (lines.length > 0) {
        gsap.fromTo(
          lines,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section py-24 bg-[#090d16] relative overflow-hidden text-[#e0f2fe]"
      aria-labelledby="about-heading"
      style={{ perspective: '1200px' }}
    >
      <div className="page-wrap max-w-5xl mx-auto px-6">
        <div
          ref={cardRef}
          className="about-panel p-8 md:p-14 rounded-3xl bg-[#0d1322] border border-[#06b6d4]/25 shadow-2xl backdrop-blur-xl will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <h2
            id="about-heading"
            className="section-title font-display text-4xl md:text-6xl font-light tracking-tight text-[#e0f2fe] leading-[1.05] mb-8 overflow-hidden"
          >
            <span
              ref={(el) => {
                linesRef.current[0] = el
              }}
              className="about-line block will-change-transform"
            >
              A LITTLE ABOUT
            </span>
            <span
              ref={(el) => {
                linesRef.current[1] = el
              }}
              className="about-line block will-change-transform text-slate-300"
            >
              THE PERSON BEHIND
            </span>
            <em
              ref={(el) => {
                linesRef.current[2] = el
              }}
              className="about-line block text-[#06b6d4] font-serif italic not-italic will-change-transform"
            >
              THE PIXELS.
            </em>
          </h2>

          <div className="space-y-4 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mb-10 font-light">
            <p>
              Independent Visual Architect crafting brand identity systems, physical surfaces, and interactive 3D WebGL experiences.
            </p>
            <p>
              I work across brand systems, packaging, editorial surfaces, and WebGL code — wherever an idea demands a crisp visual language.
            </p>
          </div>

          <dl className="about-facts grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10 font-mono">
            <div>
              <dt className="text-xs uppercase tracking-widest text-[#06b6d4] mb-1.5">Based</dt>
              <dd className="text-sm md:text-base font-medium text-[#e0f2fe]">Studio ✦ Remote</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-[#06b6d4] mb-1.5">Focus</dt>
              <dd className="text-sm md:text-base font-medium text-[#e0f2fe]">Brand · 3D · WebGL</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-[#06b6d4] mb-1.5">Availability</dt>
              <dd className="text-sm md:text-base font-medium text-[#e0f2fe]">Q3/Q4 Commissions</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-[#06b6d4] mb-1.5">Honors</dt>
              <dd className="text-sm md:text-base font-medium text-[#e0f2fe]">Awwwards · Selected</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
