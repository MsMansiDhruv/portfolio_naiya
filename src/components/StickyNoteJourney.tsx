import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  'Todo',
  'Planning',
  'Designing',
  'Testing',
  'Feedback',
  'Iteration',
  'Review',
  'Done'
]

export function StickyNoteJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const notesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Create a master timeline locked to the entire page scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrub
        }
      })

      // Force timeline duration to exactly 1 so percentage math maps perfectly
      tl.to({}, { duration: 1 })

      notesRef.current.forEach((note, index) => {
        if (!note) return
        
        const stepLength = 1 / STEPS.length
        const start = index * stepLength
        const peak = start + (stepLength * 0.5)
        
        // Initial state
        gsap.set(note, { 
          opacity: 0.2, 
          scale: 0.8, 
          filter: 'grayscale(80%) brightness(0.6)',
          x: -10
        })
        
        // Animate in (to peak)
        tl.to(note, {
          opacity: 1, 
          scale: 1.15, 
          filter: 'grayscale(0%) brightness(1)',
          x: 0,
          rotation: 0, // Straighten out at peak
          duration: stepLength * 0.5, 
          ease: 'power2.out'
        }, start)
        
        // Animate out (if not the last step)
        if (index < STEPS.length - 1) {
          // Add back the random rotation it had originally
          const origRotation = index % 2 === 0 ? -6 : 6
          
          tl.to(note, {
            opacity: 0.2, 
            scale: 0.8, 
            filter: 'grayscale(80%) brightness(0.6)',
            x: -10,
            rotation: origRotation,
            duration: stepLength * 0.5, 
            ease: 'power2.in'
          }, peak)
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 h-[80vh] flex flex-col justify-between z-50 pointer-events-none hidden lg:flex"
    >
      {/* Invisible track line connecting them (optional, maybe a faint dashed line looks cool) */}
      <div className="absolute left-1/2 top-4 bottom-4 w-px border-l border-dashed border-amber-500/20 -z-10" />

      {STEPS.map((step, i) => {
        // Start with a slight alternating messy rotation
        const rotateClass = i % 2 === 0 ? '-rotate-6' : 'rotate-6'
        
        return (
          <div 
            key={step}
            ref={el => { notesRef.current[i] = el }}
            className={`relative flex items-center justify-center w-14 h-14 bg-amber-400 border border-amber-300 shadow-[2px_4px_12px_rgba(0,0,0,0.6)] ${rotateClass} transform-gpu`}
          >
            {/* Post-it fold/shadow detail */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-tl from-black/20 to-transparent" />
            
            {/* The Text */}
            <span className="text-[9px] font-mono font-bold text-neutral-950 uppercase tracking-tighter text-center leading-none px-1">
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}
