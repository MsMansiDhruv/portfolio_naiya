import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Sparkles } from 'lucide-react'

interface SkillCard {
  id: string
  code: string
  title: string
  deliverables: string[]
  tools: string
  tag: string
}

const SKILL_DATA: SkillCard[] = [
  {
    id: 'packaging',
    code: 'SPEC-01',
    title: 'Packaging & FMCG Dielines',
    deliverables: [
      'Structural folding carton dielines',
      'Foil stamping & embossing dies',
      'Label & sleeve production proofs',
      'Substrate & paper stock selection'
    ],
    tools: 'Illustrator - ArtiosCAD - Acrobat Pro',
    tag: 'STRUCTURAL'
  },
  {
    id: 'branding',
    code: 'SPEC-02',
    title: 'Brand Systems & Visual Identity',
    deliverables: [
      'Geometric mark & logotype design',
      'Comprehensive brand guidelines',
      'Swiss typographic ratio systems',
      'Color palette & spot ink formulas'
    ],
    tools: 'Illustrator - InDesign - Figma',
    tag: 'IDENTITY'
  },
  {
    id: 'pitch',
    code: 'SPEC-03',
    title: 'Investor Pitch Decks',
    deliverables: [
      'Narrative storyline engineering',
      'Bespoke financial infographics',
      'Executive keynote slide systems',
      'Confidential deal room collateral'
    ],
    tools: 'Keynote - Figma - Illustrator',
    tag: 'VENTURE'
  },
  {
    id: 'performance',
    code: 'SPEC-04',
    title: 'Performance & Paid Media Creative',
    deliverables: [
      'High-converting Meta ad architectures',
      'Multi-format social campaign suites',
      'Motion graphics & video hooks',
      'Iterative creative testing assets'
    ],
    tools: 'After Effects - Premiere Pro - Photoshop',
    tag: 'GROWTH'
  }
]

export function InteractiveSkillCards() {
  const [activeIdx, setActiveIdx] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, x: -45, scale: 0.96 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 95%',
            end: 'top 60%',
            scrub: 1, // Directly linked to Lenis scroll momentum!
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="w-full max-w-lg pointer-events-auto">
      <div className="flex items-center space-x-2 text-[9px] font-mono tracking-[0.25em] text-amber-400/80 uppercase mb-3">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>CAPABILITIES - CORE DISCIPLINES</span>
      </div>
      <h3 className="text-2xl md:text-3xl font-serif text-white font-light mb-6">
        Craft &amp; <span className="italic text-amber-300">Technical Mastery</span>
      </h3>

      <div className="space-y-3">
        {SKILL_DATA.map((card, idx) => {
          const isActive = activeIdx === idx
          return (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[idx] = el }}
              onClick={() => setActiveIdx(idx)}
              className={`p-4 md:p-5 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-xl ${
                isActive
                  ? 'bg-neutral-900/95 border-amber-400/60 shadow-[0_10px_30px_rgba(212,175,55,0.12)]'
                  : 'bg-neutral-950/70 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[10px] font-bold text-amber-400">
                    {card.code}
                  </span>
                  <h4 className="font-serif text-base md:text-lg text-white font-normal">
                    {card.title}
                  </h4>
                </div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 px-2 py-0.5 rounded-full border border-white/5 bg-white/5">
                  {card.tag}
                </span>
              </div>

              {isActive && (
                <div className="mt-3 pt-3 border-t border-white/5 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 font-light mb-3">
                    {card.deliverables.map((d, dIdx) => (
                      <div key={dIdx} className="flex items-center space-x-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-[11px] text-neutral-300">{d}</span>
                      </div>
                    ))}
                  </div>
                  <div className="font-mono text-[9px] text-amber-300/80 flex items-center space-x-2">
                    <span className="text-neutral-500">TOOLCHAIN:</span>
                    <span>{card.tools}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
