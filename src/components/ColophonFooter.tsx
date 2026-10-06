import { ArrowUp, MapPin } from 'lucide-react'
import { NaiyaDhruvLogo } from './NaiyaDhruvLogo'

interface ColophonFooterProps {
  onScrollToTop?: () => void
}

export function ColophonFooter({ onScrollToTop }: ColophonFooterProps) {
  return (
    <footer className="w-full bg-[#030303] border-t border-white/5 py-8 md:py-10 text-neutral-400 font-mono text-xs z-50 relative">
      <div className="max-w-6xl mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* LEFT: BRAND COPYRIGHT & SPEC - ALIGNED WITH SECTION ABOVE */}
        <div className="flex flex-col space-y-1 text-left w-full md:w-auto">
          <div className="flex items-center space-x-2.5 text-amber-400 font-semibold uppercase tracking-widest text-[11px]">
            <NaiyaDhruvLogo size={18} interactive={false} glow={true} className="shrink-0" />
            <span>NAIYA DHRUV — GRAPHIC DESIGNER</span>
          </div>
          <p className="text-[10px] text-neutral-500 font-light">
            © 2026 Naiya Dhruv. All rights reserved.
          </p>
        </div>

        {/* CENTER: LOCATION ONLY */}
        <div className="flex items-center space-x-1.5 text-[10px] tracking-widest uppercase text-neutral-400">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Gujarat, India</span>
        </div>

        {/* RIGHT: BACK TO TOP BUTTON */}
        <button
          onClick={onScrollToTop}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-800 hover:border-amber-400/60 transition-all text-[10px] uppercase tracking-widest cursor-pointer shadow-lg group"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  )
}
