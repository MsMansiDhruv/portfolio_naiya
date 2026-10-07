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

    // Continuous Animation Frame loop for ultra-smooth video scrubbing
    const renderLoop = () => {
      if (!isMounted) return

      if (
        vid &&
        vid.readyState >= 2 &&
        !isNaN(vid.duration) &&
        vid.duration > 0
      ) {
        const diff = targetTime - vid.currentTime
        if (Math.abs(diff) > 0.008) {
          // Smooth momentum dampening for video playback
          const step = diff * 0.28
          const newTime = Math.max(0, Math.min(vid.duration - 0.02, vid.currentTime + step))
          try {
            if ('fastSeek' in vid && typeof (vid as any).fastSeek === 'function' && Math.abs(diff) > 0.4) {
              (vid as any).fastSeek(newTime)
            } else {
              vid.currentTime = newTime
            }
          } catch {
            // Ignore seek race errors
          }
        }
      }

      rafId = requestAnimationFrame(renderLoop)
    }

    rafId = requestAnimationFrame(renderLoop)

    // Responsive scrollAmount calibration for mobile devices
    const isMobile = window.innerWidth < 768
    const effectiveScrollAmount = isMobile 
      ? (isHero ? '+=100%' : '+=110%')
      : scrollAmount

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: effectiveScrollAmount,
      pin: true,
      scrub: 1.0,
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
      },
      onLeaveBack: () => {
        if (sectionId) {
          dialogueAudioManager.onSectionLeave(sectionId)
        }
      },
      onUpdate: (self) => {
        // 1. Calculate target time smoothly
        if (vid && !isNaN(vid.duration) && vid.duration > 0) {
          targetTime = Math.min(self.progress * vid.duration, Math.max(0, vid.duration - 0.03))
        }

        // 2. Hardware-accelerated GPU overlay glide
        if (overlayWrapperRef.current) {
          const p = self.progress
          let opacity = 1
          let y = 0

          if (isHero) {
            // Hero: 100% visible at start; glides out gently on scroll past 65%
            if (p > 0.65) {
              const exit = Math.min(1, (p - 0.65) / 0.35)
              opacity = Math.max(0, 1 - exit)
              y = -exit * 24
            } else {
              opacity = 1
              y = 0
            }
          } else {
            // Pinned Scenes (Video 2 & Video 3): Stays 100% solid and illuminated throughout the entire video scrub
            if (p < 0.08) {
              const enter = p / 0.08
              opacity = Math.min(1, Math.max(0, enter))
              y = (1 - enter) * 16
            } else {
              opacity = 1
              y = 0
            }
          }

          overlayWrapperRef.current.style.opacity = `${opacity}`
          overlayWrapperRef.current.style.transform = `translate3d(0, ${y}px, 0)`
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
          key={currentSrc}
          ref={videoRef}
          src={currentSrc}
          className="absolute inset-0 w-full h-full object-cover will-change-transform pointer-events-none"
          playsInline
          muted
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          {...({ 'webkit-playsinline': 'true' } as any)}
        />
        
        <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] mix-blend-multiply" />
        
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
