// import type * as Commerce from "commerce-kit"
// import { formatMoney } from "commerce-kit/currencies"

import type { ProudctWithVariants } from "@/db/schema";

import { MainProductImage } from "@/components/store/products/main-product-image";
import { cn } from "@/lib/utils";

import { AddToCartButton } from "./add-to-cart-button";

export const ProductBottomStickyCard = ({
	product,
	variant,
	show,
}: {
	product: ProudctWithVariants;
	variant: string;
	show: boolean;
}) => {
	return (
		<div
			tabIndex={show ? 0 : -1}
			className={cn(
				"fixed right-0 bottom-0 left-0 z-10 max-w-[100vw] border-t bg-background py-2 backdrop-blur-xs transition-all duration-300 ease-out sm:py-4",
				show
					? "translate-y-0 transform shadow-[0_-4px_6px_-1px_rgb(0_0_0_/_0.1),_0_-2px_4px_-2px_rgb(0_0_0_/_0.1)]"
					: "translate-y-full transform",
			)}
		>
			<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-x-2 px-4 sm:px-6 lg:px-8">
				<div className="flex min-w-0 items-center gap-x-2 sm:gap-x-4">
					<div className="shrink-0">
						{product.variants.find((v) => v.sku === variant) && (
							<MainProductImage
								className="h-16 w-16 rounded-lg bg-neutral-100 object-cover object-center"
								src={product.variants.find((v) => v.sku === variant)!.images[0]?.url ?? ""}
								loading="eager"
								priority
								alt=""
							/>
						)}
					</div>
					<div className="min-w-0 flex-1">
						<h3 className="overflow-clip text-xs font-semibold text-ellipsis whitespace-nowrap sm:text-base md:text-lg">
							{product.name}
						</h3>

						{/* {product. && (
              <p className="text-xs sm:text-sm">
                {formatMoney({
                  amount: product.unit_amount,
                  currency: product.default_price.currency,
                  locale,
                })}
              </p>
            )} */}
					</div>
				</div>

				<AddToCartButton
					productId={product.id}
					variant={variant}
					disabled={(product.variants.find((v) => v.sku === variant)?.stock ?? 0) <= 0}
					className="h-9 shrink-0 px-3 text-sm sm:h-10 sm:px-8 sm:text-lg"
				/>
			</div>
		</div>
	);
};
