import { CustomTooltip } from "@/components/custom-tooltip";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import type { JSX } from "react";

export function NotificationsMenu(): JSX.Element {
	return (
		<Sheet>
			<SheetTrigger className={cn(buttonVariants({ variant: "ghost" }), "p-3")}>
				<CustomTooltip text="Notifications">
					<Icons.notifications aria-hidden="true" className="size-4" />
				</CustomTooltip>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>TODO: Notifications Menu</SheetTitle>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
