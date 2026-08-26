import { useState } from 'react'
import type { Inventory as InventoryType } from '../../types'
import { fetchInventory, createInventory, reserveStock, releaseStock } from '../../api/inventoryApi'

export default function AdminInventory() {
  const [productIdInput, setProductIdInput] = useState('')
  const [inventory, setInventory] = useState<InventoryType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [createProductId, setCreateProductId] = useState('')
  const [createQuantity, setCreateQuantity] = useState('')
  const [creating, setCreating] = useState(false)

  const [reserveProductId, setReserveProductId] = useState('')
  const [reserveQuantity, setReserveQuantity] = useState('')
  const [reserving, setReserving] = useState(false)

  const [releaseProductId, setReleaseProductId] = useState('')
  const [releaseQuantity, setReleaseQuantity] = useState('')
  const [releasing, setReleasing] = useState(false)

  async function handleLookup() {
    const id = parseInt(productIdInput, 10)
    if (isNaN(id)) {
      setError('Please enter a valid product ID')
      return
    }
    setLoading(true)
    setError('')
    setInventory(null)
    try {
      const data = await fetchInventory(id)
      setInventory(data)
    } catch {
      setError('No inventory found for this product ID')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    const id = parseInt(createProductId, 10)
    const qty = parseInt(createQuantity, 10)
    if (isNaN(id) || isNaN(qty) || qty < 0) return
    setCreating(true)
    try {
      const data = await createInventory(id, qty)
      setInventory(data)
      setProductIdInput(String(id))
      setCreateProductId('')
      setCreateQuantity('')
    } catch {
      alert('Failed to create inventory record')
    } finally {
      setCreating(false)
    }
  }

  async function handleReserve() {
    const id = parseInt(reserveProductId, 10)
    const qty = parseInt(reserveQuantity, 10)
    if (isNaN(id) || isNaN(qty) || qty <= 0) return
    setReserving(true)
    try {
      const data = await reserveStock(id, qty)
      setInventory(data)
      setProductIdInput(String(id))
      setReserveProductId('')
      setReserveQuantity('')
    } catch {
      alert('Failed to reserve stock')
    } finally {
      setReserving(false)
    }
  }

  async function handleRelease() {
    const id = parseInt(releaseProductId, 10)
    const qty = parseInt(releaseQuantity, 10)
    if (isNaN(id) || isNaN(qty) || qty <= 0) return
    setReleasing(true)
    try {
      const data = await releaseStock(id, qty)
      setInventory(data)
      setProductIdInput(String(id))
      setReleaseProductId('')
      setReleaseQuantity('')
    } catch {
      alert('Failed to release stock')
    } finally {
      setReleasing(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Inventory</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Look up inventory</h2>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Product ID"
            value={productIdInput}
            onChange={(e) => setProductIdInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleLookup}
            disabled={loading}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Look up'}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {inventory && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Inventory for Product #{inventory.productId}</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500">Product ID</p>
              <p className="text-xl font-bold text-gray-900">{inventory.productId}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500">Available</p>
              <p className="text-xl font-bold text-green-700">{inventory.availableQuantity}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500">Reserved</p>
              <p className="text-xl font-bold text-yellow-700">{inventory.reservedQuantity}</p>
            </div>
          </div>
        </div>
      )}

      {!inventory && !loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 mb-6">
          Enter a product ID above to check inventory.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Create Inventory</h3>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Product ID"
              value={createProductId}
              onChange={(e) => setCreateProductId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="number"
              placeholder="Available quantity"
              value={createQuantity}
              onChange={(e) => setCreateQuantity(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleCreate}
              disabled={creating}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors w-full disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Reserve Stock</h3>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Product ID"
              value={reserveProductId}
              onChange={(e) => setReserveProductId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="number"
              placeholder="Quantity to reserve"
              value={reserveQuantity}
              onChange={(e) => setReserveQuantity(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleReserve}
              disabled={reserving}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors w-full disabled:opacity-50"
            >
              {reserving ? 'Reserving...' : 'Reserve'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Release Stock</h3>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Product ID"
              value={releaseProductId}
              onChange={(e) => setReleaseProductId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="number"
              placeholder="Quantity to release"
              value={releaseQuantity}
              onChange={(e) => setReleaseQuantity(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleRelease}
              disabled={releasing}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors w-full disabled:opacity-50"
            >
              {releasing ? 'Releasing...' : 'Release'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

