import { useCallback, useEffect, useRef, useState } from 'react'
import videoSrc from '../../assets/avatar_hero_white.mp4'
import { SELECTED_WORK, type WorkPiece } from '../data/portfolio'
import { BackgroundVideo } from './BackgroundVideo'
import { ProjectGallery } from './ProjectGallery'
import { SCROLL_EVENT } from './SmoothScroll'

const WORK = SELECTED_WORK
const ANGLE = 360 / WORK.length

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef(0)
  const dragBoostRef = useRef(0)
  const draggingRef = useRef(false)
  const lastXRef = useRef(0)
  const [rotation, setRotation] = useState(0)
  const [active, setActive] = useState<WorkPiece | null>(null)
  const closeGallery = useCallback(() => setActive(null), [])

  // Scroll drives orbit; optional drag adds offset
  useEffect(() => {
    let raf = 0
    const sync = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = Math.max(el.offsetHeight + window.innerHeight * 0.35, 1)
      const scrolled = Math.min(Math.max(window.innerHeight * 0.35 - rect.top, 0), total)
      const progress = scrolled / total
      rotationRef.current = progress * 280 + dragBoostRef.current
      setRotation(rotationRef.current)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(sync)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener(SCROLL_EVENT, onScroll)
    window.addEventListener('resize', onScroll, { passive: true })
    sync()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener(SCROLL_EVENT, onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.work-orbit__card')) return
      draggingRef.current = true
      lastXRef.current = e.clientX
      stage.setPointerCapture(e.pointerId)
      stage.classList.add('is-dragging')
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      const dx = e.clientX - lastXRef.current
      lastXRef.current = e.clientX
      dragBoostRef.current += dx * 0.28
      rotationRef.current += dx * 0.28
      setRotation(rotationRef.current)
    }

    const onPointerUp = (e: PointerEvent) => {
      draggingRef.current = false
      stage.classList.remove('is-dragging')
      try {
        stage.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    }

    stage.addEventListener('pointerdown', onPointerDown)
    stage.addEventListener('pointermove', onPointerMove)
    stage.addEventListener('pointerup', onPointerUp)
    stage.addEventListener('pointercancel', onPointerUp)

    return () => {
      stage.removeEventListener('pointerdown', onPointerDown)
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerup', onPointerUp)
      stage.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="work-orbit relative z-10"
      aria-labelledby="work-heading"
    >
      <div className="work-orbit__veil" aria-hidden="true" />

      <div className="work-orbit__chrome">
        <p className="work-orbit__eyebrow">02 — Work</p>
        <h2 id="work-heading" className="work-orbit__heading text-balance">
          Selected projects
        </h2>
        <p className="work-orbit__hint">
          Scroll to orbit · drag to fine-tune · tap a card to open
        </p>
      </div>

      <div
        ref={stageRef}
        className="work-orbit__stage"
        role="region"
        aria-label="Interactive 3D project orbit"
      >
        <div
          className="work-orbit__world"
          style={{
            transform: `rotateX(8deg) rotateY(${rotation}deg)`,
          }}
        >
          <div className="work-orbit__ring">
            {WORK.map((piece, index) => (
              <button
                key={piece.id}
                type="button"
                className="work-orbit__card"
                style={{
                  transform: `rotateY(${index * ANGLE}deg) translateY(${
                    index % 2 === 0 ? '-1.6rem' : '2.4rem'
                  }) translateZ(var(--orbit-radius))`,
                }}
                onClick={() => setActive(piece)}
                aria-label={`Open ${piece.title} gallery`}
              >
                <span className="work-orbit__card-media">
                  <img src={piece.cover} alt="" draggable={false} />
                </span>
                <span className="work-orbit__card-meta">
                  <span className="work-orbit__card-title">{piece.title}</span>
                  <span className="work-orbit__card-sub">
                    Year {piece.year} · {piece.role}
                  </span>
                  <span className="work-orbit__card-bars" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div
            className="work-orbit__character"
            style={{
              transform: `translate(-50%, 0) rotateY(${-rotation}deg) rotateX(-8deg)`,
            }}
          >
            <BackgroundVideo
              src={videoSrc}
              scrubRootId="hero-scroll"
              className="work-orbit__character-video"
              style={{ objectPosition: 'center bottom' }}
            />
          </div>
        </div>
      </div>

      <ProjectGallery
        open={active !== null}
        title={active?.title ?? ''}
        images={active?.gallery ?? []}
        onClose={closeGallery}
      />
    </section>
  )
}
