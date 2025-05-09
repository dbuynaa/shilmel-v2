"use client";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductFormValues } from "@/lib/validations/product";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface ShippingSectionProps {
	open: boolean;
	onToggle: () => void;
	form: UseFormReturn<ProductFormValues>;
}

export function ShippingSection({ open, onToggle, form }: ShippingSectionProps) {
	return (
		<Collapsible open={open} onOpenChange={onToggle} className="border rounded-md shadow-sm">
			<CollapsibleTrigger asChild>
				<div className="flex items-center justify-between p-6 cursor-pointer bg-card">
					<h2 className="text-lg font-medium">Shipping</h2>
					{open ? (
						<ChevronUp className="h-5 w-5 text-muted-foreground" />
					) : (
						<ChevronDown className="h-5 w-5 text-muted-foreground" />
					)}
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="p-6 pt-0">
				<div className="grid gap-4 grid-cols-7">
					<FormField
						control={form.control}
						name="weight"
						render={({ field }) => (
							<FormItem className="col-span-5">
								<FormLabel>Weight</FormLabel>
								<FormControl>
									<Input type="number" step="0.01" min="0" {...field} value={field.value || ""} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="weightUnit"
						render={({ field }) => (
							<FormItem className="col-span-2 self-end mb-[2px]">
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Unit" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="KG">Kilograms (kg)</SelectItem>
										<SelectItem value="G">Grams (g)</SelectItem>
										<SelectItem value="LB">Pounds (lb)</SelectItem>
										<SelectItem value="OZ">Ounces (oz)</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormDescription className="mt-2">Used to calculate shipping rates accurately</FormDescription>
			</CollapsibleContent>
		</Collapsible>
	);
}
