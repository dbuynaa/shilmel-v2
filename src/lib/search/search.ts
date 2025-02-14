// import * as Commerce from "commerce-kit";
import { unstable_cache } from "next/cache"
import { db } from "@/db"
import { products as Product } from "@/db/schema"
import { eq } from "drizzle-orm"

// import { simpleSearch } from "./simplesearch"

export const searchProducts = unstable_cache(
  async (query: string) => {
    const products = await db
      .select()
      .from(Product)
      .where(eq(Product.name, query))
    // const searchResults = simpleSearch(products, query)
    // return searchResults
    //   .map((sr) => products.find((p) => p.id === sr.id))
    //   .filter(Boolean)

    return products
  },
  ["search", "products"],
  {
    tags: ["search", "products"],
  }
)
