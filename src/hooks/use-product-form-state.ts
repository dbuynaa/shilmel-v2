"use client";

import type { psGetProductById } from "@/db/prepared/product.statements";
import { useEffect, useState } from "react";

type AwaitedProduct = Awaited<ReturnType<typeof psGetProductById.execute>>;
export type OpenSections = {
	media: true;
	pricing: true;
	inventory: true;
	shipping: true;
	organization: true;
	variants: true;
	metaData: false;
	options: false;
};
export function useProductFormState(product?: AwaitedProduct) {
	// Categories state
	const [categories, setCategories] = useState<string[]>(
		product?.productCategories.map((category) => category.categoryId) || [],
	);

	// Images state
	// const [images, setImages] = useState<Array<{ id?: string; url: string; alt?: string; position: number }>>(
	// 	product?.productImages.map((image) => ({
	// 		id: image.id,
	// 		url: image.url,
	// 		alt: image.alt || undefined,
	// 		position: image.position,
	// 	})) || [],
	// );

	// Variant images state
	const [variantImages, setVariantImages] = useState<
		Record<number, Array<{ id?: string; url: string; alt?: string; position: number }>>
	>({});

	// Collapsible sections state
	const [openSections, setOpenSections] = useState<OpenSections>({
		media: true,
		pricing: true,
		inventory: true,
		shipping: true,
		organization: true,
		variants: true,
		metaData: false,
		options: false,
	});

	// Initialize variant images from product data
	useEffect(() => {
		if (product?.productVariants) {
			const initialVariantImages: Record<
				number,
				Array<{ id?: string; url: string; alt?: string; position: number }>
			> = {};

			product.productVariants.forEach((variant, index) => {
				if (variant.productImages && variant.productImages.length > 0) {
					initialVariantImages[index] = variant.productImages.map((image) => ({
						id: image.id,
						url: image.url,
						alt: image.alt || undefined,
						position: image.position,
					}));
				}
			});

			setVariantImages(initialVariantImages);
		}
	}, [product]);

	// Toggle section visibility
	const toggleSection = (section: keyof typeof openSections) => {
		setOpenSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	// Handle variant image management
	const handleVariantImageUpdate = (
		variantIndex: number,
		newImages: Array<{ id?: string; url: string; alt?: string; position: number }>,
	) => {
		setVariantImages((prev) => ({
			...prev,
			[variantIndex]: newImages,
		}));
	};

	return {
		categories,
		setCategories,
		// images,
		// setImages,
		variantImages,
		setVariantImages,
		openSections,
		toggleSection,
		handleVariantImageUpdate,
	};
}
