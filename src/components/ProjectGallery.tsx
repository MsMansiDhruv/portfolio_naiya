import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { EASE_OUT, gsap, prefersReducedMotion } from '../lib/gsap'

type ProjectGalleryProps = {
  title: string
  subtitle?: string
  blurb?: string
  images: string[]
  open: boolean
  onClose: () => void
  startIndex?: number
}

/** Focused lightbox — GSAP enter timeline. */
export function ProjectGallery({
  title,
  subtitle,
  blurb,
  images,
  open,
  onClose,
  startIndex = 0,
}: ProjectGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const root = rootRef.current
    const panel = panelRef.current
    if (root && panel) {
      const reduce = prefersReducedMotion()
      gsap.killTweensOf([root, panel])
      gsap.fromTo(
        root,
        { opacity: 0 },
        { opacity: 1, duration: reduce ? 0 : 0.28, ease: EASE_OUT },
      )
      gsap.fromTo(
        panel,
        { y: reduce ? 0 : 36, opacity: 0 },
        { y: 0, opacity: 1, duration: reduce ? 0 : 0.45, ease: EASE_OUT },
      )
    }

    requestAnimationFrame(() => {
      document.getElementById('project-gallery-close')?.focus()
    })

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, startIndex])

  if (typeof document === 'undefined' || !open) return null

  return createPortal(
    <div
      ref={rootRef}
      className="project-gallery"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-gallery-title"
    >
      <button
        type="button"
        className="project-gallery__backdrop"
        aria-label="Close gallery"
        onClick={onClose}
      />

      <div ref={panelRef} className="project-gallery__panel">
        <div className="project-gallery__header">
          <div className="project-gallery__heading">
            <h2 id="project-gallery-title" className="project-gallery__title">
              {title}
            </h2>
            {subtitle ? (
              <p className="project-gallery__subtitle">{subtitle}</p>
            ) : null}
            {blurb ? <p className="project-gallery__blurb">{blurb}</p> : null}
          </div>
          <button
            id="project-gallery-close"
            type="button"
            className="project-gallery__close"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="project-gallery__grid" id="project-gallery-focus">
          {images.map((src, i) => (
            <figure key={`${src}-${i}`} className="project-gallery__item">
              <img src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
            </figure>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
