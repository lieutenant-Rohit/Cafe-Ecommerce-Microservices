import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'reveal' | 'exit'>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 400)
    const t2 = setTimeout(() => setPhase('exit'), 1800)
    const t3 = setTimeout(onComplete, 2400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-coffee-950 overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Background grain */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }} />

          {/* Animated blob */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, #A94E2C 0%, transparent 70%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 0.3, 0.2] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Brand name */}
          <div className="relative z-10 text-center">
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.h1
                className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-cream-50 tracking-tight"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                Bloom
                <span className="text-primary-500">s</span>
                <span className="font-light italic">Cafe</span>
              </motion.h1>
            </motion.div>

            <motion.div
              className="mt-4 flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <div className="w-8 h-px bg-cream-200/30" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-cream-200/60 font-medium">
                est. 2019
              </p>
              <div className="w-8 h-px bg-cream-200/30" />
            </motion.div>

            {/* Loading dots */}
            <motion.div
              className="mt-8 flex items-center justify-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1 h-1 rounded-full bg-primary-500"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          </div>

          {/* Corner accents */}
          <motion.div
            className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-cream-200/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-cream-200/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />

          {/* Rotating text */}
          <motion.div
            className="absolute top-8 right-8 hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <path id="splashCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text fill="rgba(251,247,238,0.3)" fontSize="7.5" letterSpacing="2">
                  <textPath href="#splashCircle">fresh every morning · one batch a day · </textPath>
                </text>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
