import { useCallback, useState } from 'react'
import { SELECTED_WORK } from '../data/portfolio'
import { FadeIn } from './FadeIn'
import { ProjectGallery } from './ProjectGallery'

export function Work() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = SELECTED_WORK.find((w) => w.id === activeId) ?? null
  const close = useCallback(() => setActiveId(null), [])

  return (
    <section id="work-list" className="work-section" aria-labelledby="work-heading">
      <div className="page-wrap">
        <FadeIn y={24}>
          <div className="section-head">
            <p className="section-kicker">Selected work</p>
            <h2 id="work-heading" className="section-title">
              Real systems. Real brands.
            </h2>
          </div>
        </FadeIn>

        <ul className="work-list">
          {SELECTED_WORK.map((piece, i) => (
            <li key={piece.id}>
              <FadeIn delay={i * 0.06} y={36}>
                <button
                  type="button"
                  className="work-row"
                  onClick={() => setActiveId(piece.id)}
                >
                  <div className="work-row__media">
                    <img src={piece.cover} alt="" loading="lazy" />
                  </div>
                  <div className="work-row__copy">
                    <div className="work-row__meta">
                      <span>{piece.role}</span>
                      <span>{piece.year}</span>
                    </div>
                    <h3 className="work-row__title">{piece.title}</h3>
                    {piece.blurb ? (
                      <p className="work-row__blurb">{piece.blurb}</p>
                    ) : null}
                  </div>
                </button>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>

      <ProjectGallery
        open={active !== null}
        title={active?.title ?? ''}
        images={active?.gallery ?? []}
        onClose={close}
      />
    </section>
  )
}
