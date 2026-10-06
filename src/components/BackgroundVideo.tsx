import { useEffect, useRef, type CSSProperties } from 'react'
import { SCROLL_EVENT } from './SmoothScroll'

type BackgroundVideoProps = {
  src: string
  className?: string
  style?: CSSProperties
  scrubRootId?: string
  /** Lerp factor per frame (0–1). Lower = silkier. */
  smoothness?: number
}

/**
 * Smooth scroll-scrubbed video.
 * Keeps a display clock lerping toward scroll progress and seeks the
 * video only when a prior seek has finished — avoids stutter.
 */
export function BackgroundVideo({
  src,
  className,
  style,
  scrubRootId,
  smoothness = 0.1,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetRef = useRef(0)
  const displayRef = useRef(0)
  const seekingRef = useRef(false)
  const rafRef = useRef(0)
  const progressRef = useRef(0)
  const durationRef = useRef(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const readProgress = () => {
      const root = scrubRootId ? document.getElementById(scrubRootId) : null
      if (root) {
        const rect = root.getBoundingClientRect()
        const total = Math.max(root.offsetHeight - window.innerHeight, 1)
        return Math.min(Math.max(-rect.top, 0) / total, 1)
      }
      const doc = document.documentElement
      const total = Math.max(doc.scrollHeight - window.innerHeight, 1)
      return Math.min(Math.max(window.scrollY / total, 0), 1)
    }

    const applyTime = (t: number) => {
      const dur = durationRef.current
      if (!dur) return
      const clamped = Math.max(0, Math.min(t, dur - 0.05))
      if (Math.abs(video.currentTime - clamped) < 0.02) return
      seekingRef.current = true
      try {
        video.currentTime = clamped
      } catch {
        seekingRef.current = false
      }
    }

    const onSeeked = () => {
      seekingRef.current = false
    }

    const warmFirstFrame = async () => {
      try {
        video.muted = true
        await video.play()
        video.pause()
      } catch {
        /* autoplay may fail — still try a seek */
      }
      progressRef.current = readProgress()
      targetRef.current = progressRef.current * durationRef.current
      displayRef.current = targetRef.current
      applyTime(displayRef.current)
    }

    const onMeta = () => {
      if (!video.duration || Number.isNaN(video.duration)) return
      durationRef.current = video.duration
      void warmFirstFrame()
    }

    const onScroll = () => {
      progressRef.current = readProgress()
    }

    const tick = () => {
      const dur = durationRef.current
      if (dur > 0) {
        targetRef.current = progressRef.current * dur
        const gap = targetRef.current - displayRef.current
        const abs = Math.abs(gap)
        const factor = abs > 0.4 ? Math.min(0.32, smoothness * 2.8) : smoothness
        displayRef.current += gap * factor

        if (!seekingRef.current) {
          applyTime(displayRef.current)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    video.addEventListener('seeked', onSeeked)
    video.addEventListener('loadedmetadata', onMeta)
    if (video.readyState >= 1) onMeta()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener(SCROLL_EVENT, onScroll)
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadedmetadata', onMeta)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener(SCROLL_EVENT, onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [scrubRootId, smoothness])

  return (
    <video
      ref={videoRef}
      src={src}
      poster="/hero-poster.jpg"
      muted
      playsInline
      preload="auto"
      className={className ?? 'fixed inset-0 z-0 h-full w-full object-cover'}
      style={style}
    />
  )
}
