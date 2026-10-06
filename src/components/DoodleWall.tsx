import { useRef, useState, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DOODLE_PATHS = [
  "M 10 10 Q 20 0, 30 10 T 50 10", // squiggle
  "M 25 5 A 20 20 0 1 1 24.9 5 M 15 15 L 15 16 M 35 15 L 35 16 M 15 25 Q 25 35 35 25", // smiley
  "M 10 10 L 40 40 M 10 40 L 40 10", // cross
  "M 25 5 L 30 15 L 45 15 L 35 25 L 40 40 L 25 30 L 10 40 L 15 25 L 5 15 L 20 15 Z", // star
  "M 5 25 C 5 5, 45 5, 45 25 C 45 45, 15 45, 15 25 C 15 10, 35 10, 35 25", // loop
  "M 5 5 L 25 45 L 45 5", // V shape
  "M 10 25 A 15 15 0 0 1 40 25 A 15 15 0 0 1 10 25", // perfect circle
  "M 5 45 Q 25 5, 45 45 M 15 30 L 35 30", // A shape
  "M 25 0 Q 50 25, 25 50 T 25 100", // vertical sine wave for pillar
  "M 10 0 L 40 20 L 10 40 L 40 60 L 10 80 L 40 100", // vertical zigzag for pillar
  "M 25 10 L 25 90 M 15 20 L 35 20 M 15 80 L 35 80", // pillar column structure
]

const WITTY_TEXTS = [
  "hire me?", "pls", "wow", "coffee?", "brb rendering", "pixels", "magic", "hello", "boop", "css is hard", "(im nice)",
  "make it pop", "final_final_v5.psd", "cmd + z", "// TODO: fix this", "looks good to me", "LGTM", 
  "404 sleep not found", "let's circle back", "send coffee", "scribble scribble"
]

export function DoodleWall() {
  const wallRef = useRef<HTMLDivElement>(null)

  const doodles = useMemo(() => {
    const items = []
    
    // Helper
    const getRandContent = (isText: boolean) => isText 
      ? WITTY_TEXTS[Math.floor(Math.random() * WITTY_TEXTS.length)] 
      : DOODLE_PATHS[Math.floor(Math.random() * DOODLE_PATHS.length)]

    // 1. Center Scatter (Random) - 25 items
    for(let i=0; i<25; i++) {
      const isText = Math.random() > 0.75
      items.push({
        id: `center-${i}`,
        type: isText ? 'text' : 'path',
        content: getRandContent(isText),
        left: 15 + Math.random() * 70, // 15% to 85%
        top: 5 + Math.random() * 90,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.8
      })
    }

    // 2. Left Pillar - 18 items stacked vertically
    for(let i=0; i<18; i++) {
      const isText = Math.random() > 0.6
      items.push({
        id: `left-${i}`,
        type: isText ? 'text' : 'path',
        content: getRandContent(isText),
        left: 2 + Math.random() * 8, // 2% to 10%
        top: (i * (100/18)) + (Math.random() * 4 - 2), // Distributed top to bottom
        rotation: (Math.random() - 0.5) * 60, // mostly upright
        scale: 0.7 + Math.random() * 0.5
      })
    }

    // 3. Right Pillar - 18 items stacked vertically
    for(let i=0; i<18; i++) {
      const isText = Math.random() > 0.6
      items.push({
        id: `right-${i}`,
        type: isText ? 'text' : 'path',
        content: getRandContent(isText),
        left: 90 + Math.random() * 8, // 90% to 98%
        top: (i * (100/18)) + (Math.random() * 4 - 2), // Distributed top to bottom
        rotation: (Math.random() - 0.5) * 60, // mostly upright
        scale: 0.7 + Math.random() * 0.5
      })
    }
    
    return items
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw paths on scrub
      gsap.fromTo('.doodle-wall-path', 
        { strokeDashoffset: 300 },
        { 
          strokeDashoffset: 0, 
          ease: 'none',
          scrollTrigger: {
            trigger: wallRef.current,
            start: 'top 90%',
            end: 'bottom bottom',
            scrub: 1.5
          }
        }
      )
      
      // Fade/float text on scrub
      gsap.fromTo('.doodle-wall-text', 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0,
          ease: 'power1.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: wallRef.current,
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 1.5
          }
        }
      )
    }, wallRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wallRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
       {doodles.map(d => (
          <InteractiveDoodle key={d.id} data={d} />
       ))}
    </div>
  )
}

function InteractiveDoodle({ data }: { data: any }) {
  const ref = useRef<HTMLDivElement>(null)
  const [broken, setBroken] = useState(false)

  const handleHover = () => {
    if (broken) return
    setBroken(true)
    
    const isLeft = Math.random() > 0.5
    gsap.to(ref.current, {
      y: '+=250',
      x: isLeft ? '-=150' : '+=150',
      rotation: isLeft ? '-=720' : '+=720',
      opacity: 0,
      scale: 0.2,
      duration: 1.2,
      ease: 'power3.in',
    })
  }

  if (data.type === 'text') {
    return (
      <div 
        ref={ref}
        className="absolute text-amber-500/30 hover:text-amber-400 font-['Comic_Sans_MS',_cursive] text-sm whitespace-nowrap transition-colors duration-200 cursor-crosshair doodle-wall-text select-none pointer-events-auto"
        style={{ 
          left: `${data.left}%`, 
          top: `${data.top}%`, 
          transform: `rotate(${data.rotation}deg) scale(${data.scale})`
        }}
        onMouseEnter={handleHover}
      >
        {data.content}
      </div>
    )
  }

  return (
    <div 
      ref={ref}
      className="absolute text-amber-500/20 hover:text-amber-400 transition-colors duration-200 cursor-crosshair pointer-events-auto"
      style={{ 
        left: `${data.left}%`, 
        top: `${data.top}%`, 
        transform: `rotate(${data.rotation}deg) scale(${data.scale})`,
        width: '80px',
        height: '80px'
      }}
      onMouseEnter={handleHover}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <path 
          d={data.content} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="doodle-wall-path" 
          style={{ strokeDasharray: 300, strokeDashoffset: 300 }} 
        />
      </svg>
    </div>
  )
}
