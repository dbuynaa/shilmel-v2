// lib/validations/product.ts
import { ProductStatusEnum } from "@/types/types";
import * as z from "zod";

const optionValueSchema = z.object({
	value: z.string().min(1, "Option value is required"),
	position: z.number().optional(),
});

const productOptionSchema = z.object({
	name: z.string().min(1, "Option name is required"),
	values: z.array(optionValueSchema).min(1, "At least one option value is required"),
});

const inventorySchema = z.object({
	price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
	compareAtPrice: z.coerce
		.number()
		.min(0, { message: "Compare at price must be a positive number" })
		.optional(),
	costPrice: z.coerce.number().min(0, { message: "Cost price must be a positive number" }).optional(),
	sku: z.string().max(100).optional(),
	inventoryQuantity: z.coerce
		.number()
		.int({ message: "Quantity must be a whole number" })
		.min(0, { message: "Quantity must be a positive number" }),
	weightUnit: z.enum(["KG", "G", "LB", "OZ"]).optional(),
	weight: z.coerce.number().min(0, { message: "Weight must be a positive number" }).optional().nullable(),
	requiresShipping: z.boolean().optional(),
	isTaxable: z.boolean().optional(),
});

const variantSchema = z.object({
	title: z.string().optional(),
	...inventorySchema.shape,
	optionValues: z
		.array(
			z.object({
				id: z.string(),
			}),
		)
		.optional(),
});

const productSchema = z.object({
	title: z.string().min(1, "Title is required"),
	slug: z.string().min(1, "Handle is required"),
	description: z.string().optional(),
	isPublished: z.boolean().optional(),
	options: z.array(productOptionSchema),
	variants: z.array(variantSchema),
	status: z.nativeEnum(ProductStatusEnum),
	...inventorySchema.shape,
	featured: z.boolean().optional(),
	images: z
		.array(
			z.object({
				url: z.string(),
				alt: z.string().optional(),
				position: z.number(),
			}),
		)
		.optional(),
	categories: z.array(z.string()).optional(),
	metaData: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
		})
		.optional(),
});

export { productSchema, productOptionSchema, optionValueSchema, variantSchema };
export type ProductFormValues = z.infer<typeof productSchema>;
