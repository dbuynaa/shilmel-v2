"use client";

import { ProductPreview } from "@/components/admin/products/product-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductFormValues } from "@/lib/validations/product";
import type { FileWithPreview } from "@/types";
import { ExternalLink } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface ProductFormSidebarProps {
	form: UseFormReturn<ProductFormValues>;
	files: FileWithPreview[];
}

export function ProductFormSidebar({ form, files }: ProductFormSidebarProps) {
	const watchedValues = {
		name: form.watch("name"),
		price: form.watch("price"),
		compareAtPrice: form.watch("compareAtPrice"),
		status: form.watch("status"),
	};

	return (
		<Card className="sticky top-24">
			<CardHeader>
				<CardTitle className="text-lg font-medium">Product preview</CardTitle>
				<CardDescription>How your product will appear to customers</CardDescription>
			</CardHeader>
			<CardContent>
				<ProductPreview
					title={watchedValues.name || "Product title"}
					price={watchedValues.price || 0}
					compareAtPrice={watchedValues.compareAtPrice}
					status={watchedValues.status}
					image={files?.[0]?.preview || ""}
				/>
				<div className="mt-6">
					<Button
						variant="outline"
						className="w-full"
						disabled={!form.getValues("slug")}
						type="button"
						onClick={() => window.open(`/product/${form.getValues("slug")}`, "_blank")}
					>
						<ExternalLink className="w-4 h-4 mr-2" />
						Preview
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
