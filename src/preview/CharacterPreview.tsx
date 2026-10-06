import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { buildRegalCharacter } from './buildRegalCharacter'

/** Transparent Three.js character preview — orbit / zoom. */
export function CharacterPreview() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = null

    const camera = new THREE.PerspectiveCamera(
      28,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      100,
    )
    // Full-body frame — head sits ~2.4, feet ~0
    camera.position.set(0.35, 1.25, 4.6)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const hemi = new THREE.HemisphereLight(0xfff2e4, 0x3a2a22, 1.15)
    scene.add(hemi)
    const key = new THREE.DirectionalLight(0xffffff, 2.1)
    key.position.set(2.4, 4.2, 2.8)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 20
    key.shadow.bias = -0.0002
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffd7b0, 0.55)
    fill.position.set(-2.2, 1.8, -1.4)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffffff, 0.65)
    rim.position.set(-0.2, 2.4, -3.2)
    scene.add(rim)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 2.2
    controls.maxDistance = 9
    controls.target.set(0, 1.25, 0)
    controls.update()

    let character: THREE.Group | null = null
    let raf = 0
    let disposed = false

    const loader = new THREE.TextureLoader()
    loader.load(
      '/preview/face.jpg',
      (faceTex) => {
        if (disposed) {
          faceTex.dispose()
          return
        }
        faceTex.colorSpace = THREE.SRGBColorSpace
        character = buildRegalCharacter({ face: faceTex })
        character.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.castShadow = true
            obj.receiveShadow = true
          }
        })
        scene.add(character)
      },
      undefined,
      () => {
        if (disposed) return
        character = buildRegalCharacter({})
        scene.add(character)
      },
    )

    const onResize = () => {
      const w = mount.clientWidth
      const h = Math.max(mount.clientHeight, 1)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (character) character.rotation.y += 0.0022
      controls.update()
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      character?.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          const mat = obj.material
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
          else mat.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    />
  )
}
