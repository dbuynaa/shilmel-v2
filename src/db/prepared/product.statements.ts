import { db } from "@/db"
import { products, productVariants } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

export const psGetProductsById = db.query.products
  .findMany({
    where: eq(products.id, sql.placeholder("id")),
    with: {
      variants: {
        // where: eq(productVariants.sku, sql.placeholder("sku")),
        with: {
          images: true,
        },
      },
    },
  })
  .prepare("psGetProductsById")
// .select()
// .from(products)
// .where(eq(products.id, sql.placeholder("id")))
// .prepare("psGetProductsById")

// export const psGetAllProducts = db
//   .select()
//   .from(products)
//   .offset(sql.placeholder("offset"))
//   .limit(sql.placeholder("limit"))
//   .prepare("psGetAllProducts")

export const psGetProductVariantBySku = db.query.productVariants
  .findMany({
    where: eq(productVariants.sku, sql.placeholder("sku")),
    with: {
      images: true,
      product: true,
    },
  })
  .prepare("psGetProductVariantBySku")

export const psGetAllProducts = db.query.products
  .findMany({
    limit: sql.placeholder("limit"),
    offset: sql.placeholder("offset"),
    with: {
      variants: {
        with: {
          images: true,
        },
      },
    },
  })
  .prepare("psGetAllProducts")

export const psDeleteProduct = db
  .delete(products)
  .where(eq(products.id, sql.placeholder("id")))
  .prepare("psDeleteProduct")
