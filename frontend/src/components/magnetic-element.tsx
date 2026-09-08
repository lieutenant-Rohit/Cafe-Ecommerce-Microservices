import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

interface MagneticElementProps {
  children: React.ReactNode
  strength?: number
  className?: string
  as?: 'div' | 'button' | 'a' | 'span'
}

export default function MagneticElement({
  children,
  strength = 0.3,
  className = '',
  as: Tag = 'div',
}: MagneticElementProps) {
  const ref = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { damping: 15, stiffness: 200 })
  const springY = useSpring(y, { damping: 15, stiffness: 200 })

  const rotateX = useSpring(useTransform(y, [-50, 50], [5, -5]), { damping: 15, stiffness: 200 })
  const rotateY = useSpring(useTransform(x, [-50, 50], [-5, 5]), { damping: 15, stiffness: 200 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  const MotionTag = motion[Tag as keyof typeof motion] as typeof motion.div

  return (
    <MotionTag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`inline-block ${className}`}
      style={{ x: springX, y: springY, rotateX, rotateY, perspective: 800 }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </MotionTag>
  )
}

