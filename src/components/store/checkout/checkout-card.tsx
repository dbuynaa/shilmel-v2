import { Cart } from "@/types/cart"

import { getTranslations } from "@/i18n/server"

export const CheckoutCard = async ({ cart }: { cart: Cart }) => {
  const t = await getTranslations("/cart.page")

  return (
    <section className="max-w-md pb-12">
      <h2 className="text-3xl font-bold leading-none tracking-tight">
        {t("checkoutTitle")}
      </h2>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">
        {t("checkoutDescription")}
      </p>
      {/* TODO: Implement your custom payment solution here */}
      <div className="mt-4 text-sm text-muted-foreground">
        Payment functionality has been removed. Please implement your preferred
        payment solution.
      </div>
    </section>
  )
}
