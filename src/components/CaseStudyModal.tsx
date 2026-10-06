import { useEffect, useState, useMemo, useRef } from 'react'
import type { ProjectCaseStudy } from '../data/portfolio'
import { DynamicGridGallery, type GalleryItem } from './ui/dynamic-grid-gallery'
import { ReelGallery, type ReelItem } from './ui/reel-gallery'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink, Heart, MessageCircle, Send, Bookmark, RotateCw } from 'lucide-react'

interface CaseStudyModalProps {
  project: ProjectCaseStudy | null
  onClose: () => void
}

interface ActiveLightboxImage {
  src: string
  backSrc?: string
  title: string
  tag?: string
  index: number
  total: number
}

// Curated Master Single-Rail Collection for Social Media Ads & Festive Posts (18 Unique Creatives)
const SOCIAL_MEDIA_ADS_REEL_ITEMS: ReelItem[] = [
  { id: 'sma-1', src: '/work/vi/vi-social-jalebi-fafda.jpg', title: 'Sunday Jalebi Fafda Tradition', subtitle: 'VI Groundnut Oil · Sunday Tradition Creative', category: 'Social Campaign' },
  { id: 'sma-oil-benefits', src: '/work/vi/vi-social-oil-benefits-splash.jpg', title: 'Groundnut Oil Benefits Splash', subtitle: 'VI Groundnut Oil · Dynamic Benefits Creative', category: 'Social Campaign' },
  { id: 'sma-2', src: '/work/vi/vi-social-mirror-peanuts.jpg', title: 'Purity & Transparency Reflection', subtitle: 'VI Groundnut Oil · Conceptual Mirror Creative', category: 'Social Creative' },
  { id: 'sma-3', src: '/work/social/light-lounge-living-room.jpg', title: "It's the Lighting", subtitle: 'Light Lounge · Luxury Interior & Chandelier Showcase', category: 'Social Ad' },
  { id: 'sma-4', src: '/work/social/brown-mule-coffee-grit.jpg', title: 'Good Coffee Takes Grit', subtitle: 'Brown Mule · Arabica Ground Coffee Ad', category: 'Social Creative' },
  { id: 'sma-5', src: '/work/social/light-lounge-door-patel.jpg', title: 'First Impression Shine', subtitle: "Light Lounge · Patel's Entrance Illumination", category: 'Social Ad' },
  { id: 'sma-6', src: '/work/social/light-lounge-ceiling-fan.jpg', title: 'Ceilings Coolest Upgrade', subtitle: 'Light Lounge · Modern Designer Fan Light', category: 'Social Ad' },
  { id: 'sma-7', src: '/work/social/brown-mule-coffee.jpg', title: 'Brown Mule Specialty Coffee', subtitle: 'Balanced Roasts · Bold Character', category: 'Social Creative' },
  { id: 'sma-8', src: '/work/vi/vi-social-pan-vortex.jpg', title: 'Culinary Delicacy Vortex', subtitle: 'VI Oil · Premium Food Story', category: 'Social Ad' },
  { id: 'sma-9', src: '/work/vi/vi-social-peanuts.jpg', title: 'Golden Groundnut Essence', subtitle: 'VI Oil · Purity & Heritage', category: 'Social Creative' },
  { id: 'sma-10', src: '/work/vi/vi-social-cabinet.jpg', title: 'Kitchen Cabinet Secret', subtitle: 'VI Oil · Modern Homemaker', category: 'Social Post' },
  { id: 'sma-11', src: '/work/vi/vi-social-couple.jpg', title: 'Authentic Flavor Choice', subtitle: 'VI Oil · Lifestyle & Trust', category: 'Brand Story' },
  { id: 'sma-12', src: '/work/vi/vi-social-spices-kitchen.jpg', title: 'Rustic Kitchen Heritage', subtitle: 'VI Oil · Cold-Pressed Oil', category: 'Social Creative' },
  { id: 'sma-13', src: '/work/ankpal/meta ads/social-visibility.jpg', title: 'High-Converting Meta Ad', subtitle: 'Performance Marketing', category: 'Meta Ad' },
  { id: 'sma-14', src: '/work/explorations/kavach-rakhi.jpg', title: 'Kavach · Sacred Thread', subtitle: 'Raksha Bandhan Campaign', category: 'Raksha Bandhan' },
  { id: 'sma-15', src: '/work/ankpal/meta ads/social-waiting.jpg', title: 'Direct-Response Ad Creative', subtitle: 'Customer Acquisition Hook', category: 'Paid Social' },
  { id: 'sma-16', src: '/work/explorations/festive-eid.jpg', title: 'Crescent Blessings', subtitle: 'Eid Mubarak Festive Post', category: 'Eid Mubarak' },
  { id: 'sma-17', src: '/work/ankpal/meta ads/meta-ad-systems.jpg', title: 'Ad Performance Engine', subtitle: 'Multi-Variant Ad Layout', category: 'Meta Ad' },
  { id: 'sma-18', src: '/work/ankpal/social media/festive-15aug.jpg', title: 'Tricolor Freedom & Pride', subtitle: 'Independence Day Story', category: 'Independence Day' },
  { id: 'sma-19', src: '/work/ankpal/meta ads/social-number.jpg', title: 'Metric-Driven Infographic', subtitle: 'High-Trust Social Asset', category: 'Social Feed' },
  { id: 'sma-20', src: '/work/explorations/festive-campaigns.jpg', title: 'Diwali Lights & Wonder', subtitle: 'Grand Festive Creative', category: 'Diwali' },
  { id: 'sma-21', src: '/work/ankpal/meta ads/social-demo.jpg', title: 'Interactive App Showcase', subtitle: 'Feature Launch Reel', category: 'Reels' },
  { id: 'sma-22', src: '/work/explorations/kavach-01.jpg', title: 'Heritage Folk Motifs', subtitle: 'Handcrafted Festive Identity', category: 'Festive Art' },
  { id: 'sma-23', src: '/work/ankpal/meta ads/social-hinglish.jpg', title: 'Localized Outreach Campaign', subtitle: 'Regional Paid Social', category: 'Paid Social' },
  { id: 'sma-24', src: '/work/ankpal/meta ads/social-month.jpg', title: 'Effortless Month-End Close', subtitle: 'B2B Lead Generation Ad', category: 'Meta Ad' },
]

export function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  const [activeLightbox, setActiveLightbox] = useState<ActiveLightboxImage | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isLightboxFlipped, setIsLightboxFlipped] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Determine if this project is specifically Social Media Ads
  const isSocialMedia = useMemo(() => {
    if (!project) return false
    const cat = project.category.toLowerCase()
    const title = project.title.toLowerCase()
    return (
      cat.includes('social') ||
      title.includes('social') ||
      project.id === 'social-media-ads' ||
      project.id === 'ankpal-meta-ads'
    )
  }, [project])

  // Master Single-Rail items for ReelGallery
  const reelItems = useMemo<ReelItem[]>(() => {
    if (!project) return []
    if (isSocialMedia) return SOCIAL_MEDIA_ADS_REEL_ITEMS

    // Generic fallback for any other projects
    const sources = [
      ...(project.gallery || []),
      project.coverImage,
      ...(project.detailCrops || []),
    ].filter((val, idx, self) => val && self.indexOf(val) === idx)

    return sources.map((src, idx) => {
      const filename = src
        .split('/')
        .pop()
        ?.replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ') || `Reel ${idx + 1}`
      const formattedTitle = filename.charAt(0).toUpperCase() + filename.slice(1)
      return {
        id: `${project.id}-reel-${idx}`,
        src,
        title: formattedTitle,
        subtitle: `${project.title} · Social Creative`,
        category: 'Social Reel',
        views: `${(15 + idx * 4.3).toFixed(1)}K`,
      }
    })
  }, [project])

  // Format 6 gallery items for the Dynamic Grid Gallery (for non-social projects)
  const galleryItems = useMemo<GalleryItem[]>(() => {
    if (!project) return []

    let sources = (
      project.id === 'logo-branding'
        ? [...(project.gallery || [])]
        : [
            ...(project.gallery || []),
            project.coverImage,
            ...(project.detailCrops || []),
          ]
    ).filter((val, idx, self) => val && self.indexOf(val) === idx)

    if (project.id === 'logo-branding') {
      sources = sources.filter(
        (s) => !s.includes('stationery') && !s.includes('card')
      )
    }

    return sources.slice(0, 6).map((src, idx) => {
      const filename = src
        .split('/')
        .pop()
        ?.replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ') || `Creative ${idx + 1}`
      const formattedTitle = filename.charAt(0).toUpperCase() + filename.slice(1)

      // Pair Front & Back for Flyer items in Print Media, and format Stall Backdrop
      let backSrc: string | undefined = undefined
      let itemTitle = formattedTitle
      let itemCategory = project.category
      let itemSubtitle = `${project.title} · ${project.category}`

      if (src.includes('ankpal-fmcg-flyer') || (project.id === 'print-media' && idx === 0)) {
        backSrc = '/work/flyers/ankpal-fmcg-flyer-02.jpg'
        itemTitle = 'FMCG Distribution Flyer'
        itemCategory = 'Dual-Sided Flyer'
        itemSubtitle = 'Hover or Click to Flip (Front / Back)'
      } else if (src.includes('ankpal-genie-flyer') || (project.id === 'print-media' && idx === 1)) {
        backSrc = '/work/flyers/ankpal-genie-flyer-02.jpg'
        itemTitle = 'Smart ERP Genie Flyer'
        itemCategory = 'Dual-Sided Flyer'
        itemSubtitle = 'Hover or Click to Flip (Front / Back)'
      } else if (src.includes('stall-backdrop') || src.includes('parmanand')) {
        itemTitle = 'Stall Backdrop'
        itemCategory = 'Banner'
        itemSubtitle = 'Parmanand Group · Large-Format Exhibition Backdrop'
      } else if (src.includes('ankpal-banner-standee') || src.includes('standee')) {
        itemTitle = 'Smart ERP Standee'
        itemCategory = 'Banner'
        itemSubtitle = 'ANKPAL · Authorized Partner Roll-Up Standee'
      } else if (src.includes('ankpal-banner-horizontal') || src.includes('horizontal')) {
        itemTitle = 'Complete ERP Solution Banner'
        itemCategory = 'Banner'
        itemSubtitle = 'ANKPAL · Wide Marketing & Partner Banner'
      } else if (src.includes('vi-banner-ambassador')) {
        itemTitle = 'Brand Ambassador Outdoor Banner'
        itemCategory = 'Banner'
        itemSubtitle = 'VI Oil · Wide Format Marketing Banner'
      } else if (src.includes('vi-banner-landscape')) {
        itemTitle = 'Heritage Farm Landscape Banner'
        itemCategory = 'Banner'
        itemSubtitle = 'VI Oil · Retail POS & Standee Banner'
      } else if (project.id === 'logo-branding') {
        if (src.includes('kyron')) {
          itemTitle = 'Kyron'
          itemCategory = 'Logo Design'
          itemSubtitle = 'Concept 01 - The Join · Negative Space "K" & Panel Joinery System'
        } else if (src.includes('kavach')) {
          itemTitle = 'Kavach'
          itemCategory = 'Logo Design'
          itemSubtitle = 'Logo Inspiration & Meaning · Shield, Hindi "क" & Invisible Grille'
        }
      } else if (project.id === 'packaging-architecture') {
        if (src.includes('macrofuel-creatine-single-jar')) {
          itemTitle = 'Macro Fuel Creatine 3G Jar'
          itemCategory = 'Supplement Packaging'
          itemSubtitle = 'Strawberry Flavor · 3D Product Mockup & Label Architecture'
        } else if (src.includes('macrofuel-creatine-jars')) {
          itemTitle = 'Macro Fuel Creatine Jars'
          itemCategory = 'Supplement Packaging'
          itemSubtitle = '3D Nutrition Jar Mockup · Front & Back Label Architecture'
        } else if (src.includes('macrofuel-whey-jars')) {
          itemTitle = 'Macro Fuel Whey Protein 12G Jars'
          itemCategory = 'Supplement Packaging'
          itemSubtitle = 'Chocolate Whey Protein · 3D Product Jars Mockup'
        } else if (src.includes('vadhiyar-mustard-pouch') || src.includes('mustard')) {
          itemTitle = 'Vadhiyar-14 Mustard Seeds'
          itemCategory = 'Seed Pouch'
          itemSubtitle = 'Hybrid Mustard Seed Retail Pouch Packaging'
        } else if (src.includes('vadhiyar-carom-pouch') || src.includes('carom')) {
          itemTitle = 'Vadhiyar-21 Carom Seeds'
          itemCategory = 'Seed Pouch'
          itemSubtitle = 'Research Carom / Ajwain Seed Retail Pouch'
        } else if (src.includes('vadhiyar-guar-pouch') || src.includes('guar')) {
          itemTitle = 'Vadhiyar-111 Guar Seeds'
          itemCategory = 'Seed Pouch'
          itemSubtitle = 'Research Guar Seed Retail Pouch Packaging'
        } else if (src.includes('macrofuel-opt-01') || src.includes('macrofuel')) {
          itemTitle = 'Macro Fuel Box Packaging & Dielines'
          itemCategory = 'Retail Box'
          itemSubtitle = 'Production Box Packaging & Print Specifications'
        } else if (src.includes('blentree-fish-curry') || src.includes('blentree')) {
          itemTitle = 'Blentree Fish Curry Masala'
          itemCategory = 'Spice Packaging'
          itemSubtitle = 'Ready to Cook · Retail Box Packaging & Concept'
        }
      } else if (project.id === 'pitch-decks') {
        if (src.includes('ankpal-genie-growth-cover')) {
          itemTitle = 'ANKPAL 3D Genie & Analytics Pitch Deck'
          itemCategory = 'Investor Deck'
          itemSubtitle = '3D Brand Visuals, Growth Metrics & Business System Deck'
        } else if (src.includes('ankpal-pitch-systems')) {
          itemTitle = 'ANKPAL AI Distribution Pitch Deck'
          itemCategory = 'Investor Deck'
          itemSubtitle = 'Slide Deck Architecture with Smart Genie'
        } else if (src.includes('ankpal-pitch-vc')) {
          itemTitle = 'ANKPAL VC Architecture Deck'
          itemCategory = 'Product Presentation'
          itemSubtitle = 'Workflow & Capability Breakdown'
        } else if (src.includes('speedair')) {
          itemTitle = 'Speedair Logistics Pitch'
          itemCategory = 'Investor Presentation'
          itemSubtitle = 'Corporate Presentation & Global Metrics'
        }
      } else if (project.id === 'social-media') {
        if (src.includes('vi-social-jalebi-fafda')) {
          itemTitle = 'Sunday Jalebi Fafda Tradition'
          itemCategory = 'Social Campaign'
          itemSubtitle = 'VI Groundnut Oil · Sunday Tradition Creative'
        } else if (src.includes('vi-social-oil-benefits-splash')) {
          itemTitle = 'Groundnut Oil Benefits Splash'
          itemCategory = 'Social Campaign'
          itemSubtitle = 'VI Groundnut Oil · Dynamic Benefits Creative'
        } else if (src.includes('vi-social-mirror-peanuts')) {
          itemTitle = 'Purity & Transparency Reflection'
          itemCategory = 'Social Creative'
          itemSubtitle = 'VI Groundnut Oil · Conceptual Mirror Creative'
        } else if (src.includes('light-lounge-living-room')) {
          itemTitle = "It's the Lighting"
          itemCategory = 'Social Ad'
          itemSubtitle = 'Light Lounge · Luxury Interior & Chandelier Showcase'
        } else if (src.includes('brown-mule-coffee-grit')) {
          itemTitle = 'Good Coffee Takes Grit'
          itemCategory = 'Social Creative'
          itemSubtitle = 'Brown Mule · Arabica Ground Coffee Ad'
        } else if (src.includes('light-lounge-door-patel')) {
          itemTitle = 'First Impression Shine'
          itemCategory = 'Social Ad'
          itemSubtitle = "Light Lounge · Patel's Entrance Illumination"
        } else if (src.includes('light-lounge-ceiling-fan')) {
          itemTitle = 'Ceilings Coolest Upgrade'
          itemCategory = 'Social Ad'
          itemSubtitle = 'Light Lounge · Modern Designer Fan Light'
        }
      }

      return {
        id: `${project.id}-item-${idx}`,
        src,
        backSrc,
        title: itemTitle,
        category: itemCategory,
        subtitle: itemSubtitle,
        alt: `${project.title} - ${itemTitle}`,
      }
    })
  }, [project])

  // Single-Scroll & Wheel Fix: Native scroll dispatch and background lock
  useEffect(() => {
    if (!project) return

    // 1. Lock background HTML & BODY to completely eliminate background scroll
    document.documentElement.classList.add('modal-open')
    document.body.classList.add('modal-open')

    // 2. Pause Lenis background smooth scroll
    const lenis = (window as any).__lenis
    lenis?.stop()

    // 3. Attach native wheel and touch listeners directly to modal container with capture
    const modalEl = modalRef.current
    if (!modalEl) return

    modalEl.focus()

    const handleNativeWheel = (e: WheelEvent) => {
      e.stopPropagation()
      e.stopImmediatePropagation()
      modalEl.scrollTop += e.deltaY
    }

    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.stopPropagation()
      const deltaY = touchStartY - e.touches[0].clientY
      touchStartY = e.touches[0].clientY
      modalEl.scrollTop += deltaY
    }

    modalEl.addEventListener('wheel', handleNativeWheel, { passive: true, capture: true })
    modalEl.addEventListener('touchstart', handleTouchStart, { passive: true })
    modalEl.addEventListener('touchmove', handleTouchMove, { passive: true, capture: true })

    return () => {
      document.documentElement.classList.remove('modal-open')
      document.body.classList.remove('modal-open')
      modalEl.removeEventListener('wheel', handleNativeWheel, { capture: true })
      modalEl.removeEventListener('touchstart', handleTouchStart)
      modalEl.removeEventListener('touchmove', handleTouchMove, { capture: true })
      lenis?.start()
    }
  }, [project])

  const navigateLightbox = (direction: 1 | -1) => {
    if (!activeLightbox) return
    setIsZoomed(false)
    const pool = isSocialMedia ? reelItems : galleryItems
    const nextIdx = (activeLightbox.index + direction + pool.length) % pool.length
    const nextItem = pool[nextIdx]
    setActiveLightbox({
      src: nextItem.src,
      title: nextItem.title || 'Creative Asset',
      tag: (nextItem as any).category || 'Artwork',
      index: nextIdx,
      total: pool.length,
    })
  }

  const handleReturnToGallery = () => {
    // 1. Instantly unlock background body/html
    document.documentElement.classList.remove('modal-open')
    document.body.classList.remove('modal-open')

    // 2. Restart Lenis
    const lenis = (window as any).__lenis
    lenis?.start()

    // 3. Call parent onClose
    onClose()

    // 4. Smoothly scroll back to the 3D Work section of the website
    const scrollToWork = () => {
      const workEl = document.getElementById('work-section') || document.querySelector('.gallery-panel-wrapper')
      if (workEl) {
        if (lenis) {
          lenis.scrollTo(workEl, { offset: 0, duration: 1.2, immediate: false })
        } else {
          workEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    requestAnimationFrame(scrollToWork)
    setTimeout(scrollToWork, 60)
    setTimeout(scrollToWork, 200)
  }

  // ESC key and keyboard navigation for lightbox & modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeLightbox !== null) {
          setActiveLightbox(null)
          setIsZoomed(false)
        } else {
          handleReturnToGallery()
        }
      } else if (activeLightbox !== null) {
        if (e.key === 'ArrowRight') {
          navigateLightbox(1)
        } else if (e.key === 'ArrowLeft') {
          navigateLightbox(-1)
        } else if (e.key === '+' || e.key === '=') {
          setIsZoomed(true)
        } else if (e.key === '-') {
          setIsZoomed(false)
        } else if (e.key.toLowerCase() === 'z') {
          setIsZoomed((prev) => !prev)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, activeLightbox, galleryItems, reelItems, isSocialMedia])

  if (!project) return null

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      data-lenis-prevent="true"
      className="fixed inset-0 z-[99999] overflow-y-auto overscroll-contain bg-[#08080a] text-[#f7f4ee] flex flex-col outline-none"
    >
      {/* Top Fixed Control Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-12 py-4 bg-[#08080a]/90 backdrop-blur-xl border-b border-white/10 font-mono text-xs tracking-widest">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-white font-bold text-sm tracking-wide">
            {project.title}
          </span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-amber-400 text-[10px] font-sans">
            {project.category}
          </span>
        </div>

        <button
          type="button"
          onClick={handleReturnToGallery}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black hover:border-white transition-all text-xs font-mono group cursor-pointer"
        >
          <span>CLOSE</span>
          <span className="text-[10px] opacity-60 group-hover:opacity-100">[ESC]</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Project Header Container */}
      <div className="max-w-6xl mx-auto w-full px-6 sm:px-12 pt-10 pb-6 flex flex-col gap-6">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <span>PROJECT</span>
            <span className="text-neutral-600">/</span>
            <span>{project.title}</span>
            {project.category.toLowerCase() !== project.title.toLowerCase() && (
              <>
                <span className="text-neutral-600">/</span>
                <span className="text-neutral-400">{project.category}</span>
              </>
            )}
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-white tracking-normal leading-[1.15]">
            {project.title}
          </h1>

          <p className="font-sans text-base sm:text-lg text-neutral-200 max-w-3xl font-light leading-relaxed">
            {isSocialMedia
              ? 'High-converting creatives, branded carousels, and visual storytelling crafted to stop the scroll and build brand recall across digital platforms.'
              : project.description || project.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-neutral-400 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">CATEGORY:</span>
              <span className="text-amber-300 font-semibold">{project.category}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">DELIVERABLES:</span>
              <span className="text-neutral-300 font-light">{project.deliverables.join(' · ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY SECTION */}
      {isSocialMedia ? (
        /* FULL-SCREEN IMMERSIVE REEL GALLERY (100% Viewport Width, Single Flowing Rail) */
        <div className="w-full bg-[#050508] border-y border-white/10 py-3 sm:py-5">
          <ReelGallery
            items={reelItems}
            tiltAngle={0}
            speed={95}
            onItemClick={(item, idx) => {
              setActiveLightbox({
                src: item.src,
                title: item.title,
                tag: item.category,
                index: idx,
                total: reelItems.length,
              })
            }}
          />
        </div>
      ) : (
        /* STANDARD COLUMN FOR OTHER CATEGORIES */
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-12 py-4">
          <div className="flex flex-col gap-4">
            <div className="w-full bg-[#0d0d12] p-3 sm:p-5 rounded-2xl border border-white/10 shadow-2xl">
              <DynamicGridGallery
                items={galleryItems}
                gap={14}
                expandFactor={1.9}
                rounded="rounded-xl"
                onItemClick={(item, idx) => {
                  setIsLightboxFlipped(false)
                  setActiveLightbox({
                    src: item.src,
                    backSrc: item.backSrc,
                    title: item.title || `${project.title} Creative`,
                    tag: item.category,
                    index: idx,
                    total: galleryItems.length,
                  })
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content: Modal Footer Bar (Clean, compact padding) */}
      <div className="max-w-6xl mx-auto w-full px-6 sm:px-12 py-4 sm:py-6 flex flex-col gap-4">
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <span>Project</span>
            <span className="text-white font-medium">{project.title}</span>
          </div>

          <button
            type="button"
            onClick={handleReturnToGallery}
            className="px-6 py-2.5 bg-amber-400 text-black font-semibold rounded-full hover:bg-white hover:text-black transition-all text-xs font-sans tracking-wide cursor-pointer"
          >
            Back to Overview ↗
          </button>
        </div>
      </div>

      {/* Lightbox Modal for Full Resolution Inspection */}
      {activeLightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn"
          onClick={() => {
            setActiveLightbox(null)
            setIsLightboxFlipped(false)
          }}
        >
          {/* Lightbox Header Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-xs font-mono text-neutral-400 pt-2 pb-4 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-amber-400 font-bold">
                [{String(activeLightbox.index + 1).padStart(2, '0')} / {String(activeLightbox.total).padStart(2, '0')}]
              </span>
              <span className="text-white font-sans text-sm font-medium">
                {activeLightbox.title}
              </span>
              {activeLightbox.tag && (
                <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-300 text-[10px]">
                  {activeLightbox.tag}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Flyer 3D Flip Page Button */}
              {activeLightbox.backSrc && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsLightboxFlipped(!isLightboxFlipped)
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 text-xs font-mono font-bold transition-all cursor-pointer shadow-lg active:scale-95 ${
                    isLightboxFlipped
                      ? 'bg-emerald-400 text-black border-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.6)]'
                      : 'bg-amber-400 text-black border-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.6)] hover:bg-amber-300'
                  }`}
                  title="Flip page to see reverse side"
                >
                  <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>{isLightboxFlipped ? 'SHOW FRONT COVER ↻' : 'FLIP TO REVERSE SIDE ↻'}</span>
                </button>
              )}

              {/* Zoom Inspection Toggle */}
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
                  isZoomed
                    ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
                title="Toggle 2x Zoom (or double click image) to inspect packaging typography & print dieline"
              >
                {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                <span>{isZoomed ? 'ZOOM 2X (ACTIVE)' : 'ZOOM INSPECT'}</span>
              </button>

              {/* Open High-Res in New Tab */}
              <a
                href={isLightboxFlipped && activeLightbox.backSrc ? activeLightbox.backSrc : activeLightbox.src}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Open high-resolution artwork in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveLightbox(null)
                  setIsZoomed(false)
                  setIsLightboxFlipped(false)
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white hover:text-black transition-colors text-white cursor-pointer ml-1"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image Viewport */}
          <div
            className={`relative flex-1 w-full max-w-5xl flex items-center justify-center my-2 ${
              isZoomed ? 'overflow-auto cursor-zoom-out p-4' : 'overflow-hidden cursor-zoom-in'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomed(!isZoomed)
            }}
          >
            <img
              src={isLightboxFlipped && activeLightbox.backSrc ? activeLightbox.backSrc : activeLightbox.src}
              alt={activeLightbox.title}
              className={`rounded-lg shadow-2xl border border-white/10 select-none transition-all duration-500 ${
                isZoomed
                  ? 'max-w-none w-[170%] md:w-[145%] max-h-none object-contain my-auto'
                  : 'max-h-[78vh] max-w-full object-contain'
              }`}
            />

            {/* Prominent Floating Flip Button Directly Over Flyer */}
            {activeLightbox.backSrc && (
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsLightboxFlipped(!isLightboxFlipped)
                  }}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border-2 text-xs sm:text-sm font-mono font-bold transition-all duration-300 cursor-pointer shadow-2xl backdrop-blur-md active:scale-95 ${
                    isLightboxFlipped
                      ? 'bg-emerald-400 text-black border-emerald-200 shadow-[0_0_24px_rgba(52,211,153,0.8)] hover:bg-emerald-300'
                      : 'bg-amber-400 text-black border-amber-200 shadow-[0_0_24px_rgba(251,191,36,0.8)] hover:bg-amber-300 hover:scale-105'
                  }`}
                >
                  <RotateCw className="w-4 h-4" />
                  <span>{isLightboxFlipped ? 'FLIP TO FRONT COVER (PAGE 1)' : 'FLIP TO REVERSE SIDE (PAGE 2) ↻'}</span>
                </button>
              </div>
            )}

            {/* Left Prev Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigateLightbox(-1)
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all backdrop-blur-md shadow-lg z-20 cursor-pointer"
              aria-label="Previous artwork"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Next Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigateLightbox(1)
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all backdrop-blur-md shadow-lg z-20 cursor-pointer"
              aria-label="Next artwork"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Footer Bar with Social Media Engagement Actions */}
          <div
            className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-400 py-3 border-t border-white/10 z-10 gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Social Engagement Actions: Heart, Message, Share */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {}}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-400 border border-white/10 hover:border-rose-400/40 transition-all cursor-pointer text-xs"
                title="Like creative artwork"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Like</span>
              </button>

              <button
                type="button"
                onClick={() => {}}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-sky-500/20 text-neutral-300 hover:text-sky-400 border border-white/10 hover:border-sky-400/40 transition-all cursor-pointer text-xs"
                title="Comment & feedback"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Comment</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: activeLightbox.title,
                      text: `Check out ${activeLightbox.title} by Naiya Dhruv`,
                      url: window.location.href,
                    }).catch(() => {})
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-400 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer text-xs"
                title="Share this artwork"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={() => {}}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-400/20 text-neutral-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer text-xs"
                title="Save artwork to collection"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>

            {/* Keyboard & Portfolio Credits */}
            <div className="flex items-center gap-3 text-neutral-400">
              <span className="hidden sm:inline">Click image or [Z] for 2x zoom</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-amber-400 font-medium">Naiya Dhruv · Creative Atelier</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CaseStudyModal
