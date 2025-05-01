import { env } from "@/env";
import { getLocale, getTranslations } from "@/i18n/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
// import { ProductModel3D } from "@/admin/(store)/product/[slug]/product-model3d";
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
	const variants = await getProductVariantsByProductId(product?.id || "");
	const selectedVariant = variants?.length
		? (variants.find((variant) => variant.sku === searchParams.variant) ?? variants[0])
		: null;
	if (!product || !selectedVariant) {
		return notFound();
	}

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
	const variants = await getProductVariantsByProductId(product?.id || "");
	const selectedVariant = variants?.find((variant) => variant.sku === searchParams.variant) ?? variants?.[0];
	if (!product || !selectedVariant) {
		return notFound();
	}

	const t = await getTranslations("/product.page");
	const locale = await getLocale();

	const category = product.productCategories[0];
	const images = product.productImages || [];
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
									<YnsLink href={`/category/${category.category.name}`}>
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
								<BreadcrumbPage>{selectedVariant.sku}</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>

			<StickyBottom product={product} variant={selectedVariant?.sku || ""}>
				<div className="mt-4 grid gap-4 lg:grid-cols-12">
					<div className="lg:col-span-5 lg:col-start-8">
						<h1 className="text-foreground text-3xl leading-none font-bold tracking-tight">{product.name}</h1>
						{product.price && (
							<p className="text-foreground/70 mt-2 text-2xl leading-none font-medium tracking-tight">
								{formatMoney({
									amount: Number.parseInt(product.price),
									currency: "USD",
									locale,
								})}
							</p>
						)}
						<div className="mt-2">
							{selectedVariant && selectedVariant?.stock <= 0 && <div>Out of stock</div>}
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
										{idx === 0 && !selectedVariant.productImages[0]?.url ? (
											<MainProductImage
												key={image.id}
												className="w-full rounded-lg object-cover object-center transition-opacity"
												src={image.url}
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
												sizes="(max-width: 1024x) 33vw, (max-width: 1280px) 20vw, 225px"
												loading="eager"
												priority
												alt=""
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
							<div className="prose text-secondary-foreground">
								{product.description}
								{/* <Markdown source={product.description || ""} /> */}
							</div>
						</section>
						{/* TODO: fix the variants*/}
						{variants && variants.length > 1 && (
							<div className="grid gap-2">
								{product.productOptions.map((option) => (
									<div key={option.id}>
										<p className="text-base font-medium" id={`variant-label-${option.id}`}>
											{option.name}
										</p>
										<ul
											role="list"
											className="grid grid-cols-4 gap-2"
											aria-labelledby={`variant-label-${option.id}`}
										>
											{option.productOptionValues.map((value) => {
												const isSelected = value.value === selectedVariant.sku;
												return (
													<li key={value.id}>
														<YnsLink
															scroll={false}
															prefetch={true}
															href={`/product/${product.slug}?variant=${value.value}`}
															className={cn(
																"hover:bg-secondary/30 flex cursor-pointer items-center justify-center gap-2 rounded-md border p-2 transition-colors",
																isSelected && "border-primary bg-tertiary font-medium",
															)}
															aria-selected={isSelected}
														>
															{value.value}
														</YnsLink>
													</li>
												);
											})}
										</ul>
									</div>
								))}
							</div>
						)}

						<AddToCartButton
							productId={product.id}
							variant={selectedVariant?.sku || ""}
							disabled={selectedVariant?.stock <= 0}
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
