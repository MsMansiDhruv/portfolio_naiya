import React, { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dialogueAudioManager } from '../utils/dialogueAudioManager'
import { getPreloadedAssetUrl, subscribeToAssetCache } from '../utils/assetCacheManager'

interface ScrubVideoSectionProps {
  videoSrc: string
  overlay?: React.ReactNode
  roundedTop?: boolean
  isHero?: boolean
  scrollAmount?: string
  'data-witty-index'?: number
  sectionId?: string
  dialogueSrc?: string
}

export function ScrubVideoSection({ 
  videoSrc, 
  overlay, 
  roundedTop, 
  isHero = false,
  scrollAmount = '+=140%', 
  'data-witty-index': wittyIndex,
  sectionId,
  dialogueSrc,
}: ScrubVideoSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const overlayWrapperRef = useRef<HTMLDivElement | null>(null)
  const [currentSrc, setCurrentSrc] = useState<string>(() => getPreloadedAssetUrl(videoSrc))

  useEffect(() => {
    setCurrentSrc(getPreloadedAssetUrl(videoSrc))
    const unsubscribe = subscribeToAssetCache(() => {
      const updated = getPreloadedAssetUrl(videoSrc)
      setCurrentSrc((prev) => (prev !== updated ? updated : prev))
    })
    return unsubscribe
  }, [videoSrc])

  useEffect(() => {
    if (!containerRef.current) return

    const vid = videoRef.current
    if (!vid) return

    let targetTime = 0
    let rafId: number | null = null
    let isMounted = true
    let lastSeekTime = 0

    const isMobileDevice = typeof window !== 'undefined' && (
      window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0
    )

    const executeSeek = (time: number) => {
      if (!vid || isNaN(vid.duration) || vid.duration <= 0) return
      const maxPlayable = sectionId === 'scene-4' ? vid.duration * 0.85 : Math.max(0, vid.duration - 0.03)
      const boundedTime = Math.max(0, Math.min(maxPlayable, time))
      
      if (isMobileDevice && (vid as any).fastSeek) {
        try {
          (vid as any).fastSeek(boundedTime)
          return
        } catch (_) {}
      }
      vid.currentTime = boundedTime
    }

    // Continuous Animation Frame loop with mobile hardware decoder throttling
    const renderLoop = () => {
      if (!isMounted) return

      if (
        vid &&
        vid.readyState >= 2 &&
        !isNaN(vid.duration) &&
        vid.duration > 0
      ) {
        if (!vid.seeking) {
          const diff = targetTime - vid.currentTime
          const threshold = isMobileDevice ? 0.025 : 0.006

          if (Math.abs(diff) > threshold) {
            const now = performance.now()
            if (!isMobileDevice || now - lastSeekTime > 32) {
              lastSeekTime = now
              if (isMobileDevice) {
                // Mobile: seek directly to targetTime without micro-step decoder congestion
                executeSeek(targetTime)
              } else {
                // Desktop: 60fps sub-frame smooth interpolation
                const step = Math.abs(diff) > 0.35 ? diff * 0.55 : diff * 0.36
                const newTime = Math.max(0, Math.min(vid.duration - 0.02, vid.currentTime + step))
                vid.currentTime = newTime
              }
            }
          }
        }
      }

      rafId = requestAnimationFrame(renderLoop)
    }

    rafId = requestAnimationFrame(renderLoop)

    // Handle seeked event to catch up immediately if user scrolled rapidly
    const handleSeeked = () => {
      if (!isMounted || !vid || isNaN(vid.duration) || vid.duration <= 0) return
      const diff = targetTime - vid.currentTime
      if (Math.abs(diff) > (isMobileDevice ? 0.05 : 0.04)) {
        if (isMobileDevice) {
          executeSeek(targetTime)
        } else {
          const step = diff * 0.5
          const newTime = Math.max(0, Math.min(vid.duration - 0.02, vid.currentTime + step))
          vid.currentTime = newTime
        }
      }
    }
    vid.addEventListener('seeked', handleSeeked)

    // Responsive scrollAmount calibration for mobile devices
    const isMobile = window.innerWidth < 768
    const effectiveScrollAmount = isMobile 
      ? (isHero ? '+=95%' : '+=100%')
      : scrollAmount

    // Top-to-bottom refresh priority prevents pin spacer miscalculations during reverse scrolling
    const priority = isHero ? 10 : sectionId === 'scene-2' ? 8 : sectionId === 'scene-3' ? 6 : 4

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: effectiveScrollAmount,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      preventOverlaps: true,
      refreshPriority: priority,
      scrub: isMobile ? 0.25 : 0.35,
      onEnter: () => {
        if (sectionId) {
          dialogueAudioManager.onSectionEnter(sectionId, dialogueSrc)
        }
      },
      onEnterBack: () => {
        if (sectionId) {
          dialogueAudioManager.onSectionEnter(sectionId, dialogueSrc)
        }
      },
      onLeave: () => {
        if (sectionId) {
          dialogueAudioManager.onSectionLeave(sectionId)
        }
        if (vid && !isNaN(vid.duration)) {
          const maxPlayable = sectionId === 'scene-4' ? vid.duration * 0.85 : Math.max(0, vid.duration - 0.03)
          targetTime = maxPlayable
          executeSeek(maxPlayable)
        }
      },
      onLeaveBack: () => {
        if (sectionId) {
          dialogueAudioManager.onSectionLeave(sectionId)
        }
        if (vid && !isNaN(vid.duration)) {
          targetTime = 0
          executeSeek(0)
        }
      },
      onUpdate: (self) => {
        // 1. Calculate target time smoothly in both forward and reverse directions
        if (vid && !isNaN(vid.duration) && vid.duration > 0) {
          const maxPlayable = sectionId === 'scene-4' ? vid.duration * 0.85 : Math.max(0, vid.duration - 0.03)
          targetTime = Math.max(0, Math.min(self.progress * maxPlayable, maxPlayable))

          if (isMobileDevice && !vid.seeking) {
            const now = performance.now()
            if (now - lastSeekTime > 32) {
              lastSeekTime = now
              executeSeek(targetTime)
            }
          }
        }

        // 2. Hardware-accelerated GPU overlay glide
        if (overlayWrapperRef.current) {
          const p = self.progress
          let opacity = 1

          if (isHero) {
            // Hero: 100% visible at start; glides out gently on scroll past 70%
            if (p > 0.70) {
              const exit = Math.min(1, (p - 0.70) / 0.30)
              opacity = Math.max(0, 1 - exit)
            } else {
              opacity = 1
            }
          } else {
            // Pinned Scenes: Solid 100% visibility, dissolving smoothly as section completes
            if (p > 0.84) {
              const exit = Math.min(1, (p - 0.84) / 0.16)
              opacity = Math.max(0, 1 - exit)
            } else {
              opacity = 1
            }
          }

          overlayWrapperRef.current.style.opacity = `${opacity}`
        }
      },
    })

    // If hero is in viewport on mount, initialize its dialogue
    if (isHero && sectionId && dialogueSrc) {
      dialogueAudioManager.onSectionEnter(sectionId, dialogueSrc)
    }

    return () => {
      isMounted = false
      if (rafId) cancelAnimationFrame(rafId)
      vid?.removeEventListener('seeked', handleSeeked)
      trigger.kill(true)
      if (sectionId) {
        dialogueAudioManager.onSectionLeave(sectionId)
      }
    }
  }, [currentSrc, scrollAmount, isHero, sectionId, dialogueSrc])

  return (
    <div 
      ref={containerRef} 
      data-witty-index={wittyIndex} 
      className={`witty-section relative w-full h-screen h-[100dvh] min-h-[100dvh] bg-black flex items-center justify-center border-t border-white/5 ${
        roundedTop ? 'rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-40' : 'z-10'
      }`}
    >
      <div className={`absolute inset-0 w-full h-full overflow-hidden ${roundedTop ? 'rounded-t-[40px] md:rounded-t-[60px]' : ''}`}>
        <video
          ref={videoRef}
          src={currentSrc}
          className={`absolute inset-0 w-full h-full object-cover will-change-transform pointer-events-none transition-transform duration-300 ${
            isHero ? 'blur-[3px] md:blur-none scale-[1.04] md:scale-100' : ''
          } ${sectionId === 'scene-2' ? 'scale-[1.06] origin-top-left' : ''}`}
          playsInline
          muted
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          {...({ 'webkit-playsinline': 'true' } as any)}
        />
        
        {/* Subtle corner mask for scene-2 to fully conceal bottom-right watermark */}
        {sectionId === 'scene-2' && (
          <div className="absolute bottom-0 right-0 w-52 h-28 bg-gradient-to-tl from-black via-black/85 to-transparent pointer-events-none z-20" />
        )}
        
        {/* Deep edge vignette and ambient blackness on mobile for crisp text visibility */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.85)_100%)] md:bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.50)_100%)]" />
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/80 via-black/25 to-black/85 md:from-black/40 md:via-transparent md:to-black/40" />
        <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.70)_100%)] md:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)] mix-blend-multiply" />
        
        {/* Kinetic Lenis-linked overlay container with GPU transform */}
        <div 
          ref={overlayWrapperRef}
          className="absolute inset-0 z-50 pointer-events-none will-change-transform"
        >
          {overlay}
        </div>
      </div>
    </div>
  )
}
