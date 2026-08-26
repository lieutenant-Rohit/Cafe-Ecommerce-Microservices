import { create } from 'zustand'
import * as userApi from '../api/userApi'
import { decodeToken, isTokenExpired } from '../utils/jwt'
import type { JwtPayload, LoginPayload, RegisterPayload } from '../types'

interface AuthState {
  token: string | null
  user: JwtPayload | null
  userId: number | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  error: string | null

  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  initialize: () => void
  clearError: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  userId: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
  error: null,

  initialize: () => {
    const token = localStorage.getItem('token')
    const storedUserId = localStorage.getItem('userId')
    if (token && !isTokenExpired(token)) {
      const decoded = decodeToken(token)
      const uid = storedUserId ? parseInt(storedUserId, 10) : decoded?.userId ?? null
      set({
        token,
        user: decoded,
        userId: uid,
        isAuthenticated: true,
        isAdmin: decoded?.role === 'ADMIN',
      })
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      set({
        token: null,
        user: null,
        userId: null,
        isAuthenticated: false,
        isAdmin: false,
      })
    }
  },

  login: async (payload: LoginPayload) => {
    set({ isLoading: true, error: null })
    try {
      const response = await userApi.login(payload)
      const { token, userId, role } = response
      const decoded = decodeToken(token)

      if (!decoded) {
        throw new Error('Invalid token received')
      }

      localStorage.setItem('token', token)
      localStorage.setItem('userId', String(userId))
      set({
        token,
        user: decoded,
        userId,
        isAuthenticated: true,
        isAdmin: role === 'ADMIN',
        isLoading: false,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please check your credentials.'
      set({ isLoading: false, error: message })
      throw err
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null })
    try {
      await userApi.register(payload)
      set({ isLoading: false })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please try again.'
      set({ isLoading: false, error: message })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    set({
      token: null,
      user: null,
      userId: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      error: null,
    })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
