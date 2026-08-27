import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const BLOB_PATHS = [
  'M44.5,-60.1C56.2,-51.3,62.3,-35.1,65.8,-18.3C69.3,-1.5,70.2,15.9,63.1,29.1C56.1,42.3,41.1,51.3,25.8,57.1C10.5,62.9,-5.1,65.5,-20.3,62.1C-35.5,58.7,-50.3,49.3,-58.6,36C-66.9,22.7,-68.7,5.5,-64.7,-9.6C-60.7,-24.7,-50.9,-37.7,-39.1,-46.5C-27.3,-55.3,-13.7,-59.9,1.7,-62C17.1,-64.1,32.8,-68.9,44.5,-60.1Z',
  'M39.5,-51.3C51.8,-44.2,62.6,-33.5,66.4,-20.4C70.3,-7.3,67.2,8.2,60.4,21.5C53.5,34.8,42.9,45.9,30.5,52.7C18.1,59.5,3.9,62,-11.3,60.5C-26.5,59,-42.7,53.5,-52.4,42.7C-62.1,31.9,-65.3,15.9,-63.6,0.9C-61.9,-14.1,-55.3,-28.2,-45.5,-37.5C-35.7,-46.8,-22.8,-51.3,-9.4,-53C4,-54.7,27.2,-58.4,39.5,-51.3Z',
  'M42.1,-55.7C54.8,-48.3,65,-35.8,69.1,-21.5C73.2,-7.2,71.2,8.9,64.5,22.6C57.8,36.3,46.4,47.5,33.5,54.4C20.6,61.3,6.2,63.9,-8.4,62.2C-23,60.5,-37.8,54.5,-48.1,44.3C-58.4,34.1,-64.2,19.7,-65.4,5C-66.6,-9.7,-63.2,-24.7,-54.4,-35.2C-45.6,-45.7,-31.4,-51.7,-17.7,-58C-4,-64.3,9.2,-70.9,22.4,-68.6C35.6,-66.3,29.4,-63.1,42.1,-55.7Z',
]

interface LiquidBlobProps {
  className?: string
  color?: string
  size?: number
}

export default function LiquidBlob({
  className = '',
  color = '#A94E2C',
  size = 400,
}: LiquidBlobProps) {
  const [pathIndex, setPathIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPathIndex((prev) => (prev + 1) % BLOB_PATHS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`pointer-events-none ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="-100 -100 200 200" className="w-full h-full">
        <defs>
          <filter id="liquid-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>
        <AnimatePresence mode="wait">
          <motion.path
            key={pathIndex}
            d={BLOB_PATHS[pathIndex]}
            fill={color}
            filter="url(#liquid-blur)"
            opacity={0.15}
            initial={{ d: BLOB_PATHS[(pathIndex - 1 + BLOB_PATHS.length) % BLOB_PATHS.length] }}
            animate={{ d: BLOB_PATHS[pathIndex] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      </svg>
    </div>
  )
}
