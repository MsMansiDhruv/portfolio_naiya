import { useEffect, useRef, useState } from 'react'
import { SELECTED_WORK, type WorkPiece } from '../data/portfolio'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { ImageLightbox } from './ImageLightbox'
import '../styles/work-revamp.css'

export function WorkGSAPRevamp() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const cardsRef = useRef<Array<HTMLElement | null>>([])
  const [expandedPiece, setExpandedPiece] = useState<WorkPiece | null>(null)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLElement[]
      if (cards.length === 0) return

      const firstCard = cards[0]
      const cardWidth = firstCard.offsetWidth
      const secondCard = cards[1]
      
      // Calculate exact distance step between centers of consecutive cards
      const step = secondCard ? secondCard.offsetLeft - firstCard.offsetLeft : cardWidth + 48

      // Formula for 100% Dead-Center Alignment (accounting for 120px left rail):
      const getInitialOffset = () => {
        const availableWidth = window.innerWidth >= 1024 ? window.innerWidth - 120 : window.innerWidth
        return (availableWidth / 2) - (cardWidth / 2)
      }

      // Set initial x position so 1st card starts dead-center
      gsap.set(track, { x: getInitialOffset() })

      // 2. Total horizontal distance to travel so last card ends up dead-center
      const getTotalDistance = () => (cards.length - 1) * step

      // 3. Primary Horizontal Scroll Tween — ease: "none" is REQUIRED by GSAP
      const scrollTween = gsap.to(track, {
        x: () => getInitialOffset() - getTotalDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getTotalDistance() * 1.2}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressFillRef.current) {
              progressFillRef.current.style.width = `${self.progress * 100}%`
            }
            const activeIdx = Math.min(
              cards.length - 1,
              Math.max(0, Math.round(self.progress * (cards.length - 1))),
            )
            if (counterRef.current) {
              counterRef.current.textContent = String(activeIdx + 1).padStart(2, '0')
            }
          },
        },
      })

      // 4. Child Card 3D Animations tied to Horizontal Progress via containerAnimation
      cards.forEach((card, i) => {
        // Entrance: rotate in as card approaches screen center (50%)
        if (i > 0) {
          gsap.fromTo(
            card,
            {
              rotateY: 28,
              scale: 0.86,
              opacity: 0.45,
            },
            {
              rotateY: 0,
              scale: 1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween, // OFFICIAL GSAP CONTAINER ANIMATION
                start: 'center 88%',
                end: 'center 50%', // Dead Center (50%)
                scrub: true,
              },
            },
          )
        }

        // Exit: rotate out as card moves left past screen center (50%)
        gsap.to(card, {
          rotateY: -28,
          scale: 0.86,
          opacity: 0.45,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: 'center 50%', // Starts exiting right at Dead Center (50%)
            end: 'center 12%',
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
      className="work-revamp-section"
      aria-label="Selected Work — GSAP Centered Horizontal Gallery"
    >
      {/* Header Controls */}
      <div className="work-revamp-header">
        <div className="work-revamp-title-group">
          <span className="work-revamp-kicker">
            SELECTED CASE STUDIES · CENTERED GALLERY
          </span>
          <h2 className="work-revamp-title">Selected Work.</h2>
        </div>

        <div className="work-revamp-progress-wrap">
          <div className="work-revamp-progress-bar">
            <div ref={progressFillRef} className="work-revamp-progress-fill" />
          </div>
          <div className="work-revamp-counter">
            <span ref={counterRef}>01</span> / {String(SELECTED_WORK.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* 3D Stage & Centered Horizontal Track */}
      <div className="work-revamp-stage">
        <div ref={trackRef} className="work-revamp-track">
          {SELECTED_WORK.map((piece, i) => (
            <article
              key={piece.id}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              className="work-revamp-card"
              onClick={() => setExpandedPiece(piece)}
            >
              <div className="work-revamp-card__media">
                <img
                  src={piece.cover}
                  alt={piece.title}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
              <div className="work-revamp-card__scrim" />

              <div className="work-revamp-card__content">
                <div className="work-revamp-card__top">
                  <span className="work-revamp-card__badge">{piece.role}</span>
                  <span className="work-revamp-card__year">
                    ’{piece.year.slice(-2)}
                  </span>
                </div>

                <div className="work-revamp-card__bottom">
                  <span className="work-revamp-card__index">
                    CASE 0{i + 1}
                  </span>
                  <h3 className="work-revamp-card__title">{piece.title}</h3>
                  {piece.blurb && (
                    <p className="work-revamp-card__blurb">{piece.blurb}</p>
                  )}
                  <div className="work-revamp-card__cta">
                    <span>Inspect Project</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Footer Hint */}
      <div className="work-revamp-footer">
        <div className="work-revamp-hint">
          Scroll down to browse horizontal deck
        </div>
        <div className="text-xs text-white/40 tracking-wider">
          CLICK CARD FOR CASE BEATS
        </div>
      </div>

      {/* Instant High-Performance Case Detail Modal Drawer */}
      {expandedPiece && (
        <div
          className="work-deck-drawer fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md will-change-transform animate-fade-in"
          onClick={() => setExpandedPiece(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="work-deck-drawer__content relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#111216] border border-[var(--gold-soft)] rounded-3xl p-6 md:p-10 shadow-2xl"
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

            {/* Clickable Cover Image (Async decoded for instant view) */}
            <div
              className="relative rounded-2xl overflow-hidden mb-8 border border-white/15 cursor-pointer group bg-[#18191e]"
              onClick={() => setLightboxImage(expandedPiece.cover)}
            >
              <img
                src={expandedPiece.cover}
                alt={expandedPiece.title}
                decoding="async"
                loading="eager"
                className="w-full max-h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold border border-white/30">
                  🔍 View Full Size
                </span>
              </div>
            </div>

            {/* Gallery Images Grid (Async decoded & lazy loaded) */}
            {expandedPiece.gallery && expandedPiece.gallery.length > 0 && (
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3">
                  GALLERY PREVIEWS (CLICK TO ENLARGE)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {expandedPiece.gallery.slice(0, 4).map((imgSrc, i) => (
                    <div
                      key={i}
                      className="relative rounded-xl overflow-hidden border border-white/10 cursor-pointer group bg-[#18191e]"
                      onClick={() => setLightboxImage(imgSrc)}
                    >
                      <img
                        src={imgSrc}
                        alt=""
                        decoding="async"
                        loading="lazy"
                        className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30">
                          🔍 Full Size
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Full-Size Image Lightbox Viewer */}
      <ImageLightbox
        src={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </section>
  )
}
