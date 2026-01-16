import { OrderType, OrderStatus, PaymentStatus, DeliveryStatus, ProductCategory } from '@prisma/client'

export type { OrderType, OrderStatus, PaymentStatus, DeliveryStatus, ProductCategory }

export interface CartItem {
  productId: string
  quantity: number
  price: number
  name?: string
  image?: string
}

export interface CustomBoxState {
  items: CartItem[]
  total: number
}

export interface MysteryBoxFormData {
  recipientGender: 'male' | 'female'
  recipientAge: number
  budget: number
  interests: string[]
  occasion?: string
  customOccasion?: string
  comments?: string
}


