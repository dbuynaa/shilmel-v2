import { getAllCategories } from "@/actions/inventory/categories";
import type { JSX } from "react";

import { AddItemForm } from "@/components/admin/forms/inventory/items/add-item-form";
import { SubSubHeader } from "@/components/admin/nav/subsubheader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AppInventoryItemsNewItemPage(): Promise<JSX.Element> {
	const categories = await getAllCategories();
	return (
		<div className="relative">
			<SubSubHeader />

			<div className="p-5">
				<Card className="max-w-5xl rounded-md bg-tertiary">
					<CardHeader className="px-5 pt-5">
						<CardTitle className="text-2xl">New Inventory Item</CardTitle>
						<CardDescription className="text-base">Add new inventory item</CardDescription>
					</CardHeader>
					<CardContent className="px-5 pt-2">
						<AddItemForm categories={categories} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
