import Link from "next/link";
import type { JSX } from "react";

import { ItemsDropdown } from "@/components/admin/inventory/dropdowns/items-dropdown";
import { CompositeItemsSelect } from "@/components/admin/inventory/selects/composite-items-select";
import { ViewToggle } from "@/components/admin/inventory/view-toggle";
import { InstantHelperMenu } from "@/components/admin/nav/admin/menus/instant-helper-menu";
import { CustomTooltip } from "@/components/custom-tooltip";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CompositeItemsSubheader(): JSX.Element {
	return (
		<div className="bg-tertiary flex h-20 w-full items-center justify-between border-b px-5">
			<CompositeItemsSelect />

			<div className="flex items-center gap-2">
				<CustomTooltip text="Add New Item">
					<Link
						href="/admin/inventory/items/new-item"
						className={cn(buttonVariants(), "gap-1")}
						aria-label="Add new item"
					>
						<Icons.plus aria-hidden="true" className="size-4" />
						<span>New</span>
					</Link>
				</CustomTooltip>

				<ViewToggle />
				<ItemsDropdown />
				<InstantHelperMenu />
			</div>
		</div>
	);
}
