import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { prefersReducedMotion, syncLenisScrollTrigger } from '../lib/gsap'

export const SCROLL_EVENT = 'site-scroll'

type SmoothScrollProps = {
  children: ReactNode
}

/** Ultra-smooth page scroll via Lenis + GSAP ScrollTrigger sync. */
export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2.5,
      wheelMultiplier: 0.5,
    })

    const emit = () => {
      window.dispatchEvent(new CustomEvent(SCROLL_EVENT))
    }

    lenis.on('scroll', emit)
    syncLenisScrollTrigger(lenis)

    let raf = 0
    const tick = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null
      if (!target) return
      const id = target.getAttribute('href')?.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -8, duration: 1.2 })
    }
    document.addEventListener('click', onClick)

    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      delete (window as unknown as { __lenis?: Lenis }).__lenis
      lenis.destroy()
    }
  }, [])

  return children
}

export function scrollToId(id: string, duration = 1.2) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
  if (lenis) {
    lenis.scrollTo(el, { offset: -8, duration })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
