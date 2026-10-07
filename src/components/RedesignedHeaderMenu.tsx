import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { VolumeX, Sparkles, ArrowUpRight, Menu, X } from 'lucide-react'

interface RedesignedHeaderMenuProps {
  isMuted: boolean
  toggleAudio: () => void
  onNavigateSection?: (section: string) => void
  scrollProgress?: number
}

export function RedesignedHeaderMenu({
  isMuted,
  toggleAudio,
  onNavigateSection,
}: RedesignedHeaderMenuProps) {
  const [activeSection, setActiveSection] = useState<'origins' | 'works' | 'about' | 'testimonials' | 'contact'>('origins')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isDrawerRendered, setIsDrawerRendered] = useState<boolean>(false)
  const [isDrawerActive, setIsDrawerActive] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const viewportY = window.innerHeight * 0.40

      const contactEl = document.getElementById('contact-section') || document.getElementById('colophon-footer')
      const testimonialsEl = document.getElementById('testimonials-section')
      const aboutEl = document.getElementById('about-section')
      const workEl = document.getElementById('work-section')

      if (contactEl && contactEl.getBoundingClientRect().top <= viewportY + 120) {
        setActiveSection('contact')
      } else if (testimonialsEl && testimonialsEl.getBoundingClientRect().top <= viewportY + 80) {
        setActiveSection('testimonials')
      } else if (aboutEl && aboutEl.getBoundingClientRect().top <= viewportY + 80) {
        setActiveSection('about')
      } else if (workEl && workEl.getBoundingClientRect().top <= viewportY + 80) {
        setActiveSection('works')
      } else {
        setActiveSection('origins')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const openMenu = () => {
    setIsDrawerRendered(true)
    setIsMobileMenuOpen(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDrawerActive(true)
      })
    })
  }

  const closeMenu = (callback?: () => void) => {
    setIsDrawerActive(false)
    setIsMobileMenuOpen(false)
    setTimeout(() => {
      setIsDrawerRendered(false)
      callback?.()
    }, 280)
  }

  const toggleMenu = () => {
    if (isMobileMenuOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  useEffect(() => {
    const lenis = (window as any).__lenis
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      if (lenis) lenis.stop()
    } else {
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    }
    return () => {
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (section: 'origins' | 'works' | 'about' | 'testimonials' | 'contact') => {
    setActiveSection(section)
    closeMenu(() => {
      onNavigateSection?.(section)
    })
  }

  return (
    <>
      <header 
        data-no-pen="true" 
        className="main-header-nav fixed top-3 sm:top-5 left-0 right-0 z-50 px-2.5 sm:px-4 md:px-8 flex items-center justify-between pointer-events-none select-none w-full max-w-[100vw]"
      >
        {/* LEFT PLACEHOLDER TO MAINTAIN BALANCED HEADER ALIGNMENT */}
        <div className="w-10 sm:w-12 pointer-events-none" />

        {/* CENTER: FLOATING GLASS NAV CAPSULE (DESKTOP) */}
        <nav
          data-no-pen="true"
          className="hidden lg:flex pointer-events-auto items-center space-x-5 px-6 py-2.5 rounded-full bg-neutral-950/80 border border-amber-500/30 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-[10px] font-mono tracking-widest uppercase"
        >
          <button
            onClick={() => handleNavClick('origins')}
            className={`transition-all cursor-pointer relative group ${
              activeSection === 'origins' ? 'text-amber-300 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>ORIGINS</span>
            <span className={`absolute left-0 -bottom-1 h-[1.5px] bg-amber-400 transition-all ${activeSection === 'origins' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </button>

          <span className="text-neutral-700">·</span>

          <button
            onClick={() => handleNavClick('works')}
            className={`transition-all cursor-pointer relative group ${
              activeSection === 'works' ? 'text-amber-300 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>PROJECTS</span>
            <span className={`absolute left-0 -bottom-1 h-[1.5px] bg-amber-400 transition-all ${activeSection === 'works' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </button>

          <span className="text-neutral-700">·</span>

          <button
            onClick={() => handleNavClick('about')}
            className={`transition-all cursor-pointer relative group ${
              activeSection === 'about' ? 'text-amber-300 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>ABOUT</span>
            <span className={`absolute left-0 -bottom-1 h-[1.5px] bg-amber-400 transition-all ${activeSection === 'about' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </button>

          <span className="text-neutral-700">·</span>

          <button
            onClick={() => handleNavClick('testimonials')}
            className={`transition-all cursor-pointer relative group ${
              activeSection === 'testimonials' ? 'text-amber-300 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>VOICES</span>
            <span className={`absolute left-0 -bottom-1 h-[1.5px] bg-amber-400 transition-all ${activeSection === 'testimonials' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </button>

          <span className="text-neutral-700">·</span>

          <button
            onClick={() => handleNavClick('contact')}
            className={`transition-all cursor-pointer relative group ${
              activeSection === 'contact' ? 'text-amber-300 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>CONNECT</span>
            <span className={`absolute left-0 -bottom-1 h-[1.5px] bg-amber-400 transition-all ${activeSection === 'contact' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </button>
        </nav>

        {/* RIGHT: AUDIO EQUALIZER VISUALIZER & MOBILE MENU BUTTON */}
        <div data-no-pen="true" className="pointer-events-auto flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {/* AUDIO SOUNDSCAPE EQUALIZER BUTTON */}
          <button
            onClick={toggleAudio}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-neutral-950/90 hover:bg-neutral-900 border border-amber-500/30 hover:border-amber-400 backdrop-blur-xl text-amber-400 transition-all shadow-lg flex items-center space-x-1.5 sm:space-x-2 text-[8px] sm:text-[9px] font-mono tracking-widest uppercase cursor-pointer min-h-[34px] sm:min-h-[38px]"
          >
            {!isMuted ? (
              <div className="flex items-end space-x-0.5 h-3">
                <span className="w-0.5 bg-amber-400 animate-equalizer1 h-full rounded-full" />
                <span className="w-0.5 bg-amber-300 animate-equalizer2 h-2/3 rounded-full" />
                <span className="w-0.5 bg-amber-400 animate-equalizer3 h-4/5 rounded-full" />
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
            )}
            <span className="text-[8px] sm:text-[9px]">{isMuted ? 'MUTE' : 'SOUND'}</span>
          </button>

          {/* PORTFOLIO BUTTON (DESKTOP) */}
          <button
            onClick={() => onNavigateSection?.('origins')}
            className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 hover:from-amber-500/40 hover:to-amber-400/40 text-amber-300 border border-amber-400/60 text-[9px] font-mono tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(251,191,36,0.25)] cursor-pointer group"
          >
            <Sparkles className="w-3 h-3 text-amber-400 group-hover:rotate-45 transition-transform" />
            <span>PORTFOLIO</span>
            <ArrowUpRight className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* MOBILE MENU TOGGLE (MOBILE ONLY) */}
          <button
            type="button"
            onClick={toggleMenu}
            className="lg:hidden p-1.5 sm:p-2 rounded-full bg-neutral-950/90 border border-amber-500/30 text-amber-400 hover:border-amber-400 transition-all backdrop-blur-xl shadow-lg cursor-pointer min-h-[34px] min-w-[34px] sm:min-h-[38px] sm:min-w-[38px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER (Portaled directly to document.body with Smooth Open/Close Animation) */}
      {mounted && isDrawerRendered && createPortal(
        <div 
          data-no-pen="true"
          className={`fixed inset-0 z-[100000] bg-black/85 backdrop-blur-2xl flex flex-col justify-center items-center p-4 select-none lg:hidden pointer-events-auto transition-opacity duration-300 ease-out ${
            isDrawerActive ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => closeMenu()}
        >
          <div 
            className={`w-full max-w-xs flex flex-col items-center gap-2.5 bg-[#0e0e14] border border-amber-500/30 p-5 sm:p-6 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] pointer-events-auto transition-all duration-300 ease-out transform ${
              isDrawerActive ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header Row with Title and Close Icon */}
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-1">
              <div className="flex items-center space-x-2 text-[9px] font-mono tracking-widest text-amber-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>NAVIGATION DIRECTORY</span>
              </div>
              <button
                type="button"
                onClick={() => closeMenu()}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-amber-300 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close directory"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {[
              { id: 'origins', label: '01. ORIGINS (HERO)' },
              { id: 'works', label: '02. PROJECTS (3D)' },
              { id: 'about', label: '03. ABOUT THE DESIGNER' },
              { id: 'testimonials', label: '04. PEER FEEDBACK' },
              { id: 'contact', label: '05. CONNECT & CONTACT' },
            ].map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id as any)}
                style={{ transitionDelay: `${idx * 25}ms` }}
                className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-mono tracking-wider transition-all text-left flex items-center justify-between cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-amber-400 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white hover:border-amber-400/30'
                }`}
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
