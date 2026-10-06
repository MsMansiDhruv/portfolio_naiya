import { useEffect, useRef } from 'react'
import { SELECTED_WORK, type WorkPiece } from '../data/portfolio'

/**
 * Horizontal Scrolling Work Section
 * Inspired by storytelling portfolio sites like Sleep Well Creatives
 *
 * Features:
 * - Horizontal scroll through case studies
 * - Each case shows image, meta, title, description
 * - Sticky header that stays in view
 */
export function WorkHorizontal() {
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top
      const sectionHeight = section.offsetHeight
      const viewportHeight = window.innerHeight

      // Calculate scroll progress through the section (0 to 1)
      const scrollProgress = Math.max(0, Math.min(1,
        -sectionTop / (sectionHeight - viewportHeight)
      ))

      // Calculate maximum translate distance
      const trackWidth = track.scrollWidth
      const viewportWidth = window.innerWidth
      const maxTranslate = -(trackWidth - viewportWidth)

      track.style.transform = `translateX(${maxTranslate * scrollProgress}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work-horizontal"
      className="relative h-[300vh] overflow-hidden bg-[var(--bg)]"
      aria-label="Selected Work — Horizontal"
    >
      {/* Sticky container that stays visible */}
      <div className="sticky top-0 h-[100vh] flex items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 px-8 will-change-transform"
          style={{ paddingLeft: 'max(2rem, 4vw)', paddingRight: 'max(2rem, 4vw)' }}
        >
          {SELECTED_WORK.map((piece) => (
            <CaseCard key={piece.id} piece={piece} />
          ))}
        </div>
      </div>
    </section>
  )
}

function getCategoryLabel(id: string): string {
  const map: Record<string, string> = {
    'social-systems': 'Social Media',
    'vi-oil': 'Print Media',
    'kavach': 'Logo & Branding',
    'vadiyar-pack': 'Packaging',
    'pitch-print': 'Pitch Decks',
  }
  return map[id] || 'Portfolio'
}

function getSubcategoryLabel(id: string): string {
  const map: Record<string, string> = {
    'social-systems': 'Social media, Paid ads',
    'vi-oil': 'Banner, Flyers, Standee',
    'kavach': 'Logo System, Brand Identity',
    'vadiyar-pack': 'Macro fuel packaging',
    'pitch-print': 'Pitch presentations, Print collateral',
  }
  return map[id] || ''
}

function CaseCard({ piece }: { piece: WorkPiece }) {
  return (
    <article
      className="flex-shrink-0 w-[80vw] max-w-[1000px] bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12 shadow-sm"
    >
      <div
        className="aspect-[4/3] bg-gradient-to-br from-[var(--gold)] to-[var(--gold-deep)] rounded-xl overflow-hidden relative"
      >
        <img
          src={piece.cover}
          alt={piece.title}
          className="w-full h-full object-cover opacity-60"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-xs font-mono uppercase tracking-wider mb-1">
            {getCategoryLabel(piece.id)}
          </p>
          <p className="text-white/80 text-xs font-medium">
            {getSubcategoryLabel(piece.id)}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <p className="mono text-[var(--gold-deep)] mb-3">
          {piece.year} · {piece.role}
        </p>
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[var(--ink-soft)] mb-4 leading-tight">
          {piece.title}
        </h2>
        <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-6 max-w-lg">
          {piece.blurb}
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 text-[var(--ink)] font-medium hover:gap-3 transition-all duration-300 group"
        >
          View Case Study
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </article>
  )
}
