import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function EditorialMeshCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // 1. Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#f7f4ee')

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    )
    camera.position.set(0, 0, 10)

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
    dirLight.position.set(5, 10, 7)
    dirLight.castShadow = true
    scene.add(dirLight)

    // 5. Procedural Canvas Texture for Editorial Grid
    const createGridTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      ctx.fillStyle = '#f7f4ee'
      ctx.fillRect(0, 0, 1024, 1024)

      // Fine layout grid lines
      ctx.strokeStyle = 'rgba(10, 10, 10, 0.12)'
      ctx.lineWidth = 1

      const step = 64
      for (let x = 0; x <= 1024; x += step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 1024)
        ctx.stroke()
      }
      for (let y = 0; y <= 1024; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(1024, y)
        ctx.stroke()
      }

      // Crop marks (+) at intersections
      ctx.strokeStyle = 'rgba(10, 10, 10, 0.85)'
      ctx.lineWidth = 2
      const markSize = 12

      for (let x = 128; x < 1024; x += 256) {
        for (let y = 128; y < 1024; y += 256) {
          ctx.beginPath()
          ctx.moveTo(x - markSize, y)
          ctx.lineTo(x + markSize, y)
          ctx.moveTo(x, y - markSize)
          ctx.lineTo(x, y + markSize)
          ctx.stroke()

          // Registration mark circle
          ctx.beginPath()
          ctx.arc(x, y, 6, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      const texture = new THREE.CanvasTexture(canvas)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(4, 4)
      return texture
    }

    const gridTexture = createGridTexture()

    // 6. Editorial Mesh Group (Continuous Grid System)
    const meshGroup = new THREE.Group()
    scene.add(meshGroup)

    // Main 3D Grid Plane (Ground & Depth Rails)
    const gridMat = new THREE.MeshStandardMaterial({
      map: gridTexture,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide,
    })
    const gridGeo = new THREE.PlaneGeometry(60, 60, 32, 32)
    const gridPlane = new THREE.Mesh(gridGeo, gridMat)
    gridPlane.rotation.x = -Math.PI / 2
    gridPlane.position.y = -3
    meshGroup.add(gridPlane)

    // Vertical Editorial Acetate Sheets
    const acetateMat = new THREE.MeshPhysicalMaterial({
      color: 0xf7f4ee,
      transmission: 0.85,
      opacity: 0.7,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      side: THREE.DoubleSide,
    })

    const acetateGeo = new THREE.PlaneGeometry(4, 5)
    for (let i = 0; i < 5; i++) {
      const sheet = new THREE.Mesh(acetateGeo, acetateMat)
      sheet.position.set((i - 2) * 3.5, 0.5, -i * 6)
      sheet.rotation.y = (i % 2 === 0 ? 1 : -1) * 0.15
      meshGroup.add(sheet)
    }

    // 7. 3D Folding Packaging Box Assembly (2D Print -> 3D Object)
    const packagingGroup = new THREE.Group()
    packagingGroup.position.set(0, 0, -18)
    scene.add(packagingGroup)

    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x0038ff,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
    })

    const faceGeo = new THREE.PlaneGeometry(2, 2)
    const faceMain = new THREE.Mesh(faceGeo, boxMat)
    packagingGroup.add(faceMain)

    // Flaps for folding
    const flapLeft = new THREE.Mesh(faceGeo, boxMat)
    flapLeft.position.x = -1
    flapLeft.geometry.translate(-1, 0, 0)
    packagingGroup.add(flapLeft)

    const flapRight = new THREE.Mesh(faceGeo, boxMat)
    flapRight.position.x = 1
    flapRight.geometry.translate(1, 0, 0)
    packagingGroup.add(flapRight)

    const flapTop = new THREE.Mesh(faceGeo, boxMat)
    flapTop.position.y = 1
    flapTop.geometry.translate(0, 1, 0)
    packagingGroup.add(flapTop)

    const flapBottom = new THREE.Mesh(faceGeo, boxMat)
    flapBottom.position.y = -1
    flapBottom.geometry.translate(0, -1, 0)
    packagingGroup.add(flapBottom)

    // 8. 3D Layered Composition Planes (Process Section: Layer Separation)
    const processGroup = new THREE.Group()
    processGroup.position.set(0, 0, -28)
    scene.add(processGroup)

    const layerColors = [0x0a0a0a, 0x0038ff, 0x737373, 0xf0ebd9, 0x0a0a0a, 0x0038ff]
    const processLayers: THREE.Mesh[] = []

    layerColors.forEach((col, idx) => {
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        wireframe: idx === 3,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
      })
      const layerMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 4.5), mat)
      layerMesh.position.z = (idx - 2.5) * 0.1
      processLayers.push(layerMesh)
      processGroup.add(layerMesh)
    })

    // 9. ScrollTrigger Camera & 3D Animation Controls
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress

        // Continuous Horizontal & Depth Camera Motion
        camera.position.z = 10 - p * 35
        camera.position.x = Math.sin(p * Math.PI * 2) * 2.5
        camera.position.y = Math.cos(p * Math.PI * 1.5) * 0.8
        camera.rotation.y = Math.sin(p * Math.PI) * 0.15

        // Mesh rotation & subtle elevation
        meshGroup.rotation.y = p * 0.5

        // Packaging Dieline Folding (around progress 0.35 - 0.55)
        if (p > 0.3 && p < 0.6) {
          const foldProgress = Math.sin(((p - 0.3) / 0.3) * Math.PI)
          flapLeft.rotation.y = foldProgress * (Math.PI / 2)
          flapRight.rotation.y = -foldProgress * (Math.PI / 2)
          flapTop.rotation.x = -foldProgress * (Math.PI / 2)
          flapBottom.rotation.x = foldProgress * (Math.PI / 2)
          packagingGroup.rotation.y = p * Math.PI * 2
        }

        // Process Layer Separation (around progress 0.6 - 0.8)
        if (p > 0.55 && p < 0.85) {
          const sepProgress = Math.sin(((p - 0.55) / 0.3) * Math.PI)
          processLayers.forEach((layer, idx) => {
            layer.position.z = (idx - 2.5) * (0.1 + sepProgress * 0.8)
          })
          processGroup.rotation.y = p * 0.8
        }
      },
    })

    // 10. Animation Loop
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // 11. Responsive Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      st.kill()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  )
}
