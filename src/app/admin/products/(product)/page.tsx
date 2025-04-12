import { getProducts } from "@/actions/products";
import type { SearchParams } from "@/types";
import type { JSX } from "react";

import { ItemsTableShell } from "@/components/admin/data-table/table-shells/items-table-shell";
import { ItemsSubheader } from "@/components/admin/inventory/subheaders/items-subheader";
import { unstable_noStore as noStore } from "next/cache";

export interface Props {
	searchParams: Promise<SearchParams>;
}

export default async function ProductsPage(props: Props): Promise<JSX.Element> {
	const searchParams = await props.searchParams;
	const data = await getProducts(searchParams);
	noStore();
	return (
		<div>
			<ItemsSubheader />

			<div className="p-5">
				<ItemsTableShell data={data} pageCount={1} />
			</div>
		</div>
	);
}
