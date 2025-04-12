"use client";

import Link from "next/link";
import type { JSX } from "react";

import { ItemsDropdown } from "@/components/admin/inventory/dropdowns/items-dropdown";
import { ItemsSelect } from "@/components/admin/inventory/selects/items-select";
import { CustomTooltip } from "@/components/custom-tooltip";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ItemsSubheader(): JSX.Element {
	return (
		<div className="bg-tertiary flex h-20 w-full items-center justify-between border-b px-5">
			<ItemsSelect />

			<div className="flex items-center gap-2">
				<CustomTooltip text="Add New Item">
					<Link
						href="/admin/products/new"
						className={cn(buttonVariants(), "gap-1")}
						aria-label="Add new item"
					>
						<Icons.plus aria-hidden="true" className="size-4" />
						<span>New</span>
					</Link>
				</CustomTooltip>

				<ItemsDropdown />
			</div>
		</div>
	);
}
