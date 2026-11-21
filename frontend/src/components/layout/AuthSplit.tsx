import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Clock, Coffee, Croissant, MapPin, Sparkles, Star } from 'lucide-react'
import { useCafeStatus } from '@/hooks/useCafeStatus'

interface AuthSplitProps {
  variant: 'login' | 'register'
  headlineLine1: string
  headlineLine2: string
  sub: string
  children: ReactNode
  footer: ReactNode
}

const copy = {
  login: {
    badge: 'Member area',
    eyebrow: 'Your usual is waiting',
    image: '/images/products/cappuccino.jpg',
    imageAlt: 'Cappuccino with latte art',
    smallImage: '/images/products/croissant.jpg',
    smallAlt: 'Butter croissant',
    sticker: 'Welcome\nback',
    quote: 'Steamed to sixty degrees, every single time.',
    stat: '4.9 · 300+ regulars',
  },
  register: {
    badge: 'The Morning List',
    eyebrow: 'First pick of the batch',
    image: '/images/products/blueberry-muffin.jpg',
    imageAlt: 'Blueberry muffin still warm',
    smallImage: '/images/products/scone.jpg',
    smallAlt: 'Butter scone',
    sticker: 'Join\nthe list',
    quote: 'Straight out of the oven at five in the morning.',
    stat: 'Batch alerts before they sell out',
  },
}

export default function AuthSplit({
  variant,
  headlineLine1,
  headlineLine2,
  sub,
  children,
  footer,
}: AuthSplitProps) {
  const { isOpen, statusText, hoursToday } = useCafeStatus()
  const content = copy[variant]

  return (
    <div className="relative overflow-hidden bg-cream-50">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-50" aria-hidden="true" />
      <div className="shell relative grid min-h-[calc(100svh-8rem)] items-stretch gap-8 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-14">
        {/* Left — copy + form */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center"
        >
          <div className="mx-auto w-full max-w-lg lg:mx-0">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-coffee-900 bg-lemon-300 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-coffee-900 shadow-[3px_3px_0_#3a0a2c]">
              {variant === 'login' ? <Coffee className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
              {content.badge}
            </span>

            <h1 className="mt-6 font-display text-[clamp(2.5rem,5.4vw,4rem)] font-semibold leading-[1.02] tracking-tight text-coffee-900">
              {headlineLine1}
              <br />
              <span className="text-primary-600">{headlineLine2}</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-coffee-500 sm:text-base">{sub}</p>

            <div className="mt-8 rounded-[28px] border-[3px] border-coffee-900 bg-white p-5 shadow-[0_10px_0_rgba(58,10,44,0.12)] sm:p-7">
              {children}
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-coffee-500">
                <span className="relative flex h-2 w-2">
                  {isOpen && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-70" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${isOpen ? 'bg-accent-500' : 'bg-coffee-300'}`}
                  />
                </span>
                {statusText}
              </div>
              <div className="text-sm text-coffee-500">{footer}</div>
            </div>
          </div>
        </motion.div>

        {/* Right — visual collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden min-h-[600px] overflow-hidden rounded-[36px] border-[3px] border-coffee-900 bg-[#FFE6F4] p-6 shadow-[0_14px_0_rgba(58,10,44,0.14)] lg:block"
        >
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-lemon-300/70 blur-2xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-accent-300/60 blur-3xl" aria-hidden="true" />

          <div className="relative flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-coffee-900 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[2px_2px_0_#3a0a2c]">
              <MapPin className="h-3.5 w-3.5 text-primary-500" />
              Rajpur Road
            </span>
            <span className="flex items-center gap-1 rounded-full bg-coffee-900 px-3 py-1.5 text-[10px] font-bold text-cream-50">
              <Star className="h-3 w-3 fill-lemon-400 text-lemon-400" />
              4.9
            </span>
          </div>

          <p className="relative mt-7 max-w-[16rem] font-display text-xl font-semibold leading-snug text-coffee-800">
            {content.eyebrow}, <span className="text-primary-600">before the queue.</span>
          </p>

          <div className="relative mx-auto mt-6 h-[360px] w-full max-w-[420px]">
            <motion.div
              initial={{ rotate: -8, y: 16 }}
              animate={{ rotate: -6, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="absolute left-0 top-6 w-[72%] rounded-[26px] border-[3px] border-coffee-900 bg-white p-2.5 shadow-[0_10px_0_rgba(58,10,44,0.14)]"
            >
              <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-2" aria-hidden="true" />
              <img
                src={content.image}
                alt={content.imageAlt}
                className="aspect-[4/5] w-full rounded-[18px] object-cover"
              />
              <div className="flex items-center justify-between px-1 pb-0.5 pt-2.5">
                <span className="font-display text-sm font-semibold text-coffee-900">
                  {variant === 'login' ? 'Your usual' : 'Still warm'}
                </span>
                <span className="rounded-full bg-lemon-300 px-2 py-0.5 text-[10px] font-bold text-coffee-900">
                  {variant === 'login' ? '60°C' : '5 a.m.'}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ rotate: 8, y: 20 }}
              animate={{ rotate: 5, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42 }}
              className="absolute bottom-0 right-0 w-[52%] rounded-[24px] border-[3px] border-coffee-900 bg-white p-2 shadow-[0_9px_0_rgba(58,10,44,0.14)]"
            >
              <img
                src={content.smallImage}
                alt={content.smallAlt}
                className="aspect-square w-full rounded-[17px] object-cover"
              />
              <p className="px-1 py-1.5 text-center font-display text-[11px] font-semibold text-coffee-800">
                {variant === 'login' ? 'Goes well with coffee' : 'One batch a day'}
              </p>
            </motion.div>

            <span className="sticker absolute left-[58%] top-0 h-20 w-20 rotate-6 border-2 border-coffee-900 bg-accent-400 text-[10px] text-accent-900">
              {content.sticker.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </div>

          <div className="relative mt-auto rounded-2xl border-[3px] border-coffee-900 bg-white/85 px-4 py-3 backdrop-blur">
            <p className="flex items-center gap-2 font-display text-sm font-semibold text-coffee-900">
              <Coffee className="h-4 w-4 text-primary-500" />
              “{content.quote}”
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-coffee-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent-600" />
                {hoursToday}
              </span>
              <span className="flex items-center gap-1 text-primary-600">
                <Croissant className="h-3.5 w-3.5" />
                {content.stat}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
