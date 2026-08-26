import axiosClient from './axiosClient'
import type { Cart } from '../types'

export async function createCart(): Promise<Cart> {
  const { data } = await axiosClient.post('/api/carts')
  return data
}

export async function fetchCart(): Promise<Cart> {
  const { data } = await axiosClient.get('/api/carts')
  return data
}

export async function addToCart(productId: number, quantity = 1): Promise<Cart> {
  const { data } = await axiosClient.post(`/api/carts/items?productId=${productId}&quantity=${quantity}`)
  return data
}

export async function updateCartItem(productId: number, quantity: number): Promise<Cart> {
  const { data } = await axiosClient.put(`/api/carts/items/${productId}?quantity=${quantity}`)
  return data
}

export async function removeFromCart(productId: number): Promise<void> {
  await axiosClient.delete(`/api/carts/items/${productId}`)
}

export async function clearCart(): Promise<void> {
  await axiosClient.delete('/api/carts/items')
}

