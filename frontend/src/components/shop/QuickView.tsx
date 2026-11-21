import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import type { Product } from '@/types'
import useCartStore from '@/store/cartStore'
import { flyToCart } from '@/lib/effects'
import { cn } from '@/lib/utils'
import { productImageTone, productTone } from './ProductCard'

const categoryNotes: Record<string, string> = {
  Coffee: 'Pulled to order on our house blend. Ask for it iced, oat, or extra hot.',
  Tea: 'Steeped fresh, never held in a urn. A quiet cup for a slow morning.',
  Pastries: 'Laminated in house, baked before sunrise, and best while still warm.',
  Desserts: 'Layered the night before and finished just before service.',
  Breakfast: 'Made to order between 6 and 11.30 a.m. No shortcuts, no heat lamps.',
  Sandwiches: 'Pressed hot on sourdough, cut on the diagonal, served with a little salad.',
  'Smoothies & Juices': 'Blended or pressed to order. Fruit, ice, nothing from a carton.',
}

interface QuickViewProps {
  product: Product | null
  onClose: () => void
  toneIndex?: number
}

export default function QuickView({ product, onClose, toneIndex = 0 }: QuickViewProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setQuantity(1)
    setAdded(false)
  }, [product])

  useEffect(() => {
    if (!product) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [product, onClose])

  async function handleAdd(event: React.MouseEvent<HTMLButtonElement>) {
    if (!product) return
    flyToCart(event.currentTarget.getBoundingClientRect(), product.imageUrl)
    await addItem(product, quantity)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[90] grid place-items-center bg-coffee-950/55 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border-[3px] border-coffee-900 bg-cream-50 shadow-[0_18px_0_rgba(58,10,44,0.18)] md:grid-cols-2"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border-2 border-coffee-800 bg-white text-coffee-900 transition-colors hover:bg-blush-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className={cn('relative m-3 overflow-hidden rounded-[24px]', productTone(toneIndex))}>
              <div className={cn('h-full min-h-[280px] overflow-hidden rounded-[24px]', productImageTone(toneIndex))}>
                {product.imageUrl ? (
                  <motion.img
                    key={product.id}
                    src={product.imageUrl}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.035 }}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full min-h-[280px] place-items-center text-6xl">☕</div>
                )}
              </div>
              <span className="absolute left-4 top-4 rounded-full border-2 border-coffee-800 bg-lemon-400 px-3 py-1 font-display text-xs font-bold shadow-[2px_2px_0_#3a0a2c]">
                {product.category?.name ?? 'Cafe pick'}
              </span>
            </div>

            <div className="flex flex-col gap-4 p-6 pt-16 md:p-8 md:pt-14">
              <div>
                <p className="cafe-kicker">Fresh from the counter</p>
                <h3 className="mt-2 font-display text-3xl font-semibold leading-tight text-coffee-900">
                  {product.name}
                </h3>
                <div className="mt-3 flex items-center gap-3">
                  <span className="font-display text-3xl font-semibold text-primary-600">
                    ₹{product.price.toFixed(0)}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-bold',
                      product.stockQuantity > 0
                        ? 'bg-accent-100 text-accent-800'
                        : 'bg-blush-200 text-coffee-700',
                    )}
                  >
                    {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Sold out today'}
                  </span>
                </div>
              </div>

              <p className="text-[15px] leading-relaxed text-coffee-500">
                {categoryNotes[product.category?.name] ??
                  'Made fresh in our kitchen on Rajpur Road. Order ahead and pick it up at the counter.'}
              </p>

              <div className="rounded-2xl border-2 border-dashed border-coffee-800/20 bg-white/60 p-3.5 text-sm text-coffee-500">
                <p className="font-semibold text-coffee-800">Good to know</p>
                <p className="mt-1">
                  Free delivery over ₹499 · Collection from 42, Rajpur Road · Fresh batch every morning
                </p>
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 rounded-full border-2 border-coffee-800/15 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="grid h-8 w-8 place-items-center rounded-full text-coffee-700 transition-colors hover:bg-blush-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <motion.span
                    key={quantity}
                    initial={{ scale: 0.6, y: -2 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="w-5 text-center font-bold"
                  >
                    {quantity}
                  </motion.span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="grid h-8 w-8 place-items-center rounded-full text-coffee-700 transition-colors hover:bg-blush-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={product.stockQuantity <= 0}
                  className={cn('cafe-btn flex-1 whitespace-nowrap px-4 text-sm', added && 'cafe-btn-mint')}
                >
                  {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                  {added ? 'Added to your order' : `Add to order · ₹${(product.price * quantity).toFixed(0)}`}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
