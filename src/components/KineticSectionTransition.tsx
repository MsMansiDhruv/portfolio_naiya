import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { Target, Compass, Cpu, Activity, Disc } from 'lucide-react'

interface KineticSectionTransitionProps {
  label: string
  sublabel?: string
  code?: string
  variant?: 'ticker' | 'frequency' | 'aperture' | 'timecode' | 'coordinate' | 'blade'
}

export function KineticSectionTransition({
  label,
  sublabel = 'TACTILE ARCHITECTURE',
  code = 'SEAM-01',
  variant = 'frequency'
}: KineticSectionTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const [eqBars] = useState(() => Array.from({ length: 36 }, (_, i) => i))

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      // Expanding score line scrubbed to scroll
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 95%',
              end: 'bottom 40%',
              scrub: 1
            }
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden select-none pointer-events-none py-6 z-40 bg-gradient-to-b from-black via-[#080808] to-black"
    >
      {/* ── VARIANT 1: SINGLE REFINED TICKER TAPE (ONLY USED ONCE) ── */}
      {variant === 'ticker' && (
        <div className="w-full overflow-hidden flex border-y border-amber-500/20 bg-neutral-950/80 py-3 backdrop-blur-md">
          <div className="flex animate-marquee-left whitespace-nowrap space-x-8 text-[9px] font-mono tracking-[0.25em] uppercase text-neutral-400">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-6 shrink-0">
                <span className="text-amber-400 font-bold">{code}</span>
                <span className="text-neutral-600">-</span>
                <span className="text-white font-medium">{label}</span>
                <span className="text-amber-500/80 font-serif italic text-xs">[{sublabel}]</span>
                <span className="text-neutral-600">-</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-neutral-400">SCALE 1:1</span>
                <span className="text-neutral-600">-</span>
                <span className="text-amber-300">CMYK SPOT REGISTRATION (+) 0.05MM</span>
                <span className="text-neutral-600">-</span>
                <span className="text-neutral-400">FPS: 60</span>
                <span className="text-neutral-600">-</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VARIANT 2: PROMINENT GLOWING FREQUENCY OSCILLATOR ── */}
      {variant === 'frequency' && (
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col items-center">
          {/* Header indicator */}
          <div className="w-full flex items-center justify-between text-[9px] font-mono tracking-widest text-neutral-400 uppercase mb-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>FREQUENCY HARMONIC - 48.000 KHZ</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono tracking-[0.2em]">
              {code} - {label}
            </div>
            <div className="flex items-center space-x-2 text-neutral-400">
              <span>AMPLITUDE: 0.92</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            </div>
          </div>

          {/* DUAL GLOWING SINE WAVE WARP OSCILLATOR */}
          <div className="relative w-full h-16 overflow-hidden flex items-center justify-center my-1 bg-black/60 rounded-xl border border-white/5 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
            {/* Ambient gold glow backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent blur-md pointer-events-none" />

            <svg className="w-full h-14 stroke-amber-400 fill-none" preserveAspectRatio="none" viewBox="0 0 1200 60">
              <defs>
                <filter id="glow-wave" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Main Carrier Wave */}
              <path 
                d="M0,30 Q75,5 150,30 T300,30 T450,30 T600,30 T750,30 T900,30 T1050,30 T1200,30" 
                strokeWidth="2" 
                filter="url(#glow-wave)"
                className="animate-wave-carrier text-amber-300"
              />

              {/* Harmonic Modulation Wave */}
              <path 
                d="M0,30 Q75,55 150,30 T300,30 T450,30 T600,30 T750,30 T900,30 T1050,30 T1200,30" 
                strokeWidth="1.2" 
                strokeDasharray="6 4"
                className="animate-wave-harmonic text-amber-500/70"
              />
            </svg>

            {/* Central Frequency HUD Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-center space-x-3 px-3 py-1 rounded bg-black/80 border border-amber-500/40 text-[8px] font-mono text-amber-300 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>PHASE LOCK: +45.0 DEG</span>
                <span className="text-neutral-600">-</span>
                <span className="text-neutral-400">CARRIER: ACTIVE</span>
              </div>
            </div>
          </div>

          {/* DANCING FREQUENCY SPECTRUM BARS (AFTER EFFECTS EQUALIZER) */}
          <div className="w-full flex items-end justify-between h-5 px-4 mt-2">
            {eqBars.map((idx) => {
              const animDuration = 0.6 + (idx % 5) * 0.2
              const animDelay = (idx % 7) * 0.1
              return (
                <div
                  key={idx}
                  className="w-[2px] rounded-full bg-gradient-to-t from-amber-500/30 via-amber-400 to-amber-300"
                  style={{
                    animation: `eqBounce ${animDuration}s ease-in-out infinite alternate`,
                    animationDelay: `${animDelay}s`,
                    minHeight: '4px'
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* ── VARIANT 3: OPTICAL APERTURE & ROTATING RETICLE ── */}
      {variant === 'aperture' && (
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
            <div className="w-5 h-5 rounded-full border border-amber-500/40 flex items-center justify-center animate-spin-slow">
              <span className="w-2.5 h-[1px] bg-amber-400" />
              <span className="h-2.5 w-[1px] bg-amber-400 absolute" />
            </div>
            <span>OPTICAL SHUTTER: 180 DEG</span>
          </div>

          <div className="flex items-center space-x-3 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-amber-500/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Target className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-mono text-[9px] font-bold tracking-[0.2em]">{code}</span>
            <span className="text-neutral-500">-</span>
            <span className="font-mono text-[9px] tracking-wider text-white">{label}</span>
          </div>

          <div className="flex items-center space-x-3 text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
            <span>FOCAL DISTANCE: 50MM</span>
            <div className="w-5 h-5 rounded-full border border-amber-500/40 flex items-center justify-center animate-spin-reverse">
              <span className="w-2.5 h-[1px] bg-amber-400" />
              <span className="h-2.5 w-[1px] bg-amber-400 absolute" />
            </div>
          </div>
        </div>
      )}

      {/* ── VARIANT 4: SMPTE TIMECODE & FILM ROLLER ── */}
      {variant === 'timecode' && (
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>SMPTE TIMECODE - [00:04:18:24]</span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-neutral-950">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-white font-medium">{code}</span>
            <span className="text-neutral-500">-</span>
            <span className="text-amber-300">{label}</span>
          </div>

          <div className="flex items-center space-x-2 text-neutral-400">
            <span>RENDER PASS: PROD_V4</span>
            <span className="text-amber-400">2400 DPI</span>
          </div>
        </div>
      )}

      {/* ── VARIANT 5: SWISS BASELINE COORDINATES ── */}
      {variant === 'coordinate' && (
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
          <div className="flex items-center space-x-2">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>LAT 37.7749 N - LON 122.4194 W</span>
          </div>

          <div className="flex items-center space-x-2 text-amber-300 font-semibold tracking-[0.2em]">
            <span>{code}</span>
            <span className="text-neutral-600">-</span>
            <span className="text-white">{label}</span>
          </div>

          <div>
            <span>GRID: 8PT MODULAR SYSTEM</span>
          </div>
        </div>
      )}

      {/* ── VARIANT 6: GOLDEN SCORE BLADE ── */}
      {variant === 'blade' && (
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-center">
          <div className="flex items-center space-x-3 px-4 py-1.5 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-300 text-[9px] font-mono tracking-[0.25em]">
            <Disc className="w-3 h-3 text-amber-400 animate-spin-slow" />
            <span>{code} - {label}</span>
          </div>
        </div>
      )}

      {/* Expanding score line blade */}
      <div 
        ref={lineRef} 
        className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent mt-3 origin-center shadow-[0_0_12px_rgba(245,158,11,0.5)]" 
      />

      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marqueeLeft 22s linear infinite;
        }

        @keyframes waveCarrier {
          0% { transform: translateX(0); }
          50% { transform: translateX(-60px) scaleY(1.3); }
          100% { transform: translateX(0); }
        }
        .animate-wave-carrier {
          animation: waveCarrier 4s ease-in-out infinite;
        }

        @keyframes waveHarmonic {
          0% { transform: translateX(0); }
          50% { transform: translateX(60px) scaleY(0.7); }
          100% { transform: translateX(0); }
        }
        .animate-wave-harmonic {
          animation: waveHarmonic 6s ease-in-out infinite;
        }

        @keyframes eqBounce {
          0% { height: 3px; opacity: 0.3; }
          100% { height: 18px; opacity: 1; }
        }

        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }

        @keyframes spinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spinReverse 16s linear infinite;
        }
      `}</style>
    </div>
  )
}
