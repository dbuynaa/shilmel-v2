import type { JSX } from "react";

import { OptionCard } from "@/components/admin/inventory/option-card";
import { inventoryOptions } from "@/data/constants/inventory";

export function OptionCards(): JSX.Element {
	return (
		<div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
			{inventoryOptions.map((option) => (
				<OptionCard key={option.title} option={option} />
			))}
		</div>
	);
}
