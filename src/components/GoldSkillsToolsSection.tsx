import React, { useState } from 'react'
import { Award, Sparkles, CheckCircle2 } from 'lucide-react'

export interface OfficialSkillItem {
  id: string
  name: string
  category: 'graphic' | 'ai' | 'spatial'
  categoryLabel: string
  badgeText: string
  proficiency: string
  yearsExp: string
  svgIcon: React.ReactNode
  goldTone: 'amber' | 'bronze' | 'lightGold' | 'champagne'
  description: string
}

// Official Brand SVGs rendered with precision
const FigmaOfficialSVG = (
  <svg viewBox="0 0 38 57" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path fill="#F24E1E" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
    <path fill="#A259FF" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
    <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z"/>
    <path fill="#FF7262" d="M19 0h9.5a9.5 9.5 0 1 1 0 19H19V0z"/>
    <path fill="#1ABCFE" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z"/>
  </svg>
)

const PhotoshopOfficialSVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#001E36" stroke="#31A8FF" strokeWidth="1.5"/>
    <path d="M6 17V7h4.5a3 3 0 0 1 0 6H6" stroke="#31A8FF" strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 17c1 0 3-.5 3-2s-1.5-2-3-2.5c-1.5-.5-3-1-3-2.5s2-2 3-2 2.5.5 3 1" stroke="#31A8FF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const IllustratorOfficialSVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#260000" stroke="#FF9A00" strokeWidth="1.5"/>
    <path d="M6 17l3.5-10L13 17M7.5 13h4M16 9.5v7.5M16 7v1" stroke="#FF9A00" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const AfterEffectsOfficialSVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#1A0033" stroke="#D9A5FF" strokeWidth="1.5"/>
    <path d="M6 17l3.5-10L13 17M7.5 13h4M15 13.5c.5.5 1.5.5 2 0s.5-1.5 0-2-1.5-.5-2 0m0 2.5v3" stroke="#D9A5FF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const BlenderOfficialSVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6z" fill="#EA7600"/>
    <circle cx="12" cy="12" r="3" fill="#22578E"/>
    <path d="M14 6l5-3M10 6L5 3" stroke="#EA7600" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const SplineOfficialSVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#0D0D11" stroke="#FF5E97" strokeWidth="1.5"/>
    <path d="M7 8.5C7 7.12 8.12 6 9.5 6h5C15.88 6 17 7.12 17 8.5v0c0 1.38-1.12 2.5-2.5 2.5h-5C8.12 11 7 12.12 7 13.5v0C7 14.88 8.12 16 9.5 16h5c1.38 0 2.5 1.12 2.5 2.5" stroke="#FF5E97" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const MidjourneyOfficialSVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#0A0A0A" stroke="#F59E0B" strokeWidth="1.5"/>
    <path d="M12 4v16M4 12h16M7 7l10 10M17 7L7 17" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="4" fill="#F59E0B" fillOpacity="0.3"/>
  </svg>
)

const StableDiffusionSVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#110C24" stroke="#A855F7" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="6" stroke="#A855F7" strokeWidth="2"/>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const RunwayOfficialSVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#050505" stroke="#3B82F6" strokeWidth="1.5"/>
    <path d="M7 6h6a4 4 0 0 1 0 8H7V6zm0 8l7 4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClaudeOfficialSVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#18130B" stroke="#D97706" strokeWidth="1.5"/>
    <path d="M12 6l2 4 4.5.5-3.5 3 1 4.5-4-2.5-4 2.5 1-4.5-3.5-3 4.5-.5L12 6z" fill="#D97706"/>
  </svg>
)

const Cinema4DOfficialSVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#001830" stroke="#0099FF" strokeWidth="1.5"/>
    <path d="M7 15.5a4.5 4.5 0 1 1 5.5-4.4M17 8.5v7m-3-3.5h3" stroke="#0099FF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const MagnificOfficialSVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#1A1200" stroke="#FBBF24" strokeWidth="1.5"/>
    <path d="M10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm3-1l5 5" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const OFFICIAL_SKILLS: OfficialSkillItem[] = [
  {
    id: 'figma-official',
    name: 'Figma',
    category: 'graphic',
    categoryLabel: 'GRAPHIC ARCHITECTURE',
    badgeText: 'Vector System',
    proficiency: '99%',
    yearsExp: '7 Yrs',
    svgIcon: FigmaOfficialSVG,
    goldTone: 'amber',
    description: 'Design token architecture, auto-layout packaging grids, and design system specs.',
  },
  {
    id: 'ps-official',
    name: 'Photoshop CC',
    category: 'graphic',
    categoryLabel: 'GRAPHIC ARCHITECTURE',
    badgeText: 'Tactile Finish',
    proficiency: '97%',
    yearsExp: '9 Yrs',
    svgIcon: PhotoshopOfficialSVG,
    goldTone: 'bronze',
    description: 'Foil stamp simulations, high-DPI surface textures, and color management.',
  },
  {
    id: 'ai-official',
    name: 'Illustrator CC',
    category: 'graphic',
    categoryLabel: 'GRAPHIC ARCHITECTURE',
    badgeText: 'Dieline Master',
    proficiency: '98%',
    yearsExp: '9 Yrs',
    svgIcon: IllustratorOfficialSVG,
    goldTone: 'amber',
    description: 'Mathematical dieline curves, micro-typography vectors, and brand identity.',
  },
  {
    id: 'ae-official',
    name: 'After Effects',
    category: 'graphic',
    categoryLabel: 'GRAPHIC ARCHITECTURE',
    badgeText: 'Motion FX',
    proficiency: '93%',
    yearsExp: '6 Yrs',
    svgIcon: AfterEffectsOfficialSVG,
    goldTone: 'champagne',
    description: 'Spatial title choreography, kinetic typography, and multi-pass video compositing.',
  },
  {
    id: 'blender-official',
    name: 'Blender 3D',
    category: 'spatial',
    categoryLabel: 'SPATIAL 3D CAD',
    badgeText: 'Glass Refraction',
    proficiency: '92%',
    yearsExp: '5 Yrs',
    svgIcon: BlenderOfficialSVG,
    goldTone: 'amber',
    description: 'Caustic glass shader nodes, liquid viscosity simulations, and studio caustics.',
  },
  {
    id: 'spline-official',
    name: 'Spline 3D',
    category: 'spatial',
    categoryLabel: 'SPATIAL 3D CAD',
    badgeText: 'WebGL Spatial',
    proficiency: '90%',
    yearsExp: '3 Yrs',
    svgIcon: SplineOfficialSVG,
    goldTone: 'lightGold',
    description: 'Real-time WebGL interactive 3D viewports, physically based material canvas.',
  },
  {
    id: 'midjourney-official',
    name: 'Midjourney v6',
    category: 'ai',
    categoryLabel: 'AI GENERATIVE',
    badgeText: 'Concept Synthesizer',
    proficiency: '99%',
    yearsExp: '3 Yrs',
    svgIcon: MidjourneyOfficialSVG,
    goldTone: 'amber',
    description: 'Prompt architecture, photorealistic aesthetic control, and lighting moodboards.',
  },
  {
    id: 'comfyui-official',
    name: 'ComfyUI / SDXL',
    category: 'ai',
    categoryLabel: 'AI GENERATIVE',
    badgeText: 'LoRA Pipeline',
    proficiency: '95%',
    yearsExp: '2 Yrs',
    svgIcon: StableDiffusionSVG,
    goldTone: 'bronze',
    description: 'Custom LoRA weights, ControlNet depth mapping, and style conditioning nodes.',
  },
  {
    id: 'runway-official',
    name: 'Runway Gen-3',
    category: 'ai',
    categoryLabel: 'AI GENERATIVE',
    badgeText: 'Video Synthesis',
    proficiency: '92%',
    yearsExp: '2 Yrs',
    svgIcon: RunwayOfficialSVG,
    goldTone: 'lightGold',
    description: 'AI motion control, spatial video generation, and camera movement directing.',
  },
  {
    id: 'claude-official',
    name: 'Claude 3.5 Sonnet',
    category: 'ai',
    categoryLabel: 'AI GENERATIVE',
    badgeText: 'System Code & Spec',
    proficiency: '98%',
    yearsExp: '2 Yrs',
    svgIcon: ClaudeOfficialSVG,
    goldTone: 'amber',
    description: 'Generative frontend code integration, system documentation, and visual AI specs.',
  },
  {
    id: 'c4d-official',
    name: 'Cinema 4D',
    category: 'spatial',
    categoryLabel: 'SPATIAL 3D CAD',
    badgeText: 'Product Geometry',
    proficiency: '89%',
    yearsExp: '4 Yrs',
    svgIcon: Cinema4DOfficialSVG,
    goldTone: 'champagne',
    description: 'Luxury bottle geometry, octant rendering, and studio lighting setups.',
  },
  {
    id: 'magnific-official',
    name: 'Magnific AI',
    category: 'ai',
    categoryLabel: 'AI GENERATIVE',
    badgeText: '8K Upscale Polish',
    proficiency: '96%',
    yearsExp: '2 Yrs',
    svgIcon: MagnificOfficialSVG,
    goldTone: 'amber',
    description: 'AI texture detail injection, micro-surface polish, and high-DPI rendering.',
  },
]

interface GoldSkillsToolsSectionProps {
  opacity: number
  translateY: number
}

export function GoldSkillsToolsSection({ opacity, translateY }: GoldSkillsToolsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'graphic' | 'ai' | 'spatial'>('all')
  const [selectedSkill, setSelectedSkill] = useState<OfficialSkillItem | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filtered = OFFICIAL_SKILLS.filter((s) => {
    if (activeCategory === 'graphic') return s.category === 'graphic'
    if (activeCategory === 'ai') return s.category === 'ai'
    if (activeCategory === 'spatial') return s.category === 'spatial'
    return true
  })

  return (
    <div
      className="absolute top-1/4 left-8 md:left-16 z-30 w-85 md:w-[540px] pointer-events-auto transition-all duration-300 ease-out drop-shadow-2xl text-left"
      style={{
        opacity,
        transform: `perspective(1400px) translate3d(0px, ${translateY}px, 90px)`,
      }}
    >
      {/* SECTION HEADER */}
      <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-amber-400 uppercase mb-2 drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]">
        <Award className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>MASTERY DIRECTIVES // OFFICIAL STACK</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-serif tracking-tight leading-none mb-3 font-light bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]">
        SKILLS &amp; <span className="italic text-amber-400 font-normal">TOOLS</span>
      </h2>

      <div className="w-36 h-[1px] bg-gradient-to-r from-amber-400 via-amber-300 to-transparent mb-4 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />

      {/* CATEGORY FILTER TABS */}
      <div className="flex items-center space-x-2 mb-5">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-wider uppercase transition-all border cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)]'
              : 'bg-neutral-950/80 text-neutral-400 border-neutral-800 hover:border-amber-500/40'
          }`}
        >
          ALL (12)
        </button>
        <button
          onClick={() => setActiveCategory('graphic')}
          className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-wider uppercase transition-all border cursor-pointer ${
            activeCategory === 'graphic'
              ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)]'
              : 'bg-neutral-950/80 text-neutral-400 border-neutral-800 hover:border-amber-500/40'
          }`}
        >
          GRAPHIC (4)
        </button>
        <button
          onClick={() => setActiveCategory('spatial')}
          className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-wider uppercase transition-all border cursor-pointer ${
            activeCategory === 'spatial'
              ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)]'
              : 'bg-neutral-950/80 text-neutral-400 border-neutral-800 hover:border-amber-500/40'
          }`}
        >
          SPATIAL 3D (3)
        </button>
        <button
          onClick={() => setActiveCategory('ai')}
          className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-wider uppercase transition-all border cursor-pointer ${
            activeCategory === 'ai'
              ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)]'
              : 'bg-neutral-950/80 text-neutral-400 border-neutral-800 hover:border-amber-500/40'
          }`}
        >
          AI DESIGN (5)
        </button>
      </div>

      {/* GOLD ANIMATED BLOCKS GRID WITH OFFICIAL ICONS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
        {filtered.map((skill, index) => {
          const isHovered = hoveredId === skill.id
          const isSelected = selectedSkill?.id === skill.id

          return (
            <div
              key={skill.id}
              onMouseEnter={() => setHoveredId(skill.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedSkill(isSelected ? null : skill)}
              className={`relative overflow-hidden p-3.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-950/90 via-amber-900/40 to-neutral-950 border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.45)] scale-105 z-20'
                  : isHovered
                  ? 'bg-gradient-to-br from-neutral-900/90 via-amber-950/30 to-neutral-950 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-[1.03] z-10'
                  : 'bg-gradient-to-br from-neutral-950/90 via-neutral-900/40 to-neutral-950 border-amber-500/30 hover:border-amber-400/80'
              }`}
              style={{
                animation: `goldPulse 5s ease-in-out infinite`,
                animationDelay: `${index * 0.25}s`,
              }}
            >
              {/* ANIMATED DIAGONAL GOLD SHEEN SWEEP EFFECT */}
              <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-amber-400/30 to-transparent transform -rotate-45 translate-x-[-100%] animate-goldSheen" />
              </div>

              {/* TOP ROW: OFFICIAL BRAND SVG ICON + PROFICIENCY BADGE */}
              <div className="flex items-center justify-between mb-2 z-10">
                <div className="p-2 rounded-lg bg-neutral-900/90 border border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.15)] flex items-center justify-center">
                  {skill.svgIcon}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.2)] block">
                    {skill.proficiency}
                  </span>
                  <span className="text-[8px] font-mono text-neutral-400 block mt-0.5">
                    {skill.yearsExp}
                  </span>
                </div>
              </div>

              {/* MIDDLE ROW: TOOL NAME & BADGE */}
              <div className="z-10">
                <h3 className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>{skill.name}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </h3>
                <span className="text-[9px] font-mono text-amber-400/90 tracking-wider uppercase block mt-0.5">
                  {skill.badgeText}
                </span>
              </div>

              {/* HOVER / ACTIVE EXPANDED DETAILS */}
              {(isHovered || isSelected) && (
                <div className="mt-2 pt-2 border-t border-amber-500/20 z-10 text-left animate-in fade-in zoom-in-95 duration-150">
                  <p className="text-[10px] text-neutral-300 font-light leading-snug">
                    {skill.description}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ACTIVE SKILL DEEP-DIVE MODAL CARD */}
      {selectedSkill && (
        <div className="mt-3 p-3.5 bg-gradient-to-r from-neutral-950 via-amber-950/60 to-neutral-950 border border-amber-400 rounded-xl backdrop-blur-xl shadow-[0_15px_40px_rgba(251,191,36,0.3)] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="text-[9px] font-mono text-amber-300 uppercase tracking-widest font-semibold">
                MASTERY SPECIFICATION // {selectedSkill.name}
              </span>
            </div>
            <button
              onClick={() => setSelectedSkill(null)}
              className="text-[9px] font-mono text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800"
            >
              CLOSE [X]
            </button>
          </div>
          <p className="text-xs text-neutral-100 font-serif italic mb-1">
            “Deployed with {selectedSkill.proficiency} proficiency across luxury branding, spatial packaging, and generative pipelines.”
          </p>
          <p className="text-[10px] font-mono text-neutral-400">
            {selectedSkill.description}
          </p>
        </div>
      )}

      {/* KEYFRAME ANIMATIONS & STYLES */}
      <style>{`
        @keyframes goldPulse {
          0%, 100% {
            box-shadow: 0 0 12px rgba(251, 191, 36, 0.12);
          }
          50% {
            box-shadow: 0 0 22px rgba(251, 191, 36, 0.28);
          }
        }
        @keyframes goldSheen {
          0% {
            transform: translateX(-100%) rotate(-45deg);
          }
          100% {
            transform: translateX(200%) rotate(-45deg);
          }
        }
        .animate-goldSheen {
          animation: goldSheen 6s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.4);
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}
