import { Box, Layers, Hexagon } from 'lucide-react'

interface Spatial3DLayerProps {
  scrollProgress: number
}

export function Spatial3DLayer({ scrollProgress }: Spatial3DLayerProps) {
  // Parallax translation factors
  const pY1 = (0.2 - scrollProgress) * 220
  const pY2 = (0.5 - scrollProgress) * 280
  const pY3 = (0.8 - scrollProgress) * 200

  return (
    <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden select-none">
      {/* 3D FLOATING GLASS DIELINE FACET 1 (TOP RIGHT DEPTH LAYER) */}
      <div
        className="absolute top-28 right-24 hidden xl:flex flex-col items-center justify-center p-4 rounded-2xl border border-amber-400/30 bg-amber-400/5 backdrop-blur-md shadow-[0_0_35px_rgba(251,191,36,0.18)] transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1200px) translate3d(0px, ${pY1}px, 110px) rotateY(-18deg) rotateX(12deg)`,
        }}
      >
        <Box className="w-7 h-7 text-amber-400 animate-pulse mb-1.5" />
        <span className="text-[8px] font-mono tracking-widest text-amber-300 uppercase font-bold">GLASS DIELINE CAD</span>
        <span className="text-[7px] font-mono text-neutral-400 mt-0.5">SCALE: 1:1 // 24K FOIL</span>
      </div>

      {/* 3D FLOATING FOIL MEDALLION (CENTER LEFT DEPTH LAYER) */}
      <div
        className="absolute top-1/2 left-20 hidden lg:flex items-center space-x-3 p-3 rounded-xl border border-amber-300/40 bg-neutral-950/80 backdrop-blur-xl shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1200px) translate3d(0px, ${pY2}px, 140px) rotateY(15deg) rotateX(-8deg)`,
        }}
      >
        <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400/50">
          <Hexagon className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '12s' }} />
        </div>
        <div>
          <span className="text-[9px] font-mono font-bold text-amber-300 block uppercase tracking-wider">
            3D SPATIAL SYSTEM
          </span>
          <span className="text-[8px] font-mono text-neutral-400 block">
            RAY-TRACED REFRACTION
          </span>
        </div>
      </div>

      {/* 3D FLOATING SPECIFICATION BADGE (BOTTOM RIGHT DEPTH LAYER) */}
      <div
        className="absolute bottom-32 right-28 hidden lg:flex items-center space-x-2 px-3.5 py-2 rounded-full border border-amber-500/30 bg-neutral-950/80 backdrop-blur-lg shadow-xl transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1200px) translate3d(0px, ${pY3}px, 90px) rotateY(-10deg)`,
        }}
      >
        <Layers className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[8px] font-mono text-neutral-300 uppercase tracking-widest">
          HARDWARE ACCELERATED // WebGL 2.0
        </span>
      </div>

      {/* AMBIENT FLOATING GOLDEN SPARKS / DUST PARTICLES */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 text-amber-300/40 text-xs animate-floatParticle1"
          style={{ transform: `translateY(${pY1 * 0.5}px)` }}
        >
          ✦
        </div>
        <div
          className="absolute top-2/3 right-1/3 text-amber-400/50 text-sm animate-floatParticle2"
          style={{ transform: `translateY(${pY2 * 0.6}px)` }}
        >
          ✨
        </div>
        <div
          className="absolute top-1/2 right-1/4 text-amber-200/30 text-xs animate-floatParticle3"
          style={{ transform: `translateY(${pY3 * 0.4}px)` }}
        >
          ·
        </div>
      </div>

      {/* PARALLAX FLOATING ANIMATIONS */}
      <style>{`
        @keyframes floatParticle1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
        @keyframes floatParticle2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.2); }
        }
        @keyframes floatParticle3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-floatParticle1 { animation: floatParticle1 6s ease-in-out infinite; }
        .animate-floatParticle2 { animation: floatParticle2 8s ease-in-out infinite; }
        .animate-floatParticle3 { animation: floatParticle3 5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
