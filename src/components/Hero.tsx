import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { VectorGraphicArt } from './VectorGraphicArt'

const DISCIPLINES = [
  'VISUAL ART DIRECTION',
  'BRAND SYSTEM ARCHITECTURE',
  'VECTOR GRAPHIC SYSTEMS',
  '3D WEBGL SURFACES',
]

/**
 * Professional Executive Graphic Designer Hero.
 * OLED Graphite & Champagne Gold palette with responsive bounds and zero overflow.
 */
export function Hero() {
  const introRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const [disciplineIndex, setDisciplineIndex] = useState(0)

  // Rotating title ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setDisciplineIndex((prev) => (prev + 1) % DISCIPLINES.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  // Magnetic CTA physics
  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const cleanups: Array<() => void> = []

    actionsRef.current?.querySelectorAll<HTMLElement>('a').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        xTo(nx * 8)
        yTo(ny * 6)
      }
      const onLeave = () => {
        xTo(0)
        yTo(0)
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
        gsap.set(el, { x: 0, y: 0 })
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <section
      id="hero-scroll"
      className="relative min-h-[100dvh] w-full flex flex-col justify-between pt-8 lg:pt-12 pb-12 px-4 sm:px-6 lg:px-12 bg-[#080a0f] text-[#f1f5f9] overflow-hidden max-w-full"
      aria-label="Studio Intro"
    >
      {/* Ambient Grid Overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Eyebrow Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#c5a059]/20 pb-4 max-w-7xl mr-auto ml-0 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b26] border border-[#c5a059]/30 text-xs font-mono text-[#c5a059]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
          NAIYA STUDIO ✦ GRAPHIC &amp; VISUAL ARCHITECTURE
        </div>
        <span className="text-xs font-mono tracking-widest text-slate-400">
          SELECTED COMMISSIONS 2026
        </span>
      </div>

      {/* Main Hero Display Typography & Vector Artwork Split */}
      <div ref={introRef} className="relative z-10 my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-7xl mr-auto ml-0 w-full">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7">
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-extrabold tracking-tighter uppercase leading-none mb-4 break-words">
            <span className="text-[#f1f5f9]">
              NAIYA
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-lg sm:text-2xl font-light text-slate-300 tracking-tight">
            <span className="text-[#c5a059] font-serif italic">Mastering</span>
            <span className="h-[1.3em] overflow-hidden inline-block font-mono text-[#c5a059] border-b border-[#c5a059]/40 pb-0.5 max-w-full">
              <span
                key={disciplineIndex}
                className="inline-block transition-transform duration-500 ease-out animate-fade-in truncate"
              >
                {DISCIPLINES[disciplineIndex]}
              </span>
            </span>
          </div>

          <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed font-light">
            Independent Visual Architect crafting brand identity systems, vector graphic structures, and 3D WebGL interfaces.
          </p>

          {/* Magnetic Action Pills */}
          <div
            ref={actionsRef}
            className="flex flex-wrap items-center gap-4 mt-8"
          >
            <a
              href="#work"
              className="group px-6 py-3 rounded-full bg-[#c5a059] text-[#080a0f] font-semibold text-xs uppercase tracking-wider hover:bg-white transition-all duration-300 shadow-xl shadow-[#c5a059]/20 flex items-center gap-2 whitespace-nowrap"
            >
              <span>Explore Selected Works</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                ↗
              </span>
            </a>

            <a
              href="#lab3d"
              className="px-6 py-3 rounded-full bg-[#161b26] border border-[#c5a059]/30 text-[#f1f5f9] font-medium text-xs uppercase tracking-wider hover:bg-[#222a3a] transition-all duration-300 backdrop-blur-xl flex items-center gap-2 whitespace-nowrap"
            >
              <span>Launch Particle Lab</span>
              <span className="text-[#c5a059]">✦</span>
            </a>
          </div>
        </div>

        {/* Right Column: Custom Bézier Vector Artwork Illustration */}
        <div className="lg:col-span-5 w-full max-w-full overflow-hidden">
          <VectorGraphicArt />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs font-mono text-slate-400 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
          <span>AVAILABLE FOR SELECT COMMISSIONS</span>
        </div>
        <span>WORLDWIDE REMOTE ✦ STUDIO</span>
      </div>
    </section>
  )
}
