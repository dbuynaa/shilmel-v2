import Image from "next/image"
import { getLocale, getTranslations } from "@/i18n/server"

import { formatMoney, formatProductName } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string | null
  images: string[]
  metadata: {
    variant?: string
  }
  default_price: {
    unit_amount: number | null
    currency: string
  }
}

interface OrderLine {
  product: Product
  quantity: number
}

interface Order {
  id: string
  status: string
  metadata: {
    taxId?: string
  }
}

interface OrderDetails {
  order: Order
  lines: OrderLine[]
}

export const metadata = {
  title: "Order Confirmation",
}

export default async function OrderDetailsPage() {
  const t = await getTranslations("/order.page")
  const locale = await getLocale()

  // TODO: Fetch order details from your backend
  const order: OrderDetails = {
    order: {
      id: "123",
      status: "completed",
      metadata: {},
    },
    lines: [],
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="mt-4 text-3xl font-bold leading-none tracking-tight">
        {t("title")}
      </h1>
      <p className="mt-2">{t("description")}</p>

      <dl className="mt-12 space-y-2 text-sm">
        <dt className="font-semibold text-foreground">
          {t("orderNumberTitle")}
        </dt>
        <dd className="text-accent-foreground">{order.order.id}</dd>
      </dl>

      <h2 className="sr-only">{t("productsTitle")}</h2>
      <ul role="list" className="my-8 divide-y border-y">
        {order.lines.map((line) => (
          <li key={line.product.id} className="py-8">
            <article className="grid grid-cols-[auto_1fr] grid-rows-[repeat(auto,3)] justify-start gap-x-4 sm:gap-x-8">
              <h3 className="row-start-1 font-semibold leading-none text-neutral-700">
                {formatProductName(
                  line.product.name,
                  line.product.metadata.variant
                )}
              </h3>
              {line.product.images.map((image) => (
                <Image
                  key={image}
                  className="col-start-1 row-span-3 row-start-1 mt-0.5 w-16 rounded-lg object-cover object-center transition-opacity sm:mt-0 sm:w-32"
                  src={image}
                  width={128}
                  height={128}
                  alt=""
                />
              ))}
              <div className="prose row-start-2 text-secondary-foreground">
                {line.product.description}
              </div>
              <footer className="row-start-3 mt-2 self-end">
                <dl className="grid grid-cols-[max-content_auto] gap-2 sm:grid-cols-3">
                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-sm font-semibold text-foreground">
                      {t("price")}
                    </dt>
                    <dd className="text-sm text-accent-foreground">
                      {formatMoney({
                        amount: line.product.default_price.unit_amount ?? 0,
                        currency: line.product.default_price.currency,
                        locale,
                      })}
                    </dd>
                  </div>

                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-sm font-semibold text-foreground">
                      {t("quantity")}
                    </dt>
                    <dd className="text-sm text-accent-foreground">
                      {line.quantity}
                    </dd>
                  </div>

                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-sm font-semibold text-foreground">
                      {t("total")}
                    </dt>
                    <dd className="text-sm text-accent-foreground">
                      {formatMoney({
                        amount:
                          (line.product.default_price.unit_amount ?? 0) *
                          line.quantity,
                        currency: line.product.default_price.currency,
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

      {order.order.metadata.taxId && (
        <div className="border-t pt-8 sm:col-span-2">
          <p className="text-sm">
            {`${t("taxId")}: ${order.order.metadata.taxId}`}
          </p>
        </div>
      )}
    </div>
  )
}
