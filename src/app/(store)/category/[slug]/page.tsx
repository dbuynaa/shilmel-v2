import type { Metadata } from "next/types"
import { getProductsByCategory } from "@/actions/products"
import { env } from "@/env"
import { getTranslations } from "@/i18n/server"

import { deslugify } from "@/lib/utils"
import { ProductList } from "@/components/store/products/product-list"

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> => {
  const params = await props.params
  const t = await getTranslations("/category.metadata")

  return {
    title: t("title", { categoryName: deslugify(params.slug) }),
    alternates: {
      canonical: `${env.NEXT_PUBLIC_APP_URL}/category/${params.slug}`,
    },
  }
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const products = await getProductsByCategory(params.slug)

  const t = await getTranslations("/category.page")

  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center pb-8 text-center">
        <h1 className="text-foreground text-3xl leading-none font-bold tracking-tight">
          {deslugify(params.slug)}
          <div className="text-muted-foreground text-lg font-semibold">
            No products found
          </div>
        </h1>
      </div>
    )
  }

  return (
    <main className="pb-8">
      <h1 className="text-foreground text-3xl leading-none font-bold tracking-tight">
        {deslugify(params.slug)}
        <div className="text-muted-foreground text-lg font-semibold">
          {t("title", { categoryName: deslugify(params.slug) })}
        </div>
      </h1>
      <ProductList products={products} />
    </main>
  )
}
