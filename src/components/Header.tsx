import { useEffect, useState } from 'react'
import { LogoGold } from './LogoGold'

const LINKS = [
  { label: 'Space', href: '#top', id: 'top' },
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Method', href: '#method', id: 'method' },
  { label: 'Contact', href: '#contact', id: 'contact' },
] as const

function sectionProgress(id: string) {
  const el = document.getElementById(id)
  if (!el) return -Infinity
  const rect = el.getBoundingClientRect()
  // Prefer the section whose top is nearest above the mid-viewport band
  return Math.abs(rect.top - window.innerHeight * 0.28)
}

/** Left-edge rail only — never overlays the center character. */
export function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#top')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const update = () => {
      let best: (typeof LINKS)[number] = LINKS[0]
      let bestScore = Infinity
      for (const link of LINKS) {
        const score = sectionProgress(link.id)
        if (score < bestScore) {
          bestScore = score
          best = link
        }
      }
      // Hero pin: while still in hero-scroll, treat upper half as Space, lower as Work
      const hero = document.getElementById('hero-scroll')
      if (hero) {
        const hr = hero.getBoundingClientRect()
        if (hr.bottom > window.innerHeight * 0.55 && hr.top < window.innerHeight * 0.2) {
          const progress =
            Math.min(Math.max(-hr.top, 0) / Math.max(hero.offsetHeight - window.innerHeight, 1), 1)
          setActive(progress > 0.55 ? '#work' : '#top')
          return
        }
      }
      setActive(best.href)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    window.addEventListener('site-scroll', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('site-scroll', update)
    }
  }, [])

  return (
    <>
      <header className="side-nav" aria-label="Primary">
        <div className="side-nav__top">
          <a
            href="#top"
            className="side-nav__logo"
            aria-label="Naiya Dhruv home"
          >
            <LogoGold size={44} />
          </a>
          <button
            type="button"
            className={`side-nav__burger liquid-glass ${open ? 'is-open' : ''}`}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>

        <nav className="side-nav__rail liquid-glass" aria-label="Sections">
          {LINKS.map((link) => {
            const isActive = active === link.href
            return (
              <a
                key={link.href}
                href={link.href}
                className={`side-nav__link${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="side-nav__label">{link.label}</span>
              </a>
            )
          })}
        </nav>
      </header>

      <div
        id="site-menu"
        className={`site-menu ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
      >
        <div className="site-menu__glass liquid-glass-panel">
          <nav className="site-menu__nav" aria-label="Menu">
            {LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`site-menu__link${active === link.href ? ' is-active' : ''}`}
                style={{ transitionDelay: open ? `${100 + i * 55}ms` : '0ms' }}
                onClick={() => setOpen(false)}
              >
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
          <a
            href="mailto:hello@naiyadhruv.com"
            className="site-menu__mail"
            onClick={() => setOpen(false)}
          >
            hello@naiyadhruv.com
          </a>
        </div>
      </div>
    </>
  )
}
