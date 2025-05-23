import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";

import type { JSX } from "react";

export function Search(): JSX.Element {
	return (
		<form className="relative">
			<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
				<Icons.search className="mt-[2px] size-4 text-muted-foreground" />
			</div>
			<Input
				type="search"
				placeholder="Search..."
				className="w-fit ps-9 transition-all duration-300 ease-out lg:w-80 lg:hover:w-[400px]"
			/>
		</form>
	);
}
