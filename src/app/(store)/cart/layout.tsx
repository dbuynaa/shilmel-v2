import type { ReactNode } from "react"
import { getCartFromCookiesAction } from "@/actions/cart-actions"
import { getLocale, getTranslations } from "@/i18n/server"

import { CartSummaryTable } from "@/components/store/checkout/cart-summary-table"

export default async function CartLayout({
  children,
}: {
  children: ReactNode
}) {
  const cart = await getCartFromCookiesAction()
  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[calc(100dvh-7rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">
            Add some items to your cart to continue shopping.
          </p>
        </div>
      </div>
    )
  }

  const t = await getTranslations("/cart.page")
  const locale = await getLocale()

  return (
    <div className="min-h-[calc(100dvh-7rem)] xl:grid xl:grid-cols-12 xl:gap-x-8">
      <div className="my-8 xl:col-span-7">
        <div className="sticky top-1">
          <h1 className="mb-4 text-3xl leading-none font-bold tracking-tight">
            {t("title")}
          </h1>
          <CartSummaryTable cart={cart} locale={locale} />
        </div>
      </div>
      <div className="my-8 max-w-[65ch] xl:col-span-5">{children}</div>
    </div>
  )
}
