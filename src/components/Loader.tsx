import { useEffect, useState } from 'react'
import { LogoGold } from './LogoGold'

type LoaderProps = {
  onDone: () => void
}

/** Chapter 0 — quiet seal with 100% transparent vector gold logo. */
export function Loader({ onDone }: LoaderProps) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const tHold = window.setTimeout(() => setPhase('hold'), 520)
    const tOut = window.setTimeout(() => setPhase('out'), 2400)
    const tDone = window.setTimeout(onDone, 3100)
    return () => {
      window.clearTimeout(tHold)
      window.clearTimeout(tOut)
      window.clearTimeout(tDone)
    }
  }, [onDone])

  return (
    <div
      className={`site-loader ${phase === 'out' ? 'is-out' : ''} ${phase === 'hold' ? 'is-hold' : ''}`}
      aria-hidden={phase === 'out'}
      role="status"
      aria-label="Loading Naiya Dhruv"
    >
      <div className="site-loader__seal">
        <div className="site-loader__logo-wrap">
          <LogoGold size={112} className="site-loader__logo" />
        </div>
        <p className="site-loader__name">Naiya Dhruv</p>
      </div>
    </div>
  )
}
