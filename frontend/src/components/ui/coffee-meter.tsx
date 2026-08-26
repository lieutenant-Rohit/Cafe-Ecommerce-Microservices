import { useScroll, useTransform } from 'motion/react'
import { motion } from 'motion/react'

export default function CoffeeMeter() {
  const { scrollYProgress } = useScroll()
  const fillHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const steamOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.55], [0, 0.8, 0])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 w-12 h-14 group"
    >
      <div className="relative w-full h-full">
        {/* Cup outline */}
        <svg viewBox="0 0 48 56" className="w-full h-full">
          <path
            d="M8 12h28v32a8 8 0 01-8 8H16a8 8 0 01-8-8V12z"
            className="fill-cream-100 stroke-coffee-300"
            strokeWidth="2"
          />
          {/* Handle */}
          <path
            d="M36 18h4a6 6 0 010 12h-4"
            className="fill-none stroke-coffee-300"
            strokeWidth="2"
          />
          {/* Fill level */}
          <clipPath id="cup-clip">
            <path d="M9 13h27v31a7 7 0 01-7 7H16a7 7 0 01-7-7V13z" />
          </clipPath>
          <motion.rect
            x="9"
            width="27"
            height="56"
            clipPath="url(#cup-clip)"
            className="fill-primary-500"
            style={{ y: fillHeight, height: '100%', transformOrigin: 'bottom' }}
          />
        </svg>
        {/* Steam */}
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1"
          style={{ opacity: steamOpacity }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-3 bg-coffee-300/60 rounded-full"
              style={{ animation: `steamUp 1.5s ease-out ${i * 0.3}s infinite` }}
            />
          ))}
        </motion.div>
      </div>
    </button>
  )
}
