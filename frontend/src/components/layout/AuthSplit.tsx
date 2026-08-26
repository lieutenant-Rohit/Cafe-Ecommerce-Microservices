import type { ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Croissant, Coffee, Star } from 'lucide-react'
import { Badge } from '../ui/badge'
import { TextEffect } from '../motion-primitives/text-effect'
import { InView } from '../motion-primitives/in-view'
import Parallax from '../ui/parallax'
import BlobMesh from '../ui/blob-mesh'
import Grain from '../ui/grain'
import { useCafeStatus } from '@/hooks/useCafeStatus'

interface AuthSplitProps {
  variant: 'login' | 'register'
  headlineLine1: string
  headlineLine2: string
  sub: string
  children: ReactNode
  footer: ReactNode
}

const steam = [
  { top: '12%', right: '14%', delay: 0, dur: 4 },
  { top: '24%', right: '8%', delay: 1.4, dur: 5 },
  { top: '8%', right: '26%', delay: 0.8, dur: 4.5 },
]

export default function AuthSplit({
  variant,
  headlineLine1,
  headlineLine2,
  sub,
  children,
  footer,
}: AuthSplitProps) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 18 })
  const sy = useSpring(my, { stiffness: 50, damping: 18 })
  const copyX = useTransform(sx, (v) => v * -12)
  const copyY = useTransform(sy, (v) => v * -8)
  const photoX = useTransform(sx, (v) => v * 10)
  const photoY = useTransform(sy, (v) => v * 7)

  const { isOpen, statusText, hoursToday } = useCafeStatus()

  function handleMouseMove(e: React.MouseEvent) {
    mx.set((e.clientX / window.innerWidth - 0.5) * 2)
    my.set((e.clientY / window.innerHeight - 0.5) * 2)
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-[92svh] bg-cream-50" onMouseMove={handleMouseMove}>
      {/* Left — copy + form */}
      <div className="relative overflow-hidden flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-24 py-14 lg:py-16">
        <BlobMesh variant="warm" blend="multiply" className="opacity-50" />
        <Grain opacity={0.05} className="z-[40]" />
        <motion.div style={{ x: copyX, y: copyY }} className="relative z-10 max-w-xl w-full mx-auto lg:mx-0">
          <InView
            once
            viewOptions={{ margin: '-60px' }}
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Badge className="bg-accent-50 text-accent-700 border-accent-200/70 gap-1.5 px-3.5 py-1 text-[12px] md:text-[13px] uppercase tracking-wide">
              <Croissant className="w-3.5 h-3.5" />
              {variant === 'login' ? 'Member area — one batch a day' : 'The Morning List'}
            </Badge>

            <h1 className="mt-6 font-display text-coffee-900 text-[2.6rem] leading-[1.06] tracking-tight sm:text-6xl">
              <span className="block">
                <TextEffect per="word" preset="fade-in-blur" as="span" speedReveal={0.8} speedSegment={0.5}>
                  {headlineLine1}
                </TextEffect>
              </span>
              <span className="block italic font-light bg-gradient-to-r from-[#A94E2C] via-[#C2643A] to-[#D37E58] bg-clip-text text-transparent">
                <TextEffect per="word" preset="fade-in-blur" as="span" delay={0.4} speedReveal={0.8} speedSegment={0.5}>
                  {headlineLine2}
                </TextEffect>
              </span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-coffee-500/90 leading-relaxed max-w-xl">{sub}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-y-6 gap-x-6 pt-8 border-t border-cream-300">
              <div className="flex items-center gap-2 text-sm text-coffee-500/90">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-70 ${isOpen ? 'bg-accent-500' : 'bg-coffee-400'}`}
                  />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-accent-500' : 'bg-coffee-400'}`} />
                </span>
                {statusText}
                <span className="hidden sm:block w-px h-4 bg-cream-300" />
                <span className="hidden sm:block">{hoursToday}</span>
              </div>
              <div className="text-sm">{footer}</div>
            </div>
          </InView>
        </motion.div>
      </div>

      {/* Right — photo collage */}
      <div className="relative hidden lg:flex items-center justify-center px-8 xl:px-16 py-16">
        <motion.div style={{ x: photoX, y: photoY }} className="relative w-full max-w-[540px] h-[560px] xl:h-[620px]">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-br from-primary-100 via-cream-200 to-accent-100 rotate-[3deg]"
          />
          <Parallax from={0} to={60} className="absolute inset-0">
            <div className="group relative h-full w-full overflow-hidden rounded-[3.5rem] border-4 border-cream-50 shadow-[0_30px_80px_rgba(42,22,14,0.28)]">
              <img
                src={variant === 'register' ? '/images/products/blueberry-muffin.jpg' : '/images/products/cappuccino.jpg'}
                alt={variant === 'register' ? 'Blueberry muffin, still warm' : 'Cappuccino with latte art'}
                className="h-full w-full object-cover scale-[1.12] group-hover:scale-[1.18] transition-transform duration-[1200ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-coffee-950/55 via-transparent to-transparent" />
              <div className="absolute top-0 inset-x-0 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-cream-200/85">
                  {variant === 'register' ? 'Straight out at 5 a.m.' : 'Steamed to 60°C'}
                </p>
                <p className="font-display text-2xl text-cream-50 mt-1 max-w-[80%]">
                  {variant === 'register' ? 'Muffin, still warm from the oven' : 'Your usual — cappuccino'}
                </p>
              </div>
              {steam.map((s) => (
                <span
                  key={s.top}
                  className="absolute w-1.5 h-10 rounded-full bg-cream-100/70 blur-[2px] animate-[steamDrift_4s_ease-in-out_infinite]"
                  style={{ top: s.top, right: s.right, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
                />
              ))}
            </div>
          </Parallax>

          <div className="absolute -left-10 -top-6 animate-float" style={{ animationDuration: '9s' }}>
            <div className="bg-cream-50/95 backdrop-blur rounded-2xl px-4 py-3 shadow-lg border border-cream-200">
              <p className="text-[11px] uppercase tracking-wider text-coffee-400 font-medium">Today&apos;s batch</p>
              <p className="font-display text-lg text-coffee-900 font-semibold mt-0.5">12 rolls left</p>
            </div>
          </div>
          <div className="absolute -right-4 top-1/3 animate-float" style={{ animationDuration: '11s' }}>
            <div className="bg-primary-600 text-cream-50 rounded-2xl px-4 py-3 shadow-lg shadow-primary-600/30">
              <p className="font-display text-lg font-semibold">$4.25</p>
              <p className="text-[11px] text-cream-100/80">fresh &amp; warm</p>
            </div>
          </div>
          <div className="absolute -left-10 bottom-24 animate-float" style={{ animationDuration: '10s' }}>
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur rounded-full pl-2 pr-4 py-1.5 shadow-lg border border-cream-200">
              <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
              <p className="text-sm font-medium text-coffee-800">4.9 &middot; 300+ regulars</p>
            </div>
          </div>

          <div className="absolute -bottom-10 -left-12 w-44 h-44 overflow-hidden rounded-[2rem] border-4 border-cream-50 shadow-xl rotate-[-6deg] animate-float" style={{ animationDuration: '13s', animationDelay: '1.2s' }}>
            <img
              src={variant === 'register' ? '/images/products/scone.jpg' : '/images/products/matcha-latte.jpg'}
              alt={variant === 'register' ? 'Butter scone' : 'Matcha latte'}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-8 -right-6 z-10">
            <div className="relative w-24 h-24 animate-float" style={{ animationDuration: '12s', animationDelay: '0.6s' }}>
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite]" aria-hidden="true">
                <defs>
                  <path id="loginCirclePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text fill="#6F4E37" fontSize="8.5" letterSpacing="2.6" className="uppercase">
                  <textPath href="#loginCirclePath">One batch a day &middot; fresh every morning &middot; </textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-primary-600 text-cream-50 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg shadow-primary-600/30">
                  <Coffee className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>

          <Coffee
            aria-hidden="true"
            className="absolute -left-16 top-1/2 w-4 h-4 text-primary-400/80 animate-float"
            style={{ animationDuration: '8s' }}
          />
          <Croissant
            aria-hidden="true"
            className="absolute -right-12 top-1/4 w-4 h-4 text-coffee-400/70 animate-float"
            style={{ animationDuration: '10s', animationDelay: '1.5s' }}
          />
          <span
            aria-hidden="true"
            className="absolute left-[58%] -top-7 w-2 h-2 rounded-full bg-accent-500/80 shadow-[0_0_10px_rgba(59,130,104,0.8)] animate-float"
            style={{ animationDuration: '7s', animationDelay: '0.8s' }}
          />
          <span
            aria-hidden="true"
            className="absolute -right-6 bottom-1/4 w-2.5 h-2.5 rounded-full bg-primary-400/70 shadow-[0_0_10px_rgba(211,126,88,0.8)] animate-float"
            style={{ animationDuration: '9s', animationDelay: '2s' }}
          />
        </motion.div>
      </div>
    </div>
  )
}
