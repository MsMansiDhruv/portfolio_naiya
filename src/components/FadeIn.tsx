import { useEffect, useRef, type ReactNode } from 'react'
import { EASE_OUT, gsap, prefersReducedMotion } from '../lib/gsap'

type FadeInProps = {
  children: ReactNode
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  blur?: number
}

/** Section enter via GSAP ScrollTrigger — replaces Framer whileInView. */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.9,
  x = 0,
  y = 36,
  className,
  blur = 6,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, x, y, filter: `blur(${blur}px)` },
        {
          opacity: 1,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          duration,
          delay,
          ease: EASE_OUT,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [delay, duration, x, y, blur])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
