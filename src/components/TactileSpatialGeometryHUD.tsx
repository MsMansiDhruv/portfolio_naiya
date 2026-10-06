import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { MousePointerClick } from 'lucide-react'

interface ProcessPhase {
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
}

const PHASES: ProcessPhase[] = [
  {
    id: '01',
    number: '01',
    phase: 'DISCOVERY',
    title: 'Shelf Audit & Packaging Format',
    summary: 'Analyzing retail shelf contrast, packaging shapes, material choices, and brand positioning.',
    spec: {
      substrate: '350gsm Uncoated Kraft',
      grid: 'Modular Layout Grid',
      finish: 'Matte Varnish Seal',
      tolerance: 'Exact Die Alignment'
    }
  },
  {
    id: '02',
    number: '02',
    phase: 'GEOMETRY',
    title: 'Box Layout & Packaging Artwork',
    summary: 'Structuring folding box layouts, tuck flaps, panel proportions, and label placements.',
    spec: {
      substrate: 'Rigid Greyboard Core',
      grid: 'Golden Ratio Geometry',
      finish: 'Foil Stamp Emboss',
      tolerance: 'Clean Flap Alignment'
    }
  },
  {
    id: '03',
    number: '03',
    phase: 'TYPOGRAPHY',
    title: 'Typographic Architecture & Micro-Copy',
    summary: 'Establishing rigorous baseline typography, bilingual legal lockups, and high-impact optical shelf hierarchy.',
    spec: {
      substrate: 'Fedrigoni Materica 180gsm',
      grid: '8pt Baseline Grid',
      finish: 'Blind Deboss 0.8mm',
      tolerance: 'Optical Kerning Tables'
    }
  },
  {
    id: '04',
    number: '04',
    phase: 'PRODUCTION',
    title: 'Color Separation & Press Calibration',
    summary: 'On-press inspection, Pantone spot color balancing, and batch-proof verification across retail lines.',
    spec: {
      substrate: 'Spot Metallic Ink + CMYK',
      grid: 'Press Sheet Impose Grid',
      finish: 'Cold Foil Registration',
      tolerance: 'Delta-E < 1.0 Strict'
    }
  }
]

export function TactileSpatialGeometryHUD() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0)
  const activePhaseRef = useRef(0)
  const mountRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Mouse & Scroll Parallax refs
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const modelRotationRef = useRef({ x: 0.2, y: -0.4, targetX: 0.2, targetY: -0.4 })
  const scrollRotationRef = useRef({ y: 0, x: 0 })

  const selectPhase = useCallback((idx: number) => {
    activePhaseRef.current = idx
    setActivePhaseIndex(idx)
    // Dynamic interactive feedback: clear 60deg rotation kick when changing phase so user sees 3D change
    modelRotationRef.current.targetY += 0.85
  }, [])

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // 1. Scene, Camera, Transparent WebGL Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50)
    camera.position.set(0, 0, 6.8)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }
    container.appendChild(renderer.domElement)

    // 2. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const amberPointLight = new THREE.PointLight(0xd4af37, 4.5, 15)
    amberPointLight.position.set(4, 5, 5)
    scene.add(amberPointLight)

    const blueRimLight = new THREE.PointLight(0x88ccff, 2.5, 12)
    blueRimLight.position.set(-5, -4, -2)
    scene.add(blueRimLight)
    // 3. Phase 3D Cube Models (Packaging Box Architecture)
    const phaseGroups: THREE.Group[] = []
    const boxSize = 2.2
    const boxW = boxSize
    const boxH = boxSize
    const boxD = boxSize

    const sharedBoxGeo = new THREE.BoxGeometry(boxW, boxH, boxD)
    const sharedBoxEdges = new THREE.EdgesGeometry(sharedBoxGeo)

    // Helper: Standard base wireframe cube
    const createBaseCuboid = (edgeColor = 0xd4af37, fillOpacity = 0.06) => {
      const g = new THREE.Group()
      const wire = new THREE.LineSegments(
        sharedBoxEdges,
        new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: 0.95 })
      )
      const fill = new THREE.Mesh(
        sharedBoxGeo,
        new THREE.MeshStandardMaterial({
          color: edgeColor,
          transparent: true,
          opacity: fillOpacity,
          roughness: 0.3,
          metalness: 0.85
        })
      )
      g.add(wire)
      g.add(fill)
      return { group: g, wire, fill }
    }

    // ── MODEL 01: DISCOVERY (Plain Geometric Cube / Rectangle Outline) ──
    const g1 = new THREE.Group()
    const { group: base1 } = createBaseCuboid(0xd4af37, 0.05)
    g1.add(base1)
    scene.add(g1)
    phaseGroups.push(g1)

    // ── MODEL 02: GEOMETRY (Cuboid Outline with Articulated Folding Tuck Flap & Dieline) ──
    const g2 = new THREE.Group()
    const { group: base2 } = createBaseCuboid(0xd4af37, 0.04)
    g2.add(base2)

    // Top folding carton flap
    const flapW = boxW * 0.96
    const flapH = boxD * 0.95
    const flapGeo = new THREE.PlaneGeometry(flapW, flapH)
    const flapEdges = new THREE.EdgesGeometry(flapGeo)
    const flapLine = new THREE.LineSegments(
      flapEdges,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
    )
    const flapMesh = new THREE.Mesh(
      flapGeo,
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide
      })
    )
    flapLine.add(flapMesh)
    flapLine.position.set(0, flapH / 2, 0)

    const flapPivot = new THREE.Group()
    flapPivot.position.set(0, boxH / 2, boxD / 2)
    flapPivot.add(flapLine)
    g2.add(flapPivot)

    // Side dust flaps
    const dustFlapGeo = new THREE.PlaneGeometry(boxD * 0.6, 0.5)
    const leftDustLine = new THREE.LineSegments(
      new THREE.EdgesGeometry(dustFlapGeo),
      new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.75 })
    )
    leftDustLine.position.set(-boxW / 2, boxH / 2, 0)
    leftDustLine.rotation.y = Math.PI / 2
    leftDustLine.rotation.z = Math.PI / 6
    g2.add(leftDustLine)

    const rightDustLine = new THREE.LineSegments(
      new THREE.EdgesGeometry(dustFlapGeo),
      new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.75 })
    )
    rightDustLine.position.set(boxW / 2, boxH / 2, 0)
    rightDustLine.rotation.y = -Math.PI / 2
    rightDustLine.rotation.z = -Math.PI / 6
    g2.add(rightDustLine)

    scene.add(g2)
    phaseGroups.push(g2)

    // ── MODEL 03: TYPOGRAPHY (Cuboid Outline with Front Face Baseline Grid & Label Frames) ──
    const g3 = new THREE.Group()
    const { group: base3 } = createBaseCuboid(0xd4af37, 0.04)
    g3.add(base3)

    const typoPlaneGroup = new THREE.Group()
    typoPlaneGroup.position.set(0, 0, boxD / 2 + 0.015)

    // Baseline grid horizontal rules
    const gridPoints: number[] = []
    for (let y = -boxH / 2 + 0.35; y <= boxH / 2 - 0.35; y += 0.22) {
      gridPoints.push(-boxW / 2 + 0.2, y, 0, boxW / 2 - 0.2, y, 0)
    }
    const gridGeo = new THREE.BufferGeometry()
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPoints, 3))
    const gridLines = new THREE.LineSegments(
      gridGeo,
      new THREE.LineBasicMaterial({ color: 0xffe28a, transparent: true, opacity: 0.45 })
    )
    typoPlaneGroup.add(gridLines)

    // Headline frame box
    const headGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(boxW * 0.75, 0.42))
    const headLine = new THREE.LineSegments(
      headGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
    )
    headLine.position.set(0, 0.75, 0)
    typoPlaneGroup.add(headLine)

    // Subtitle slot frame
    const subGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(boxW * 0.55, 0.22))
    const subLine = new THREE.LineSegments(
      subGeo,
      new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.85 })
    )
    subLine.position.set(-boxW * 0.1, 0.32, 0)
    typoPlaneGroup.add(subLine)

    // Barcode / SKU box in lower corner
    const barcodeGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.65, 0.38))
    const barcodeLine = new THREE.LineSegments(
      barcodeGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
    )
    barcodeLine.position.set(boxW / 2 - 0.55, -boxH / 2 + 0.45, 0)
    typoPlaneGroup.add(barcodeLine)

    g3.add(typoPlaneGroup)
    scene.add(g3)
    phaseGroups.push(g3)

    // ── MODEL 04: PRODUCTION (Cuboid Outline with Spot Foil Emboss & CMYK Registration) ──
    const g4 = new THREE.Group()
    const { group: base4 } = createBaseCuboid(0xd4af37, 0.06)
    g4.add(base4)

    // Polished gold foil metallic emblem on front face
    const foilGeo = new THREE.PlaneGeometry(boxW * 0.65, boxH * 0.48)
    const foilMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide
    })
    const foilMesh = new THREE.Mesh(foilGeo, foilMat)
    foilMesh.position.set(0, 0.08, boxD / 2 + 0.02)
    g4.add(foilMesh)

    // Glowing foil border outline
    const foilBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(foilGeo),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
    )
    foilBorder.position.set(0, 0.08, boxD / 2 + 0.025)
    g4.add(foilBorder)

    // CMYK Registration crosshairs at 4 corners
    const crossPoints: number[] = []
    const crossSize = 0.18
    const crossOffsets = [
      [-boxW / 2 + 0.25, boxH / 2 - 0.25],
      [boxW / 2 - 0.25, boxH / 2 - 0.25],
      [-boxW / 2 + 0.25, -boxH / 2 + 0.25],
      [boxW / 2 - 0.25, -boxH / 2 + 0.25]
    ]
    crossOffsets.forEach(([cx, cy]) => {
      crossPoints.push(cx - crossSize, cy, boxD / 2 + 0.02, cx + crossSize, cy, boxD / 2 + 0.02)
      crossPoints.push(cx, cy - crossSize, boxD / 2 + 0.02, cx, cy + crossSize, boxD / 2 + 0.02)
    })
    const crossGeo = new THREE.BufferGeometry()
    crossGeo.setAttribute('position', new THREE.Float32BufferAttribute(crossPoints, 3))
    const crossLines = new THREE.LineSegments(
      crossGeo,
      new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.9 })
    )
    g4.add(crossLines)

    scene.add(g4)
    phaseGroups.push(g4)

    // Floating particle dust field
    const pGeo = new THREE.BufferGeometry()
    const pCoords = new Float32Array(75 * 3)
    for (let i = 0; i < 75 * 3; i += 3) {
      pCoords[i] = (Math.random() - 0.5) * 7
      pCoords[i + 1] = (Math.random() - 0.5) * 7
      pCoords[i + 2] = (Math.random() - 0.5) * 7
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pCoords, 3))
    const pMat = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.035, transparent: true, opacity: 0.5 })
    const dust = new THREE.Points(pGeo, pMat)
    scene.add(dust)

    // 4. Scroll rotation listener: directly rotates 3D model with video scroll
    const handleScroll = () => {
      const scrollY = window.scrollY
      scrollRotationRef.current.y = scrollY * 0.003
      scrollRotationRef.current.x = Math.sin(scrollY * 0.0015) * 0.4
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // 5. Interactive pointer drag and mouse parallax
    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true
      dragStartRef.current = { x: e.clientX, y: e.clientY }
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

      if (isDraggingRef.current) {
        const dx = e.clientX - dragStartRef.current.x
        const dy = e.clientY - dragStartRef.current.y
        dragStartRef.current = { x: e.clientX, y: e.clientY }
        modelRotationRef.current.targetY += dx * 0.012
        modelRotationRef.current.targetX += dy * 0.012
      }
    }

    const handlePointerUp = () => {
      isDraggingRef.current = false
    }

    container.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    const handleResize = () => {
      if (!mountRef.current) return
      const w = mountRef.current.clientWidth
      const h = mountRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // 6. Physics & Render Loop
    let animId: number
    let elapsed = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      elapsed += 0.016

      // Smooth camera parallax
      mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, mouseRef.current.targetX, 0.06)
      mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, mouseRef.current.targetY, 0.06)

      camera.position.x = mouseRef.current.x * 0.5
      camera.position.y = mouseRef.current.y * 0.3
      camera.lookAt(0, 0, 0)

      // Drag rotation lerp
      modelRotationRef.current.x = THREE.MathUtils.lerp(
        modelRotationRef.current.x,
        modelRotationRef.current.targetX,
        0.08
      )
      modelRotationRef.current.y = THREE.MathUtils.lerp(
        modelRotationRef.current.y,
        modelRotationRef.current.targetY,
        0.08
      )

      // Flap opening/closing animation for Model 02
      flapPivot.rotation.x = -Math.PI / 4 + Math.sin(elapsed * 2.2) * 0.30

      dust.rotation.y += 0.001

      // Combined Rotation: Ambient spin + scroll progress + user drag
      const totalRotY = modelRotationRef.current.y + scrollRotationRef.current.y + elapsed * 0.25
      const totalRotX = modelRotationRef.current.x + scrollRotationRef.current.x + Math.sin(elapsed * 0.2) * 0.12

      // Dynamic phase switching: smooth scale transition to active phase cuboid
      const activeIdx = activePhaseRef.current
      phaseGroups.forEach((group, idx) => {
        const isCurrent = idx === activeIdx
        const targetScale = isCurrent ? 1.0 : 0.001

        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)
        group.visible = group.scale.x > 0.02
        group.rotation.x = totalRotX
        group.rotation.y = totalRotY
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll', handleScroll)
      container.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[460px] md:min-h-[580px] flex flex-col justify-between select-none pointer-events-auto p-2 sm:p-3 md:p-4">
      {/* 1. TOP HEADER HUD OVERLAY & TOP-RIGHT 3D CANVAS BOX */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4 z-20 pointer-events-none pt-4 sm:pt-8 md:pt-12 lg:pt-14">
        <div className="max-w-xl">
          <div className="flex items-center space-x-2 text-[9px] font-mono tracking-[0.25em] text-amber-400 uppercase mb-1.5 md:mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>CHAPTER 02 • DESIGN METHODOLOGY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif text-white font-light leading-tight">
            Tactile geometry. <span className="italic text-amber-300">Engineered hierarchy.</span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-400 font-light max-w-sm leading-relaxed mt-1.5 md:mt-2">
            Packaging box layouts, baseline typography grids, and press-verified proofs.
          </p>
        </div>

        {/* 3D Canvas Box */}
        <div className="relative pointer-events-auto flex flex-col items-start sm:items-end md:self-start mt-2 sm:mt-0">
          <div 
            ref={mountRef} 
            className="w-[190px] sm:w-[240px] md:w-[300px] h-[135px] sm:h-[175px] md:h-[210px] cursor-grab active:cursor-grabbing rounded-2xl bg-black/45 border border-white/10 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.6)]" 
          />
          {/* Sub-box badge */}
          <div className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/75 border border-amber-500/50 text-amber-300 text-[8px] font-mono tracking-widest backdrop-blur-md mt-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold text-white uppercase">{PHASES[activePhaseIndex].number} {PHASES[activePhaseIndex].phase}</span>
            <span className="text-amber-500/50">•</span>
            <span className="text-amber-200">
              {activePhaseIndex === 0 && 'PLAIN CUBE'}
              {activePhaseIndex === 1 && 'FOLDING FLAPS'}
              {activePhaseIndex === 2 && 'BASELINE GRID'}
              {activePhaseIndex === 3 && 'FOIL & PRESS'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM RIGHT TACTILE 4-PHASE SWITCHER DOCK */}
      <div className="z-20 w-full flex justify-end items-end pointer-events-auto mt-auto pt-4 md:pt-6">
        <div className="flex flex-col gap-1.5 sm:gap-2 w-full sm:w-auto shrink-0">
          <div className="flex items-center justify-between px-1 text-[9px] font-mono tracking-wider uppercase mb-0.5">
            <div className="flex items-center space-x-1.5 text-amber-400">
              <MousePointerClick className="w-3.5 h-3.5 animate-bounce" />
              <span>SELECT PHASE</span>
            </div>
            <span className="text-[8px] text-amber-300/80 font-mono tracking-normal ml-3">UPDATES 3D CUBOID</span>
          </div>
          <div className="flex sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-1.5 sm:gap-2 shrink-0 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {PHASES.map((p, idx) => {
              const isActive = activePhaseIndex === idx
              return (
                <button
                  key={p.id}
                  onClick={() => selectPhase(idx)}
                  className={`flex items-center justify-between space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-md text-left shrink-0 ${
                    isActive
                      ? 'bg-neutral-900 border-amber-400/80 shadow-[0_4px_20px_rgba(212,175,55,0.2)] -translate-y-0.5'
                      : 'bg-black/50 border-white/10 hover:border-white/20 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`font-mono text-xs font-bold ${isActive ? 'text-amber-400' : 'text-neutral-500'}`}>
                      {p.number}
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
                      {p.phase}
                    </span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-1.5" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
