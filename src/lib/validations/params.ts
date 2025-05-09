import { z } from "zod";

export const searchParamsSchema = z.object({
	name: z.string().optional(),
	page: z.coerce.number().default(1),
	per_page: z.coerce.number().default(10),
	from: z.string().optional(),
	to: z.string().optional(),
	sort: z.string().optional().default("createdAt.desc"),
});

export const categoriesSearchParamsSchema = searchParamsSchema.extend({
	name: z.string().optional(),
	description: z.string().optional(),
});

export const warehousesSearchParamsSchema = searchParamsSchema.extend({
	name: z.string().optional(),
	type: z.string().optional(),
	description: z.string().optional(),
	location: z.string().optional(),
});
