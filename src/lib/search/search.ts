import { db } from "@/db";
import type { ProductWithVariants } from "@/db/types";
import { unstable_cache } from "next/cache";

import { simpleSearch } from "./simplesearch";

export const searchProducts = unstable_cache(
	async (query: string): Promise<ProductWithVariants[]> => {
		const products = await db.query.products.findMany({
			limit: 100,
			with: { productImages: true, productVariants: { with: { productImages: true } } },
		});
		const searchResults = simpleSearch(products, query);
		return searchResults
			.map((sr) => products.find((p) => p.id === sr.id))
			.filter((p): p is ProductWithVariants => p !== undefined);
	},
	["search", "products"],
	{
		tags: ["search", "products"],
	},
);
