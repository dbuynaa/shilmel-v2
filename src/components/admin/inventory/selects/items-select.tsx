import type { JSX } from "react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { inventoryItemsSelectOptions } from "@/data/constants/inventory";

export function ItemsSelect(): JSX.Element {
	return (
		<Select>
			<SelectTrigger className="w-40">
				<SelectValue placeholder="All Items"></SelectValue>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{inventoryItemsSelectOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.title}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
