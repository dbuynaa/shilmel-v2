import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ProductFormValues } from "@/lib/validations/product";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface InventorySectionProps {
	open: boolean;
	onToggle: () => void;
	form: UseFormReturn<ProductFormValues>;
}

export function InventorySection({ open, onToggle, form }: InventorySectionProps) {
	return (
		<Collapsible open={open} onOpenChange={onToggle} className="border rounded-md shadow-sm">
			<CollapsibleTrigger asChild>
				<div className="flex items-center justify-between p-6 cursor-pointer bg-card">
					<h2 className="text-lg font-medium">Inventory</h2>
					{open ? (
						<ChevronUp className="h-5 w-5 text-muted-foreground" />
					) : (
						<ChevronDown className="h-5 w-5 text-muted-foreground" />
					)}
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="p-6 pt-0">
				<div className="grid gap-6 md:grid-cols-2">
					<FormField
						control={form.control}
						name="sku"
						render={({ field }) => (
							<FormItem>
								<FormLabel>SKU (Stock Keeping Unit)</FormLabel>
								<FormControl>
									<Input placeholder="SKU-123" {...field} value={field.value || ""} />
								</FormControl>
								<FormDescription>Unique identifier for your product</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="stock"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Quantity</FormLabel>
								<FormControl>
									<Input
										type="number"
										min="0"
										{...field}
										value={field.value === undefined ? "0" : field.value.toString()}
									/>
								</FormControl>
								<FormDescription>Number of items in stock</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
