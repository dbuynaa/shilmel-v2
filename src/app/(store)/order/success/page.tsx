import { Fragment } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getOrderById } from "@/actions/order-actions"
import { getLocale, getTranslations } from "@/i18n/server"

import { getCartCookieJson } from "@/lib/cart"
import { findMatchingCountry } from "@/lib/countries"
import { formatMoney } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ClearCookieClientComponent } from "@/components/store/checkout/clear-cookie-client-component"

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("/order.metadata")
  return {
    title: t("title"),
  }
}

export default async function OrderDetailsPage(props: {
  searchParams: Promise<{ order_id: string }>
}) {
  const { order_id } = await props.searchParams
  if (!order_id) {
    return notFound()
  }

  const order = await getOrderById(order_id, { static: true })
  if (!order) {
    return notFound()
  }

  const cookie = await getCartCookieJson()
  const t = await getTranslations("/order.page")
  const locale = await getLocale()

  const isDigital = (items: typeof order.items) => {
    return items.some((item) =>
      Boolean(item.product.description?.includes("digital"))
    )
  }

  return (
    <article className="max-w-3xl pb-32">
      <ClearCookieClientComponent
        cartId={order.order.id}
        cookieId={cookie?.id}
      />
      <h1 className="mt-4 inline-flex items-center text-3xl leading-none font-bold tracking-tight">
        {t("title")}
        <PaymentStatus status={order.order.paymentStatus} />
      </h1>
      <p className="mt-2">{t("description")}</p>
      <dl className="mt-12 space-y-2 text-sm">
        <dt className="text-foreground font-semibold">
          {t("orderNumberTitle")}
        </dt>
        <dd className="text-accent-foreground">{order.order.id}</dd>
      </dl>

      <h2 className="sr-only">{t("productsTitle")}</h2>
      <ul role="list" className="my-8 divide-y border-y">
        {order.items.map((item) => (
          <li key={item.id} className="py-8">
            <article className="grid grid-cols-[auto_1fr] grid-rows-[repeat(auto,3)] justify-start gap-x-4 sm:gap-x-8">
              <h3 className="row-start-1 leading-none font-semibold text-neutral-700">
                {item.product.name}
                {item.variant?.size && ` - ${item.variant.size}`}
              </h3>
              {item.variant?.images.map((image) => (
                <Image
                  key={image}
                  className="col-start-1 row-span-3 row-start-1 mt-0.5 w-16 rounded-lg object-cover object-center transition-opacity sm:mt-0 sm:w-32"
                  src={image}
                  width={128}
                  height={128}
                  alt=""
                />
              ))}
              {item.product.description && (
                <div className="prose text-secondary-foreground row-start-2">
                  <p>{item.product.description}</p>
                </div>
              )}
              <footer className="row-start-3 mt-2 self-end">
                <dl className="grid grid-cols-[max-content_auto] gap-2 sm:grid-cols-3">
                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-foreground text-sm font-semibold">
                      {t("price")}
                    </dt>
                    <dd className="text-accent-foreground text-sm">
                      {formatMoney({
                        amount: item.price,
                        currency: "USD",
                        locale,
                      })}
                    </dd>
                  </div>

                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-foreground text-sm font-semibold">
                      {t("quantity")}
                    </dt>
                    <dd className="text-accent-foreground text-sm">
                      {item.quantity}
                    </dd>
                  </div>

                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-foreground text-sm font-semibold">
                      {t("total")}
                    </dt>
                    <dd className="text-accent-foreground text-sm">
                      {formatMoney({
                        amount: item.price * item.quantity,
                        currency: "USD",
                        locale,
                      })}
                    </dd>
                  </div>
                </dl>
              </footer>
            </article>
          </li>
        ))}
      </ul>

      <div className="pl-20 sm:pl-40">
        <h2 className="sr-only">{t("detailsTitle")}</h2>
        {isDigital(order.items) && (
          <div className="mb-8">
            <h3 className="leading-none font-semibold text-neutral-700">
              Digital Asset
            </h3>
            <ul className="mt-3">
              {order.items
                .filter((item) => item.product.description?.includes("digital"))
                .map((item) => {
                  const downloadUrl =
                    item.product.description?.match(/https?:\/\/[^\s]+/)?.[0]
                  if (!downloadUrl) return null
                  return (
                    <li key={item.id} className="text-sm">
                      <a
                        href={downloadUrl}
                        target="_blank"
                        download={true}
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {item.product.name}
                      </a>
                    </li>
                  )
                })
                .filter(Boolean)}
            </ul>
          </div>
        )}
        <div className="grid gap-8 sm:grid-cols-2">
          {!isDigital(order.items) && order.shippingAddress && (
            <div>
              <h3 className="leading-none font-semibold text-neutral-700">
                {t("shippingAddress")}
              </h3>
              <p className="mt-3 text-sm">
                {[
                  order.user?.name,
                  order.shippingAddress.street,
                  order.shippingAddress.city,
                  order.shippingAddress.postalCode,
                  order.shippingAddress.state,
                  findMatchingCountry(order.shippingAddress.country)?.label,
                  "\n",
                  order.user?.email,
                ]
                  .filter(Boolean)
                  .map((line, idx) => (
                    <Fragment key={idx}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
              </p>
            </div>
          )}

          <div className="col-span-2 grid grid-cols-2 gap-8 border-t pt-8">
            <h3 className="leading-none font-semibold text-neutral-700">
              {t("total")}
            </h3>
            <p>
              {formatMoney({
                amount: order.order.totalAmount,
                currency: "USD",
                locale,
              })}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

const PaymentStatus = ({
  status,
}: {
  status: "PENDING" | "COMPLETED" | "FAILED"
}) => {
  const statusToVariant = {
    PENDING: "secondary",
    COMPLETED: "default",
    FAILED: "destructive",
  } as const

  return (
    <Badge className="ml-2 capitalize" variant={statusToVariant[status]}>
      {status.toLowerCase()}
    </Badge>
  )
}
