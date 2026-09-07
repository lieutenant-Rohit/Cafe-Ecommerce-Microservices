import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'
import { ShoppingBag, DollarSign, Package, Users, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { fetchAllOrders } from '../../api/orderApi'
import { fetchProducts } from '../../api/productApi'
import { fetchUsers } from '../../api/userApi'
import type { Order, Product, User } from '../../types'

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const duration = 1200
    const steps = 40
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

const statusColors: Record<string, string> = {
  CREATED: 'bg-blue-50 text-blue-600 border-blue-100',
  PAYMENT_PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
  PAYMENT_COMPLETED: 'bg-green-50 text-green-600 border-green-100',
  CONFIRMED: 'bg-primary-50 text-primary-600 border-primary-100',
  CANCELLED: 'bg-red-50 text-red-600 border-red-100',
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchAllOrders().catch(() => []),
      fetchProducts(0, 100).then((d) => d.content).catch(() => []),
      fetchUsers().catch(() => []),
    ]).then(([o, p, u]) => {
      setOrders(o)
      setProducts(p)
      setUsers(u)
    }).finally(() => setLoading(false))
  }, [])

  const revenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0)

  const pendingOrders = orders.filter((o) => o.status === 'CREATED')
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Revenue', value: revenue, prefix: '$', icon: DollarSign, color: 'from-green-500 to-emerald-600', change: '+8%', isCurrency: true },
    { label: 'Products', value: products.length, icon: Package, color: 'from-primary-500 to-primary-600', change: '+3' },
    { label: 'Customers', value: users.length, icon: Users, color: 'from-purple-500 to-violet-600', change: '+5' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-cream-200 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-cream-200 p-6">
              <div className="h-10 bg-cream-100 rounded-xl w-10 animate-pulse mb-4" />
              <div className="h-5 bg-cream-200 rounded w-24 animate-pulse mb-2" />
              <div className="h-8 bg-cream-100 rounded w-20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-coffee-900">Dashboard</h1>
        <p className="text-sm text-coffee-400 mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Pending alert */}
      {pendingOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              {pendingOrders.length} pending order{pendingOrders.length !== 1 ? 's' : ''} need attention
            </p>
            <p className="text-xs text-amber-600 mt-0.5">Review and confirm orders to keep things moving.</p>
          </div>
          <a
            href="/admin/orders"
            className="text-sm font-medium text-amber-700 hover:text-amber-800 underline underline-offset-2"
          >
            View all
          </a>
        </motion.div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-white rounded-2xl border border-cream-200 p-5 hover:shadow-lg hover:shadow-primary-900/5 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-coffee-400">{stat.label}</p>
            <p className="text-2xl font-bold text-coffee-900 mt-1">
              <AnimatedCounter
                value={stat.isCurrency ? Math.round(stat.value) : stat.value}
                prefix={stat.prefix}
              />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-cream-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-cream-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-coffee-400" />
            <h2 className="text-sm font-semibold text-coffee-900">Recent Orders</h2>
          </div>
          <a href="/admin/orders" className="text-xs font-medium text-primary-600 hover:text-primary-700">
            View all
          </a>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-sm text-coffee-400">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-semibold uppercase tracking-[0.15em] text-coffee-400 border-b border-cream-100">
                  <th className="text-left px-6 py-3">Order</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Items</th>
                  <th className="text-left px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0)
                  return (
                    <tr key={order.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <span className="text-sm font-medium text-coffee-900">#{order.id}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-sm text-coffee-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-sm text-coffee-500">{order.items.length}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-sm font-semibold text-coffee-900">${total.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusColors[order.status] || 'bg-cream-50 text-coffee-600 border-cream-200'}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Products', href: '/admin/products', icon: Package, color: 'bg-primary-50 text-primary-600' },
          { label: 'View Orders', href: '/admin/orders', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
          { label: 'Check Inventory', href: '/admin/inventory', icon: TrendingUp, color: 'bg-accent-50 text-accent-600' },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 bg-white rounded-2xl border border-cream-200 p-4 hover:shadow-lg hover:shadow-primary-900/5 hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-coffee-900">{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
