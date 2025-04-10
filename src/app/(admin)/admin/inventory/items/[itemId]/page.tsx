import { getAllCategories } from "@/actions/inventory/categories";
import { getItemById } from "@/actions/inventory/items";
import { env } from "@/env";
import type { Metadata } from "next";
import type { JSX } from "react";

import { AddItemForm } from "@/components/admin/forms/inventory/items/add-item-form";
import { SubSubHeader } from "@/components/admin/nav/subsubheader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
	title: "Update Inventory Item",
	description: "Update your Inventory Item",
};

interface AppInventoryItemsUpdateItemPageProps {
	params: Promise<{
		itemId: string;
	}>;
}

export default async function InventoryItemsUpdateItemPage(
	props: AppInventoryItemsUpdateItemPageProps,
): Promise<JSX.Element> {
	const params = await props.params;

	const categories = await getAllCategories();
	const product = await getItemById(params.itemId);
	return (
		<div className="relative">
			<SubSubHeader />

			<div className="p-5">
				<Card className="bg-tertiary max-w-5xl rounded-md">
					<CardHeader className="px-5 pt-5">
						<CardTitle className="text-2xl">Update Inventory Item</CardTitle>
						<CardDescription className="text-base">Update inventory item</CardDescription>
					</CardHeader>
					<CardContent className="px-5 pt-2">
						<AddItemForm item={product} categories={categories} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
