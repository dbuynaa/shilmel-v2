"use client";

import type React from "react";

import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useState } from "react";

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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Mock categories - in a real app, these would come from your API
const mockCategories = [
	{ id: "1", name: "Electronics", slug: "electronics" },
	{ id: "2", name: "Clothing", slug: "clothing" },
	{ id: "3", name: "Home & Kitchen", slug: "home-kitchen" },
	{ id: "4", name: "Books", slug: "books" },
	{ id: "5", name: "Toys", slug: "toys" },
];

interface ProductCategoriesProps {
	selectedCategories: string[];
	setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ProductCategories({ selectedCategories, setSelectedCategories }: ProductCategoriesProps) {
	const [open, setOpen] = useState(false);
	const [categories, setCategories] = useState(mockCategories);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newCategory, setNewCategory] = useState({
		name: "",
		slug: "",
		description: "",
	});

	const handleSelectCategory = (categoryId: string) => {
		setSelectedCategories((current) =>
			current.includes(categoryId) ? current.filter((id) => id !== categoryId) : [...current, categoryId],
		);
	};

	const handleRemoveCategory = (categoryId: string) => {
		setSelectedCategories((current) => current.filter((id) => id !== categoryId));
	};

	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	};

	const handleAddCategory = () => {
		if (!newCategory.name) return;

		const slug = newCategory.slug || generateSlug(newCategory.name);
		const newCategoryItem = {
			id: crypto.randomUUID(),
			name: newCategory.name,
			slug,
		};

		setCategories([...categories, newCategoryItem]);
		setSelectedCategories([...selectedCategories, newCategoryItem.id]);
		setNewCategory({ name: "", slug: "", description: "" });
		setIsDialogOpen(false);
	};

	return (
		<div className="space-y-4">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
						{selectedCategories.length > 0
							? `${selectedCategories.length} ${selectedCategories.length === 1 ? "category" : "categories"} selected`
							: "Select categories..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command>
						<CommandInput placeholder="Search categories..." />
						<CommandList>
							<CommandEmpty>
								No categories found.
								<Button
									variant="ghost"
									size="sm"
									className="mt-2 w-full justify-start"
									onClick={() => {
										setOpen(false);
										setIsDialogOpen(true);
									}}
								>
									<PlusCircle className="mr-2 h-4 w-4" />
									Create new category
								</Button>
							</CommandEmpty>
							<CommandGroup>
								{categories.map((category) => (
									<CommandItem
										key={category.id}
										value={category.name}
										onSelect={() => handleSelectCategory(category.id)}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedCategories.includes(category.id) ? "opacity-100" : "opacity-0",
											)}
										/>
										{category.name}
									</CommandItem>
								))}
								<CommandItem
									onSelect={() => {
										setOpen(false);
										setIsDialogOpen(true);
									}}
								>
									<PlusCircle className="mr-2 h-4 w-4" />
									Create new category
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Category</DialogTitle>
						<DialogDescription>Add a new category to organize your products</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Category Name</Label>
							<Input
								id="name"
								placeholder="e.g., Electronics, Clothing, etc."
								value={newCategory.name}
								onChange={(e) => {
									setNewCategory({
										...newCategory,
										name: e.target.value,
										slug: newCategory.slug || generateSlug(e.target.value),
									});
								}}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="slug">Slug</Label>
							<Input
								id="slug"
								placeholder="category-slug"
								value={newCategory.slug}
								onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="description">Description (Optional)</Label>
							<Textarea
								id="description"
								placeholder="Describe this category..."
								value={newCategory.description}
								onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleAddCategory}>Create Category</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{selectedCategories.length > 0 && (
				<div className="flex flex-wrap gap-2 mt-2">
					{selectedCategories.map((categoryId) => {
						const category = categories.find((c) => c.id === categoryId);
						if (!category) return null;

						return (
							<Badge key={categoryId} variant="secondary" className="px-3 py-1">
								{category.name}
								<button
									className="ml-2 text-muted-foreground hover:text-foreground"
									onClick={() => handleRemoveCategory(categoryId)}
								>
									×
								</button>
							</Badge>
						);
					})}
				</div>
			)}
		</div>
	);
}
