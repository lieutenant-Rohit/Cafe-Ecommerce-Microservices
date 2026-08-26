'use client';
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, type MotionProps } from 'motion/react'
import { cn } from '@/lib/utils'

export type WordRotateProps = {
  words: string[]
  duration?: number
  framerProps?: MotionProps
  className?: string
}

export function WordRotate({
  words,
  duration = 2600,
  framerProps,
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, duration)

    return () => clearInterval(interval)
  }, [words, duration])

  return (
    <span className="inline-flex overflow-hidden py-0.5 align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          className={cn('inline-block', className)}
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          {...framerProps}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
