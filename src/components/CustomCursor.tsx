import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [label, setLabel] = useState('')
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power2.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power2.out' })

    const handlePointerMove = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)

      const target = e.target as HTMLElement | null
      if (!target) return

      const interactive = target.closest('[data-cursor]') as HTMLElement | null
      if (interactive) {
        const text = interactive.getAttribute('data-cursor') || 'EXPLORE'
        setLabel(text)
        setHovered(true)
      } else {
        setHovered(false)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 ${
        hovered ? 'scale-100' : 'scale-50 opacity-40'
      }`}
    >
      <div
        className={`rounded-full flex items-center justify-center font-mono text-[0.65rem] tracking-widest font-bold uppercase transition-all duration-300 ${
          hovered
            ? 'w-24 h-24 bg-[#0038ff] text-[#ffffff] shadow-xl ring-1 ring-[#0038ff]'
            : 'w-4 h-4 bg-[#0a0a0a]'
        }`}
      >
        {hovered && <span ref={labelRef}>{label}</span>}
      </div>
    </div>
  )
}
