import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap, prefersReducedMotion } from '../lib/gsap'

export type MaterialPreset = 'cyan' | 'violet' | 'sapphire'

/**
 * Refined 3D WebGL Floating Jewel & Interactive Sculpture.
 * Designed to be compact, elegant, and non-dominant across all sections.
 */
export function ThreeCanvas3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeMaterial, setActiveMaterial] = useState<MaterialPreset>('cyan')
  const materialRef = useRef<MaterialPreset>('cyan')
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    materialRef.current = activeMaterial
  }, [activeMaterial])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (prefersReducedMotion()) return

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 2. Compact 3D Jewel Group (Reduced size for subtle elegance)
    const orbGroup = new THREE.Group()
    scene.add(orbGroup)

    // Compact Geometry: Icosahedron & TorusKnot hybrid
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 2)
    const torusGeo = new THREE.TorusKnotGeometry(0.55, 0.16, 128, 32)

    // Material Presets
    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.9,
      roughness: 0.18,
      wireframe: false,
    })

    const violetMat = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      transmission: 0.88,
      opacity: 0.95,
      transparent: true,
      roughness: 0.1,
      ior: 1.6,
      thickness: 0.5,
      emissive: 0x7e22ce,
    })

    const sapphireMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x06b6d4,
    })

    const orbMesh = new THREE.Mesh(torusGeo, cyanMat)
    orbGroup.add(orbMesh)

    // Subtle Outer Wireframe Shell
    const wireGeo = new THREE.WireframeGeometry(coreGeo)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.25,
    })
    const wireMesh = new THREE.LineSegments(wireGeo, lineMat)
    orbGroup.add(wireMesh)

    // Floating 3D Particle Cloud (Reduced count for subtle atmosphere)
    const particleCount = 450
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const colorCyan = new THREE.Color(0x06b6d4)
    const colorViolet = new THREE.Color(0xa855f7)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      const col = colorCyan.clone().lerp(colorViolet, Math.random())
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.2)
    keyLight.position.set(5, 5, 7)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0x06b6d4, 2, 20)
    fillLight.position.set(-5, -4, -2)
    scene.add(fillLight)

    // 4. Pointer Mouse Interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    let isDragging = false
    let prevMousePos = { x: 0, y: 0 }
    const dragRotation = { x: 0, y: 0 }

    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x
        const deltaY = e.clientY - prevMousePos.y
        dragRotation.y += deltaX * 0.008
        dragRotation.x += deltaY * 0.008
        prevMousePos = { x: e.clientX, y: e.clientY }
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true
      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const handlePointerUp = () => {
      isDragging = false
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)

    // 5. Discrete GSAP ScrollTrigger Gliding Path Across Chapters
    const ctx = gsap.context(() => {
      // Set initial position (Chapter I: Hero - Top Right margin, compact scale)
      gsap.set(orbGroup.position, { x: 3.6, y: 1.2, z: 0 })
      gsap.set(orbGroup.scale, { x: 0.55, y: 0.55, z: 0.55 })

      // Timeline 1: Hero -> Selected Works (#work)
      const elWork = document.getElementById('work')
      if (elWork) {
        gsap.to(orbGroup.position, {
          x: -3.8,
          y: 0.2,
          z: -1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: elWork,
            start: 'top bottom',
            end: 'top top',
            scrub: 1.2,
          },
        })
        gsap.to(orbGroup.scale, {
          x: 0.45,
          y: 0.45,
          z: 0.45,
          scrollTrigger: {
            trigger: elWork,
            start: 'top bottom',
            end: 'top top',
            scrub: 1.2,
          },
        })
      }

      // Timeline 2: Selected Works -> Interactive 3D Lab (#lab3d)
      const elLab = document.getElementById('lab3d')
      if (elLab) {
        gsap.to(orbGroup.position, {
          x: 0,
          y: 0,
          z: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: elLab,
            start: 'top bottom',
            end: 'center center',
            scrub: 1,
            onEnter: () => setIsInteractive(true),
            onLeaveBack: () => setIsInteractive(false),
            onLeave: () => setIsInteractive(false),
            onEnterBack: () => setIsInteractive(true),
          },
        })
        gsap.to(orbGroup.scale, {
          x: 0.95,
          y: 0.95,
          z: 0.95,
          scrollTrigger: {
            trigger: elLab,
            start: 'top bottom',
            end: 'center center',
            scrub: 1,
          },
        })
      }

      // Timeline 3: 3D Lab -> About (#about)
      const elAbout = document.getElementById('about')
      if (elAbout) {
        gsap.to(orbGroup.position, {
          x: 3.8,
          y: -0.6,
          z: 0,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: elAbout,
            start: 'top bottom',
            end: 'top top',
            scrub: 1.2,
          },
        })
        gsap.to(orbGroup.scale, {
          x: 0.45,
          y: 0.45,
          z: 0.45,
          scrollTrigger: {
            trigger: elAbout,
            start: 'top bottom',
            end: 'top top',
            scrub: 1.2,
          },
        })
      }

      // Timeline 4: About -> Footer (#footer-wave)
      const elFooter = document.getElementById('footer-wave')
      if (elFooter) {
        gsap.to(orbGroup.position, {
          x: 0,
          y: -2.8,
          z: 0.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: elFooter,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
          },
        })
        gsap.to(orbGroup.scale, {
          x: 0.35,
          y: 0.35,
          z: 0.35,
          scrollTrigger: {
            trigger: elFooter,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
          },
        })
      }
    })

    // 6. Animation Frame Loop
    let animId = 0
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Material updates
      if (materialRef.current === 'cyan' && orbMesh.material !== cyanMat) {
        orbMesh.material = cyanMat
      } else if (materialRef.current === 'violet' && orbMesh.material !== violetMat) {
        orbMesh.material = violetMat
      } else if (materialRef.current === 'sapphire' && orbMesh.material !== sapphireMat) {
        orbMesh.material = sapphireMat
      }

      // Mouse lerp inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // Continuous Idle Float & Rotation + Drag inertia
      orbMesh.rotation.x = dragRotation.x + elapsedTime * 0.15 + mouse.y * 0.2
      orbMesh.rotation.y = dragRotation.y + elapsedTime * 0.2 + mouse.x * 0.2

      wireMesh.rotation.x = -elapsedTime * 0.1
      wireMesh.rotation.y = -elapsedTime * 0.15

      particleSystem.rotation.y = elapsedTime * 0.03

      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    // 7. Responsive Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('resize', handleResize)
      ctx.revert()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      coreGeo.dispose()
      torusGeo.dispose()
      wireGeo.dispose()
      cyanMat.dispose()
      violetMat.dispose()
      sapphireMat.dispose()
      lineMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
    }
  }, [])

  return (
    <>
      {/* Viewport Floating 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className={`fixed inset-0 z-10 transition-opacity duration-700 ${
          isInteractive ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* 3D Lab Control HUD (Renders controls when inside #lab3d) */}
      <div
        id="lab3d"
        className="relative w-full min-h-screen bg-[#0d1322] text-[#e0f2fe] flex flex-col justify-between py-20 px-6 md:px-16 overflow-hidden my-24 border-y border-[#06b6d4]/30"
      >
        <div className="relative z-20 max-w-xl">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs uppercase tracking-[0.2em] font-mono text-[#06b6d4] bg-[#131b2e] border border-[#06b6d4]/30 backdrop-blur-md mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse" />
            03 / THE ART OF FORM &amp; LIGHT
          </span>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-3">
            Interactive <span className="italic font-serif text-[#06b6d4]">3D Jewel</span>
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            The 3D Jewel has entered center stage. Drag anywhere on the canvas to rotate the sculpture in 360°, or switch material shaders below.
          </p>
        </div>

        {/* Material Preset Switcher HUD */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 backdrop-blur-md bg-[#090d16]/80 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mr-2">
              Material Shader:
            </span>
            {(['cyan', 'violet', 'sapphire'] as MaterialPreset[]).map((mat) => (
              <button
                key={mat}
                onClick={() => setActiveMaterial(mat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium uppercase tracking-wider transition-all duration-300 ${
                  activeMaterial === mat
                    ? 'bg-[#06b6d4] text-[#090d16] font-bold shadow-lg shadow-[#06b6d4]/30 scale-105'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {mat === 'cyan' && '✦ Electric Cyan'}
                {mat === 'violet' && '✧ Violet Prism'}
                {mat === 'sapphire' && '❖ Royal Sapphire'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>Drag canvas to orbit 360°</span>
            <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
            <span>GSAP Gliding Active</span>
          </div>
        </div>
      </div>
    </>
  )
}
