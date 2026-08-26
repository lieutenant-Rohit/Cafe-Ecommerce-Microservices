import axiosClient from './axiosClient'
import type { Inventory } from '../types'

export async function fetchInventory(productId: number): Promise<Inventory> {
  const { data } = await axiosClient.get(`/api/inventory/${productId}`)
  return data
}

export async function createInventory(productId: number, availableQuantity: number): Promise<Inventory> {
  const { data } = await axiosClient.post('/api/inventory', {
    productId,
    availableQuantity,
    reservedQuantity: 0,
  })
  return data
}

export async function reserveStock(productId: number, quantity: number): Promise<Inventory> {
  const { data } = await axiosClient.post(`/api/inventory/${productId}/reserve?quantity=${quantity}`)
  return data
}

export async function releaseStock(productId: number, quantity: number): Promise<Inventory> {
  const { data } = await axiosClient.post(`/api/inventory/${productId}/release?quantity=${quantity}`)
  return data
}
