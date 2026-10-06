import { Volume2, VolumeX, Sparkles } from 'lucide-react'
import { NaiyaDhruvLogo } from './NaiyaDhruvLogo'

interface TopNavigationMenuProps {
  isMuted: boolean
  toggleAudio: () => void
  onNavigateSection?: (section: string) => void
}

export function TopNavigationMenu({ isMuted, toggleAudio, onNavigateSection }: TopNavigationMenuProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-xl bg-neutral-950/70 border-b border-amber-500/20 flex items-center justify-between text-white shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-all">
      {/* BRAND / LOGO */}
      <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigateSection?.('origins')}>
        <div className="shrink-0">
          <NaiyaDhruvLogo size={28} interactive={true} glow={true} />
        </div>
        <div>
          <span className="text-sm font-serif font-light tracking-wide text-white block leading-none magnetic group-hover:text-amber-200 transition-colors">
            NAIYA <span className="italic text-amber-300 font-normal">DHRUV</span>
          </span>
          <span className="text-[8px] font-mono tracking-widest text-neutral-400 uppercase block mt-0.5 group-hover:text-amber-400/80 transition-colors">
            LEAD VISUAL ARCHITECT
          </span>
        </div>
      </div>

      {/* CENTER NAV LINKS */}
      <nav className="hidden md:flex items-center space-x-8 text-[10px] font-mono tracking-widest uppercase">
        <button
          onClick={() => onNavigateSection?.('origins')}
          className="text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer relative group"
        >
          <span>01 // ACT I: ORIGINS</span>
          <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-amber-400 group-hover:w-full transition-all duration-300" />
        </button>
        <button
          onClick={() => onNavigateSection?.('works')}
          className="text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer relative group"
        >
          <span>02 // ACT II: WORKS</span>
          <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-amber-400 group-hover:w-full transition-all duration-300" />
        </button>
        <button
          onClick={() => onNavigateSection?.('skills')}
          className="text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer relative group"
        >
          <span>03 // SKILLS &amp; STACK</span>
          <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-amber-400 group-hover:w-full transition-all duration-300" />
        </button>
        <button
          onClick={() => onNavigateSection?.('exhibition')}
          className="text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer relative group"
        >
          <span>04 // ACT III: EXHIBITION</span>
          <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-amber-400 group-hover:w-full transition-all duration-300" />
        </button>
      </nav>

      {/* RIGHT CONTROLLERS */}
      <div className="flex items-center space-x-4">
        {/* AUDIO TOGGLE BUTTON */}
        <button
          onClick={toggleAudio}
          className="px-3.5 py-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-amber-400 border border-amber-500/40 hover:border-amber-300 rounded-full backdrop-blur-md transition-all shadow-lg flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          )}
          <span>{isMuted ? 'AUDIO OFF' : 'AUDIO ON'}</span>
        </button>

        {/* CONTACT DIRECTIVE CTA */}
        <button
          onClick={() => onNavigateSection?.('exhibition')}
          className="hidden sm:flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 hover:from-amber-500/40 hover:to-amber-400/40 text-amber-300 border border-amber-400/60 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)] cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>INITIATE DIRECTIVE</span>
        </button>
      </div>
    </header>
  )
}
