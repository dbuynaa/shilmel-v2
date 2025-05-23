import { getCategoryBySlug } from "@/actions/product/categories";
import { auth } from "@/auth";
import { env } from "@/env";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { JSX } from "react";

import { CategoryForm } from "@/components/admin/forms/inventory/categories/category-form";
import { SubSubHeader } from "@/components/admin/nav/subsubheader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
	title: "Update Category",
	description: "Update your category",
};

interface AppInventoryCategoriesUpdateCategoryPageProps {
	params: Promise<{
		categoryId: string;
	}>;
}

export default async function AppInventoryCategoriesUpdateCategoryPage(
	props: AppInventoryCategoriesUpdateCategoryPageProps,
): Promise<JSX.Element> {
	const params = await props.params;
	const session = await auth();
	if (!session) redirect("/signin");

	const category =
		params.categoryId !== "new" ? await getCategoryBySlug({ slug: params.categoryId }) : undefined;
	if (!category && params.categoryId !== "new") notFound();

	return (
		<div>
			<SubSubHeader />
			<div className="p-5">
				<Card className="bg-tertiary max-w-5xl rounded-md">
					<CardHeader className="px-5 pt-5">
						<CardTitle className="text-2xl">Update Category</CardTitle>
						<CardDescription className="text-base">Update this category of items</CardDescription>
					</CardHeader>
					<CardContent className="px-5 pt-2">
						<CategoryForm category={category || undefined} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
