import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

interface ToolItem {
  id: string
  name: string
  role: string
  color: string
  icon: React.ReactNode
}

// Precision SVG brand icons
const FigmaIcon = (
  <svg viewBox="0 0 38 57" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
    <path fill="#F24E1E" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
    <path fill="#A259FF" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
    <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z"/>
    <path fill="#FF7262" d="M19 0h9.5a9.5 9.5 0 1 1 0 19H19V0z"/>
    <path fill="#1ABCFE" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z"/>
  </svg>
)

const IllustratorIcon = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 17l4.5-11L14 17M7 13h5M18 9.5v7.5M18 6.5v1" stroke="#FF9A00" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
)

const PhotoshopIcon = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 17V7h4.5a3 3 0 0 1 0 6H4" stroke="#31A8FF" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M13 17c1 0 3-.5 3-2s-1.5-2-3-2.5c-1.5-.5-3-1-3-2.5s2-2 3-2 2.5.5 3 1" stroke="#31A8FF" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
)

const InDesignIcon = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 18V6M9 6v12M14 6c3 0 5 2.5 5 6s-2 6-5 6h-1V6h1z" stroke="#FF3366" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
)

const AfterEffectsIcon = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 17l4.5-11L14 17M7 13h5M17 13.5c.5.5 1.5.5 2 0s.5-1.5 0-2-1.5-.5-2 0m0 2.5v3" stroke="#D9A5FF" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
)

const CanvaIcon = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="url(#canva-gradient)" />
    <path
      d="M13.6 8.5c-.7-.7-1.7-1-2.6-1-2.4 0-4.2 1.9-4.2 4.5 0 2.6 1.8 4.5 4.2 4.5 1.1 0 2.1-.4 2.7-1.1.3-.3.3-.8 0-1.1-.3-.3-.8-.3-1.1 0-.4.4-1 .6-1.6.6-1.5 0-2.6-1.2-2.6-2.9 0-1.7 1.1-2.9 2.6-2.9.6 0 1.2.2 1.6.6.3.3.8.3 1.1 0 .3-.3.3-.8-.1-1.2z"
      fill="#FFFFFF"
    />
    <defs>
      <linearGradient id="canva-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00C4CC" />
        <stop offset="1" stopColor="#7D2AE8" />
      </linearGradient>
    </defs>
  </svg>
)

const MidjourneyIcon = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2"/>
    <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3.5" fill="#F59E0B"/>
  </svg>
)

const TOOLS: ToolItem[] = [
  { id: 'illustrator', name: 'Illustrator', role: 'Vector Marks & Packaging Art', color: '#FF9A00', icon: IllustratorIcon },
  { id: 'photoshop', name: 'Photoshop', role: 'Press Retouch & Mockups', color: '#31A8FF', icon: PhotoshopIcon },
  { id: 'indesign', name: 'InDesign', role: 'Editorial & Book Specs', color: '#FF3366', icon: InDesignIcon },
  { id: 'figma', name: 'Figma', role: 'Design Systems & UI', color: '#F24E1E', icon: FigmaIcon },
  { id: 'aftereffects', name: 'After Effects', role: 'Kinetic Motion & Loops', color: '#D9A5FF', icon: AfterEffectsIcon },
  { id: 'canva', name: 'Canva', role: 'Social Collateral & Systems', color: '#00C4CC', icon: CanvaIcon },
  { id: 'midjourney', name: 'Midjourney', role: 'Visual Concepting & Ideation', color: '#F59E0B', icon: MidjourneyIcon }
]

export function InteractiveSkillIcons() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      // Gentle staggered hover float on mount
      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, y: 30, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.05,
          duration: 0.8,
          ease: 'power3.out'
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="w-full max-w-lg pointer-events-auto text-left">
      <h3 className="text-2xl md:text-4xl font-serif text-white font-light mb-6">
        Tools of the <span className="italic text-amber-300">Trade</span>
      </h3>

      {/* Grid of Tool Icons with Clean Hover States & Tooltips */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 md:gap-3.5 mb-2">
        {TOOLS.map((tool, idx) => (
          <div
            key={tool.id}
            ref={(el) => { itemsRef.current[idx] = el }}
            className="group relative aspect-square rounded-2xl flex items-center justify-center p-3 cursor-pointer transition-all duration-300 border border-white/10 bg-black/50 hover:bg-neutral-900 hover:border-amber-400/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:-translate-y-1 backdrop-blur-xl"
          >
            {tool.icon}

            {/* Hover Tooltip Box Showing Software Name */}
            <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/90 border border-amber-400/50 rounded-md text-amber-300 text-[11px] font-mono tracking-wider whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.8)] pointer-events-none opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-30 flex flex-col items-center">
              <span>{tool.name}</span>
              <div className="w-1.5 h-1.5 bg-black/90 border-r border-b border-amber-400/50 rotate-45 -mb-1 mt-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
