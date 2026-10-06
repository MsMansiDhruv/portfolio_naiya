import { useEffect, useRef, useState } from 'react'
import { SELECTED_WORK, type WorkPiece } from '../data/portfolio'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import '../styles/work-deck-3d.css'

export function WorkGSAPHorizontal() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<Array<HTMLDivElement | null>>([])
  const [expandedPiece, setExpandedPiece] = useState<WorkPiece | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]
      if (cards.length === 0) return

      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth
        const viewportWidth = window.innerWidth
        return Math.max(0, trackWidth - viewportWidth + 240)
      }

      // GSAP Timeline — section is strictly PINNED until horizontal browsing finishes
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getScrollAmount() * 1.5 + 400}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Horizontal track translate scrub
      tl.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
      })

      // 3D Flipping & scale scrub for each card relative to horizontal progress
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            rotateY: 38,
            translateZ: -160,
            scale: 0.82,
            opacity: 0.45,
          },
          {
            rotateY: 0,
            translateZ: 120,
            scale: 1.06,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: 'left 85%',
              end: 'left 35%',
              scrub: true,
            },
          },
        )

        gsap.to(card, {
          rotateY: -38,
          translateZ: -160,
          scale: 0.82,
          opacity: 0.45,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: card,
            containerAnimation: tl,
            start: 'right 45%',
            end: 'right 15%',
            scrub: true,
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="work-deck-section relative overflow-hidden bg-[#070709] py-16 min-h-screen"
      aria-label="GSAP Horizontal Pinned Work Section"
    >
      <div className="work-deck-head text-center mb-8 z-10 px-4">
        <p className="work-deck-kicker text-xs font-semibold tracking-widest text-[var(--gold)] uppercase mb-2">
          HORIZONTAL GALLERY · PINNED UNTIL BROWSED
        </p>
        <h2 className="work-deck-title text-4xl md:text-6xl font-medium tracking-tight text-white mb-3">
          Engineered for Forward Motion
        </h2>
        <p className="work-deck-subtitle text-base text-white/60 max-w-lg mx-auto">
          Scroll down to browse horizontally through all case studies before unpinning.
        </p>
      </div>

      <div className="w-full overflow-hidden flex items-center min-h-[500px]">
        <div
          ref={trackRef}
          className="flex items-center gap-12 px-20 will-change-transform"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {SELECTED_WORK.map((piece, index) => (
            <div
              key={piece.id}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              className="work-deck-card flex-shrink-0 w-[340px] h-[480px] rounded-2xl bg-[#121316] border border-white/15 overflow-hidden shadow-2xl transition-all duration-300 hover:border-[var(--gold)] cursor-pointer"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
              onClick={() => setExpandedPiece(piece)}
            >
              <div className="work-deck-card__surface relative w-full h-full p-8 flex flex-col justify-between">
                <div className="work-deck-card__media absolute inset-0 z-0">
                  <img
                    src={piece.cover}
                    alt={piece.title}
                    className="w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="work-deck-card__overlay absolute inset-0 z-1" />

                <div className="work-deck-card__header relative z-10 flex justify-between items-start">
                  <span className="work-deck-card__tag text-xs font-bold tracking-wider uppercase text-[var(--gold)] bg-black/60 px-3 py-1 rounded-full border border-[var(--gold-soft)]">
                    {piece.role}
                  </span>
                  <span className="work-deck-card__year text-2xl font-bold text-white/40">
                    ’{piece.year.slice(-2)}
                  </span>
                </div>

                <div className="work-deck-card__footer relative z-10">
                  <span className="work-deck-card__role text-xs uppercase tracking-widest text-white/70 block mb-1">
                    PROJECT #{String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="work-deck-card__title text-2xl font-semibold text-white mb-3">
                    {piece.title}
                  </h3>
                  <div className="work-deck-card__action flex items-center gap-2 text-sm font-semibold text-[var(--gold)]">
                    <span>Inspect Case</span>
                    <span>↗</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Case Detail Modal Drawer */}
      {expandedPiece && (
        <div
          className="work-deck-drawer fixed inset-0 z-[9999] flex items-center justify-center p-8 bg-black/85 backdrop-blur-xl"
          onClick={() => setExpandedPiece(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="work-deck-drawer__content relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#111216] border border-[var(--gold-soft)] rounded-3xl p-10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="work-deck-drawer__close absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-lg hover:bg-white hover:text-black transition-all"
              onClick={() => setExpandedPiece(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <span className="text-xs font-bold tracking-widest uppercase text-[var(--gold)]">
              {expandedPiece.year} · {expandedPiece.role}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white my-3">
              {expandedPiece.title}
            </h2>
            {expandedPiece.blurb && (
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl">
                {expandedPiece.blurb}
              </p>
            )}

            {expandedPiece.gallery && expandedPiece.gallery.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {expandedPiece.gallery.slice(0, 4).map((imgSrc, i) => (
                  <img
                    key={i}
                    src={imgSrc}
                    alt=""
                    className="w-full aspect-[4/3] rounded-xl object-cover border border-white/10"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
