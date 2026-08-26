import { create } from 'zustand'
import type { Product } from '../types'
import * as cartApi from '../api/cartApi'
import { fetchProductById } from '../api/productApi'
import useAuthStore from './authStore'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  cartId: number | null
  backendReady: boolean

  loadFromBackend: () => Promise<void>
  addItem: (product: Product, quantity?: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: () => number
  totalAmount: () => number
}

async function enrichCartItems(items: { productId: number; quantity: number }[]): Promise<CartItem[]> {
  const enriched = await Promise.all(
    items.map(async (item) => {
      try {
        const product = await fetchProductById(item.productId)
        return { product, quantity: item.quantity }
      } catch {
        return null
      }
    }),
  )
  return enriched.filter((item): item is CartItem => item !== null)
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  cartId: null,
  backendReady: false,

  loadFromBackend: async () => {
    try {
      let cart
      try {
        cart = await cartApi.fetchCart()
      } catch {
        cart = await cartApi.createCart()
      }
      const enriched = await enrichCartItems(cart.items)
      set({
        items: enriched,
        cartId: cart.id,
        backendReady: true,
      })
    } catch {
      set({ backendReady: false })
    }
  },

  addItem: async (product, quantity = 1) => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) {
      try {
        await cartApi.addToCart(product.id, quantity)
        const cart = await cartApi.fetchCart()
        const enriched = await enrichCartItems(cart.items)
        set({
          items: enriched,
          cartId: cart.id,
        })
        return
      } catch { /* fall through to local */ }
    }
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        }
      }
      return { items: [...state.items, { product, quantity }] }
    })
  },

  removeItem: async (productId) => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) {
      try {
        await cartApi.removeFromCart(productId)
        const cart = await cartApi.fetchCart()
        const enriched = await enrichCartItems(cart.items)
        set({
          items: enriched,
          cartId: cart.id,
        })
        return
      } catch { /* fall through */ }
    }
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    }))
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      return get().removeItem(productId)
    }
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) {
      try {
        await cartApi.updateCartItem(productId, quantity)
        const cart = await cartApi.fetchCart()
        const enriched = await enrichCartItems(cart.items)
        set({
          items: enriched,
          cartId: cart.id,
        })
        return
      } catch { /* fall through */ }
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      ),
    }))
  },

  clearCart: async () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) {
      try {
        await cartApi.clearCart()
      } catch { /* ignore */ }
    }
    set({ items: [], cartId: null })
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalAmount: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}))

export default useCartStore

