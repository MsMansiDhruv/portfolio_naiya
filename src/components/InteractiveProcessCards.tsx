import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'

interface ProcessCard {
  id: string
  number: string
  phase: string
  title: string
  summary: string
  spec: {
    substrate: string
    grid: string
    finish: string
    tolerance: string
  }
  artifactSnippet: string
}

const PROCESS_DATA: ProcessCard[] = [
  {
    id: '01',
    number: '01',
    phase: 'DISCOVERY',
    title: 'Shelf Audit & Structural Constraints',
    summary: 'Deconstructing retail shelf contrast, competitive geometry, and physical box capacity constraints.',
    spec: {
      substrate: '350gsm Uncoated Kraft',
      grid: '12-Column Modular System',
      finish: 'Matte Varnish Seal',
      tolerance: '+/- 0.5mm Die Registration'
    },
    artifactSnippet: 'BOX_DIELINE_V1.CAD'
  },
  {
    id: '02',
    number: '02',
    phase: 'GEOMETRY',
    title: 'Dieline Engineering & CAD Prototyping',
    summary: 'Constructing folding carton structures, tuck-end closures, and internal structural product cradles.',
    spec: {
      substrate: 'Rigid Greyboard Core',
      grid: 'Golden Ratio Proportion',
      finish: 'Foil Stamp Emboss',
      tolerance: 'Zero-Score Flap Cleat'
    },
    artifactSnippet: 'CAD_FOLD_MATRIX.DWG'
  },
  {
    id: '03',
    number: '03',
    phase: 'TYPOGRAPHY',
    title: 'Typographic Architecture & Micro-Copy',
    summary: 'Establishing rigorous baseline typography, bilingual legal lockups, and high-impact hierarchy.',
    spec: {
      substrate: 'Fedrigoni Materica 180gsm',
      grid: '8pt Baseline Grid',
      finish: 'Blind Deboss 0.8mm',
      tolerance: 'Optical Kerning Tables'
    },
    artifactSnippet: 'SPECIMEN_PROOF.PDF'
  },
  {
    id: '04',
    number: '04',
    phase: 'PRODUCTION',
    title: 'Color Separation & Press Calibration',
    summary: 'On-press inspection, Pantone spot color balancing, and batch-proof verification across SKUs.',
    spec: {
      substrate: 'Spot Metallic Ink + CMYK',
      grid: 'Press Sheet Impose Grid',
      finish: 'Cold Foil Registration',
      tolerance: 'Delta-E < 1.0 Strict'
    },
    artifactSnippet: 'PRESS_RUN_BATCH_04.ICC'
  }
]

export function InteractiveProcessCards() {
  const [activeCard, setActiveCard] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      // Lenis Scrubbed 3D Cards Glide
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 60, rotationX: 12, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 95%',
            end: 'top 60%',
            scrub: 1, // Linked directly to Lenis momentum!
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Interactive 3D tilt physics per card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardsRef.current[idx]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    gsap.to(card, {
      rotationY: x * 0.04,
      rotationX: -y * 0.04,
      transformPerspective: 800,
      ease: 'power2.out',
      duration: 0.4
    })
  }

  const handleMouseLeave = (idx: number) => {
    const card = cardsRef.current[idx]
    if (!card) return
    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      ease: 'power2.out',
      duration: 0.5
    })
  }

  return (
    <div ref={containerRef} className="w-full pointer-events-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROCESS_DATA.map((item, idx) => {
          const isActive = activeCard === idx
          return (
            <div
              key={item.id}
              ref={(el) => { cardsRef.current[idx] = el }}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
              onClick={() => setActiveCard(idx)}
              className={`relative cursor-pointer rounded-2xl p-6 transition-colors duration-300 backdrop-blur-xl border ${
                isActive 
                  ? 'bg-neutral-900/90 border-amber-400/60 shadow-[0_15px_35px_rgba(212,175,55,0.15)]' 
                  : 'bg-neutral-950/70 border-white/10 hover:border-white/20'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <span className="font-mono text-sm font-bold text-amber-400">
                  {item.number}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                  PHASE - {item.phase}
                </span>
              </div>

              {/* Title & Summary */}
              <h3 className="font-serif text-lg text-white font-normal mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                {item.summary}
              </p>

              {/* Technical Spec Box */}
              <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-1.5 font-mono text-[10px]">
                <div className="flex justify-between text-neutral-400">
                  <span>SUBSTRATE:</span>
                  <span className="text-neutral-200">{item.spec.substrate}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>FINISH:</span>
                  <span className="text-amber-300/90">{item.spec.finish}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>TOLERANCE:</span>
                  <span className="text-neutral-300">{item.spec.tolerance}</span>
                </div>
              </div>

              {/* Active Indicator Strip */}
              {isActive && (
                <div className="absolute -bottom-[1px] left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
