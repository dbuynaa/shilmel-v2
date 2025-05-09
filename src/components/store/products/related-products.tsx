import { getProductsByCategory } from "@/actions/product/products";
import { YnsLink } from "@/components/store/yns-link";
import { formatMoney } from "@/lib/utils";
import Image from "next/image";

interface RelatedProductsProps {
	locale: string;
	category?: string;
}

export async function RelatedProducts({ category, locale }: RelatedProductsProps) {
	const products = await getProductsByCategory(category || "all");
	if (!products) return null;
	return (
		<section className="mt-12 border-t pt-8">
			<h2 className="text-2xl font-bold mb-6">You might also like</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{products.map((product) => (
					<div key={product.id} className="group">
						<div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-2">
							<YnsLink href={`/product/${product.slug}`}>
								<Image
									src={product.productImages[0]?.url || "/placeholder.svg"}
									alt={product.name}
									width={300}
									height={300}
									className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
								/>
							</YnsLink>
						</div>
						<h3 className="text-sm font-medium">
							<YnsLink href={`/product/${product.slug}`}>{product.name}</YnsLink>
						</h3>
						<p className="text-sm text-muted-foreground">
							{formatMoney({
								amount: product.price ?? 0,
								currency: "USD",
								locale,
							})}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
