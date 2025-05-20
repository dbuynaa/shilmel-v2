"use client";

import type React from "react";
import { useEffect } from "react";

import type { ProductFormValues } from "@/lib/validations/product";
import type { FileWithPreview } from "@/types";
import type { UseFormReturn } from "react-hook-form";

import type { OpenSections } from "@/hooks/use-product-form-state";
import { useProductVariants } from "@/hooks/use-product-variants";
import { BasicInfoSection } from "./sections/basic-info-section";
import { InventorySection } from "./sections/inventory-section";
import { MediaSection } from "./sections/media-section";
import { MetaDataSection } from "./sections/meta-data-section";
import { OrganizationSection } from "./sections/organization-section";
import { PricingSection } from "./sections/pricing-section";
import { ShippingSection } from "./sections/shipping-section";
import { VariantsSection } from "./sections/variants-section";

interface ProductFormSectionsProps {
	form: UseFormReturn<ProductFormValues>;
	openSections: OpenSections;
	toggleSection: (section: keyof OpenSections) => void;
	// images: Array<{ id?: string; url: string; alt?: string; position: number }>;
	// setImages: React.Dispatch<
	// 	React.SetStateAction<Array<{ id?: string; url: string; alt?: string; position: number }>>
	// >;
	files: FileWithPreview[];
	setFiles: (files: FileWithPreview[]) => void;
	isUploading: boolean;
	isPending: boolean;
	categories: string[];
	setCategories: React.Dispatch<React.SetStateAction<string[]>>;
	variantImages: Record<number, Array<{ id?: string; url: string; alt?: string; position: number }>>;
	setSelectedVariantIndex: React.Dispatch<React.SetStateAction<number | null>>;
	handleVariantImageUpdate: (
		variantIndex: number,
		newImages: Array<{ id?: string; url: string; alt?: string; position: number }>,
	) => void;
}

export function ProductFormSections({
	form,
	openSections,
	toggleSection,
	// images,
	// setImages,
	files,
	setFiles,
	isUploading,
	isPending,
	categories,
	setCategories,
	variantImages,
	setSelectedVariantIndex,
	handleVariantImageUpdate,
}: ProductFormSectionsProps) {
	// Update metaData.title when name changes
	useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			if (name === "name" && value.name) {
				const currentMetaTitle = form.getValues("metaData.title");
				if (!currentMetaTitle) {
					form.setValue("metaData.title", value.name as string);
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [form]);

	const variantHelpers = useProductVariants(form, variantImages);

	return (
		<>
			<BasicInfoSection form={form} />

			<MediaSection
				open={openSections.media}
				onToggle={() => toggleSection("media")}
				files={files}
				setFiles={setFiles}
				form={form}
				isUploading={isUploading}
				isPending={isPending}
			/>

			<PricingSection open={openSections.pricing} onToggle={() => toggleSection("pricing")} form={form} />

			<InventorySection
				open={openSections.inventory}
				onToggle={() => toggleSection("inventory")}
				form={form}
			/>

			<ShippingSection open={openSections.shipping} onToggle={() => toggleSection("shipping")} form={form} />

			<VariantsSection
				open={openSections.variants}
				onToggle={() => toggleSection("variants")}
				form={form}
				variantImages={variantImages}
				setSelectedVariantIndex={setSelectedVariantIndex}
				variantHelpers={variantHelpers}
			/>

			<OrganizationSection
				open={openSections.organization}
				onToggle={() => toggleSection("organization")}
				form={form}
				categories={categories}
				setCategories={setCategories}
			/>

			<MetaDataSection open={openSections.metaData} onToggle={() => toggleSection("metaData")} form={form} />
		</>
	);
}
