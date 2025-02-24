import Image from "next/image"
import { getCartFromCookiesAction } from "@/actions/cart-actions"
import { getLocale, getTranslations } from "@/i18n/server"

// import { calculateCartTotalNetWithoutShipping } from "commerce-kit"

import { formatMoney, formatProductName } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { YnsLink } from "@/components/store/yns-link"

import { CartAsideContainer } from "./cart-aside"

export async function CartModalPage() {
  const cart = await getCartFromCookiesAction()

  if (!cart || cart.items.length === 0) {
    return null
  }

  const currency = "USD"
  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const t = await getTranslations("/cart.modal")
  const locale = await getLocale()

  return (
    <CartAsideContainer>
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-accent-foreground/80 text-lg font-semibold">
            {t("title")}
          </h2>
          <YnsLink
            replace
            href="/cart"
            className="text-muted-foreground text-sm underline"
          >
            {t("openFullView")}
          </YnsLink>
        </div>

        <div className="mt-8">
          <ul role="list" className="divide-secondary -my-6 divide-y">
            {cart.items.map((item) => (
              <li
                key={item.variant?.sku}
                className="grid grid-cols-[4rem_1fr_max-content] grid-rows-[auto_auto] gap-x-4 gap-y-2 py-6"
              >
                {item.variant?.image ? (
                  <div className="bg-accent col-span-1 row-span-2">
                    <Image
                      className="aspect-square rounded-md object-cover"
                      src={item.variant.image}
                      width={80}
                      height={80}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="col-span-1 row-span-2" />
                )}

                <h3 className="-mt-1 leading-tight font-semibold">
                  {formatProductName(item.name, item.variant?.sku)}
                </h3>
                <p className="text-sm leading-none font-medium">
                  {formatMoney({
                    amount: item.price ?? 0,
                    currency: currency,
                    locale,
                  })}
                </p>
                <p className="text-muted-foreground self-end text-sm font-medium">
                  {t("quantity", { quantity: item.quantity })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-accent border-t px-4 py-6 sm:px-6">
        <div
          id="cart-overlay-description"
          className="text-foreground flex justify-between text-base font-medium"
        >
          <p>{t("total")}</p>
          <p>
            {formatMoney({
              amount: total,
              currency,
              locale,
            })}
          </p>
        </div>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {t("shippingAndTaxesInfo")}
        </p>
        <Button
          asChild={true}
          size={"lg"}
          className="mt-6 w-full rounded-full text-lg"
        >
          <YnsLink href="/cart">{t("goToPaymentButton")}</YnsLink>
        </Button>
      </div>
      {/* {searchParams.add && <CartModalAddSideEffect productId={searchParams.add} />} } */}
    </CartAsideContainer>
  )
}
