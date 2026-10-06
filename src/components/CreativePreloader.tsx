import { useEffect, useState, useRef } from 'react'
import { runPortfolioPreloader, type PreloadProgress } from '../utils/assetCacheManager'

interface CreativePreloaderProps {
  onComplete: () => void
  onStartReveal?: () => void
}

export function CreativePreloader({ onComplete, onStartReveal }: CreativePreloaderProps) {
  const [progressState, setProgressState] = useState<PreloadProgress>({
    percent: 0,
    stage: 'INITIALIZING DESIGN ENVIRONMENT',
    isComplete: false,
  })
  const [isExiting, setIsExiting] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Smoothly interpolated progress for fluid 60fps counter ticks
  const [displayPercent, setDisplayPercent] = useState(0)

  // ── Guaranteed Minimum 10-Second Render & Buffering Window ──
  useEffect(() => {
    let isCancelled = false
    const startTime = Date.now()
    const MINIMUM_DURATION_MS = 10000 // At least 10 seconds to render all webpage assets behind the scenes

    // Background asset caching and warm-up
    const preloadPromise = runPortfolioPreloader()

    let frameId: number
    const tickProgress = () => {
      const elapsed = Date.now() - startTime
      const progressFraction = Math.min(1, elapsed / MINIMUM_DURATION_MS)

      // Calculate percentage from 00 to 100 smoothly over 10 seconds
      const currentPercent = Math.min(100, Math.floor(progressFraction * 100))
      setDisplayPercent(currentPercent)

      // Sophisticated minimal telemetry stages spanning the full 10 seconds
      let stageText = 'INITIALIZING GRAPHIC DESIGN ATELIER'
      if (currentPercent >= 92) {
        stageText = 'ALL ASSETS RENDERED IN MEMORY // COMMENCING REVEAL'
      } else if (currentPercent >= 70) {
        stageText = 'WARMING HARDWARE ACCELERATION & SHADERS'
      } else if (currentPercent >= 45) {
        stageText = 'STREAMING HIGH-RES PORTFOLIO MEDIA & DIELINES'
      } else if (currentPercent >= 20) {
        stageText = 'BUFFERING CINEMATIC SCRUB SEQUENCES IN RAM'
      }

      setProgressState({
        percent: currentPercent,
        stage: stageText,
        isComplete: currentPercent >= 100,
      })

      if (progressFraction < 1) {
        frameId = requestAnimationFrame(tickProgress)
      } else {
        // Full 10 seconds completed — ensure asset promise is settled or safely timed out, then exit
        Promise.race([
          preloadPromise.catch(() => {}),
          new Promise((r) => setTimeout(r, 600)),
        ]).then(() => {
          if (isCancelled) return
          // Brief hold at 100% for visual accomplishment
          setTimeout(() => {
            if (!isCancelled) {
              onStartReveal?.() // Trigger landing page text animation synchronously as curtain lifts
              setIsExiting(true)
              setTimeout(() => {
                if (!isCancelled) {
                  setIsDone(true)
                  onComplete()
                }
              }, 850) // Smooth curtain slide duration
            }
          }, 350)
        })
      }
    }

    frameId = requestAnimationFrame(tickProgress)

    return () => {
      isCancelled = true
      cancelAnimationFrame(frameId)
    }
  }, [onComplete, onStartReveal])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // ── Small Ambient Drifting Particles ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    interface Particle {
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      baseAlpha: number
      phase: number
      phaseSpeed: number
      color: string
    }

    const PARTICLE_COUNT = 45
    const particles: Particle[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.8 + Math.random() * 1.4, // Small particles
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.45, // Slow upward float
        baseAlpha: 0.25 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.02 + Math.random() * 0.03,
        color: Math.random() > 0.4 ? '245, 158, 11' : '253, 230, 138', // Amber / Gold
      })
    }

    // ── Mouse Direction Tracking ──
    let lastMouseX: number | null = null
    let lastMouseY: number | null = null
    let mouseVx = 0
    let mouseVy = 0

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      if (lastMouseX !== null && lastMouseY !== null) {
        const dx = clientX - lastMouseX
        const dy = clientY - lastMouseY
        // Impart directional velocity along mouse travel vector
        mouseVx = mouseVx * 0.65 + dx * 0.12
        mouseVy = mouseVy * 0.65 + dy * 0.12

        // Clamp impulse for natural physical motion
        const maxV = 7.0
        mouseVx = Math.max(-maxV, Math.min(maxV, mouseVx))
        mouseVy = Math.max(-maxV, Math.min(maxV, mouseVy))
      }
      lastMouseX = clientX
      lastMouseY = clientY
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth exponential decay of mouse momentum
      mouseVx *= 0.92
      mouseVy *= 0.92

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Proximity factor: particles near cursor react with stronger directional flow
        let proximityBoost = 1
        if (lastMouseX !== null && lastMouseY !== null) {
          const dist = Math.hypot(p.x - lastMouseX, p.y - lastMouseY)
          if (dist < 450) {
            proximityBoost = 1 + (1 - dist / 450) * 1.8
          }
        }

        // Move according to base drift plus mouse direction force
        p.x += p.vx + mouseVx * proximityBoost
        p.y += p.vy + mouseVy * proximityBoost
        p.phase += p.phaseSpeed

        // Wrap around boundaries with padding
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        const currentAlpha = Math.max(0.1, p.baseAlpha + Math.sin(p.phase) * 0.2)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`
        ctx.shadowColor = `rgba(${p.color}, 0.8)`
        ctx.shadowBlur = 6
        ctx.fill()
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
    }
  }, [])

  if (isDone) return null

  return (
    <aside
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio assets and motion timelines"
      className={`fixed inset-0 z-[9999] bg-[#040407] text-neutral-100 flex flex-col items-center justify-center p-8 md:p-14 overflow-hidden select-none transition-all duration-[850ms] ${
        isExiting
          ? '-translate-y-full opacity-90 ease-[cubic-bezier(0.76,0,0.24,1)]'
          : 'translate-y-0 opacity-100'
      }`}
      style={{
        boxShadow: isExiting ? '0 50px 100px rgba(0,0,0,0.95)' : 'none',
      }}
    >
      {/* Background Architectural Grid & Radiant Warm Amber Ambient Core */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="ambient-glow-core absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-transparent blur-[160px] rounded-full pointer-events-none" />

      {/* Small Moving Ambient Gold Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {/* ── CENTERPIECE: MINIMAL HORIZONTAL LINE & LUXURY MONOGRAM ── */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none max-w-lg mx-auto w-full px-4">
        {/* Minimal Monogram / Name Typography */}
        <div className="text-center mb-8">
          <img 
            src="/logo_mark_transparent.png" 
            alt="Naiya Dhruv Monogram" 
            className="w-14 h-14 mx-auto mb-4 object-contain drop-shadow-[0_0_24px_rgba(245,158,11,0.4)]" 
          />
          <h1 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-[0.25em] uppercase">
            Naiya Dhruv
          </h1>
        </div>

        {/* ── SIMPLE MINIMAL HORIZONTAL LINE (THEME OF WEBSITE COLOR) ── */}
        <div className="w-full max-w-md h-[2px] bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 transition-all duration-100 ease-out"
            style={{
              width: `${displayPercent}%`,
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.85)',
            }}
          />
        </div>

        {/* Minimal Counter & Status */}
        <div className="w-full max-w-md flex items-center justify-between mt-3 text-[10px] font-mono tracking-widest">
          <span className="text-neutral-400 uppercase truncate max-w-[280px]">
            {progressState.stage}
          </span>
          <span className="text-amber-300 font-semibold">
            {displayPercent.toString().padStart(2, '0')}%
          </span>
        </div>
      </div>
    </aside>
  )
}
