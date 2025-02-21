import { redirect, RedirectType } from "next/navigation"
import type { Metadata } from "next/types"
import { env } from "@/env"
import { getTranslations } from "@/i18n/server"

import { Search } from "@/lib/api"
import { ProductList } from "@/components/store/products/product-list"
import { ProductNotFound } from "@/components/store/products/product-not-found"

export const generateMetadata = async (props: {
  searchParams: Promise<{
    q?: string
  }>
}): Promise<Metadata> => {
  const searchParams = await props.searchParams
  const t = await getTranslations("/search.metadata")
  return {
    title: t("title", { query: searchParams.q }),
    alternates: { canonical: `${env.NEXT_PUBLIC_APP_URL}/search` },
  }
}

export default async function SearchPage(props: {
  searchParams: Promise<{
    q?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams.q

  if (!query) {
    return redirect("/", RedirectType.replace)
  }

  const t = await getTranslations("/search.page")

  const products = await Search.searchProducts(query)

  return (
    <main>
      <h1 className="text-foreground text-3xl leading-none font-bold tracking-tight">
        {t("title", { query })}
      </h1>
      {products?.length ? (
        <ProductList products={products} />
      ) : (
        <ProductNotFound query={query} />
      )}
    </main>
  )
}
