import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import type { JSX } from "react";

export function OrganizationMenu(): JSX.Element {
	return (
		<Sheet>
			<SheetTrigger
				className={cn(
					buttonVariants({ variant: "outline" }),
					"flex max-w-[160px] items-center justify-center gap-2 px-3 transition-all duration-300 ease-in-out",
				)}
			>
				<span className="truncate">Piotr Borowiecki</span>
				<Icons.chevronDown aria-hidden="true" className="size-4" />
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>TODO: Organization Menu</SheetTitle>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
