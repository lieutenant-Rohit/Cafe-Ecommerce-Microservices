'use client';
import { motion, type Transition } from 'motion/react'
import { cn } from '@/lib/utils'

export type BorderTrailProps = {
  className?: string
  radius?: number
  size?: number
  color?: string
  transition?: Transition
  id?: string
}

export function BorderTrail({
  className,
  radius = 24,
  size = 2,
  color = 'rgba(169,78,44,0.75)',
  transition = { duration: 2.4, ease: 'easeInOut' },
  id = 'border-trail-gradient',
}: BorderTrailProps) {
  return (
    <motion.svg
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-visible', className)}
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="50%" stopColor="transparent" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <motion.rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx={radius}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={size}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ ...transition, repeat: Infinity, repeatType: 'loop' }}
        style={{ willChange: 'stroke-dashoffset' }}
      />
    </motion.svg>
  )
}
