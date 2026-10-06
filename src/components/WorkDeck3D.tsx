import { useCallback, useEffect, useRef, useState } from 'react'
import { SELECTED_WORK, type WorkPiece } from '../data/portfolio'
import '../styles/work-deck-3d.css'

export function WorkDeck3D() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedPiece, setExpandedPiece] = useState<WorkPiece | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef<number>(0)
  const currentXRef = useRef<number>(0)
  const total = SELECTED_WORK.length

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => Math.min(prev + 1, total - 1))
  }, [total])

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextCard()
      if (e.key === 'ArrowLeft') prevCard()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextCard, prevCard])

  // Wheel scroll navigation inside stage
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (e.deltaX > 20) nextCard()
        if (e.deltaX < -20) prevCard()
      } else {
        if (e.deltaY > 30) nextCard()
        if (e.deltaY < -30) prevCard()
      }
    },
    [nextCard, prevCard],
  )

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    startXRef.current = e.clientX
    currentXRef.current = e.clientX
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    currentXRef.current = e.clientX
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    const diff = currentXRef.current - startXRef.current
    if (diff < -50) nextCard()
    if (diff > 50) prevCard()
  }

  return (
    <section
      id="work"
      className="work-deck-section"
      aria-label="3D Flipping Horizontal Work Deck"
    >
      <div className="work-deck-head">
        <p className="work-deck-kicker">SELECTED CASE STUDIES · DECK 08</p>
        <h2 className="work-deck-title">Engineered for Forward Motion</h2>
        <p className="work-deck-subtitle">
          Drag or click cards to inspect portfolio work in 3D space.
        </p>
      </div>

      <div
        className="work-deck-stage"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="work-deck-track">
          {SELECTED_WORK.map((piece, index) => {
            const offset = index - activeIndex
            const isActive = offset === 0

            // 3D Deck 08 Flip Math:
            // Center (offset 0): rotateY = 0deg, translateZ = 120px, scale = 1.05
            // Left (offset < 0): rotateY = +30deg, translateZ = -120px * |offset|
            // Right (offset > 0): rotateY = -30deg, translateZ = -120px * |offset|
            const rotateY = offset === 0 ? 0 : offset < 0 ? 32 : -32
            const translateX = offset * 240
            const translateZ = isActive ? 120 : -140 * Math.abs(offset)
            const scale = isActive ? 1.06 : Math.max(0.78, 1 - Math.abs(offset) * 0.12)
            const opacity = isActive ? 1 : Math.max(0.25, 1 - Math.abs(offset) * 0.35)
            const zIndex = 10 - Math.abs(offset)

            return (
              <div
                key={piece.id}
                className={`work-deck-card${isActive ? ' is-active' : ''}`}
                style={{
                  transform: `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                }}
                onClick={() => {
                  if (isActive) {
                    setExpandedPiece(piece)
                  } else {
                    setActiveIndex(index)
                  }
                }}
              >
                <div className="work-deck-card__surface">
                  <div className="work-deck-card__media">
                    <img src={piece.cover} alt={piece.title} loading="lazy" />
                  </div>
                  <div className="work-deck-card__overlay" />

                  <div className="work-deck-card__header">
                    <span className="work-deck-card__tag">{piece.role}</span>
                    <span className="work-deck-card__year">’{piece.year.slice(-2)}</span>
                  </div>

                  <div className="work-deck-card__footer">
                    <span className="work-deck-card__role">PROJECT #{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="work-deck-card__title">{piece.title}</h3>
                    <div className="work-deck-card__action">
                      <span>Inspect Case</span>
                      <i>↗</i>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="work-deck-controls">
        <button
          type="button"
          className="work-deck-btn"
          onClick={prevCard}
          disabled={activeIndex === 0}
          aria-label="Previous work card"
        >
          ←
        </button>

        <div className="work-deck-pagination">
          <span>{String(activeIndex + 1).padStart(2, '0')}</span> /{' '}
          {String(total).padStart(2, '0')}
        </div>

        <button
          type="button"
          className="work-deck-btn"
          onClick={nextCard}
          disabled={activeIndex === total - 1}
          aria-label="Next work card"
        >
          →
        </button>
      </div>

      {/* Expanded Case Detail Modal Drawer */}
      {expandedPiece && (
        <div
          className="work-deck-drawer"
          onClick={() => setExpandedPiece(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="work-deck-drawer__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="work-deck-drawer__close"
              onClick={() => setExpandedPiece(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <span className="work-deck-kicker" style={{ color: 'var(--gold)' }}>
              {expandedPiece.year} · {expandedPiece.role}
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                margin: '0.5rem 0 1rem',
                color: '#fff',
              }}
            >
              {expandedPiece.title}
            </h2>
            {expandedPiece.blurb && (
              <p
                style={{
                  fontSize: '1.15rem',
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginBottom: '2rem',
                }}
              >
                {expandedPiece.blurb}
              </p>
            )}

            {expandedPiece.gallery && expandedPiece.gallery.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                }}
              >
                {expandedPiece.gallery.slice(0, 4).map((imgSrc, i) => (
                  <img
                    key={i}
                    src={imgSrc}
                    alt=""
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      aspectRatio: '4/3',
                    }}
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
