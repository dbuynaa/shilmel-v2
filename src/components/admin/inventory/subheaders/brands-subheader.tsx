import Link from "next/link";
import type { JSX } from "react";

import { InstantHelperMenu } from "@/components/admin/nav/admin/menus/instant-helper-menu";
import { CustomTooltip } from "@/components/custom-tooltip";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BrandsSubheader(): JSX.Element {
	return (
		<div className="bg-tertiary flex h-20 w-full items-center justify-end border-b px-5">
			<div className="flex items-center gap-2">
				<CustomTooltip text="Add New Brand">
					<Link
						href="/admin/inventory/brands/new-brand"
						className={cn(buttonVariants(), "gap-1")}
						aria-label="Add new brand"
					>
						<Icons.plus aria-hidden="true" className="size-4" />
						<span>New Brand</span>
					</Link>
				</CustomTooltip>
				<InstantHelperMenu />
			</div>
		</div>
	);
}
