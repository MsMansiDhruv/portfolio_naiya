import { useCallback, useEffect, useRef, useState } from 'react'
import { CRAFT_STUDIO, type CraftPiece } from '../data/portfolio'
import { gsap, mediaHoverQuickTo, prefersReducedMotion } from '../lib/gsap'
import { FadeIn } from './FadeIn'
import { ProjectGallery } from './ProjectGallery'
import { TextReveal } from './TextReveal'

const KIND_LABEL: Record<CraftPiece['kind'], string> = {
  sketch: 'Sketch',
  material: 'Material',
  inspiration: 'Inspiration',
  bts: 'Behind the scenes',
  board: 'Board',
}

/** Taste — process of creation: sketches, BTS, materials, boards. */
export function Explorations() {
  const [active, setActive] = useState<CraftPiece | null>(null)
  const close = useCallback(() => setActive(null), [])
  const wallRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const cards = wallRef.current?.querySelectorAll<HTMLElement>(
      '.craft-tile__card',
    )
    if (!cards) return
    const cleanups: Array<() => void> = []
    cards.forEach((el) => {
      const q = mediaHoverQuickTo(el)
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        q.x(nx * 10)
        q.y(ny * 8)
        q.scale(1.02)
      }
      const onLeave = () => {
        q.x(0)
        q.y(0)
        q.scale(1)
      }
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
        gsap.set(el, { x: 0, y: 0, scale: 1 })
      })
    })
    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <section
      id="explorations"
      className="craft-section"
      aria-labelledby="craft-heading"
    >
      <div className="page-wrap">
        <div className="section-head section-head--tight">
          <div id="craft-heading">
            <TextReveal as="h2" className="section-title section-title--display" delay={0.06}>
              Making-of <em>materials.</em>
            </TextReveal>
          </div>
        </div>

        <ul className="craft-wall" ref={wallRef}>
          {CRAFT_STUDIO.map((item, i) => (
            <li
              key={item.id}
              className={`craft-tile craft-tile--${item.span}`}
            >
              <FadeIn delay={0.06 + i * 0.05} y={32} blur={7}>
                <button
                  type="button"
                  className="craft-tile__card"
                  onClick={() => setActive(item)}
                  aria-label={`Open ${item.title}`}
                >
                  <div className="craft-tile__media">
                    <img
                      src={item.cover}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="craft-tile__kind">
                      {KIND_LABEL[item.kind]}
                    </span>
                  </div>
                  <div className="craft-tile__meta">
                    <h3 className="craft-tile__title">{item.title}</h3>
                    <p className="craft-tile__caption">{item.caption}</p>
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
        subtitle={active ? KIND_LABEL[active.kind] : undefined}
        blurb={active?.note ?? active?.caption}
        images={active ? [active.cover] : []}
        onClose={close}
      />
    </section>
  )
}
