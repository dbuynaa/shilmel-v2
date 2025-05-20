"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { profileFormSchema } from "@/lib/validations/profile";
import { eq } from "drizzle-orm";
import type { z } from "zod";

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export async function getUserProfile() {
	const session = await auth();
	if (!session?.user?.id) {
		throw new Error("Not authenticated");
	}

	const user = await db.query.users.findFirst({
		where: eq(users.id, session.user.id),
		with: {
			customer: {
				with: {
					addresses: true,
					orders: {
						limit: 5,
						orderBy: (orders, { desc }) => [desc(orders.createdAt)],
					},
				},
			},
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	return user;
}

export async function updateUserProfile(data: ProfileFormValues) {
	const session = await auth();
	if (!session?.user?.id) {
		throw new Error("Not authenticated");
	}

	const validatedData = profileFormSchema.parse(data);

	const updatedUser = await db
		.update(users)
		.set({
			firstName: validatedData.name,
			email: validatedData.email,
			// image: validatedData.image,
		})
		.where(eq(users.id, session.user.id))
		.returning();

	return updatedUser[0];
}

// export async function updateProfileImage(imageUrl: string) {
// 	const session = await auth();
// 	if (!session?.user?.id) {
// 		throw new Error("Not authenticated");
// 	}

// 	const updatedUser = await db
// 		.update(users)
// 		.set({
// 			image: imageUrl,
// 		})
// 		.where(eq(users.id, session.user.id))
// 		.returning();

// 	return updatedUser[0];
// }

// export async function deleteProfileImage() {
// 	const session = await auth();
// 	if (!session?.user?.id) {
// 		throw new Error("Not authenticated");
// 	}

// 	const updatedUser = await db
// 		.update(users)
// 		.set({
// 			image: null,
// 		})
// 		.where(eq(users.id, session.user.id))
// 		.returning();

// 	return updatedUser[0];
// }

export async function getCustomerProfile(customerId: string) {
	const session = await auth();
	if (!session?.user?.id) {
		throw new Error("Not authenticated");
	}

	const customer = await db.query.customers.findFirst({
		where: eq(users.id, customerId),
		with: {
			addresses: true,
			orders: {
				limit: 5,
				orderBy: (orders, { desc }) => [desc(orders.createdAt)],
			},
		},
	});

	if (!customer) {
		throw new Error("Customer not found");
	}

	return customer;
}
