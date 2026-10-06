import { useEffect, useState, useMemo } from 'react'

const FUNNY_TEXTS = [
  "i swear it looked different in figma...",
  "made with 99% coffee ☕",
  "(probably not pixel perfect)",
  "oops, wild idea appeared!",
  "don't double-click me.",
  "creative genius at work (usually)",
  "wow. much design. very AI.",
  "is this centered?",
  "lorem ipsum... wait I forgot the rest",
  "i should probably sleep...",
  "just add more gradients ✨",
  "if it breaks, refresh it",
  "my other portfolio is a porsche",
  "brb, asking ChatGPT...",
  "can we make the logo bigger?",
  "final_FINAL_v8.psd",
  "is it a bug or a feature? yes.",
  "brb, tweaking shadows",
  "it works on my machine ¯\\_(ツ)_/¯"
]

const CLICK_REPLIES = [
  "ouch!", "why'd you click me?", "stop poking me!", 
  "tickles!", "boop!", "hey!", "do it again!", "error 404: joke not found"
]

const DOODLE_PATHS = ['long-arrow', 'burst', 'cloud', 'scribble-box', 'underline', 'spiral', 'circle']

interface DoodleData {
  id: string
  isText: boolean
  content?: string
  pathType?: string
  x: number
  y: number
  width: number
  rot: number
  parallaxZ: number
}

function generateDoodles(count: number): DoodleData[] {
  const doodles: DoodleData[] = []
  for (let i = 0; i < count; i++) {
    // Reduced text frequency to 25%, prioritizing drawings
    const isText = Math.random() < 0.25 
    doodles.push({
      id: Math.random().toString(36).substr(2, 9),
      isText,
      content: isText ? FUNNY_TEXTS[Math.floor(Math.random() * FUNNY_TEXTS.length)] : undefined,
      pathType: !isText ? DOODLE_PATHS[Math.floor(Math.random() * DOODLE_PATHS.length)] : undefined,
      x: 3 + Math.random() * 88, // 3% to 91%
      y: -20 + Math.random() * 1050, // scroll bounds
      width: 60 + Math.random() * 120, // Smaller, less overpowering scale (60px - 180px)
      rot: -20 + Math.random() * 40,
      parallaxZ: 4 + Math.random() * 20
    })
  }
  return doodles.sort(() => Math.random() - 0.5)
}

export function GraphicToolsLayer({ scrollProgress }: { scrollProgress: number }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  
  // Total elements reduced to prevent overwhelming the UI
  const doodles = useMemo(() => generateDoodles(45), [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 z-[46] pointer-events-none overflow-hidden">
      {doodles.map(doodle => (
        <InteractiveDoodle 
          key={doodle.id} 
          doodle={doodle} 
          mouse={mouse} 
          scrollProgress={scrollProgress}
        />
      ))}

      <style>{`
        /* MotionSVG scrub mapping */
        .doodle-svg-layer path {
          stroke-dasharray: 1000;
          stroke-dashoffset: calc(1000 * (1 - var(--draw-ratio)));
          transition: stroke-dashoffset 0.15s ease-out; /* Smooths the scroll scrub */
        }
        
        .group:hover .doodle-svg-layer path {
          stroke-dashoffset: 0 !important;
          transition: stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 0 6px rgba(255,255,255,0.8));
        }

        .doodle-explode {
          animation: explode-anim 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards;
        }
        
        @keyframes explode-anim {
          0% { transform: scale(1); opacity: 1; filter: blur(0); }
          100% { transform: scale(3.5) rotate(45deg) translateY(-50px); opacity: 0; filter: blur(15px); }
        }
        
        .animate-doodle-wiggle {
          animation: doodle-wiggle 5s ease-in-out infinite;
        }
        
        @keyframes doodle-wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        
        .comic-font {
          font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive;
        }
      `}</style>
    </div>
  )
}

function InteractiveDoodle({ doodle, mouse, scrollProgress }: { doodle: DoodleData, mouse: { x: number, y: number }, scrollProgress: number }) {
  const [phase, setPhase] = useState<'normal' | 'clicked' | 'exploded'>('normal')
  const [text, setText] = useState(doodle.content)
  const [color, setColor] = useState('text-white')

  // Mouse Parallax
  const px = mouse.x * doodle.parallaxZ
  const py = mouse.y * doodle.parallaxZ

  // GSAP-style Scroll Scrub Math
  const currentScrollVh = scrollProgress * 1000
  const viewportRelativeY = doodle.y - currentScrollVh
  const scrollOffset = scrollProgress * -1000
  
  // MotionSVG: Element starts drawing at 120vh (bottom edge) and finishes at 40vh
  const drawRatio = Math.max(0, Math.min(1, (120 - viewportRelativeY) / 80))
  
  // MotionScroll: Gentle organic floating up and down tied to scroll phase
  const floatY = Math.sin(scrollProgress * 25 + doodle.parallaxZ) * 15

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (phase === 'exploded') return

    if (doodle.isText) {
      setText(CLICK_REPLIES[Math.floor(Math.random() * CLICK_REPLIES.length)])
    } else {
      const colors = ['text-amber-400', 'text-sky-300', 'text-rose-400', 'text-emerald-300', 'text-fuchsia-300', 'text-white']
      setColor(colors[Math.floor(Math.random() * colors.length)])
    }
    
    setPhase('clicked')
    setTimeout(() => {
      setPhase(current => current === 'exploded' ? 'exploded' : 'normal')
    }, 200)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPhase('exploded')
  }

  return (
    <div
      className={`absolute pointer-events-auto cursor-pointer group 
        ${phase === 'exploded' ? 'doodle-explode pointer-events-none' : ''}
        ${phase === 'clicked' ? 'scale-90 brightness-125 transition-all duration-75' : 'scale-100 transition-all duration-300'}
      `}
      style={{
        left: `${doodle.x}%`,
        top: `calc(${doodle.y}vh + ${scrollOffset}vh)`,
        transform: `translate3d(${px}px, ${py + floatY}px, 0) rotate(${doodle.rot}deg)`,
        width: doodle.isText ? 'auto' : `${doodle.width}px`,
        whiteSpace: doodle.isText ? 'nowrap' : 'normal',
        '--draw-ratio': drawRatio // Injected for CSS to handle MotionSVG
      } as React.CSSProperties}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="animate-doodle-wiggle origin-center">
        {doodle.isText ? (
          <div className={`comic-font text-lg md:text-xl font-bold tracking-tight text-white/50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] 
            group-hover:-rotate-2 group-hover:scale-110 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-all select-none`}>
            {text}
          </div>
        ) : (
          <div className={`w-full h-full opacity-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] group-hover:opacity-100 group-hover:scale-110 transition-all ${color}`}>
            {renderPath(doodle.pathType)}
          </div>
        )}
      </div>
    </div>
  )
}

function renderPath(type?: string) {
  const svgProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5", // Subdued thickness
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }

  switch (type) {
    case 'long-arrow':
      return (
        <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible doodle-svg-layer">
          <path d="M 20 20 Q 150 140, 280 40" {...svgProps} />
          <path d="M 250 30 L 280 40 L 260 70" {...svgProps} />
        </svg>
      )
    case 'burst':
      return (
        <svg viewBox="0 0 150 150" className="w-full h-full overflow-visible doodle-svg-layer">
          <path d="M 75 10 L 90 50 L 140 40 L 100 80 L 130 130 L 80 100 L 30 130 L 50 80 L 10 40 L 60 50 Z" {...svgProps} />
        </svg>
      )
    case 'scribble-box':
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible doodle-svg-layer">
          <path d="M 10 10 L 190 15 L 180 90 L 15 80 Z M 5 20 L 195 10 L 185 95 L 10 85 Z" {...svgProps} />
        </svg>
      )
    case 'underline':
      return (
        <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible doodle-svg-layer">
          <path d="M 10 30 Q 80 10, 150 30 T 290 30 M 20 45 Q 90 25, 160 45 T 280 45" {...svgProps} />
        </svg>
      )
    case 'cloud':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible doodle-svg-layer">
          <path d="M 50 60 C 20 60, 10 90, 40 110 C 70 130, 110 110, 110 110 C 140 130, 190 110, 180 70 C 200 40, 160 10, 130 30 C 100 -10, 40 10, 50 60" {...svgProps} />
        </svg>
      )
    case 'spiral':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible doodle-svg-layer">
          <path d="M 50 50 Q 60 40, 70 50 Q 80 70, 50 80 Q 10 90, 10 50 Q 10 10, 50 10 C 90 10, 90 90, 50 90" {...svgProps} />
        </svg>
      )
    case 'circle':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible doodle-svg-layer">
          <path d="M 50 10 C 90 10, 90 90, 50 90 C 10 90, 10 10, 50 10 C 70 10, 90 30, 90 50" {...svgProps} />
        </svg>
      )
    default:
      return null
  }
}
