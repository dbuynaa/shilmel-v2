import { CustomTooltip } from "@/components/custom-tooltip";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import type { JSX } from "react";

export function AppsMenu(): JSX.Element {
	return (
		<Sheet>
			<SheetTrigger className={cn(buttonVariants({ variant: "outline" }), "p-2")}>
				<CustomTooltip text="Other Apps">
					<Icons.layoutGrid className="size-5" aria-hidden="true" />
				</CustomTooltip>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>TODO: Apps Menu</SheetTitle>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
