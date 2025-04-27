import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

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

export const psGetAllCategories = db.select().from(categories).prepare("psGetAllCategories");

// ITEMS
export const psGetItemByName = db
	.select()
	.from(products)
	.where(eq(products.name, sql.placeholder("name")))
	.prepare("psGetItemByName");

export const psGetItemById = db
	.select()
	.from(products)
	.where(eq(products.id, sql.placeholder("id")))
	.prepare("psGetItemById");

export const psGetAllItems = db.select().from(products).prepare("psGetAllItems");
