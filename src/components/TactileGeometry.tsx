import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function TactileGeometry() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(400, 400)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Clear any existing children to prevent React double-mount issues
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild)
    }
    mountRef.current.appendChild(renderer.domElement)

    // 2. Golden Metallic Material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37, // Golden
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      wireframe: false,
    })

    // 3. Geometry (Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(1.5, 0)
    
    // Add wireframe overlay for that "digital architect" vibe
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.15 })
    
    const mesh = new THREE.Mesh(geometry, material)
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial)
    mesh.add(wireframe)
    
    scene.add(mesh)

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 2)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    const pointLight2 = new THREE.PointLight(0xd4af37, 2)
    pointLight2.position.set(-5, -5, 5)
    scene.add(pointLight2)

    // 5. Mouse Interaction
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0
    const windowHalfX = window.innerWidth / 2
    const windowHalfY = window.innerHeight / 2

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX)
      mouseY = (event.clientY - windowHalfY)
    }
    document.addEventListener('mousemove', onDocumentMouseMove)

    // 6. Animation Loop (only active when visible on screen)
    let isVisible = false
    let animationFrameId: number | null = null

    const animate = () => {
      if (!isVisible) return
      animationFrameId = requestAnimationFrame(animate)

      targetX = mouseX * 0.001
      targetY = mouseY * 0.001

      // Smoothly rotate towards mouse target
      mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y)
      mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x)
      
      // Base continuous rotation
      mesh.rotation.y += 0.005
      mesh.rotation.x += 0.002

      renderer.render(scene, camera)
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        if (!animationFrameId) animate()
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
      }
    }, { threshold: 0.05 })

    if (mountRef.current) {
      observer.observe(mountRef.current)
    }

    // 7. Cleanup
    return () => {
      observer.disconnect()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      document.removeEventListener('mousemove', onDocumentMouseMove)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      wireframeMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className="absolute right-0 top-1/2 -translate-y-1/2 opacity-60 mix-blend-screen pointer-events-none"
      style={{ width: '400px', height: '400px' }}
    />
  )
}
