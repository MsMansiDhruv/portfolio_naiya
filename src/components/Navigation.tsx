import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'WORK', href: '#work', num: '01' },
  { label: 'PACKAGING', href: '#packaging', num: '02' },
  { label: 'PROCESS', href: '#process', num: '03' },
  { label: 'ABOUT', href: '#about', num: '04' },
  { label: 'TESTIMONIALS', href: '#testimonials', num: '05' },
  { label: 'CONTACT', href: '#contact', num: '06' },
] as const

export function Navigation() {
  const [activeSection, setActiveSection] = useState('01')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollY / Math.max(docH, 1)

      if (ratio < 0.2) setActiveSection('01')
      else if (ratio < 0.4) setActiveSection('02')
      else if (ratio < 0.6) setActiveSection('03')
      else if (ratio < 0.8) setActiveSection('04')
      else setActiveSection('06')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 px-6 sm:px-12 py-6 flex items-center justify-between pointer-events-none mix-blend-difference text-[#f7f4ee]">
        {/* Left: Branding */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            scrollTo('#top')
          }}
          className="pointer-events-auto flex items-center gap-3 group"
        >
          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#0038ff] text-[#ffffff] rounded-sm">
            N / D
          </span>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-sm tracking-tight leading-none group-hover:text-[#0038ff] transition-colors">
              NAIYA DHRUV
            </span>
            <span className="font-mono text-[0.65rem] tracking-widest opacity-75">
              GRAPHIC DESIGNER
            </span>
          </div>
        </a>

        {/* Center: Active Section Indicator */}
        <div className="hidden md:flex items-center gap-2 font-mono text-xs tracking-widest opacity-80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0038ff]" />
          <span>{activeSection} / EDITORIAL MESH SYSTEM</span>
        </div>

        {/* Right: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 pointer-events-auto font-mono text-xs tracking-widest">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(link.href)
              }}
              className="relative hover:text-[#0038ff] transition-colors py-1 group"
            >
              <span className="text-[0.65rem] text-[#0038ff] mr-1">{link.num}</span>
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0038ff] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden pointer-events-auto font-mono text-xs tracking-widest px-4 py-2 border border-[#f7f4ee]/30 rounded-full hover:bg-[#f7f4ee]/10 transition-colors"
        >
          {mobileOpen ? 'CLOSE [X]' : 'MENU'}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-[#0a0a0a] text-[#f7f4ee] flex flex-col justify-center px-8 py-16 font-mono">
          <div className="flex flex-col gap-6 text-2xl font-bold">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo(link.href)
                }}
                className="flex items-center justify-between border-b border-[#f7f4ee]/10 pb-4 hover:text-[#0038ff] transition-colors"
              >
                <span>{link.label}</span>
                <span className="text-xs text-[#0038ff]">{link.num}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
