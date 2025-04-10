import { db } from "@/db";
import type { ProudctWithVariants } from "@/db/schema";
import { unstable_cache } from "next/cache";

import { simpleSearch } from "./simplesearch";

export const searchProducts = unstable_cache(
	async (query: string): Promise<ProudctWithVariants[]> => {
		const products = await db.query.products.findMany({
			limit: 100,
			with: { variants: { with: { images: true } }, category: true },
		});
		const searchResults = simpleSearch(products, query);
		return searchResults
			.map((sr) => products.find((p) => p.id === sr.id))
			.filter((p): p is ProudctWithVariants => p !== undefined);
	},
	["search", "products"],
	{
		tags: ["search", "products"],
	},
);
