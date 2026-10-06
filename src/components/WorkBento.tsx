import { useCallback, useEffect, useRef, useState } from 'react'
import { SELECTED_WORK, type WorkPiece } from '../data/portfolio'
import { gsap, mediaHoverQuickTo, prefersReducedMotion } from '../lib/gsap'
import { CaseStudy } from './CaseStudy'
import { FadeIn } from './FadeIn'
import { TextReveal } from './TextReveal'

/**
 * Proof — featured object case + interactive grid.
 * Each open is a story (mood → sketch → object → proof), not a flat gallery.
 */
export function WorkBento() {
  const [active, setActive] = useState<WorkPiece | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const close = useCallback(() => setActive(null), [])
  const gridRef = useRef<HTMLUListElement>(null)
  const featureRef = useRef<HTMLButtonElement>(null)

  const featured = SELECTED_WORK[0]
  const rest = SELECTED_WORK.slice(1)

  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const cleanups: Array<() => void> = []

    const wireTilt = (el: HTMLElement, strength = 1) => {
      const q = mediaHoverQuickTo(el)
      const rotX = gsap.quickTo(el, 'rotateX', { duration: 0.45, ease: 'power3.out' })
      const rotY = gsap.quickTo(el, 'rotateY', { duration: 0.45, ease: 'power3.out' })
      el.style.transformStyle = 'preserve-3d'
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        q.x(nx * 6 * strength)
        q.y(ny * 5 * strength)
        q.scale(1.02)
        rotX(-ny * 5 * strength)
        rotY(nx * 6 * strength)
      }
      const onLeave = () => {
        q.x(0)
        q.y(0)
        q.scale(1)
        rotX(0)
        rotY(0)
      }
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
        gsap.set(el, { x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 })
      })
    }

    if (featureRef.current) wireTilt(featureRef.current, 1.15)
    gridRef.current
      ?.querySelectorAll<HTMLElement>('.work-bento__tile')
      .forEach((el) => wireTilt(el, 0.9))

    return () => cleanups.forEach((fn) => fn())
  }, [])

  const openPiece = (piece: WorkPiece) => setActive(piece)

  return (
    <section id="work" className="work-bento-section" aria-labelledby="work-heading">
      <div className="page-wrap">
        <div className="section-head section-head--tight">
          <div id="work-heading">
            <TextReveal
              as="h2"
              className="section-title section-title--display"
              delay={0.04}
            >
              Case <em>stories.</em>
            </TextReveal>
          </div>
          <FadeIn y={16} delay={0.12}>
            <p className="work-bento__lede">
              Mood → sketch → object → proof. Making-of lives inside each case.
            </p>
          </FadeIn>
        </div>

        {featured ? (
          <FadeIn y={40} delay={0.06} blur={8}>
            <button
              ref={featureRef}
              type="button"
              className="work-feature"
              onClick={() => openPiece(featured)}
              aria-label={`Open case story ${featured.title}`}
            >
              <div className="work-feature__stage">
                <span className="work-feature__display" aria-hidden="true">
                  {featured.title}
                </span>
                <img
                  className="work-feature__object"
                  src={featured.object ?? featured.cover}
                  alt=""
                  loading="eager"
                  draggable={false}
                />
                <span className="work-organic-shimmer" aria-hidden="true">
                  <span className="work-organic-shimmer__wave" />
                  <span className="work-organic-shimmer__band" />
                </span>
              </div>
              <div className="work-feature__meta">
                <span className="work-feature__role">
                  {featured.year} · {featured.role}
                </span>
                <p className="work-feature__blurb">
                  {featured.thesis ?? featured.blurb}
                </p>
                <span className="work-feature__cta">
                  Open story <i aria-hidden="true">↗</i>
                </span>
              </div>
            </button>
          </FadeIn>
        ) : null}

        <ul
          ref={gridRef}
          className={`work-bento${hovered ? ' is-dimming' : ''}`}
        >
          {rest.map((piece, i) => {
            const span = piece.span === 'hero' ? 'wide' : (piece.span ?? 'default')
            const showPins = hovered === piece.id
            return (
              <li
                key={piece.id}
                className={`work-bento__cell work-bento__cell--${span}${hovered === piece.id ? ' is-active' : ''}${hovered && hovered !== piece.id ? ' is-dim' : ''}`}
              >
                <FadeIn delay={0.05 + i * 0.05} y={36} blur={6}>
                  <button
                    type="button"
                    className="work-bento__tile"
                    onClick={() => openPiece(piece)}
                    onPointerEnter={() => setHovered(piece.id)}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setHovered(piece.id)}
                    onBlur={() => setHovered(null)}
                    aria-label={`Open case story ${piece.title}`}
                  >
                    <div className="work-bento__media">
                      <img
                        src={piece.cover}
                        alt=""
                        loading={i < 2 ? 'eager' : 'lazy'}
                        draggable={false}
                      />
                      <span className="work-organic-shimmer" aria-hidden="true">
                        <span className="work-organic-shimmer__wave" />
                        <span className="work-organic-shimmer__band" />
                      </span>
                      {piece.hotspots?.map((pin) => (
                        <span
                          key={pin.label}
                          className={`work-pin${showPins ? ' is-on' : ''}`}
                          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        >
                          <i className="work-pin__dot" aria-hidden="true" />
                          <span className="work-pin__label">
                            <strong>{pin.label}</strong>
                            {pin.note ? <em>{pin.note}</em> : null}
                          </span>
                        </span>
                      ))}
                    </div>
                    <div className="work-bento__meta">
                      <span className="work-bento__role">
                        {piece.year} · {piece.role}
                      </span>
                      <h3 className="work-bento__title">{piece.title}</h3>
                    </div>
                  </button>
                </FadeIn>
              </li>
            )
          })}
        </ul>
      </div>

      <CaseStudy piece={active} open={active !== null} onClose={close} />
    </section>
  )
}
