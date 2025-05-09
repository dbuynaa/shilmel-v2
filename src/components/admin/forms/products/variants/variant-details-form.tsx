"use client";

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
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import type { ProductFormValues } from "@/lib/validations/product";
import type { UseFormReturn } from "react-hook-form";

interface VariantDetailsFormProps {
	selectedVariantIndex: number;
	form: UseFormReturn<ProductFormValues>;
	variantImages: Record<number, Array<{ id?: string; url: string; alt?: string; position: number }>>;
	handleVariantImageUpdate: (
		variantIndex: number,
		newImages: Array<{ id?: string; url: string; alt?: string; position: number }>,
	) => void;
}

export function VariantDetailsForm({
	selectedVariantIndex,
	form,
	variantImages,
	handleVariantImageUpdate,
}: VariantDetailsFormProps) {
	return (
		<Tabs defaultValue="details" className="w-full">
			<TabsList>
				{/* You can add TabsList items here if needed, e.g.,
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            ...
        */}
			</TabsList>
			<TabsContent value="details">
				<div className="space-y-4">
					<FormField
						control={form.control}
						name={`variants.${selectedVariantIndex}.sku`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>SKU (Stock Keeping Unit)</FormLabel>
								<FormControl>
									<Input placeholder="SKU-123" {...field} value={field.value || ""} />
								</FormControl>
								<FormDescription>Unique identifier for this variant</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</TabsContent>

			<TabsContent value="pricing">
				<div className="grid gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name={`variants.${selectedVariantIndex}.price`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Price</FormLabel>
								<FormControl>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
										<Input
											type="number"
											step="0.01"
											min="0"
											className="pl-7"
											{...field}
											value={field.value || ""}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name={`variants.${selectedVariantIndex}.compareAtPrice`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Compare-at price</FormLabel>
								<FormControl>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
										<Input
											type="number"
											step="0.01"
											min="0"
											className="pl-7"
											{...field}
											value={field.value || ""}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name={`variants.${selectedVariantIndex}.costPrice`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cost per item</FormLabel>
								<FormControl>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
										<Input
											type="number"
											step="0.01"
											min="0"
											className="pl-7"
											{...field}
											value={field.value || ""}
										/>
									</div>
								</FormControl>
								<FormDescription>Customers won't see this</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</TabsContent>

			<TabsContent value="inventory">
				<div className="space-y-4">
					<FormField
						control={form.control}
						name={`variants.${selectedVariantIndex}.stock`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Quantity</FormLabel>
								<FormControl>
									<Input type="number" min="0" {...field} />
								</FormControl>
								<FormDescription>Number of items in stock</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</TabsContent>

			<TabsContent value="shipping">
				<div className="grid gap-4 grid-cols-7">
					<FormField
						control={form.control}
						name={`variants.${selectedVariantIndex}.weight`}
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
						name={`variants.${selectedVariantIndex}.weightUnit`}
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
			</TabsContent>

			<TabsContent value="images">
				<div className="space-y-4">
					{/* Image upload component would go here */}
					<p className="text-sm text-muted-foreground">Upload images specific to this variant.</p>
				</div>
			</TabsContent>
		</Tabs>
	);
}
