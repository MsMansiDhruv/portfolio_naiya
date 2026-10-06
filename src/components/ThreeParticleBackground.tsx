import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap, prefersReducedMotion } from '../lib/gsap'

export type ParticleFormation = 'wave' | 'tunnel' | 'sphere' | 'starfield'

/**
 * Three.js WebGL Interactive Particle Background.
 * Renders purely as a fixed background WebGL canvas without creating layout gaps or top spacing.
 */
export function ThreeParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeFormation, setActiveFormation] = useState<ParticleFormation>('wave')
  const formationRef = useRef<ParticleFormation>('wave')

  useEffect(() => {
    formationRef.current = activeFormation
  }, [activeFormation])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (prefersReducedMotion()) return

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 0, 10)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 2. Particle Geometry Setup (1,800 Particles)
    const particleCount = 1800
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const colorGold = new THREE.Color(0xc5a059)
    const colorSteel = new THREE.Color(0x64748b)
    const colorIce = new THREE.Color(0xe2e8f0)

    for (let i = 0; i < particleCount; i++) {
      const u = (i % 60) - 30
      const v = Math.floor(i / 60) - 15

      positions[i * 3] = u * 0.35
      positions[i * 3 + 1] = Math.sin(u * 0.2) * 1.5 + v * 0.35
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4

      const mixedColor = colorGold.clone().lerp(i % 2 === 0 ? colorSteel : colorIce, Math.random() * 0.7)
      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    })

    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // 3. Pointer Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    // 4. GSAP ScrollTrigger Formations Morphing
    const ctx = gsap.context(() => {
      // Formation 1: Hero -> Work (Helix Tunnel)
      const elWork = document.getElementById('work')
      if (elWork) {
        gsap.to(particleSystem.rotation, {
          x: Math.PI * 0.25,
          y: Math.PI * 0.5,
          scrollTrigger: {
            trigger: elWork,
            start: 'top bottom',
            end: 'top top',
            scrub: 1.2,
            onEnter: () => setActiveFormation('tunnel'),
            onLeaveBack: () => setActiveFormation('wave'),
          },
        })
      }

      // Formation 2: Work -> About (Constellation Sphere)
      const elAbout = document.getElementById('about')
      if (elAbout) {
        gsap.to(particleSystem.rotation, {
          x: Math.PI * 0.8,
          y: Math.PI * 1.8,
          scrollTrigger: {
            trigger: elAbout,
            start: 'top bottom',
            end: 'top top',
            scrub: 1.2,
            onEnter: () => setActiveFormation('starfield'),
            onLeaveBack: () => setActiveFormation('tunnel'),
          },
        })
      }
    })

    // 5. Animation Render Loop
    let animId = 0
    const clock = new THREE.Clock()

    const animate = () => {
      const time = clock.getElapsedTime()
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute
      const currentPos = posAttr.array as Float32Array

      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      const formation = formationRef.current

      for (let i = 0; i < particleCount; i++) {
        let tx = 0, ty = 0, tz = 0

        if (formation === 'wave') {
          const u = (i % 60) - 30
          const v = Math.floor(i / 60) - 15
          tx = u * 0.35
          ty = Math.sin(u * 0.2 + time * 0.8) * 1.2 + v * 0.35
          tz = Math.cos(v * 0.2 + time * 0.5) * 1.5
        } else if (formation === 'tunnel') {
          const angle = (i / particleCount) * Math.PI * 40
          const radius = 3.5 + Math.sin(i * 0.1) * 0.5
          tx = Math.cos(angle) * radius
          ty = Math.sin(angle) * radius
          tz = ((i % 100) - 50) * 0.2
        } else if (formation === 'sphere') {
          const phi = Math.acos(-1 + (2 * i) / particleCount)
          const theta = Math.sqrt(particleCount * Math.PI) * phi
          const radius = 3.8 + Math.sin(time + i) * 0.2
          tx = radius * Math.cos(theta) * Math.sin(phi) + mouse.x * 1.5
          ty = radius * Math.sin(theta) * Math.sin(phi) - mouse.y * 1.5
          tz = radius * Math.cos(phi)
        } else {
          // Starfield Drift
          const u = (i % 50) - 25
          const v = Math.floor(i / 50) - 18
          tx = u * 0.45
          ty = v * 0.45 + Math.sin(time * 0.4 + i) * 0.3
          tz = (Math.sin(i * 0.5) - 0.5) * 8
        }

        currentPos[i * 3] += (tx - currentPos[i * 3]) * 0.06
        currentPos[i * 3 + 1] += (ty - currentPos[i * 3 + 1]) * 0.06
        currentPos[i * 3 + 2] += (tz - currentPos[i * 3 + 2]) * 0.06
      }

      posAttr.needsUpdate = true
      particleSystem.rotation.z = time * 0.02

      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    // 6. Responsive Resize Listener
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
      window.removeEventListener('resize', handleResize)
      ctx.revert()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      particleGeo.dispose()
      particleMat.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
