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
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .prepare("psGetAllProducts")

export const psDeleteProduct = db
  .delete(products)
  .where(eq(products.id, sql.placeholder("id")))
  .prepare("psDeleteProduct")
