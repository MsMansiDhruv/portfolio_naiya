export function ContactSection() {
  const currentYear = new Date().getFullYear()

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full py-24 px-6 sm:px-12 lg:px-16 text-[#0a0a0a] flex flex-col justify-between overflow-hidden bg-[#f7f4ee]"
    >
      {/* Top Header */}
      <div className="flex justify-between items-center font-mono text-xs tracking-widest border-b border-[#0a0a0a]/15 pb-6">
        <span className="text-[#0038ff] font-bold">06 / INITIATE COLLABORATION</span>
        <span>LET'S MAKE SOMETHING</span>
      </div>

      {/* Main Large Typography Horizon */}
      <div className="my-auto py-16 flex flex-col gap-12 max-w-7xl">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs tracking-widest text-[#0038ff] uppercase font-bold">
            ✦ COMMISSIONS OPEN FOR Q4 2026
          </span>
          <h2 className="font-display text-6xl sm:text-8xl lg:text-9xl font-extrabold uppercase tracking-tighter leading-[0.88] text-[#0a0a0a]">
            LET'S MAKE <br />
            <span className="text-[#0038ff]">SOMETHING.</span>
          </h2>
        </div>

        {/* Single Thin Horizon Line */}
        <div className="w-full h-px bg-[#0a0a0a] relative my-4">
          <span className="absolute -top-2 left-0 crop-mark text-[#0a0a0a]" />
          <span className="absolute -top-2 right-0 crop-mark text-[#0a0a0a]" />
        </div>

        {/* Contact Meta & Social Channels */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 font-mono text-xs items-baseline">
          <div className="md:col-span-5 flex flex-col gap-2">
            <span className="text-[#737373] uppercase tracking-widest">DIRECT MAIL</span>
            <a
              href="mailto:hello@naiyadhruv.com"
              className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-[#0a0a0a] hover:text-[#0038ff] transition-colors"
            >
              hello@naiyadhruv.com ↗
            </a>
          </div>

          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-[#737373] uppercase tracking-widest">CONNECT</span>
            <div className="flex flex-wrap gap-4 font-bold text-sm">
              <a href="https://www.linkedin.com/in/naiya-dhruv-b040bb210" target="_blank" rel="noreferrer" className="hover:text-[#0038ff] transition-colors">
                LINKEDIN ↗
              </a>
              <a href="#top" className="hover:text-[#0038ff] transition-colors">
                INSTAGRAM ↗
              </a>
              <a href="#top" className="hover:text-[#0038ff] transition-colors">
                BEHANCE ↗
              </a>
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-2 md:text-right">
            <span className="text-[#737373] uppercase tracking-widest">LOCATION</span>
            <span className="font-bold text-sm text-[#0a0a0a]">INDIA · IST (UTC+5:30)</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom Line */}
      <div className="border-t border-[#0a0a0a]/15 pt-6 font-mono text-xs tracking-widest text-[#737373] flex flex-wrap justify-between gap-4">
        <span>© {currentYear} NAIYA DHRUV · GRAPHIC DESIGNER</span>
        <span className="text-[#0038ff] font-bold">THE EDITORIAL MESH SYSTEM ✦ END LOOP</span>
      </div>
    </section>
  )
}
