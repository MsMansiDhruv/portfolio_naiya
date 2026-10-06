import React, { useState } from 'react'
import {
  Layout,
  Image,
  PenTool,
  Film,
  Box,
  Layers,
  Sparkles,
  Cpu,
  Video,
  Wand2,
  Bot,
  Aperture,
  CheckCircle2,
  Zap,
} from 'lucide-react'

export interface ToolItem {
  id: string
  name: string
  category: 'graphic' | 'ai'
  categoryLabel: string
  icon: React.ElementType
  badgeText: string
  description: string
  mastery: string
  accentColor: 'amber' | 'blue' | 'purple' | 'emerald'
  floatDelay: string // CSS animation delay offset for organic floating
}

export const DESIGN_TOOLS: ToolItem[] = [
  // Graphic Design Suite
  {
    id: 'figma',
    name: 'Figma',
    category: 'graphic',
    categoryLabel: 'GRAPHIC ARCHITECTURE',
    icon: Layout,
    badgeText: 'UI/UX & Dielines',
    description: 'Precision vector architecture, component systems, and packaging dieline layouts.',
    mastery: '98%',
    accentColor: 'amber',
    floatDelay: '0s',
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    category: 'graphic',
    categoryLabel: 'GRAPHIC ARCHITECTURE',
    icon: Image,
    badgeText: 'Texture & Finish',
    description: 'High-DPI packaging surface texturing, foil stamp simulation, and color grading.',
    mastery: '96%',
    accentColor: 'blue',
    floatDelay: '0.4s',
  },
  {
    id: 'illustrator',
    name: 'Adobe Illustrator',
    category: 'graphic',
    categoryLabel: 'GRAPHIC ARCHITECTURE',
    icon: PenTool,
    badgeText: 'Vector Master',
    description: 'Custom packaging vector geometry, emblem design, and typographic brandmarks.',
    mastery: '95%',
    accentColor: 'amber',
    floatDelay: '0.8s',
  },
  {
    id: 'after-effects',
    name: 'After Effects',
    category: 'graphic',
    categoryLabel: 'GRAPHIC ARCHITECTURE',
    icon: Film,
    badgeText: 'Motion Graphics',
    description: 'Kinetic typography, frame-by-frame compositing, and spatial teaser trailers.',
    mastery: '92%',
    accentColor: 'purple',
    floatDelay: '0.2s',
  },
  {
    id: 'blender',
    name: 'Blender 3D',
    category: 'graphic',
    categoryLabel: 'GRAPHIC ARCHITECTURE',
    icon: Box,
    badgeText: '3D Spatial CAD',
    description: 'Photorealistic glass refraction, perfume bottle modeling, and studio caustics.',
    mastery: '90%',
    accentColor: 'amber',
    floatDelay: '0.6s',
  },
  {
    id: 'spline',
    name: 'Spline 3D',
    category: 'graphic',
    categoryLabel: 'GRAPHIC ARCHITECTURE',
    icon: Layers,
    badgeText: 'Realtime WebGL',
    description: 'Interactive 3D web experiences, dynamic shaders, and spatial canvas interaction.',
    mastery: '88%',
    accentColor: 'emerald',
    floatDelay: '1.0s',
  },
  // AI Designer Suite
  {
    id: 'midjourney',
    name: 'Midjourney v6',
    category: 'ai',
    categoryLabel: 'AI DESIGN',
    icon: Sparkles,
    badgeText: 'Generative Concept',
    description: 'Photorealistic visual moodboards, camera angle exploration, and prompt synthesis.',
    mastery: '99%',
    accentColor: 'amber',
    floatDelay: '0.3s',
  },
  {
    id: 'comfyui',
    name: 'ComfyUI / SDXL',
    category: 'ai',
    categoryLabel: 'AI DESIGN',
    icon: Cpu,
    badgeText: 'Node Generative',
    description: 'Custom LoRA node architecture, ControlNet depth maps, and style transfer.',
    mastery: '94%',
    accentColor: 'purple',
    floatDelay: '0.7s',
  },
  {
    id: 'runway',
    name: 'Runway Gen-3',
    category: 'ai',
    categoryLabel: 'AI DESIGN',
    icon: Video,
    badgeText: 'AI Video Motion',
    description: 'Cinematic video synthesis, camera movement control, and multi-shot flow.',
    mastery: '91%',
    accentColor: 'blue',
    floatDelay: '0.1s',
  },
  {
    id: 'magnific',
    name: 'Magnific AI',
    category: 'ai',
    categoryLabel: 'AI DESIGN',
    icon: Wand2,
    badgeText: '8K Detail Upscale',
    description: 'AI texture enhancement, micro-detail restoration, and packaging surface polish.',
    mastery: '96%',
    accentColor: 'amber',
    floatDelay: '0.5s',
  },
  {
    id: 'claude-visual',
    name: 'Claude Visual',
    category: 'ai',
    categoryLabel: 'AI DESIGN',
    icon: Bot,
    badgeText: 'AI System Logic',
    description: 'Algorithmic design tokens, generative code integration, and spatial design specs.',
    mastery: '97%',
    accentColor: 'emerald',
    floatDelay: '0.9s',
  },
  {
    id: 'luma',
    name: 'Luma Dream Machine',
    category: 'ai',
    categoryLabel: 'AI DESIGN',
    icon: Aperture,
    badgeText: '3D NeRF / Splatting',
    description: 'NeRF physical capture, 3D scene reconstruction, and spatial camera paths.',
    mastery: '89%',
    accentColor: 'purple',
    floatDelay: '0.35s',
  },
]

interface InteractiveToolMatrixProps {
  opacity?: number
  translateY?: number
  isEmbedded?: boolean
}

export function InteractiveToolMatrix({ opacity = 1, translateY = 0, isEmbedded = false }: InteractiveToolMatrixProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'graphic' | 'ai'>('all')
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null)
  const [hoveredToolId, setHoveredToolId] = useState<string | null>(null)

  const filteredTools = DESIGN_TOOLS.filter((t) => {
    if (activeTab === 'graphic') return t.category === 'graphic'
    if (activeTab === 'ai') return t.category === 'ai'
    return true
  })

  const containerClass = isEmbedded
    ? 'w-full text-right pointer-events-auto pt-4 border-t border-neutral-800/80 mt-4'
    : 'absolute top-1/4 right-6 md:right-16 z-30 w-85 md:w-[520px] pointer-events-auto transition-all duration-300 ease-out drop-shadow-2xl text-right'

  return (
    <div
      className={containerClass}
      style={
        isEmbedded
          ? {}
          : {
              opacity,
              transform: `perspective(1400px) translate3d(0px, ${translateY}px, 90px)`,
            }
      }
    >
      {/* HEADER LABEL */}
      <div className="flex items-center justify-end space-x-2 text-[10px] font-mono tracking-widest text-amber-400 uppercase mb-2 drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]">
        <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>TOOL MATRIX // GRAPHIC & AI DESIGN</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-serif tracking-tight leading-none mb-4 font-light bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
        INTERACTIVE <span className="italic text-amber-400 font-normal">STACK</span>
      </h2>

      <div className="w-36 h-[1px] bg-gradient-to-l from-amber-400 via-amber-300 to-transparent ml-auto mb-4 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />

      {/* FILTER CONTROLLER BADGES */}
      <div className="flex items-center justify-end space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-full text-[9px] font-mono tracking-wider uppercase transition-all border cursor-pointer ${
            activeTab === 'all'
              ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:border-neutral-600'
          }`}
        >
          ALL (12)
        </button>
        <button
          onClick={() => setActiveTab('graphic')}
          className={`px-3 py-1.5 rounded-full text-[9px] font-mono tracking-wider uppercase transition-all border cursor-pointer ${
            activeTab === 'graphic'
              ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:border-neutral-600'
          }`}
        >
          GRAPHIC DESIGN (6)
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3 py-1.5 rounded-full text-[9px] font-mono tracking-wider uppercase transition-all border cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:border-neutral-600'
          }`}
        >
          AI DESIGN (6)
        </button>
      </div>

      {/* INTERACTIVE FLOATING BLOCKS GRID (OPEN-DESIGN.AI STYLE) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredTools.map((tool) => {
          const IconComp = tool.icon
          const isHovered = hoveredToolId === tool.id
          const isSelected = selectedTool?.id === tool.id

          return (
            <div
              key={tool.id}
              onMouseEnter={() => setHoveredToolId(tool.id)}
              onMouseLeave={() => setHoveredToolId(null)}
              onClick={() => setSelectedTool(isSelected ? null : tool)}
              className={`group relative p-3 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.35)] scale-105 z-20'
                  : isHovered
                  ? 'bg-neutral-900/90 border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.25)] scale-[1.04] z-10'
                  : 'bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700'
              }`}
              style={{
                animation: `floatBob 4s ease-in-out infinite`,
                animationDelay: tool.floatDelay,
              }}
            >
              {/* TOP ROW: ICON + MASTERY */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    tool.accentColor === 'amber'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : tool.accentColor === 'blue'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : tool.accentColor === 'purple'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono text-neutral-400 bg-neutral-900/90 px-1.5 py-0.5 rounded border border-neutral-800">
                  {tool.mastery}
                </span>
              </div>

              {/* TOOL NAME & BADGE */}
              <div className="text-left">
                <h3 className="text-sm font-medium text-neutral-100 group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>{tool.name}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </h3>
                <p className="text-[9px] font-mono text-amber-400/90 mt-0.5 truncate">
                  {tool.badgeText}
                </p>
              </div>

              {/* HOVER TOOLTIP / DESCRIPTION OVERLAY */}
              {(isHovered || isSelected) && (
                <div className="mt-2 pt-2 border-t border-neutral-800/80 text-left animate-in fade-in zoom-in-95 duration-150">
                  <p className="text-[10px] text-neutral-300 font-light leading-snug">
                    {tool.description}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* SELECTED TOOL ACTIVE DEEP-DIVE MODAL / BANNER */}
      {selectedTool && (
        <div className="mt-3 p-3 bg-neutral-950/90 border border-amber-400/60 rounded-xl backdrop-blur-lg text-left shadow-[0_10px_30px_rgba(251,191,36,0.2)] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest">
                ACTIVE TOOL DIRECTIVE // {selectedTool.categoryLabel}
              </span>
            </div>
            <button
              onClick={() => setSelectedTool(null)}
              className="text-[9px] font-mono text-neutral-400 hover:text-white px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800"
            >
              CLOSE [X]
            </button>
          </div>
          <p className="text-xs text-neutral-200 font-serif italic mb-1">
            “Integrated into Maya Thorne&apos;s spatial design & packaging pipeline with {selectedTool.mastery} execution accuracy.”
          </p>
          <p className="text-[10px] font-mono text-neutral-400">
            {selectedTool.description}
          </p>
        </div>
      )}

      {/* KEYFRAME ANIMATIONS INLINE STYLES */}
      <style>{`
        @keyframes floatBob {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.3);
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}
