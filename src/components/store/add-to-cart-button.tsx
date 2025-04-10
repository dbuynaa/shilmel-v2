"use client";

import { addToCartAction } from "@/actions/cart-actions";
import { useCartModal } from "@/context/cart-modal";
import { useTranslations } from "@/i18n/client";
import { Loader2Icon } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AddToCartButton = ({
	productId,
	variant,
	disabled,
	className,
}: {
	productId: string;
	variant: string;
	disabled?: boolean;
	className?: string;
}) => {
	const t = useTranslations("Global.addToCart");
	const [pending, startTransition] = useTransition();
	const isDisabled = disabled || pending;
	const { setOpen } = useCartModal();

	return (
		<Button
			id="button-add-to-cart"
			size="lg"
			type="submit"
			className={cn("relative rounded-full text-lg", className)}
			onClick={async (e) => {
				if (isDisabled) {
					e.preventDefault();
					return;
				}

				setOpen(true);

				startTransition(async () => {
					const formData = new FormData();
					formData.append("productId", productId);
					formData.append("sku", variant);
					await addToCartAction(formData);
				});
			}}
			aria-disabled={isDisabled}
		>
			<span className={cn("transition-opacity ease-in", pending ? "opacity-0" : "opacity-100")}>
				{disabled ? t("disabled") : t("actionButton")}
			</span>
			<span
				className={cn(
					"pointer-events-none absolute z-10 transition-opacity ease-out",
					pending ? "opacity-100" : "opacity-0",
				)}
			>
				<Loader2Icon className="h-4 w-4 animate-spin" />
			</span>
		</Button>
	);
};
