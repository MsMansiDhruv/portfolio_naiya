export function ProcessSection() {
  const LAYERS = [
    { num: '01', title: 'IMAGE', desc: 'Raw photographic crops & botanical captures.' },
    { num: '02', title: 'TYPE', desc: 'Grotesk display & technical monospaced hierarchy.' },
    { num: '03', title: 'COLOR', desc: 'Warm ivory, deep black & restrained cobalt blue.' },
    { num: '04', title: 'GRID', desc: '12-column architectural layout & crop mark system.' },
    { num: '05', title: 'TEXTURE', desc: 'Translucent acetate sheets & 350gsm cotton paper stock.' },
    { num: '06', title: 'COMPOSITION', desc: 'Recombined physical graphic artifact.' },
  ]

  return (
    <section
      id="process"
      className="relative min-h-screen w-full py-24 px-6 sm:px-12 lg:px-16 text-[#0a0a0a] flex flex-col justify-between"
    >
      {/* Top Header */}
      <div className="flex flex-col gap-4 border-b border-[#0a0a0a]/15 pb-8 max-w-7xl">
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#0038ff] uppercase font-bold">
          <span className="w-2 h-2 bg-[#0038ff]" />
          03 / PROCESS — LAYER SEPARATION
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tighter">
            HOW I BUILD
          </h2>
          <span className="font-mono text-xs tracking-widest text-[#737373]">
            GRAPHIC FILE DECONSTRUCTION IN 3D DEPTH
          </span>
        </div>
      </div>

      {/* Layer Stack Interactive Display */}
      <div className="my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl">
        {/* Left Column: Layer Badges List */}
        <div className="lg:col-span-5 flex flex-col gap-4 font-mono">
          {LAYERS.map((layer) => (
            <div
              key={layer.num}
              className="p-4 acetate-panel rounded border border-[#0a0a0a]/15 flex items-center justify-between hover:border-[#0038ff] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#0038ff]">{layer.num}</span>
                <span className="font-display text-lg font-extrabold uppercase tracking-tight group-hover:text-[#0038ff] transition-colors">
                  {layer.title}
                </span>
              </div>
              <span className="text-[0.68rem] text-[#737373] max-w-[180px] text-right">
                {layer.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column: Layer Stacking Preview Panel */}
        <div className="lg:col-span-7">
          <div className="acetate-panel p-8 rounded-lg border border-[#0a0a0a]/20 shadow-2xl relative flex flex-col gap-6">
            <div className="flex justify-between items-center font-mono text-xs text-[#737373] border-b border-[#0a0a0a]/10 pb-3">
              <span>CANVAS_LAYER_STACK.PSD</span>
              <span className="text-[#0038ff] font-bold">SCROLL SEPARATES LAYERS IN Z-DEPTH</span>
            </div>

            <div className="aspect-[16/9] bg-[#f0ebd9] rounded border border-[#0a0a0a]/15 relative overflow-hidden flex items-center justify-center p-8">
              <div className="w-full h-full border border-dashed border-[#0a0a0a]/30 relative flex flex-col justify-between p-6 bg-[#f7f4ee]">
                <div className="flex justify-between items-center font-mono text-xs font-bold text-[#0038ff]">
                  <span>LAYER 01: IMAGE</span>
                  <span>LAYER 02: TYPE</span>
                </div>
                <div className="font-display text-4xl font-extrabold tracking-tighter uppercase text-center text-[#0a0a0a]">
                  VISUAL ARCHITECTURE
                </div>
                <div className="flex justify-between items-center font-mono text-[0.65rem] text-[#737373]">
                  <span>LAYER 03-05: COLOR &amp; TEXTURE</span>
                  <span>LAYER 06: COMPOSITION</span>
                </div>
              </div>

              {/* Crop mark corners */}
              <span className="absolute top-2 left-2 crop-mark text-[#0a0a0a]" />
              <span className="absolute top-2 right-2 crop-mark text-[#0a0a0a]" />
              <span className="absolute bottom-2 left-2 crop-mark text-[#0a0a0a]" />
              <span className="absolute bottom-2 right-2 crop-mark text-[#0a0a0a]" />
            </div>

            <p className="font-mono text-xs text-[#4a4a4a] leading-relaxed">
              Every graphic composition is built from decoupled structural layers. As you scroll, the Three.js camera pulls these 6 planes apart in physical depth, revealing how typography, grid coordinates, and photographic crops align.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Technical Bar */}
      <div className="border-t border-[#0a0a0a]/15 pt-4 font-mono text-xs tracking-widest text-[#737373] flex justify-between">
        <span>03 / 06 — LAYER DECONSTRUCTION</span>
        <span className="text-[#0038ff]">CONTINUOUS MESH CONTINUES ↓</span>
      </div>
    </section>
  )
}
