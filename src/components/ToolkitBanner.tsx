import { STUDIO_ATMOSPHERE } from '../data/portfolio'
import { TextReveal } from './TextReveal'

const TOOLS = [
  'Adobe Illustrator',
  'Photoshop',
  'Figma',
  'Premiere Pro',
  'Brand systems',
  'Editorial',
  'AI-fluent web',
  'Packaging',
  'Identity',
  'Motion frames',
] as const

/** Full-bleed flowy toolkit ribbon — Cloud Studio wave atmosphere. */
export function ToolkitBanner() {
  const loop = [...TOOLS, ...TOOLS]

  return (
    <section id="skills" className="toolkit-banner" aria-label="Toolkit">
      <div
        className="toolkit-banner__mood"
        style={{ backgroundImage: `url(${STUDIO_ATMOSPHERE.toolkitWave})` }}
        aria-hidden="true"
      />
      <div className="toolkit-banner__wave" aria-hidden="true" />
      <div className="toolkit-banner__head page-wrap">
        <TextReveal as="h2" className="toolkit-banner__title" delay={0.06}>
          One studio <em>language.</em>
        </TextReveal>
      </div>
      <div className="toolkit-banner__marquee" aria-hidden="true">
        <div className="toolkit-banner__track">
          {loop.map((label, i) => (
            <span key={`${label}-${i}`} className="toolkit-banner__chip">
              {label}
            </span>
          ))}
        </div>
      </div>
      <ul className="visually-hidden">
        {TOOLS.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </section>
  )
}
