"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getOrderById(orderId: string) {
	// noStore()

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
		});

		if (!order) {
			return null;
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
		};
	} catch (error) {
		console.error("Error getting order:", error);
		return null;
	}
}

export async function getUserOrders() {
	// noStore()
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return [];
		}

		const userOrders = await db.query.orders.findMany({
			where: eq(orders.userId, session.user.id),
			with: {
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
			orderBy: (orders, { desc }) => [desc(orders.createdAt)],
		});

		return userOrders.map((order) => ({
			id: order.id,
			date: order.createdAt,
			total: Number(order.totalAmount),
			status: order.status,
			items: order.items.map((item) => ({
				quantity: item.quantity,
				price: Number(item.price),
				product: {
					name: item.product.name,
					image: item.variant?.images[0]?.url,
				},
			})),
		}));
	} catch (error) {
		console.error("Error getting user orders:", error);
		return [];
	}
}
