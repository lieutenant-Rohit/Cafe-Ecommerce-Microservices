import { motion } from 'motion/react'

interface OrbitingElement {
  icon: React.ReactNode
  label?: string
  color?: string
}

interface OrbitingElementsProps {
  elements: OrbitingElement[]
  radius?: number
  duration?: number
  className?: string
}

export default function OrbitingElements({
  elements,
  radius = 140,
  duration = 20,
  className = '',
}: OrbitingElementsProps) {
  return (
    <div className={`relative ${className}`} style={{ width: radius * 2 + 80, height: radius * 2 + 80 }}>
      {elements.map((el, i) => {
        const angle = (360 / elements.length) * i
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{ width: 0, height: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <motion.div
              className="absolute"
              style={{
                left: Math.cos((angle * Math.PI) / 180) * radius,
                top: Math.sin((angle * Math.PI) / 180) * radius,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ rotate: -360 }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl backdrop-blur-md border shadow-lg ${
                  el.color || 'bg-white/80 border-cream-200'
                }`}
              >
                {el.icon}
                {el.label && (
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-coffee-600 whitespace-nowrap">
                    {el.label}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
