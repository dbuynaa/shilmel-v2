import type { JSX } from "react";

import { SubheaderNav } from "@/components/admin/nav/admin/subheader-nav";
import { Icons } from "@/components/icons";

export function Subheader(): JSX.Element {
	return (
		<div className="bg-tertiary sticky top-0 z-48 flex flex-col justify-between gap-6 border-b px-5 pt-5 transition-all duration-300 ease-in-out">
			<div className="flex items-center gap-4">
				<div className="bg-secondary flex items-center justify-center rounded-md border p-3">
					<Icons.home className="size-5" aria-hidden="true" />
				</div>
				<div className="flex flex-col gap-1">
					<p className="text-sm font-semibold tracking-wide">Hello, piotr.borowiecki</p>
					<p className="text-muted-foreground text-xs tracking-wide">Piotr Borowiecki</p>
				</div>
			</div>

			<SubheaderNav />
		</div>
	);
}
