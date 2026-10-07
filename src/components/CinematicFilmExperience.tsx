import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Mail, Mouse, Sparkles, Star, ShieldCheck } from 'lucide-react'
import { type ProjectCaseStudy, TESTIMONIALS } from '../data/portfolio'
import { CaseStudyModal } from './CaseStudyModal'
import { RedesignedHeaderMenu } from './RedesignedHeaderMenu'
import { ColophonFooter } from './ColophonFooter'
import { ArchitecturalGrid } from './ArchitecturalGrid'
import { ThreeWorkShowcase } from './ThreeWorkShowcase'
import { ScrubVideoSection } from './ScrubVideoSection'
import { DoodleHighlight } from './DoodleHighlight'
import { InteractivePenTool } from './InteractivePenTool'
import { WittyStickyNote } from './WittyStickyNote'
import { FloatingDoodles } from './FloatingDoodles'
import { TactileSpatialGeometryHUD } from './TactileSpatialGeometryHUD'
import { InteractiveSkillIcons } from './InteractiveSkillIcons'
import { AboutSection } from './AboutSection'
import { dialogueAudioManager } from '../utils/dialogueAudioManager'

gsap.registerPlugin(ScrollTrigger)

interface CinematicFilmExperienceProps {
  isLoaded?: boolean
}

export function CinematicFilmExperience({ isLoaded = false }: CinematicFilmExperienceProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [activeProject, setActiveProject] = useState<ProjectCaseStudy | null>(null)

  // Dedicated landing page text entrance animation triggered once assets are loaded
  useEffect(() => {
    if (!isLoaded) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05 })

      // Set initial hidden states with soft blur and translation
      gsap.set('.hero-tag', { y: 25, opacity: 0, scale: 0.95 })
      gsap.set('.hero-line-1', { y: 55, opacity: 0, filter: 'blur(10px)' })
      gsap.set('.hero-line-2', { y: 55, opacity: 0, filter: 'blur(10px)' })
      gsap.set('.hero-gold-rule', { scaleX: 0, opacity: 0, transformOrigin: 'left' })
      gsap.set('.hero-manifesto', { y: 25, opacity: 0, filter: 'blur(6px)' })
      gsap.set('.hero-scroll-cue', { y: 25, opacity: 0, scale: 0.9 })
      gsap.set('.main-header-nav', { y: -25, opacity: 0 })

      // Coordinated luxury reveal choreography
      tl.to('.main-header-nav', {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power2.out',
      })
      .to('.hero-tag', {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: 'back.out(1.4)',
      }, '-=0.55')
      .to('.hero-line-1', {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.0,
        ease: 'power3.out',
      }, '-=0.45')
      .to('.hero-line-2', {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power3.out',
      }, '-=0.8')
      .to('.hero-gold-rule', {
        scaleX: 1,
        opacity: 1,
        duration: 0.75,
        ease: 'power2.inOut',
      }, '-=0.65')
      .to('.hero-manifesto', {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power2.out',
      }, '-=0.5')
      .to('.hero-scroll-cue', {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.6)',
      }, '-=0.4')
    })

    return () => ctx.revert()
  }, [isLoaded])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Contact Reveal Animations
      gsap.to('.contact-reveal', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-panel-wrapper',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      })

      // 2. Lenis Motion Text Kinetic Gliding Engine
      // As the user scrolls down, each element smoothly glides up from below (with micro-blur dissolve).
      // While active in the central viewport reading zone, it holds 100% sharp, solid, and illuminated.
      // When scrolling past towards the next section, it gracefully glides out upwards.
      // Reversible in real-time when scrolling back up with Lenis momentum.
      const registerLenisGlide = (selector: string) => {
        const elements = document.querySelectorAll(selector)
        if (elements.length === 0) return

        elements.forEach((el) => {
          gsap.fromTo(el,
            {
              opacity: 0,
              y: 28,
              filter: 'blur(3px)',
              willChange: 'transform, opacity, filter',
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 92%',
                toggleActions: 'play none none reverse',
              }
            }
          )
        })
      }

      registerLenisGlide('.section-glide-text')

      // Testimonial Marquee Track: continuous horizontal roll
      gsap.utils.toArray('.marquee-track').forEach((track: any) => {
        gsap.to(track, {
          xPercent: -50,
          ease: 'none',
          duration: 35,
          repeat: -1,
        });
      });

      // 3. Lenis Motion Section Panel & Atmosphere Animations
      gsap.utils.toArray('.stack-section').forEach((section: any) => {
        // A. Section Reveal & Atmosphere on Scroll
        gsap.fromTo(section,
          { opacity: 0.85 },
          {
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 95%',
              end: 'top 65%',
              scrub: 0.8,
              onEnter: () => dialogueAudioManager.stopCurrentDialogue(250),
              onEnterBack: () => dialogueAudioManager.stopCurrentDialogue(250),
            }
          }
        );

        // B. Volumetric Ambient Glow Parallax inside each section
        const ambientGlows = section.querySelectorAll('.ambient-glow-pool')
        if (ambientGlows.length > 0) {
          gsap.fromTo(ambientGlows,
            { y: 45, opacity: 0.65 },
            {
              y: -45,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              }
            }
          );
        }
      });

      // 4. Contact Cards Stagger Reveal
      gsap.utils.toArray('.contact-card').forEach((card: any, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            delay: i * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.contact-panel-wrapper',
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // 5. Testimonial Cards Stagger Reveal
      gsap.utils.toArray('.testimonial-card').forEach((card: any, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50, rotationX: 8 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1.2,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      setTimeout(() => ScrollTrigger.refresh(), 500);
    })
    return () => ctx.revert()
  }, [])

  const handleNavigateSection = (section: string) => {
    const lenis = (window as any).__lenis

    if (section === 'origins' || section === 'origin' || section === 'hero') {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2, immediate: false })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    let targetEl: HTMLElement | null = null
    if (section === 'works') targetEl = document.getElementById('work-section')
    else if (section === 'about') targetEl = document.getElementById('about-section')
    else if (section === 'testimonials' || section === 'voices') targetEl = document.getElementById('testimonials-section')
    else if (section === 'contact' || section === 'connect') targetEl = document.getElementById('contact-section') || document.getElementById('colophon-footer')

    if (targetEl) {
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: -20, duration: 1.2 })
      } else {
        const top = targetEl.getBoundingClientRect().top + window.scrollY - 20
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }
  }

  // Ensure dialogueAudioManager is synchronized with initial mute state
  useEffect(() => {
    dialogueAudioManager.setMuted(isMuted)
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleAudio = () => {
    if (isMuted) {
      if (audioRef.current) {
        audioRef.current.muted = false
        audioRef.current.play().catch(() => {})
      }
      setIsMuted(false)
      dialogueAudioManager.setMuted(false)
    } else {
      if (audioRef.current) {
        audioRef.current.muted = true
        audioRef.current.pause()
      }
      setIsMuted(true)
      dialogueAudioManager.setMuted(true)
    }
  }

  const cursorStyle = `
    @media (pointer: fine) and (min-width: 1024px) {
      *, body, html {
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M2 2 L9 23 L14 17 L25 28 L28 25 L17 14 L23 9 Z" fill="%230A0A0A" stroke="%23D4AF37" stroke-width="1.8" stroke-linejoin="round"/><path d="M2 2 L14 14" stroke="%23D4AF37" stroke-width="1.5"/><circle cx="14" cy="14" r="1.8" fill="%23D4AF37"/><circle cx="2" cy="2" r="1.5" fill="%23FFFFFF"/></svg>') 2 2, crosshair !important;
      }
      button, a, input, textarea, select, canvas, [role="button"], [role="tab"], .cursor-pointer {
        cursor: pointer !important;
      }
    }
  `

  return (
    <div className="w-full bg-[#050505] text-neutral-100 font-sans select-none relative">
      <style>{cursorStyle}</style>
      <audio ref={audioRef} src="/ambient_audio.mp3" preload="auto" loop muted={isMuted} />

      {!activeProject && <InteractivePenTool />}
      {!activeProject && <WittyStickyNote />}

      <RedesignedHeaderMenu
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        onNavigateSection={handleNavigateSection}
      />

      {/* ── 1. SCENE 1 (PINNED HERO - ATELIER DE DESIGN) ───────────────────────── */}
      <ScrubVideoSection 
        sectionId="scene-1"
        videoSrc="/scene_1_maya_v2.mp4"
        dialogueSrc="/scene_1_dialogue.mp3"
        isHero={true}
        data-witty-index={0}
        overlay={
          <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-between p-6 sm:p-8 md:p-16">
            {/* Center-Left: High-Impact Editorial Lockup */}
            <div className="w-full max-w-2xl pointer-events-auto my-auto pt-16 sm:pt-12 md:pt-0">
              {/* Discipline telemetry tag */}
              <div className="hero-tag opacity-0 inline-flex items-center space-x-2.5 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs sm:text-sm md:text-base font-mono font-semibold tracking-widest uppercase mb-4 sm:mb-6 shadow-[0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <span>GRAPHIC DESIGNER</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-serif tracking-normal leading-[1.02] sm:leading-[0.95] mb-4 sm:mb-5 font-normal text-white overflow-hidden">
                <span className="hero-line-1 opacity-0 inline-block tracking-wider">NAIYA</span> <br/>
                <span className="hero-line-2 opacity-0 italic font-normal text-amber-300 relative inline-block mt-1 tracking-wider">
                  DHRUV
                </span>
              </h1>

              <div className="hero-gold-rule opacity-0 w-24 sm:w-32 h-[1.5px] bg-gradient-to-r from-amber-400 via-amber-300 to-transparent mb-4 sm:mb-5 shadow-[0_0_12px_rgba(245,158,11,0.6)]" />

              <p className="hero-manifesto opacity-0 text-xs sm:text-sm md:text-base text-neutral-200 font-light leading-relaxed max-w-md">
                There's more — Dive into my space of <DoodleHighlight type="underline" delay={0.9}>selected work</DoodleHighlight> and experiments I couldn’t leave alone.
              </p>
            </div>

            {/* Bottom Right Animated Action Indicator */}
            <div className="w-full flex items-end justify-end pointer-events-auto pb-4">
              <div className="hero-scroll-cue opacity-0 flex items-center space-x-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 text-[8px] sm:text-[9px] font-mono tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Mouse className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 animate-bounce" />
                <span>SCROLL DOWN TO EXPLORE</span>
              </div>
            </div>
          </div>
        }
      />

      {/* ── 2. WORK SECTION (UNPINNED - 2026 THREE.JS 3D SHOWCASE) ───────────────────────── */}
      <div id="work-section" data-witty-index={1} className="witty-section stack-section relative w-full bg-[#030303] z-40 border-t border-white/5 rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] gallery-panel-wrapper overflow-hidden">
        <ArchitecturalGrid />
        <FloatingDoodles count={3} />
        
        <div className="relative z-10 pointer-events-auto w-full py-4">
          <ThreeWorkShowcase onSelectProject={(project) => setActiveProject(project)} />
        </div>
      </div>

      {/* ── 3. SCENE 2 (PINNED) - DESIGN METHODOLOGY ────────────── */}
      <ScrubVideoSection 
        sectionId="scene-2"
        videoSrc="/scene_2_maya_v2.mp4"
        dialogueSrc="/scene_2_dialogue.mp3"
        roundedTop={true}
        data-witty-index={2}
        overlay={
          <div className="absolute inset-0 z-50 p-6 md:p-12 lg:p-14 pointer-events-none flex flex-col justify-between">
            <TactileSpatialGeometryHUD />
          </div>
        }
      />

      {/* ── 3.5 ABOUT SECTION (UNPINNED - THE DESIGNER & CRAFT ARCHITECTURE) ───────────────────────── */}
      <div 
        id="about-section" 
        data-witty-index={3} 
        className="witty-section stack-section relative w-full"
      >
        <AboutSection onContactClick={() => handleNavigateSection('contact')} />
      </div>

      {/* ── 4. SCENE 3 (PINNED) - SOLUTIONS IN MOTION ───────────────────────── */}
      <ScrubVideoSection 
        sectionId="scene-3"
        videoSrc="/scene_3_maya_upscale.mp4"
        dialogueSrc="/scene_3_dialogue.mp3"
        roundedTop={true}
        data-witty-index={4}
        overlay={
          <div className="absolute inset-0 z-50 p-6 sm:p-8 md:p-12 lg:p-14 pointer-events-none flex flex-col justify-between">
            <div className="w-full max-w-sm sm:max-w-md md:w-[460px] pointer-events-none pt-12 sm:pt-14 md:pt-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif text-white font-light mb-3 sm:mb-4 leading-snug">
                Visual systems built for the real world — <br/>
                <span className="italic text-amber-300">from retail shelves to boardrooms.</span>
              </h2>
            </div>

            {/* Bottom Right Contextual Animated Action Indicator */}
            <div className="w-full flex justify-end pointer-events-auto pb-4">
              <div className="flex items-center space-x-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 text-[8px] sm:text-[9px] font-mono tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 animate-pulse" />
                <span>SCROLL TO EXPLORE WORK</span>
              </div>
            </div>
          </div>
        }
      />

      {/* ── 5. TESTIMONIALS (UNPINNED - LUMINOUS VOICES CHAMBER - DIRECTLY BELOW VIDEO 3) ───────────────────────── */}
      <div 
        id="testimonials-section"
        data-witty-index={5} 
        className="witty-section stack-section relative w-full bg-[#09090d] z-40 border-t border-amber-500/30 rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-25px_60px_rgba(212,175,55,0.08)] overflow-hidden py-14 sm:py-16 md:py-20"
      >
        <ArchitecturalGrid />

        {/* Radiant Ambient Illumination Pools */}
        <div className="ambient-glow-pool absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[450px] bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-600/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="ambient-glow-pool absolute -top-24 left-1/3 w-80 h-80 bg-amber-300/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-4 pb-8 sm:pb-10 text-center pointer-events-none">
          {/* Top Architectural Telemetry Pill */}
          <div className="section-glide-text inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase mb-4 sm:mb-5 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>COLLABORATOR &amp; PEER FEEDBACK</span>
          </div>

          <h2 className="section-glide-text text-3xl sm:text-4xl md:text-6xl font-serif text-white font-normal tracking-normal mb-3 sm:mb-4">
            <DoodleHighlight type="circle" className="px-4 sm:px-6 py-1.5 sm:py-2">Trusted by peers &amp; teams.</DoodleHighlight>
          </h2>

          <p className="section-glide-text text-sm md:text-base text-neutral-200 font-light max-w-lg mx-auto leading-relaxed">
            Feedback from team collaborators, design peers, and brand partners on our packaging, branding, and pitch deck execution.
          </p>
        </div>

        {/* Continuous Marquee Track - Always visible and illuminated without disappearing */}
        <div className="relative z-10 w-full overflow-hidden flex pointer-events-none py-3 sm:py-6 mb-4 sm:mb-8">
          {/* Edge Fog Gradients to gracefully feather the marquee */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-36 bg-gradient-to-r from-[#09090d] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-36 bg-gradient-to-l from-[#09090d] to-transparent z-20 pointer-events-none" />

          <div className="marquee-track flex space-x-4 sm:space-x-8 px-3 sm:px-6 w-max pointer-events-auto">
            {[1, 2].map((group) => (
              <div key={group} className="flex space-x-4 sm:space-x-8 shrink-0">
                {TESTIMONIALS.map((t, i) => (
                  <div 
                    key={`${group}-${t.id || i}`} 
                    className="testimonial-card w-[260px] sm:w-[320px] md:w-[440px] bg-gradient-to-b from-[#181820]/95 via-[#131318]/95 to-[#0e0e12]/98 border border-amber-500/25 rounded-2xl p-4 sm:p-6 md:p-8 shrink-0 flex flex-col justify-between hover:border-amber-400/60 hover:shadow-[0_15px_45px_rgba(212,175,55,0.22)] hover:-translate-y-1.5 transition-all duration-500 shadow-xl backdrop-blur-xl relative overflow-hidden group"
                    style={{ perspective: '600px' }}
                  >
                    {/* Glowing Top Amber Accent Line */}
                    <div className="absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                        <div className="flex items-center space-x-0.5 sm:space-x-1 text-amber-400 text-xs">
                          {Array.from({ length: t.rating || 5 }).map((_, rIdx) => (
                            <Star key={rIdx} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[7.5px] sm:text-[9px] font-mono text-amber-300 font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                          {t.tag || 'VERIFIED FEEDBACK'}
                        </span>
                      </div>
                      <p className="text-neutral-100 font-serif text-xs sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-6 italic group-hover:text-white transition-colors">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="text-[11px] sm:text-xs font-mono text-amber-300 uppercase tracking-widest font-semibold">
                            {t.author}
                          </span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-mono text-neutral-400 ml-3 mt-0.5">
                          {t.role} · <span className="text-neutral-300 font-medium">{t.company}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-[8px] sm:text-[9px] font-mono text-amber-400/90 tracking-wider bg-amber-500/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-amber-500/20">
                        <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                        <span>VERIFIED</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. SCENE 4 (PINNED) - SKILL SET & CLOSE ─────────── */}
      <ScrubVideoSection 
        sectionId="scene-4"
        videoSrc="/scene_4_maya_v2.mp4"
        dialogueSrc="/scene_4_dialogue.mp3"
        roundedTop={true}
        data-witty-index={6}
        overlay={
          <div className="absolute inset-0 z-50 p-6 sm:p-8 md:p-12 lg:p-14 pointer-events-none flex flex-col justify-between">
            {/* Center Content Row: Tools of the Trade on left, Close Headline on right */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 my-auto pt-8 md:pt-0 pointer-events-none">
              {/* LEFT: GSAP ANIMATED SKILL ICONS (Tools of the Trade) */}
              <InteractiveSkillIcons />

              {/* RIGHT: THE CLOSE HEADLINE */}
              <div className="w-full max-w-sm md:w-[380px] text-left md:text-right pointer-events-auto self-start md:self-center">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif text-white font-normal tracking-normal leading-tight">
                  Design that communicates. <br/>
                  <span className="italic text-amber-300">Crafted with purpose.</span>
                </h2>
              </div>
            </div>

            {/* Bottom Right Contextual Animated Action Indicator (Matches Scene 1 & Scene 3 unified format) */}
            <div className="w-full flex justify-end pointer-events-auto pb-4">
              <div className="flex items-center space-x-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 text-[8px] sm:text-[9px] font-mono tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Mouse className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 animate-bounce" />
                <span>SCROLL DOWN TO GET IN TOUCH</span>
              </div>
            </div>
          </div>
        }
      />

      {/* ── 7. CONTACT (UNPINNED - THE DRAFTING DESK) ───────────────────────── */}
      <div id="contact-section" data-witty-index={7} className="witty-section stack-section relative w-full bg-[#030303] z-50 border-t border-white/5 rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] contact-panel-wrapper overflow-hidden">
        <ArchitecturalGrid />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-900/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-16 pt-12 sm:pt-14 md:pt-18 pb-12 sm:pb-14 md:pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            
            <div className="relative">
               <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-normal text-white mb-4 sm:mb-6 leading-[1.1] contact-reveal opacity-0 translate-y-8">
                 Let's build something <br/>
                 <span className="italic text-amber-300 relative inline-block">
                   memorable.
                 </span>
               </h2>
               <p className="text-neutral-400 text-xs sm:text-sm max-w-md font-light leading-relaxed contact-reveal opacity-0 translate-y-8">
                 Available for brand identity systems, retail packaging, investor pitch decks, and commercial print collateral. Have a project in mind? Let's connect.
               </p>
            </div>
            
            {/* RIGHT SIDE: EDITORIAL LIST VIEW */}
            <div className="flex flex-col justify-center space-y-6 lg:pl-6">
              {/* ITEM 1: EMAIL & MESSAGE */}
              <div className="contact-reveal opacity-0 translate-y-8 group border-b border-white/10 pb-6">
                <a 
                  href="mailto:dhruvnaiya@gmail.com" 
                  className="flex items-center justify-between group/link py-1"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover/link:bg-amber-400/20 group-hover/link:scale-105 transition-all">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 font-sans block">
                        Write a message or just say hi,
                      </span>
                      <span className="text-base md:text-lg font-mono tracking-wider font-medium text-amber-400 group-hover/link:text-amber-300 transition-colors block mt-0.5">
                        dhruvnaiya@gmail.com
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover/link:text-amber-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                </a>
              </div>

              {/* ITEM 2: LINKEDIN */}
              <div className="contact-reveal opacity-0 translate-y-8 group border-b border-white/10 pb-6">
                <a 
                  href="https://www.linkedin.com/in/naiya-dhruv-b040bb210" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-between group/link py-1"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 group-hover/link:border-amber-400/30 group-hover/link:text-amber-400 group-hover/link:scale-105 transition-all">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block font-sans">
                        Connect &amp; Endorsements
                      </span>
                      <span className="text-base md:text-lg font-sans font-medium text-neutral-200 group-hover/link:text-white transition-colors">
                        LinkedIn / Naiya Dhruv
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover/link:text-amber-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      <ColophonFooter onScrollToTop={handleScrollToTop} />

      {activeProject && (
        <CaseStudyModal
          project={activeProject}
          onClose={() => {
            setActiveProject(null)
            // Smoothly scroll back to the Work section of the website
            setTimeout(() => {
              const workEl = document.getElementById('work-section')
              if (workEl) {
                const lenis = (window as any).__lenis
                if (lenis) {
                  lenis.scrollTo(workEl, { offset: 0, duration: 1.2 })
                } else {
                  workEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }
            }, 60)
          }}
        />
      )}
    </div>
  )
}
