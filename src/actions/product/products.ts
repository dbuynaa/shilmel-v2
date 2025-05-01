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
import type { Product, ProductVariant } from "@/db/types";
import { slugify } from "@/lib/utils";
import type { SearchParams } from "@/types";
import { searchParamsSchema } from "@/validations/params";
import type { productSchema } from "@/validations/product";
import { and, asc, desc, eq, isNull, like } from "drizzle-orm";
import { nanoid } from "nanoid";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import type { z } from "zod";

export type CreateProductInput = z.infer<typeof productSchema>;

export type UpdateProductInput = Partial<CreateProductInput> & {
	id: string;
	slug?: string;
};

export async function createProduct(
	input: z.infer<typeof productSchema>,
): Promise<{ product: Product | null; error?: string }> {
	try {
		const productId = nanoid();
		const slug = slugify(input.name);

		const newProduct: Product = {
			id: productId,
			name: input.name,
			stock: input.stock,
			description: input.description || null,
			slug,
			sku: input.sku || null,
			price: input.price.toString(),
			costPrice: input.costPrice?.toString() || null,
			compareAtPrice: input.compareAtPrice?.toString() || null,
			weightUnit: input.weightUnit || "KG",
			weight: input.weight?.toString() || null,
			status: input.status || "DRAFT",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		// Create the product
		const product = await db.insert(products).values(newProduct).returning().execute();

		// Add product categories if provided
		if (input.categories && input.categories.length > 0) {
			await db
				.insert(productCategories)
				.values(
					input.categories.map((categoryId) => ({
						id: nanoid(),
						productId,
						categoryId,
					})),
				)
				.execute();
		}

		// Add product images if provided
		if (input.images && input.images.length > 0) {
			await db
				.insert(productImage)
				.values(
					input.images.map((image, index) => ({
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

		// Add meta data if provided
		if (input.metaData) {
			await db
				.insert(metaData)
				.values({
					id: nanoid(),
					productId,
					title: input.metaData.title || null,
					description: input.metaData.description || null,
				})
				.execute();
		}

		// Process options and variants
		// Create product options and their values if provided
		if (input.options && input.options.length > 0) {
			for (const option of input.options) {
				const optionId = nanoid();

				// Create option
				await db
					.insert(productOptions)
					.values({
						id: optionId,
						productId,
						name: option.name,
						// position: option.position || 1,
					})
					.execute();

				// Create option values
				for (const [index, value] of option.values.entries()) {
					const valueId = nanoid();
					await db
						.insert(productOptionValues)
						.values({
							id: valueId,
							optionId,
							value: value.value,
							position: value.position || index + 1,
						})
						.execute();
				}
			}
		}

		// Create product variants if provided
		if (input.variants && input.variants.length > 0) {
			for (const variant of input.variants) {
				const variantId = nanoid();

				const newVariant: ProductVariant = {
					id: variantId,
					productId,
					title: variant.title,
					sku: variant.sku || null,
					stock: variant.stock !== undefined ? variant.stock : 0,
					price: variant.price.toString(),
					compareAtPrice: variant.compareAtPrice ? variant.compareAtPrice.toString() : null,
					costPrice: variant.costPrice ? variant.costPrice.toString() : null,
					weight: variant.weight?.toString() || null,
					weightUnit: variant.weightUnit || "KG",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				// Create variant
				await db.insert(productVariants).values(newVariant).execute();

				// Link variant options if provided
				if (variant.optionValues) {
					for (const optionValue of variant.optionValues) {
						const optionValueId = optionValue.id;

						if (optionValueId) {
							await db
								.insert(productVariantOptions)
								.values({
									id: nanoid(),
									variantId,
									optionValueId,
								})
								.execute();
						}
					}
				}

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
			}
		}

		return { product: product[0] || null };
	} catch (error) {
		console.error("Error creating product:", error);
		return { product: null, error: error instanceof Error ? error.message : "Unknown error occurred" };
	}
}

export async function updateProduct(
	input: UpdateProductInput,
): Promise<{ product: Product | null; error?: string }> {
	try {
		const slug = input.name ? slugify(input.name) : undefined;
		const productId = input.id;

		// Update the product
		const updateData: Partial<Product> = {
			...(input.name && { name: input.name }),
			...(input.stock !== undefined && { stock: input.stock }),
			...(input.description !== undefined && { description: input.description }),
			...(slug && { slug }),
			...(input.sku !== undefined && { sku: input.sku }),
			...(input.price !== undefined && { price: input.price.toString() }),
			...(input.costPrice !== undefined && { costPrice: input.costPrice.toString() }),
			...(input.compareAtPrice !== undefined && { compareAtPrice: input.compareAtPrice.toString() }),
			...(input.weightUnit && { weightUnit: input.weightUnit }),
			...(input.weight !== undefined && { weight: input.weight.toString() }),
			...(input.status && { status: input.status }),
			updatedAt: new Date().toISOString(),
		};

		// Update product base record
		await db.update(products).set(updateData).where(eq(products.id, productId)).execute();

		// Fetch the updated product
		const updatedProduct = await db.select().from(products).where(eq(products.id, productId)).execute();

		if (!updatedProduct.length) {
			return { product: null, error: "Product not found" };
		}

		// Update product categories if provided
		if (input.categories !== undefined) {
			// First delete existing categories
			await db.delete(productCategories).where(eq(productCategories.productId, productId)).execute();

			// Then add new categories if any
			if (input.categories.length > 0) {
				await db
					.insert(productCategories)
					.values(
						input.categories.map((categoryId) => ({
							id: nanoid(),
							productId,
							categoryId,
						})),
					)
					.execute();
			}
		}

		// Update product images if provided
		if (input.images !== undefined) {
			// Delete existing product-level images
			await db
				.delete(productImage)
				.where(and(eq(productImage.productId, productId), isNull(productImage.productVariantId)))
				.execute();

			// Add new images if any
			if (input.images.length > 0) {
				await db
					.insert(productImage)
					.values(
						input.images.map((image, index) => ({
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

		// Update meta data if provided
		if (input.metaData !== undefined) {
			// Delete existing metadata
			await db.delete(metaData).where(eq(metaData.productId, productId)).execute();

			// Add new metadata if provided
			if (input.metaData) {
				await db
					.insert(metaData)
					.values({
						id: nanoid(),
						productId,
						title: input.metaData.title || null,
						description: input.metaData.description || null,
					})
					.execute();
			}
		}

		// Update options and variants if provided
		if (input.options !== undefined) {
			// Get existing options for this product
			const existingOptions = await db
				.select()
				.from(productOptions)
				.where(eq(productOptions.productId, productId))
				.execute();

			// Delete existing options and their values
			for (const option of existingOptions) {
				// Delete option values first (foreign key constraint)
				await db.delete(productOptionValues).where(eq(productOptionValues.optionId, option.id)).execute();

				// Delete variant options that reference these option values
				// First get all option values for this option
				const optionValues = await db
					.select()
					.from(productOptionValues)
					.where(eq(productOptionValues.optionId, option.id))
					.execute();

				for (const optValue of optionValues) {
					await db
						.delete(productVariantOptions)
						.where(eq(productVariantOptions.optionValueId, optValue.id))
						.execute();
				}
			}

			// Delete the options themselves
			await db.delete(productOptions).where(eq(productOptions.productId, productId)).execute();

			// Create new options and values if provided
			if (input.options.length > 0) {
				for (const option of input.options) {
					const optionId = nanoid();

					// Create option
					await db
						.insert(productOptions)
						.values({
							id: optionId,
							productId,
							name: option.name,
						})
						.execute();

					// Create option values
					for (const [index, value] of option.values.entries()) {
						await db
							.insert(productOptionValues)
							.values({
								id: nanoid(),
								optionId,
								value: value.value,
								position: value.position || index + 1,
							})
							.execute();
					}
				}
			}
		}

		// Create product variants if provided
		if (input.variants && input.variants.length > 0) {
			for (const variant of input.variants) {
				const variantId = nanoid();

				const newVariant: ProductVariant = {
					id: variantId,
					productId,
					title: variant.title,
					sku: variant.sku || null,
					stock: variant.stock !== undefined ? variant.stock : 0,
					price: variant.price.toString(),
					compareAtPrice: variant.compareAtPrice ? variant.compareAtPrice.toString() : null,
					costPrice: variant.costPrice ? variant.costPrice.toString() : null,
					weight: variant.weight ? variant.weight.toString() : null,
					weightUnit: variant.weightUnit || "KG",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				// Create variant
				await db.insert(productVariants).values(newVariant).execute();

				// Link variant options if provided
				if (variant.optionValues && variant.optionValues.length > 0) {
					for (const optionValue of variant.optionValues) {
						const optionValueId = optionValue.id;

						if (optionValueId) {
							await db
								.insert(productVariantOptions)
								.values({
									id: nanoid(),
									variantId,
									optionValueId,
								})
								.execute();
						}
					}
				}

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
			}
		}

		// Update options and option values if provided
		// if (input.options !== undefined) {
		// 	// Get existing options for this product
		// 	const existingOptions = await db
		// 		.select()
		// 		.from(productOptions)
		// 		.where(eq(productOptions.productId, productId))
		// 		.execute();

		// 	// Delete existing options and their values
		// 	for (const option of existingOptions) {
		// 		// Delete option values first (foreign key constraint)
		// 		await db.delete(productOptionValues).where(eq(productOptionValues.optionId, option.id)).execute();
		// 	}

		// 	// Delete the options themselves
		// 	await db.delete(productOptions).where(eq(productOptions.productId, productId)).execute();

		// 	// Create new options and values if provided
		// 	if (input.options.length > 0) {
		// 		for (const option of input.options) {
		// 			const optionId = nanoid();

		// 			// Create option
		// 			await db
		// 				.insert(productOptions)
		// 				.values({
		// 					id: optionId,
		// 					productId,
		// 					name: option.name,
		// 				})
		// 				.execute();

		// 			// Create option values
		// 			for (const [index, value] of option.values.entries()) {
		// 				await db
		// 					.insert(productOptionValues)
		// 					.values({
		// 						id: nanoid(),
		// 						optionId,
		// 						value: value.value,
		// 						position: value.position || index + 1,
		// 					})
		// 					.execute();
		// 			}
		// 		}
		// 	}
		// }

		// // Update variants if provided
		// if (input.variants !== undefined) {
		// 	// Get existing variants for this product
		// 	const existingVariants = await db
		// 		.select()
		// 		.from(productVariants)
		// 		.where(eq(productVariants.productId, productId))
		// 		.execute();

		// 	// Delete existing variants and their images
		// 	for (const variant of existingVariants) {
		// 		// Delete variant images first
		// 		await db.delete(productImage).where(eq(productImage.productVariantId, variant.id)).execute();
		// 	}

		// 	// Delete the variants themselves
		// 	await db.delete(productVariants).where(eq(productVariants.productId, productId)).execute();

		// 	// Create new variants if provided
		// 	if (input.variants.length > 0) {
		// 		for (const variant of input.variants) {
		// 			const variantId = nanoid();

		// 			const newVariant: ProductVariant = {
		// 				id: variantId,
		// 				productId,
		// 				title: variant.title,
		// 				sku: variant.sku || null,
		// 				stock: variant.stock,
		// 				price: variant.price.toString(),
		// 				costPrice: input.costPrice?.toString() || null,
		// 				compareAtPrice: input.compareAtPrice?.toString() || null,
		// 				weightUnit: input.weightUnit || "KG",
		// 				weight: input.weight?.toString() || null,
		// 				createdAt: new Date().toISOString(),
		// 				updatedAt: new Date().toISOString(),
		// 			};

		// 			// Create variant
		// 			await db.insert(productVariants).values(newVariant).execute();

		// 			// Add variant images if provided
		// 			if (variant.images && variant.images.length > 0) {
		// 				await db
		// 					.insert(productImage)
		// 					.values(
		// 						variant.images.map((image, index) => ({
		// 							id: nanoid(),
		// 							productId,
		// 							productVariantId: variantId,
		// 							url: image.url,
		// 							alt: image.alt || null,
		// 							position: image.position || index,
		// 							createdAt: new Date().toISOString(),
		// 						})),
		// 					)
		// 					.execute();
		// 			}
		// 		}
		// 	}
		// }

		return { product: updatedProduct[0] || null };
	} catch (error) {
		console.error("Error updating product:", error);
		return { product: null, error: error instanceof Error ? error.message : "Unknown error occurred" };
	}
}
// export async function updateProduct(
// 	input: UpdateProductInput,
// ): Promise<{ product: Product | null; error?: string }> {
// 	console.log("input", input);
// 	// return { product: null };
// 	try {
// 		const product = await db.transaction(async (tx) => {
// 			const { id, ...data } = input;

// 			// Update product basic information
// 			const updateData: Partial<Product> = {};
// 			if (data.name) updateData.name = data.name;
// 			if (data.slug) updateData.slug = data.slug;
// 			else if (data.name) updateData.slug = slugify(data.name);
// 			if (data.description !== undefined) updateData.description = data.description || null;
// 			if (data.status) updateData.status = data.status;
// 			updateData.updatedAt = new Date().toISOString();

// 			if (Object.keys(updateData).length > 0) {
// 				await tx.update(products).set(updateData).where(eq(products.id, id)).execute();
// 			}

// 			// Update categories if provided
// 			if (data.categories) {
// 				// Remove existing categories
// 				await tx.delete(productCategories).where(eq(productCategories.productId, id)).execute();

// 				// Add new categories
// 				if (data.categories.length > 0) {
// 					await tx
// 						.insert(productCategories)
// 						.values(
// 							data.categories.map((categoryId) => ({
// 								id: nanoid(),
// 								productId: id,
// 								categoryId,
// 							})),
// 						)
// 						.execute();
// 				}
// 			}

// 			// Update images if provided
// 			if (data.images) {
// 				// Remove existing product-level images
// 				await tx
// 					.delete(productImage)
// 					.where(and(eq(productImage.productId, id), sql`${productImage.productVariantId} IS NULL`))
// 					.execute();

// 				// Add new images
// 				if (data.images.length > 0) {
// 					await tx
// 						.insert(productImage)
// 						.values(
// 							data.images.map((image, index) => ({
// 								id: nanoid(),
// 								productId: id,
// 								url: image.url,
// 								alt: image.alt || null,
// 								position: image.position || index,
// 								createdAt: new Date().toISOString(),
// 							})),
// 						)
// 						.execute();
// 				}
// 			}

// 			// Update meta data if provided
// 			if (data.metaData) {
// 				const existingMetaData = await tx.select().from(metaData).where(eq(metaData.productId, id)).execute();

// 				if (existingMetaData.length > 0) {
// 					await tx
// 						.update(metaData)
// 						.set({
// 							title: data.metaData.title !== undefined ? data.metaData.title : existingMetaData[0]?.title,
// 							description:
// 								data.metaData.description !== undefined
// 									? data.metaData.description
// 									: existingMetaData[0]?.description,
// 						})
// 						.where(eq(metaData.productId, id))
// 						.execute();
// 				} else {
// 					await tx
// 						.insert(metaData)
// 						.values({
// 							id: nanoid(),
// 							productId: id,
// 							title: data.metaData.title || null,
// 							description: data.metaData.description || null,
// 						})
// 						.execute();
// 				}
// 			}

// 			// Options and variants require more complex handling
// 			// This is a simplistic approach - in a real app, you might want to handle
// 			// updating existing options/variants rather than replacing them all
// 			if (data.options || data.variants) {
// 				// For simplicity, we'll get the full product data to work with
// 				const updatedProduct = await getProductById(id);
// 				return updatedProduct;
// 			}

// 			// Return the updated product
// 			const updatedProduct = await getProductById(id);

// 			return updatedProduct;
// 		});
// 		return { product: product || null };
// 	} catch (error) {
// 		console.error("Error updating product:", error);
// 		// throw new Error("Failed to update product");
// 		return { product: null, error: error instanceof Error ? error.message : "Unknown error occurred" };
// 	}
// }

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
						productOptionValues: true,
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
						productOptionValues: true,
					},
				},
				productCategories: {
					with: {
						category: true,
					},
				},
				productVariants: {
					with: {
						productImages: true,
						productVariantOptions: {
							with: {
								productVariant: true,
								productOptionValue: true,
							},
						},
					},
				},
			},
		});
		console.log("product", product);
		return product || null;
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

export async function getProductVariantsByProductId(productId: string) {
	noStore();
	try {
		const data = await db.query.productVariants.findMany({
			where: eq(productVariants.productId, productId),
			with: {
				productImages: true,
				productVariantOptions: {
					with: {
						productOptionValue: true,
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
