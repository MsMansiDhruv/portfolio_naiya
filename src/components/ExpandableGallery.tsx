import { useState, useRef } from 'react'
import { ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { PORTFOLIO_PROJECTS, type ProjectCaseStudy } from '../data/portfolio'

interface ExpandableGalleryProps {
  onSelectProject?: (project: ProjectCaseStudy) => void
}

export function ExpandableGallery({ onSelectProject }: ExpandableGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeProject = PORTFOLIO_PROJECTS[activeIndex] || PORTFOLIO_PROJECTS[0]
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative w-full max-w-7xl mx-auto px-6 md:px-12 z-10">
      {/* Chapter Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/5">
        <div>
          <div className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>02 - COMMERCIAL SPECIMEN ARCHIVE</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white font-light tracking-tight">
            Selected <span className="italic text-amber-300">Works</span>
          </h2>
        </div>
        <p className="text-xs text-neutral-400 font-light max-w-sm mt-4 md:mt-0 leading-relaxed text-left md:text-right">
          Physical packaging structures, bespoke dieline geometry, brand identities, and high-stakes pitch architectures.
        </p>
      </div>

      {/* Main Interactive Work Stage (GPU-Accelerated, Zero Flex Thrashing) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Stage: Featured Active Case Study Showcase (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
          {/* Visual Showcase Frame */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
            <img 
              src={activeProject.coverImage} 
              alt={activeProject.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
              loading="eager"
            />
            
            {/* Top metadata tags */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-[0.2em] bg-black/70 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                {activeProject.category}
              </span>
              <span className="px-3 py-1 rounded-full text-[9px] font-mono tracking-widest bg-black/70 text-neutral-300 border border-white/10 backdrop-blur-md">
                YEAR: {activeProject.year}
              </span>
            </div>

            {/* Bottom Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90 pointer-events-none" />
          </div>

          {/* Details & Specs Bar */}
          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="font-mono text-[10px] text-amber-400 font-semibold tracking-widest block mb-1">
                  PROJECT SPECIMEN #{activeProject.number}
                </span>
                <h3 className="text-3xl md:text-4xl font-serif text-white font-normal leading-tight">
                  {activeProject.title}
                </h3>
              </div>

              {onSelectProject && (
                <button
                  onClick={() => onSelectProject(activeProject)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 transition-all text-xs font-mono tracking-wider cursor-pointer shrink-0"
                >
                  <span>INSPECT SPEC</span>
                  <ArrowUpRight className="w-4 h-4 text-amber-400" />
                </button>
              )}
            </div>

            <p className="text-sm text-neutral-300 font-light leading-relaxed mb-6">
              {activeProject.description}
            </p>

            {/* Deliverables & Deliverable Badges */}
            <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
              {activeProject.deliverables.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-mono text-neutral-400">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Stage: Interactive Project Switcher Rails (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-400 mb-2 px-1">
            ARCHIVE DIRECTORY - SELECT SPECIMEN
          </div>

          {PORTFOLIO_PROJECTS.map((project, idx) => {
            const isActive = activeIndex === idx
            return (
              <div
                key={project.id}
                onClick={() => setActiveIndex(idx)}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-neutral-900 border-amber-400/60 shadow-[0_8px_25px_rgba(212,175,55,0.12)] -translate-y-0.5'
                    : 'bg-[#080808] border-white/5 hover:border-white/20 hover:bg-neutral-900/40'
                }`}
              >
                <div className="flex items-center space-x-4 min-w-0">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black">
                    <img 
                      src={project.coverImage} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Title and category */}
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[9px] font-bold text-amber-400">
                        0{idx + 1}
                      </span>
                      <h4 className="text-base font-serif text-white font-normal truncate">
                        {project.title}
                      </h4>
                    </div>
                    <p className="text-[11px] font-mono text-neutral-400 truncate mt-0.5">
                      {project.category}
                    </p>
                  </div>
                </div>

                {/* Right indicator */}
                <div className="shrink-0 flex items-center space-x-2">
                  {isActive ? (
                    <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 text-[9px] font-mono border border-amber-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>ACTIVE</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-600 group-hover:text-neutral-400">
                      VIEW
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
