import { useEffect, useRef, type ReactNode } from 'react'
import { EASE_OUT, gsap, prefersReducedMotion } from '../lib/gsap'

type TextRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  /** Character stagger entrance (GSAP). */
  split?: boolean
}

/** Soft blur-rise headlines — GSAP ScrollTrigger (+ optional char split). */
export function TextReveal({
  children,
  className,
  delay = 0,
  as = 'div',
  split = false,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      if (split) {
        const targets = el.querySelectorAll('.text-split__char')
        if (targets.length) {
          gsap.fromTo(
            targets,
            { y: '115%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              duration: 0.75,
              stagger: 0.025,
              delay,
              ease: EASE_OUT,
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              },
            },
          )
          return
        }
      }

      gsap.fromTo(
        el,
        { opacity: 0, y: 32, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.95,
          delay,
          ease: EASE_OUT,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [delay, split])

  const content =
    split && typeof children === 'string' ? (
      <span className="text-split" aria-label={children}>
        {Array.from(children).map((ch, i) => (
          <span key={`${ch}-${i}`} className="text-split__wrap" aria-hidden="true">
            <span className="text-split__char">{ch === ' ' ? '\u00A0' : ch}</span>
          </span>
        ))}
      </span>
    ) : (
      children
    )

  const shared = { ref: ref as never, className }

  if (as === 'h1') return <h1 {...shared}>{content}</h1>
  if (as === 'h2') return <h2 {...shared}>{content}</h2>
  if (as === 'h3') return <h3 {...shared}>{content}</h3>
  if (as === 'p') return <p {...shared}>{content}</p>
  return <div {...shared}>{content}</div>
}
