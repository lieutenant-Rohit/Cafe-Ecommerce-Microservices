import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, PartyPopper } from 'lucide-react'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import { placeOrder } from '../api/orderApi'
import Reveal from '../components/ui/reveal'
import { Spotlight } from '../components/motion-primitives/spotlight'
import { BorderTrail } from '../components/motion-primitives/border-trail'
import { Magnetic } from '../components/motion-primitives/magnetic'
import { ConfettiCanvas, useConfetti } from '../components/confetti'

function QuantityButton({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.85 }}
      className="w-9 h-9 rounded-full border border-cream-300 flex items-center justify-center text-coffee-600 hover:bg-cream-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </motion.button>
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
      setError('Failed to place order. Please try again.')
    } finally {
      setOrdering(false)
    }
  }, [isAuthenticated, navigate, clearCart, fire])

  if (success) {
    return (
      <>
        <ConfettiCanvas canvasRef={confettiRef} />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="bg-cream-50 rounded-3xl border border-cream-200 p-10 shadow-[0_12px_40px_rgba(42,22,14,0.08)] relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-100 rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-60" />
            </div>

            <div className="relative">
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-500/30"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
                >
                  <PartyPopper className="w-9 h-9 text-white" />
                </motion.div>
              </motion.div>

              {/* Confetti burst text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 mb-3"
              >
                <div className="w-8 h-px bg-primary-300" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary-600 font-semibold">Success</span>
                <div className="w-8 h-px bg-primary-300" />
              </motion.div>

              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-display font-semibold text-coffee-900 mb-2"
              >
                Order Placed!
              </motion.h2>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-coffee-500 mb-8 max-w-sm mx-auto"
              >
                Your order has been submitted and is being prepared with care.
              </motion.p>

              {/* Order receipt-like card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl border border-cream-200 p-5 mb-6 text-left"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                  <span className="text-xs font-medium text-accent-600">Processing your order</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-coffee-500">
                    <span>Estimated preparation</span>
                    <span className="font-medium text-coffee-900">15-20 min</span>
                  </div>
                  <div className="flex justify-between text-coffee-500">
                    <span>Status</span>
                    <span className="font-medium text-blue-600">Created</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <Link
                  to="/my-orders"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-cream-50 px-7 py-3 rounded-full font-medium transition-colors shadow-lg shadow-primary-600/20"
                >
                  View My Orders
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 text-coffee-600 hover:text-coffee-900 text-sm font-medium transition-colors"
                >
                  Continue browsing
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Reveal>
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="w-5 h-5 text-primary-600" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-600">Your Cart</p>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-coffee-900">Shopping Cart</h1>
        {items.length > 0 && (
          <p className="mt-2 text-coffee-500">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        )}
      </Reveal>

      {items.length === 0 ? (
        <Reveal>
          <div className="bg-cream-50 rounded-3xl border border-cream-200 p-16 text-center mt-8">
            <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-8 h-8 text-coffee-300" />
            </div>
            <p className="text-coffee-500 text-lg mb-2">Your cart is empty</p>
            <p className="text-sm text-coffee-400 mb-6">Add some items from our menu to get started.</p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-cream-50 px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-primary-600/20"
            >
              Browse Menu
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="mt-8">
          {/* Cart items */}
          <div className="bg-white rounded-3xl border border-cream-200 divide-y divide-cream-100 overflow-hidden">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="flex items-center gap-4 p-4 sm:p-6 group">
                    {/* Product image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-cream-100 overflow-hidden shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cream-300">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-600">
                        {item.product.category.name}
                      </p>
                      <h3 className="text-base sm:text-lg font-semibold text-coffee-900 truncate mt-0.5">
                        {item.product.name}
                      </h3>
                      <p className="text-lg sm:text-xl font-bold text-coffee-900 mt-1">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <QuantityButton
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </QuantityButton>
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={item.quantity}
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 8, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="w-8 text-center font-semibold text-coffee-900"
                        >
                          {item.quantity}
                        </motion.span>
                      </AnimatePresence>
                      <QuantityButton
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </QuantityButton>
                    </div>

                    {/* Remove button */}
                    <motion.button
                      onClick={() => removeItem(item.product.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-coffee-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <Reveal delay={0.1}>
            <div className="mt-6 bg-white rounded-3xl border border-cream-200 p-6">
              <div className="flex justify-between items-center text-xl font-bold text-coffee-900 mb-2">
                <span>Subtotal</span>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={totalAmount().toFixed(2)}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    ${totalAmount().toFixed(2)}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="text-xs text-coffee-400 mb-6">Tax calculated at checkout</p>

              {!isAuthenticated && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
                  You&apos;ll need to log in to place your order.
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

              <Magnetic intensity={0.3} range={80}>
                <div className="relative">
                  <BorderTrail radius={999} size={2} color="rgba(169,78,44,0.5)" />
                  <Spotlight size={160} />
                  <motion.button
                    onClick={handleCheckout}
                    disabled={ordering}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-primary-600 hover:bg-primary-500 text-cream-50 py-3.5 rounded-full font-semibold disabled:bg-cream-300 disabled:text-coffee-400 disabled:cursor-not-allowed transition-colors relative flex items-center justify-center gap-2"
                  >
                    {ordering ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block w-4 h-4 border-2 border-cream-50 border-t-transparent rounded-full"
                        />
                        Placing order...
                      </>
                    ) : (
                      <>
                        Place Order
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      )}
    </div>
  )
}
