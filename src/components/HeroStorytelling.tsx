import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import videoSrc from '../../assets/avatar_hero_white.mp4'
import { BackgroundVideo } from './BackgroundVideo'

gsap.registerPlugin(ScrollTrigger)

/**
 * Enhanced Hero with scroll-driven storytelling
 * Inspired by high-end creative portfolios like Sleep Well Creatives
 *
 * Features:
 * - Scroll-triggered text reveal and fade
 * - Video scale/zoom on scroll
 * - Smooth easing throughout
 */
export function HeroStorytelling() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const ledeRef = useRef<HTMLParagraphElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const kickerRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const lede = ledeRef.current
    const videoWrap = videoWrapRef.current
    const kicker = kickerRef.current

    if (!section || !title || !lede || !videoWrap || !kicker) return

    // Split title into words for staggered reveal
    const words = title.querySelectorAll('.hero-word')

    // Main storytelling timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    })

    // Chapter 1: Hero text fades and scales down
    tl.to(kicker, {
      y: -60,
      opacity: 0,
      ease: 'power2.inOut',
    }, 0)

    tl.to(words, {
      y: -100,
      opacity: 0,
      scale: 0.8,
      stagger: 0.05,
      ease: 'power2.inOut',
    }, 0)

    tl.to(lede, {
      y: -80,
      opacity: 0,
      ease: 'power2.inOut',
    }, 0)

    // Chapter 2: Video scales up and zooms
    tl.to(videoWrap, {
      scale: 1.2,
      ease: 'power1.inOut',
    }, 0.3)

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[200vh]"
      aria-label="Intro"
    >
      <div className="sticky top-0 h-[100vh] overflow-hidden">
        <div
          ref={videoWrapRef}
          className="absolute inset-0 will-change-transform"
        >
          <BackgroundVideo
            src={videoSrc}
            scrubRootId="hero-storytelling"
            smoothness={0.14}
            className="stage-video"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <p
            ref={kickerRef}
            className="text-sm uppercase tracking-widest text-white/70 mb-6 font-mono"
          >
            Graphic Designer · AI Web
          </p>

          <h1
            ref={titleRef}
            className="text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.9] tracking-tighter text-white mb-8"
          >
            <span className="hero-word inline-block">Naiya</span>
            <br />
            <span className="hero-word inline-block">Dhruv</span>
          </h1>

          <p
            ref={ledeRef}
            className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed"
          >
            Brand systems, editorial, and AI-built web — intentional and
            unforgettable.
          </p>
        </div>
      </div>
    </section>
  )
}
