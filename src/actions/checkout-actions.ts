"use server"

import { getCartFromCookiesAction } from "@/actions/cart-actions"
import { db } from "@/db"
import { orderItems, orders, payments, productVariants } from "@/db/schema"
import { createId } from "@paralleldrive/cuid2"
import { and, eq, gte } from "drizzle-orm"
import { z } from "zod"

// Validation schemas
const cardNumberSchema = z
  .string()
  .regex(/^[0-9]{16}$/, "Card number must be 16 digits")
  .transform((val) => val.replace(/\s/g, ""))

const expirySchema = z
  .string()
  .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry must be in MM/YY format")
  .refine((val) => {
    const [month, year] = val.split("/")
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
    return expiry > new Date()
  }, "Card has expired")

const cvcSchema = z.string().regex(/^[0-9]{3,4}$/, "CVC must be 3 or 4 digits")

const emailSchema = z.string().email("Invalid email address")

const checkoutSchema = z.object({
  email: emailSchema,
  cardNumber: cardNumberSchema,
  expiry: expirySchema,
  cvc: cvcSchema,
})

export type CheckoutData = z.infer<typeof checkoutSchema>

export async function processCheckoutAction(data: CheckoutData) {
  // Validate input data
  const validationResult = checkoutSchema.safeParse(data)
  if (!validationResult.success) {
    throw new Error(validationResult.error.errors[0].message)
  }

  // Get cart data
  const cart = await getCartFromCookiesAction()
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty")
  }

  // Start a transaction
  return await db.transaction(async (tx) => {
    // Check stock availability and reserve items
    for (const item of cart.items) {
      if (!item.variant?.sku) {
        throw new Error(`Invalid product variant in cart`)
      }

      const variant = await tx
        .select()
        .from(productVariants)
        .where(eq(productVariants.sku, item.variant.sku))
        .then((res) => res[0])

      if (!variant || variant.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product variant ${item.variant.sku}`
        )
      }

      // Update stock
      await tx
        .update(productVariants)
        .set({ stock: variant.stock - item.quantity })
        .where(
          and(
            eq(productVariants.sku, item.variant.sku),
            gte(productVariants.stock, item.quantity)
          )
        )
    }

    // Create order
    const orderId = createId()
    await tx.insert(orders).values({
      id: orderId,
      userId: "guest", // For now, we'll use a guest user
      shippingAddressId: "default", // For now, we'll use a default address
      totalAmount: cart.total.toString(),
      status: "PENDING",
      paymentMethod: "card",
      paymentStatus: "PENDING",
    })

    // Create order items
    await Promise.all(
      cart.items.map(async (item) => {
        if (!item.variant?.sku) {
          throw new Error(`Invalid product variant in cart`)
        }

        // Get variant ID from SKU
        const variant = await tx
          .select()
          .from(productVariants)
          .where(eq(productVariants.sku, item.variant.sku))
          .then((res) => res[0])

        if (!variant) {
          throw new Error(`Product variant not found: ${item.variant.sku}`)
        }

        return tx.insert(orderItems).values({
          orderId,
          productId: item.id,
          variantId: variant.id,
          quantity: item.quantity,
          price: item.price.toString(),
        })
      })
    )

    // Process payment (mock implementation)
    const paymentResult = await processPayment({
      amount: cart.total,
      currency: "USD",
      cardNumber: validationResult.data.cardNumber,
      expiry: validationResult.data.expiry,
      cvc: validationResult.data.cvc,
    })

    if (!paymentResult.success) {
      // Rollback will happen automatically due to transaction
      throw new Error(paymentResult.error || "Payment failed")
    }

    // Create payment record
    const paymentId = createId()
    await tx.insert(payments).values({
      orderId,
      amount: cart.total.toString(),
      status: "COMPLETED",
      transactionId: paymentResult.transactionId!,
    })

    // Update order with payment ID and status
    await tx
      .update(orders)
      .set({ paymentId, paymentStatus: "COMPLETED" })
      .where(eq(orders.id, orderId))

    return {
      success: true,
      orderId,
      paymentId,
    }
  })
}

// Mock payment processing function
// In a real implementation, this would integrate with a payment processor
async function processPayment({
  amount,
  currency,
  cardNumber,
  expiry,
  cvc,
}: {
  amount: number
  currency: string
  cardNumber: string
  expiry: string
  cvc: string
}): Promise<{
  success: boolean
  transactionId?: string
  error?: string
}> {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock validation and processing
  // In reality, this would call your payment processor's API
  if (cardNumber === "4242424242424242") {
    return {
      success: true,
      transactionId: `tr_${createId()}`,
    }
  }

  return {
    success: false,
    error: "Payment declined. Please try a different card.",
  }
}
