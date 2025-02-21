import type { MetadataRoute } from "next"
import { db } from "@/db"
import { env } from "@/env"

type Item = MetadataRoute.Sitemap[number]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dbProducts = await db.query.products.findMany({
    limit: 100,
  })
  const categories = await db.query.products.findMany({
    limit: 100,
  })

  const productUrls = dbProducts.map(
    (product) =>
      ({
        url: `${env.NEXT_PUBLIC_APP_URL}/product/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: "daily",
        priority: 0.8,
      }) satisfies Item
  )

  const categoryUrls = categories.map(
    (category) =>
      ({
        url: `${env.NEXT_PUBLIC_APP_URL}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.5,
      }) satisfies Item
  )

  return [
    {
      url: env.NEXT_PUBLIC_APP_URL,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    ...productUrls,
    ...categoryUrls,
  ]
}
