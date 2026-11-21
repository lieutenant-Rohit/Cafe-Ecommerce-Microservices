import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Check, Plus, Sparkles } from 'lucide-react'
import type { Product } from '@/types'
import useCartStore from '@/store/cartStore'
import { flyToCart } from '@/lib/effects'
import { cn } from '@/lib/utils'

const tones = [
  'bg-[#FFE0CC]',
  'bg-[#E3F8B8]',
  'bg-[#FFD1EF]',
  'bg-[#FFF0A8]',
  'bg-[#C7F4E4]',
  'bg-[#E7DDFF]',
  'bg-[#D8EBFF]',
]

const imageTones = [
  'bg-[#FFEFE4]',
  'bg-[#F1FBE0]',
  'bg-[#FFE7F5]',
  'bg-[#FFF9DA]',
  'bg-[#E4FCF3]',
  'bg-[#F5F0FF]',
  'bg-[#EEF8FF]',
]

export function productTone(index: number) {
  return tones[index % tones.length]
}

export function productImageTone(index: number) {
  return imageTones[index % imageTones.length]
}

interface ProductCardProps {
  product: Product
  index?: number
  onQuickView?: (product: Product) => void
  className?: string
  compact?: boolean
}

export default function ProductCard({
  product,
  index = 0,
  onQuickView,
  className,
  compact = false,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function handleAdd(event: React.MouseEvent) {
    event.stopPropagation()
    flyToCart(event.currentTarget.getBoundingClientRect(), product.imageUrl)
    await addItem(product)
    setAdded(true)
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setAdded(false), 1400)
  }

  const badge =
    product.stockQuantity <= 0
      ? 'Sold out'
      : product.stockQuantity <= 5
        ? `Only ${product.stockQuantity} left`
        : index === 0
          ? 'Bestseller'
          : index === 1
            ? 'Fresh pick'
            : ''

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.055, 0.35), ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div
        className={cn(
          'group relative flex h-full flex-col rounded-[26px] border-[3px] border-coffee-800 p-3 text-coffee-900 shadow-[0_9px_0_rgba(58,10,44,0.14)] transition-all duration-300 hover:-translate-y-1.5 hover:rotate-[-0.35deg] hover:shadow-[0_15px_0_rgba(58,10,44,0.14)]',
          productTone(index),
          className,
        )}
      >
        <button
          type="button"
          onClick={() => onQuickView?.(product)}
          className="absolute inset-0 z-[1] rounded-[26px]"
          aria-label={`Quick view ${product.name}`}
        />

        <div className={cn('relative overflow-hidden rounded-[19px]', productImageTone(index))}>
          <div className={cn('relative overflow-hidden rounded-[19px]', compact ? 'aspect-[4/3]' : 'aspect-square')}>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
              />
            ) : (
              <div className="grid h-full place-items-center text-coffee-300">
                <span className="font-display text-4xl">☕</span>
              </div>
            )}
          </div>

          <span className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[19px]" aria-hidden="true">
            <span className="absolute -left-1/2 top-0 h-full w-1/3 -skew-x-12 bg-white/40 opacity-0 blur-sm transition-all duration-700 group-hover:left-[130%] group-hover:opacity-100" />
          </span>

          <div className="absolute left-2.5 top-2.5 z-[2] flex flex-col items-start gap-1.5">
            {badge && (
              <span
                className={cn(
                  'rounded-full border-2 border-coffee-800 px-2.5 py-0.5 font-display text-[11px] font-bold shadow-[2px_2px_0_#3a0a2c]',
                  product.stockQuantity <= 0
                    ? 'bg-white text-coffee-700'
                    : product.stockQuantity <= 5
                      ? 'bg-[#FFB5DB] text-coffee-900'
                      : 'bg-lemon-400 text-coffee-900',
                )}
              >
                {badge}
              </span>
            )}
          </div>

          <span className="absolute right-2.5 top-2.5 z-[2] grid h-7 w-7 place-items-center rounded-full border-2 border-coffee-800 bg-white/90 font-display text-[11px] font-bold">
            {String(index + 1).padStart(2, '0')}
          </span>

          <span className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-[2] flex translate-y-2 items-center justify-center gap-1.5 rounded-full border-2 border-coffee-800 bg-cream-50/95 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-coffee-800 opacity-0 shadow-[0_3px_0_rgba(58,10,44,0.14)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Sparkles className="h-3 w-3 text-primary-500" />
            Quick view
          </span>
        </div>

        <div className="pointer-events-none relative z-[2] flex flex-1 flex-col px-1.5 pb-1 pt-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-coffee-700/60">
            {product.category?.name ?? 'Cafe pick'}
          </p>
          <h3 className="mt-1 font-display text-[1.2rem] font-semibold leading-tight text-coffee-900">
            {product.name}
          </h3>

          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <span className="font-display text-xl font-semibold">₹{product.price.toFixed(0)}</span>
            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stockQuantity <= 0}
              className={cn(
                'pointer-events-auto relative z-[3] inline-flex min-h-9 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40',
                added ? 'bg-accent-600' : 'bg-coffee-800 hover:bg-primary-600',
              )}
            >
              {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {added ? 'Added' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
