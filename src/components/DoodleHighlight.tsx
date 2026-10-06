import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface DoodleHighlightProps {
  children: React.ReactNode
  type?: 'underline' | 'circle' | 'scribble' | 'strike'
  color?: string
  className?: string
  delay?: number
}

export function DoodleHighlight({ children, type = 'underline', color = '#D4AF37', className = '', delay = 0 }: DoodleHighlightProps) {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!pathRef.current) return
    const length = pathRef.current.getTotalLength()
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length })

    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 1.5,
      delay: delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: pathRef.current,
        start: 'top 95%',
        once: true
      }
    })
  }, [delay])

  const getPath = () => {
    if (type === 'underline') return "M5 40 Q 50 45 95 40"
    if (type === 'circle') return "M50 5 C 90 5 105 25 85 45 C 65 60 10 50 5 30 C 0 10 30 0 50 5"
    if (type === 'scribble') return "M5 35 Q 20 45 35 35 T 65 35 T 95 35"
    if (type === 'strike') return "M5 25 Q 50 20 95 28"
    return "M5 40 Q 50 45 95 40"
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 100 50" 
        preserveAspectRatio="none"
        style={{ zIndex: 0, scale: 1.1 }}
      >
        <path
          ref={pathRef}
          d={getPath()}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  )
}
