import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/gsap'

export function SpotlightCursor() {
  const spotRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -100, y: -100 })
  const targetRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const handlePointerMove = (e: PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      // Lerp for smooth spring-like lag
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.18
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.18

      if (spotRef.current) {
        spotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={spotRef}
      className="spotlight-cursor-glow"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: -150,
        left: -150,
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147, 197, 253, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'plus-lighter',
        willChange: 'transform',
        opacity: 0.85,
        filter: 'blur(10px)',
      }}
    />
  )
}
