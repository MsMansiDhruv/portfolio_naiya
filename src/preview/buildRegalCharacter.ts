import * as THREE from 'three'

const CREAM = new THREE.Color('#f4ecdf')
const CREAM_DEEP = new THREE.Color('#e4d4bd')
const SKIN = new THREE.Color('#d4a888')
const HAIR = new THREE.Color('#1c1410')
const GOLD = new THREE.Color('#c9a45c')
const GOLD_DARK = new THREE.Color('#9a7a3e')
const INK = new THREE.Color('#1a1816')

function satin(color: THREE.Color, extras: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.36,
    metalness: 0.03,
    clearcoat: 0.28,
    clearcoatRoughness: 0.48,
    sheen: 0.5,
    sheenRoughness: 0.5,
    sheenColor: CREAM_DEEP,
    ...extras,
  })
}

function metal(color: THREE.Color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.28,
    metalness: 0.95,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
  })
}

function skinMat() {
  return new THREE.MeshPhysicalMaterial({
    color: SKIN,
    roughness: 0.58,
    metalness: 0,
    sheen: 0.25,
    sheenColor: new THREE.Color('#e8b89a'),
  })
}

/** Cream satin with black ink-wash + gold embroidery. */
function makeCoatMap() {
  const size = 1024
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!

  const base = ctx.createLinearGradient(0, 0, size, size)
  base.addColorStop(0, '#f6eee2')
  base.addColorStop(0.5, '#efe4d4')
  base.addColorStop(1, '#e8d9c4')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 2400; i++) {
    ctx.fillStyle = `rgba(200,175,145,${0.015 + Math.random() * 0.04})`
    ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 3, 4 + Math.random() * 10)
  }

  const blot = (cx: number, cy: number, sx: number, sy: number, a = 0.75) => {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate((Math.random() - 0.5) * 1.2)
    const g = ctx.createRadialGradient(0, 0, 2, 0, 0, Math.max(sx, sy))
    g.addColorStop(0, `rgba(18,16,14,${a})`)
    g.addColorStop(0.4, `rgba(28,26,24,${a * 0.4})`)
    g.addColorStop(1, 'rgba(28,26,24,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(0, 0, sx, sy, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = `rgba(22,20,18,${a * 0.55})`
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(-sx * 0.6, 0)
    ctx.quadraticCurveTo(0, -sy * 0.8, sx * 0.5, sy * 0.2)
    ctx.stroke()
    ctx.restore()
  }

  blot(320, 240, 130, 70, 0.85)
  blot(700, 260, 120, 65, 0.8)
  blot(500, 380, 90, 50, 0.55)
  blot(280, 780, 160, 90, 0.9)
  blot(720, 800, 150, 85, 0.88)
  blot(500, 860, 180, 70, 0.7)
  blot(400, 700, 100, 55, 0.6)

  for (let i = 0; i < 160; i++) {
    const x = 140 + Math.random() * 740
    const y = 120 + Math.random() * 780
    const r = 1.5 + Math.random() * 4.5
    ctx.beginPath()
    ctx.fillStyle = `rgba(201,164,92,${0.4 + Math.random() * 0.5})`
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let v = 0; v < 6; v++) {
    const x0 = 180 + v * 120
    ctx.strokeStyle = 'rgba(190,150,80,0.35)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x0, 150)
    for (let y = 150; y < 900; y += 40) {
      ctx.lineTo(x0 + Math.sin(y * 0.02 + v) * 18, y)
    }
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function softAlphaFace(faceTex: THREE.Texture) {
  const img = faceTex.image as HTMLImageElement | ImageBitmap | HTMLCanvasElement
  if (!img) return faceTex

  const w = 512
  const h = 640
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#d4a888'
  ctx.fillRect(0, 0, w, h)
  try {
    ctx.drawImage(img as CanvasImageSource, 0, 0, w, h)
  } catch {
    return faceTex
  }

  // Soft oval alpha so edges blend into head
  const imgData = ctx.getImageData(0, 0, w, h)
  const d = imgData.data
  const cx = w * 0.5
  const cy = h * 0.5
  const rx = w * 0.46
  const ry = h * 0.5
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = (x - cx) / rx
      const ny = (y - cy) / ry
      const r = Math.sqrt(nx * nx + ny * ny)
      let a = 1
      if (r > 0.78) a = Math.max(0, 1 - (r - 0.78) / 0.22)
      d[(y * w + x) * 4 + 3] = Math.round(a * 255)
    }
  }
  ctx.putImageData(imgData, 0, 0)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

function latheBody(profile: [number, number][], segs = 32) {
  const pts = profile.map(([x, y]) => new THREE.Vector2(x, y))
  return new THREE.LatheGeometry(pts, segs)
}

export type RegalTextures = {
  face?: THREE.Texture | null
}

/**
 * Procedural regal character from the cream/gold coat reference.
 * Face uses photo likeness; body proportions slightly idealized.
 */
export function buildRegalCharacter(textures: RegalTextures = {}): THREE.Group {
  const root = new THREE.Group()
  root.name = 'RegalCharacter'

  const coatMap = makeCoatMap()
  const faceMap = textures.face ? softAlphaFace(textures.face) : null

  const coat = satin(CREAM, { map: coatMap })
  const cream = satin(CREAM)
  const gold = metal(GOLD)
  const goldDark = metal(GOLD_DARK)
  const skin = skinMat()
  const hairMat = new THREE.MeshPhysicalMaterial({
    color: HAIR,
    roughness: 0.38,
    metalness: 0.04,
    sheen: 0.65,
    sheenColor: new THREE.Color('#3d2c26'),
  })
  const ink = new THREE.MeshPhysicalMaterial({
    color: INK,
    roughness: 0.5,
    metalness: 0.1,
  })

  // Idealized hourglass (slightly refined)
  const torsoGeo = latheBody([
    [0.0, 0],
    [0.2, 0.02],
    [0.22, 0.12],
    [0.2, 0.28],
    [0.145, 0.42],
    [0.16, 0.55],
    [0.2, 0.72],
    [0.19, 0.88],
    [0.14, 1.02],
    [0.09, 1.12],
    [0.0, 1.14],
  ])
  const torso = new THREE.Mesh(torsoGeo, coat)
  torso.position.set(0, 0.95, 0)
  root.add(torso)

  const turtleneck = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.095, 0.18, 24), cream)
  turtleneck.position.set(0, 2.12, 0)
  root.add(turtleneck)
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.082, 0.022, 10, 28), cream)
  collar.rotation.x = Math.PI / 2
  collar.position.set(0, 2.2, 0)
  root.add(collar)

  // Head (skin base)
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.135, 36, 28), skin)
  head.scale.set(0.9, 1.08, 0.92)
  head.position.set(0, 2.38, 0.01)
  root.add(head)

  // Photo likeness — soft-masked face plane in front of head
  if (faceMap) {
    const faceMat = new THREE.MeshBasicMaterial({
      map: faceMap,
      transparent: true,
      alphaTest: 0.15,
      depthWrite: true,
      side: THREE.DoubleSide,
    })
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.32), faceMat)
    face.position.set(0, 2.39, 0.14)
    face.renderOrder = 2
    root.add(face)
  }

  ;[-1, 1].forEach((s) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 10), skin)
    ear.scale.set(0.4, 0.9, 0.55)
    ear.position.set(s * 0.12, 2.38, 0)
    root.add(ear)
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), gold)
    drop.position.set(s * 0.125, 2.3, 0.015)
    root.add(drop)
  })

  // Hair — crown + back cascade only (keep face open)
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.148, 28, 20), hairMat)
  hairCap.scale.set(1.06, 1.12, 1.05)
  hairCap.position.set(0, 2.45, -0.04)
  root.add(hairCap)

  // Back-of-head fill
  const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 16), hairMat)
  hairBack.scale.set(1.0, 1.05, 0.9)
  hairBack.position.set(0, 2.36, -0.06)
  root.add(hairBack)

  for (let i = 0; i < 18; i++) {
    const t = i / 17
    const side = (t - 0.5) * 2
    const lock = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.038 - Math.abs(side) * 0.01, 0.7 + Math.abs(side) * 0.15, 4, 8),
      hairMat,
    )
    lock.position.set(side * 0.14, 1.7 - Math.abs(side) * 0.05, -0.08 - Math.abs(side) * 0.02)
    lock.rotation.z = side * 0.08
    lock.rotation.x = 0.12
    root.add(lock)
  }
  ;[-1, 1].forEach((s) => {
    for (let i = 0; i < 4; i++) {
      const lock = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.028, 0.55 + i * 0.06, 4, 8),
        hairMat,
      )
      lock.position.set(s * (0.12 + i * 0.035), 1.85 - i * 0.08, 0.0 - i * 0.02)
      lock.rotation.z = s * (0.28 + i * 0.05)
      lock.rotation.x = 0.15
      root.add(lock)
    }
  })

  ;[-1, 1].forEach((s) => {
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 14), coat)
    shoulder.scale.set(1.25, 0.65, 0.95)
    shoulder.position.set(s * 0.24, 1.98, 0)
    root.add(shoulder)

    const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.48, 0.035), coat)
    lapel.position.set(s * 0.11, 1.78, 0.145)
    lapel.rotation.set(0.05, s * 0.55, s * -0.38)
    root.add(lapel)

    const ornament = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.005, 8, 16), gold)
    ornament.position.set(s * 0.1, 1.88, 0.17)
    ornament.rotation.y = s * 0.4
    root.add(ornament)
  })

  const makePanel = (side: number) => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0.32, 0.05)
    shape.lineTo(0.42, 1.15)
    shape.lineTo(0.28, 1.35)
    shape.lineTo(0.02, 1.32)
    shape.lineTo(0, 0)
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
    })
    const panel = new THREE.Mesh(geo, coat)
    panel.position.set(side * 0.02, 0.12, side * 0.02)
    panel.rotation.y = side * 0.35
    panel.rotation.z = side * 0.02
    if (side < 0) {
      panel.scale.x = -1
      panel.position.x = -0.02
    }
    root.add(panel)
  }
  makePanel(1)
  makePanel(-1)

  const backShape = new THREE.Shape()
  backShape.moveTo(-0.22, 0)
  backShape.lineTo(0.22, 0)
  backShape.lineTo(0.28, 1.4)
  backShape.lineTo(-0.28, 1.4)
  backShape.lineTo(-0.22, 0)
  const back = new THREE.Mesh(
    new THREE.ExtrudeGeometry(backShape, { depth: 0.05, bevelEnabled: false }),
    coat,
  )
  back.position.set(0, 0.15, -0.16)
  root.add(back)

  for (let i = 0; i < 10; i++) {
    const s = i % 2 === 0 ? -1 : 1
    const knot = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.005, 6, 14), gold)
    knot.position.set(s * (0.14 + (i % 5) * 0.03), 1.85 - Math.floor(i / 2) * 0.14, 0.16)
    root.add(knot)
  }

  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.038, 14, 40), gold)
  belt.rotation.x = Math.PI / 2
  belt.scale.set(1.08, 1, 0.82)
  belt.position.set(0, 1.35, 0)
  root.add(belt)
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.055), goldDark)
  buckle.position.set(0, 1.35, 0.175)
  root.add(buckle)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const stud = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), goldDark)
    stud.position.set(Math.sin(a) * 0.175, 1.35, Math.cos(a) * 0.14)
    root.add(stud)
  }

  ;[0.08, 0.14].forEach((x, i) => {
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.38 + i * 0.04, 8), ink)
    cord.position.set(x, 1.12, 0.14)
    root.add(cord)
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.075, 10), ink)
    tip.position.set(x, 0.9 - i * 0.02, 0.14)
    root.add(tip)
  })

  ;[-1, 1].forEach((s) => {
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.28, 6, 12), coat)
    upper.position.set(s * 0.32, 1.78, 0)
    upper.rotation.z = s * 0.18
    upper.rotation.x = 0.08
    root.add(upper)

    const lower = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.26, 6, 12), coat)
    lower.position.set(s * 0.38, 1.4, 0.04)
    lower.rotation.z = s * 0.08
    lower.rotation.x = 0.15
    root.add(lower)

    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 8, 18), gold)
    cuff.rotation.x = Math.PI / 2
    cuff.position.set(s * 0.4, 1.22, 0.06)
    root.add(cuff)

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.042, 14, 12), skin)
    hand.scale.set(0.8, 1.15, 0.65)
    hand.position.set(s * 0.4, 1.14, 0.07)
    root.add(hand)
  })

  ;[-1, 1].forEach((s) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.125, 1.0, 22), cream)
    leg.position.set(s * 0.115, 0.5, 0)
    root.add(leg)

    const crease = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.95, 0.015), satin(CREAM_DEEP))
    crease.position.set(s * 0.115, 0.5, 0.12)
    root.add(crease)
  })

  ;[-1, 1].forEach((s) => {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.055, 0.22), cream)
    shoe.position.set(s * 0.115, 0.035, 0.03)
    root.add(shoe)
    const toe = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.11, 10), cream)
    toe.rotation.x = Math.PI / 2
    toe.position.set(s * 0.115, 0.035, 0.16)
    root.add(toe)
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), gold)
    tip.position.set(s * 0.115, 0.035, 0.22)
    root.add(tip)
    const heel = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.065, 8), cream)
    heel.position.set(s * 0.115, -0.005, -0.05)
    root.add(heel)
  })

  root.scale.setScalar(0.92)
  return root
}
