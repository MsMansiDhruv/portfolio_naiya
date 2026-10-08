interface ToolItem {
  id: string
  name: string
  role: string
  color: string
  iconSrc: string
}

const TOOLS: ToolItem[] = [
  { id: 'illustrator', name: 'Illustrator', role: 'Vector Marks & Packaging Art', color: '#FF9A00', iconSrc: '/icons/illustrator.png' },
  { id: 'photoshop', name: 'Photoshop', role: 'Press Retouch & Mockups', color: '#31A8FF', iconSrc: '/icons/photoshop.png' },
  { id: 'figma', name: 'Figma', role: 'UI, Layout & Design Systems', color: '#F24E1E', iconSrc: '/icons/figma.png' },
  { id: 'premiere', name: 'Premiere Pro', role: 'Video Editing & Motion', color: '#9999FF', iconSrc: '/icons/premiere.png' },
  { id: 'canva', name: 'Canva', role: 'Social Collateral & Systems', color: '#00C4CC', iconSrc: '/icons/canva.png' },
  { id: 'claude', name: 'Claude AI', role: 'Creative Ideation & Prompts', color: '#D97757', iconSrc: '/icons/claude.png' },
  { id: 'chatgpt', name: 'ChatGPT', role: 'Content & Strategy Workflows', color: '#10A37F', iconSrc: '/icons/chatgpt.png' },
]

export function InteractiveSkillIcons() {
  return (
    <div className="w-full max-w-lg pointer-events-auto text-left">
      <h3 className="text-sm sm:text-xl md:text-3xl font-serif text-white font-light mb-1.5 sm:mb-4">
        <span className="italic text-amber-300">Toolkit</span>
      </h3>

      {/* Grid of 7 Tool Icons with Consistent Sizing & Zero Background */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 md:gap-3 mb-1 sm:mb-2 max-w-sm sm:max-w-md md:max-w-lg">
        {TOOLS.map((tool) => (
          <div
            key={tool.id}
            className="group relative aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center p-1.5 sm:p-2 cursor-pointer transition-all duration-300 border border-white/10 bg-black/60 hover:bg-neutral-900/90 hover:border-amber-400/80 hover:shadow-[0_0_22px_rgba(212,175,55,0.3)] hover:-translate-y-1 backdrop-blur-xl shrink-0"
          >
            <img 
              src={tool.iconSrc} 
              alt={tool.name} 
              className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 pointer-events-none" 
            />

            {/* Hover Tooltip Box Showing Software Name */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/95 border border-amber-400/50 rounded-md text-amber-300 text-[10px] font-mono tracking-wider whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.8)] pointer-events-none opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-30 flex flex-col items-center">
              <span>{tool.name}</span>
              <div className="w-1.5 h-1.5 bg-black/95 border-r border-b border-amber-400/50 rotate-45 -mb-1 mt-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
