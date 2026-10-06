import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { TechnicalSailboat } from './TechnicalSailboat'
import '../styles/curve-footer.css'

export function GSAPCurveFooter() {
  const year = new Date().getFullYear()
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const strokeRef = useRef<SVGPathElement>(null)
  const morphShapeRef = useRef<SVGPathElement>(null)
  const [brief, setBrief] = useState('')
  const [name, setName] = useState('')

  // GSAP Curve Mode & Morphing Shape Scroll Scrub
  useEffect(() => {
    if (prefersReducedMotion()) return
    const section = sectionRef.current
    const path = pathRef.current
    const stroke = strokeRef.current
    const morphShape = morphShapeRef.current
    if (!section || !path || !stroke) return

    const obj = { y: 40, x: 50 }

    const updatePath = () => {
      const fillD = `M 0 140 L 0 40 Q ${obj.x} ${obj.y} 100 40 L 100 140 Z`
      const strokeD = `M 0 40 Q ${obj.x} ${obj.y} 100 40`
      path.setAttribute('d', fillD)
      stroke.setAttribute('d', strokeD)
    }

    const ctx = gsap.context(() => {
      // 1. GSAP Curve Mode Scrub: Liquid elastic dip on scroll
      gsap.fromTo(
        obj,
        { y: 40, x: 50 },
        {
          y: 115,
          ease: 'power2.out',
          onUpdate: updatePath,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.8,
          },
        },
      )

      gsap.to(obj, {
        y: 40,
        ease: 'elastic.out(1.2, 0.4)',
        onUpdate: updatePath,
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'top 20%',
          scrub: 1,
        },
      })

      // 2. DrawSVG & MorphSVG Plugin Integration: Stroke reveal + MorphSVG Diamond -> Lightning
      if (stroke) {
        gsap.fromTo(
          stroke,
          { drawSVG: '0% 0%' },
          {
            drawSVG: '0% 100%',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top center',
              scrub: 1,
            },
          },
        )
      }

      if (morphShape) {
        const diamondPath = 'M 50 10 L 90 50 L 50 90 L 10 50 Z'
        const lightningPath = 'M 55 10 L 22 54 L 46 54 L 38 90 L 78 44 L 52 44 Z'

        gsap.fromTo(
          morphShape,
          { morphSVG: diamondPath },
          {
            morphSVG: lightningPath,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 30%',
              scrub: true,
            },
          },
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  // Pointer Interactive Curve Nudge
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !pathRef.current || !strokeRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const xPct = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 10), 90)
    const yVal = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 30), 125)

    const fillD = `M 0 140 L 0 40 Q ${xPct} ${yVal} 100 40 L 100 140 Z`
    const strokeD = `M 0 40 Q ${xPct} ${yVal} 100 40`

    gsap.to([pathRef.current, strokeRef.current], {
      attr: { d: (i) => (i === 0 ? fillD : strokeD) },
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [])

  const handlePointerLeave = useCallback(() => {
    if (!pathRef.current || !strokeRef.current) return
    const fillD = 'M 0 140 L 0 40 Q 50 40 100 40 L 100 140 Z'
    const strokeD = 'M 0 40 Q 50 40 100 40'

    gsap.to([pathRef.current, strokeRef.current], {
      attr: { d: (i) => (i === 0 ? fillD : strokeD) },
      duration: 0.8,
      ease: 'elastic.out(1.2, 0.4)',
      overwrite: 'auto',
    })
  }, [])

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(
      name.trim() ? `Project Brief from ${name.trim()}` : 'New Project Inquiry',
    )
    const body = encodeURIComponent(
      [
        name.trim() ? `From: ${name.trim()}` : '',
        '',
        brief.trim() || 'Describing the brand / digital project goals...',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    return `mailto:hello@naiyadhruv.com?subject=${subject}&body=${body}`
  }, [brief, name])

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="curve-footer-wrapper"
      aria-label="Footer & Contact"
    >
      {/* GSAP Curve Mode Morphing SVG Wave Header — Positioned Above Black Footer Layer */}
      <div
        className="curve-svg-container"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <svg
          viewBox="0 0 100 140"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="goldCurveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b8925e" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#b8925e" />
            </linearGradient>
          </defs>
          <path
            ref={pathRef}
            d="M 0 140 L 0 40 Q 50 40 100 40 L 100 140 Z"
            className="curve-svg-path"
          />
          <path
            ref={strokeRef}
            d="M 0 40 Q 50 40 100 40"
            className="curve-stroke-line"
          />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="curve-footer-body">
        <div className="curve-footer-head">
          {/* GSAP Morphing Shape Icon (Diamond -> Lightning) */}
          <div className="morph-icon-wrap" title="GSAP Morph SVG Accent">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              <path
                ref={morphShapeRef}
                d="M 50 10 L 90 50 L 50 90 L 10 50 Z"
                fill="url(#goldCurveGlow)"
              />
            </svg>
          </div>

          <span className="curve-footer-kicker">INITIATE COLLABORATION</span>
          <h2 className="curve-footer-title">
            Let’s build something <em>memorable.</em>
          </h2>
          <p className="curve-footer-sub">
            Brand communication, packaging, print &amp; AI-first web experiences.
            Tell me about your project goals.
          </p>
        </div>

        {/* Project Brief Form & Designer Meta Grid */}
        <div className="curve-footer-brief-grid">
          <form
            className="curve-brief-form"
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = mailto
            }}
          >
            <div className="curve-brief-field">
              <label htmlFor="user-name" className="curve-brief-label">
                Your Name / Brand
              </label>
              <input
                id="user-name"
                type="text"
                placeholder="e.g. Elena Vance / Studio Acme"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="curve-brief-input"
                required
              />
            </div>

            <div className="curve-brief-field">
              <label htmlFor="user-brief" className="curve-brief-label">
                The Project Brief
              </label>
              <textarea
                id="user-brief"
                rows={4}
                placeholder="Product vision, target audience, timeline, or key constraints..."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="curve-brief-textarea"
                required
              />
            </div>

            <div className="curve-brief-actions">
              <button type="submit" className="curve-brief-submit">
                <span>Send Direct Brief</span>
                <span>↗</span>
              </button>
            </div>
          </form>

          {/* Designer Metadata Sidebar */}
          <div className="curve-meta-list">
            <div className="curve-meta-item">
              <span className="curve-meta-term">LOCATION &amp; TIME</span>
              <p className="curve-meta-desc">India · IST (UTC+5:30)</p>
            </div>

            <div className="curve-meta-item">
              <span className="curve-meta-term">PRIMARY FOCUS</span>
              <p className="curve-meta-desc">
                Brand Systems · Packaging · Editorial · Web UIs
              </p>
            </div>

            <div className="curve-meta-item">
              <span className="curve-meta-term">DIRECT CONTACT</span>
              <p className="curve-meta-desc">hello@naiyadhruv.com</p>
            </div>

            <div className="curve-meta-item">
              <span className="curve-meta-term">CHANNELS</span>
              <div className="curve-social-links">
                <a href="#work" className="curve-social-link">Behance ↗</a>
                <a href="#work" className="curve-social-link">Dribbble ↗</a>
                <a href="#work" className="curve-social-link">Instagram ↗</a>
                <a href="#work" className="curve-social-link">LinkedIn ↗</a>
              </div>
            </div>

            {/* Industrial Design Sailboat CAD Drawing */}
            <div className="curve-meta-item pt-2">
              <TechnicalSailboat />
            </div>
          </div>
        </div>

        {/* Footer Bottom Status Bar */}
        <div className="curve-footer-bottom">
          <p className="curve-footer-copy">
            © {year} Naiya Dhruv · Graphic Designer &amp; AI Web Engineer
          </p>

          <div className="curve-footer-status">
            <span className="curve-status-dot" />
            <span>Available for Select Q4 Collaborations</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
