import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'

export interface EvaporatingIconItem {
  id: string
  name: string
  category: 'graphic' | 'ai' | 'spatial'
  svgIcon: React.ReactNode
  goldColor: string
  floatDelay: string
  size: string
}

// High-precision Official Brand SVGs (No background box)
const FigmaIcon = (
  <svg viewBox="0 0 38 57" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
    <path fill="#F24E1E" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
    <path fill="#A259FF" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
    <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z"/>
    <path fill="#FF7262" d="M19 0h9.5a9.5 9.5 0 1 1 0 19H19V0z"/>
    <path fill="#1ABCFE" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z"/>
  </svg>
)

const PhotoshopIcon = (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 17V7h4.5a3 3 0 0 1 0 6H4" stroke="#31A8FF" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M13 17c1 0 3-.5 3-2s-1.5-2-3-2.5c-1.5-.5-3-1-3-2.5s2-2 3-2 2.5.5 3 1" stroke="#31A8FF" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

const IllustratorIcon = (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 17l4.5-11L14 17M7 13h5M18 9.5v7.5M18 6.5v1" stroke="#FF9A00" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

const AfterEffectsIcon = (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 17l4.5-11L14 17M7 13h5M17 13.5c.5.5 1.5.5 2 0s.5-1.5 0-2-1.5-.5-2 0m0 2.5v3" stroke="#D9A5FF" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

const BlenderIcon = (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6z" fill="#EA7600"/>
    <circle cx="12" cy="12" r="3" fill="#22578E"/>
    <path d="M14 6l5-3M10 6L5 3" stroke="#EA7600" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const SplineIcon = (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8.5C6 6.8 7.5 5.5 9.5 5.5h5c2 0 3.5 1.3 3.5 3s-1.5 3-3.5 3h-5c-2 0-3.5 1.3-3.5 3s1.5 3 3.5 3h5c2 0 3.5 1.3 3.5 3" stroke="#FF5E97" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

const MidjourneyIcon = (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2"/>
    <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="4" fill="#F59E0B"/>
  </svg>
)

const StableDiffusionIcon = (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="7" stroke="#A855F7" strokeWidth="2.5"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke="#A855F7" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const RunwayIcon = (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 5h7a4.5 4.5 0 0 1 0 9H6V5zm0 9l8 5" stroke="#3B82F6" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClaudeIcon = (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4l2.5 5 5.5.8-4 3.8 1 5.4-5-2.6-5 2.6 1-5.4-4-3.8 5.5-.8L12 4z" fill="#D97706" stroke="#FBBF24" strokeWidth="1"/>
  </svg>
)

const Cinema4DIcon = (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15a4 4 0 1 1 5-3.8M18 8v8m-3-4h3" stroke="#0099FF" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

const MagnificIcon = (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm4-1l5 5" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

export const EVAPORATING_ICONS: EvaporatingIconItem[] = [
  { id: 'figma', name: 'Figma', category: 'graphic', svgIcon: FigmaIcon, goldColor: '#F24E1E', floatDelay: '0s', size: 'w-10 h-10' },
  { id: 'photoshop', name: 'Photoshop', category: 'graphic', svgIcon: PhotoshopIcon, goldColor: '#31A8FF', floatDelay: '0.4s', size: 'w-10 h-10' },
  { id: 'illustrator', name: 'Illustrator', category: 'graphic', svgIcon: IllustratorIcon, goldColor: '#FF9A00', floatDelay: '0.8s', size: 'w-10 h-10' },
  { id: 'aftereffects', name: 'After Effects', category: 'graphic', svgIcon: AfterEffectsIcon, goldColor: '#D9A5FF', floatDelay: '0.2s', size: 'w-10 h-10' },
  { id: 'blender', name: 'Blender 3D', category: 'spatial', svgIcon: BlenderIcon, goldColor: '#EA7600', floatDelay: '0.6s', size: 'w-11 h-11' },
  { id: 'spline', name: 'Spline 3D', category: 'spatial', svgIcon: SplineIcon, goldColor: '#FF5E97', floatDelay: '1.0s', size: 'w-10 h-10' },
  { id: 'midjourney', name: 'Midjourney', category: 'ai', svgIcon: MidjourneyIcon, goldColor: '#F59E0B', floatDelay: '0.3s', size: 'w-11 h-11' },
  { id: 'stablediffusion', name: 'Stable Diffusion', category: 'ai', svgIcon: StableDiffusionIcon, goldColor: '#A855F7', floatDelay: '0.7s', size: 'w-10 h-10' },
  { id: 'runway', name: 'Runway Gen-3', category: 'ai', svgIcon: RunwayIcon, goldColor: '#3B82F6', floatDelay: '0.1s', size: 'w-10 h-10' },
  { id: 'claude', name: 'Claude 3.5', category: 'ai', svgIcon: ClaudeIcon, goldColor: '#D97706', floatDelay: '0.9s', size: 'w-11 h-11' },
  { id: 'cinema4d', name: 'Cinema 4D', category: 'spatial', svgIcon: Cinema4DIcon, goldColor: '#0099FF', floatDelay: '0.5s', size: 'w-10 h-10' },
  { id: 'magnific', name: 'Magnific AI', category: 'ai', svgIcon: MagnificIcon, goldColor: '#FBBF24', floatDelay: '0.35s', size: 'w-10 h-10' },
]

interface EvaporatingSkillsIconsProps {
  opacity: number
  translateY: number
}

export function EvaporatingSkillsIcons({ opacity, translateY }: EvaporatingSkillsIconsProps) {
  const [evaporatedIds, setEvaporatedIds] = useState<Record<string, boolean>>({})

  const handleEvaporate = (id: string) => {
    if (evaporatedIds[id]) return
    setEvaporatedIds((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setEvaporatedIds((prev) => ({ ...prev, [id]: false }))
    }, 3000)
  }

  return (
    <div
      className="absolute top-1/4 left-8 md:left-16 z-50 w-80 md:w-[520px] pointer-events-auto transition-all duration-300 ease-out drop-shadow-2xl text-left"
      style={{
        opacity,
        transform: `perspective(1400px) translate3d(0px, ${translateY}px, 90px)`,
      }}
    >
      {/* SECTION HEADER */}
      <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-amber-400 uppercase drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)] mb-3">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>SKILLS &amp; TOOLS</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-serif tracking-tight leading-none mb-8 font-light bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]">
        SKILLS &amp; <span className="italic text-amber-400 font-normal">TOOLS</span>
      </h2>

      {/* PURE ANIMATED ICONS CLOUD — 3 per row, spacious */}
      <div className="flex flex-wrap items-start justify-start gap-y-8 gap-x-10 md:gap-x-12 max-w-[320px] p-2">
        {EVAPORATING_ICONS.map((item) => {
          const isEvaporated = evaporatedIds[item.id]

          return (
            <div
              key={item.id}
              onClick={() => handleEvaporate(item.id)}
              className={`relative cursor-pointer group transition-all duration-300 ${
                isEvaporated ? 'pointer-events-none' : ''
              }`}
            >
              {/* NORMAL FLOATING ICON */}
              <div
                className={`relative flex items-center justify-center p-2 rounded-2xl transition-all duration-500 hover:scale-125 ${
                  isEvaporated ? 'animate-evaporateOut' : 'animate-floatIcon'
                }`}
                style={{
                  animationDelay: item.floatDelay,
                  filter: isEvaporated
                    ? 'none'
                    : 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.4)) drop-shadow(0 0 20px rgba(245, 158, 11, 0.2))',
                }}
              >
                {/* TOOL NAME TOOLTIP ON HOVER */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 whitespace-nowrap bg-neutral-950/90 border border-amber-400/60 px-2 py-0.5 rounded text-[9px] font-mono text-amber-300 shadow-lg">
                  {item.name}
                </div>

                {/* SVG BRAND ICON */}
                {item.svgIcon}
              </div>

              {/* EVAPORATION GOLD DUST PARTICLES */}
              {isEvaporated && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span className="animate-particleUp1 absolute text-amber-300 text-xs">✨</span>
                  <span className="animate-particleUp2 absolute text-amber-400 text-sm">✦</span>
                  <span className="animate-particleUp3 absolute text-amber-200 text-xs">·</span>
                  <span className="animate-particleUp4 absolute text-amber-500 text-[10px]">+</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* KEYFRAME ANIMATIONS */}
      <style>{`
        @keyframes floatIcon {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }
        @keyframes evaporateOut {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0px);
            filter: blur(0px) drop-shadow(0 0 25px rgba(251,191,36,0.9));
          }
          50% {
            opacity: 0.6;
            transform: scale(1.6) translateY(-25px);
            filter: blur(4px) drop-shadow(0 0 35px rgba(251,191,36,1));
          }
          100% {
            opacity: 0;
            transform: scale(2.2) translateY(-60px);
            filter: blur(10px);
          }
        }
        @keyframes particleUp1 {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(-20px, -60px) scale(0.2); }
        }
        @keyframes particleUp2 {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(25px, -70px) scale(0.2); }
        }
        @keyframes particleUp3 {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(-10px, -80px) scale(0.2); }
        }
        @keyframes particleUp4 {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(15px, -50px) scale(0.2); }
        }
        .animate-floatIcon {
          animation: floatIcon 4s ease-in-out infinite;
        }
        .animate-evaporateOut {
          animation: evaporateOut 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-particleUp1 { animation: particleUp1 1.2s ease-out forwards; }
        .animate-particleUp2 { animation: particleUp2 1.4s ease-out forwards; }
        .animate-particleUp3 { animation: particleUp3 1.1s ease-out forwards; }
        .animate-particleUp4 { animation: particleUp4 1.3s ease-out forwards; }
      `}</style>
    </div>
  )
}
