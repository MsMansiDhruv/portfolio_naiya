import { CAPABILITIES_LIST } from '../data/portfolio'

export function CapabilitiesSection() {
  return (
    <section className="relative w-full py-24 px-6 sm:px-12 lg:px-16 text-[#0a0a0a] bg-[#f0ebd9] border-y border-[#0a0a0a]/15">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-widest border-b border-[#0a0a0a]/15 pb-6">
          <span className="text-[#0038ff] font-bold">CAPABILITIES &amp; CORE SERVICES</span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tighter text-[#0a0a0a]">
            STUDIO DISCIPLINE
          </h2>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAPABILITIES_LIST.map((cap, idx) => (
            <div
              key={cap.label}
              className="p-6 bg-[#f7f4ee] border border-[#0a0a0a]/15 rounded flex flex-col justify-between gap-4 hover:border-[#0038ff] transition-colors group"
            >
              <div className="flex justify-between items-center font-mono text-xs text-[#0038ff] font-bold">
                <span>0{idx + 1}</span>
                <span>✦ CAPABILITY</span>
              </div>
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight group-hover:text-[#0038ff] transition-colors">
                {cap.label}
              </h3>
              <p className="font-mono text-xs text-[#4a4a4a] border-t border-[#0a0a0a]/10 pt-3">
                {cap.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
