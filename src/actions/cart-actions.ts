"use server";

import type { Cart, CartItem } from "@/types/cart";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { clearCartCookie, setCartCookieJson } from "@/lib/cart";

const CART_DATA_COOKIE = "yns_cart_data";

// Cache cart data for 1 minute
async function getCartData(): Promise<Cart | null> {
	const cookieStore = await cookies();
	const cartData = cookieStore.get(CART_DATA_COOKIE)?.value;
	if (!cartData) return null;
	try {
		return JSON.parse(cartData) as Cart;
	} catch {
		return null;
	}
}

export async function setCartData(cart: Cart) {
	const cookieStore = await cookies();
	cookieStore.set(CART_DATA_COOKIE, JSON.stringify(cart), {
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		httpOnly: true,
	});
}

async function clearCartData() {
	const cookieStore = await cookies();
	cookieStore.delete(CART_DATA_COOKIE);
}

export async function getCartFromCookiesAction() {
	return await getCartData();
}

export async function setInitialCartCookiesAction() {
	const emptyCart: Cart = {
		items: [],
		total: 0,
	};
	await setCartData(emptyCart);
	await setCartCookieJson({
		id: "local",
		linesCount: 0,
	});
}

export async function findOrCreateCartIdFromCookiesAction() {
	const cart = await getCartData();
	if (cart) {
		return "local";
	}

	await setInitialCartCookiesAction();
	return "local";
}

export async function clearCartCookieAction() {
	await clearCartCookie();
	await clearCartData();
	revalidateTag("cart-local");
	revalidateTag("admin-orders");
}

export async function addToCartAction(formData: FormData) {
	const sku = formData.get("sku");
	if (!sku || typeof sku !== "string") {
		throw new Error("Invalid product ID");
	}

	const [productVariant] = await psGetProductVariantBySku.execute({
		sku: sku,
	});

	if (!productVariant || !productVariant.product) {
		throw new Error("Product not found");
	}
	const product = productVariant.product;

	const cart = (await getCartData()) || {
		items: [],
		total: 0,
		currency: "USD",
	};

	const existingItem = cart.items.find((item) => item.variant?.sku === productVariant.sku);
	if (existingItem) {
		existingItem.quantity += 1;
	} else {
		const newItem: CartItem = {
			id: product.id,
			name: product.name,
			price: Number(product.price),
			quantity: 1,
			variant: {
				sku: productVariant.sku,
				image: productVariant.images?.[0]?.url,
				size: productVariant.size || undefined,
			},
		};
		cart.items = [...cart.items, newItem];
	}

	cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	await setCartData(cart);
	await setCartCookieJson({
		id: "local",
		linesCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
	});

	revalidateTag("cart-local");
	return cart;
}

export async function increaseQuantity(productId: string) {
	const cart = await getCartData();
	if (!cart) {
		throw new Error("Cart not found");
	}

	const item = cart.items.find((item) => item.id === productId);
	if (!item) {
		throw new Error("Product not found in cart");
	}

	item.quantity += 1;
	cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	await setCartData(cart);
	await setCartCookieJson({
		id: "local",
		linesCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
	});
	revalidateTag("cart-local");
}

export async function decreaseQuantity(productId: string) {
	const cart = await getCartData();
	if (!cart) {
		throw new Error("Cart not found");
	}

	const item = cart.items.find((item) => item.id === productId);
	if (!item) {
		throw new Error("Product not found in cart");
	}

	if (item.quantity > 1) {
		item.quantity -= 1;
	} else {
		cart.items = cart.items.filter((item) => item.id !== productId);
	}

	cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	await setCartData(cart);
	await setCartCookieJson({
		id: "local",
		linesCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
	});
	revalidateTag("cart-local");
}

export async function setQuantity({
	productId,
	quantity,
}: {
	productId: string;
	cartId: string;
	quantity: number;
}) {
	const cart = await getCartData();
	if (!cart) {
		throw new Error("Cart not found");
	}

	if (quantity <= 0) {
		cart.items = cart.items.filter((item) => item.id !== productId);
	} else {
		const item = cart.items.find((item) => item.id === productId);
		if (!item) {
			throw new Error("Product not found in cart");
		}
		item.quantity = quantity;
	}

	cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	await setCartData(cart);
	await setCartCookieJson({
		id: "local",
		linesCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
	});
	revalidateTag("cart-local");
}

export async function commerceGPTRevalidateAction() {
	revalidateTag("cart-local");
}
