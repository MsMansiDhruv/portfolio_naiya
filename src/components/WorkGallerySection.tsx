import { useState } from 'react'
import { PORTFOLIO_PROJECTS, type ProjectCaseStudy } from '../data/portfolio'
import { CaseStudyModal } from './CaseStudyModal'

export function WorkGallerySection() {
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null)

  return (
    <>
      <section
        id="work"
        className="relative min-h-screen w-full py-24 px-6 sm:px-12 lg:px-16 text-[#0a0a0a]"
      >
        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-[#0a0a0a]/15 pb-8 mb-16 max-w-7xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#0038ff] uppercase font-bold">
            <span className="w-2 h-2 bg-[#0038ff]" />
            01 / SELECTED WORK — 3D GALLERY
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tighter">
              GRAPHIC ARTIFACTS
            </h2>
            <span className="font-mono text-xs tracking-widest text-[#737373]">
              CLICK TO ENTER CASE STUDY
            </span>
          </div>
        </div>

        {/* 3D Physical Cards Gallery Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 max-w-7xl">
          {PORTFOLIO_PROJECTS.map((piece) => (
            <article
              key={piece.id}
              data-cursor="VIEW PROJECT"
              onClick={() => setSelectedProject(piece)}
              className="acetate-panel p-6 rounded-lg relative flex flex-col justify-between cursor-pointer group hover:-translate-y-2 transition-all duration-500 border border-[#0a0a0a]/15 hover:border-[#0038ff]"
            >
              {/* Card Top Technical Bar */}
              <div className="flex items-center justify-between font-mono text-xs border-b border-[#0a0a0a]/10 pb-3 mb-4">
                <span className="font-bold text-[#0038ff]">{piece.number}</span>
                <span className="text-[#737373] uppercase tracking-wider">{piece.year}</span>
              </div>

              {/* Artwork Media Wrapper */}
              <div className="aspect-[4/3] w-full bg-[#f0ebd9] overflow-hidden rounded relative mb-6 border border-[#0a0a0a]/10">
                <img
                  src={piece.coverImage}
                  alt={piece.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Crop marks overlay */}
                <span className="absolute top-2 left-2 crop-mark text-[#0a0a0a]" />
                <span className="absolute top-2 right-2 crop-mark text-[#0a0a0a]" />
                <span className="absolute bottom-2 left-2 crop-mark text-[#0a0a0a]" />
                <span className="absolute bottom-2 right-2 crop-mark text-[#0a0a0a]" />

                {/* Hover Reveal Action Pill */}
                <div className="absolute inset-0 bg-[#0038ff]/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center font-mono text-xs font-bold tracking-widest uppercase">
                  <span>ENTER CASE STUDY ↗</span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[0.68rem] tracking-widest text-[#737373] uppercase">
                  {piece.category}
                </span>
                <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight group-hover:text-[#0038ff] transition-colors">
                  {piece.title}
                </h3>
                <p className="font-mono text-xs text-[#4a4a4a] line-clamp-2 leading-relaxed">
                  {piece.tagline}
                </p>
              </div>

              {/* Bottom Technical Stamp */}
              <div className="flex items-center justify-between pt-4 border-t border-[#0a0a0a]/10 mt-6 font-mono text-[0.65rem] text-[#737373]">
                <span>SPEC: PRINT &amp; DIGITAL</span>
                <span className="text-[#0038ff] font-bold">VIEW ↗</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Case Study Modal Overlay */}
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  )
}
