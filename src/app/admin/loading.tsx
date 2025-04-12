import { DataTableSkeleton } from "@/components/admin/data-table/data-table-skeleton";

export default function Loading() {
	return (
		<div className="p-5">
			<DataTableSkeleton rowCount={3} columnCount={3} isNewRowCreatable={false} isRowsDeletable={false} />;
		</div>
	);
}
