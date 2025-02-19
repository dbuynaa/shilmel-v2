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
      <section className="rounded bg-tertiary py-8 sm:py-12">
        <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
          <div className="max-w-md space-y-4">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              {t("hero.title")}
            </h2>
            <p className="text-pretty text-muted-foreground">
              {t("hero.description")}
            </p>
            <YnsLink
              className="focus:outline-hidden inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:ring-1 focus:ring-primary"
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
            src="https://img.freepik.com/free-photo/side-view-woman-looking-clothes_23-2150746358.jpg"
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
