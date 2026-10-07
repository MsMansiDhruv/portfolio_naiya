import { ArrowUpRight, Sparkles, Download, MapPin, Smile } from 'lucide-react'
import { ArchitecturalGrid } from './ArchitecturalGrid'
import { NaiyaDhruvLogo } from './NaiyaDhruvLogo'

interface AboutSectionProps {
  onContactClick?: () => void
}

const FUN_PHILOSOPHY = [
  {
    letter: 'F',
    title: 'Fundamentals',
    desc: 'Get the basics right. Then break them intentionally.'
  },
  {
    letter: 'U',
    title: 'Understanding',
    desc: 'Know the problem before trying to make it pretty.'
  },
  {
    letter: 'N',
    title: 'Nuance',
    desc: 'The subtle details, micro-choices, and craft that make good work feel memorable.'
  }
]

export function AboutSection({ onContactClick }: AboutSectionProps) {
  return (
    <section 
      id="about-section"
      className="relative w-full bg-[#07070a] z-40 border-t border-amber-500/30 rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-25px_60px_rgba(212,175,55,0.08)] overflow-hidden py-10 sm:py-16 md:py-24"
    >
      <ArchitecturalGrid />

      {/* Ambient Illumination Pool */}
      <div className="ambient-glow-pool absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-transparent blur-[140px] rounded-full pointer-events-none" />
      <div className="ambient-glow-pool absolute bottom-12 right-1/4 w-80 h-80 bg-amber-300/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          <div className="section-glide-text inline-flex items-center space-x-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase mb-2.5 sm:mb-4 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>NAIYA DHRUV · GRAPHIC DESIGNER</span>
          </div>

          <h2 className="section-glide-text text-3xl sm:text-5xl md:text-6xl font-serif text-white font-normal tracking-normal mb-2 sm:mb-4">
            About <span className="italic font-normal text-amber-300">Me</span>
          </h2>
        </div>

        {/* Centered Designer Profile & F.U.N. Philosophy Card */}
        <div className="bg-gradient-to-b from-[#13131b]/95 via-[#0e0e14]/95 to-[#09090d]/98 border border-amber-500/25 rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-11 backdrop-blur-xl shadow-2xl relative overflow-hidden hover:border-amber-400/40 transition-all duration-500 mb-4 sm:mb-8">
          
          {/* Subtle Warm Top Accent Glow */}
          <div className="absolute top-0 left-6 right-6 sm:left-12 sm:right-12 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          {/* Header: Monogram, Name, Location & Availability */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-7">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] shrink-0">
                <NaiyaDhruvLogo size={22} interactive={false} glow={true} />
              </div>
              <div>
                <h3 className="text-xl sm:text-3xl font-serif text-white font-normal tracking-wide">Naiya Dhruv</h3>
                <p className="text-[11px] sm:text-xs font-mono text-amber-300/80 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
                  <span>Gujarat, India</span>
                </p>
              </div>
            </div>

            <div className="self-start sm:self-center flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] sm:text-[10px] font-mono tracking-wider">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AVAILABLE FOR WORK</span>
            </div>
          </div>

          {/* Intro Narrative */}
          <div className="text-neutral-200 text-sm sm:text-base md:text-lg font-light leading-relaxed border-t border-white/10 pt-4 sm:pt-6 mb-4 sm:mb-8">
            <p>
              A graphic designer who likes turning ideas into clever, thoughtful visuals. I believe the design process should be <span className="text-amber-300 font-normal">fun</span>, <span className="text-amber-300 font-normal">curious</span>, and a little <span className="text-amber-300 font-normal">experimental</span>.
            </p>
          </div>

          {/* F.U.N. 3-Card Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4 mb-4 sm:mb-8">
            {FUN_PHILOSOPHY.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#0b0b10]/80 border border-white/10 hover:border-amber-400/40 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 font-serif font-bold text-base sm:text-lg group-hover:scale-105 group-hover:bg-amber-500/25 transition-all">
                      {item.letter}
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-base font-serif text-white font-medium mb-1 sm:mb-1.5 group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* F.U.N. Design Philosophy Quote Strip */}
          <div className="rounded-xl sm:rounded-2xl bg-amber-500/[0.07] border border-amber-500/20 p-3.5 sm:p-6 mb-4 sm:mb-8 flex items-start space-x-3 sm:space-x-3.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Smile className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-amber-300 font-semibold mb-0.5 sm:mb-1">
                F.U.N. — pretty much my design philosophy.
              </h5>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed italic">
                “Design should make you stop, look twice, and maybe smile.”
              </p>
            </div>
          </div>

          {/* Action Buttons: Get In Touch + Download Portfolio + CV */}
          <div className="border-t border-white/10 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onContactClick}
              className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-400/40 border border-amber-400/50 text-amber-300 font-mono text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.15)] group/btn cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover/btn:rotate-45 transition-transform" />
              <span>Get In Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>

            <a
              href="/Naiya_Dhruv_Portfolio.pdf"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-neutral-300 hover:text-white font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-200 group/pdf"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover/pdf:scale-110 transition-transform" />
              <span>Download Portfolio + CV</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
