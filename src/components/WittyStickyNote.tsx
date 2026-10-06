import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight, ChevronLeft } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface SectionConfig {
  section: string
  note: string
  side: 'left' | 'right'
  yPercent: number
}

const SECTION_CONFIG: SectionConfig[] = [
  {
    section: 'THE ATELIER',
    note: "Welcome to the studio. 300 DPI, clean vector paths, and zero default fonts.",
    side: 'right',
    yPercent: 0.68,
  },
  {
    section: 'SELECTED WORK',
    note: "Five core disciplines — Packaging, Branding, Social, Print, and Pitch Decks. Hover card to flip.",
    side: 'right',
    yPercent: 0.68, // Middle bottom right side
  },
  {
    section: 'DESIGN METHODOLOGY',
    note: "Dielines measured to the millimeter. In print, a 1mm error is 10,000 ruined boxes.",
    side: 'left', // Left side middle bottom: clears the 4-phase buttons on the right
    yPercent: 0.68,
  },
  {
    section: 'ABOUT ME',
    note: "Graphic design focused on impact: clean packaging layouts, sharp logos, and pitch decks that win.",
    side: 'right',
    yPercent: 0.68,
  },
  {
    section: 'SOLUTIONS IN MOTION',
    note: "From retail shelves to investor rooms — visual systems built to scale seamlessly.",
    side: 'left', // Left side middle bottom: clears bottom-right action badge
    yPercent: 0.68,
  },
  {
    section: 'VOICES IN THE VOID',
    note: "Client feedback from real projects: press-ready deliverables, fast turnarounds, and crisp typography.",
    side: 'right',
    yPercent: 0.68,
  },
  {
    section: 'TOOLS OF THE TRADE',
    note: "Daily tools: Illustrator for vector artwork, InDesign for editorial grids, and Figma for brand tokens.",
    side: 'right',
    yPercent: 0.68,
  },
  {
    section: 'GET IN TOUCH',
    note: "Have a packaging line, brand identity, or pitch deck to build? Let's make it happen.",
    side: 'right',
    yPercent: 0.68,
  },
]

const NOTE_WIDTH = 224
const RIGHT_MARGIN = 40
const LEFT_MARGIN = 48

function getSectionPosition(index: number, winWidth: number, winHeight: number) {
  const config = SECTION_CONFIG[index] || SECTION_CONFIG[0]
  const isLeft = config.side === 'left'
  const x = isLeft ? LEFT_MARGIN : Math.max(LEFT_MARGIN, winWidth - NOTE_WIDTH - RIGHT_MARGIN)
  const y = Math.max(80, Math.min(winHeight - 220, winHeight * (config.yPercent ?? 0.68)))
  return { x, y, side: config.side }
}

export function WittyStickyNote() {
  const containerRef = useRef<HTMLDivElement>(null)
  const driftRef = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLDivElement>(null)
  const currentIndexRef = useRef(0)
  const currentSideRef = useRef<'left' | 'right'>(SECTION_CONFIG[0].side)
  const isTuckedRef = useRef(false)
  const [currentData, setCurrentData] = useState(SECTION_CONFIG[0])
  const [currentSide, setCurrentSide] = useState<'left' | 'right'>(SECTION_CONFIG[0].side)
  const [isFlipping, setIsFlipping] = useState(false)
  const [isTucked, setIsTucked] = useState(false)

  // Keep refs in sync for event handlers
  useEffect(() => {
    isTuckedRef.current = isTucked
  }, [isTucked])

  useEffect(() => {
    currentSideRef.current = currentSide
  }, [currentSide])

  useEffect(() => {
    if (!containerRef.current || !noteRef.current || !driftRef.current) return

    const container = containerRef.current
    const drift = driftRef.current
    const note = noteRef.current

    // Set initial position based on section 0 once
    const initialPos = getSectionPosition(0, window.innerWidth, window.innerHeight)
    gsap.set(container, { x: initialPos.x, y: initialPos.y })

    const ctx = gsap.context(() => {
      // 1. Subtle, gentle breathing drift
      gsap.to(drift, {
        y: '+=3',
        rotation: '-=0.3',
        duration: 4.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      // 2. Watch for section transitions across all .witty-section elements
      const refreshTriggers = () => {
        const sections = document.querySelectorAll('.witty-section')

        sections.forEach((section) => {
          const indexStr = section.getAttribute('data-witty-index')
          if (indexStr === null) return

          const index = parseInt(indexStr, 10)
          if (isNaN(index)) return

          const targetTrigger = (section.closest('.pin-spacer') as HTMLElement) || section

          ScrollTrigger.create({
            trigger: targetTrigger,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => triggerPadFlip(index),
            onEnterBack: () => triggerPadFlip(index),
          })
        })
      }

      const timeoutId = setTimeout(refreshTriggers, 250)

      function triggerPadFlip(index: number) {
        if (index === currentIndexRef.current || index >= SECTION_CONFIG.length) return
        currentIndexRef.current = index
        const nextConfig = SECTION_CONFIG[index]
        currentSideRef.current = nextConfig.side
        setCurrentSide(nextConfig.side)
        setIsFlipping(true)

        // Gentle paper curl & settle
        const tl = gsap.timeline({
          onComplete: () => setIsFlipping(false),
        })

        tl.to(note, {
          rotationX: -12,
          y: -4,
          scale: 0.99,
          duration: 0.16,
          ease: 'power2.out',
        })
          .call(() => {
            setCurrentData(nextConfig)
          })
          .to(note, {
            rotationX: 0,
            y: 0,
            scale: 1,
            rotationZ: nextConfig.side === 'left' ? 1.5 : -1.5,
            duration: 0.28,
            ease: 'power2.out',
          })

        // Calm, stable glide to dock coordinates
        const targetPos = getSectionPosition(index, window.innerWidth, window.innerHeight)
        gsap.to(container, {
          x: targetPos.x,
          y: targetPos.y,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }

      return () => {
        clearTimeout(timeoutId)
      }
    }, containerRef)

    // Handle viewport resize gracefully
    const handleResize = () => {
      const pos = getSectionPosition(currentIndexRef.current, window.innerWidth, window.innerHeight)
      gsap.to(container, {
        x: pos.x,
        y: pos.y,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
    window.addEventListener('resize', handleResize)

    // 3. Gentle cursor tactile response (calm micro-shift, max 4px)
    let isTicking = false
    const handleMouseMove = (e: MouseEvent) => {
      if (!noteRef.current || isTicking || isTuckedRef.current) return
      isTicking = true

      requestAnimationFrame(() => {
        isTicking = false
        if (!noteRef.current) return

        const rect = noteRef.current.getBoundingClientRect()
        const noteX = rect.left + rect.width / 2
        const noteY = rect.top + rect.height / 2
        const dist = Math.hypot(e.clientX - noteX, e.clientY - noteY)
        const side = currentSideRef.current

        if (dist < 85) {
          const angle = Math.atan2(noteY - e.clientY, noteX - e.clientX)
          const clampedPush = Math.min((85 - dist) * 0.08, 4)

          gsap.to(noteRef.current, {
            x: Math.cos(angle) * clampedPush,
            y: Math.sin(angle) * clampedPush,
            rotation: (side === 'left' ? 1.5 : -1.5) + Math.cos(angle) * 0.8,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        } else {
          gsap.to(noteRef.current, {
            x: 0,
            y: 0,
            rotation: side === 'left' ? 1.5 : -1.5,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      ctx.revert()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Direction-aware tuck transformation on inner wrapper
  const tuckTransformClass = isTucked
    ? currentSide === 'left'
      ? '-translate-x-[82%]'
      : 'translate-x-[82%]'
    : 'translate-x-0'

  return (
    <div
      id="witty-sticky-note"
      ref={containerRef}
      data-no-pen="true"
      className="fixed top-0 left-0 z-[90] hidden lg:block pointer-events-auto select-none"
      style={{ perspective: '1000px', willChange: 'transform' }}
    >
      <div className={`transition-transform duration-500 ease-out ${tuckTransformClass}`}>
        <div ref={driftRef}>
          <div
            ref={noteRef}
            className={`relative flex flex-col justify-between w-54 min-h-[140px] bg-[#fbf6e8] shadow-[0_15px_35px_rgba(0,0,0,0.4),0_0_15px_rgba(212,175,55,0.12)] ${
              currentSide === 'left' ? 'rotate-1.5' : '-rotate-1.5'
            } p-5 border border-amber-900/15 rounded-sm transition-shadow duration-300 ${
              isFlipping ? 'pointer-events-none' : ''
            }`}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'top center' }}
          >
          {/* Masking tape piece at the top */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-18 h-5 bg-white/50 backdrop-blur-md shadow-sm rotate-1 opacity-90 border-t border-b border-white/70 pointer-events-none"
            style={{ clipPath: 'polygon(3% 0%, 97% 2%, 100% 100%, 0% 98%)' }}
          />

          {/* Subtle post-it paper texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-amber-900/5 pointer-events-none" />

          {/* Note Header: Section Name + Push Aside Toggle Button */}
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-1.5 mb-2 relative z-10">
            <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-amber-900/70 uppercase truncate max-w-[130px]">
              {currentData.section}
            </span>

            {/* Push aside toggle */}
            <button
              onClick={() => setIsTucked(!isTucked)}
              title={isTucked ? 'Pull note in' : 'Push note aside'}
              className="w-4 h-4 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-amber-900 flex items-center justify-center cursor-pointer transition-colors"
            >
              {isTucked ? (
                currentSide === 'left' ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronLeft className="w-3 h-3" />
                )
              ) : currentSide === 'left' ? (
                <ChevronLeft className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Note Body */}
          <p
            className="text-[12.5px] font-serif italic text-neutral-800 leading-snug antialiased relative z-10 py-1"
            style={{ transform: 'translateZ(15px)' }}
          >
            "{currentData.note}"
          </p>

          {/* Note Footer */}
          <div className="mt-2 pt-1 border-t border-amber-900/10 flex items-center justify-between text-[8px] font-mono text-neutral-500 uppercase tracking-widest relative z-10">
            <span>ND · GRAPHIC DESIGN</span>
            <span>ATELIER NOTE</span>
          </div>

          {/* Tactile Dog-eared bottom corner */}
          <div
            className={`absolute bottom-0 ${
              currentSide === 'left' ? 'left-0' : 'right-0'
            } w-3.5 h-3.5 bg-gradient-to-tl from-amber-200/80 to-transparent shadow-[-2px_-2px_4px_rgba(0,0,0,0.15)] pointer-events-none`}
            style={{
              clipPath:
                currentSide === 'left'
                  ? 'polygon(0 0, 0 100%, 100% 100%)'
                  : 'polygon(100% 0, 0 100%, 100% 100%)',
            }}
          />
        </div>
      </div>
    </div>
  </div>
  )
}
