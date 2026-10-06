import { TESTIMONIALS } from '../data/portfolio'

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative min-h-screen w-full py-24 px-6 sm:px-12 lg:px-16 text-[#0a0a0a] flex flex-col justify-between"
    >
      {/* Top Header */}
      <div className="flex flex-col gap-4 border-b border-[#0a0a0a]/15 pb-8 max-w-7xl">
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#0038ff] uppercase font-bold">
          <span className="w-2 h-2 bg-[#0038ff]" />
          05 / TESTIMONIALS — TRANSLUCENT ACETATE
        </div>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tighter">
          COLLABORATOR VERDICTS
        </h2>
      </div>

      {/* Main Acetate Sheets Stack */}
      <div className="my-auto py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl">
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={t.id}
            className="acetate-panel p-8 rounded-lg border border-[#0a0a0a]/20 shadow-2xl flex flex-col justify-between relative group hover:-translate-y-2 transition-transform duration-500"
          >
            {/* Top Sheet Header */}
            <div className="flex items-center justify-between font-mono text-xs border-b border-[#0a0a0a]/10 pb-3 mb-6">
              <span className="text-[#0038ff] font-bold">ACETATE SHEET_{String(idx + 1).padStart(2, '0')}</span>
              <span className="text-[#737373]">VERIFIED</span>
            </div>

            {/* Quote Body */}
            <blockquote className="font-display text-xl sm:text-2xl font-extrabold uppercase leading-snug tracking-tight text-[#0a0a0a] mb-8">
              “{t.quote}”
            </blockquote>

            {/* Author Meta */}
            <div className="border-t border-[#0a0a0a]/10 pt-4 font-mono text-xs">
              <p className="font-bold text-[#0a0a0a] uppercase">{t.author}</p>
              <p className="text-[#0038ff]">{t.role}</p>
              <p className="text-[#737373] text-[0.65rem] uppercase">{t.company}</p>
            </div>

            {/* Crop mark corners */}
            <span className="absolute top-2 left-2 crop-mark text-[#0a0a0a]/40" />
            <span className="absolute top-2 right-2 crop-mark text-[#0a0a0a]/40" />
            <span className="absolute bottom-2 left-2 crop-mark text-[#0a0a0a]/40" />
            <span className="absolute bottom-2 right-2 crop-mark text-[#0a0a0a]/40" />
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#0a0a0a]/15 pt-4 font-mono text-xs tracking-widest text-[#737373] flex justify-between">
        <span>05 / 06 — COLLABORATIONS</span>
        <span className="text-[#0038ff]">CONTINUOUS MESH CONTINUES ↓</span>
      </div>
    </section>
  )
}
