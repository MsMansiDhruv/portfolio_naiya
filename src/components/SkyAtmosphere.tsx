import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/gsap'

/**
 * Fixed cloud sky — base always visible.
 * Far/near layers: GSAP scroll scrub + pointer quickTo.
 */
export function SkyAtmosphere() {
  const farRef = useRef<HTMLDivElement>(null)
  const nearRef = useRef<HTMLDivElement>(null)
  const mistRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const far = farRef.current
    const near = nearRef.current
    const mist = mistRef.current
    if (!far || !near) return

    const ptrFarX = gsap.quickTo(far, 'x', { duration: 0.9, ease: 'power3.out' })
    const ptrFarY = gsap.quickTo(far, 'y', { duration: 0.9, ease: 'power3.out' })
    const ptrNearX = gsap.quickTo(near, 'x', { duration: 0.55, ease: 'power3.out' })
    const ptrNearY = gsap.quickTo(near, 'y', { duration: 0.55, ease: 'power3.out' })
    const ptrMistX = mist
      ? gsap.quickTo(mist, 'x', { duration: 0.7, ease: 'power3.out' })
      : null
    const ptrMistY = mist
      ? gsap.quickTo(mist, 'y', { duration: 0.7, ease: 'power3.out' })
      : null

    const fine = window.matchMedia('(pointer: fine)').matches

    const onPointer = (e: PointerEvent) => {
      if (!fine) return
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      ptrFarX(nx * 18)
      ptrFarY(ny * 12)
      ptrNearX(nx * 36)
      ptrNearY(ny * 22)
      ptrMistX?.(nx * 24)
      ptrMistY?.(ny * 16)
    }

    window.addEventListener('pointermove', onPointer, { passive: true })

    const ctx = gsap.context(() => {
      gsap.to(far, {
        yPercent: -8,
        xPercent: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.1,
        },
      })
      gsap.to(near, {
        yPercent: -14,
        xPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
        },
      })
      if (mist) {
        gsap.to(mist, {
          yPercent: -10,
          xPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.9,
          },
        })
      }
    })

    return () => {
      window.removeEventListener('pointermove', onPointer)
      ctx.revert()
    }
  }, [])

  return (
    <div className="sky-atmosphere" aria-hidden="true">
      <div className="sky-atmosphere__base" />
      <div ref={farRef} className="sky-atmosphere__parallax sky-atmosphere__parallax--far">
        <div className="sky-atmosphere__layer sky-atmosphere__layer--far" />
      </div>
      <div ref={mistRef} className="sky-atmosphere__parallax sky-atmosphere__parallax--mist">
        <div className="sky-atmosphere__layer sky-atmosphere__layer--mist" />
      </div>
      <div ref={nearRef} className="sky-atmosphere__parallax sky-atmosphere__parallax--near">
        <div className="sky-atmosphere__layer sky-atmosphere__layer--near" />
      </div>
      <div className="sky-atmosphere__veil" />
    </div>
  )
}

void ScrollTrigger
