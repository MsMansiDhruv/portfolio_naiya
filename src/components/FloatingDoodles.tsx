import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(MotionPathPlugin)

const DOODLES = [
  // Sparkle
  "M10,0 L13,7 L20,10 L13,13 L10,20 L7,13 L0,10 L7,7 Z",
  // Cross
  "M8,0 L12,0 L12,8 L20,8 L20,12 L12,12 L12,20 L8,20 L8,12 L0,12 L0,8 L8,8 Z",
  // Circle Outline
  "M10,1 A9,9 0 1,1 9.9,1",
  // Triangle
  "M10,0 L20,18 L0,18 Z",
  // Wavy Line
  "M0,10 Q5,0 10,10 T20,10"
]

export function FloatingDoodles({ count = 5 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const doodles = container.querySelectorAll('.doodle-icon')
    
    const ctx = gsap.context(() => {
      doodles.forEach((doodle) => {
        const width = container.clientWidth
        const height = container.clientHeight
        
        // Generate a random path for each doodle bounded by its container
        const path = []
        for (let j = 0; j < 4; j++) {
          path.push({
            x: (Math.random() - 0.5) * width * 0.9,
            y: (Math.random() - 0.5) * height * 0.9
          })
        }
        // Close the loop
        path.push(path[0])

        gsap.to(doodle, {
          motionPath: {
            path: path,
            curviness: 1.5,
          },
          duration: 40 + Math.random() * 30,
          repeat: -1,
          ease: "none",
        })
        
        // Add a gentle rotation
        gsap.to(doodle, {
          rotation: Math.random() > 0.5 ? "+=360" : "-=360",
          duration: 15 + Math.random() * 15,
          repeat: -1,
          ease: "none"
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Pick random doodles up to 'count'
  const selectedDoodles = Array.from({ length: count }).map(() => DOODLES[Math.floor(Math.random() * DOODLES.length)])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      {selectedDoodles.map((doodlePath, idx) => (
        <svg 
          key={idx}
          className="doodle-icon absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 text-amber-400/40"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ willChange: 'transform' }}
        >
          <path d={doodlePath} />
        </svg>
      ))}
    </div>
  )
}
