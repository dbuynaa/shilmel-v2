import Image from "next/image"
import { InferResultType } from "@/db/schema/utils"
// import { Product } from "@/db/schema"
import { getLocale } from "@/i18n/server"

// import type * as Commerce from "commerce-kit"

import { formatMoney } from "@/lib/utils"
import { JsonLd, mappedProductsToJsonLd } from "@/components/store/json-ld"
import { YnsLink } from "@/components/store/yns-link"

type ProductWithVariants = InferResultType<
  "products",
  { variants: { with: { images: true } } }
>

export const ProductList = async ({
  products,
}: {
  products: ProductWithVariants[]
}) => {
  const locale = await getLocale()

  return (
    <>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, idx) => {
          return (
            <li key={product.id} className="group">
              <YnsLink href={`/product/${product.slug}`}>
                <article className="overflow-hidden bg-card">
                  {product?.variants?.[0]?.images[0] && (
                    <div className="aspect-square h-full overflow-hidden rounded-lg bg-tertiary">
                      <Image
                        className="group-hover:rotate hover-perspective h-full w-full bg-tertiary object-cover object-center transition-opacity group-hover:opacity-75"
                        src={product.variants[0].images[0].url}
                        width={768}
                        height={768}
                        loading={idx < 3 ? "eager" : "lazy"}
                        priority={idx < 3}
                        sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
                        alt={product.name}
                      />
                    </div>
                  )}
                  <div className="p-2">
                    <h2 className="text-xl font-medium text-primary">
                      {product.name}
                    </h2>
                    <footer className="text-base font-normal text-muted-foreground/80">
                      {product.price && (
                        <p>
                          {formatMoney({
                            amount: parseInt(product.price),
                            currency: "USD",
                            locale,
                          })}
                        </p>
                      )}
                    </footer>
                  </div>
                </article>
              </YnsLink>
            </li>
          )
        })}
      </ul>
      {/* <JsonLd jsonLd={mappedProductsToJsonLd(products)} /> */}
    </>
  )
}
