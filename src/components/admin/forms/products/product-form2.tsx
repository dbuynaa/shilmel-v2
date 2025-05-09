"use client";

import { createProduct, updateProduct } from "@/actions/product/products";
import type { UploadFilesRouter } from "@/app/api/uploadthing/core";
import { Form } from "@/components/ui/form";
import type { psGetProductById } from "@/db/prepared/product.statements";
import { ProductStatusEnum } from "@/db/types/enums";
import { type ProductFormValues, productSchema } from "@/lib/validations/product";
import type { FileWithPreview } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useProductFormState } from "@/hooks/use-product-form-state";
import { ProductFormHeader } from "./product-form-header";
import { ProductFormSections } from "./product-form-sections";
import { ProductFormSidebar } from "./product-form-sidebar";
import { VariantDetailsDialog } from "./variants/variant-details-dialog";

const { useUploadThing } = generateReactHelpers<UploadFilesRouter>();

type AwaitedProduct = Awaited<ReturnType<typeof psGetProductById.execute>>;

export type ProductFormProps = {
	product?: AwaitedProduct;
};

export function ProductForm({ product }: ProductFormProps) {
	const isEditMode = !!product?.id;
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [files, setFiles] = useState<FileWithPreview[]>([]);
	const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);

	const { isUploading, startUpload } = useUploadThing("productImage", {
		onClientUploadComplete: () => {
			toast.success("Image uploaded successfully");
		},
		onUploadError: () => {
			toast.error("Failed to upload image");
		},
		onUploadBegin: () => {
			toast.info("Uploading image");
		},
	});

	const {
		categories,
		setCategories,
		// images,
		// setImages,
		variantImages,
		setVariantImages,
		openSections,
		toggleSection,
		handleVariantImageUpdate,
	} = useProductFormState(product);

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			id: product?.id || undefined,
			name: product?.name || undefined,
			slug: product?.slug,
			sku: product?.sku || undefined,
			price: Number(product?.price || 0),
			compareAtPrice: product?.compareAtPrice ? Number(product.compareAtPrice) : undefined,
			costPrice: product?.costPrice ? Number(product.costPrice) : undefined,
			stock: product?.stock,
			description: product?.description || undefined,
			weight: product?.weight ? Number(product?.weight) : undefined,
			weightUnit: product?.weightUnit,
			metaData: {
				title: product?.metaData[0]?.title || undefined,
				description: product?.metaData[0]?.description || undefined,
			},
			categories: product?.productCategories.map((category) => category.categoryId) || undefined,
			images:
				product?.productImages.map((image) => ({
					id: image.id,
					url: image.url,
					alt: image.alt || undefined,
					position: image.position,
				})) || undefined,
			options: product?.productOptions,
			status: (product?.status as ProductStatusEnum) || ProductStatusEnum.DRAFT,
			variants:
				product?.productVariants.map((variant) => ({
					title: variant.title,
					sku: variant.sku || undefined,
					price: Number(variant.price),
					costPrice: variant.costPrice ? Number(variant.costPrice) : undefined,
					compareAtPrice: variant.compareAtPrice ? Number(variant.compareAtPrice) : undefined,
					stock: variant.stock,
					weight: variant.weight ? Number(variant.weight) : undefined,
					weightUnit: variant.weightUnit,
					images: variant.productImages.map((image) => ({
						id: image.id,
						url: image.url,
						alt: image.alt || undefined,
						position: image.position,
					})),
					options: variant.optionValues.map((optionValue) => ({
						name:
							product.productOptions.find((option) => option.id === optionValue.optionValueId)?.name || "",
						value: optionValue.productOptionValue.value,
					})),
				})) || [],
		},
	});

	const handleFiles = async (files: FileWithPreview[]) => {
		try {
			const newImages = await startUpload(files);

			if (!newImages) {
				throw new Error("Failed to upload images");
			}

			toast.success(`${newImages.length} image${newImages.length > 1 ? "s" : ""} added successfully`);

			return newImages;
		} catch (error) {
			console.error("Error uploading images:", error);
			toast.error("Failed to upload images");
			return [];
		}
	};

	function onSubmit(data: ProductFormValues) {
		startTransition(async () => {
			try {
				// Upload images
				const newImages = await handleFiles(files);

				// Update variants with their images from state
				const updatedVariants = data.variants?.map((variant, index) => ({
					...variant,
					images: variantImages[index] || [],
				}));

				// Update with product categories and images from state
				const productData = {
					...data,
					categories,
					images: newImages.map((image) => ({
						id: image.key,
						url: image.ufsUrl,
						alt: image.key.split("_")[1] ?? image.key,
						position: newImages.length + 1,
					})),
					variants: updatedVariants,
				};

				let result;

				if (isEditMode) {
					toast("Updating product...", {
						description: "Your product is being updated.",
					});
					result = await updateProduct(product.id!, productData);
				} else {
					toast("Creating product...", {
						description: "Your product is being created.",
					});
					result = await createProduct(productData);
				}

				if (result?.productId) {
					toast.success(isEditMode ? "Product updated successfully" : "Product created successfully", {
						description: isEditMode
							? "Your product has been updated successfully."
							: "Your product has been created successfully.",
					});
					router.push("/admin/products/" + result.productId);
					router.refresh();
				} else {
					// Handle errors
					throw new Error(
						result.error?.toString() || `Failed to ${isEditMode ? "update" : "create"} product`,
					);
				}
			} catch (error: unknown) {
				console.error(`Failed to ${isEditMode ? "update" : "create"} product:`, error);
				toast.error(`Error ${isEditMode ? "updating" : "creating"} product`, {
					description: error instanceof Error ? error.message : "Unknown error occurred",
				});
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<ProductFormHeader isEditMode={isEditMode} isPending={isPending} form={form} router={router} />

				<div className="container px-4 py-6 mx-auto">
					<div className="grid gap-6 md:grid-cols-3">
						{/* Left column - Main form */}
						<div className="space-y-6 md:col-span-2">
							<ProductFormSections
								form={form}
								openSections={openSections}
								toggleSection={toggleSection}
								// images={images}
								// setImages={setImages}
								files={files}
								setFiles={(files) => {
									setFiles(files);
									form.setValue(
										"images",
										files.map((file, index) => ({
											url: file.preview,
											alt: file.name || "",
											position: index + 1,
										})),
									);
								}}
								isUploading={isUploading}
								isPending={isPending}
								categories={categories}
								setCategories={setCategories}
								variantImages={variantImages}
								setSelectedVariantIndex={setSelectedVariantIndex}
								handleVariantImageUpdate={handleVariantImageUpdate}
							/>
						</div>

						{/* Right column - Preview and status */}
						<ProductFormSidebar files={files} form={form} />
					</div>
				</div>

				{/* Variant Details Dialog */}
				<VariantDetailsDialog
					selectedVariantIndex={selectedVariantIndex}
					setSelectedVariantIndex={setSelectedVariantIndex}
					form={form}
					variantImages={variantImages}
					handleVariantImageUpdate={handleVariantImageUpdate}
				/>
			</form>
		</Form>
	);
}
