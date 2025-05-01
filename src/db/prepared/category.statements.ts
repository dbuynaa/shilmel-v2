import { db } from "@/db";
import { categories } from "@/db/schema/schema";
import { desc, eq, sql } from "drizzle-orm";

export const psGetAllCategories = db
	.select()
	.from(categories)
	.orderBy(desc(categories.createdAt))
	.prepare("psGetAllCategories");

// CATEGORIES
export const psGetCategoryByName = db
	.select()
	.from(categories)
	.where(eq(categories.name, sql.placeholder("name")))
	.prepare("psGetCategoryNyName");

export const psGetCategoryById = db
	.select()
	.from(categories)
	.where(eq(categories.id, sql.placeholder("id")))
	.prepare("psGetCategoryById");

export const psGetCategoryBySlug = db
	.select()
	.from(categories)
	.where(eq(categories.slug, sql.placeholder("slug")))
	.prepare("psGetCategoryBySlug");
