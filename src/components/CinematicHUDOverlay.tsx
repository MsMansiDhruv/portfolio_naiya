interface CinematicHUDOverlayProps {
  currentFrame: number
  totalFrames: number
  scrollProgress: number
}

export function CinematicHUDOverlay({ currentFrame, totalFrames, scrollProgress }: CinematicHUDOverlayProps) {
  // Format current frame timecode (30fps)
  const totalSeconds = currentFrame / 30
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const frames = Math.floor((totalSeconds % 1) * 30)

  const timecodeStr = `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`

  let currentAct = 'ACT I // TACTILE ORIGINS'
  if (scrollProgress >= 0.30 && scrollProgress <= 0.54) currentAct = 'ACT II // SELECTED WORKS'
  else if (scrollProgress >= 0.56 && scrollProgress <= 0.78) currentAct = 'ACT III // SKILLS & STACK'
  else if (scrollProgress >= 0.80) currentAct = 'ACT IV // THE EXHIBITION'

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden select-none">
      {/* 4-CORNER GRAPHIC DESIGNER VIEWFINDER RETICLES */}
      <div className="absolute top-20 left-8 md:left-12 flex items-center space-x-1.5 text-amber-400/60 font-mono text-[9px] tracking-widest uppercase">
        <span className="text-amber-400 font-bold">+</span>
        <span>TL // 00.00.00</span>
      </div>

      <div className="absolute top-20 right-8 md:right-12 flex items-center space-x-1.5 text-amber-400/60 font-mono text-[9px] tracking-widest uppercase">
        <span>TR // 3840x2160</span>
        <span className="text-amber-400 font-bold">+</span>
      </div>

      <div className="absolute bottom-16 left-8 md:left-12 flex items-center space-x-1.5 text-amber-400/60 font-mono text-[9px] tracking-widest uppercase">
        <span className="text-amber-400 font-bold">+</span>
        <span>BL // GLASS DIELINE</span>
      </div>

      <div className="absolute bottom-16 right-8 md:right-12 flex items-center space-x-1.5 text-amber-400/60 font-mono text-[9px] tracking-widest uppercase">
        <span>BR // 30.00 FPS</span>
        <span className="text-amber-400 font-bold">+</span>
      </div>

      {/* TOP FLOATING TIMECODE & CAM STATUS BAR */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 hidden md:flex items-center space-x-6 px-4 py-1.5 rounded-full bg-neutral-950/80 border border-amber-500/20 backdrop-blur-md text-[9px] font-mono tracking-widest uppercase text-neutral-300 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 font-bold">REC 30FPS</span>
        </div>

        <span className="text-neutral-700">|</span>

        <span className="text-amber-300 font-mono">TC {timecodeStr}</span>

        <span className="text-neutral-700">|</span>

        <span className="text-neutral-400">
          FRAME <span className="text-amber-400">{String(currentFrame).padStart(4, '0')}</span> / {totalFrames}
        </span>

        <span className="text-neutral-700">|</span>

        <span className="text-amber-400/90 font-medium">{currentAct}</span>
      </div>

      {/* BOTTOM CENTER LIVE SCROLL TIMELINE SCRUB BAR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 md:w-96 flex flex-col items-center space-y-1 z-30">
        <div className="w-full flex items-center justify-between text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
          <span>00:00</span>
          <span className="text-amber-400 font-semibold">{Math.round(scrollProgress * 100)}% TIMELINE</span>
          <span>00:30</span>
        </div>
        <div className="w-full h-1 bg-neutral-900/90 rounded-full overflow-hidden border border-amber-500/30 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-400 rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
            style={{ width: `${Math.max(2, scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
