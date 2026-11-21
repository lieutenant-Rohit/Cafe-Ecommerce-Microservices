import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Coffee,
  CreditCard,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react'
import type { Order, Product } from '@/types'
import { fetchMyOrders } from '@/api/orderApi'
import { fetchProducts } from '@/api/productApi'
import { cn } from '@/lib/utils'

const statusConfig: Record<
  string,
  { chip: string; iconBg: string; iconColor: string; icon: typeof Coffee; label: string; note: string }
> = {
  CREATED: {
    chip: 'bg-[#D8EBFF] text-[#134A73]',
    iconBg: 'bg-[#D8EBFF]',
    iconColor: 'text-[#134A73]',
    icon: Coffee,
    label: 'Order placed',
    note: 'The counter has your order.',
  },
  PAYMENT_PENDING: {
    chip: 'bg-lemon-300 text-coffee-900',
    iconBg: 'bg-lemon-200',
    iconColor: 'text-coffee-800',
    icon: CreditCard,
    label: 'Payment pending',
    note: 'Waiting for the payment to land.',
  },
  PAYMENT_COMPLETED: {
    chip: 'bg-accent-100 text-accent-800',
    iconBg: 'bg-accent-100',
    iconColor: 'text-accent-700',
    icon: CheckCircle2,
    label: 'Payment done',
    note: 'Paid and heading to the kitchen.',
  },
  CONFIRMED: {
    chip: 'bg-[#C7F4E4] text-[#0A5E47]',
    iconBg: 'bg-[#C7F4E4]',
    iconColor: 'text-[#0A5E47]',
    icon: Package,
    label: 'Confirmed',
    note: 'Packed and waiting for you.',
  },
  CANCELLED: {
    chip: 'bg-[#FFD1EF] text-[#7A1A54]',
    iconBg: 'bg-[#FFD1EF]',
    iconColor: 'text-[#7A1A54]',
    icon: XCircle,
    label: 'Cancelled',
    note: 'This one did not make it to the counter.',
  },
}

const allStatuses = ['CREATED', 'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'CONFIRMED']

function StatusDots({ status }: { status: string }) {
  if (status === 'CANCELLED') return null
  const current = allStatuses.indexOf(status)
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {allStatuses.map((step, index) => (
        <span key={step} className="flex items-center gap-1">
          <span
            className={cn(
              'h-2 w-2 rounded-full transition-colors',
              index <= current ? 'bg-primary-500' : 'bg-coffee-900/15',
            )}
          />
          {index < allStatuses.length - 1 && (
            <span className={cn('h-0.5 w-3', index < current ? 'bg-primary-400' : 'bg-coffee-900/10')} />
          )}
        </span>
      ))}
    </span>
  )
}

function OrderCard({
  order,
  index,
  products,
}: {
  order: Order
  index: number
  products: Record<number, Product>
}) {
  const [expanded, setExpanded] = useState(false)
  const config = statusConfig[order.status] ?? statusConfig.CREATED
  const Icon = config.icon
  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const currentIndex = allStatuses.indexOf(order.status)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="overflow-hidden rounded-[26px] border-[3px] border-coffee-900 bg-white shadow-[0_8px_0_rgba(58,10,44,0.11)]"
    >
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3.5 p-4 text-left sm:gap-4 sm:p-5"
      >
        <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', config.iconBg)}>
          <Icon className={cn('h-5 w-5', config.iconColor)} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-display text-lg font-semibold text-coffee-900">Order #{order.id}</span>
            <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]', config.chip)}>
              {config.label}
            </span>
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-coffee-400">
            <span>
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className="text-coffee-200">•</span>
            <span>
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </span>
            <span className="hidden sm:inline">
              <StatusDots status={order.status} />
            </span>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2.5">
          <span className="font-display text-xl font-semibold text-coffee-900">₹{total.toFixed(0)}</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="grid h-8 w-8 place-items-center rounded-full bg-cream-100 text-coffee-600"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t-2 border-dashed border-coffee-900/10 px-4 pb-5 pt-4 sm:px-5">
              {order.status === 'CANCELLED' ? (
                <div className="flex items-center gap-2.5 rounded-xl bg-blush-100 px-3.5 py-3 text-sm font-semibold text-primary-800">
                  <XCircle className="h-4 w-4 shrink-0" />
                  This order was cancelled. If that was a surprise, call the cafe and we will sort it out.
                </div>
              ) : (
                <div className="rounded-2xl bg-cream-50 p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-coffee-500">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-accent-500" />
                    {config.note}
                  </p>
                  <div className="mt-4 flex items-start justify-between gap-1">
                    {allStatuses.map((step, stepIndex) => {
                      const stepConfig = statusConfig[step]
                      const active = stepIndex <= currentIndex
                      return (
                        <div key={step} className="flex flex-1 flex-col items-center gap-1.5 text-center">
                          <span
                            className={cn(
                              'grid h-8 w-8 place-items-center rounded-full border-2',
                              active
                                ? 'border-coffee-900 bg-lemon-300 text-coffee-900'
                                : 'border-coffee-900/10 bg-white text-coffee-300',
                            )}
                          >
                            <stepConfig.icon className="h-3.5 w-3.5" />
                          </span>
                          <span
                            className={cn(
                              'text-[9px] font-bold uppercase leading-tight tracking-[0.08em] sm:text-[10px]',
                              active ? 'text-coffee-800' : 'text-coffee-300',
                            )}
                          >
                            {stepConfig.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-coffee-900/10">
                    <motion.div
                      className="h-full rounded-full bg-primary-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(((currentIndex + 1) / allStatuses.length) * 100, 100)}%`,
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                {order.items.map((item) => {
                  const product = products[item.productId]
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border-2 border-coffee-900/10 bg-white px-3.5 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        {product?.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-10 w-10 shrink-0 rounded-lg border border-coffee-900/10 object-cover"
                          />
                        ) : (
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blush-100 text-primary-600">
                            <Coffee className="h-4 w-4" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-coffee-900">
                            {product?.name ?? `Cafe item #${item.productId}`}
                          </p>
                          <p className="text-[11px] font-semibold text-coffee-400">
                            {product?.category?.name ? `${product.category.name} · ` : ''}
                            Qty {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-display text-sm font-semibold text-coffee-900">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="mt-3 flex items-center justify-between border-t-2 border-dashed border-coffee-900/10 pt-3">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-coffee-400">Order total</span>
                <span className="font-display text-xl font-semibold text-coffee-900">₹{total.toFixed(0)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Record<number, Product>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    fetchProducts(0, 100)
      .then((response) => {
        setProducts(Object.fromEntries(response.content.map((product) => [product.id, product])))
      })
      .catch(() => {
        // Order history still renders with item numbers if the catalog is unavailable.
      })
  }, [])

  const itemTotal = orders.reduce(
    (sum, order) => sum + order.items.reduce((inner, item) => inner + item.quantity, 0),
    0,
  )

  return (
    <div className="min-h-[70vh] bg-cream-50">
      <section className="border-b-2 border-coffee-900/10 bg-[#E7DDFF]">
        <div className="shell py-10 sm:py-12">
          <p className="cafe-kicker cafe-kicker-dark">Order history</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[clamp(2.4rem,6vw,3.8rem)] font-semibold leading-none text-coffee-900">
                Your mornings,
                <br />
                <span className="text-primary-600">logged.</span>
              </h1>
              <p className="mt-3 max-w-md text-[15px] text-coffee-600">
                Every coffee, bake, and last-minute cinnamon roll you have ordered from the counter.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rotate-2 rounded-2xl border-[3px] border-coffee-900 bg-white px-5 py-3 shadow-[0_6px_0_rgba(58,10,44,0.14)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-coffee-400">All time</p>
                <p className="font-display text-2xl font-semibold text-coffee-900">
                  {loading ? '—' : orders.length}
                  <span className="ml-1.5 text-xs font-semibold text-coffee-400">
                    order{orders.length === 1 ? '' : 's'}
                  </span>
                </p>
              </div>
              <div className="-rotate-2 rounded-2xl border-[3px] border-coffee-900 bg-lemon-300 px-5 py-3 shadow-[0_6px_0_rgba(58,10,44,0.14)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-coffee-600">Items</p>
                <p className="font-display text-2xl font-semibold text-coffee-900">{loading ? '—' : itemTotal}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="shell py-10 sm:py-12">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[26px] border-[3px] border-coffee-900/10 bg-white p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 animate-pulse rounded-2xl bg-cream-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 animate-pulse rounded-full bg-cream-100" />
                    <div className="h-3 w-52 animate-pulse rounded-full bg-cream-100" />
                  </div>
                  <div className="h-6 w-16 animate-pulse rounded-full bg-cream-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-xl rounded-[28px] border-[3px] border-coffee-900 bg-white p-10 text-center shadow-[0_10px_0_rgba(58,10,44,0.12)]">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush-100 text-primary-600">
              <Package className="h-7 w-7" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold">We lost the receipt pile.</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-coffee-500">
              Your orders are safe — we just could not fetch them right now. Try once more.
            </p>
            <button type="button" onClick={load} className="cafe-btn mt-6">
              Try again
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-[28px] border-[3px] border-dashed border-coffee-900/25 bg-white/60 p-10 text-center sm:p-14">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border-[3px] border-coffee-900 bg-lemon-200 text-coffee-800">
              <ShoppingBag className="h-8 w-8" />
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold">No orders yet.</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-coffee-500">
              Your first flat white is one click away. We will keep a croissant warm just in case.
            </p>
            <Link to="/menu" className="cafe-btn mt-7">
              Start an order
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-coffee-900">Recent orders</h2>
              <Link
                to="/menu"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700"
              >
                Order again
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {orders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} products={products} />
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-[22px] border-[3px] border-coffee-900 bg-accent-100 px-5 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-accent-700">
                <Truck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-coffee-900">
                  Need something changed?
                </p>
                <p className="text-xs font-semibold text-coffee-600">
                  Call{' '}
                  <a href="tel:+911352650127" className="underline decoration-2 underline-offset-2">
                    +91 135 265 0127
                  </a>{' '}
                  and we will catch it before it leaves the counter.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
