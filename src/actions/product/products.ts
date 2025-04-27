"use server";

import { db } from "@/db";
import {
	type Product,
	inventories,
	productCategories,
	productImage,
	productVariants,
	products,
} from "@/db/schema";
import { deslugify } from "@/lib/utils";
import type { SearchParams } from "@/types";
import { searchParamsSchema } from "@/validations/params";
import type { productSchema } from "@/validations/product";
import { asc, desc, eq, like } from "drizzle-orm";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import type { z } from "zod";

export async function addProduct(
	input: z.infer<typeof productSchema>,
): Promise<{ success: boolean; error?: string }> {
	try {
		// Insert the base product
		const product = await db
			.insert(products)
			.values({
				id: crypto.randomUUID(),
				name: input.title,
				description: input.description || null,
				slug: input.slug,
				status: input.status,
				updatedAt: new Date().toISOString(),
			})
			.returning();

		if (!product[0]) {
			throw new Error("Failed to create product");
		}

		// Insert all variants
		for (const variant of input.variants) {
			// Insert variant
			const newVariant = await db
				.insert(productVariants)
				.values({
					id: crypto.randomUUID(),
					productId: product[0].id,
					title: variant.title || input.title,
					requiresShipping: variant.requiresShipping ?? true,
					isTaxable: variant.isTaxable ?? true,
					updatedAt: new Date().toISOString(),
				})
				.returning();

			if (!newVariant[0]) {
				continue;
			}

			// Insert inventory entry
			await db.insert(inventories).values({
				id: crypto.randomUUID(),
				sku:
					variant.sku ||
					`${input.title.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)
						.toString()
						.padStart(3, "0")}`,
				price: variant.price.toString(),
				compareAtPrice: variant.compareAtPrice?.toString() || null,
				costPrice: input.costPrice?.toString() || null,
				inventoryQuantity: variant.inventoryQuantity,
				weight: variant.weight?.toString() || null,
				weightUnit: variant.weightUnit || "KG",
				productId: product[0].id,
				variantId: newVariant[0].id,
				updatedAt: new Date().toISOString(),
			});

			// Insert images if they exist
			if (input.images && input.images.length > 0) {
				for (const image of input.images) {
					await db.insert(productImage).values({
						id: crypto.randomUUID(),
						productId: product[0].id,
						productVariantId: newVariant[0].id,
						url: image.url,
						alt: image.alt || null,
						position: image.position,
					});
				}
			}
		}

		// Insert categories
		if (input.categories && input.categories.length > 0) {
			for (const categoryId of input.categories) {
				await db.insert(productCategories).values({
					id: crypto.randomUUID(),
					productId: product[0].id,
					categoryId,
				});
			}
		}

		revalidatePath("/admin/products");
		return { success: true };
	} catch (error) {
		console.error("Error adding product:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

export async function checkProductSlug(input: {
	slug: string;
	id?: string;
}): Promise<boolean> {
	noStore();
	try {
		const existingProduct = await db
			.select()
			.from(products)
			.where(
				input.id ? eq(products.slug, input.slug) && eq(products.id, input.id) : eq(products.slug, input.slug),
			)
			.limit(1);

		return existingProduct.length > 0;
	} catch (error) {
		console.error("Error checking product slug:", error);
		return false;
	}
}

export async function deleteProduct(input: {
	id: string;
}): Promise<{ success: boolean; error?: string }> {
	try {
		await db.delete(products).where(eq(products.id, input.id));
		revalidatePath("/admin/products");
		return { success: true };
	} catch (error) {
		console.error("Error deleting product:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

export async function getProductById(id: string) {
	noStore();
	try {
		const product = await db.query.products.findFirst({
			where: eq(products.id, id),
			with: {
				productVariants: {
					with: {
						productImages: true,
					},
				},
			},
		});

		return product;
	} catch (error) {
		console.error("Error fetching product:", error);
		return null;
	}
}

export async function updateProduct(
	id: string,
	input: z.infer<typeof productSchema>,
): Promise<{ success: boolean; error?: string }> {
	try {
		// Update the base product
		await db
			.update(products)
			.set({
				name: input.title,
				description: input.description || null,
				slug: input.slug,
				status: input.status,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(products.id, id));

		// Get existing variants
		const existingVariants = await db.select().from(productVariants).where(eq(productVariants.productId, id));

		// Delete existing variants and their images
		for (const variant of existingVariants) {
			if (variant.id) {
				await db.delete(productImage).where(eq(productImage.productVariantId, variant.id));
			}
		}
		await db.delete(productVariants).where(eq(productVariants.productId, id));

		// Insert new variants
		for (const variant of input.variants) {
			// Insert variant
			const newVariant = await db
				.insert(productVariants)
				.values({
					id: crypto.randomUUID(),
					productId: id,
					title: variant.title || input.title,
					requiresShipping: variant.requiresShipping ?? true,
					isTaxable: variant.isTaxable ?? true,
					updatedAt: new Date().toISOString(),
				})
				.returning();

			if (!newVariant[0]) {
				continue;
			}

			// Insert inventory entry
			await db.insert(inventories).values({
				id: crypto.randomUUID(),
				sku:
					variant.sku ||
					`${input.title.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)
						.toString()
						.padStart(3, "0")}`,
				price: variant.price.toString(),
				compareAtPrice: variant.compareAtPrice?.toString() || null,
				costPrice: input.costPrice?.toString() || null,
				inventoryQuantity: variant.inventoryQuantity,
				weight: variant.weight?.toString() || null,
				weightUnit: variant.weightUnit || "KG",
				productId: id,
				variantId: newVariant[0].id,
				updatedAt: new Date().toISOString(),
			});

			// Insert images if they exist
			if (input.images && input.images.length > 0) {
				for (const image of input.images) {
					await db.insert(productImage).values({
						id: crypto.randomUUID(),
						productId: id,
						productVariantId: newVariant[0].id,
						url: image.url,
						alt: image.alt || null,
						position: image.position,
					});
				}
			}
		}

		// Update categories
		if (input.categories && input.categories.length > 0) {
			// Delete existing category associations
			await db.delete(productCategories).where(eq(productCategories.productId, id));

			// Insert new category associations
			for (const categoryId of input.categories) {
				await db.insert(productCategories).values({
					id: crypto.randomUUID(),
					productId: id,
					categoryId,
				});
			}
		}

		revalidatePath("/admin/products");
		return { success: true };
	} catch (error) {
		console.error("Error updating product:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}
export async function getProducts(searchParams: SearchParams) {
	const { page, per_page, sort, name } = searchParamsSchema.parse(searchParams);

	const fallbackPage = isNaN(page) || page < 1 ? 1 : page;
	const limit = isNaN(per_page) ? 10 : per_page;
	const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;

	const [column, order] = (sort?.split(".") as [keyof Product | undefined, "asc" | "desc" | undefined]) ?? [
		"createdAt",
		"desc",
	];

	noStore();
	return await db
		.select()
		.from(products)
		.limit(limit)
		.offset(offset)
		.where(name ? like(products.name, `%${name}%`) : undefined)
		.orderBy(
			column && column in products
				? order === "asc"
					? asc(products[column])
					: desc(products[column])
				: desc(products.createdAt),
		);
}

export async function getProductBySlug(slug: string) {
	noStore();
	try {
		const product = await db.query.products.findFirst({
			where: eq(products.slug, deslugify(slug).toLowerCase()),
			with: {
				productCategories: true,
				productVariants: {
					with: {
						productImages: true,
					},
				},
			},
		});

		return product || null;
	} catch (error) {
		console.error("Error fetching product by slug:", error);
		throw new Error("Failed to fetch product by slug");
	}
}
