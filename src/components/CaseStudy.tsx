import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { WorkPiece } from '../data/portfolio'
import { EASE_OUT, gsap, prefersReducedMotion } from '../lib/gsap'

type CaseStudyProps = {
  piece: WorkPiece | null
  open: boolean
  onClose: () => void
}

/**
 * Case story panel — six-steal layout:
 * seal entrance · object-through-type · one label · huge word · color punch · no glass cards
 */
export function CaseStudy({ piece, open, onClose }: CaseStudyProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!open || !piece) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const root = rootRef.current
    const scroll = scrollRef.current
    const title = titleRef.current
    const reduce = prefersReducedMotion()

    if (root && scroll) {
      gsap.killTweensOf([root, scroll])
      gsap.fromTo(
        root,
        { opacity: 0 },
        { opacity: 1, duration: reduce ? 0 : 0.35, ease: EASE_OUT },
      )
      gsap.fromTo(
        scroll,
        { y: reduce ? 0 : 48, opacity: 0 },
        { y: 0, opacity: 1, duration: reduce ? 0 : 0.55, ease: EASE_OUT },
      )
    }

    if (title && !reduce) {
      const chars = title.querySelectorAll('.case-study__char')
      gsap.fromTo(
        chars,
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.7,
          stagger: 0.028,
          ease: EASE_OUT,
          delay: 0.18,
        },
      )
    }

    const media = scroll?.querySelectorAll('.case-study__media')
    if (media?.length && !reduce) {
      gsap.fromTo(
        media,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: EASE_OUT,
          delay: 0.28,
        },
      )
    }

    requestAnimationFrame(() => {
      document.getElementById('case-study-close')?.focus()
    })

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, piece])

  if (typeof document === 'undefined' || !open || !piece) return null

  const story = piece.story ?? []
  const objectSrc = piece.object ?? piece.cover
  const titleChars = Array.from(piece.title)

  return createPortal(
    <div
      ref={rootRef}
      className="case-study"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
    >
      <button
        type="button"
        className="case-study__backdrop"
        aria-label="Close case study"
        onClick={onClose}
      />

      <div ref={scrollRef} className="case-study__shell">
        <header className="case-study__top">
          <p className="case-study__meta">
            {piece.year} · {piece.role}
            {piece.client ? ` · ${piece.client}` : ''}
          </p>
          <button
            id="case-study-close"
            type="button"
            className="case-study__close"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        {/* Steal: object through type + huge word */}
        <section className="case-study__hero">
          <h2 id="case-study-title" ref={titleRef} className="case-study__display">
            {titleChars.map((ch, i) => (
              <span key={`${ch}-${i}`} className="case-study__char-wrap">
                <span className="case-study__char">{ch === ' ' ? '\u00A0' : ch}</span>
              </span>
            ))}
          </h2>
          <div className="case-study__object-wrap">
            <img
              className="case-study__object"
              src={objectSrc}
              alt=""
              draggable={false}
            />
          </div>
          {piece.thesis ? (
            <p className="case-study__thesis">{piece.thesis}</p>
          ) : piece.blurb ? (
            <p className="case-study__thesis">{piece.blurb}</p>
          ) : null}
        </section>

        {/* Six story beats — process + proof together */}
        <div className="case-study__beats">
          {story.map((beat, i) => (
            <article
              key={`${beat.label}-${i}`}
              className={`case-study__beat${beat.punch ? ' case-study__beat--punch' : ''}`}
            >
              <div className="case-study__beat-copy">
                <p className="case-study__beat-label">{beat.label}</p>
                <h3 className="case-study__beat-title">
                  {beat.title.includes(' ') ? (
                    <>
                      {beat.title.slice(0, beat.title.lastIndexOf(' '))}{' '}
                      <em>{beat.title.slice(beat.title.lastIndexOf(' ') + 1)}</em>
                    </>
                  ) : (
                    <em>{beat.title}</em>
                  )}
                </h3>
                <p className="case-study__beat-body">{beat.body}</p>
              </div>
              <figure className={`case-study__media case-study__media--${beat.kind}`}>
                <img src={beat.image} alt="" loading={i < 2 ? 'eager' : 'lazy'} />
              </figure>
            </article>
          ))}
        </div>

        {piece.gallery.length > 0 ? (
          <section className="case-study__gallery" aria-label="More frames">
            <p className="case-study__beat-label">Gallery</p>
            <div className="case-study__gallery-grid">
              {piece.gallery.map((src, i) => (
                <figure key={`${src}-${i}`} className="case-study__media">
                  <img src={src} alt="" loading="lazy" />
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
