import type { ProudctWithVariants } from "@/db/schema";
import { getLocale } from "@/i18n/server";
import Image from "next/image";

import { JsonLd, mappedProductsToJsonLd } from "@/components/store/json-ld";
import { YnsLink } from "@/components/store/yns-link";
import { formatMoney } from "@/lib/utils";

export const ProductList = async ({
	products,
}: {
	products: ProudctWithVariants[];
}) => {
	const locale = await getLocale();

	return (
		<>
			<ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{products.map((product, idx) => {
					return (
						<li key={product.id} className="group">
							<YnsLink href={`/product/${product.slug}`}>
								<article className="bg-card overflow-hidden">
									{product?.variants?.[0]?.images[0] && (
										<div className="bg-tertiary aspect-square h-full overflow-hidden rounded-lg">
											<Image
												className="group-hover:rotate hover-perspective bg-tertiary h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
												src={product.variants[0].images[0].url}
												width={768}
												height={768}
												loading={idx < 3 ? "eager" : "lazy"}
												priority={idx < 3}
												sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
												alt={product.name}
											/>
										</div>
									)}
									<div className="p-2">
										<h2 className="text-primary text-xl font-medium">{product.name}</h2>
										<footer className="text-muted-foreground/80 text-base font-normal">
											{product.price && (
												<p>
													{formatMoney({
														amount: parseInt(product.price),
														currency: "USD",
														locale,
													})}
												</p>
											)}
										</footer>
									</div>
								</article>
							</YnsLink>
						</li>
					);
				})}
			</ul>
			<JsonLd jsonLd={mappedProductsToJsonLd(products)} />
		</>
	);
};
