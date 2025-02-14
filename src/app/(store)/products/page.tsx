import type { Metadata } from "next/types"
import { psGetAllProducts } from "@/db/prepared/product.statements"
import { env } from "@/env"
import { getTranslations } from "@/i18n/server"

// import * as Commerce from "commerce-kit"

import { ProductList } from "@/components/store/products/product-list"

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("/products.metadata")
  return {
    title: t("title"),
    alternates: { canonical: `${env.NEXT_PUBLIC_APP_URL}/products` },
  }
}

export default async function AllProductsPage() {
  const products = await psGetAllProducts.execute({
    offset: 0,
    limit: 10,
  })
  const t = await getTranslations("/products.page")

  return (
    <main className="pb-8">
      <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
        {t("title")}
      </h1>
      <ProductList products={products} />
    </main>
  )
}
