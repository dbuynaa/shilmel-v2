export interface AccountDetails {
  id: string
  name: string | null
  email: string
  image: string | null
  lastActivityDate: Date | null
}

export interface Address {
  id: string
  userId: string
  street: string
  city: string
  state: string | null
  postalCode: string
  country: string
  createdAt: Date
  updatedAt: Date
}

export interface PaymentMethod {
  id: string
  type: string
  last4: string
  expiry: string
  name: string
  isDefault: boolean
}

export interface Order {
  id: string
  userId: string
  shippingAddressId: string
  totalAmount: number
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  paymentMethod: string
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED"
  paymentId: string | null
  createdAt: Date
  updatedAt: Date
}
