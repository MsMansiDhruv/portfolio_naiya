import { useEffect, useRef, useState, useCallback } from 'react'

interface CinematicGraphicsLayerProps {
  scrollProgress: number
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  type: 'spark' | 'ripple' | 'dust'
}

let particleId = 0

export function CinematicGraphicsLayer({ scrollProgress }: CinematicGraphicsLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [flashOpacity, setFlashOpacity] = useState(0)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  // Determine act from scrollProgress for graphic variation
  const actIndex =
    scrollProgress < 0.30 ? 0
    : scrollProgress < 0.56 ? 1
    : scrollProgress < 0.80 ? 2
    : 3

  // ── Particle canvas loop ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = ['rgba(251,191,36,', 'rgba(245,158,11,', 'rgba(254,243,199,', 'rgba(252,211,77,']

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Ambient wandering dust (always present, subtle)
      if (Math.random() < 0.3) {
        particlesRef.current.push({
          id: particleId++,
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -(Math.random() * 0.4 + 0.2),
          life: 0,
          maxLife: 180 + Math.random() * 120,
          size: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: 'dust',
        })
      }

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife)

      for (const p of particlesRef.current) {
        p.life++
        p.x += p.vx
        p.y += p.vy

        const alpha = p.type === 'dust'
          ? Math.sin((p.life / p.maxLife) * Math.PI) * 0.45
          : p.type === 'spark'
          ? (1 - p.life / p.maxLife) * 0.9
          : (1 - p.life / p.maxLife) * 0.6

        if (p.type === 'ripple') {
          const radius = (p.life / p.maxLife) * 80
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
          ctx.strokeStyle = `${p.color}${alpha.toFixed(2)})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `${p.color}${alpha.toFixed(2)})`
          ctx.fill()

          if (p.type === 'spark') {
            // Elongate sparks into streaks
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x - p.vx * 6, p.y - p.vy * 6)
            ctx.strokeStyle = `${p.color}${(alpha * 0.6).toFixed(2)})`
            ctx.lineWidth = p.size * 0.8
            ctx.stroke()
          }
        }

        if (p.type === 'spark') {
          p.vy += 0.04 // gravity
          p.vx *= 0.98
        }
      }

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ── Mouse move — track position only ─────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  // ── Click — spawn gold spark burst ───────────────────────────────────
  const handleClick = useCallback((e: React.MouseEvent) => {
    const colors = ['rgba(251,191,36,', 'rgba(245,158,11,', 'rgba(254,243,199,', 'rgba(252,211,77,']
    const count = 18 + Math.floor(Math.random() * 12)
    const newParticles: Particle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 5 + 2
      return {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 0,
        maxLife: 50 + Math.floor(Math.random() * 30),
        size: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'spark',
      }
    })
    particlesRef.current.push(...newParticles)

    // Add a ripple at click point
    particlesRef.current.push({
      id: particleId++,
      x: e.clientX,
      y: e.clientY,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 40,
      size: 1,
      color: 'rgba(251,191,36,',
      type: 'ripple',
    })
  }, [])

  // ── Double click — dramatic amber flash ───────────────────────────────
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setFlashOpacity(1)
    // Add a large ripple centered on the double-click
    const count = 30
    const colors = ['rgba(251,191,36,', 'rgba(245,158,11,', 'rgba(254,243,199,']
    const newParticles: Particle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 8 + 3
      return {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        life: 0,
        maxLife: 70 + Math.floor(Math.random() * 40),
        size: Math.random() * 3.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'spark',
      }
    })
    particlesRef.current.push(...newParticles)

    // Add 3 concentric ripples
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        particlesRef.current.push({
          id: particleId++,
          x: e.clientX,
          y: e.clientY,
          vx: 0,
          vy: 0,
          life: 0,
          maxLife: 50,
          size: 1,
          color: 'rgba(251,191,36,',
          type: 'ripple',
        })
      }, i * 100)
    }

    // Fade flash out
    setTimeout(() => setFlashOpacity(0), 80)
  }, [])

  // ── Mouse hover ripple rings that follow cursor ───────────────────────
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    setRipples((prev) => [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }])
    setTimeout(() => setRipples((prev) => prev.slice(1)), 800)
  }, [])

  // SVG illustration opacity by act
  const inkOpacity = actIndex === 0 ? 0.18 : actIndex === 1 ? 0.10 : actIndex === 2 ? 0.14 : 0.08

  return (
    <div
      ref={layerRef}
      className="absolute inset-0 z-[45] pointer-events-auto"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
    >
      {/* ── PARTICLE CANVAS ─────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* ── DOUBLE-CLICK FLASH OVERLAY ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-75"
        style={{
          opacity: flashOpacity * 0.35,
          background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.9) 0%, rgba(245,158,11,0.4) 40%, transparent 70%)',
        }}
      />

      {/* ── CLICK RIPPLES ─────────────────────────────────────────────── */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute pointer-events-none rounded-full border border-amber-400/30 animate-ping"
          style={{
            left: r.x - 20,
            top: r.y - 20,
            width: 40,
            height: 40,
            animationDuration: '0.8s',
            animationIterationCount: 1,
          }}
        />
      ))}

      {/* ── SVG ILLUSTRATION LAYER: FLOWING INK STROKES ──────────────── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: inkOpacity, transition: 'opacity 1.2s ease' }}
      >
        <defs>
          <filter id="inkBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          <filter id="glowGold">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Top-left sweeping ink arc */}
        <path
          d="M -60 180 C 80 80, 280 200, 420 120 S 620 20, 780 80"
          stroke="rgba(251,191,36,0.7)"
          strokeWidth="0.8"
          fill="none"
          filter="url(#inkBlur)"
          className="animate-inkDraw1"
        />

        {/* Bottom-right complementary arc */}
        <path
          d="M 1200 900 C 1380 1020, 1560 880, 1720 960 S 1900 1060, 1980 1000"
          stroke="rgba(245,158,11,0.6)"
          strokeWidth="0.8"
          fill="none"
          filter="url(#inkBlur)"
          className="animate-inkDraw2"
        />

        {/* Packaging dieline rectangle outline — centered */}
        <rect
          x="680"
          y="300"
          width="560"
          height="480"
          rx="4"
          stroke="rgba(251,191,36,0.25)"
          strokeWidth="0.6"
          fill="none"
          strokeDasharray="8 6"
          className="animate-dieline"
        />

        {/* Inner dieline crease lines */}
        <line x1="820" y1="300" x2="820" y2="780" stroke="rgba(251,191,36,0.12)" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="1100" y1="300" x2="1100" y2="780" stroke="rgba(251,191,36,0.12)" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="680" y1="480" x2="1240" y2="480" stroke="rgba(251,191,36,0.12)" strokeWidth="0.5" strokeDasharray="4 8" />

        {/* Organic blob — bottom left texture */}
        <ellipse
          cx="160"
          cy="820"
          rx="120"
          ry="70"
          stroke="rgba(251,191,36,0.15)"
          strokeWidth="0.7"
          fill="none"
          filter="url(#inkBlur)"
          className="animate-breathe"
        />

        {/* Top-right corner filigree */}
        <path
          d="M 1760 40 Q 1820 80 1780 140 T 1840 200"
          stroke="rgba(254,243,199,0.3)"
          strokeWidth="0.7"
          fill="none"
          filter="url(#glowGold)"
          className="animate-breathe2"
        />

        {/* Floating golden crosshair reticle — center screen */}
        <g transform="translate(960, 540)" className="animate-reticle">
          <circle cx="0" cy="0" r="32" stroke="rgba(251,191,36,0.18)" strokeWidth="0.6" fill="none" />
          <circle cx="0" cy="0" r="8" stroke="rgba(251,191,36,0.35)" strokeWidth="0.5" fill="none" />
          <line x1="-48" y1="0" x2="-16" y2="0" stroke="rgba(251,191,36,0.3)" strokeWidth="0.6" />
          <line x1="16" y1="0" x2="48" y2="0" stroke="rgba(251,191,36,0.3)" strokeWidth="0.6" />
          <line x1="0" y1="-48" x2="0" y2="-16" stroke="rgba(251,191,36,0.3)" strokeWidth="0.6" />
          <line x1="0" y1="16" x2="0" y2="48" stroke="rgba(251,191,36,0.3)" strokeWidth="0.6" />
        </g>

        {/* Scattered micro-dots */}
        {[
          [340, 200], [1580, 320], [900, 160], [1400, 700], [240, 600],
          [1700, 180], [520, 880], [1200, 940], [100, 400], [1850, 580]
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={Math.random() > 0.5 ? 1.5 : 1}
            fill={`rgba(251,191,36,${0.15 + (i % 3) * 0.08})`}
            className={i % 2 === 0 ? 'animate-breathe' : 'animate-breathe2'}
          />
        ))}
      </svg>

      {/* ── KEYFRAME STYLES ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes inkDraw1 {
          0%, 100% { stroke-dashoffset: 1200; stroke-dasharray: 1200 1200; opacity: 0.4; }
          30% { stroke-dashoffset: 0; stroke-dasharray: 1200 1200; opacity: 0.9; }
          70% { stroke-dashoffset: 0; opacity: 0.7; }
        }
        @keyframes inkDraw2 {
          0%, 100% { stroke-dashoffset: 1000; stroke-dasharray: 1000 1000; opacity: 0.3; }
          40% { stroke-dashoffset: 0; stroke-dasharray: 1000 1000; opacity: 0.8; }
        }
        @keyframes dieline {
          0%, 100% { stroke-dashoffset: 0; opacity: 0.5; }
          50% { stroke-dashoffset: 40; opacity: 0.8; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes breathe2 {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.4; }
          50% { transform: scale(1.05) rotate(3deg); opacity: 0.8; }
        }
        @keyframes reticle {
          0%, 100% { transform: translate(960px, 540px) rotate(0deg) scale(1); opacity: 0.5; }
          25% { transform: translate(960px, 540px) rotate(45deg) scale(1.05); opacity: 0.9; }
          75% { transform: translate(960px, 540px) rotate(90deg) scale(0.97); opacity: 0.7; }
        }
        .animate-inkDraw1 { animation: inkDraw1 8s ease-in-out infinite; }
        .animate-inkDraw2 { animation: inkDraw2 10s ease-in-out infinite 2s; }
        .animate-dieline { animation: dieline 6s ease-in-out infinite; }
        .animate-breathe { animation: breathe 5s ease-in-out infinite; }
        .animate-breathe2 { animation: breathe2 7s ease-in-out infinite 1.5s; }
        .animate-reticle { animation: reticle 12s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
