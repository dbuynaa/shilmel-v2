import type { InferResultType } from "@/lib/utils/InferResult";
import type { ItemList, Product as SchemaProduct, Thing, WebSite, WithContext } from "schema-dts";

import { formatProductName } from "@/lib/utils";

export const JsonLd = <T extends Thing>({
	jsonLd,
}: {
	jsonLd: WithContext<T>;
}) => {
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
};

type ProductWithVariants = InferResultType<"products", { variants: { with: { images: true } } }>;

export const mappedProductToJsonLd = (product: ProductWithVariants): WithContext<SchemaProduct> => {
	const variant = product.variants[0];
	const productName = formatProductName(product.name, variant?.size ?? undefined);

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name: productName,
		image: variant?.images[0]?.url,
		description: product.description ?? undefined,
		sku: product.id,
		offers: {
			"@type": "Offer",
			price: product.price.toString(),
			priceCurrency: "USD",
			availability:
				(variant?.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
		},
	};
};

export const mappedProductsToJsonLd = (products: readonly ProductWithVariants[]): WithContext<ItemList> => {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: products.map(mappedProductToJsonLd),
	};
};

type Account = {
	business_profile?: {
		name?: string;
		url?: string;
	};
};

export const accountToWebsiteJsonLd = ({
	account,
	logoUrl,
}: {
	account: Account | null | undefined;
	logoUrl: string | null | undefined;
}): WithContext<WebSite> => {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: account?.business_profile?.name ?? "Your Next Store",
		url: account?.business_profile?.url ?? "https://yournextstore.com",
		mainEntityOfPage: {
			"@type": "WebPage",
			url: account?.business_profile?.url ?? "https://yournextstore.com",
		},
		...(logoUrl && {
			image: {
				"@type": "ImageObject",
				url: logoUrl,
			},
		}),
		publisher: {
			"@type": "Organization",
			name: account?.business_profile?.name ?? "Your Next Store",
			url: account?.business_profile?.url ?? "https://yournextstore.com",
		},
	};
};
