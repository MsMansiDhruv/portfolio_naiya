type SkillId = 'illustrator' | 'photoshop' | 'premiere' | 'figma'

type SkillNode = {
  id: SkillId
  label: string
  orbit: number
  angle: number
  radius: number
  size: number
  delay: string
}

const NODES: SkillNode[] = [
  {
    id: 'illustrator',
    label: 'Adobe Illustrator',
    orbit: 1,
    angle: 270,
    radius: 62,
    size: 42,
    delay: '0.5s',
  },
  {
    id: 'photoshop',
    label: 'Adobe Photoshop',
    orbit: 2,
    angle: 55,
    radius: 88,
    size: 42,
    delay: '0.75s',
  },
  {
    id: 'figma',
    label: 'Figma',
    orbit: 3,
    angle: 200,
    radius: 112,
    size: 42,
    delay: '1s',
  },
  {
    id: 'premiere',
    label: 'Adobe Premiere Pro',
    orbit: 4,
    angle: 320,
    radius: 136,
    size: 44,
    delay: '1.25s',
  },
]

const ORBITS = [
  { id: 1, size: 124, spin: 'skills-spin-left 28s linear infinite' },
  { id: 2, size: 176, spin: 'skills-spin-right 36s linear infinite' },
  { id: 3, size: 224, spin: 'skills-spin-right 44s linear infinite' },
  { id: 4, size: 272, spin: 'skills-spin-left 52s linear infinite' },
  { id: 5, size: 320, spin: 'skills-spin-right 60s linear infinite' },
] as const

function SkillLogo({ id }: { id: SkillId }) {
  switch (id) {
    case 'illustrator':
      return (
        <svg viewBox="0 0 48 48" className="skills-orbit-logo" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#330000" />
          <rect
            x="1.5"
            y="1.5"
            width="45"
            height="45"
            rx="9"
            fill="none"
            stroke="#FF9A00"
            strokeWidth="2"
          />
          <text
            x="24"
            y="31"
            textAnchor="middle"
            fill="#FF9A00"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="18"
            fontWeight="800"
          >
            Ai
          </text>
        </svg>
      )
    case 'photoshop':
      return (
        <svg viewBox="0 0 48 48" className="skills-orbit-logo" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#001E36" />
          <rect
            x="1.5"
            y="1.5"
            width="45"
            height="45"
            rx="9"
            fill="none"
            stroke="#31A8FF"
            strokeWidth="2"
          />
          <text
            x="24"
            y="31"
            textAnchor="middle"
            fill="#31A8FF"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="18"
            fontWeight="800"
          >
            Ps
          </text>
        </svg>
      )
    case 'premiere':
      return (
        <svg viewBox="0 0 48 48" className="skills-orbit-logo" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#00005B" />
          <rect
            x="1.5"
            y="1.5"
            width="45"
            height="45"
            rx="9"
            fill="none"
            stroke="#9999FF"
            strokeWidth="2"
          />
          <text
            x="24"
            y="31"
            textAnchor="middle"
            fill="#9999FF"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="18"
            fontWeight="800"
          >
            Pr
          </text>
        </svg>
      )
    case 'figma':
      return (
        <svg viewBox="0 0 48 48" className="skills-orbit-logo" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#1E1E1E" />
          <path
            d="M18 8h6a6 6 0 0 1 0 12h-6V8z"
            fill="#F24E1E"
          />
          <path
            d="M12 8h6v12h-6a6 6 0 0 1 0-12z"
            fill="#FF7262"
          />
          <path
            d="M12 20h6v12h-6a6 6 0 0 1 0-12z"
            fill="#A259FF"
          />
          <path
            d="M18 20h6a6 6 0 1 1 0 12h-6V20z"
            fill="#1ABCFE"
          />
          <circle cx="27" cy="26" r="6" fill="#0ACF83" />
        </svg>
      )
  }
}

function OrbitNodeView({ node }: { node: SkillNode }) {
  return (
    <div
      className="skills-orbit-slot"
      style={{
        transform: `translate(-50%, -50%) rotate(${node.angle}deg) translate(${node.radius}px) rotate(-${node.angle}deg)`,
      }}
    >
      <div className={`skills-orbit-counter skills-orbit-counter--${node.orbit}`}>
        <div
          className="skills-orbit-pill"
          style={{
            width: node.size,
            height: node.size,
            animationDelay: node.delay,
          }}
          title={node.label}
          aria-label={node.label}
        >
          <SkillLogo id={node.id} />
        </div>
      </div>
    </div>
  )
}

export function SkillsCircles() {
  return (
    <div className="skills-circles">
      <div className="skills-circles__stage">
        {ORBITS.map((orbit) => (
          <div
            key={orbit.id}
            className={`skills-orbit skills-orbit--${orbit.id}`}
            style={{
              width: orbit.size,
              height: orbit.size,
              animation: orbit.spin,
            }}
          >
            {NODES.filter((n) => n.orbit === orbit.id).map((node) => (
              <OrbitNodeView key={node.id} node={node} />
            ))}
          </div>
        ))}
        <div className="skills-orbit-center">
          <div className="skills-orbit-center__inner">
            <span id="skills-heading" className="skills-orbit-center__label">
              Skills
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
