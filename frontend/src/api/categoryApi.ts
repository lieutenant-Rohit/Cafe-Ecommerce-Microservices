import axiosClient from './axiosClient'
import type { Category, PaginatedResponse } from '../types'

export async function fetchCategories(page = 0, size = 50): Promise<Category[]> {
  const { data } = await axiosClient.get<PaginatedResponse<Category>>('/api/categories', {
    params: { page, size },
  })
  return data.content
}

export async function createCategory(name: string): Promise<Category> {
  const { data } = await axiosClient.post('/api/categories', { name })
  return data
}

export async function updateCategory(id: number, name: string): Promise<Category> {
  const { data } = await axiosClient.put(`/api/categories/${id}`, { name })
  return data
}

export async function deleteCategory(id: number): Promise<void> {
  await axiosClient.delete(`/api/categories/${id}`)
}
