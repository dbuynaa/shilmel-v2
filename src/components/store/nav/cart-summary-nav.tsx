import { getCartFromCookiesAction } from "@/actions/cart-actions";
import { getLocale, getTranslations } from "@/i18n/server";
// import { calculateCartTotalNetWithoutShipping } from "commerce-kit"
import { ShoppingBagIcon } from "lucide-react";
import { Suspense } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatMoney } from "@/lib/utils";

import { CartLink } from "./cart-link";

const CartFallback = () => (
	<div className="h-6 w-6 opacity-30">
		<ShoppingBagIcon />
	</div>
);

export const CartSummaryNav = () => {
	return (
		<Suspense fallback={<CartFallback />}>
			<CartSummaryNavInner />
		</Suspense>
	);
};

const CartSummaryNavInner = async () => {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		return <CartFallback />;
	}
	if (!cart.items.length) {
		return <CartFallback />;
	}

	const total = cart.total;
	const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

	const t = await getTranslations("Global.nav.cartSummary");
	const locale = await getLocale();

	return (
		<TooltipProvider>
			<Tooltip delayDuration={100}>
				<TooltipTrigger asChild>
					<div>
						<CartLink>
							<ShoppingBagIcon />
							<span className="absolute right-0 bottom-0 inline-flex h-5 w-5 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 bg-white text-center text-xs">
								<span className="sr-only">{t("itemsInCart")}: </span>
								{totalItems}
							</span>
							<span className="sr-only">
								{t("total")}:{" "}
								{formatMoney({
									amount: total,
									currency: "USD",
									locale,
								})}
							</span>
						</CartLink>
					</div>
				</TooltipTrigger>
				<TooltipContent side="left" sideOffset={25}>
					<p>{t("totalItems", { count: totalItems })}</p>
					<p>
						{t("total")}:{" "}
						{formatMoney({
							amount: total,
							currency: "USD",
							locale,
						})}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
