import { ProductCategories } from "@/components/admin/products/product-categories";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { ProductFormValues } from "@/lib/validations/product";
import { ChevronDown, ChevronUp } from "lucide-react";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";

interface OrganizationSectionProps {
	open: boolean;
	onToggle: () => void;
	form: UseFormReturn<ProductFormValues>;
	categories: string[];
	setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export function OrganizationSection({
	open,
	onToggle,
	form,
	categories,
	setCategories,
}: OrganizationSectionProps) {
	return (
		<Collapsible open={open} onOpenChange={onToggle} className="border rounded-md shadow-sm">
			<CollapsibleTrigger asChild>
				<div className="flex items-center justify-between p-6 cursor-pointer bg-card">
					<h2 className="text-lg font-medium">Organization</h2>
					{open ? (
						<ChevronUp className="h-5 w-5 text-muted-foreground" />
					) : (
						<ChevronDown className="h-5 w-5 text-muted-foreground" />
					)}
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="p-6 pt-0">
				<div className="grid gap-6">
					<div className="mt-4">
						<h3 className="mb-4 font-medium">Categories</h3>
						<ProductCategories selectedCategories={categories} setSelectedCategories={setCategories} />
						<FormDescription className="mt-2">
							Categories help organize your products and improve searchability
						</FormDescription>
					</div>

					<FormField
						control={form.control}
						name="featured"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Featured product</FormLabel>
									<FormDescription>Feature this product on your homepage and collections</FormDescription>
								</div>
								<FormControl>
									<Switch checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
