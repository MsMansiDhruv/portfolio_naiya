import { useCallback, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

export function use3DCardTilt<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    if (prefersReducedMotion() || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -8 // max 8 deg
    const rotateY = ((x - centerX) / centerX) * 8 // max 8 deg

    gsap.to(ref.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [])

  const onPointerLeave = useCallback(() => {
    if (!ref.current) return
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }, [])

  return { ref, onPointerMove, onPointerLeave }
}
