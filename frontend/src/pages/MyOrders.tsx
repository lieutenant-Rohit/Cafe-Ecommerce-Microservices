import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Clock, CheckCircle2, XCircle, Package, CreditCard, Coffee, Truck } from 'lucide-react'
import type { Order } from '../types'
import { fetchMyOrders } from '../api/orderApi'
import Reveal from '../components/ui/reveal'
import { BorderTrail } from '../components/motion-primitives/border-trail'

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Coffee; label: string }> = {
  CREATED: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Coffee, label: 'Order Placed' },
  PAYMENT_PENDING: { color: 'text-amber-600', bg: 'bg-amber-50', icon: CreditCard, label: 'Payment Pending' },
  PAYMENT_COMPLETED: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2, label: 'Payment Done' },
  CONFIRMED: { color: 'text-primary-600', bg: 'bg-primary-50', icon: Package, label: 'Confirmed' },
  CANCELLED: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'Cancelled' },
}

const allStatuses = ['CREATED', 'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'CONFIRMED']

function StatusStepper({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full">
        <XCircle className="w-4 h-4 text-red-500" />
        <span className="text-xs font-medium text-red-600">Cancelled</span>
      </div>
    )
  }

  const currentIdx = allStatuses.indexOf(status)

  return (
    <div className="flex items-center gap-1">
      {allStatuses.map((s, i) => {
        const isCompleted = i <= currentIdx && currentIdx >= 0
        const isCurrent = i === currentIdx
        return (
          <div key={s} className="flex items-center gap-1">
            <motion.div
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isCompleted ? 'bg-primary-500' : 'bg-cream-300'
              }`}
              initial={false}
              animate={isCurrent ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {i < allStatuses.length - 1 && (
              <div className={`w-4 h-0.5 ${isCompleted && i < currentIdx ? 'bg-primary-400' : 'bg-cream-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const config = statusConfig[order.status] || statusConfig.CREATED
  const Icon = config.icon
  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Reveal delay={index * 0.06}>
      <div className="relative bg-white rounded-2xl border border-cream-200 overflow-hidden hover:shadow-lg hover:shadow-primary-900/5 transition-all duration-300 group">
        <BorderTrail
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          radius={16}
          size={1.5}
          color="rgba(169,78,44,0.25)"
        />

        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-5 flex items-center gap-4 text-left"
        >
          {/* Status icon */}
          <div className={`w-11 h-11 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>

          {/* Order info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-coffee-900">Order #{order.id}</span>
              <StatusStepper status={order.status} />
            </div>
            <div className="flex items-center gap-3 text-xs text-coffee-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Total + expand */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-lg font-bold text-coffee-900">₹{total.toFixed(0)}</span>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center"
            >
              <ChevronDown className="w-4 h-4 text-coffee-500" />
            </motion.div>
          </div>
        </button>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 border-t border-cream-100">
                {/* Status timeline */}
                <div className="py-4">
                  <div className="flex items-center justify-between">
                    {allStatuses.map((s, i) => {
                      const cfg = statusConfig[s]
                      const isActive = allStatuses.indexOf(order.status) >= i
                      return (
                        <div key={s} className="flex flex-col items-center gap-1.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isActive ? `${cfg.bg} ${cfg.color}` : 'bg-cream-100 text-coffee-300'
                          }`}>
                            <cfg.icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-medium ${isActive ? cfg.color : 'text-coffee-300'}`}>
                            {cfg.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1 bg-cream-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          ((allStatuses.indexOf(order.status) + 1) / allStatuses.length) * 100,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Items list */}
                <div className="space-y-2 pt-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-cream-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center">
                          <Coffee className="w-4 h-4 text-coffee-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-coffee-900">Product #{item.productId}</p>
                          <p className="text-xs text-coffee-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-coffee-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-3 pt-3 border-t border-cream-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-coffee-500">Order Total</span>
                  <span className="text-xl font-bold text-coffee-900">₹{total.toFixed(0)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
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
        <div className="flex items-center gap-3 mb-2">
          <Truck className="w-5 h-5 text-primary-600" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-600">Order History</p>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-coffee-900">My Orders</h1>
        <p className="mt-2 text-coffee-500">Track and manage your recent orders.</p>
      </Reveal>

      {loading ? (
        <div className="space-y-4 mt-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-cream-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-cream-100 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-cream-200 rounded w-32 animate-pulse" />
                  <div className="h-3 bg-cream-100 rounded w-48 animate-pulse" />
                </div>
                <div className="h-6 bg-cream-200 rounded w-20 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6 text-coffee-400" />
          </div>
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
            className="bg-primary-600 text-cream-50 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary-500 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <Reveal>
          <div className="bg-cream-50 rounded-3xl border border-cream-200 p-16 text-center mt-8">
            <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Package className="w-8 h-8 text-coffee-300" />
            </div>
            <p className="text-coffee-500 text-lg mb-2">No orders yet</p>
            <p className="text-sm text-coffee-400 mb-6">Your order history will appear here.</p>
            <a
              href="/menu"
              className="inline-block bg-primary-600 hover:bg-primary-500 text-cream-50 px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-primary-600/20"
            >
              Browse Menu
            </a>
          </div>
        </Reveal>
      ) : (
        <div className="space-y-3 mt-8">
          {orders.map((order, i) => (
            <OrderCard key={order.id} order={order} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

