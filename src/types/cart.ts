export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  currency: string
  metadata?: {
    variant?: string
  }
}

export interface Cart {
  items: CartItem[]
  total: number
  currency: string
}
