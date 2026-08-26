import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

interface ParallaxProps {
  children: React.ReactNode
  from?: number
  to?: number
  className?: string
  style?: React.CSSProperties
}

export default function Parallax({ children, from = -50, to = 50, className, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [from, to])

  return (
    <div ref={ref} className={cn('overflow-hidden', className)} style={style}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}

