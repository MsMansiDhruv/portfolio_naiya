import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

type Point = { x: number, y: number }

interface Shard {
  id: string
  d: string
  cx: number
  cy: number
  vx: number
  vy: number
  rot: number
}

interface Spark {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

interface ShatterInstance {
  id: string
  centroid: Point
  shards: Shard[]
  sparks: Spark[]
}

// Robust helper: verifies whether the clicked target is an interactive button, link, or 3D canvas
function isInteractiveElement(target: HTMLElement | null): boolean {
  if (!target) return false

  // 1. Direct interactive UI controls & cards
  if (target.closest('button, a, input, textarea, select, label, [role="button"], [role="tab"], [role="dialog"], [data-no-pen]')) {
    return true
  }

  // 2. 3D WebGL Canvas elements (so user can orbit Three.js without dropping pen vertices)
  if (target.closest('canvas')) {
    return true
  }

  // 3. Header navigation, capsules, and active modals
  if (target.closest('header, nav, .main-header-nav, .site-nav, .modal, [data-modal]')) {
    return true
  }

  return false
}

export function InteractivePenTool() {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Only enable pen tool on desktop devices with fine pointer (mouse)
    const isTouch = 
      typeof window !== 'undefined' && 
      (window.matchMedia('(pointer: coarse)').matches || 
       ('ontouchstart' in window) || 
       window.innerWidth < 1024)
    setIsSupported(!isTouch)
  }, [])

  const requestRef = useRef<number>(0)
  const trailPathRef = useRef<SVGPathElement>(null)
  const mouseRef = useRef<Point>({ x: -100, y: -100 })
  const trailPointsRef = useRef<Point[]>([])

  const [currentPath, setCurrentPath] = useState<Point[]>([])
  const currentPathRef = useRef<Point[]>([])
  const [hoverPos, setHoverPos] = useState<Point>({ x: -100, y: -100 })
  const [isNearStartVertex, setIsNearStartVertex] = useState<boolean>(false)

  // Closed shape waiting for double-click or auto-shatter timeout
  const [activeClosedShape, setActiveClosedShape] = useState<Point[] | null>(null)
  const autoShatterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closedShapeRef = useRef<Point[] | null>(null)

  // Active shatter explosions
  const [shatterInstances, setShatterInstances] = useState<ShatterInstance[]>([])
  const shardElementsRef = useRef<{ [key: string]: SVGPathElement | null }>({})
  const sparkElementsRef = useRef<{ [key: string]: SVGCircleElement | null }>({})
  const shockwaveRef = useRef<{ [key: string]: SVGCircleElement | null }>({})

  // Compute Centroid of a polygon
  const computeCentroid = (points: Point[]): Point => {
    let cx = 0
    let cy = 0
    points.forEach(p => {
      cx += p.x
      cy += p.y
    })
    return { x: cx / points.length, y: cy / points.length }
  }

  // Deconstruct a closed polygon into crystalline shatter shards
  const createShardsFromPolygon = (points: Point[]): { shards: Shard[], centroid: Point, sparks: Spark[] } => {
    const centroid = computeCentroid(points)
    const shards: Shard[] = []
    const sparks: Spark[] = []
    const numPoints = points.length

    for (let i = 0; i < numPoints; i++) {
      const p1 = points[i]
      const p2 = points[(i + 1) % numPoints]

      const mx = (p1.x + p2.x) / 2
      const my = (p1.y + p2.y) / 2

      const c1x = (p1.x + mx + centroid.x) / 3
      const c1y = (p1.y + my + centroid.y) / 3
      const a1 = Math.atan2(c1y - centroid.y, c1x - centroid.x)
      const speed1 = 90 + Math.random() * 160

      shards.push({
        id: `shard-${i}-a-${Date.now()}-${Math.random()}`,
        d: `M ${p1.x} ${p1.y} L ${mx} ${my} L ${centroid.x} ${centroid.y} Z`,
        cx: c1x,
        cy: c1y,
        vx: Math.cos(a1) * speed1,
        vy: Math.sin(a1) * speed1,
        rot: (Math.random() - 0.5) * 500
      })

      const c2x = (mx + p2.x + centroid.x) / 3
      const c2y = (my + p2.y + centroid.y) / 3
      const a2 = Math.atan2(c2y - centroid.y, c2x - centroid.x)
      const speed2 = 90 + Math.random() * 160

      shards.push({
        id: `shard-${i}-b-${Date.now()}-${Math.random()}`,
        d: `M ${mx} ${my} L ${p2.x} ${p2.y} L ${centroid.x} ${centroid.y} Z`,
        cx: c2x,
        cy: c2y,
        vx: Math.cos(a2) * speed2,
        vy: Math.sin(a2) * speed2,
        rot: (Math.random() - 0.5) * 500
      })
    }

    for (let s = 0; s < 18; s++) {
      const angle = (s / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
      const sparkSpeed = 120 + Math.random() * 180
      sparks.push({
        id: `spark-${s}-${Date.now()}-${Math.random()}`,
        x: centroid.x,
        y: centroid.y,
        vx: Math.cos(angle) * sparkSpeed,
        vy: Math.sin(angle) * sparkSpeed,
        size: 1.5 + Math.random() * 2.5
      })
    }

    return { shards, centroid, sparks }
  }

  // Trigger the Shatter Explosion
  const triggerShatter = useCallback((shapePoints: Point[]) => {
    if (shapePoints.length < 3) return

    if (autoShatterTimerRef.current) {
      clearTimeout(autoShatterTimerRef.current)
      autoShatterTimerRef.current = null
    }

    setActiveClosedShape(null)
    closedShapeRef.current = null
    setCurrentPath([])
    currentPathRef.current = []

    const { shards, centroid, sparks } = createShardsFromPolygon(shapePoints)
    const instanceId = `shatter-${Date.now()}`

    const newInstance: ShatterInstance = {
      id: instanceId,
      centroid,
      shards,
      sparks
    }

    setShatterInstances(prev => [...prev, newInstance])

    requestAnimationFrame(() => {
      const shockwave = shockwaveRef.current[instanceId]
      if (shockwave) {
        gsap.fromTo(shockwave, 
          { attr: { r: 5 }, opacity: 1, strokeWidth: 4 },
          { attr: { r: 120 }, opacity: 0, strokeWidth: 0.5, duration: 0.6, ease: 'power2.out' }
        )
      }

      shards.forEach((shard) => {
        const el = shardElementsRef.current[shard.id]
        if (!el) return
        gsap.to(el, {
          x: shard.vx,
          y: shard.vy + 40,
          rotation: shard.rot,
          scale: 0.2,
          opacity: 0,
          duration: 0.75 + Math.random() * 0.35,
          ease: 'power3.out'
        })
      })

      sparks.forEach((spark) => {
        const el = sparkElementsRef.current[spark.id]
        if (!el) return
        gsap.to(el, {
          x: spark.vx,
          y: spark.vy + 20,
          opacity: 0,
          scale: 0,
          duration: 0.6 + Math.random() * 0.3,
          ease: 'power2.out'
        })
      })

      setTimeout(() => {
        setShatterInstances(prev => prev.filter(inst => inst.id !== instanceId))
      }, 1200)
    })
  }, [])

  const closeShape = useCallback((points: Point[]) => {
    setActiveClosedShape(points)
    closedShapeRef.current = points
    setCurrentPath([])
    currentPathRef.current = []
    setIsNearStartVertex(false)

    if (autoShatterTimerRef.current) {
      clearTimeout(autoShatterTimerRef.current)
    }

    autoShatterTimerRef.current = setTimeout(() => {
      if (closedShapeRef.current) {
        triggerShatter(closedShapeRef.current)
      }
    }, 1400)
  }, [triggerShatter])

  useEffect(() => {
    if (!isSupported) return

    let mouseMoved = false

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const isOverNoPenZone = isInteractiveElement(target)

      if (isOverNoPenZone) {
        // Suppress pen trail and guide lines over navigation and interactive elements
        trailPointsRef.current = []
        if (trailPathRef.current) {
          trailPathRef.current.setAttribute('d', '')
        }
        setHoverPos({ x: -100, y: -100 })
        setIsNearStartVertex(false)
        return
      }

      mouseRef.current = { x: e.clientX, y: e.clientY }
      mouseMoved = true

      if (currentPathRef.current.length > 0) {
        setHoverPos({ x: e.clientX, y: e.clientY })

        if (currentPathRef.current.length >= 3) {
          const startVertex = currentPathRef.current[0]
          const distToStart = Math.hypot(e.clientX - startVertex.x, e.clientY - startVertex.y)
          setIsNearStartVertex(distToStart <= 22)
        } else {
          setIsNearStartVertex(false)
        }
      } else {
        setIsNearStartVertex(false)
      }
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Strictly prevent pen tool from triggering when clicking on buttons, links, frames, cards, or canvases
      if (isInteractiveElement(target)) {
        return
      }

      if (closedShapeRef.current) {
        triggerShatter(closedShapeRef.current)
        return
      }

      const pts = currentPathRef.current

      if (pts.length >= 3) {
        const startVertex = pts[0]
        const distToStart = Math.hypot(e.clientX - startVertex.x, e.clientY - startVertex.y)
        if (distToStart <= 22) {
          closeShape(pts)
          return
        }
      }

      setCurrentPath(prev => {
        const next = [...prev, { x: e.clientX, y: e.clientY }]
        currentPathRef.current = next
        return next
      })
    }

    const handleDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isInteractiveElement(target)) return

      if (closedShapeRef.current) {
        triggerShatter(closedShapeRef.current)
        return
      }

      if (currentPathRef.current.length >= 3) {
        triggerShatter(currentPathRef.current)
        return
      }

      if (window.getSelection) {
        window.getSelection()?.removeAllRanges()
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      if (currentPathRef.current.length > 0 || closedShapeRef.current) {
        e.preventDefault()
        if (autoShatterTimerRef.current) {
          clearTimeout(autoShatterTimerRef.current)
        }
        setActiveClosedShape(null)
        closedShapeRef.current = null
        setCurrentPath([])
        currentPathRef.current = []
        setIsNearStartVertex(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (autoShatterTimerRef.current) {
          clearTimeout(autoShatterTimerRef.current)
        }
        setActiveClosedShape(null)
        closedShapeRef.current = null
        setCurrentPath([])
        currentPathRef.current = []
        setIsNearStartVertex(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    window.addEventListener('dblclick', handleDoubleClick)
    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('keydown', handleKeyDown)

    const animate = () => {
      const trail = trailPointsRef.current
      if (mouseMoved) {
        trail.push({ ...mouseRef.current })
        if (trail.length > 5) trail.shift()
        mouseMoved = false

        if (trailPathRef.current && trail.length > 1) {
          let d = `M ${trail[0].x} ${trail[0].y}`
          for (let i = 1; i < trail.length; i++) {
            d += ` L ${trail[i].x} ${trail[i].y}`
          }
          trailPathRef.current.setAttribute('d', d)
        }
      } else if (trail.length > 0) {
        trail.shift()
        if (trailPathRef.current) {
          if (trail.length > 1) {
            let d = `M ${trail[0].x} ${trail[0].y}`
            for (let i = 1; i < trail.length; i++) {
              d += ` L ${trail[i].x} ${trail[i].y}`
            }
            trailPathRef.current.setAttribute('d', d)
          } else {
            trailPathRef.current.setAttribute('d', '')
          }
        }
      }
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('dblclick', handleDoubleClick)
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('keydown', handleKeyDown)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      if (autoShatterTimerRef.current) clearTimeout(autoShatterTimerRef.current)
    }
  }, [closeShape, triggerShatter])

  const renderPath = (pts: Point[], close: boolean) => {
    if (pts.length === 0) return ''
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i].x} ${pts[i].y}`
    }
    if (close) d += ' Z'
    return d
  }

  if (!isSupported) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] select-none">
      <svg className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="closedCanvasGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* 1. MOUSE TRAIL */}
        <path
          ref={trailPathRef}
          fill="none"
          stroke="rgba(212, 175, 55, 0.4)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'blur(2px)' }}
        />

        {/* 2. ACTIVE CLOSED SHAPE CANVAS */}
        {activeClosedShape && (
          <g className="animate-pulse">
            <path
              d={renderPath(activeClosedShape, true)}
              fill="url(#closedCanvasGlow)"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_20px_rgba(212,175,55,0.7)]"
            />
            {activeClosedShape.map((p, i) => (
              <rect
                key={i}
                x={p.x - 3.5}
                y={p.y - 3.5}
                width="7"
                height="7"
                fill="#FFF"
                stroke="#D4AF37"
                strokeWidth="1.5"
              />
            ))}
            {(() => {
              const c = computeCentroid(activeClosedShape)
              return (
                <g transform={`translate(${c.x}, ${c.y})`}>
                  <rect
                    x="-65"
                    y="-12"
                    width="130"
                    height="24"
                    rx="12"
                    fill="rgba(0, 0, 0, 0.85)"
                    stroke="rgba(212, 175, 55, 0.6)"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="4"
                    fill="#FDE68A"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    letterSpacing="0.1em"
                  >
                    DBL-CLICK TO SHATTER
                  </text>
                </g>
              )
            })()}
          </g>
        )}

        {/* 3. CURRENT DRAWING PATH & START VERTEX SNAP */}
        {currentPath.length > 0 && (
          <g>
            <path
              d={renderPath(
                isNearStartVertex 
                  ? [...currentPath, currentPath[0]] 
                  : [...currentPath, hoverPos], 
                isNearStartVertex
              )}
              fill={isNearStartVertex ? "rgba(212, 175, 55, 0.1)" : "none"}
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeDasharray={isNearStartVertex ? "none" : "4 4"}
            />

            {currentPath.map((p, i) => {
              const isStart = i === 0
              return (
                <g key={i}>
                  <rect
                    x={p.x - 3.5}
                    y={p.y - 3.5}
                    width="7"
                    height="7"
                    fill={isStart && isNearStartVertex ? "#D4AF37" : "#FFF"}
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                  />
                  {isStart && currentPath.length >= 3 && (
                    <g>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isNearStartVertex ? 12 : 7}
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth={isNearStartVertex ? "2" : "1"}
                        className={isNearStartVertex ? "animate-ping opacity-75" : "opacity-40"}
                      />
                      {isNearStartVertex && (
                        <text
                          x={p.x + 16}
                          y={p.y + 4}
                          fill="#FDE68A"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          letterSpacing="0.1em"
                        >
                          CLOSE SHAPE
                        </text>
                      )}
                    </g>
                  )}
                </g>
              )
            })}

            {!isNearStartVertex && (
              <rect
                x={hoverPos.x - 3.5}
                y={hoverPos.y - 3.5}
                width="7"
                height="7"
                fill="transparent"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1"
              />
            )}
          </g>
        )}

        {/* 4. ACTIVE SHATTER EXPLOSIONS */}
        {shatterInstances.map((inst) => (
          <g key={inst.id}>
            <circle
              ref={(el) => { shockwaveRef.current[inst.id] = el }}
              cx={inst.centroid.x}
              cy={inst.centroid.y}
              r="10"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
            />

            {inst.shards.map((shard) => (
              <path
                key={shard.id}
                ref={(el) => { shardElementsRef.current[shard.id] = el }}
                d={shard.d}
                fill="rgba(212, 175, 55, 0.45)"
                stroke="#FDE68A"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
              />
            ))}

            {inst.sparks.map((spark) => (
              <circle
                key={spark.id}
                ref={(el) => { sparkElementsRef.current[spark.id] = el }}
                cx={spark.x}
                cy={spark.y}
                r={spark.size}
                fill="#FFF"
                className="drop-shadow-[0_0_6px_rgba(255,215,0,0.9)]"
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  )
}
