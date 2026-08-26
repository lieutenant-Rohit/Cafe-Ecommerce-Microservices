export interface User {
  id: number
  name: string
  email: string
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF'
  address?: string
  createdAt: string
}

export interface Category {
  id: number
  name: string
}

export interface Product {
  id: number
  name: string
  price: number
  stockQuantity: number
  imageUrl?: string
  category: Category
}

export type OrderStatus = 'CREATED' | 'PAYMENT_PENDING' | 'PAYMENT_COMPLETED' | 'CONFIRMED' | 'CANCELLED'

export interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
}

export interface Order {
  id: number
  userId: number
  status: OrderStatus
  createdAt: string
  items: OrderItem[]
}

export interface CartItem {
  id: number
  productId: number
  quantity: number
  product: Product
}

export interface Cart {
  id: number
  userId: number
  items: CartItem[]
}

export interface Inventory {
  id: number
  productId: number
  availableQuantity: number
  reservedQuantity: number
}

export interface PaginatedResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
}

export interface LoginResponse {
  token: string
  userId: number
  email: string
  role: string
}

export interface RegisterResponse {
  id: number
  name: string
  email: string
  role: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  address: string
}

export interface JwtPayload {
  sub: string
  role: string
  userId: number
  iat: number
  exp: number
}

