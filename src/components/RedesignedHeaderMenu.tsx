import { useState, useEffect } from 'react'
import { VolumeX, Sparkles, ArrowUpRight } from 'lucide-react'
import { NaiyaDhruvLogo } from './NaiyaDhruvLogo'

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

  const handleNavClick = (section: 'origins' | 'works' | 'about' | 'testimonials' | 'contact') => {
    setActiveSection(section)
    onNavigateSection?.(section)
  }

  return (
    <header data-no-pen="true" className="main-header-nav fixed top-5 left-0 right-0 z-50 px-4 md:px-8 flex items-center justify-between pointer-events-none select-none">
      {/* LEFT: BRAND EMBLEM LOGO */}
      <div
        data-no-pen="true"
        className="pointer-events-auto cursor-pointer flex items-center space-x-3 px-4 py-2 rounded-full bg-neutral-950/80 border border-amber-500/30 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] hover:border-amber-400 transition-all group"
        onClick={() => handleNavClick('origins')}
      >
        <div className="shrink-0">
          <NaiyaDhruvLogo size={22} interactive={true} glow={true} />
        </div>
        <div>
          <span className="text-xs font-serif font-light text-white block leading-none group-hover:text-amber-200 transition-colors">
            NAIYA <span className="italic text-amber-300 font-normal">DHRUV</span>
          </span>
          <span className="text-[7px] font-mono tracking-widest text-neutral-400 uppercase block mt-0.5 group-hover:text-amber-400/80 transition-colors">
            GRAPHIC DESIGNER
          </span>
        </div>
      </div>

      {/* CENTER: FLOATING GLASS NAV CAPSULE */}
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
          <span>WORKS</span>
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

      {/* RIGHT: AUDIO EQUALIZER VISUALIZER & DIRECTIVE TRIGGER */}
      <div data-no-pen="true" className="pointer-events-auto flex items-center space-x-3">
        {/* AUDIO SOUNDSCAPE EQUALIZER BUTTON */}
        <button
          onClick={toggleAudio}
          className="px-3.5 py-2 rounded-full bg-neutral-950/80 hover:bg-neutral-900 border border-amber-500/30 hover:border-amber-400 backdrop-blur-xl text-amber-400 transition-all shadow-lg flex items-center space-x-2 text-[9px] font-mono tracking-widest uppercase cursor-pointer"
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
          <span>{isMuted ? 'AUDIO OFF' : 'AUDIO ON'}</span>
        </button>

        {/* PORTFOLIO BUTTON */}
        <button
          onClick={() => onNavigateSection?.('origins')}
          className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 hover:from-amber-500/40 hover:to-amber-400/40 text-amber-300 border border-amber-400/60 text-[9px] font-mono tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(251,191,36,0.25)] cursor-pointer group"
        >
          <Sparkles className="w-3 h-3 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span>PORTFOLIO</span>
          <ArrowUpRight className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* EQUALIZER KEYFRAMES */}
      <style>{`
        @keyframes equalizer {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        .animate-equalizer1 { animation: equalizer 0.8s ease-in-out infinite; }
        .animate-equalizer2 { animation: equalizer 0.6s ease-in-out infinite 0.2s; }
        .animate-equalizer3 { animation: equalizer 0.9s ease-in-out infinite 0.4s; }
      `}</style>
    </header>
  )
}
