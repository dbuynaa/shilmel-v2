import { env } from "@/env";
import { categoriesSearchParamsSchema } from "@/lib/validations/params";
import type { SearchParams } from "@/types";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import * as React from "react";
import type { JSX } from "react";

import { DataTableSkeleton } from "@/components/admin/data-table/data-table-skeleton";
import { CategoriesTableShell } from "@/components/admin/data-table/table-shells/categories-table-shell";
import { Subheader } from "@/components/admin/nav/subheader";

import { db } from "@/db";
import { categories } from "@/db/schema";
import type { Category } from "@/db/types";
import { asc, desc, like, sql } from "drizzle-orm";

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
	title: "Categories",
	description: "Manage your item categories",
};

interface AppInventoryCategoriesPageProps {
	searchParams: Promise<SearchParams>;
}

export default async function AppInventoryCategoriesPage(
	props: AppInventoryCategoriesPageProps,
): Promise<JSX.Element> {
	const searchParams = await props.searchParams;

	const { page, per_page, sort, name } = categoriesSearchParamsSchema.parse(searchParams);

	const fallbackPage = isNaN(page) || page < 1 ? 1 : page;
	const limit = isNaN(per_page) ? 10 : per_page;
	const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;

	const [column, order] = (sort?.split(".") as [keyof Category | undefined, "asc" | "desc" | undefined]) ?? [
		"createdAt",
		"desc",
	];

	const data = await db
		.select()
		.from(categories)
		.limit(limit)
		.offset(offset)
		.where(name ? like(categories.name, `%${name}%`) : undefined)
		.orderBy(
			column && column in categories
				? order === "asc"
					? asc(categories[column])
					: desc(categories[column])
				: desc(categories.createdAt),
		);
	noStore();
	const count = await db
		.select({
			count: sql<number>`count(${categories.id})`,
		})
		.from(categories)
		.where(name ? like(categories.name, `%${name}%`) : undefined)
		.then((res) => res[0]?.count ?? 0);

	const pageCount = Math.ceil(count / limit);

	return (
		<div>
			<Subheader buttonText="New Category" buttonLink="/admin/categories/new" />
			<div className="p-5">
				<React.Suspense
					fallback={<DataTableSkeleton columnCount={5} isNewRowCreatable={false} isRowsDeletable={true} />}
				>
					<CategoriesTableShell data={data} pageCount={pageCount} />
				</React.Suspense>
			</div>
		</div>
	);
}
