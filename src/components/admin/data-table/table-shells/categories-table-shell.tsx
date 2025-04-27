"use client";

import { deleteCategory } from "@/actions/product/categories";
import type { Category } from "@/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { JSX } from "react";

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
import { useToast } from "@/lib/hooks/use-toast";
import { formatDate } from "@/lib/utils";

type AwaitedCategory = Pick<Category, "id" | "name" | "description" | "createdAt">;

interface CategoriesTableShellProps {
	data: AwaitedCategory[];
	pageCount: number;
}

export function CategoriesTableShell({ data, pageCount }: CategoriesTableShellProps): JSX.Element {
	const { toast } = useToast();
	const router = useRouter();
	const [isPending, startTransition] = React.useTransition();
	const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);

	const columns = React.useMemo<ColumnDef<AwaitedCategory, unknown>[]>(
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
								<Link href={`/admin/inventory/categories/${row.original.id}`} className="text-sm">
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
											This action cannot be undone. This will permanently delete your category from the
											database.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => {
												startTransition(async () => {
													try {
														const message = await deleteCategory({
															id: row.original.id,
														});

														switch (message) {
															case "success":
																toast({
																	title: "Success!",
																	description: "Category deleted",
																});
																router.refresh();
																break;
															default:
																toast({
																	title: "Error deleting category",
																	description: "Please try again",
																	variant: "destructive",
																});
														}
													} catch (error) {
														console.error(error);
														toast({
															title: "Something went wrong",
															description: "Please try again",
															variant: "destructive",
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
					await deleteCategory({
						id,
					});
				}),
			);

			toast({
				title: "Success!",
				description: "Selected rows deleted",
			});

			setSelectedRowIds([]);
			router.refresh();
		} catch (error) {
			toast({
				title: "Error deleting rows",
				description: "An error occurred while deleting rows.",
				variant: "destructive",
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
					title: "names",
				},
			]}
			deleteRowsAction={() => void deleteSelectedRows()}
		/>
	);
}
