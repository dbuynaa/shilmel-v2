import { db } from "@/db";
import { type Product, products } from "@/db/schema";
import type { SearchParams } from "@/types";
import { categoriesSearchParamsSchema } from "@/validations/params";
import { asc, desc, like } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { type JSX, Suspense } from "react";

import { DataTableSkeleton } from "@/components/admin/data-table/data-table-skeleton";
import { ItemsTableShell } from "@/components/admin/data-table/table-shells/items-table-shell";
// import { OptionCards } from "@/components/admin/inventory/option-cards"
import { ItemsSubheader } from "@/components/admin/inventory/subheaders/items-subheader";

interface Props {
	searchParams: Promise<SearchParams>;
}

export default async function ProductsPage(props: Props): Promise<JSX.Element> {
	const searchParams = await props.searchParams;

	const { page, per_page, sort, name } = categoriesSearchParamsSchema.parse(searchParams);

	const fallbackPage = isNaN(page) || page < 1 ? 1 : page;
	const limit = isNaN(per_page) ? 10 : per_page;
	const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;

	const [column, order] = (sort?.split(".") as [keyof Product | undefined, "asc" | "desc" | undefined]) ?? [
		"createdAt",
		"desc",
	];

	noStore();
	const data = await db
		.select()
		.from(products)
		.limit(limit)
		.offset(offset)
		.where(name ? like(products.name, `%${name}%`) : undefined)
		.orderBy(
			column && column in products
				? order === "asc"
					? asc(products[column])
					: desc(products[column])
				: desc(products.createdAt),
		);
	return (
		<div>
			<ItemsSubheader />

			<div className="p-5">
				<Suspense
					fallback={<DataTableSkeleton columnCount={5} isNewRowCreatable={false} isRowsDeletable={true} />}
				>
					<ItemsTableShell data={data} pageCount={1} />
				</Suspense>
			</div>
			{/* <OptionCards /> */}
		</div>
	);
}
