import axiosClient from './axiosClient'
import type { Product, PaginatedResponse } from '../types'

export async function fetchProducts(
  page = 0,
  size = 8,
): Promise<PaginatedResponse<Product>> {
  const { data } = await axiosClient.get('/api/products', {
    params: { page, size },
  })
  return data
}

export async function fetchProductsByCategory(
  categoryId: number,
  page = 0,
  size = 8,
): Promise<PaginatedResponse<Product>> {
  const { data } = await axiosClient.get(`/api/products/category/${categoryId}`, {
    params: { page, size },
  })
  return data
}

export async function createProduct(product: { name: string; price: number; stockQuantity: number; imageUrl?: string; category: { id: number } }): Promise<Product> {
  const { data } = await axiosClient.post('/api/products', product)
  return data
}

export async function updateProduct(id: number, product: { name: string; price: number; stockQuantity: number; imageUrl?: string; category: { id: number } }): Promise<Product> {
  const { data } = await axiosClient.put(`/api/products/${id}`, product)
  return data
}

export async function deleteProduct(id: number): Promise<void> {
  await axiosClient.delete(`/api/products/${id}`)
}

