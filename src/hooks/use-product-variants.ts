"use client";

import type { ProductFormValues, VariantFormValues } from "@/lib/validations/product";
import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

interface OptionValueType {
	option: string;
	value: string;
}

type WeightUnitType = "KG" | "G" | "LB" | "OZ";

export const emptyVariant: VariantFormValues = {
	title: "",
	sku: "",
	price: 0,
	stock: 0,
	compareAtPrice: 0,
	images: [],
	costPrice: 0,
	weight: 0,
	weightUnit: "KG" as WeightUnitType,
	options: [],
};

export function useProductVariants(
	form: UseFormReturn<ProductFormValues>,
	variantImages: Record<number, Array<{ id?: string; url: string; alt?: string; position: number }>>,
) {
	// Replace the entire useEffect block with this improved version that prevents infinite recursion
	const isUpdatingRef = useRef(false);

	useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			// Skip if we're already updating variants or if the change isn't related to options
			if (isUpdatingRef.current || !(name && (name.startsWith("options") || name === "options"))) {
				return;
			}

			const options = form.getValues("options");

			// Only generate variants if we have valid options
			if (options?.every((option) => option.name && option.values.length > 0)) {
				// Extract all option values
				const optionValues = options.map((option) =>
					option.values.map((v) => ({ option: option.name, value: v.value })),
				);

				// Skip if any option has no values
				if (optionValues.some((values) => values.length === 0)) return;

				try {
					isUpdatingRef.current = true;

					const combinations = generateCombinations(optionValues);

					// Create variants from combinations
					const newVariants: VariantFormValues[] = combinations.map((combo) => {
						// Find if a matching variant already exists to preserve its values
						const existingVariantIndex =
							form
								.getValues("variants")
								?.findIndex((v) => v.title === combo.map((c) => c.value).join(" / ")) || -1;

						const existingVariant =
							existingVariantIndex !== -1 ? form.getValues("variants")?.[existingVariantIndex] : undefined;

						// Preserve variant images if they exist
						const variantImagesArray =
							existingVariantIndex !== -1 && variantImages[existingVariantIndex]
								? variantImages[existingVariantIndex]
								: [];

						return {
							...emptyVariant,
							...(existingVariant || {}), // Preserve existing variant data if available
							title: combo.map((c) => c.value).join(" / "),
							price: existingVariant?.price || form.getValues("price"),
							costPrice: existingVariant?.costPrice || form.getValues("costPrice"),
							compareAtPrice: existingVariant?.compareAtPrice || form.getValues("compareAtPrice"),
							stock: existingVariant?.stock || form.getValues("stock"),
							sku: existingVariant?.sku || generateSkuFromCombination(combo, form),
							options: combo.map((c) => ({ name: c.option, value: c.value })),
							images: variantImagesArray,
						};
					});

					// Update variants silently without showing toast
					form.setValue("variants", newVariants, { shouldDirty: true });
				} finally {
					// Always reset the flag when done
					setTimeout(() => {
						isUpdatingRef.current = false;
					}, 0);
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [form, variantImages]);

	// Options management functions
	const addOption = () => {
		const currentOptions = form.getValues("options") || [];
		form.setValue("options", [...currentOptions, { name: "", values: [{ value: "" }] }]);
	};

	const removeOption = (index: number) => {
		const currentOptions = form.getValues("options") || [];
		form.setValue(
			"options",
			currentOptions.filter((_, i: number) => i !== index),
		);
	};

	const addOptionValue = (optionIndex: number) => {
		const currentOptions = form.getValues("options") || [];
		const currentOption = currentOptions[optionIndex];

		if (currentOption) {
			const updatedOptions = [...currentOptions];
			updatedOptions[optionIndex] = {
				...currentOption,
				values: [...currentOption.values, { value: "" }],
			};
			form.setValue("options", updatedOptions);
		}
	};

	const removeOptionValue = (optionIndex: number, valueIndex: number) => {
		const currentOptions = form.getValues("options") || [];
		const currentOption = currentOptions[optionIndex];

		if (currentOption) {
			const updatedOptions = [...currentOptions];
			updatedOptions[optionIndex] = {
				...currentOption,
				values: currentOption.values.filter((_: { value: string }, i: number) => i !== valueIndex),
			};
			form.setValue("options", updatedOptions);
		}
	};

	const moveOption = (index: number, direction: "up" | "down") => {
		const currentOptions = form.getValues("options") || [];
		const newIndex = direction === "up" ? index - 1 : index + 1;

		// Ensure the new index is valid
		if (newIndex < 0 || newIndex >= currentOptions.length) return;

		// Swap the options
		const updatedOptions = [...currentOptions];
		if (updatedOptions[index] && updatedOptions[newIndex]) {
			const temp = updatedOptions[index];
			updatedOptions[index] = updatedOptions[newIndex];
			updatedOptions[newIndex] = temp;
		}

		form.setValue("options", updatedOptions);

		// Regenerate variants to reflect the new option order
		regenerateVariants(updatedOptions, form, variantImages);
	};

	const moveOptionValue = (optionIndex: number, valueIndex: number, direction: "up" | "down") => {
		const currentOptions = form.getValues("options") || [];
		const currentOption = currentOptions[optionIndex];

		if (!currentOption) return;

		const newValueIndex = direction === "up" ? valueIndex - 1 : valueIndex + 1;

		// Ensure the new index is valid
		if (newValueIndex < 0 || newValueIndex >= currentOption.values.length) return;

		// Swap the values
		const updatedValues = [...currentOption.values];
		if (updatedValues[valueIndex] && updatedValues[newValueIndex]) {
			const temp = updatedValues[valueIndex];
			updatedValues[valueIndex] = updatedValues[newValueIndex];
			updatedValues[newValueIndex] = temp;
		}

		const updatedOptions = [...currentOptions];
		updatedOptions[optionIndex] = {
			...currentOption,
			values: updatedValues,
		};

		form.setValue("options", updatedOptions);
	};

	return {
		addOption,
		removeOption,
		addOptionValue,
		removeOptionValue,
		moveOption,
		moveOptionValue,
	};
}

// Helper functions
export function generateCombinations(
	arrays: OptionValueType[][],
	current: OptionValueType[] = [],
	index = 0,
): OptionValueType[][] {
	if (index === arrays.length) {
		return [current];
	}

	return arrays[index]?.flatMap((item) => generateCombinations(arrays, [...current, item], index + 1)) || [];
}

// Fix the generateSkuFromCombination function to handle edge cases better
export function generateSkuFromCombination(
	combo: OptionValueType[],
	form: UseFormReturn<ProductFormValues>,
): string {
	// Safely get the base SKU
	let baseSku = "";
	try {
		const formSku = form.getValues("sku");
		const formName = form.getValues("name");

		if (formSku) {
			baseSku = formSku;
		} else if (formName && typeof formName === "string") {
			baseSku = formName.substring(0, 3).toUpperCase();
		} else {
			baseSku = "SKU";
		}
	} catch (error) {
		baseSku = "SKU";
	}

	// Safely generate the suffix
	let suffix = "";
	try {
		suffix = combo
			.map((c) => (c.value && typeof c.value === "string" ? c.value.substring(0, 1).toUpperCase() : ""))
			.join("");
	} catch (error) {
		suffix = "VAR";
	}

	return `${baseSku}-${suffix || "VAR"}`;
}

export function generateSlug(title: string | number): string {
	return String(title)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}
interface Option {
	name: string;
	values: { value: string }[];
}

// Fix the regenerateVariants function to prevent infinite recursion
function regenerateVariants(
	options: Option[] = [],
	form: UseFormReturn<ProductFormValues>,
	variantImages: Record<number, Array<{ id?: string; url: string; alt?: string; position: number }>>,
) {
	// Skip if options are invalid
	if (!options || !options.every((option) => option.name && option.values.length > 0)) {
		return;
	}

	const optionValues = options.map((option) =>
		option.values.map((v) => ({ option: option.name, value: v.value })),
	);

	if (optionValues.some((values) => values.length === 0)) return;

	try {
		const combinations = generateCombinations(optionValues);
		const newVariants: VariantFormValues[] = combinations.map((combo) => {
			const existingVariantIndex =
				form.getValues("variants")?.findIndex((v) => {
					const variantOptions = new Set(v.options.map((o) => `${o.name}:${o.value}`));
					const comboOptions = new Set(combo.map((c) => `${c.option}:${c.value}`));
					return (
						[...variantOptions].every((o) => comboOptions.has(o)) &&
						[...comboOptions].every((o) => variantOptions.has(o))
					);
				}) || -1;

			const existingVariant =
				existingVariantIndex !== -1 ? form.getValues("variants")?.[existingVariantIndex] : undefined;

			const variantImagesArray =
				existingVariantIndex !== -1 && variantImages[existingVariantIndex]
					? variantImages[existingVariantIndex]
					: [];

			// Safely generate SKU
			let sku = "";
			try {
				sku = existingVariant?.sku || generateSkuFromCombination(combo, form);
			} catch (error) {
				sku = `SKU-${Math.random().toString(36).substring(2, 7)}`;
			}

			return {
				...emptyVariant,
				...(existingVariant || {}),
				title: combo.map((c) => c.value).join(" / "),
				price: existingVariant?.price || form.getValues("price"),
				costPrice: existingVariant?.costPrice || form.getValues("costPrice"),
				compareAtPrice: existingVariant?.compareAtPrice || form.getValues("compareAtPrice"),
				stock: existingVariant?.stock || form.getValues("stock"),
				sku,
				options: combo.map((c) => ({ name: c.option, value: c.value })),
				images: variantImagesArray,
			};
		});

		// Use shouldDirty to prevent triggering unnecessary form updates
		form.setValue("variants", newVariants, { shouldDirty: true });
	} catch (error) {
		console.error("Error regenerating variants:", error);
	}
}
