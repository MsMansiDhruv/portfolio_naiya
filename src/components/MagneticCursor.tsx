import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const CLICK_DOODLES = [
  "M0 10 Q 10 0 20 10", // curve
  "M0 0 L 10 10 M 0 10 L 10 0", // cross
  "M5 0 A 5 5 0 1 1 4.9 0", // circle
  "M0 5 L 15 5", // line
]

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [clickEffects, setClickEffects] = useState<Array<{ id: number, x: number, y: number, paths: string[] }>>([])
  const clickId = useRef(0)

  useEffect(() => {
    // Hide default cursor across the body safely using global style injection
    const style = document.createElement('style')
    style.innerHTML = `
      * { cursor: none !important; }
    `
    document.head.appendChild(style)

    const cursor = cursorRef.current
    const dot = cursorDotRef.current
    if (!cursor || !dot) return

    // Quicksetters for performance
    const setCursorX = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" })
    const setCursorY = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" })
    const setDotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" })
    const setDotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" })

    let isHovering = false

    const onMouseMove = (e: MouseEvent) => {
      // Find magnetic target
      const target = (e.target as HTMLElement).closest('.magnetic') as HTMLElement
      
      if (target) {
        if (!isHovering) {
          isHovering = true
          gsap.to(cursor, { scale: 2.5, backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.5)', duration: 0.3 })
          gsap.to(dot, { scale: 0, duration: 0.3 })
        }
        const rect = target.getBoundingClientRect()
        const targetX = rect.left + rect.width / 2
        const targetY = rect.top + rect.height / 2
        
        // Magnetic pull
        const magnetPullX = (e.clientX - targetX) * 0.3
        const magnetPullY = (e.clientY - targetY) * 0.3
        
        setCursorX(targetX + magnetPullX - 16)
        setCursorY(targetY + magnetPullY - 16)
        setDotX(e.clientX - 4)
        setDotY(e.clientY - 4)
      } else {
        if (isHovering) {
          isHovering = false
          gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', border: '1px solid rgba(212, 175, 55, 0.8)', duration: 0.3 })
          gsap.to(dot, { scale: 1, duration: 0.3 })
        }
        setCursorX(e.clientX - 16)
        setCursorY(e.clientY - 16)
        setDotX(e.clientX - 4)
        setDotY(e.clientY - 4)
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      gsap.to(cursor, { scale: 0.8, duration: 0.1 })
      
      // Spawn random doodles
      const paths = Array(4).fill(0).map(() => CLICK_DOODLES[Math.floor(Math.random() * CLICK_DOODLES.length)])
      const newEffect = { id: clickId.current++, x: e.clientX, y: e.clientY, paths }
      setClickEffects(prev => [...prev, newEffect])
      
      // Cleanup effect after animation
      setTimeout(() => {
        setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id))
      }, 1000)
    }

    const onMouseUp = () => {
      gsap.to(cursor, { scale: isHovering ? 2.5 : 1, duration: 0.3, ease: 'back.out(2)' })
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.head.removeChild(style)
    }
  }, [])

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-amber-400/80 pointer-events-none z-[9999] mix-blend-difference"
      />
      <div 
        ref={cursorDotRef} 
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-amber-400 pointer-events-none z-[10000] mix-blend-difference"
      />
      
      {/* Click Explosion Effects */}
      {clickEffects.map(effect => (
        <ClickExplosion key={effect.id} x={effect.x} y={effect.y} paths={effect.paths} />
      ))}
    </>
  )
}

function ClickExplosion({ x, y, paths }: { x: number, y: number, paths: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const elements = containerRef.current.children
    
    gsap.fromTo(elements, 
      { opacity: 1, scale: 0, x: 0, y: 0, rotation: 0 },
      { 
        opacity: 0,
        scale: Math.random() * 0.5 + 1,
        x: () => (Math.random() - 0.5) * 100,
        y: () => (Math.random() - 0.5) * 100,
        rotation: () => (Math.random() - 0.5) * 180,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.05
      }
    )
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed pointer-events-none z-[9998]"
      style={{ left: x, top: y }}
    >
      {paths.map((path, i) => (
        <svg 
          key={i} 
          className="absolute overflow-visible w-4 h-4 text-amber-400 -translate-x-1/2 -translate-y-1/2" 
          viewBox="0 0 20 20"
        >
          <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ))}
    </div>
  )
}
