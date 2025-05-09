import { z } from "zod";

export const profileFormSchema = z.object({
	name: z.string().min(2).max(50),
	email: z.string().email(),
	image: z.string().url().optional(),
});
