import type { Metadata } from "next/types"
import { publicUrl } from "@/env"
import { getTranslations } from "@/i18n/server"

// import * as Commerce from "commerce-kit"

import { ProductList } from "@/components/store/products/product-list"

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("/products.metadata")
  return {
    title: t("title"),
    alternates: { canonical: `${publicUrl}/products` },
  }
}

export default async function AllProductsPage() {
  const products = await Commerce.productBrowse({ first: 100 })
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
