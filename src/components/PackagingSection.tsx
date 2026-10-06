export function PackagingSection() {
  return (
    <section
      id="packaging"
      className="relative min-h-screen w-full py-24 px-6 sm:px-12 lg:px-16 text-[#0a0a0a] flex flex-col justify-between"
    >
      {/* Top Header */}
      <div className="flex flex-col gap-4 border-b border-[#0a0a0a]/15 pb-8 max-w-7xl">
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#0038ff] uppercase font-bold">
          <span className="w-2 h-2 bg-[#0038ff]" />
          02 / PACKAGING EXPERIENCE
        </div>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tighter">
          2D PRINT → 3D PHYSICAL OBJECT
        </h2>
      </div>

      {/* Main Content Grid & Interactive Dieline Callouts */}
      <div className="my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl">
        {/* Left Column: Storytelling Copy */}
        <div className="lg:col-span-6 flex flex-col gap-6 font-mono">
          <div className="p-6 acetate-panel rounded-lg border border-[#0a0a0a]/15 flex flex-col gap-4">
            <span className="text-xs text-[#0038ff] font-bold uppercase tracking-widest">
              STRUCTURAL DIELINE // FLAP FOLD MECHANICS
            </span>
            <h3 className="font-display text-2xl font-extrabold uppercase text-[#0a0a0a]">
              FROM FLAT GRAPHIC DIELINE TO TACTILE CONTAINER
            </h3>
            <p className="text-sm text-[#4a4a4a] leading-relaxed font-light">
              Packaging is graphic design made spatial. A flat 2D layout grid folds along score lines, transforming ink, paper stock, and foil stamps into a physical vessel that holds value.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#f0ebd9] border border-[#0a0a0a]/10 rounded">
              <dt className="text-[#737373] uppercase tracking-widest mb-1">SCORE LINES</dt>
              <dd className="font-bold text-[#0a0a0a]">90° PRECISION CREASE</dd>
            </div>
            <div className="p-4 bg-[#f0ebd9] border border-[#0a0a0a]/10 rounded">
              <dt className="text-[#737373] uppercase tracking-widest mb-1">FINISHING</dt>
              <dd className="font-bold text-[#0038ff]">COBALT FOIL &amp; EMBOSS</dd>
            </div>
          </dl>
        </div>

        {/* Right Column: Visual Dieline Graphic Frame */}
        <div className="lg:col-span-6">
          <div className="acetate-panel p-8 rounded-lg border border-[#0a0a0a]/20 shadow-2xl relative">
            <div className="flex justify-between items-center font-mono text-xs text-[#737373] border-b border-[#0a0a0a]/10 pb-3 mb-6">
              <span>CAD_DIELINE_PROT_02.DXF</span>
              <span className="text-[#0038ff] font-bold">SCROLL TO FOLD 3D</span>
            </div>

            {/* Dieline Blueprint Vector Graphic */}
            <div className="aspect-[4/3] bg-[#f7f4ee] border border-dashed border-[#0a0a0a]/30 rounded relative flex items-center justify-center p-6">
              <div className="w-full h-full border-2 border-[#0038ff] relative flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-[#0038ff] tracking-widest uppercase">
                  BOTANICAL PACKAGING — 250ML GLASS VESSEL SLEEVE
                </span>
                {/* Dieline folding lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border border-dashed border-[#0a0a0a]/20 pointer-events-none" />
              </div>

              {/* Crop mark corners */}
              <span className="absolute top-2 left-2 crop-mark text-[#0038ff]" />
              <span className="absolute top-2 right-2 crop-mark text-[#0038ff]" />
              <span className="absolute bottom-2 left-2 crop-mark text-[#0038ff]" />
              <span className="absolute bottom-2 right-2 crop-mark text-[#0038ff]" />
            </div>

            <div className="flex justify-between items-center font-mono text-[0.68rem] text-[#4a4a4a] pt-4 mt-2">
              <span>PAPER: 350GSM RECYCLED COTTON</span>
              <span>DIMENSIONS: 120 × 240 × 60 MM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Technical Bar */}
      <div className="border-t border-[#0a0a0a]/15 pt-4 font-mono text-xs tracking-widest text-[#737373] flex justify-between">
        <span>02 / 06 — PACKAGING MECHANICS</span>
        <span className="text-[#0038ff]">CONTINUOUS MESH CONTINUES ↓</span>
      </div>
    </section>
  )
}
