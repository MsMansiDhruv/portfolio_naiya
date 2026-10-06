import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

type AnimatedTextProps = {
  text: string
  className?: string
}

export function AnimatedText({ text, className }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const chars = Array.from(text)

  return (
    <p ref={ref} className={className} aria-label={text}>
      {chars.map((char, i) => (
        <Char
          key={`${i}-${char}`}
          char={char}
          index={i}
          total={chars.length}
          progress={scrollYProgress}
        />
      ))}
    </p>
  )
}

function Char({
  char,
  index,
  total,
  progress,
}: {
  char: string
  index: number
  total: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const start = index / total
  const end = Math.min(1, start + 1 / total)
  const opacity = useTransform(progress, [start, end], [0.45, 1])

  if (char === ' ') {
    return ' '
  }

  return (
    <span className="relative inline-block">
      <span className="invisible" aria-hidden="true">
        {char}
      </span>
      <motion.span
        className="absolute inset-0"
        style={{ opacity }}
        aria-hidden="true"
      >
        {char}
      </motion.span>
    </span>
  )
}
