"use server";

import { getCartFromCookiesAction } from "@/actions/cart-actions";
import { auth } from "@/auth";
import { db } from "@/db";
import { addresses, orderItems, orders, payments, productVariants } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, gte } from "drizzle-orm";
import { z } from "zod";

// Validation schemas
const cardNumberSchema = z
	.string()
	.regex(/^[0-9]{16}$/, "Card number must be 16 digits")
	.transform((val) => val.replace(/\s/g, ""));

const expirySchema = z
	.string()
	.regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry must be in MM/YY format")
	.refine((val) => {
		const [month, year] = val.split("/");
		const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
		return expiry > new Date();
	}, "Card has expired");

const cvcSchema = z.string().regex(/^[0-9]{3,4}$/, "CVC must be 3 or 4 digits");

const emailSchema = z.string().email("Invalid email address");

const checkoutSchema = z.object({
	email: emailSchema,
	cardNumber: cardNumberSchema,
	expiry: expirySchema,
	cvc: cvcSchema,
});

export type CheckoutData = z.infer<typeof checkoutSchema>;

export async function processCheckoutAction(data: CheckoutData) {
	const session = await auth();

	if (!session || !session.user) {
		throw new Error("Not authenticated");
	}
	const userId = session.user.id!;
	// Validate input data
	const validationResult = checkoutSchema.safeParse(data);
	if (!validationResult.success) {
		throw new Error(validationResult.error.errors[0].message);
	}

	// Get cart data
	const cart = await getCartFromCookiesAction();
	if (!cart || cart.items.length === 0) {
		throw new Error("Cart is empty");
	}

	// Store IDs for potential rollback
	const orderId = createId();
	const paymentId = createId();
	const stockUpdates: Array<{
		sku: string;
		originalStock: number;
		newStock: number;
	}> = [];

	try {
		// Check stock availability and reserve items
		for (const item of cart.items) {
			if (!item.variant?.sku) {
				throw new Error(`Invalid product variant in cart`);
			}

			const variant = await db
				.select()
				.from(productVariants)
				.where(eq(productVariants.sku, item.variant.sku))
				.then((res) => res[0]);

			if (!variant || variant.stock < item.quantity) {
				throw new Error(`Insufficient stock for product variant ${item.variant.sku}`);
			}

			// Store original stock for potential rollback
			stockUpdates.push({
				sku: item.variant.sku,
				originalStock: variant.stock,
				newStock: variant.stock - item.quantity,
			});

			// Update stock
			await db
				.update(productVariants)
				.set({ stock: variant.stock - item.quantity })
				.where(and(eq(productVariants.sku, item.variant.sku), gte(productVariants.stock, item.quantity)));
		}

		// Process payment before creating order records
		const paymentResult = await processPayment({
			amount: cart.total,
			currency: "USD",
			cardNumber: validationResult.data.cardNumber,
			expiry: validationResult.data.expiry,
			cvc: validationResult.data.cvc,
		});

		if (!paymentResult.success) {
			// Rollback stock updates if payment fails
			await rollbackStockUpdates(stockUpdates);
			throw new Error(paymentResult.error || "Payment failed");
		}

		// Create shippingAddressId for the order
		const [shippingAddress] = await db
			.insert(addresses)
			.values({
				userId: userId,
				city: "Anytown",
				state: "CA",
				country: "US",
				postalCode: "12345",
				street: "123 Main St",
			})
			.returning();

		// Create order
		await db.insert(orders).values({
			id: orderId,
			userId: userId,
			shippingAddressId: shippingAddress.id,
			totalAmount: cart.total.toString(),
			status: "PENDING",
			paymentMethod: "card",
			paymentStatus: "PENDING",
		});

		// Create order items
		await Promise.all(
			cart.items.map(async (item) => {
				if (!item.variant?.sku) {
					throw new Error(`Invalid product variant in cart`);
				}

				// Get variant ID from SKU
				const variant = await db
					.select()
					.from(productVariants)
					.where(eq(productVariants.sku, item.variant.sku))
					.then((res) => res[0]);

				if (!variant) {
					throw new Error(`Product variant not found: ${item.variant.sku}`);
				}

				return db.insert(orderItems).values({
					orderId,
					productId: item.id,
					variantId: variant.id,
					quantity: item.quantity,
					price: item.price.toString(),
				});
			}),
		);

		// Create payment record
		await db.insert(payments).values({
			id: paymentId,
			orderId,
			amount: cart.total.toString(),
			status: "COMPLETED",
			transactionId: paymentResult.transactionId!,
		});

		// Update order with payment ID and status
		await db.update(orders).set({ paymentId, paymentStatus: "COMPLETED" }).where(eq(orders.id, orderId));

		return {
			success: true,
			orderId,
			paymentId,
		};
	} catch (error) {
		// Rollback all changes if any operation fails
		await rollbackCheckout({
			orderId,
			paymentId,
			stockUpdates,
		});
		throw error;
	}
}

async function rollbackStockUpdates(
	updates: Array<{
		sku: string;
		originalStock: number;
		newStock: number;
	}>,
) {
	for (const update of updates) {
		await db
			.update(productVariants)
			.set({ stock: update.originalStock })
			.where(eq(productVariants.sku, update.sku));
	}
}

async function rollbackCheckout({
	orderId,
	paymentId,
	stockUpdates,
}: {
	orderId: string;
	paymentId: string;
	stockUpdates: Array<{
		sku: string;
		originalStock: number;
		newStock: number;
	}>;
}) {
	try {
		// Rollback stock updates
		await rollbackStockUpdates(stockUpdates);

		// Delete payment record if it exists
		await db.delete(payments).where(eq(payments.id, paymentId));

		// Delete order items
		await db.delete(orderItems).where(eq(orderItems.orderId, orderId));

		// Delete order
		await db.delete(orders).where(eq(orders.id, orderId));
	} catch (rollbackError) {
		// Log rollback errors but don't throw - we want to surface the original error
		console.error("Error during rollback:", rollbackError);
	}
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
	amount: number;
	currency: string;
	cardNumber: string;
	expiry: string;
	cvc: string;
}): Promise<{
	success: boolean;
	transactionId?: string;
	error?: string;
}> {
	// Simulate payment processing delay
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Mock validation and processing
	// In reality, this would call your payment processor's API
	if (cardNumber === "4242424242424242") {
		return {
			success: true,
			transactionId: `tr_${createId()}`,
		};
	}

	return {
		success: false,
		error: "Payment declined. Please try a different card.",
	};
}
