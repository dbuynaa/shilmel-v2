import type { JSX } from "react";

import { getProducts } from "@/actions/product/products";
import { ProuductTableShell } from "@/components/admin/data-table/table-shells/product-table-shell";
import { ItemsSubheader } from "@/components/admin/inventory/subheaders/items-subheader";
import { unstable_noStore as noStore } from "next/cache";
import type { SearchParams } from "next/dist/server/request/search-params";

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
				<ProuductTableShell data={data} pageCount={1} />
			</div>
		</div>
	);
}
