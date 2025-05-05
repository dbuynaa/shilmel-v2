"use server";

import { db } from "@/db";
import {
	categories,
	metaData,
	productCategories,
	productImage,
	productOptionValues,
	productOptions,
	productVariantOptions,
	productVariants,
	products,
} from "@/db/schema/schema";
import type { Product, ProductOptionValue } from "@/db/types";
import { slugify } from "@/lib/utils";
import type { SearchParams } from "@/types";
import { searchParamsSchema } from "@/validations/params";
import { type ProductFormValues, productSchema } from "@/validations/product";
import { and, asc, desc, eq, isNull, like } from "drizzle-orm";
import { nanoid } from "nanoid";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { z } from "zod";

export type CreateProductInput = z.infer<typeof productSchema>;

export type UpdateProductInput = Partial<CreateProductInput> & {
	id: string;
	slug?: string;
};

// export async function createProduct(
// 	input: z.infer<typeof productSchema>,
// ): Promise<{ product: Product | null; error?: string }> {
// 	try {
// 		const productId = nanoid();
// 		const slug = slugify(input.name);

// 		const newProduct: Product = {
// 			id: productId,
// 			name: input.name,
// 			stock: input.stock,
// 			description: input.description || null,
// 			slug,
// 			sku: input.sku || null,
// 			price: input.price.toString(),
// 			costPrice: input.costPrice?.toString() || null,
// 			compareAtPrice: input.compareAtPrice?.toString() || null,
// 			weightUnit: input.weightUnit || "KG",
// 			weight: input.weight?.toString() || null,
// 			status: input.status || "DRAFT",
// 			createdAt: new Date().toISOString(),
// 			updatedAt: new Date().toISOString(),
// 		};
// 		// Create the product
// 		const product = await db.insert(products).values(newProduct).returning().execute();

// 		// Add product categories if provided
// 		if (input.categories && input.categories.length > 0) {
// 			await db
// 				.insert(productCategories)
// 				.values(
// 					input.categories.map((categoryId) => ({
// 						id: nanoid(),
// 						productId,
// 						categoryId,
// 					})),
// 				)
// 				.execute();
// 		}

// 		// Add product images if provided
// 		if (input.images && input.images.length > 0) {
// 			await db
// 				.insert(productImage)
// 				.values(
// 					input.images.map((image, index) => ({
// 						id: nanoid(),
// 						productId,
// 						url: image.url,
// 						alt: image.alt || null,
// 						position: image.position || index,
// 						createdAt: new Date().toISOString(),
// 					})),
// 				)
// 				.execute();
// 		}

// 		// Add meta data if provided
// 		if (input.metaData) {
// 			await db
// 				.insert(metaData)
// 				.values({
// 					id: nanoid(),
// 					productId,
// 					title: input.metaData.title || null,
// 					description: input.metaData.description || null,
// 				})
// 				.execute();
// 		}

// 		// Process options and variants
// 		// Create product options and their values if provided
// 		if (input.options && input.options.length > 0) {
// 			for (const option of input.options) {
// 				const optionId = nanoid();

// 				// Create option
// 				await db
// 					.insert(productOptions)
// 					.values({
// 						id: optionId,
// 						productId,
// 						name: option.name,
// 						// position: option.position || 1,
// 					})
// 					.execute();

// 				// Create option values
// 				for (const [index, value] of option.values.entries()) {
// 					const valueId = nanoid();
// 					await db
// 						.insert(productOptionValues)
// 						.values({
// 							id: valueId,
// 							optionId,
// 							value: value.value,
// 							position: value.position || index + 1,
// 						})
// 						.execute();
// 				}
// 			}
// 		}

// 		// Create product variants if provided
// 		if (input.variants && input.variants.length > 0) {
// 			for (const variant of input.variants) {
// 				const variantId = nanoid();

// 				const newVariant: ProductVariant = {
// 					id: variantId,
// 					productId,
// 					title: variant.title,
// 					sku: variant.sku || null,
// 					stock: variant.stock !== undefined ? variant.stock : 0,
// 					price: variant.price.toString(),
// 					compareAtPrice: variant.compareAtPrice ? variant.compareAtPrice.toString() : null,
// 					costPrice: variant.costPrice ? variant.costPrice.toString() : null,
// 					weight: variant.weight?.toString() || null,
// 					weightUnit: variant.weightUnit || "KG",
// 					createdAt: new Date().toISOString(),
// 					updatedAt: new Date().toISOString(),
// 				};
// 				// Create variant
// 				await db.insert(productVariants).values(newVariant).execute();

// 				// Link variant options if provided
// 				// if (variant.optionValues) {
// 				// 	for (const optionValue of variant.optionValues) {
// 				// 		const optionValueId = optionValue.id;

// 				// 		if (optionValueId) {
// 				// 			await db
// 				// 				.insert(productVariantOptions)
// 				// 				.values({
// 				// 					id: nanoid(),
// 				// 					variantId,
// 				// 					optionValueId,
// 				// 				})
// 				// 				.execute();
// 				// 		}
// 				// 	}
// 				// }

// 				// Add variant images if provided
// 				if (variant.images && variant.images.length > 0) {
// 					await db
// 						.insert(productImage)
// 						.values(
// 							variant.images.map((image, index) => ({
// 								id: nanoid(),
// 								productId,
// 								productVariantId: variantId,
// 								url: image.url,
// 								alt: image.alt || null,
// 								position: image.position || index,
// 								createdAt: new Date().toISOString(),
// 							})),
// 						)
// 						.execute();
// 				}
// 			}
// 		}

// 		return { product: product[0] || null };
// 	} catch (error) {
// 		console.error("Error creating product:", error);
// 		return { product: null, error: error instanceof Error ? error.message : "Unknown error occurred" };
// 	}
// }

// export async function updateProduct(
// 	input: UpdateProductInput,
// ): Promise<{ product: Product | null; error?: string }> {
// 	console.log("productFrom:", input);
// 	try {
// 		const slug = input.name ? slugify(input.name) : undefined;
// 		const productId = input.id;

// 		// Update the product
// 		const updateData: Partial<Product> = {
// 			...(input.name && { name: input.name }),
// 			...(input.stock !== undefined && { stock: input.stock }),
// 			...(input.description !== undefined && { description: input.description }),
// 			...(slug && { slug }),
// 			...(input.sku !== undefined && { sku: input.sku }),
// 			...(input.price !== undefined && { price: input.price.toString() }),
// 			...(input.costPrice !== undefined && { costPrice: input.costPrice.toString() }),
// 			...(input.compareAtPrice !== undefined && { compareAtPrice: input.compareAtPrice.toString() }),
// 			...(input.weightUnit && { weightUnit: input.weightUnit }),
// 			...(input.weight !== undefined && { weight: input.weight.toString() }),
// 			...(input.status && { status: input.status }),
// 			updatedAt: new Date().toISOString(),
// 		};

// 		// Update product base record
// 		await db.update(products).set(updateData).where(eq(products.id, productId)).execute();

// 		// Fetch the updated product
// 		const updatedProduct = await db.select().from(products).where(eq(products.id, productId)).execute();

// 		if (!updatedProduct.length) {
// 			return { product: null, error: "Product not found" };
// 		}

// 		// Update product categories if provided
// 		if (input.categories !== undefined) {
// 			// First delete existing categories
// 			await db.delete(productCategories).where(eq(productCategories.productId, productId)).execute();

// 			// Then add new categories if any
// 			if (input.categories.length > 0) {
// 				await db
// 					.insert(productCategories)
// 					.values(
// 						input.categories.map((categoryId) => ({
// 							id: nanoid(),
// 							productId,
// 							categoryId,
// 						})),
// 					)
// 					.execute();
// 			}
// 		}

// 		// Update product images if provided
// 		if (input.images !== undefined) {
// 			// Delete existing product-level images
// 			await db
// 				.delete(productImage)
// 				.where(and(eq(productImage.productId, productId), isNull(productImage.productVariantId)))
// 				.execute();

// 			// Add new images if any
// 			if (input.images.length > 0) {
// 				await db
// 					.insert(productImage)
// 					.values(
// 						input.images.map((image, index) => ({
// 							id: nanoid(),
// 							productId,
// 							url: image.url,
// 							alt: image.alt || null,
// 							position: image.position || index,
// 							createdAt: new Date().toISOString(),
// 						})),
// 					)
// 					.execute();
// 			}
// 		}

// 		// Update meta data if provided
// 		if (input.metaData !== undefined) {
// 			// Delete existing metadata
// 			await db.delete(metaData).where(eq(metaData.productId, productId)).execute();

// 			// Add new metadata if provided
// 			if (input.metaData) {
// 				await db
// 					.insert(metaData)
// 					.values({
// 						id: nanoid(),
// 						productId,
// 						title: input.metaData.title || null,
// 						description: input.metaData.description || null,
// 					})
// 					.execute();
// 			}
// 		}

// 		// Create product variants if provided
// 		const variantIds: JSON = ;
// 		const optionsId: string[] = [];

// 		// Update options and variants if provided
// 		if (input.options !== undefined) {
// 			// Get existing options for this product
// 			const existingOptions = await db
// 				.select()
// 				.from(productOptions)
// 				.where(eq(productOptions.productId, productId))
// 				.execute();

// 			// Delete existing options and their values
// 			for (const option of existingOptions) {
// 				// Delete option values first (foreign key constraint)
// 				await db.delete(productOptionValues).where(eq(productOptionValues.optionId, option.id)).execute();

// 				// Delete variant options that reference these option values
// 				// First get all option values for this option
// 				const optionValues = await db
// 					.select()
// 					.from(productOptionValues)
// 					.where(eq(productOptionValues.optionId, option.id))
// 					.execute();

// 				for (const optValue of optionValues) {
// 					await db
// 						.delete(productVariantOptions)
// 						.where(eq(productVariantOptions.optionValueId, optValue.id))
// 						.execute();
// 				}
// 			}

// 			// Delete the options themselves
// 			await db.delete(productOptions).where(eq(productOptions.productId, productId)).execute();

// 			// Create new options and values if provided
// 			if (input.options.length > 0) {
// 				for (const option of input.options) {
// 					const optionId = nanoid();

// 					// Create option
// 					await db
// 						.insert(productOptions)
// 						.values({
// 							id: optionId,
// 							productId,
// 							name: option.name,
// 						})
// 						.execute();

// 					// Create option values
// 					for (const [index, value] of option.values.entries()) {
// 						const valueId = nanoid();
// 						await db
// 							.insert(productOptionValues)
// 							.values({
// 								id: nanoid(),
// 								optionId,
// 								value: value.value,
// 								position: value.position || index + 1,
// 								// variantId: variantIds,
// 							})
// 							.execute();
// 						optionsId.push(valueId);
// 					}
// 				}
// 			}
// 		}

// 		if (input.variants && input.variants.length > 0) {
// 			for (const variant of input.variants) {
// 				const variantId = nanoid();

// 				const newVariant: ProductVariant = {
// 					id: variantId,
// 					productId,
// 					title: variant.title,
// 					sku: variant.sku || null,
// 					stock: variant.stock !== undefined ? variant.stock : 0,
// 					optionValues: optionsId,
// 					price: variant.price.toString(),
// 					compareAtPrice: variant.compareAtPrice ? variant.compareAtPrice.toString() : null,
// 					costPrice: variant.costPrice ? variant.costPrice.toString() : null,
// 					weight: variant.weight ? variant.weight.toString() : null,
// 					weightUnit: variant.weightUnit || "KG",
// 					createdAt: new Date().toISOString(),
// 					updatedAt: new Date().toISOString(),
// 				};
// 				// Create variant
// 				const updatedVariant = await db.insert(productVariants).values(newVariant).returning().execute();

// 				if (updatedVariant && updatedVariant.length > 0) variantIds.push(updatedVariant[0]?.id || "");

// 				//
// 				// Add variant images if provided
// 				if (variant.images && variant.images.length > 0) {
// 					await db
// 						.insert(productImage)
// 						.values(
// 							variant.images.map((image, index) => ({
// 								id: nanoid(),
// 								productId,
// 								productVariantId: variantId,
// 								url: image.url,
// 								alt: image.alt || null,
// 								position: image.position || index,
// 								createdAt: new Date().toISOString(),
// 							})),
// 						)
// 						.execute();
// 				}
// 			}
// 		}

// 		// const productvariantOptions: ProductVariantOptions = {
// 		// 	id: nanoid(),
// 		// 	variantId: variantIds,
// 		// 	optionValueId: optionsId,
// 		// };
// 		// db.insert(productVariantOptions).values(productvariantOptions);

// 		// Update options and option values if provided
// 		// if (input.options !== undefined) {
// 		// 	// Get existing options for this product
// 		// 	const existingOptions = await db
// 		// 		.select()
// 		// 		.from(productOptions)
// 		// 		.where(eq(productOptions.productId, productId))
// 		// 		.execute();

// 		// 	// Delete existing options and their values
// 		// 	for (const option of existingOptions) {
// 		// 		// Delete option values first (foreign key constraint)
// 		// 		await db.delete(productOptionValues).where(eq(productOptionValues.optionId, option.id)).execute();
// 		// 	}

// 		// 	// Delete the options themselves
// 		// 	await db.delete(productOptions).where(eq(productOptions.productId, productId)).execute();

// 		// 	// Create new options and values if provided
// 		// 	if (input.options.length > 0) {
// 		// 		for (const option of input.options) {
// 		// 			const optionId = nanoid();

// 		// 			// Create option
// 		// 			await db
// 		// 				.insert(productOptions)
// 		// 				.values({
// 		// 					id: optionId,
// 		// 					productId,
// 		// 					name: option.name,
// 		// 				})
// 		// 				.execute();

// 		// 			// Create option values
// 		// 			for (const [index, value] of option.values.entries()) {
// 		// 				await db
// 		// 					.insert(productOptionValues)
// 		// 					.values({
// 		// 						id: nanoid(),
// 		// 						optionId,
// 		// 						value: value.value,
// 		// 						position: value.position || index + 1,
// 		// 					})
// 		// 					.execute();
// 		// 			}
// 		// 		}
// 		// 	}
// 		// }

// 		// // Update variants if provided
// 		// if (input.variants !== undefined) {
// 		// 	// Get existing variants for this product
// 		// 	const existingVariants = await db
// 		// 		.select()
// 		// 		.from(productVariants)
// 		// 		.where(eq(productVariants.productId, productId))
// 		// 		.execute();

// 		// 	// Delete existing variants and their images
// 		// 	for (const variant of existingVariants) {
// 		// 		// Delete variant images first
// 		// 		await db.delete(productImage).where(eq(productImage.productVariantId, variant.id)).execute();
// 		// 	}

// 		// 	// Delete the variants themselves
// 		// 	await db.delete(productVariants).where(eq(productVariants.productId, productId)).execute();

// 		// 	// Create new variants if provided
// 		// 	if (input.variants.length > 0) {
// 		// 		for (const variant of input.variants) {
// 		// 			const variantId = nanoid();

// 		// 			const newVariant: ProductVariant = {
// 		// 				id: variantId,
// 		// 				productId,
// 		// 				title: variant.title,
// 		// 				sku: variant.sku || null,
// 		// 				stock: variant.stock,
// 		// 				price: variant.price.toString(),
// 		// 				costPrice: input.costPrice?.toString() || null,
// 		// 				compareAtPrice: input.compareAtPrice?.toString() || null,
// 		// 				weightUnit: input.weightUnit || "KG",
// 		// 				weight: input.weight?.toString() || null,
// 		// 				createdAt: new Date().toISOString(),
// 		// 				updatedAt: new Date().toISOString(),
// 		// 			};

// 		// 			// Create variant
// 		// 			await db.insert(productVariants).values(newVariant).execute();

// 		// 			// Add variant images if provided
// 		// 			if (variant.images && variant.images.length > 0) {
// 		// 				await db
// 		// 					.insert(productImage)
// 		// 					.values(
// 		// 						variant.images.map((image, index) => ({
// 		// 							id: nanoid(),
// 		// 							productId,
// 		// 							productVariantId: variantId,
// 		// 							url: image.url,
// 		// 							alt: image.alt || null,
// 		// 							position: image.position || index,
// 		// 							createdAt: new Date().toISOString(),
// 		// 						})),
// 		// 					)
// 		// 					.execute();
// 		// 			}
// 		// 		}
// 		// 	}
// 		// }

// 		return { product: updatedProduct[0] || null };
// 	} catch (error) {
// 		console.error("Error updating product:", error);
// 		return { product: null, error: error instanceof Error ? error.message : "Unknown error occurred" };
// 	}
// }

// Types for product creation

/**
 * Create a new product
 */
export async function createProduct(values: ProductFormValues) {
	console.log("productFrom:", values);
	const productId = nanoid();

	try {
		// Validate form input
		const validatedFields = productSchema.parse(values);

		// Generate slug if not provided
		const slug = validatedFields.slug || slugify(validatedFields.name);

		// Check if slug exists
		const existingProduct = await db.query.products.findFirst({
			where: eq(products.slug, slug),
		});

		if (existingProduct) {
			return {
				error: "A product with this slug already exists.",
			};
		}

		// Create main product record - we'll create each entity separately without a transaction
		const newProduct: Product = {
			id: productId,
			name: validatedFields.name,
			slug,
			description: validatedFields.description || null,
			status: validatedFields.status,
			sku: validatedFields.sku || null,
			price: Number(validatedFields.price), // Convert price to number
			compareAtPrice: validatedFields.compareAtPrice ? Number(validatedFields.compareAtPrice) : null,
			costPrice: validatedFields.costPrice ? Number(validatedFields.costPrice) : null,
			weight: validatedFields.weight ? Number(validatedFields.weight) : null,
			weightUnit: validatedFields.weightUnit || "KG",
			stock: validatedFields.stock,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Insert the main product
		await db.insert(products).values(newProduct);

		// Add product categories if provided
		if (validatedFields.categories && validatedFields.categories.length > 0) {
			const categoryValues = validatedFields.categories.map((categoryId) => ({
				id: nanoid(),
				productId,
				categoryId,
			}));

			await db.insert(productCategories).values(categoryValues);
		}

		if (validatedFields.images && validatedFields.images.length > 0) {
			await db
				.insert(productImage)
				.values(
					validatedFields.images.map((image, index) => ({
						id: nanoid(),
						productId,
						url: image.url,
						alt: image.alt || null,
						position: image.position || index,
						createdAt: new Date().toISOString(),
					})),
				)
				.execute();
		}

		// Create metadata if provided
		if (validatedFields.metaData) {
			await db.insert(metaData).values({
				id: nanoid(),
				productId,
				title: validatedFields.metaData.title,
				description: validatedFields.metaData.description,
			});
		}

		// Create options and variants if provided
		if (validatedFields.options && validatedFields.options.length > 0) {
			// Map to track option IDs by name
			const optionIdsByName = new Map<string, string>();

			// Create options
			for (const [index, option] of validatedFields.options.entries()) {
				const optionId = nanoid();
				optionIdsByName.set(option.name, optionId);

				await db.insert(productOptions).values({
					id: optionId,
					productId,
					name: option.name,
					position: index + 1,
				});

				// Create option values
				for (const [valueIndex, value] of option.values.entries()) {
					const newProuctOptionValue: ProductOptionValue = {
						id: nanoid(),
						optionId,
						value: value.value,
						position: value.position || valueIndex + 1,
					};
					await db.insert(productOptionValues).values(newProuctOptionValue);
				}
			}

			// Create variants if provided
			if (validatedFields.variants && validatedFields.variants.length > 0) {
				for (const variant of validatedFields.variants) {
					const variantId = nanoid();

					// Create variant
					await db.insert(productVariants).values({
						id: variantId,
						productId,
						title: variant.title,
						sku: variant.sku,
						price: Number(validatedFields.price), // Convert price to number
						compareAtPrice: validatedFields.compareAtPrice ? Number(validatedFields.compareAtPrice) : null,
						costPrice: validatedFields.costPrice ? Number(validatedFields.costPrice) : null,
						weight: validatedFields.weight ? Number(validatedFields.weight) : null,
						weightUnit: variant.weightUnit,
						stock: variant.stock,
						updatedAt: new Date().toISOString(),
						createdAt: new Date().toISOString(),
					});

					// Add variant images if provided
					if (variant.images && variant.images.length > 0) {
						await db
							.insert(productImage)
							.values(
								variant.images.map((image, index) => ({
									id: nanoid(),
									productId,
									productVariantId: variantId,
									url: image.url,
									alt: image.alt || null,
									position: image.position || index,
									createdAt: new Date().toISOString(),
								})),
							)
							.execute();
					}

					// Create variant options
					if (variant.options) {
						console.log("optionIdsByName:", optionIdsByName);
						for (const variantOption of variant.options) {
							const optionId = optionIdsByName.get(variantOption.name);

							if (!optionId) {
								continue;
							}

							// Find the option value ID
							const optionValue = await db.query.productOptionValues.findFirst({
								where: (table) => eq(table.optionId, optionId) && eq(table.value, variantOption.value),
							});

							if (optionValue) {
								await db.insert(productVariantOptions).values({
									id: nanoid(),
									variantId,
									optionValueId: optionValue.id,
								});
							}
						}
					}
				}
			}
		}

		revalidatePath("/admin/products");

		return {
			success: true,
			productId,
		};
	} catch (error) {
		console.error("Error creating product:", error);

		// Handle errors and attempt cleanup if possible
		if (error instanceof z.ZodError) {
			return {
				error: error.flatten().fieldErrors,
			};
		}

		// For other errors, try to delete the product if it was created
		try {
			await db.delete(products).where(eq(products.id, productId));
		} catch (cleanupError) {
			console.error("Failed to clean up after error:", cleanupError);
		}

		return {
			error: "Failed to create product. Please try again.",
		};
	}
}
/**
 * Update an existing product
 */

export async function updateProduct(productId: string, values: ProductFormValues) {
	console.log("productFrom:", values);
	try {
		// Validate form input
		const validatedFields = productSchema.parse(values);

		// Get existing product
		const existingProduct = await db.query.products.findFirst({
			where: eq(products.id, productId),
		});

		if (!existingProduct) {
			return {
				error: "Product not found.",
			};
		}

		// Generate slug if not provided or if name changed
		let slug = existingProduct.slug;
		if (validatedFields.slug) {
			slug = validatedFields.slug;
		} else if (validatedFields.name !== existingProduct.name) {
			slug = slugify(validatedFields.name);
		}

		// Check if slug exists (if changed)
		if (slug !== existingProduct.slug) {
			const slugExists = await db.query.products.findFirst({
				where: eq(products.slug, slug),
			});

			if (slugExists) {
				return {
					error: "A product with this slug already exists.",
				};
			}
		}

		const now = new Date().toISOString();

		// 1. Update main product record
		await db
			.update(products)
			.set({
				name: validatedFields.name,
				slug,
				description: validatedFields.description || null,
				status: validatedFields.status,
				sku: validatedFields.sku || null,
				price: Number(validatedFields.price), // Convert price to number
				compareAtPrice: validatedFields.compareAtPrice ? Number(validatedFields.compareAtPrice) : null,
				costPrice: validatedFields.costPrice ? Number(validatedFields.costPrice) : null,
				weight: validatedFields.weight ? Number(validatedFields.weight) : null,
				weightUnit: validatedFields.weightUnit || "KG",
				stock: validatedFields.stock,
				updatedAt: now,
			})
			.where(eq(products.id, productId));

		// 2. Update categories - delete existing and insert new
		await db.delete(productCategories).where(eq(productCategories.productId, productId));

		if (validatedFields.categories && validatedFields.categories.length > 0) {
			const categoryValues = validatedFields.categories.map((categoryId) => ({
				id: nanoid(),
				productId,
				categoryId,
			}));

			await db.insert(productCategories).values(categoryValues);
		}

		// Update product images if provided
		if (validatedFields.images !== undefined) {
			// Delete existing product-level images
			await db
				.delete(productImage)
				.where(and(eq(productImage.productId, productId), isNull(productImage.productVariantId)))
				.execute();

			// Add new images if any
			if (validatedFields.images.length > 0) {
				await db
					.insert(productImage)
					.values(
						validatedFields.images.map((image, index) => ({
							id: nanoid(),
							productId,
							url: image.url,
							alt: image.alt || null,
							position: image.position || index,
							createdAt: new Date().toISOString(),
						})),
					)
					.execute();
			}
		}

		// 3. Update metadata - delete existing and insert new if provided
		await db.delete(metaData).where(eq(metaData.productId, productId));

		if (validatedFields.metaData) {
			await db.insert(metaData).values({
				id: nanoid(),
				productId,
				title: validatedFields.metaData.title,
				description: validatedFields.metaData.description,
			});
		}

		// 4. Handle options and variants - this is complex as we need to:
		// - Find existing options to keep/remove
		// - Update or create new options
		// - Update or create new variants

		// First get all existing options for reference
		const existingOptions = await db.query.productOptions.findMany({
			where: eq(productOptions.productId, productId),
			with: {
				values: true,
			},
		});

		// Get all existing variants
		const existingVariants = await db.query.productVariants.findMany({
			where: eq(productVariants.productId, productId),
			with: {
				optionValues: true,
			},
		});

		// If new options provided, handle them
		if (validatedFields.options && validatedFields.options.length > 0) {
			// Map to track new option IDs by name
			const optionIdsByName = new Map<string, string>();

			// Delete all existing options and their values
			// (This cascades to variant options too in most DB setups)
			for (const option of existingOptions) {
				// Delete option values first
				await db.delete(productOptionValues).where(eq(productOptionValues.optionId, option.id));
			}

			// Delete options
			await db.delete(productOptions).where(eq(productOptions.productId, productId));

			// Create new options
			for (const [index, option] of validatedFields.options.entries()) {
				const optionId = nanoid();
				optionIdsByName.set(option.name, optionId);

				await db.insert(productOptions).values({
					id: optionId,
					productId,
					name: option.name,
					position: index + 1,
				});

				// Create option values
				for (const [valueIndex, value] of option.values.entries()) {
					await db.insert(productOptionValues).values({
						id: nanoid(),
						optionId,
						value: value.value,
						position: value.position || valueIndex + 1,
					});
				}
			}

			// Delete all existing variants
			for (const variant of existingVariants) {
				// Delete variant options first
				await db.delete(productVariantOptions).where(eq(productVariantOptions.variantId, variant.id));
			}

			// Delete variants
			await db.delete(productVariants).where(eq(productVariants.productId, productId));

			// Create new variants if provided
			if (validatedFields.variants && validatedFields.variants.length > 0) {
				for (const variant of validatedFields.variants) {
					const variantId = nanoid();

					// Create variant
					await db.insert(productVariants).values({
						id: variantId,
						productId,
						title: variant.title,
						sku: variant.sku,
						price: Number(validatedFields.price), // Convert price to number
						compareAtPrice: validatedFields.compareAtPrice ? Number(validatedFields.compareAtPrice) : null,
						costPrice: validatedFields.costPrice ? Number(validatedFields.costPrice) : null,
						weight: validatedFields.weight ? Number(validatedFields.weight) : null,
						weightUnit: variant.weightUnit,
						stock: variant.stock,
						createdAt: now,
						updatedAt: now,
					});

					if (variant.images && variant.images.length > 0) {
						await db
							.insert(productImage)
							.values(
								variant.images.map((image, index) => ({
									id: nanoid(),
									productId,
									productVariantId: variantId,
									url: image.url,
									alt: image.alt || null,
									position: image.position || index,
									createdAt: new Date().toISOString(),
								})),
							)
							.execute();
					}

					// Create variant options
					if (variant.options) {
						for (const variantOption of variant.options) {
							const optionId = optionIdsByName.get(variantOption.name);

							console.log("optionId", optionId);
							if (!optionId) {
								continue;
							}

							// Find the option value ID
							const optionValue = await db.query.productOptionValues.findFirst({
								with: {
									productOption: true,
								},
								where: (table) => eq(table.optionId, optionId) && eq(table.value, variantOption.value),
							});

							console.log("optionValue", optionValue);

							if (optionValue) {
								await db.insert(productVariantOptions).values({
									id: nanoid(),
									variantId,
									optionValueId: optionValue.id,
								});
							}
						}
					}
				}
			}
		} else if (validatedFields.options?.length === 0) {
			// If options array is empty, delete all existing options and variants

			// Delete variants first
			for (const variant of existingVariants) {
				await db.delete(productVariantOptions).where(eq(productVariantOptions.variantId, variant.id));
			}

			await db.delete(productVariants).where(eq(productVariants.productId, productId));

			// Then delete options
			for (const option of existingOptions) {
				await db.delete(productOptionValues).where(eq(productOptionValues.optionId, option.id));
			}

			await db.delete(productOptions).where(eq(productOptions.productId, productId));
		}

		revalidatePath("/admin/products");
		revalidatePath(`/admin/products/${productId}`);

		return {
			success: true,
			productId,
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: error.flatten().fieldErrors,
			};
		}

		console.error("Failed to update product:", error);

		return {
			error: "Failed to update product. Please try again.",
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
	try {
		const product = await db.query.products.findFirst({
			where: eq(products.id, id),
			with: {
				productImages: true,
				productVariants: {
					with: {
						productImages: true,
					},
				},
				productCategories: {
					with: {
						category: true,
					},
				},
				productOptions: {
					with: {
						values: true,
					},
				},
				metaData: true,
			},
		});

		if (!product) {
			throw new Error("Product not found");
		}

		return product;
	} catch (error) {
		console.error("Error getting product by id:", error);
		throw new Error("Failed to get product");
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
			where: eq(products.slug, slug),
			with: {
				productImages: true,
				productOptions: {
					with: {
						values: {
							with: {
								productVariantOptions: {
									with: {
										productVariant: {
											columns: {
												id: true,
											},
										},
									},
								},
							},
						},
					},
				},
				productCategories: {
					with: {
						category: true,
					},
				},
				productVariants: {
					with: {
						optionValues: {
							with: {
								productOptionValue: true,
							},
						},
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

export async function getProductVariantsByProductId(productId: string) {
	noStore();
	try {
		const data = await db.query.productVariants.findMany({
			where: eq(productVariants.productId, productId),
			with: {
				productImages: true,
				optionValues: {
					with: {
						productOptionValue: {
							with: {
								productOption: {
									with: {
										values: true,
									},
								},
							},
						},
					},
				},
			},
		});
		// console.log("data", data);

		return data || null;
	} catch (error) {
		console.error("Error fetching product by slug:", error);
		throw new Error("Failed to fetch product by slug");
	}
}

export async function getProductsByCategory(categorySlug: string) {
	noStore();
	try {
		const category = await db.query.categories
			.findFirst({
				where: eq(categories.slug, categorySlug),
				with: {
					productCategories: {
						with: {
							product: {
								with: {
									productImages: true,
								},
							},
						},
					},
				},
			})
			.execute();
		if (!category) {
			return null;
		}

		return category.productCategories.map((productCategory) => productCategory.product) || null;
	} catch (error) {
		console.error("Error fetching products by category:", error);
		throw new Error("Failed to fetch products by category");
	}
}
