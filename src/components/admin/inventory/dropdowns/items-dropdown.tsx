import { Icons } from "@/components/icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { JSX } from "react";

export function ItemsDropdown(): JSX.Element {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="flex size-9 items-center justify-center rounded-md border hover:bg-secondary/80"
				aria-label="More Options"
			>
				<Icons.moreHorizontal className="size-4" aria-hidden="true" />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-tertiary">
				<DropdownMenuItem className="flex items-center gap-2">
					<Icons.download className="size-4 text-muted-foreground" />
					Import Items
				</DropdownMenuItem>
				<DropdownMenuItem className="flex items-center gap-2">
					<Icons.upload className="size-4 text-muted-foreground" />
					Export Items
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="flex items-center gap-2">
					<Icons.upload className="size-4 text-muted-foreground" />
					Export Current View
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="flex items-center gap-2">
					<Icons.settings className="size-4 text-muted-foreground" />
					Preferences
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="flex items-center gap-2">
					<Icons.refresh className="size-4 text-muted-foreground" />
					Refresh List
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
