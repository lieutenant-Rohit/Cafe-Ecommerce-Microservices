import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import useCartStore from '@/store/cartStore'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const total = useCartStore((s) => s.totalAmount())
  const count = useCartStore((s) => s.totalItems())

  useEffect(() => {
    if (!open) return
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
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-coffee-950/50 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            exit={{ x: '105%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed inset-y-0 right-0 z-[71] flex w-[min(420px,94vw)] flex-col border-l-[3px] border-coffee-900 bg-cream-50 shadow-[-18px_0_50px_rgba(58,10,44,0.18)]"
            aria-label="Your cart"
          >
            <div className="flex items-center justify-between border-b-2 border-dashed border-coffee-900/15 px-5 py-5">
              <div>
                <p className="cafe-kicker">Your bag</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-coffee-900">
                  {count > 0 ? `${count} item${count === 1 ? '' : 's'}` : 'Nothing yet'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-coffee-900/15 bg-white text-coffee-800 transition-colors hover:bg-blush-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-blush-100 text-primary-600">
                  <ShoppingBag className="h-8 w-8" />
                </span>
                <h4 className="mt-5 font-display text-2xl font-semibold">Your bag is empty</h4>
                <p className="mt-2 text-sm leading-relaxed text-coffee-500">
                  Start with a flat white and a warm croissant. We will pack it fresh.
                </p>
                <Link to="/menu" onClick={onClose} className="cafe-btn mt-6">
                  Browse the menu
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-2" data-lenis-prevent>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 26 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 36 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                      className="flex items-center gap-3 border-b-2 border-dashed border-coffee-900/10 py-4"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-coffee-900/10 bg-blush-100">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-xl">☕</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-base font-semibold">{item.product.name}</p>
                        <p className="text-xs text-coffee-400">₹{item.product.price.toFixed(0)} each</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="grid h-7 w-7 place-items-center rounded-full border border-coffee-900/15 bg-white disabled:opacity-40"
                            aria-label={`Decrease ${item.product.name}`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="grid h-7 w-7 place-items-center rounded-full border border-coffee-900/15 bg-white"
                            aria-label={`Increase ${item.product.name}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-display text-base font-semibold">
                          ₹{(item.product.price * item.quantity).toFixed(0)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="text-coffee-300 transition-colors hover:text-primary-600"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t-2 border-dashed border-coffee-900/15 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-coffee-500">Subtotal</span>
                    <span className="font-display text-2xl font-semibold">₹{total.toFixed(0)}</span>
                  </div>
                  <p className="mt-1 text-xs text-coffee-400">
                    {total >= 499 ? 'Free delivery unlocked.' : `₹${(499 - total).toFixed(0)} away from free delivery.`}
                  </p>
                  <Link to="/cart" onClick={onClose} className="cafe-btn mt-4 w-full">
                    Go to checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full text-center text-sm font-semibold text-coffee-500 hover:text-coffee-900"
                  >
                    Keep browsing
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
