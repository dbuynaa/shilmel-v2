import { env } from "@/env";
import { getLocale, getTranslations } from "@/i18n/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";

import { getProductBySlug, getProductVariantsByProductId } from "@/actions/product/products";
import { ProductImageModal } from "@/app/(store)/product/[slug]/product-image-modal";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { JsonLd, mappedProductToJsonLd } from "@/components/store/json-ld";
import { MainProductImage } from "@/components/store/products/main-product-image";
import { StickyBottom } from "@/components/store/sticky-bottom";
import { YnsLink } from "@/components/store/yns-link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn, deslugify, formatMoney, formatProductName } from "@/lib/utils";

export const generateMetadata = async (props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string }>;
}): Promise<Metadata> => {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const product = await getProductBySlug(params.slug);

	if (!product) {
		return notFound();
	}

	const variants = await getProductVariantsByProductId(product.id);
	const selectedVariant = searchParams.variant
		? variants?.find((variant) => variant.id === searchParams.variant)
		: variants?.[0];

	const t = await getTranslations("/product.metadata");

	const canonical = new URL(`${env.NEXT_PUBLIC_APP_URL}/product/${product.slug}`);
	if (searchParams.variant) {
		canonical.searchParams.set("variant", searchParams.variant);
	}

	const productName = formatProductName(product.name, selectedVariant?.sku || "");

	return {
		title: t("title", { productName }),
		description: product.description,
		alternates: { canonical },
	} satisfies Metadata;
};

export default async function SingleProductPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string; image?: string }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;

	const product = await getProductBySlug(params.slug);

	if (!product) {
		return notFound();
	}

	const variants = await getProductVariantsByProductId(product.id);
	// Find the selected variant by ID or default to the first variant
	const selectedVariant = variants?.find((variant) => variant.id === searchParams.variant) || variants?.[0];

	const t = await getTranslations("/product.page");
	const locale = await getLocale();

	const category = product.productCategories[0];
	const images = product.productImages || [];

	console.log("selectedVariant", variants);

	return (
		<article className="pb-12">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild className="inline-flex min-h-12 min-w-12 items-center justify-center">
							<YnsLink href="/products">{t("allProducts")}</YnsLink>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{category && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink className="inline-flex min-h-12 min-w-12 items-center justify-center" asChild>
									<YnsLink href={`/category/${category.category.slug}`}>
										{deslugify(category.category.slug)}
									</YnsLink>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{product.name}</BreadcrumbPage>
					</BreadcrumbItem>
					{selectedVariant && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{selectedVariant.title}</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>

			<StickyBottom product={product} variant={selectedVariant?.sku || ""}>
				<div className="mt-4 grid gap-4 lg:grid-cols-12">
					<div className="lg:col-span-5 lg:col-start-8">
						<h1 className="text-foreground text-3xl leading-none font-bold tracking-tight">{product.name}</h1>
						{selectedVariant?.price ? (
							<p className="text-foreground/70 mt-2 text-2xl leading-none font-medium tracking-tight">
								{formatMoney({
									amount: selectedVariant.price,
									currency: "USD",
									locale,
								})}
							</p>
						) : product.price ? (
							<p className="text-foreground/70 mt-2 text-2xl leading-none font-medium tracking-tight">
								{formatMoney({
									amount: product.price,
									currency: "USD",
									locale,
								})}
							</p>
						) : null}
						<div className="mt-2">
							{selectedVariant && selectedVariant.stock <= 0 && (
								<div className="text-red-500 font-medium">out Of Stock</div>
							)}
							{selectedVariant && selectedVariant.stock > 0 && (
								<div className="text-green-500 font-medium">in Stock</div>
							)}
						</div>
					</div>

					<div className="lg:col-span-7 lg:row-span-3 lg:row-start-1">
						<h2 className="sr-only">{t("imagesTitle")}</h2>

						<div className="grid gap-4 lg:grid-cols-3 [&>*:first-child]:col-span-3">
							{images.map((image, idx) => {
								const params = new URLSearchParams({
									image: idx.toString(),
								});
								if (searchParams.variant) {
									params.set("variant", searchParams.variant);
								}
								return (
									<YnsLink key={idx} href={`?${params}`} scroll={false}>
										{idx === 0 && images[0]?.url != undefined ? (
											<MainProductImage
												key={image.id}
												className="w-full rounded-lg object-cover object-center transition-opacity"
												src={image.url || "/placeholder.svg"}
												loading="eager"
												priority
												quality={100}
												alt={image.alt || ""}
											/>
										) : (
											<Image
												key={image.id}
												className="w-full rounded-lg object-cover object-center transition-opacity"
												src={image.url || "/placeholder.svg"}
												width={700 / 3}
												height={700 / 3}
												sizes="(max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 225px"
												loading="eager"
												priority
												alt={image.alt || ""}
											/>
										)}
									</YnsLink>
								);
							})}
						</div>
					</div>

					<div className="grid gap-8 lg:col-span-5">
						<section>
							<h2 className="sr-only">{t("descriptionTitle")}</h2>
							<div className="prose text-secondary-foreground">{product.description}</div>
						</section>

						<div className="grid gap-2">
							{product.productOptions.map((option) => {
								// For each option (like "Color" or "Size"), determine which values are available
								// based on the currently selected values for other options
								const otherSelectedValues = product.productOptions
									.filter((o) => o.id !== option.id)
									.map((o) => {
										const selectedValue = o.values.find((v) =>
											selectedVariant?.title.split(" / ").includes(v.value),
										)?.value;
										return { optionId: o.id, value: selectedValue };
									})
									.filter((item) => item.value);

								// Get all available variants that match the currently selected values for other options
								const compatibleVariants = variants.filter((variant) => {
									const variantValues = variant.title.split(" / ");
									return otherSelectedValues.every(({ value }) =>
										value ? variantValues.includes(value) : true,
									);
								});

								// Get all possible values for this option from compatible variants
								const availableValues = new Set(
									compatibleVariants
										.map((variant) =>
											variant.title
												.split(" / ")
												.find((value) => option.values.some((v) => v.value === value)),
										)
										.filter(Boolean),
								);

								return (
									<div key={option.id}>
										<p className="text-base font-medium" id={`variant-label-${option.id}`}>
											{option.name}
										</p>
										<ul
											role="list"
											className="grid grid-cols-4 gap-2"
											aria-labelledby={`variant-label-${option.id}`}
										>
											{option.values.map((value) => {
												const isSelected = selectedVariant?.title.split(" / ").includes(value.value);
												const isAvailable = availableValues.has(value.value);

												// Find a variant that includes this value and matches other selected values
												const matchingVariant = variants.find((variant) => {
													const variantValues = variant.title.split(" / ");
													return (
														variantValues.includes(value.value) &&
														otherSelectedValues.every(({ value: otherValue }) =>
															otherValue ? variantValues.includes(otherValue) : true,
														)
													);
												});

												return (
													<li key={value.id}>
														<YnsLink
															scroll={false}
															prefetch={true}
															href={
																isAvailable ? `/product/${product.slug}?variant=${matchingVariant?.id}` : "#"
															}
															className={cn(
																"flex cursor-pointer items-center justify-center gap-2 rounded-md border p-2 transition-colors",
																isSelected && "border-primary bg-tertiary font-medium",
																!isAvailable &&
																	"opacity-50 cursor-not-allowed pointer-events-none border-dashed",
																isAvailable && !isSelected && "hover:bg-secondary/30",
															)}
															aria-selected={isSelected}
															aria-disabled={!isAvailable}
														>
															{value.value}
														</YnsLink>
													</li>
												);
											})}
										</ul>
									</div>
								);
							})}
						</div>

						<AddToCartButton
							productId={product.id}
							variant={selectedVariant?.id || ""}
							disabled={!selectedVariant || selectedVariant.stock <= 0}
						/>
					</div>
				</div>
			</StickyBottom>

			<Suspense>
				<ProductImageModal images={images.map((image) => image.url)} />
			</Suspense>

			<JsonLd jsonLd={mappedProductToJsonLd(product)} />
		</article>
	);
}
