"use server";

import { db } from "@/db";

import {
	type AddCategoryFormInput,
	type DeleteCategoryFormInput,
	type GetCategoryByIdFormInput,
	type GetCategoryByNameFormInput,
	type GetCategoryBySlugFormInput,
	type UpdateCategoryFormInput,
	categorySchema,
	deleteCategorySchema,
	getCategoryByIdSchema,
	getCategoryByNameSchema,
	getCategoryBySlugSchema,
	updateCategorySchema,
} from "@/validations/inventory";
import { eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

import {
	psGetAllCategories,
	psGetCategoryById,
	psGetCategoryByName,
	psGetCategoryBySlug,
} from "@/db/prepared/category.statements";
import { categories } from "@/db/schema";
import type { Category } from "@/db/types";
import { slugify } from "@/lib/utils";

export async function getCategoryByName(rawInput: GetCategoryByNameFormInput): Promise<Category | null> {
	const validatedInput = getCategoryByNameSchema.safeParse(rawInput);
	if (!validatedInput.success) return null;

	try {
		noStore();
		const [category] = await psGetCategoryByName.execute({
			name: validatedInput.data.name.toLowerCase().trim(),
		});

		return category || null;
	} catch (error) {
		console.error(error);
		throw new Error("Error getting category by name");
	}
}

export async function getCategoryById(rawInput: GetCategoryByIdFormInput): Promise<Category | null> {
	const validatedInput = getCategoryByIdSchema.safeParse(rawInput);
	if (!validatedInput.success) return null;

	try {
		noStore();
		const [category] = await psGetCategoryById.execute({
			id: validatedInput.data.id,
		});
		return category || null;
	} catch (error) {
		console.error(error);
		throw new Error("Error getting category by id");
	}
}

export async function getCategoryBySlug(rawInput: GetCategoryBySlugFormInput): Promise<Category | null> {
	const validatedInput = getCategoryBySlugSchema.safeParse(rawInput);
	if (!validatedInput.success) return null;

	try {
		noStore();
		const [category] = await psGetCategoryBySlug.execute({
			slug: validatedInput.data.slug,
		});
		return category || null;
	} catch (error) {
		console.error(error);
		throw new Error("Error getting category by slug");
	}
}

export async function getAllCategories(): Promise<Category[] | null> {
	try {
		noStore();
		const categories = await psGetAllCategories.execute();
		return categories || null;
	} catch (error) {
		console.error(error);
		throw new Error("Error getting all categories");
	}
}

export async function addCategory(
	rawInput: AddCategoryFormInput,
): Promise<"invalid-input" | "exists" | "error" | "success"> {
	const validatedInput = categorySchema.safeParse(rawInput);
	if (!validatedInput.success) return "invalid-input";

	try {
		const existingCategory = await getCategoryByName({
			name: validatedInput.data.name.trim(),
		});
		if (existingCategory) return "exists";

		// TODO: Replace with prepared statement
		const newCategory = await db
			.insert(categories)
			.values({
				id: crypto.randomUUID(),
				name: validatedInput.data.name.trim(),
				slug: slugify(validatedInput.data.name.toLowerCase().trim()),
				position: 0,
				updatedAt: new Date().toISOString(),
				createdAt: new Date().toISOString(),
				description: validatedInput.data.description,
			})
			.returning();

		return newCategory ? "success" : "error";
	} catch (error) {
		console.error(error);
		throw new Error("Error adding new category");
	}
}

export async function deleteCategory(
	rawInput: DeleteCategoryFormInput,
): Promise<"invalid-input" | "success" | "error"> {
	const validatedInput = deleteCategorySchema.safeParse(rawInput);
	if (!validatedInput.success) return "invalid-input";

	try {
		// TODO: Replace with prepared statement
		const deletedCategory = await db.delete(categories).where(eq(categories.id, validatedInput.data.id));

		return deletedCategory ? "success" : "error";
	} catch (error) {
		console.error(error);
		throw new Error("Error deleting category");
	}
}

export async function updateCategory(
	rawInput: UpdateCategoryFormInput,
): Promise<"invalid-input" | "exists" | "success" | "error"> {
	const validatedInput = updateCategorySchema.safeParse(rawInput);
	if (!validatedInput.success) return "invalid-input";

	try {
		const existingCategory = await getCategoryByName({
			name: validatedInput.data.name.trim(),
		});

		if (existingCategory && existingCategory.name !== validatedInput.data.name.trim()) return "exists";

		const newCategory = await db
			.update(categories)
			.set({
				name: validatedInput.data.name.trim(),
				description: validatedInput.data.description,
			})
			.where(eq(categories.id, validatedInput.data.id))
			.returning();

		return newCategory ? "success" : "error";
	} catch (error) {
		console.error(error);
		throw new Error("Error updating category");
	}
}
