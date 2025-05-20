// import { ProductForm } from "@/components/admin/forms/products/product-form";
import { ProductForm } from "@/components/admin/forms/products/product-form2";
import { psGetProductById } from "@/db/prepared/product.statements";
import { env } from "@/env";
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
	const product: AwaitedProduct | undefined =
		params.id !== "new" ? await psGetProductById.execute({ id: params.id }) : undefined;
	if (!product && params.id !== "new") notFound();

	return (
		<div className="relative">
			<ProductForm product={product} />
		</div>
	);
}
