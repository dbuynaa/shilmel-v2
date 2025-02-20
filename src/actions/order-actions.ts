"use server"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import {
  addresses,
  orderItems,
  orders,
  payments,
  products,
  productVariants,
  users,
} from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getOrderById(orderId: string) {
  noStore()
  try {
    // Get order with all related data
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        user: true,
        shippingAddress: true,
        payment: true,
        items: {
          with: {
            product: true,
            variant: {
              with: {
                images: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return null
    }

    return {
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
      },
      user: order.user
        ? {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
          }
        : null,
      shippingAddress: order.shippingAddress
        ? {
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            postalCode: order.shippingAddress.postalCode,
            country: order.shippingAddress.country,
          }
        : null,
      payment: order.payment
        ? {
            id: order.payment.id,
            status: order.payment.status,
            amount: Number(order.payment.amount),
            transactionId: order.payment.transactionId,
          }
        : null,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
        },
        variant: item.variant
          ? {
              id: item.variant.id,
              sku: item.variant.sku,
              size: item.variant.size,
              images: item.variant.images.map((img) => img.url),
            }
          : null,
      })),
    }
  } catch (error) {
    console.error("Error getting order:", error)
    return null
  }
}
