import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
} from 'lucide-react'
import useCartStore from '@/store/cartStore'
import useAuthStore from '@/store/authStore'
import { placeOrder } from '@/api/orderApi'
import { ConfettiCanvas, useConfetti } from '@/components/confetti'
import { cn } from '@/lib/utils'

function QuantityButton({
  onClick,
  children,
  disabled,
  label,
}: {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-full border-2 border-coffee-900/15 bg-white text-coffee-700 transition-colors hover:border-coffee-900/30 hover:bg-blush-100 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  )
}

export default function Cart() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const totalAmount = useCartStore((s) => s.totalAmount)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [ordering, setOrdering] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const confettiRef = useRef<HTMLCanvasElement>(null)
  const { fire } = useConfetti(confettiRef)

  const total = totalAmount()
  const deliveryGap = Math.max(0, 499 - total)

  const handleCheckout = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setOrdering(true)
    setError('')
    try {
      await placeOrder()
      setSuccess(true)
      clearCart()
      setTimeout(() => fire(), 300)
    } catch {
      setError('We could not place that order. Please try again in a moment.')
    } finally {
      setOrdering(false)
    }
  }, [isAuthenticated, navigate, clearCart, fire])

  if (success) {
    return (
      <>
        <ConfettiCanvas canvasRef={confettiRef} />
        <div className="mx-auto max-w-2xl px-4 py-14 sm:py-20">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 190, damping: 18 }}
            className="relative overflow-hidden rounded-[32px] border-[3px] border-coffee-900 bg-white p-8 text-center shadow-[0_14px_0_rgba(58,10,44,0.14)] sm:p-12"
          >
            <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" aria-hidden="true" />
            <div className="relative">
              <span className="sticker mx-auto h-20 w-20 rotate-6 border-2 border-coffee-900 bg-accent-400 text-[11px] text-accent-900">
                Order
                <br />
                in!
              </span>

              <p className="cafe-kicker mt-6 justify-center">Sent to the counter</p>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-coffee-900 sm:text-5xl">
                We&apos;re on it.
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-coffee-500">
                Your order is being packed fresh. We will have it ready in about 15–20 minutes — or send
                it your way if you chose delivery.
              </p>

              <div className="mt-7 rounded-2xl border-2 border-dashed border-coffee-900/20 bg-cream-50 p-5 text-left">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent-500" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent-700">
                    Being prepared
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-coffee-500">Estimated time</span>
                    <span className="font-bold text-coffee-900">15–20 min</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-coffee-500">Collection</span>
                    <span className="font-bold text-coffee-900">42, Rajpur Road</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/my-orders" className="cafe-btn">
                  Track your order
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/menu" className="cafe-btn cafe-btn-outline">
                  Keep browsing
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-[70vh] bg-cream-50">
      <section className="border-b-2 border-coffee-900/10 bg-[#FFF1E7]">
        <div className="shell py-10 sm:py-12">
          <p className="cafe-kicker">Your bag</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-display text-[clamp(2.4rem,6vw,3.8rem)] font-semibold leading-none text-coffee-900">
              Almost <span className="text-primary-600">yours.</span>
            </h1>
            <p className="max-w-xs text-sm text-coffee-500">
              {items.length > 0
                ? `${items.reduce((sum, item) => sum + item.quantity, 0)} item${items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? '' : 's'}, packed fresh and ready in 15–20 minutes.`
                : 'A bag this empty is a morning waiting to happen.'}
            </p>
          </div>
        </div>
      </section>

      <div className="shell py-10 sm:py-12">
        {items.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-[32px] border-[3px] border-dashed border-coffee-900/25 bg-white/60 p-10 text-center sm:p-14">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border-[3px] border-coffee-900 bg-blush-100 text-primary-600">
              <ShoppingBag className="h-8 w-8" />
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold text-coffee-900">Nothing in the bag.</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-coffee-500">
              Start with a flat white and a warm croissant. We will pack both like they matter, because
              they do.
            </p>
            <Link to="/menu" className="cafe-btn mt-7">
              Browse the menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
            {/* Items */}
            <div className="rounded-[28px] border-[3px] border-coffee-900 bg-white shadow-[0_10px_0_rgba(58,10,44,0.12)]">
              <div className="flex items-center justify-between border-b-2 border-dashed border-coffee-900/15 px-5 py-4 sm:px-6">
                <h2 className="font-display text-xl font-semibold text-coffee-900">In the bag</h2>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-600 hover:text-primary-700"
                >
                  Add more
                  <Plus className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y-2 divide-dashed divide-coffee-900/10">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-3.5 p-4 sm:gap-4 sm:p-5">
                        <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl border-2 border-coffee-900/10 bg-blush-100 sm:h-20 sm:w-20">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-2xl">☕</div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-coffee-400">
                            {item.product.category.name}
                          </p>
                          <h3 className="mt-0.5 truncate font-display text-lg font-semibold text-coffee-900">
                            {item.product.name}
                          </h3>
                          <p className="mt-0.5 text-sm font-semibold text-coffee-400">
                            ₹{item.product.price.toFixed(0)} each
                          </p>

                          <div className="mt-2.5 flex items-center gap-2">
                            <QuantityButton
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              label={`Decrease ${item.product.name}`}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </QuantityButton>
                            <span className="w-6 text-center text-sm font-bold text-coffee-900">{item.quantity}</span>
                            <QuantityButton
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              label={`Increase ${item.product.name}`}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </QuantityButton>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end justify-between gap-3">
                          <span className="font-display text-lg font-semibold text-coffee-900">
                            ₹{(item.product.price * item.quantity).toFixed(0)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id)}
                            aria-label={`Remove ${item.product.name}`}
                            className="grid h-8 w-8 place-items-center rounded-full text-coffee-300 transition-colors hover:bg-blush-100 hover:text-primary-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2.5 px-5 py-4 text-xs font-semibold text-coffee-400 sm:px-6">
                <ShieldCheck className="h-4 w-4 text-accent-600" />
                Nothing is charged until the counter confirms your order.
              </div>
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-28">
              <div className="rounded-[28px] border-[3px] border-coffee-900 bg-[#FFF0A8] p-5 shadow-[0_10px_0_rgba(58,10,44,0.14)] sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-coffee-600">Order summary</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-coffee-900">Ready when you are.</h2>

                <div className="mt-5 space-y-2.5 border-t-2 border-dashed border-coffee-900/20 pt-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold text-coffee-600">Subtotal</span>
                    <span className="font-bold text-coffee-900">₹{total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold text-coffee-600">Delivery</span>
                    <span className="font-bold text-coffee-900">
                      {total >= 499 ? 'Free' : 'Calculated at checkout'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold text-coffee-600">Tax</span>
                    <span className="text-xs font-bold text-coffee-500">Included</span>
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between border-t-2 border-dashed border-coffee-900/20 pt-4">
                  <span className="font-display text-lg font-semibold text-coffee-900">Total</span>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={total}
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 6, opacity: 0 }}
                      className="font-display text-3xl font-semibold text-coffee-900"
                    >
                      ₹{total.toFixed(0)}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="mt-4 rounded-xl border-2 border-dashed border-coffee-900/20 bg-white/50 px-3.5 py-3">
                  {deliveryGap > 0 ? (
                    <p className="flex items-start gap-2 text-xs font-semibold text-coffee-700">
                      <Truck className="mt-0.5 h-4 w-4 shrink-0" />
                      Add ₹{deliveryGap.toFixed(0)} more for free delivery around Dehradun.
                    </p>
                  ) : (
                    <p className="flex items-start gap-2 text-xs font-semibold text-accent-800">
                      <Truck className="mt-0.5 h-4 w-4 shrink-0" />
                      Free delivery unlocked. Nice one.
                    </p>
                  )}
                </div>

                {!isAuthenticated && (
                  <div className="mt-4 rounded-xl border-2 border-coffee-900/15 bg-white/70 px-3.5 py-2.5 text-xs font-semibold text-coffee-600">
                    You will need to sign in before placing this order.
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="mt-4 rounded-xl border-2 border-primary-300 bg-blush-100 px-3.5 py-2.5 text-xs font-semibold text-primary-800"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={ordering}
                  className="cafe-btn cafe-btn-dark mt-5 w-full text-base"
                >
                  {ordering ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream-50 border-t-transparent" />
                      Placing your order…
                    </>
                  ) : isAuthenticated ? (
                    <>
                      Place order
                      <ArrowRight className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Sign in to order
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-coffee-600">
                  <span className="flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5" />
                    Pickup from 6 a.m.
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    Fresh, not held
                  </span>
                </div>
              </div>

              <p className="mt-4 text-center text-xs font-semibold text-coffee-400">
                Questions? Call{' '}
                <a href="tel:+911352650127" className="text-primary-600 hover:underline">
                  +91 135 265 0127
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
