import { ProductForm } from "@/components/admin/forms/products/product-form";
import { psGetProductById } from "@/db/prepared/product.statements";
import { ProductStatusEnum } from "@/db/types/enums";
import { env } from "@/env";
import type { ProductFormValues } from "@/validations/product";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSX } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
	title: "Update Inventory Item",
	description: "Update your Inventory Item",
};

interface AppProductPageProps {
	params: Promise<{
		id: string;
	}>;
}
export async function generateStaticParams() {
	return [{ id: "new" }];
}

type AwaitedProduct = Awaited<ReturnType<typeof psGetProductById.execute>>;

export default async function ProductPage(props: AppProductPageProps): Promise<JSX.Element> {
	const params = await props.params;

	// // const categories = await getAllCategories();
	// unstable_noStore();
	const product: AwaitedProduct | undefined =
		params.id !== "new" ? await psGetProductById.execute({ id: params.id }) : undefined;
	if (!product && params.id !== "new") notFound();

	const parsedProduct: ProductFormValues | undefined = product
		? ({
				id: product.id,
				name: product.name,
				slug: product.slug,
				sku: product.sku || undefined,
				price: Number(product.price) || 0,
				compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
				costPrice: product.costPrice ? Number(product.costPrice) : undefined,
				stock: product.stock,
				description: product.description || undefined,
				weight: product.weight ? Number(product.weight) : undefined,
				weightUnit: product.weightUnit,
				metaData: {
					title: product.metaData[0]?.title || undefined,
					description: product.metaData[0]?.description || undefined,
				},
				categories: product?.productCategories.map((category) => category.categoryId) || undefined,
				images:
					product?.productImages.map((image) => {
						return {
							id: image.id,
							url: image.url,
							alt: image.alt || undefined,
							position: image.position,
						};
					}) || [],
				options: product?.productOptions,
				status: (product?.status as ProductStatusEnum) || ProductStatusEnum.DRAFT,
				variants:
					product?.productVariants.map((variant) => {
						return {
							title: variant.title,
							sku: variant.sku || undefined,
							price: Number(variant.price),
							costPrice: variant.costPrice ? Number(variant.costPrice) : undefined,
							compareAtPrice: variant.compareAtPrice ? Number(variant.compareAtPrice) : undefined,
							stock: variant.stock,
							weight: variant.weight ? Number(variant.weight) : undefined,
							weightUnit: variant.weightUnit,
							images: [],
							options: variant.optionValues.map((optionValue) => {
								return {
									name:
										product.productOptions.find((option) => option.id === optionValue.optionValueId)?.name ||
										"",
									value: optionValue.productOptionValue.value,
								};
							}),
						};
					}) || [],
			} satisfies ProductFormValues)
		: undefined;
	return (
		<div className="relative">
			<ProductForm product={parsedProduct} />
		</div>
	);
}
