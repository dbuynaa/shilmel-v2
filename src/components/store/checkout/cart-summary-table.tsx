"use client"

import type { Cart } from "@/types/cart"

import { startTransition, useOptimistic } from "react"
import Image from "next/image"
import { decreaseQuantity, increaseQuantity } from "@/actions/cart-actions"
import { useTranslations } from "@/i18n/client"
import { Minus, Plus } from "lucide-react"

import { formatMoney } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const CartSummaryTable = ({
  cart,
  locale,
}: {
  cart: Cart
  locale: string
}) => {
  const t = useTranslations("/cart.page.summaryTable")
  const [optimisticCart, dispatchOptimisticCartAction] = useOptimistic(
    cart,
    (
      prevCart,
      action: {
        productId: string
        variant: string
        action: "INCREASE" | "DECREASE"
      }
    ) => {
      const modifier = action.action === "INCREASE" ? 1 : -1

      const updatedItems = prevCart.items.map((item) => {
        if (
          item.id === action.productId &&
          item.variant?.sku === action.variant
        ) {
          const newQuantity = Math.max(0, item.quantity + modifier)
          return { ...item, quantity: newQuantity }
        }
        return item
      })

      return {
        ...prevCart,
        items: updatedItems.filter((item) => item.quantity > 0),
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      }
    }
  )

  const handleQuantityChange = async (
    productId: string,
    variant: string,
    action: "INCREASE" | "DECREASE"
  ) => {
    startTransition(() => {
      dispatchOptimisticCartAction({ productId, action, variant })
    })
    try {
      if (action === "INCREASE") {
        await increaseQuantity(productId)
      } else {
        await decreaseQuantity(productId)
      }
    } catch (error) {
      // If the server action fails, the optimistic state will be rolled back automatically
      console.error("Failed to update quantity:", error)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-24 sm:table-cell">
            <span className="sr-only">{t("imageCol")}</span>
          </TableHead>
          <TableHead>{t("productCol")}</TableHead>
          <TableHead className="w-1/6 min-w-32">{t("priceCol")}</TableHead>
          <TableHead className="w-1/6 min-w-32">{t("quantityCol")}</TableHead>
          <TableHead className="w-1/6 min-w-32 text-right">
            {t("totalCol")}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {optimisticCart.items.map((item) => (
          <TableRow key={item.variant?.sku}>
            <TableCell className="hidden sm:table-cell sm:w-24">
              {item.variant?.image && (
                <Image
                  className="aspect-square rounded-md object-cover"
                  src={item.variant.image}
                  width={96}
                  height={96}
                  alt=""
                />
              )}
            </TableCell>
            <TableCell className="font-medium">
              {item.name}
              {item.variant?.size && (
                <span className="text-muted-foreground ml-1">
                  ({item.variant.size})
                </span>
              )}
            </TableCell>
            <TableCell>
              {formatMoney({
                amount: item.price,
                currency: "USD",
                locale,
              })}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    handleQuantityChange(item.id, item.variant!.sku, "DECREASE")
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center tabular-nums">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    handleQuantityChange(item.id, item.variant!.sku, "INCREASE")
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
            <TableCell className="text-right">
              {formatMoney({
                amount: item.price * item.quantity,
                currency: "USD",
                locale,
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={4} className="text-right font-semibold">
            {t("totalSummary")}
          </TableCell>
          <TableCell className="text-right font-semibold">
            {formatMoney({
              amount: optimisticCart.total,
              currency: "USD",
              locale,
            })}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
