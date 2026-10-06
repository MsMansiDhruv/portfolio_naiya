import { useEffect, useRef } from 'react'
import { PROCESS_STEPS, SERVICES } from '../data/portfolio'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { FadeIn } from './FadeIn'
import { TextReveal } from './TextReveal'

/** Trust deepening — pinned step-by-step process scrub. */
export function StudioMethod() {
  const sectionRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<Array<HTMLLIElement | null>>([])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const steps = stepsRef.current.filter(Boolean) as HTMLLIElement[]
      if (steps.length === 0) return

      // GSAP ScrollTrigger timeline — section pins until all process steps are browsed
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          start: 'top top',
          end: '+=1800',
          anticipatePin: 1,
        },
      })

      steps.forEach((step, i) => {
        tl.fromTo(
          step,
          { opacity: 0.25, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1.02,
            duration: 1,
            ease: 'power2.out',
          },
          i * 0.8,
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="method"
      className="method-section method-section--punch relative min-h-screen flex flex-col justify-center"
      aria-labelledby="method-heading"
    >
      <div className="page-wrap py-12">
        <div className="section-head method-head section-head--tight">
          <div id="method-heading">
            <TextReveal as="h2" className="section-title section-title--display" delay={0.06}>
              What you hire — and <em>how</em> it moves.
            </TextReveal>
          </div>
          <FadeIn y={20} delay={0.12}>
            <p className="method-lede">
              Four craft lanes. One process. Brand, print, pack, and web as one studio.
            </p>
          </FadeIn>
        </div>

        <ul className="service-grid">
          {SERVICES.map((s, i) => (
            <li key={s.title}>
              <FadeIn delay={0.06 + i * 0.05} y={28} blur={6}>
                <article className="service-card">
                  <span className="service-card__index">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="service-card__title">{s.title}</h3>
                  <p className="service-card__body">{s.body}</p>
                </article>
              </FadeIn>
            </li>
          ))}
        </ul>

        <div className="process-block mt-12">
          <ol className="process-rail">
            {PROCESS_STEPS.map((step, i) => (
              <li
                key={step.n}
                ref={(el) => {
                  stepsRef.current[i] = el
                }}
                className="transition-all duration-300"
              >
                <div className="process-step">
                  <span className="process-step__n">{step.n}</span>
                  <h3 className="process-step__title">{step.title}</h3>
                  <p className="process-step__body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
