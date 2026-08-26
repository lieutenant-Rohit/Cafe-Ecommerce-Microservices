'use client';
import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

export type NumberTickerProps = {
  value: number
  className?: string
  decimalPlaces?: number
  prefix?: string
  suffix?: string
  duration?: number
}

export function NumberTicker({
  value,
  className,
  decimalPlaces = 0,
  prefix = '',
  suffix = '',
  duration = 1.8,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -48px 0px' })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration, bounce: 0 })

  useEffect(() => {
    if (inView) motionValue.set(value)
  }, [inView, value, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimalPlaces)}${suffix}`
      }
    })
    return () => unsubscribe()
  }, [springValue, decimalPlaces, prefix, suffix])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      0
    </span>
  )
}
