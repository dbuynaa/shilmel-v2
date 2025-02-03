"use server"

import { Cart, CartItem } from "@/types/cart"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { psGetProductsById } from "@/db/prepared/product.statements"

import {
  clearCartCookie,
  getCartCookieJson,
  setCartCookieJson,
} from "@/lib/cart"

const CART_DATA_COOKIE = "yns_cart_data"

async function getCartData(): Promise<Cart | null> {
  const cookieStore = await cookies()
  const cartData = cookieStore.get(CART_DATA_COOKIE)?.value
  if (!cartData) return null
  try {
    return JSON.parse(cartData) as Cart
  } catch {
    return null
  }
}

async function setCartData(cart: Cart) {
  const cookieStore = await cookies()
  cookieStore.set(CART_DATA_COOKIE, JSON.stringify(cart))
}

async function clearCartData() {
  const cookieStore = await cookies()
  cookieStore.set(CART_DATA_COOKIE, "", { maxAge: 0 })
}

export async function getCartFromCookiesAction() {
  return await getCartData()
}

export async function setInitialCartCookiesAction() {
  const emptyCart: Cart = {
    items: [],
    total: 0,
    currency: "USD", // You might want to make this configurable
  }
  await setCartData(emptyCart)
  await setCartCookieJson({
    id: "local",
    linesCount: 0,
  })
}

export async function findOrCreateCartIdFromCookiesAction() {
  const cart = await getCartData()
  if (cart) {
    return "local"
  }

  await setInitialCartCookiesAction()
  return "local"
}

export async function clearCartCookieAction() {
  await clearCartCookie()
  await clearCartData()
  revalidateTag("cart-local")
  revalidateTag("admin-orders")
}

export async function addToCartAction(formData: FormData) {
  const productId = formData.get("productId")
  if (!productId || typeof productId !== "string") {
    throw new Error("Invalid product ID")
  }

  const product = await psGetProductsById.execute({ id: productId })
  if (!product || product.length === 0) {
    throw new Error("Product not found")
  }

  const cart = (await getCartData()) || {
    items: [],
    total: 0,
    currency: "USD",
  }

  const existingItem = cart.items.find((item) => item.id === productId)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    const newItem: CartItem = {
      id: product[0].id,
      name: product[0].name,
      price: Number(product[0].price),
      quantity: 1,
      currency: "USD",
    }
    cart.items.push(newItem)
  }

  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  await setCartData(cart)
  await setCartCookieJson({
    id: "local",
    linesCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  })

  revalidateTag("cart-local")
  return cart
}

export async function increaseQuantity(productId: string) {
  const cart = await getCartData()
  if (!cart) {
    throw new Error("Cart not found")
  }

  const item = cart.items.find((item) => item.id === productId)
  if (!item) {
    throw new Error("Product not found in cart")
  }

  item.quantity += 1
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  await setCartData(cart)
  await setCartCookieJson({
    id: "local",
    linesCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  })
  revalidateTag("cart-local")
}

export async function decreaseQuantity(productId: string) {
  const cart = await getCartData()
  if (!cart) {
    throw new Error("Cart not found")
  }

  const item = cart.items.find((item) => item.id === productId)
  if (!item) {
    throw new Error("Product not found in cart")
  }

  if (item.quantity > 1) {
    item.quantity -= 1
  } else {
    cart.items = cart.items.filter((item) => item.id !== productId)
  }

  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  await setCartData(cart)
  await setCartCookieJson({
    id: "local",
    linesCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  })
  revalidateTag("cart-local")
}

export async function setQuantity({
  productId,
  quantity,
}: {
  productId: string
  cartId: string
  quantity: number
}) {
  const cart = await getCartData()
  if (!cart) {
    throw new Error("Cart not found")
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((item) => item.id !== productId)
  } else {
    const item = cart.items.find((item) => item.id === productId)
    if (!item) {
      throw new Error("Product not found in cart")
    }
    item.quantity = quantity
  }

  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  await setCartData(cart)
  await setCartCookieJson({
    id: "local",
    linesCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  })
  revalidateTag("cart-local")
}

export async function commerceGPTRevalidateAction() {
  revalidateTag("cart-local")
}
