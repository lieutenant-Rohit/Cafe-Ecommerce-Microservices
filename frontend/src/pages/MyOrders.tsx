import { useEffect, useState } from 'react'
import type { Order } from '../types'
import { fetchMyOrders } from '../api/orderApi'
import Reveal from '../components/ui/reveal'
import { Badge } from '../components/ui/badge'

const statusColors: Record<string, string> = {
  CREATED: 'bg-blue-100 text-blue-700',
  PAYMENT_PENDING: 'bg-yellow-100 text-yellow-700',
  PAYMENT_COMPLETED: 'bg-green-100 text-green-700',
  CONFIRMED: 'bg-accent-100 text-accent-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Reveal>
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-coffee-900 mb-8">My Orders</h1>
      </Reveal>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-cream-200 p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-5 bg-cream-200 rounded w-32" />
                <div className="h-5 bg-cream-200 rounded w-20" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-cream-200 rounded w-3/4" />
                <div className="h-4 bg-cream-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-coffee-500 mb-4">Failed to load orders.</p>
          <button
            onClick={() => {
              setLoading(true)
              setError(false)
              fetchMyOrders()
                .then(setOrders)
                .catch(() => setError(true))
                .finally(() => setLoading(false))
            }}
            className="bg-primary-600 text-cream-50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <Reveal>
          <div className="bg-cream-50 rounded-3xl border border-cream-200 p-12 text-center">
            <p className="text-coffee-500 text-lg mb-4">You haven't placed any orders yet.</p>
            <a
              href="/menu"
              className="inline-block bg-primary-600 hover:bg-primary-500 text-cream-50 px-6 py-2 rounded-full font-medium transition-colors"
            >
              Browse Menu
            </a>
          </div>
        </Reveal>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <Reveal key={order.id} delay={i * 0.05}>
              <div className="bg-white rounded-2xl border border-cream-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm text-coffee-400">Order #{order.id}</p>
                    <p className="text-sm text-coffee-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Badge className={statusColors[order.status] || 'bg-cream-100 text-coffee-600'}>
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="divide-y divide-cream-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 text-sm">
                      <span className="text-coffee-600">
                        Product #{item.productId} x{item.quantity}
                      </span>
                      <span className="font-medium text-coffee-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-cream-200 flex justify-between">
                  <span className="font-semibold text-coffee-900">Total</span>
                  <span className="font-bold text-coffee-900">
                    ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

