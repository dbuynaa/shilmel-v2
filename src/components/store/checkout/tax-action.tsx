"use server";

import { getCartFromCookiesAction } from "@/actions/cart-actions";

export const saveTaxIdAction = async ({ taxId }: { taxId: string }) => {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("No cart id found in cookies");
	}

	// TODO: Implement local tax calculation
	return;
};
