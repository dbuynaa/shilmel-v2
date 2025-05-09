import { VariantDetailsForm } from "@/components/admin/forms/products/variants/variant-details-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductFormValues } from "@/lib/validations/product";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";

interface VariantDetailsDialogProps {
	selectedVariantIndex: number | null;
	setSelectedVariantIndex: React.Dispatch<React.SetStateAction<number | null>>;
	form: UseFormReturn<ProductFormValues>;
	variantImages: Record<number, Array<{ id?: string; url: string; alt?: string; position: number }>>;
	handleVariantImageUpdate: (
		variantIndex: number,
		newImages: Array<{ id?: string; url: string; alt?: string; position: number }>,
	) => void;
}

export function VariantDetailsDialog({
	selectedVariantIndex,
	setSelectedVariantIndex,
	form,
	variantImages,
	handleVariantImageUpdate,
}: VariantDetailsDialogProps) {
	if (selectedVariantIndex === null) return null;

	return (
		<Dialog
			open={selectedVariantIndex !== null}
			onOpenChange={(open) => !open && setSelectedVariantIndex(null)}
		>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>
						Edit Variant: {form.watch(`variants.${selectedVariantIndex}.title`) || "Variant"}
					</DialogTitle>
				</DialogHeader>
				<div className="py-4">
					<Tabs defaultValue="details">
						<TabsList className="mb-4">
							<TabsTrigger value="details">Details</TabsTrigger>
							<TabsTrigger value="pricing">Pricing</TabsTrigger>
							<TabsTrigger value="inventory">Inventory</TabsTrigger>
							<TabsTrigger value="shipping">Shipping</TabsTrigger>
							<TabsTrigger value="images">Images</TabsTrigger>
						</TabsList>

						<VariantDetailsForm
							selectedVariantIndex={selectedVariantIndex}
							form={form}
							variantImages={variantImages}
							handleVariantImageUpdate={handleVariantImageUpdate}
						/>
					</Tabs>
				</div>
			</DialogContent>
		</Dialog>
	);
}
