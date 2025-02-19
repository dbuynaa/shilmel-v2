// import { ProductModel3D } from "@/app/(store)/product/[slug]/product-model3d";
import { Suspense } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next/types"
import { getProductBySlug } from "@/actions/products"
import { env } from "@/env"
import { getLocale, getTranslations } from "@/i18n/server"

import { cn, deslugify, formatMoney, formatProductName } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { JsonLd, mappedProductToJsonLd } from "@/components/store/json-ld"
import { MainProductImage } from "@/components/store/products/main-product-image"
import { StickyBottom } from "@/components/store/sticky-bottom"
import { YnsLink } from "@/components/store/yns-link"
import { ProductImageModal } from "@/app/(store)/product/[slug]/product-image-modal"

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ variant?: string }>
}): Promise<Metadata> => {
  const searchParams = await props.searchParams
  const params = await props.params
  const product = await getProductBySlug(params.slug)
  const variants = product?.variants
  const selectedVariant =
    (variants &&
      variants?.find((variant) => variant.sku === searchParams.variant)) ??
    variants?.[0]

  if (!product || !selectedVariant) {
    return notFound()
  }

  const t = await getTranslations("/product.metadata")

  const canonical = new URL(
    `${env.NEXT_PUBLIC_APP_URL}/product/${product.slug}`
  )
  if (searchParams.variant) {
    canonical.searchParams.set("variant", searchParams.variant)
  }

  const productName = formatProductName(product.name, selectedVariant.sku)

  return {
    title: t("title", { productName }),
    description: product.description,
    alternates: { canonical },
  } satisfies Metadata
}

export default async function SingleProductPage(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ variant?: string; image?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const product = await getProductBySlug(params.slug)
  const variants = product?.variants
  const selectedVariant =
    (variants &&
      variants?.find((variant) => variant.sku === searchParams.variant)) ??
    variants?.[0]
  if (!product || !selectedVariant) {
    return notFound()
  }

  const t = await getTranslations("/product.page")
  const locale = await getLocale()

  const category = product.category
  const images = selectedVariant?.images || []
  return (
    <article className="pb-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="inline-flex min-h-12 min-w-12 items-center justify-center"
            >
              <YnsLink href="/products">{t("allProducts")}</YnsLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="inline-flex min-h-12 min-w-12 items-center justify-center"
                  asChild
                >
                  <YnsLink href={`/category/${category.name}`}>
                    {deslugify(category.name)}
                  </YnsLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
          {selectedVariant && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {deslugify(selectedVariant.sku)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <StickyBottom product={product} locale={locale}>
        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:col-start-8">
            <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
              {product.name}
            </h1>
            {product.price && (
              <p className="mt-2 text-2xl font-medium leading-none tracking-tight text-foreground/70">
                {formatMoney({
                  amount: parseInt(product.price),
                  currency: "USD",
                  locale,
                })}
              </p>
            )}
            <div className="mt-2">
              {selectedVariant && selectedVariant?.stock <= 0 && (
                <div>Out of stock</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 lg:row-span-3 lg:row-start-1">
            <h2 className="sr-only">{t("imagesTitle")}</h2>

            <div className="grid gap-4 lg:grid-cols-3 [&>*:first-child]:col-span-3">
              {/* {selectedVariant && (
                <ProductModel3D
                  model3d={selectedVariant.images[0].url}
                  imageSrc={selectedVariant.images[0].url}
                />
              )} */}
              {images.map((image, idx) => {
                const params = new URLSearchParams({
                  image: idx.toString(),
                })
                if (searchParams.variant) {
                  params.set("variant", searchParams.variant)
                }
                return (
                  <YnsLink key={idx} href={`?${params}`} scroll={false}>
                    {idx === 0 && !selectedVariant.images[0].url ? (
                      <MainProductImage
                        key={image.id}
                        className="w-full rounded-lg object-cover object-center transition-opacity"
                        src={image.url}
                        loading="eager"
                        priority
                        quality={100}
                        alt={image.altText || ""}
                      />
                    ) : (
                      <Image
                        key={image.id}
                        className="w-full rounded-lg object-cover object-center transition-opacity"
                        src={image.url}
                        width={700 / 3}
                        height={700 / 3}
                        sizes="(max-width: 1024x) 33vw, (max-width: 1280px) 20vw, 225px"
                        loading="eager"
                        priority
                        alt=""
                      />
                    )}
                  </YnsLink>
                )
              })}
            </div>
          </div>

          <div className="grid gap-8 lg:col-span-5">
            <section>
              <h2 className="sr-only">{t("descriptionTitle")}</h2>
              <div className="prose text-secondary-foreground">
                {product.description}
                {/* <Markdown source={product.description || ""} /> */}
              </div>
            </section>

            {variants && variants.length > 1 && (
              <div className="grid gap-2">
                <p className="text-base font-medium" id="variant-label">
                  {t("variantTitle")}
                </p>
                <ul
                  role="list"
                  className="grid grid-cols-4 gap-2"
                  aria-labelledby="variant-label"
                >
                  {variants.map((variant) => {
                    const isSelected = selectedVariant?.sku === variant.sku
                    return (
                      variant && (
                        <li key={variant.id}>
                          <YnsLink
                            scroll={false}
                            prefetch={true}
                            href={`/product/${product.slug}?variant=${variant.sku}`}
                            className={cn(
                              "flex cursor-pointer items-center justify-center gap-2 rounded-md border p-2 transition-colors hover:bg-secondary/30",
                              isSelected &&
                                "border-primary bg-tertiary font-medium"
                            )}
                            aria-selected={isSelected}
                          >
                            {deslugify(variant.sku)}
                          </YnsLink>
                        </li>
                      )
                    )
                  })}
                </ul>
              </div>
            )}

            <AddToCartButton
              productId={product.id}
              disabled={selectedVariant?.stock <= 0}
            />
          </div>
        </div>
      </StickyBottom>

      {/* <Suspense>
        <SimilarProducts id={product.id} />
      </Suspense> */}

      <Suspense>
        <ProductImageModal images={images.map((image) => image.url)} />
      </Suspense>

      {/* <JsonLd jsonLd={mappedProductToJsonLd(product)} /> */}
    </article>
  )
}

// async function SimilarProducts({ id }: { id: string }) {
//   const products = await getRecommendedProducts({ productId: id, limit: 4 })

//   if (!products) {
//     return null
//   }

//   return (
//     <section className="py-12">
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold tracking-tight">You May Also Like</h2>
//       </div>
//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {/* {products.map((product) => {
//           const trieveMetadata = product.metadata as TrieveProductMetadata
//           return (
//             <div
//               key={product.tracking_id}
//               className="group overflow-hidden rounded bg-card shadow-sm"
//             >
//               {trieveMetadata.image_url && (
//                 <YnsLink
//                   href={`${publicUrl}${product.link}`}
//                   className="block"
//                   prefetch={false}
//                 >
//                   <Image
//                     className={
//                       "w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity group-hover:opacity-80"
//                     }
//                     src={trieveMetadata.image_url}
//                     width={300}
//                     height={300}
//                     sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
//                     alt=""
//                   />
//                 </YnsLink>
//               )}
//               <div className="p-4">
//                 <h3 className="mb-2 text-lg font-semibold">
//                   <YnsLink
//                     href={product.link || "#"}
//                     className="hover:text-primary"
//                     prefetch={false}
//                   >
//                     {trieveMetadata.name}
//                   </YnsLink>
//                 </h3>
//                 <div className="flex items-center justify-between">
//                   <span>
//                     {formatMoney({
//                       amount: trieveMetadata.amount,
//                       currency: trieveMetadata.currency,
//                     })}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )
//         })} */}
//       </div>
//     </section>
//   )
// }
