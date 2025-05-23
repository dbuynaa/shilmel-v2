"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { JSX } from "react";

import { deleteProduct } from "@/actions/product/products";
// import { deleteItem } from "@/actions/inventory/items";
import { DataTable } from "@/components/admin/data-table/data-table";
import { DataTableColumnHeader } from "@/components/admin/data-table/data-table-column-header";
import { Icons } from "@/components/icons";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/db/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

type AwaitedItem = Pick<Product, "id" | "name" | "description" | "createdAt">;

interface Props {
	data: AwaitedItem[];
	pageCount: number;
}

export function ProuductTableShell({ data, pageCount }: Props): JSX.Element {
	const router = useRouter();
	const [isPending, startTransition] = React.useTransition();
	const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);

	const columns = React.useMemo<ColumnDef<AwaitedItem, unknown>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={table.getIsAllPageRowsSelected()}
						onCheckedChange={(value) => {
							table.toggleAllPageRowsSelected(!!value);
							setSelectedRowIds((prev) => (prev.length === data.length ? [] : data.map((row) => row.id)));
						}}
						aria-label="Select all"
						className="translate-y-[2px]"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => {
							row.toggleSelected(!!value);
							setSelectedRowIds((prev) =>
								value ? [...prev, row.original.id] : prev.filter((id) => id !== row.original.id),
							);
						}}
						aria-label="Select row"
						className="translate-y-[2px]"
					/>
				),
				enableSorting: false,
				enableHiding: false,
			},
			{
				accessorKey: "id",
				header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
			},
			{
				accessorKey: "name",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
			},
			{
				accessorKey: "description",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
			},
			{
				accessorKey: "createdAt",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
				cell: ({ cell }) => formatDate(cell.getValue() as Date),
				enableColumnFilter: false,
			},
			{
				id: "actions",
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								aria-label="Open menu"
								variant="ghost"
								className="data-[state=open]:bg-muted flex size-8 p-0"
							>
								<Icons.moreHorizontal className="size-4" aria-hidden="true" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[160px]">
							<DropdownMenuItem asChild className="cursor-pointer">
								<Link href={`/admin/products/${row.original.id}`} className="text-sm">
									Edit
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />

							<AlertDialog>
								<AlertDialogTrigger className="hover:bg-accent flex w-full cursor-pointer rounded-sm px-2 py-1.5 text-sm">
									Delete
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete your item from the database.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => {
												startTransition(async () => {
													try {
														const message = await deleteProduct({
															id: row.original.id,
														});

														switch (message) {
															case { success: true }:
																toast.success("Item deleted successfully");
																router.refresh();
																break;
															default:
																toast.error("Error deleting item");
														}
													} catch (error) {
														console.error(error);
														toast.error("Error deleting item", {
															description: "An error occurred while deleting the item.",
														});
													}
												});
											}}
											disabled={isPending}
										>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[data, isPending, toast, router],
	);

	async function deleteSelectedRows() {
		try {
			await Promise.all(
				selectedRowIds.map(async (id) => {
					await deleteProduct({
						id,
					});
				}),
			);

			toast.success("Selected rows deleted successfully");

			setSelectedRowIds([]);
			router.refresh();
		} catch (error) {
			toast.error("Error deleting rows", {
				description: "An error occurred while deleting the selected rows.",
			});

			console.error("Error deleting rows:", error);
		}
	}

	return (
		<DataTable
			columns={columns}
			data={data}
			pageCount={pageCount}
			searchableColumns={[
				{
					id: "name",
					title: "Search by slug",
				},
			]}
			deleteRowsAction={() => void deleteSelectedRows()}
		/>
	);
}
