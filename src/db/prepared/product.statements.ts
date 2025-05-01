import { db } from "@/db";
import { productVariants, products } from "@/db/schema/schema";
import { eq, sql } from "drizzle-orm";

export const psGetProductById = db.query.products
	.findFirst({
		where: eq(products.id, sql.placeholder("id")),
		with: {
			productVariants: {
				with: {
					productImages: true,
					// productVariantOptions: {
					// 	with: {
					// 		productOptionValue: true,
					// 	},
					// },
				},
			},
			metaData: true,
			productOptions: {
				with: {
					productOptionValues: true,
				},
			},
			productCategories: true,
			productImages: true,
		},
	})
	.prepare("psGetProductById");

export const psGetProductVariantBySku = db.query.productVariants
	.findMany({
		where: eq(productVariants.sku, sql.placeholder("sku")),
		with: {
			productImages: true,
			product: true,
		},
	})
	.prepare("psGetProductVariantBySku");

export const psGetAllProducts = db.query.products
	.findMany({
		limit: sql.placeholder("limit"),
		offset: sql.placeholder("offset"),
		with: {
			productImages: true,
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
			productVariants: {
				with: {
					productImages: true,
				},
			},
		},
	})
	.prepare("psGetAllProducts");

export const psDeleteProduct = db
	.delete(products)
	.where(eq(products.id, sql.placeholder("id")))
	.prepare("psDeleteProduct");
