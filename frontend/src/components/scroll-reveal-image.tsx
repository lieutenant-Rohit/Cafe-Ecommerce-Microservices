import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'

interface ScrollRevealImageProps {
  src: string
  alt: string
  className?: string
  direction?: 'up' | 'left' | 'right' | 'scale'
}

export default function ScrollRevealImage({
  src,
  alt,
  className = '',
  direction = 'up',
}: ScrollRevealImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.3'],
  })

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 })

  const clipInset = useTransform(smoothProgress, [0, 1], ['100% 0% 0% 0%', '0% 0% 0% 0%'])
  const clipInsetLeft = useTransform(smoothProgress, [0, 1], ['0% 100% 0% 0%', '0% 0% 0% 0%'])
  const clipInsetRight = useTransform(smoothProgress, [0, 1], ['0% 0% 0% 100%', '0% 0% 0% 0%'])
  const scale = useTransform(smoothProgress, [0, 1], [1.15, 1])

  const clipPath = {
    up: useTransform(clipInset, (v) => `inset(${v})`),
    left: useTransform(clipInsetLeft, (v) => `inset(${v})`),
    right: useTransform(clipInsetRight, (v) => `inset(${v})`),
    scale: useTransform(smoothProgress, [0, 1], ['inset(45% 45% 45% 45%)', 'inset(0% 0% 0% 0%)']),
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          clipPath: clipPath[direction],
          scale,
        }}
      />
    </div>
  )
}
