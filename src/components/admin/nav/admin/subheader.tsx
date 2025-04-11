import type { JSX } from "react";

import { SubheaderNav } from "@/components/admin/nav/admin/subheader-nav";

export function Subheader(): JSX.Element {
	return (
		<div className="bg-tertiary sticky top-0 z-48 flex flex-col justify-between gap-6 border-b px-5 pt-5 transition-all duration-300 ease-in-out">
			<SubheaderNav />
		</div>
	);
}
