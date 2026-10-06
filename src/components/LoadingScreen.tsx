import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onDone: () => void
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setFadeOut(true)
          setTimeout(() => {
            onDone()
          }, 600)
          return 100
        }
        return prev + 4
      })
    }, 25)

    return () => clearInterval(timer)
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between p-8 sm:p-12 bg-[#f7f4ee] text-[#0a0a0a] transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between font-mono text-xs tracking-widest uppercase">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0038ff] animate-ping" />
          SYSTEM INIT ✦ EDITORIAL MESH
        </span>
        <span>NAIYA DHRUV — 2026</span>
      </div>

      {/* Center Logo/Title */}
      <div className="my-auto flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          {/* Crop marks framing logo */}
          <span className="absolute -top-4 -left-4 w-3 h-3 border-t-2 border-l-2 border-[#0a0a0a]" />
          <span className="absolute -top-4 -right-4 w-3 h-3 border-t-2 border-r-2 border-[#0a0a0a]" />
          <span className="absolute -bottom-4 -left-4 w-3 h-3 border-b-2 border-l-2 border-[#0a0a0a]" />
          <span className="absolute -bottom-4 -right-4 w-3 h-3 border-b-2 border-r-2 border-[#0a0a0a]" />
          <h1 className="font-mono text-5xl sm:text-7xl font-extrabold tracking-tighter text-[#0a0a0a]">
            N / D
          </h1>
        </div>
        <p className="font-mono text-xs tracking-widest text-[#4a4a4a] uppercase">
          01 — GRAPHIC LAYOUT SYSTEM
        </p>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-md mx-auto flex flex-col gap-2">
        <div className="flex justify-between font-mono text-xs tracking-widest">
          <span>COMPILING MESH</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1 bg-[#0a0a0a]/10 relative overflow-hidden rounded-full">
          <div
            className="h-full bg-[#0038ff] transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
