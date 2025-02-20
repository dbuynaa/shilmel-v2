"use server"

import { getCartFromCookiesAction } from "@/actions/cart-actions"

import type { AddressSchema } from "@/components/store/checkout/checkout-form-schema"

export const saveShippingRateAction = async ({
  shippingRateId,
}: {
  shippingRateId: string
}) => {
  const cart = await getCartFromCookiesAction()
  if (!cart) {
    throw new Error("No cart id found in cookies")
  }

  if (!shippingRateId || typeof shippingRateId !== "string") {
    throw new Error("Invalid shipping rate id")
  }

  // TODO: Implement local shipping rate calculation
  return
}

export const saveBillingAddressAction = async ({
  billingAddress,
}: {
  billingAddress: AddressSchema
}) => {
  const cart = await getCartFromCookiesAction()
  if (!cart) {
    throw new Error("No cart id found in cookies")
  }

  // TODO: Implement local billing address saving
  return
}
