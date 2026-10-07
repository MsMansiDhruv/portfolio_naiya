import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CinematicFilmExperience } from './components/CinematicFilmExperience'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Scroll to top on fresh mount
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    // Detect if current device has touch capabilities
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

    // Configure GSAP ScrollTrigger for responsive & mobile resilience
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
    })

    const lenis = new Lenis({
      duration: isTouch ? 0.9 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: false,
    })

    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update()
      const velocity = Math.max(-20, Math.min(20, e?.velocity || 0))
      document.documentElement.style.setProperty('--scroll-velocity', `${velocity}`)
    })
    ;(window as any).__lenis = lenis
    lenisRef.current = lenis

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(500, 33)

    // Recalculate ScrollTrigger once DOM layout stabilizes
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    return () => {
      clearTimeout(refreshTimer)
      gsap.ticker.remove(updateLenis)
      ;(window as any).__lenis = null
      lenis.destroy()
    }
  }, [])

  return (
    <main className="w-full min-h-screen bg-neutral-950 relative">
      <CinematicFilmExperience isLoaded={true} />
    </main>
  )
}
