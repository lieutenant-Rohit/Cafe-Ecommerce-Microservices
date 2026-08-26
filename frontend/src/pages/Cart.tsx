import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import { placeOrder } from '../api/orderApi'
import Reveal from '../components/ui/reveal'

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [ordering, setOrdering] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleCheckout() {
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
    } catch {
      setError('Failed to place order. Please try again.')
    } finally {
      setOrdering(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Reveal>
          <div className="bg-cream-50 rounded-3xl border border-cream-200 p-8 shadow-[0_12px_40px_rgba(42,22,14,0.08)]">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-semibold text-coffee-900 mb-2">Order Placed!</h2>
            <p className="text-coffee-500 mb-6">Your order has been submitted successfully.</p>
            <Link
              to="/my-orders"
              className="inline-block bg-primary-600 hover:bg-primary-500 text-cream-50 px-6 py-2 rounded-full font-medium transition-colors"
            >
              View My Orders
            </Link>
          </div>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Reveal>
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-coffee-900 mb-8">Shopping Cart</h1>
      </Reveal>

      {items.length === 0 ? (
        <Reveal>
          <div className="bg-cream-50 rounded-3xl border border-cream-200 p-12 text-center">
            <p className="text-coffee-500 text-lg mb-4">Your cart is empty.</p>
            <Link
              to="/menu"
              className="inline-block bg-primary-600 hover:bg-primary-500 text-cream-50 px-6 py-2 rounded-full font-medium transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </Reveal>
      ) : (
        <>
          <div className="bg-white rounded-3xl border border-cream-200 divide-y divide-cream-100 overflow-hidden">
            {items.map((item, i) => (
              <Reveal key={item.product.id} delay={i * 0.05}>
                <div className="flex items-center gap-4 p-4 sm:p-6">
                  <div className="w-16 h-16 rounded-xl bg-cream-100 overflow-hidden shrink-0">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cream-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary-600 font-medium">{item.product.category.name}</p>
                    <h3 className="text-lg font-semibold text-coffee-900 truncate">{item.product.name}</h3>
                    <p className="text-xl font-bold text-coffee-900 mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-cream-300 flex items-center justify-center text-coffee-600 hover:bg-cream-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium text-coffee-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-cream-300 flex items-center justify-center text-coffee-600 hover:bg-cream-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-coffee-300 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-6 bg-cream-50 rounded-3xl border border-cream-200 p-6">
              <div className="flex justify-between items-center text-xl font-bold text-coffee-900 mb-4">
                <span>Total</span>
                <span>${totalAmount().toFixed(2)}</span>
              </div>
              {!isAuthenticated && (
                <p className="text-sm text-coffee-500 mb-3">You'll need to log in to place your order.</p>
              )}
              {error && (
                <p className="text-sm text-red-600 mb-3">{error}</p>
              )}
              <button
                onClick={handleCheckout}
                disabled={ordering}
                className="w-full bg-primary-600 hover:bg-primary-500 text-cream-50 py-3 rounded-full font-semibold disabled:bg-cream-300 disabled:text-coffee-400 disabled:cursor-not-allowed transition-colors"
              >
                {ordering ? 'Placing order...' : 'Place Order'}
              </button>
            </div>
          </Reveal>
        </>
      )}
    </div>
  )
}

