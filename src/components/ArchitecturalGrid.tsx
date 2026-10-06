export function ArchitecturalGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-[0.15]">
      {/* Primary Grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(212, 175, 55, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212, 175, 55, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
        }}
      />
      
      {/* Secondary micro-grid for texture */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(212, 175, 55, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212, 175, 55, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '1rem 1rem',
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      />
      
      {/* Subtle vignette/fade at the edges to blend smoothly */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
    </div>
  )
}
