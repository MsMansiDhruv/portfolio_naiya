import { useCallback, useState } from 'react'
import { SELECTED_WORK, type WorkPiece } from '../data/portfolio'
import { use3DCardTilt } from '../hooks/use3DCardTilt'
import { FadeIn } from './FadeIn'
import { TextReveal } from './TextReveal'

function WorkCardItem({
  piece,
  index,
  isExpanded,
  onToggle,
  onClose,
}: {
  piece: WorkPiece
  index: number
  isExpanded: boolean
  onToggle: (id: string) => void
  onClose: () => void
}) {
  const { ref, onPointerMove, onPointerLeave } = use3DCardTilt<HTMLElement>()

  return (
    <li className={`work-card-inline${isExpanded ? ' is-expanded' : ''}`}>
      <FadeIn delay={0.05 + index * 0.05} y={36} blur={6}>
        <article
          ref={ref}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          <button
            type="button"
            className="work-card-inline__trigger"
            onClick={() => onToggle(piece.id)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Collapse ${piece.title}` : `Expand ${piece.title}`}
          >
            <div className="work-card-inline__media">
              <img
                src={piece.cover}
                alt=""
                loading={index < 3 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
            <div className="work-card-inline__header">
              <span className="work-card-inline__meta">
                {piece.year} · {piece.role}
              </span>
              <h3 className="work-card-inline__title">{piece.title}</h3>
            </div>
          </button>

          {isExpanded && (
            <div className="work-card-inline__detail">
              {piece.blurb && (
                <p className="work-card-inline__blurb">{piece.blurb}</p>
              )}

              {piece.story && piece.story.length > 0 && (
                <div className="story-beats">
                  {piece.story.map((beat, beatIndex) => (
                    <div key={beatIndex} className="story-beat">
                      <h4 className="story-beat__title">{beat.title}</h4>
                      <p className="story-beat__body">{beat.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {piece.gallery.length > 0 && (
                <div className="work-gallery-inline">
                  {piece.gallery.slice(0, 4).map((src, gIndex) => (
                    <figure key={gIndex} className="work-gallery-inline__item">
                      <img src={src} alt="" loading="lazy" />
                    </figure>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="work-card-inline__close"
                onClick={onClose}
              >
                Next project
              </button>
            </div>
          )}
        </article>
      </FadeIn>
    </li>
  )
}

/**
 * 2026 Work Grid — inline expansion pattern with 3D interactive tilt.
 */
export function WorkBentoInline() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((current) => (current === id ? null : id))
  }, [])

  const handleClose = useCallback(() => {
    setExpandedId(null)
  }, [])

  return (
    <section id="work" className="work-section" aria-labelledby="work-heading">
      <div className="page-wrap">
        <div className="section-head section-head--tight">
          <div id="work-heading">
            <TextReveal
              as="h2"
              className="section-title section-title--display"
              delay={0.04}
            >
              Work.
            </TextReveal>
          </div>
          <FadeIn y={16} delay={0.12}>
            <p className="work-bento__lede">
              Click any project to expand details inline — no modal takeover.
            </p>
          </FadeIn>
        </div>

        <ul className="work-grid-inline">
          {SELECTED_WORK.map((piece, i) => (
            <WorkCardItem
              key={piece.id}
              piece={piece}
              index={i}
              isExpanded={expandedId === piece.id}
              onToggle={toggleExpand}
              onClose={handleClose}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
