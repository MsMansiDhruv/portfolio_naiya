export interface NaiyaDhruvLogoProps {
  /** Height in pixels of the logo mark. Default: 36 */
  size?: number
  /** Optional custom CSS classes for the container or image */
  className?: string
  /** Whether to apply soft amber/gold ambient glow filter */
  glow?: boolean
  /** Optional interactive hover zoom and brightness micro-motion */
  interactive?: boolean
  /** Render mode:
   * 'icon': 3D sculpted gold infinity mark
   * 'badge': circular glowing pill container with mark
   * 'full': complete mark paired with brand typography
   */
  variant?: 'icon' | 'badge' | 'full'
  /** Theme styling: 'transparent' (default), 'black', or 'white' */
  theme?: 'transparent' | 'black' | 'white'
  /** Subtitle for 'full' variant (default: 'GRAPHIC DESIGNER') */
  subtitle?: string
}

/**
 * NaiyaDhruvLogo - Official 3D Sculpted Golden Infinity Monogram for Naiya Dhruv.
 *
 * Design Architecture:
 * - Hand-sculpted 3D dual-ring golden infinity geometry.
 * - Precision metallic reflections with luminous amber ambient occlusion.
 * - High-resolution alpha-channel transparency for seamless dark mode luxury integration.
 */
export function NaiyaDhruvLogo({
  size = 36,
  className = '',
  glow = true,
  interactive = true,
  variant = 'icon',
  theme = 'transparent',
  subtitle = 'GRAPHIC DESIGNER',
}: NaiyaDhruvLogoProps) {
  // Determine asset source based on variant and theme
  let imageSrc = '/logo_mark_transparent.png'
  if (variant === 'full') {
    if (theme === 'black') {
      imageSrc = '/logo_black.png'
    } else if (theme === 'white') {
      imageSrc = '/logo.png'
    } else {
      imageSrc = '/logo_full_transparent.png'
    }
  } else {
    if (theme === 'black') {
      imageSrc = '/logo_mark_black.png'
    } else if (theme === 'white') {
      imageSrc = '/logo_mark_white.png'
    } else {
      imageSrc = '/logo_mark_transparent.png'
    }
  }

  // Calculate proportional width (aspect ratio is approx 1.93:1)
  const calcWidth = variant === 'full' ? Math.round(size * 1.3) : Math.round(size * 1.93)

  const imageElement = (
    <img
      src={imageSrc}
      alt="Naiya Dhruv Brand Mark"
      width={calcWidth}
      height={size}
      loading="eager"
      decoding="async"
      style={{
        height: `${size}px`,
        width: 'auto',
        maxWidth: 'none',
      }}
      className={`select-none shrink-0 object-contain transition-all duration-300 ${
        glow ? 'drop-shadow-[0_0_14px_rgba(212,175,55,0.45)]' : ''
      } ${
        interactive ? 'group-hover:scale-105 group-hover:brightness-110' : ''
      }`}
    />
  )

  if (variant === 'badge') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full bg-neutral-950/90 border border-amber-500/30 p-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] transition-all group ${className}`}
        style={{ minWidth: size + 16, minHeight: size + 16 }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600/15 via-transparent to-amber-400/20 pointer-events-none" />
        {imageElement}
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className={`flex items-center space-x-3.5 group cursor-pointer ${className}`}>
        <div className="relative inline-flex items-center justify-center rounded-full bg-neutral-950/90 border border-amber-500/30 p-1.5 shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:border-amber-400 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] transition-all">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600/15 via-transparent to-amber-400/20 pointer-events-none" />
          {imageElement}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-serif font-light text-white block leading-none tracking-wide group-hover:text-amber-200 transition-colors">
            NAIYA <span className="italic text-amber-300 font-normal">DHRUV</span>
          </span>
          <span className="text-[7.5px] font-mono tracking-widest text-neutral-400 uppercase block mt-1 group-hover:text-amber-400/80 transition-colors">
            {subtitle}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center justify-center group ${className}`}>
      {imageElement}
    </div>
  )
}

export default NaiyaDhruvLogo
