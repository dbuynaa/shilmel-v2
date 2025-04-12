"use server";

import { db } from "@/db";
import { type Product, categories, products } from "@/db/schema";
import type { SearchParams } from "@/types";
import { searchParamsSchema } from "@/validations/params";
import { asc, desc, eq, like } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

import { deslugify } from "@/lib/utils";

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

export async function getProductsByCategory(categorySlug: string) {
	noStore();
	try {
		// First get the category ID from the slug
		const [category] = await db.select().from(categories).where(eq(categories.slug, categorySlug));

		if (!category) {
			return [];
		}

		// Then get all products in that category
		const results = await db.query.products.findMany({
			where: eq(products.categoryId, category.id),
			with: {
				category: true,
				variants: {
					with: {
						images: true,
					},
				},
			},
		});

		return results;
	} catch (error) {
		console.error("Error fetching products by category:", error);
		throw new Error("Failed to fetch products by category");
	}
}

export async function getProductBySlug(slug: string) {
	noStore();
	try {
		const product = await db.query.products.findFirst({
			where: eq(products.slug, deslugify(slug).toLowerCase()),
			with: {
				category: true,
				variants: {
					with: {
						images: true,
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
