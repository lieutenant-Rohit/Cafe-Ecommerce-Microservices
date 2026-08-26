import axiosClient from './axiosClient'
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, User } from '../types'

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await axiosClient.post<LoginResponse>('/api/auth/login', payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await axiosClient.post<RegisterResponse>('/api/auth/register', payload)
  return data
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await axiosClient.get<User>('/api/users/me')
  return data
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await axiosClient.get<User[]>('/api/users')
  return data
}

export async function deleteUser(id: number): Promise<void> {
  await axiosClient.delete(`/api/users/${id}`)
}

