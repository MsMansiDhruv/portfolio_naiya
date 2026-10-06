import { useEffect, useRef } from 'react'

type Options = {
  strength?: number
  damp?: number
  enabled?: boolean
}

/** Critically-damped pointer follow for transform — interruptible, no bounce. */
export function usePointerParallax<T extends HTMLElement>(
  { strength = 10, damp = 0.12, enabled = true }: Options = {},
) {
  const ref = useRef<T>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduced || !fine) {
      el.style.transform = ''
      return
    }

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      target.current.x = Math.max(-1, Math.min(1, nx)) * strength
      target.current.y = Math.max(-1, Math.min(1, ny)) * strength
    }

    const onLeave = () => {
      target.current.x = 0
      target.current.y = 0
    }

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * damp
      current.current.y += (target.current.y - current.current.y) * damp
      el.style.transform = `translate3d(${current.current.x.toFixed(2)}px, ${current.current.y.toFixed(2)}px, 0)`
      raf.current = requestAnimationFrame(tick)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    raf.current = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf.current)
      el.style.transform = ''
    }
  }, [strength, damp, enabled])

  return ref
}
