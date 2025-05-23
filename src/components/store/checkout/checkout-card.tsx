import type { Cart } from "@/types/cart";

import { getLocale, getTranslations } from "@/i18n/server";

import type { ShippingRate } from "./shipping-rates-section";
import { StripePayment } from "./stripe-payment";

// Mock shipping rates - in a real app, this would come from your shipping provider
const mockShippingRates: ShippingRate[] = [
	{
		id: "standard",
		display_name: "Standard Shipping",
		delivery_estimate: {
			minimum: {
				value: 3,
				unit: "business_day",
			},
			maximum: {
				value: 5,
				unit: "business_day",
			},
		},
		fixed_amount: {
			amount: 500,
			currency: "USD",
		},
	},
	{
		id: "express",
		display_name: "Express Shipping",
		delivery_estimate: {
			minimum: {
				value: 1,
				unit: "business_day",
			},
			maximum: {
				value: 2,
				unit: "business_day",
			},
		},
		fixed_amount: {
			amount: 1500,
			currency: "USD",
		},
	},
];

export const CheckoutCard = async ({ cart }: { cart: Cart }) => {
	const t = await getTranslations("/cart.page");
	const locale = await getLocale();

	// Check if all items are digital (no shipping required)
	const allProductsDigital = cart.items.every((item) => {
		// You can add a digital/physical flag to your products if needed
		// For now, assuming all products require shipping
		return false;
	});

	return (
		<section className="max-w-md pb-12">
			<h2 className="text-3xl leading-none font-bold tracking-tight">{t("checkoutTitle")}</h2>
			<p className="text-muted-foreground mt-2 mb-4 text-sm">{t("checkoutDescription")}</p>
			<StripePayment
				shippingRateId={null} // You can store selected shipping rate in cart metadata if needed
				shippingRates={mockShippingRates}
				allProductsDigital={allProductsDigital}
				locale={locale}
			/>
		</section>
	);
};
