import axiosClient from './axiosClient'
import type { Order, OrderStatus } from '../types'

export async function placeOrder(): Promise<Order> {
  const { data } = await axiosClient.post('/api/orders')
  return data
}

export async function fetchAllOrders(): Promise<Order[]> {
  const { data } = await axiosClient.get<Order[]>('/api/orders/all')
  return data
}

export async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await axiosClient.get('/api/orders')
  return data
}

export async function fetchOrderById(orderId: number): Promise<Order> {
  const { data } = await axiosClient.get(`/api/orders/${orderId}`)
  return data
}

export async function updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
  const { data } = await axiosClient.patch(`/api/orders/${orderId}/status?status=${status}`)
  return data
}

export async function deleteOrder(orderId: number): Promise<void> {
  await axiosClient.delete(`/api/orders/${orderId}`)
}

