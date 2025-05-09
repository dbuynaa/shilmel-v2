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

export const getCategoryBySlugSchema = z.object({
	slug: z.string(),
});

export const updateCategorySchema = categorySchema.extend({
	id: z.string(),
});

export type AddCategoryFormInput = z.infer<typeof categorySchema>;
export type UpdateCategoryFormInput = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryFormInput = z.infer<typeof deleteCategorySchema>;
export type GetCategoryByNameFormInput = z.infer<typeof getCategoryByNameSchema>;
export type GetCategoryByIdFormInput = z.infer<typeof getCategoryByIdSchema>;
export type GetCategoryBySlugFormInput = z.infer<typeof getCategoryBySlugSchema>;

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
