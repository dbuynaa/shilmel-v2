import * as z from "zod";

// CATEGORIES
export const categorySchema = z.object({
	name: z.string(),
	image: z.string().optional(),
	description: z.string(),
});

export const deleteCategorySchema = z.object({
	id: z.string(),
});

export const getCategoryByIdSchema = z.object({
	id: z.string(),
});

export const getCategoryByNameSchema = z.object({
	name: z.string(),
});

export const updateCategorySchema = categorySchema.extend({
	id: z.string(),
});

export type AddCategoryFormInput = z.infer<typeof categorySchema>;
export type UpdateCategoryFormInput = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryFormInput = z.infer<typeof deleteCategorySchema>;
export type GetCategoryByNameFormInput = z.infer<typeof getCategoryByNameSchema>;
export type GetCategoryByIdFormInput = z.infer<typeof getCategoryByIdSchema>;

// Schema for product variant
const productVariantSchema = z.object({
	id: z.string().optional(),
	size: z.string().optional(),
	color: z.string().optional(),
	material: z.string().optional(),
	stock: z
		.number({
			required_error: "Stock quantity is required",
			invalid_type_error: "Stock quantity must be a number",
		})
		.positive({ message: "Stock quantity must be greater than 0" })
		.min(1, { message: "Stock quantity must be greater than 0" }),
	images: z
		.unknown()
		.array()
		.refine((val) => {
			if (!Array.isArray(val)) return false;
			if (val.some((file) => !(file instanceof File))) return false;
			return true;
		}, "Images must be an array of Files")
		.optional(),
	// images: z
	//   .array(
	//     z.object({
	//       id: z.string(),
	//       name: z.string(),
	//       url: z.string(),
	//     }),
	//     { required_error: "At least one image is required" }
	//   )
	//   .refine((images) => images.length > 0, {
	//     message: "At least one image is required",
	//   }),
});

// Main product schema
export const itemSchema = z.object({
	name: z.string().min(1, "Product name is required"),
	category: z.string().min(1, "Category is required"),
	description: z.string(),
	price: z
		.string({
			required_error: "Base price is required",
			invalid_type_error: "Base price must be a string",
		})
		.regex(/^\d+(\.\d{1,2})?$/, {
			message: "Invalid price format. Use format: 99.99",
		}),
	variants: z
		.array(productVariantSchema)
		.min(1, "At least one variant is required")
		.max(10, "Maximum 10 variants allowed"),
});

// Type inference
export type AddItemFormInput = z.infer<typeof itemSchema>;
export type ProductVariantType = z.infer<typeof productVariantSchema>;

// UNITS
export const unitSchema = z.object({
	name: z.string(),
	abbreviation: z.string(),
});

export type AddUnitFormInput = z.infer<typeof unitSchema>;

// BRANDS
export const brandSchema = z.object({
	name: z.string(),
});

export type AddBrandFormInput = z.infer<typeof brandSchema>;
