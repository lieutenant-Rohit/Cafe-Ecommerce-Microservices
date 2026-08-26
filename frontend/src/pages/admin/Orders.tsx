import { useEffect, useState } from 'react'
import type { Order, OrderStatus } from '../../types'
import { fetchAllOrders, updateOrderStatus, deleteOrder } from '../../api/orderApi'

const statusFlow: OrderStatus[] = ['CREATED', 'PAYMENT_COMPLETED', 'CONFIRMED']
const statusColors: Record<OrderStatus, string> = {
  CREATED: 'bg-blue-100 text-blue-700',
  PAYMENT_PENDING: 'bg-yellow-100 text-yellow-700',
  PAYMENT_COMPLETED: 'bg-indigo-100 text-indigo-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const statusLabels: Record<OrderStatus, string> = {
  CREATED: 'Created',
  PAYMENT_PENDING: 'Payment Pending',
  PAYMENT_COMPLETED: 'Payment Completed',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    fetchAllOrders().then(setOrders).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleAdvance(order: Order) {
    if (order.status === 'CANCELLED' || order.status === 'CONFIRMED') return
    const currentIdx = statusFlow.indexOf(order.status)
    if (currentIdx < 0 || currentIdx >= statusFlow.length - 1) return
    const nextStatus = statusFlow[currentIdx + 1]
    await updateOrderStatus(order.id, nextStatus)
    load()
  }

  async function handleCancel(order: Order) {
    if (!window.confirm(`Cancel order #${order.id}?`)) return
    await updateOrderStatus(order.id, 'CANCELLED')
    load()
  }

  async function handleDelete(order: Order) {
    if (!window.confirm(`Permanently delete order #${order.id}?`)) return
    await deleteOrder(order.id)
    load()
  }

  function getActionLabel(status: OrderStatus): string | null {
    switch (status) {
      case 'CREATED': return 'Confirm Payment'
      case 'PAYMENT_COMPLETED': return 'Confirm Order'
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 h-24" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order.id} &middot; User #{order.userId}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
              <div className="divide-y divide-gray-100 text-sm">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-1.5">
                    <span className="text-gray-700 flex-1">Product #{item.productId} x{item.quantity}</span>
                    <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Total: ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                </span>
                <div className="flex gap-2">
                  {order.status !== 'CANCELLED' && order.status !== 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancel(order)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Cancel
                    </button>
                  )}
                  {order.status !== 'CANCELLED' && order.status !== 'CONFIRMED' && getActionLabel(order.status) && (
                    <button
                      onClick={() => handleAdvance(order)}
                      className="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      {getActionLabel(order.status)}
                    </button>
                  )}
                  {order.status === 'CANCELLED' && (
                    <button
                      onClick={() => handleDelete(order)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

