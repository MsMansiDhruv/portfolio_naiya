const links = [
  { label: 'Projects', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const

export function Navbar() {
  return (
    <header className="site-nav relative z-30 flex h-11 w-full items-center justify-between gap-4 px-[var(--page-inset)] sm:h-12">
      <a
        href="#top"
        className="site-nav__logo shrink-0 no-underline"
        style={{ fontFamily: 'var(--font-display)' }}
        aria-label="Naiya Dhruv home"
      >
        N.
      </a>

      <nav
        className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex"
        aria-label="Primary"
      >
        {links.map((link) => (
          <a
            key={`${link.label}-${link.href}`}
            href={link.href}
            className="site-nav__link"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a href="#contact" className="site-btn site-btn--ink shrink-0">
        Let&apos;s Create
      </a>
    </header>
  )
}
