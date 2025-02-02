import { db } from "@/db"
import { products } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

export const psGetProductsById = db
  .select()
  .from(products)
  .where(eq(products.id, sql.placeholder("id")))
  .prepare("psGetProductsById")

export const psGetAllProducts = db
  .select()
  .from(products)
  .prepare("psGetAllProducts")
