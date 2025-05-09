"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductStatusEnum } from "@/db/types/enums";
import type { ProductFormValues } from "@/lib/validations/product";
import { Save } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { UseFormReturn } from "react-hook-form";

interface ProductFormHeaderProps {
	isEditMode: boolean;
	isPending: boolean;
	form: UseFormReturn<ProductFormValues>;
	router: AppRouterInstance;
}

export function ProductFormHeader({ isEditMode, isPending, form, router }: ProductFormHeaderProps) {
	return (
		<div className="sticky top-0 z-10 bg-background border-b shadow-sm">
			<div className="container flex items-center justify-between h-16 px-4 mx-auto">
				<div className="flex items-center gap-4">
					<Button type="button" variant="outline" onClick={() => router.back()}>
						Back
					</Button>
					<h1 className="text-xl font-semibold">{isEditMode ? "Edit product" : "Add product"}</h1>
				</div>
				<div className="flex items-center gap-2">
					<Select
						defaultValue={form.getValues("status") || ProductStatusEnum.DRAFT}
						onValueChange={(value: ProductStatusEnum) => form.setValue("status", value)}
					>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ProductStatusEnum.DRAFT}>Draft</SelectItem>
							<SelectItem value={ProductStatusEnum.ACTIVE}>Active</SelectItem>
							<SelectItem value={ProductStatusEnum.ARCHIVED}>Archived</SelectItem>
							<SelectItem value={ProductStatusEnum.PUBLISHED}>Published</SelectItem>
						</SelectContent>
					</Select>
					<Button type="submit" disabled={isPending}>
						<Save className="w-4 h-4 mr-2" />
						{isPending ? "Saving..." : "Save"}
					</Button>
				</div>
			</div>
		</div>
	);
}
