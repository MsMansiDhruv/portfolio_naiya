import { useEffect, useState, type MouseEvent } from 'react'
import { SCROLL_EVENT, scrollToId } from './SmoothScroll'

const CHAPTERS = [
  {
    id: 'top',
    beat: 'Wonder',
    cue: 'Stay with her in the sky',
    next: 'Open the work bento',
    href: '#top',
  },
  {
    id: 'work',
    beat: 'Proof',
    cue: 'Hover pins — open a case',
    next: 'Meet the designer',
    href: '#work',
  },
  {
    id: 'about',
    beat: 'Trust',
    cue: 'Intention + toolkit',
    next: 'See the method',
    href: '#about',
  },
  {
    id: 'method',
    beat: 'Method',
    cue: 'What you hire',
    next: 'See the making-of',
    href: '#method',
  },
  {
    id: 'explorations',
    beat: 'Taste',
    cue: 'Process materials',
    next: 'Leave the brief',
    href: '#explorations',
  },
  {
    id: 'contact',
    beat: 'Desire',
    cue: 'Type the weird part',
    next: "Send — she's listening",
    href: '#contact',
  },
] as const

function nearestChapter() {
  let best = 0
  let bestScore = Infinity
  for (let i = 0; i < CHAPTERS.length; i++) {
    const el = document.getElementById(CHAPTERS[i].id)
    if (!el) continue
    const dist = Math.abs(
      el.getBoundingClientRect().top - window.innerHeight * 0.32,
    )
    if (dist < bestScore) {
      bestScore = dist
      best = i
    }
  }
  const hero = document.getElementById('hero-scroll')
  if (hero) {
    const hr = hero.getBoundingClientRect()
    if (
      hr.bottom > window.innerHeight * 0.5 &&
      hr.top < window.innerHeight * 0.25
    ) {
      const progress = Math.min(
        Math.max(-hr.top, 0) /
          Math.max(hero.offsetHeight - window.innerHeight, 1),
        1,
      )
      return progress > 0.55 ? 1 : 0
    }
  }
  return best
}

function pageProgress() {
  const max = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    1,
  )
  return Math.min(Math.max(window.scrollY / max, 0), 1)
}

/** Hire-arc companion — chapter controller (Lenis advances on click). */
export function StoryGuide() {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      setIndex(nearestChapter())
      setProgress(pageProgress())
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener(SCROLL_EVENT, update)
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener(SCROLL_EVENT, update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const chapter = CHAPTERS[index]
  const next = CHAPTERS[Math.min(index + 1, CHAPTERS.length - 1)]

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault()
    const id = href.replace('#', '')
    scrollToId(id)
  }

  return (
    <aside className="story-guide" aria-label="Story chapters">
      <div className="story-guide__glass liquid-glass-panel">
        <p className="story-guide__beat">
          <span className="story-guide__index">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="story-guide__name">{chapter.beat}</span>
        </p>
        <p className="story-guide__cue">{chapter.cue}</p>
        <div
          className="story-guide__meter"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Page progress"
        >
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
        <ol className="story-guide__dots">
          {CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <a
                href={c.href}
                className={`story-guide__dot${i === index ? ' is-active' : ''}${i < index ? ' is-done' : ''}`}
                aria-label={`${c.beat}: ${c.cue}`}
                aria-current={i === index ? 'step' : undefined}
                onClick={go(c.href)}
              />
            </li>
          ))}
        </ol>
        {index < CHAPTERS.length - 1 ? (
          <a
            href={next.href}
            className="story-guide__next"
            onClick={go(next.href)}
          >
            <span>{next.beat}</span>
            <em>{chapter.next}</em>
          </a>
        ) : (
          <a
            href="#contact"
            className="story-guide__next story-guide__next--final"
            onClick={go('#contact')}
          >
            <span>Send</span>
            <em>{chapter.next}</em>
          </a>
        )}
      </div>
    </aside>
  )
}
