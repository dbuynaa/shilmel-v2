// components/products/categories-combobox.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

// This would typically come from your API
const mockCategories = [
	{ id: 1, name: "Electronics" },
	{ id: 2, name: "Clothing" },
	{ id: 3, name: "Books" },
	{ id: 4, name: "Home & Kitchen" },
	{ id: 5, name: "Sports & Outdoors" },
	{ id: 6, name: "Beauty & Personal Care" },
	{ id: 7, name: "Toys & Games" },
	{ id: 8, name: "Health & Household" },
	{ id: 9, name: "Automotive" },
	{ id: 10, name: "Pet Supplies" },
];

interface CategoriesComboboxProps {
	value: number[];
	onChange: (value: number[]) => void;
}

export function CategoriesCombobox({ value, onChange }: CategoriesComboboxProps) {
	const [open, setOpen] = useState(false);
	const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<{ id: number; name: string }[]>([]);

	// Load categories
	useEffect(() => {
		// In a real app, fetch from API
		setCategories(mockCategories);
	}, []);

	// Update selected categories when value changes
	useEffect(() => {
		const selected = categories.filter((category) => value.includes(category.id));
		setSelectedCategories(selected);
	}, [value, categories]);

	function handleSelect(id: number) {
		if (value.includes(id)) {
			onChange(value.filter((v) => v !== id));
		} else {
			onChange([...value, id]);
		}
	}

	function handleRemove(id: number) {
		onChange(value.filter((v) => v !== id));
	}

	return (
		<div className="space-y-2">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between text-left font-normal"
					>
						{value.length > 0
							? `${value.length} ${value.length === 1 ? "category" : "categories"} selected`
							: "Select categories..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-0 w-[300px]">
					<Command>
						<CommandInput placeholder="Search categories..." />
						<CommandList>
							<CommandEmpty>No categories found.</CommandEmpty>
							<CommandGroup>
								{categories.map((category) => (
									<CommandItem
										key={category.id}
										value={category.name}
										onSelect={() => handleSelect(category.id)}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value.includes(category.id) ? "opacity-100" : "opacity-0",
											)}
										/>
										{category.name}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			<div className="flex flex-wrap gap-2">
				{selectedCategories.map((category) => (
					<Badge key={category.id} variant="secondary">
						{category.name}
						<button
							className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
							onClick={() => handleRemove(category.id)}
						>
							<span className="sr-only">Remove</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-3 w-3"
							>
								<path d="M18 6L6 18M6 6l12 12" />
							</svg>
						</button>
					</Badge>
				))}
			</div>
		</div>
	);
}
