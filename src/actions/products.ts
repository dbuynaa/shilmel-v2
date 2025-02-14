"use server"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { categories, products, type Product } from "@/db/schema"
import { eq } from "drizzle-orm"

import { deslugify } from "@/lib/utils"

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  noStore()
  try {
    // First get the category ID from the slug
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, deslugify(categorySlug).toLowerCase()))

    if (!category) {
      return []
    }

    // Then get all products in that category
    const results = await db
      .select()
      .from(products)
      .where(eq(products.categoryId, category.id))

    return results
  } catch (error) {
    console.error("Error fetching products by category:", error)
    throw new Error("Failed to fetch products by category")
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  noStore()
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, deslugify(slug).toLowerCase()))

    return product || null
  } catch (error) {
    console.error("Error fetching product by slug:", error)
    throw new Error("Failed to fetch product by slug")
  }
}
