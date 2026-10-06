import { useMemo, useState } from 'react'
import { FadeIn } from './FadeIn'
import { TextReveal } from './TextReveal'

const LINKS = [
  { label: 'Space', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Method', href: '#method' },
  { label: 'Contact', href: '#contact' },
] as const

/** Desire climax — typography + brief over shared sky. No image overlay. */
export function Footer() {
  const year = new Date().getFullYear()
  const [brief, setBrief] = useState('')
  const [name, setName] = useState('')

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(
      name.trim() ? `Brief from ${name.trim()}` : 'Project brief',
    )
    const body = encodeURIComponent(
      [
        name.trim() ? `From: ${name.trim()}` : '',
        '',
        brief.trim() ||
          '(Describe the weird part — product, audience, constraint.)',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    return `mailto:hello@naiyadhruv.com?subject=${subject}&body=${body}`
  }, [brief, name])

  return (
    <footer id="contact" className="site-footer">
      <div className="site-footer__ask">
        <div className="page-wrap site-footer__ask-inner">
          <FadeIn y={28} delay={0.05}>
            <TextReveal as="h2" className="site-footer__title" delay={0.08}>
              Tell me the <em>weird</em> part.
            </TextReveal>
            <p className="site-footer__sub">
              Select projects only. One clear brief beats a long deck.
            </p>
            <p className="site-footer__status">
              <i className="site-footer__dot" aria-hidden="true" />
              Open for collaborations
            </p>
          </FadeIn>

          <FadeIn y={24} delay={0.18} className="site-footer__brief">
            <label className="site-footer__field">
              <span>Your name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Who should she reply to?"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="site-footer__field">
              <span>The brief</span>
              <textarea
                name="brief"
                rows={4}
                placeholder="Product, audience, constraint, weird part…"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
              />
            </label>
            <div className="site-footer__actions">
              <a href={mailto} className="btn-glass site-footer__mail">
                <span>
                  {brief.trim() ? 'Send this brief' : 'hello@naiyadhruv.com'}
                </span>
                <i aria-hidden="true">↗</i>
              </a>
              <a
                href="mailto:hello@naiyadhruv.com?subject=Project%20inquiry"
                className="btn-ghost"
              >
                Book a call
              </a>
            </div>
            <p className="site-footer__social" aria-label="Channels">
              Email first — socials on request.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="site-footer__bar">
        <div className="page-wrap site-footer__bar-inner">
          <nav className="site-footer__nav" aria-label="Footer">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <p className="site-footer__copy">
            Naiya Dhruv — Graphic designer · AI web · © {year}
          </p>
        </div>
      </div>
    </footer>
  )
}
