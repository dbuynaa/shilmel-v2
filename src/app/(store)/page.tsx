import type { Metadata } from "next/types"
import { psGetAllProducts } from "@/db/prepared/product.statements"
import { getTranslations } from "@/i18n/server"
import { getStoreConfig } from "@/store.config"

import { CategoryBox } from "@/components/store/category-box"
import { ProductList } from "@/components/store/products/product-list"
import { YnsLink } from "@/components/store/yns-link"

export const metadata = {
  //   alternates: { canonical: env.NEXT_PUBLIC_SITE_URL },
} satisfies Metadata

export default async function Home() {
  const products = await psGetAllProducts.execute({
    offset: 0,
    limit: 10,
  })
  const t = await getTranslations("/")
  const config = await getStoreConfig()

  return (
    <main>
      <section className="bg-tertiary rounded py-8 sm:py-12">
        <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              {t("hero.title")}
            </h2>
            <p className="text-muted-foreground text-pretty">
              {t("hero.description")}
            </p>
            <YnsLink
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex h-10 items-center justify-center rounded-full px-6 font-medium transition-colors focus:ring-1 focus:outline-hidden"
              href={t("hero.link")}
            >
              {t("hero.action")}
            </YnsLink>
          </div>
          <img
            alt="Cup of Coffee"
            loading="eager"
            // priority={true}
            className="rounded"
            height={450}
            width={450}
            src="https://150597104.v2.pressablecdn.com/wp-content/uploads/2023/02/%EF%BE%8E%EF%BE%9B%EF%BD%B1%EF%BD%B8%EF%BE%98%EF%BE%99%EF%BD%BD%EF%BE%80%EF%BE%9D%EF%BE%84%EF%BE%9E_MUMEI_2.png"
            style={{
              objectFit: "cover",
            }}
            sizes="(max-width: 640px) 70vw, 450px"
          />
        </div>
      </section>

      <ProductList products={products} />

      <section className="w-full py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {config.categories.map(({ slug, image: src }) => (
            <CategoryBox key={slug} categorySlug={slug} src={src} />
          ))}
        </div>
      </section>
    </main>
  )
}
