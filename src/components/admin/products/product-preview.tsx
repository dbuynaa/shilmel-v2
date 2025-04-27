import { Badge } from "@/components/ui/badge";
import { ProductStatusEnum } from "@/types/types";
import Image from "next/image";

interface ProductPreviewProps {
	title: string;
	price: number;
	compareAtPrice?: number | null;
	status?: ProductStatusEnum;
	image?: string;
}

export function ProductPreview({ title, price, compareAtPrice, status, image }: ProductPreviewProps) {
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(price);
	};

	return (
		<div className="overflow-hidden border rounded-md">
			<div className="relative aspect-square bg-muted">
				{image ? (
					<Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
				) : (
					<div className="flex items-center justify-center w-full h-full text-muted-foreground">No image</div>
				)}
				{status && status !== ProductStatusEnum.ACTIVE && (
					<div className="absolute top-2 left-2">
						<Badge variant="secondary" className="text-xs capitalize">
							{status}
						</Badge>
					</div>
				)}
			</div>
			<div className="p-4">
				<h3 className="font-medium line-clamp-1">{title || "Product title"}</h3>
				<div className="flex items-center gap-2 mt-1">
					<span className="font-medium">{formatPrice(price)}</span>
					{compareAtPrice && compareAtPrice > price && (
						<span className="text-sm text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span>
					)}
				</div>
			</div>
		</div>
	);
}
