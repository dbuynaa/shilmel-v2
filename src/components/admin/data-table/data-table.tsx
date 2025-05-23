import type { DataTableFilterableColumn, DataTableSearchableColumn } from "@/types";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type PaginationState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { DataTablePagination } from "@/components/admin/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/admin/data-table/data-table-toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	pageCount: number;
	filterableColumns?: DataTableFilterableColumn<TData>[];
	searchableColumns?: DataTableSearchableColumn<TData>[];
	newRowLink?: string;
	deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	pageCount,
	filterableColumns = [],
	searchableColumns = [],
	newRowLink,
	deleteRowsAction,
}: DataTableProps<TData, TValue>) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Search params
	const page = searchParams?.get("page") ?? "1";
	const pageAsNumber = Number(page);
	const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
	const per_page = searchParams?.get("per_page") ?? "10";
	const perPageAsNumber = Number(per_page);
	const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
	const sort = searchParams?.get("sort");
	const [column, order] = sort?.split(".") ?? [];

	// Create query string
	const createQueryString = React.useCallback(
		(params: Record<string, string | number | null>) => {
			const newSearchParams = new URLSearchParams(searchParams?.toString());

			for (const [key, value] of Object.entries(params)) {
				if (value === null) {
					newSearchParams.delete(key);
				} else {
					newSearchParams.set(key, String(value));
				}
			}

			return newSearchParams.toString();
		},
		[searchParams],
	);

	// Table states
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

	// Handle server-side pagination
	const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
		pageIndex: fallbackPage - 1,
		pageSize: fallbackPerPage,
	});

	const pagination = React.useMemo(
		() => ({
			pageIndex,
			pageSize,
		}),
		[pageIndex, pageSize],
	);

	React.useEffect(() => {
		setPagination({
			pageIndex: fallbackPage - 1,
			pageSize: fallbackPerPage,
		});
	}, [fallbackPage, fallbackPerPage]);

	React.useEffect(() => {
		router.push(
			`${pathname}?${createQueryString({
				page: pageIndex + 1,
				per_page: pageSize,
			})}`,
			{
				scroll: false,
			},
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageIndex, pageSize]);

	// Handle server-side sorting
	const [sorting, setSorting] = React.useState<SortingState>([
		{
			id: column ?? "",
			desc: order === "desc",
		},
	]);

	React.useEffect(() => {
		router.push(
			`${pathname}?${createQueryString({
				page,
				sort: sorting[0]?.id ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}` : null,
			})}`,
			{
				scroll: false,
			},
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sorting]);

	// Handle server-side filtering
	const debouncedSearchableColumnFilters = JSON.parse(
		useDebounce(
			JSON.stringify(
				columnFilters.filter((filter) => {
					return searchableColumns.find((column) => column.id === filter.id);
				}),
			),
			500,
		),
	) as ColumnFiltersState;

	const filterableColumnFilters = columnFilters.filter((filter) => {
		return filterableColumns.find((column) => column.id === filter.id);
	});

	React.useEffect(() => {
		for (const column of debouncedSearchableColumnFilters) {
			if (typeof column.value === "string") {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[column.id]: typeof column.value === "string" ? column.value : null,
					})}`,
					{
						scroll: false,
					},
				);
			}
		}

		for (const key of searchParams.keys()) {
			if (
				searchableColumns.find((column) => column.id === key) &&
				!debouncedSearchableColumnFilters.find((column) => column.id === key)
			) {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[key]: null,
					})}`,
					{
						scroll: false,
					},
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchableColumnFilters]);

	React.useEffect(() => {
		for (const column of filterableColumnFilters) {
			if (typeof column.value === "object" && Array.isArray(column.value)) {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[column.id]: column.value.join("."),
					})}`,
					{
						scroll: false,
					},
				);
			}
		}

		for (const key of searchParams.keys()) {
			if (
				filterableColumns.find((column) => column.id === key) &&
				!filterableColumnFilters.find((column) => column.id === key)
			) {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[key]: null,
					})}`,
					{
						scroll: false,
					},
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterableColumnFilters]);

	const table = useReactTable({
		data,
		columns,
		pageCount: pageCount ?? -1,
		state: {
			pagination,
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
	});

	return (
		<div className="w-full space-y-3 overflow-auto">
			<DataTableToolbar
				table={table}
				filterableColumns={filterableColumns}
				searchableColumns={searchableColumns}
				newRowLink={newRowLink}
				deleteRowsAction={deleteRowsAction}
			/>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className="whitespace-nowrap">
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
