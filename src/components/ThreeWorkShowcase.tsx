import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ArrowLeft, ArrowRight, RefreshCw, HandMetal, LayoutGrid, RotateCw, Eye, ArrowUpRight } from 'lucide-react'
import { PORTFOLIO_PROJECTS, type ProjectCaseStudy } from '../data/portfolio'

interface ThreeWorkShowcaseProps {
  onSelectProject: (project: ProjectCaseStudy) => void
}

// 1. Generate curved rounded rectangle geometry with proper UV coordinates
function createRoundedRectGeometry(w: number, h: number, r: number) {
  const shape = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)

  const geometry = new THREE.ShapeGeometry(shape, 32)
  const pos = geometry.attributes.position
  const uvs: number[] = []
  for (let i = 0; i < pos.count; i++) {
    const u = (pos.getX(i) + w / 2) / w
    const v = (pos.getY(i) + h / 2) / h
    uvs.push(u, v)
  }
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  return { geometry, shape }
}

// 2. Helper to wrap text nicely on 2D Canvas
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  let currentY = y

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY)
      line = words[n] + ' '
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, currentY)
}

// 3. Generate high-resolution luxury back texture canvas with dark gray dull black background
function createBackCanvasTexture(project: ProjectCaseStudy): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1344
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Dark gray dull black background (#1c1c22) - distinct contrast against the pure black #030303 page background
  ctx.fillStyle = '#1c1c22'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Subtle card border to give clean physical separation
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.lineWidth = 4
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12)

  // Top Category / Discipline Pill Badge
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)'
  ctx.beginPath()
  ctx.roundRect(80, 85, 460, 60, 30)
  ctx.fill()
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#FBBF24'
  ctx.font = 'bold 26px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(project.category.toUpperCase(), 310, 125)
  ctx.textAlign = 'left'

  // Divider
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.fillRect(80, 175, 864, 3)

  // Project Title (Smaller, refined editorial heading)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'normal 48px Georgia, serif'
  ctx.fillText(project.title, 80, 255)

  // Category
  ctx.fillStyle = '#F59E0B'
  ctx.font = 'bold 24px monospace'
  ctx.fillText(project.category.toUpperCase(), 80, 315)

  // Tagline
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
  ctx.font = 'italic 34px Georgia, serif'
  wrapText(ctx, `"${project.tagline}"`, 80, 425, 864, 50)

  // Main Description
  ctx.fillStyle = 'rgba(220, 220, 225, 0.95)'
  ctx.font = '32px "Plus Jakarta Sans", "Inter", system-ui, sans-serif'
  wrapText(ctx, project.description, 80, 550, 864, 52)

  // Deliverables Header
  ctx.fillStyle = '#FBBF24'
  ctx.font = 'bold 28px monospace'
  ctx.fillText('DELIVERABLES:', 80, 840)

  // Deliverables List
  ctx.fillStyle = '#E2E8F0'
  ctx.font = '28px monospace'
  const items = project.deliverables.slice(0, 4)
  items.forEach((item, idx) => {
    ctx.fillText(`+  ${item}`, 80, 900 + idx * 52)
  })

  // Bottom Action Prompt Badge
  ctx.fillStyle = '#D4AF37'
  ctx.beginPath()
  ctx.roundRect(80, 1160, 864, 90, 45)
  ctx.fill()

  ctx.fillStyle = '#0F0F12'
  ctx.font = 'bold 32px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('CLICK TO OPEN CASE STUDY  ->', 512, 1218)
  ctx.textAlign = 'left'

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = false
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

// 3b. Generate tactile discipline pill badge for the FRONT of each card
function createFrontBadgeTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 120
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  ctx.fillStyle = 'rgba(18, 18, 22, 0.92)'
  ctx.beginPath()
  ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 32)
  ctx.fill()

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)'
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = '#FBBF24'
  ctx.font = 'bold 28px monospace'
  ctx.letterSpacing = '3px'
  ctx.textAlign = 'center'
  ctx.fillText(text.toUpperCase(), canvas.width / 2, 70)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function ThreeWorkShowcase({ onSelectProject }: ThreeWorkShowcaseProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)

  // View Mode: 'orbit' (3D physical deck) or 'grid' (high-resolution quick scan)
  const [viewMode, setViewMode] = useState<'orbit' | 'grid'>('orbit')
  const viewModeRef = useRef<'orbit' | 'grid'>('orbit')
  viewModeRef.current = viewMode

  // Responsive camera Z distance for mobile vs desktop
  const cameraZRef = useRef(9.6)

  // Carousel physics state
  const rotationRef = useRef({ current: 0, target: 0 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, time: 0, lastX: 0 })
  const mouseParallaxRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  // Card hover-flip state
  const hoveredCardRef = useRef<number | null>(null)
  const flipRotationsRef = useRef<number[]>([0, 0, 0, 0, 0, 0])

  const totalCards = PORTFOLIO_PROJECTS.length
  const stepAngle = (Math.PI * 2) / totalCards

  const rotateTo = useCallback((index: number) => {
    const normalized = (index % totalCards + totalCards) % totalCards
    activeIndexRef.current = normalized
    setActiveIndex(normalized)
    rotationRef.current.target = -normalized * stepAngle
  }, [totalCards, stepAngle])

  const nextCard = useCallback(() => {
    rotateTo(activeIndexRef.current + 1)
  }, [rotateTo])

  const prevCard = useCallback(() => {
    rotateTo(activeIndexRef.current - 1)
  }, [rotateTo])

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // 1. Three.js Scene Setup (No fog to preserve 100% original vibrant image colors)
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50)
    
    // Responsive camera depth calculation
    const updateCameraZ = (w: number, h: number) => {
      const aspect = w / h
      const targetZ = aspect < 0.65 ? 13.8 : aspect < 0.9 ? 12.0 : aspect < 1.15 ? 10.8 : 9.6
      cameraZRef.current = targetZ
      camera.position.z = targetZ
    }
    updateCameraZ(width, height)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }
    container.appendChild(renderer.domElement)

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xfff3d6, 2.5)
    keyLight.position.set(5, 8, 8)
    scene.add(keyLight)

    const amberFillLight = new THREE.PointLight(0xd4af37, 4.0, 15)
    amberFillLight.position.set(0, 1, 4)
    scene.add(amberFillLight)

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.0)
    rimLight.position.set(-8, -4, -4)
    scene.add(rimLight)

    // 3. Floating Dust Particles
    const particleCount = 140
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16
      particlePositions[i + 1] = (Math.random() - 0.5) * 10
      particlePositions[i + 2] = (Math.random() - 0.5) * 12
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0xd4af37, size: 0.035, transparent: true, opacity: 0.45 })
    )
    scene.add(particles)

    // 4. Create Curved Rounded 3D Flipping Cards (Front 3 framed with comfortable clearance)
    const cardRadius = 4.0
    const cardWidth = 2.72
    const cardHeight = 3.65
    const cornerRadius = 0.22 // Smooth curved edges

    const { geometry: frontCardGeo } = createRoundedRectGeometry(cardWidth, cardHeight, cornerRadius)
    const { geometry: backCardGeo } = createRoundedRectGeometry(cardWidth, cardHeight, cornerRadius)

    const textureLoader = new THREE.TextureLoader()
    const cardGroups: THREE.Group[] = []
    const meshHolders: THREE.Group[] = []
    const hitProxies: THREE.Mesh[] = []

    PORTFOLIO_PROJECTS.forEach((project, idx) => {
      const group = new THREE.Group()

      // VISUAL MESH HOLDER: Only this child group rotates during flip!
      const meshHolder = new THREE.Group()

      // FRONT FACE: Project Cover (MeshBasicMaterial renders 100% true original colors with no lighting falloff)
      const frontTex = textureLoader.load(project.coverImage)
      frontTex.colorSpace = THREE.SRGBColorSpace
      frontTex.minFilter = THREE.LinearFilter
      frontTex.magFilter = THREE.LinearFilter

      const frontMat = new THREE.MeshBasicMaterial({
        map: frontTex,
        side: THREE.FrontSide
      })
      const frontMesh = new THREE.Mesh(frontCardGeo, frontMat)
      frontMesh.userData = { index: idx, project, face: 'front' }
      meshHolder.add(frontMesh)

      // FRONT DISCIPLINE BADGE: Highlights "Social Media", "Print Media", "Presentation", "Logo and Branding", "Pitch Decks"
      const badgeGeo = new THREE.PlaneGeometry(1.6, 0.36)
      const badgeMat = new THREE.MeshBasicMaterial({
        map: createFrontBadgeTexture(project.category),
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide
      })
      const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat)
      badgeMesh.position.set(0, -cardHeight / 2 + 0.32, 0.015)
      meshHolder.add(badgeMesh)

      // BACK FACE: Canvas with Detailed Description & Deliverables
      const backTex = createBackCanvasTexture(project)
      const backMat = new THREE.MeshBasicMaterial({
        map: backTex,
        side: THREE.FrontSide
      })
      const backMesh = new THREE.Mesh(backCardGeo, backMat)
      backMesh.rotation.y = Math.PI // Face backward
      backMesh.position.z = -0.015
      backMesh.userData = { index: idx, project, face: 'back' }
      meshHolder.add(backMesh)

      group.add(meshHolder)
      meshHolders.push(meshHolder)

      // STATIC INVISIBLE HIT PROXY: Generous bounding plane facing the camera.
      // DOES NOT ROTATE when card flips, so cursor off-center or mid-flip NEVER loses hover!
      const hitProxyGeo = new THREE.PlaneGeometry(cardWidth * 1.35, cardHeight * 1.25)
      const hitProxyMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide
      })
      const hitProxy = new THREE.Mesh(hitProxyGeo, hitProxyMat)
      hitProxy.userData = { index: idx, project, isHitProxy: true }
      hitProxy.position.z = 0.05
      group.add(hitProxy)
      hitProxies.push(hitProxy)

      scene.add(group)
      cardGroups.push(group)
    })

    // 4b. Synchronized Pure Vertical Floating Wave for 3D Cards
    // All cards float in perfect unison so back cards never drop below front cards
    const sharedFloat = { y: 0 }
    const floatTween = gsap.to(sharedFloat, {
      y: 0.16,
      duration: 3.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // 5. Raycaster for Hover & Clicks
    const raycaster = new THREE.Raycaster()
    const mousePos = new THREE.Vector2()

    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true
      dragStartRef.current = {
        x: e.clientX,
        time: performance.now(),
        lastX: e.clientX
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (isInside) {
        mouseParallaxRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
        mousePos.x = mouseParallaxRef.current.targetX
        mousePos.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      } else if (!isDraggingRef.current) {
        mouseParallaxRef.current.targetX = 0
        mousePos.x = -9999
        mousePos.y = -9999
      }
      mouseParallaxRef.current.targetY = 0

      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartRef.current.lastX
        dragStartRef.current.lastX = e.clientX
        rotationRef.current.target += (deltaX / rect.width) * 3.5
      }
    }

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false

      const totalDistanceMoved = Math.abs(e.clientX - dragStartRef.current.x)

      // If user clicked or tapped without dragging:
      if (totalDistanceMoved < 8) {
        const rect = container.getBoundingClientRect()
        mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        mousePos.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

        raycaster.setFromCamera(mousePos, camera)
        const intersects = raycaster.intersectObjects(hitProxies)

        if (intersects.length > 0) {
          const clickedMesh = intersects[0].object as THREE.Mesh
          const clickedIndex = clickedMesh.userData.index

          if (clickedIndex === activeIndexRef.current || flipRotationsRef.current[clickedIndex] > Math.PI * 0.4) {
            // Center card or any flipped card clicked -> open case study modal!
            onSelectProject(clickedMesh.userData.project)
          } else {
            // Adjacent card clicked -> rotate into view!
            rotateTo(clickedIndex)
          }
          return
        }
      }

      // Snap target rotation to nearest card
      const rawIndex = -rotationRef.current.target / stepAngle
      const snappedIndex = Math.round(rawIndex)
      rotationRef.current.target = -snappedIndex * stepAngle

      const normalizedIdx = (snappedIndex % totalCards + totalCards) % totalCards
      activeIndexRef.current = normalizedIdx
      setActiveIndex(normalizedIdx)
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
      updateCameraZ(w, h)
    }
    window.addEventListener('resize', handleResize)

    // 6. Physics & Flip Animation Render Loop
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Zero-GPU mode: Pause WebGL calculations when user is inspecting in Grid View
      if (viewModeRef.current === 'grid') return

      // Smooth carousel rotation lerp
      rotationRef.current.current = THREE.MathUtils.lerp(
        rotationRef.current.current,
        rotationRef.current.target,
        0.08
      )

      // Smooth camera mouse parallax: subtle horizontal drift only, strictly lock Y to 0
      mouseParallaxRef.current.x = THREE.MathUtils.lerp(
        mouseParallaxRef.current.x,
        mouseParallaxRef.current.targetX,
        0.05
      )

      camera.position.x = mouseParallaxRef.current.x * 0.35
      camera.position.y = 0
      camera.position.z = cameraZRef.current
      camera.lookAt(0, 0, 0)

      // Smooth Raycast Hover Detection on Static Hit Proxies (only front cards flip on hover)
      if (!isDraggingRef.current) {
        raycaster.setFromCamera(mousePos, camera)
        const frontCandidates = hitProxies.filter((m) => {
          const p = m.parent
          return p && p.position.z > -1.2
        })
        const intersects = raycaster.intersectObjects(frontCandidates)
        if (intersects.length > 0) {
          const hoveredMesh = intersects[0].object as THREE.Mesh
          hoveredCardRef.current = hoveredMesh.userData.index
          container.style.cursor = 'pointer'
        } else {
          hoveredCardRef.current = null
          container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab'
        }
      } else {
        hoveredCardRef.current = null
        container.style.cursor = 'grabbing'
      }

      // Position each card on the 3D circular sphere track with smooth curvature
      cardGroups.forEach((group, i) => {
        const angle = i * stepAngle + rotationRef.current.current
        const x = cardRadius * Math.sin(angle)
        // Circular sphere depth curve:
        const z = (Math.cos(angle) - 1) * 1.35
        // Unified float offset keeps all cards in lockstep, with generous clearance below header text
        const floatY = sharedFloat.y - 0.35

        // All cards (front 3 AND back cards) are visible in 3D depth!
        group.visible = true

        // Cards float smoothly on Y while following the circular sphere arc
        group.position.set(x, floatY, z)

        // CARD FLIP PHYSICS: Flip 180deg (Math.PI) on hover around Y axis for any of the front 3 cards
        const isFrontCard = Math.cos(angle) > 0.2
        const isHovered = hoveredCardRef.current === i
        const targetFlipAngle = (isHovered && isFrontCard) ? Math.PI : 0

        // Silky-smooth luxury damping for flip
        const currentRot = flipRotationsRef.current[i]
        const delta = targetFlipAngle - currentRot
        if (Math.abs(delta) > 0.001) {
          flipRotationsRef.current[i] += delta * 0.10
        } else {
          flipRotationsRef.current[i] = targetFlipAngle
        }

        // FRONT-FACING ORIENTATION:
        // All cards are completely flat and front-facing with zero tilt or angle, matching the left card
        group.rotation.set(0, 0, 0)

        // ONLY the visual meshHolder executes the flip rotation around its vertical Y axis
        if (meshHolders[i]) {
          meshHolders[i].rotation.y = flipRotationsRef.current[i]
        }

        // SCALE HIERARCHY: Center card is bigger (1.08), side cards are (0.88), back cards are (0.72)
        const cosVal = Math.cos(angle)
        const scale = 0.72 + (cosVal > 0 ? 0.16 : 0) + Math.max(0, cosVal - 0.5) * 0.40
        group.scale.set(scale, scale, scale)
      })

      // Update active index in state
      const currentRawIdx = Math.round(-rotationRef.current.current / stepAngle)
      const currentNormIdx = (currentRawIdx % totalCards + totalCards) % totalCards
      if (currentNormIdx !== activeIndexRef.current) {
        activeIndexRef.current = currentNormIdx
        setActiveIndex(currentNormIdx)
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      floatTween.kill()
      container.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [totalCards, stepAngle, onSelectProject, rotateTo])

  const activeProject = PORTFOLIO_PROJECTS[activeIndex] || PORTFOLIO_PROJECTS[0]

  return (
    <div className={`relative w-full ${viewMode === 'orbit' ? 'h-[85vh] min-h-[560px] md:h-[88vh] md:min-h-[640px] max-h-[920px] overflow-hidden' : 'min-h-[85vh] h-auto overflow-visible'} select-none transition-all duration-500`}>
      {/* 3D WebGL Canvas Mount Container */}
      <div 
        ref={mountRef} 
        className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0 ${viewMode === 'orbit' ? 'block' : 'hidden pointer-events-none'}`} 
      />

      {/* HEADER & VIEW TOGGLE BAR */}
      <div className={`relative z-10 w-full p-4 sm:p-6 md:p-12 ${viewMode === 'orbit' ? 'pointer-events-none absolute inset-0 flex flex-col justify-between' : 'pointer-events-auto flex flex-col'}`}>
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pointer-events-auto">
          <div>
            <h2 className="section-glide-text text-2xl sm:text-3xl md:text-5xl font-serif text-white font-normal tracking-normal">
              Selected <span className="italic text-amber-300">Works</span>
            </h2>
            <div className="section-glide-text flex flex-wrap items-center gap-1.5 mt-2 text-[8px] sm:text-[9px] font-mono uppercase text-neutral-400">
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.25)]">Social Media</span>
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.25)]">Print Media</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 font-semibold tracking-wider">Logo Design</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 font-semibold tracking-wider">Packaging</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 font-semibold tracking-wider">Pitch Decks</span>
            </div>
          </div>

          {/* Right Controls: Mode Toggle & Interactive Nudge */}
          <div className="section-glide-text flex flex-wrap items-center gap-2 sm:gap-3">
            {/* View Mode Toggle Pill (3D Orbit vs Clean Grid) */}
            <div className="flex items-center bg-black/85 border border-white/15 p-1 rounded-full backdrop-blur-md shadow-2xl">
              <button
                type="button"
                onClick={() => setViewMode('orbit')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-mono transition-all cursor-pointer ${
                  viewMode === 'orbit'
                    ? 'bg-amber-400 text-black font-bold shadow-[0_0_14px_rgba(245,158,11,0.5)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Interactive 3D rotating card deck"
              >
                <RotateCw className="w-3 h-3" />
                <span>3D ORBIT</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-mono transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-amber-400 text-black font-bold shadow-[0_0_14px_rgba(245,158,11,0.5)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Fast 2-second overview of all projects"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>GRID VIEW</span>
              </button>
            </div>

            {/* Orbit Interaction Nudge */}
            {viewMode === 'orbit' && (
              <div className="hidden lg:flex items-center space-x-2.5 px-4 py-2 rounded-full bg-black/70 border border-amber-500/40 text-amber-300 text-[9px] font-mono tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <RefreshCw className="w-3 h-3 text-amber-400 animate-spin-slow" />
                <span>HOVER CARD TO FLIP · CLICK TO INSPECT</span>
              </div>
            )}
          </div>
        </div>

        {/* ORBIT VIEW: Center-Right Large Ghost Number Parallax Background */}
        {viewMode === 'orbit' && (
          <div className="absolute right-4 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 text-[8rem] sm:text-[12rem] md:text-[18rem] font-serif font-light text-white/[0.03] select-none pointer-events-none leading-none">
            0{activeIndex + 1}
          </div>
        )}

        {/* ORBIT VIEW: Bottom Navigation Dock */}
        {viewMode === 'orbit' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto w-full pt-3 sm:pt-4">
            {/* Subtle Swipe Nudge on Left */}
            <div className="hidden sm:flex items-center space-x-2.5 px-4 py-2 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 text-[9px] font-mono tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <HandMetal className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>SWIPE / DRAG TO ORBIT 3D CAROUSEL</span>
            </div>

            {/* Active Card Quick Indicator & Navigation Controls */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-3">
              <button
                onClick={prevCard}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/15 bg-black/60 hover:bg-white/10 text-white flex items-center justify-center transition-colors backdrop-blur-md cursor-pointer hover:border-amber-400 shrink-0"
                aria-label="Previous Project"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-300" />
              </button>

              {/* Pagination Track Dots */}
              <div className="flex items-center space-x-2 sm:space-x-3 bg-black/80 border border-white/15 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full backdrop-blur-md shadow-xl max-w-[220px] sm:max-w-none overflow-hidden">
                <span className="font-mono text-[11px] sm:text-xs font-semibold text-white/95 mr-1 sm:mr-2 truncate">
                  {activeProject.title}
                </span>
                <div className="flex items-center space-x-1.5 shrink-0">
                  {PORTFOLIO_PROJECTS.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => rotateTo(dotIdx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        activeIndex === dotIdx 
                          ? 'w-4 sm:w-6 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={nextCard}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/15 bg-black/60 hover:bg-white/10 text-white flex items-center justify-center transition-colors backdrop-blur-md cursor-pointer hover:border-amber-400 shrink-0"
                aria-label="Next Project"
              >
                <ArrowRight className="w-4 h-4 text-neutral-300" />
              </button>
            </div>
          </div>
        )}

        {/* GRID VIEW: High-Resolution Scan Mode for Busy Creative Directors & Recruiters */}
        {viewMode === 'grid' && (
          <div className="w-full pt-8 pb-12 pointer-events-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {PORTFOLIO_PROJECTS.map((project, idx) => (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="group relative bg-[#0c0c0e] border border-white/10 hover:border-amber-400/50 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(212,175,55,0.12)] flex flex-col cursor-pointer"
                >
                  {/* Project Cover Image */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/40">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Top Discipline Tag & Number */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
                      <span className="px-2.5 py-1 rounded-full bg-black/75 border border-amber-400/40 text-amber-300 font-semibold backdrop-blur-md uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/60 text-neutral-400 font-bold backdrop-blur-md">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Hover Inspect CTA Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                      <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-400 text-black font-semibold text-xs font-sans tracking-wide shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content & Metadata */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                        <span className="text-amber-400/90 font-medium">{project.category.toUpperCase()}</span>
                        <span className="text-neutral-500">[{project.number}]</span>
                      </div>

                      <h3 className="font-serif text-2xl font-normal tracking-wide text-white group-hover:text-amber-300 transition-colors mb-2">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed mb-4 line-clamp-2">
                        {project.tagline || project.description}
                      </p>
                    </div>

                    <div>
                      {/* Deliverables Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5 mb-4">
                        {project.deliverables.slice(0, 3).map((item, dIdx) => (
                          <span
                            key={dIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-neutral-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-neutral-300 group-hover:text-amber-400 transition-colors pt-1">
                        <span className="font-medium tracking-wide">VIEW CASE STUDY</span>
                        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Switch Back to Orbit */}
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setViewMode('orbit')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-amber-300 hover:text-amber-200 text-xs font-mono tracking-wider transition-all cursor-pointer backdrop-blur-md"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>SWITCH BACK TO 3D ORBIT SPHERE</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
