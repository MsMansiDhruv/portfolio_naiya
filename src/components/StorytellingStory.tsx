import { useEffect, useRef, useState } from 'react'

/**
 * Sleep Well Creatives Inspired Storytelling Section
 *
 * Design patterns from reference:
 * - Numbered chapters (01-07) with long-form text
 * - Scroll-driven narrative progression
 * - Dark atmospheric textures
 * - Direct-address copy ("Sleep isn't rest. It's maintenance.")
 * - Modular media sections with progress indicators
 * - Modal overlay interactions
 * - Minimal typography hierarchy
 */

const CHAPTERS = [
  {
    id: '01',
    title: "The Problem",
    subtitle: "Brand systems that don't scale",
    body: `Most portfolios show work. Few show thinking.
The gap between "what looks good" and "what works at scale" is where most brand systems break.`,
    insight: `Sleep isn't rest. It's maintenance.`,
    mediaType: 'audio' as const,
  },
  {
    id: '02',
    title: "The Research",
    subtitle: "Understanding the story before telling it",
    body: `Every case study is really three stories: the client's need, the process of discovery, and the result that holds up over time.`,
    insight: `Good design is invisible. Bad design is everywhere.`,
    mediaType: 'video' as const,
  },
  {
    id: '03',
    title: "The System",
    subtitle: "Building a language that scales",
    body: `Brand systems aren't just logos. They're rules, rhythms, and relationships between elements that must work across every surface.`,
    insight: `Consistency isn't repetition. It's coherence.`,
    mediaType: 'image' as const,
  },
  {
    id: '04',
    title: "The Craft",
    subtitle: "Making the invisible visible",
    body: `The best editorial layouts don't show off type. They let the story breathe. White space is a design element, not an absence.`,
    insight: `Every detail is a decision.`,
    mediaType: 'audio' as const,
  },
  {
    id: '05',
    title: "The Scale",
    subtitle: "From print to pixel",
    body: `What works at poster size must work at thumbnail size. What holds a shelf must hold a screen. Scale is the real test.`,
    insight: `Design is not just how it looks. It's how it works.`,
    mediaType: 'video' as const,
  },
  {
    id: '06',
    title: "The Voice",
    subtitle: "Direct address, not monologue",
    body: `The reference site speaks to the reader directly — "Sleep isn't rest." Not "Sleep is defined as..." Voice builds trust.`,
    insight: `Speak to people, not audiences.`,
    mediaType: 'text' as const,
  },
  {
    id: '07',
    title: "The Redesign",
    subtitle: "Sleep hygiene for brand systems",
    body: `A final checklist of six principles: start with story, build for scale, design for coherence, craft with intention, speak directly, test at every size.`,
    insight: `Redesign starts with maintenance.`,
    mediaType: 'list' as const,
  },
]

export function StorytellingStory() {
  const [progress, setProgress] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const h = document.body.scrollHeight - window.innerHeight
      setProgress(h > 0 ? y / h : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={scrollRef}
      className="relative bg-[#0a0a0a] text-[#eaeaea] min-h-[100vh] overflow-hidden"
      aria-label="Storytelling Narrative — Sleep-Well Inspired"
    >
      {/* Progress bar at top */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-[#1a1a1a]">
        <div
          className="h-full bg-[#c9a961] transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Dark atmospheric texture overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] bg-[radial-gradient(circle_at_50%_30%,rgba(201,169,97,0.3),transparent_70%)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-8 py-32">
        {/* Header */}
        <header className="mb-32 border-b border-white/10 pb-8">
          <p className="mono text-[var(--gold-deep)] mb-4">Chapter 01 / 07</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.92] mb-6">
            Storytelling<br />
            <span className="italic font-normal text-[#c9a961]">as</span> Design
          </h1>
          <p className="text-xl text-white/60 max-w-lg leading-relaxed">
            A research narrative on how brand systems work — inspired by immersive, scroll-driven storytelling.
          </p>
        </header>

        {/* Chapter cards */}
        <div className="space-y-48">
          {CHAPTERS.map((ch) => (
            <article key={ch.id} className="group">
              {/* Chapter number */}
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-8xl md:text-9xl font-black text-white/5 group-hover:text-[var(--gold-deep)]/20 transition-colors duration-500 leading-none select-none">
                  {ch.id}
                </span>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">
                    {ch.title}
                  </h2>
                  <p className="text-lg text-white/40 font-light">
                    {ch.subtitle}
                  </p>
                </div>
              </div>

              {/* Body text */}
              <div className="pl-0 md:pl-[5rem]">
                <p className="text-lg md:text-xl text-white/80 leading-[1.75] mb-8 whitespace-pre-line">
                  {ch.body}
                </p>

                {/* Insight quote — direct address style */}
                <blockquote className="relative my-12 pl-6 border-l-2 border-[var(--gold)]">
                  <p className="text-2xl md:text-3xl font-medium text-white/90 italic leading-snug">
                    “{ch.insight}”
                  </p>
                </blockquote>

                {/* Media section */}
                <div className="my-8">
                  <MediaBlock type={ch.mediaType} id={ch.id} />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Final checklist — Sleep hygiene for brand systems */}
        <section className="mt-32 pt-16 border-t border-white/10">
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8">
            Sleep Hygiene<br />
            <span className="italic font-normal text-[var(--gold-deep)]">for Brand Systems</span>
          </h3>
          <ol className="space-y-4">
            {[
              'Start with story, not style.',
              'Build for scale, not just size.',
              'Design for coherence, not just consistency.',
              'Craft with intention — every detail is a decision.',
              'Speak directly — address the reader as a person.',
              'Test at every size — from poster to thumbnail.',
            ].map((tip, i) => (
              <li key={i} className="flex gap-4 items-start text-lg text-white/70 hover:text-white/90 transition-colors cursor-default group">
                <span className="mono text-[var(--gold)] flex-shrink-0 mt-1">0{i + 1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Footer */}
        <footer className="mt-32 pt-8 border-t border-white/10 text-white/30 text-sm">
          <p>A storytelling approach to portfolio design — inspired by Sleep Well Creatives.</p>
        </footer>
      </div>
    </section>
  )
}

function MediaBlock({ type, id }: { type: string; id: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  if (type === 'text') {
    return (
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 md:p-8">
        <p className="text-lg text-white/70 leading-relaxed">
          The reference site uses direct address rather than third-person description.
          Instead of "This portfolio shows design work," it says:
          <strong className="text-white"> "This portfolio shows how design works."</strong>
        </p>
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="bg-gradient-to-r from-[var(--gold-deep)]/10 to-transparent border border-[var(--gold-deep)]/20 rounded-xl p-6 md:p-8">
        <h4 className="text-white font-bold mb-4">Six Principles</h4>
        <ul className="space-y-2 text-white/70">
          <li>1. Story before style</li>
          <li>2. Scale over size</li>
          <li>3. Coherence over repetition</li>
          <li>4. Intentionality in every detail</li>
          <li>5. Direct address voice</li>
          <li>6. Test at all scales</li>
        </ul>
      </div>
    )
  }

  // Video / Audio with progress bar
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#111] border border-white/10 rounded-xl overflow-hidden text-left hover:border-white/20 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="mono text-xs text-[var(--gold-deep)] uppercase tracking-wider">
              {type === 'video' ? 'Video Chapter' : 'Audio Chapter'} {id}
            </span>
            <span className="text-xs text-white/30">Click to {isOpen ? 'close' : 'open'}</span>
          </div>

          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--gold-deep)] rounded-full w-[60%]" />
          </div>

          <p className="text-sm text-white/50 mt-3">
            {isPlaying ? 'Playing...' : 'Ready to play — continuous background sound available'}
          </p>
        </div>
      </button>

      {/* Modal overlay when open */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsOpen(false)}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-xl w-full shadow-2xl shadow-black/50 p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-[var(--gold-deep)] animate-pulse" />
              <span className="mono text-xs text-white/50">Chapter {id}</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">
              Media Content
            </h3>
            <p className="text-white/60 mb-6 leading-relaxed">
              The Sleep Well Creatives site embeds video and audio with progress bars
              and close controls. This chapter includes a {type} module that demonstrates
              how media integrates within the scroll-driven narrative flow.
            </p>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => { setIsPlaying(!isPlaying) }}
                className="px-4 py-2 bg-[var(--gold-deep)] text-black rounded-full font-medium text-sm hover:bg-[var(--gold)] transition-colors"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-white/20 text-white rounded-full font-medium text-sm hover:border-white/40 transition-colors"
              >
                Close
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--gold-deep)] rounded-full transition-[width] duration-300 ease-out"
                style={{ width: isPlaying ? '70%' : '30%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
