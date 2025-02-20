import { Fragment, type ComponentProps } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import { db } from "@/db"
import { orderItems, orders, payments } from "@/db/schema"
import { getLocale, getTranslations } from "@/i18n/server"
import { eq } from "drizzle-orm"

import { getCartCookieJson } from "@/lib/cart"
import { formatMoney, formatProductName } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { paymentMethods } from "@/components/store/checkout/checkout-card"

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("/order.metadata")
  return {
    title: t("title"),
  }
}

export default async function OrderDetailsPage({
  searchParams,
}: {
  searchParams: { orderId?: string }
}) {
  if (!searchParams.orderId) {
    return <div>Invalid order details</div>
  }

  // Get order with items
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, searchParams.orderId))

  if (!order) {
    return <div>Order not found</div>
  }

  // Get order items
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))

  // Get payment
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, order.id))

  const cookie = await getCartCookieJson()
  const t = await getTranslations("/order.page")
  const locale = await getLocale()

  return (
    <article className="max-w-3xl pb-32">
      <h1 className="mt-4 inline-flex items-center text-3xl leading-none font-bold tracking-tight">
        {t("title")}
        <PaymentStatus status={payment.status} />
      </h1>
      <p className="mt-2">{t("description")}</p>
      <dl className="mt-12 space-y-2 text-sm">
        <dt className="text-foreground font-semibold">
          {t("orderNumberTitle")}
        </dt>
        <dd className="text-accent-foreground">{order.id}</dd>
      </dl>

      <h2 className="sr-only">{t("productsTitle")}</h2>
      <ul role="list" className="my-8 divide-y border-y">
        {items.map((item) => (
          <li key={item.id} className="py-8">
            <article className="grid grid-cols-[auto_1fr] grid-rows-[repeat(auto,3)] justify-start gap-x-4 sm:gap-x-8">
              <h3 className="row-start-1 leading-none font-semibold text-neutral-700">
                {formatProductName(item.productId, "")}
              </h3>
              <footer className="row-start-3 mt-2 self-end">
                <dl className="grid grid-cols-[max-content_auto] gap-2 sm:grid-cols-3">
                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-foreground text-sm font-semibold">
                      {t("price")}
                    </dt>
                    <dd className="text-accent-foreground text-sm">
                      {formatMoney({
                        amount: Number(item.price),
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
                        amount: Number(item.price) * item.quantity,
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
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="leading-none font-semibold text-neutral-700">
              {t("paymentMethod")}
            </h3>
            <p className="mt-3 text-sm">
              <Image
                src={paymentMethods.visa}
                className="mr-1 inline-block w-6 align-text-bottom"
                alt=""
              />
              <span className="capitalize">{order.paymentMethod}</span>
            </p>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-8 border-t pt-8">
            <h3 className="leading-none font-semibold text-neutral-700">
              {t("total")}
            </h3>
            <p>
              {formatMoney({
                amount: Number(order.totalAmount),
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
    FAILED: "destructive",
    PENDING: "secondary",
    COMPLETED: "default",
  } satisfies Record<typeof status, ComponentProps<typeof Badge>["variant"]>

  return (
    <Badge className="ml-2 capitalize" variant={statusToVariant[status]}>
      {status.toLowerCase()}
    </Badge>
  )
}
