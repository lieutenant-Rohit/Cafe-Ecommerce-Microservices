'use client';
import { Children, isValidElement, type ReactNode } from 'react'
import { motion, type Transition, type Variants } from 'motion/react'
import { InView } from './in-view'
import { cn } from '@/lib/utils'

export type AnimatedGroupProps = {
  children: ReactNode
  className?: string
  variants?: {
    hidden: { opacity?: number; y?: number; filter?: string; scale?: number }
    visible: { opacity?: number; y?: number; filter?: string; scale?: number }
  }
  transition?: Transition
  stagger?: number
}

const defaultVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export function AnimatedGroup({
  children,
  className,
  variants = defaultVariants,
  transition = { duration: 0.55, ease: 'easeOut' as const },
  stagger = 0.1,
}: AnimatedGroupProps) {
  const items = Children.toArray(children).filter(isValidElement)

  return (
    <InView
      once
      className={cn('contents', className)}
      viewOptions={{ margin: '-24px 0px -24px 0px' }}
      variants={{ hidden: {}, visible: {} }}
      transition={{ staggerChildren: stagger, delayChildren: 0.05 }}
    >
      {items.map((child, index) => (
        <motion.div key={index} variants={variants} transition={transition}>
          {child}
        </motion.div>
      ))}
    </InView>
  )
}
