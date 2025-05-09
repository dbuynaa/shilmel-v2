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

interface PricingSectionProps {
	open: boolean;
	onToggle: () => void;
	form: UseFormReturn<ProductFormValues>;
}

export function PricingSection({ open, onToggle, form }: PricingSectionProps) {
	return (
		<Collapsible open={open} onOpenChange={onToggle} className="border rounded-md shadow-sm">
			<CollapsibleTrigger asChild>
				<div className="flex items-center justify-between p-6 cursor-pointer bg-card">
					<h2 className="text-lg font-medium">Pricing</h2>
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
						name="price"
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
								<FormDescription>Price customers will see at checkout</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="compareAtPrice"
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
								<FormDescription>To show a reduced price, set this higher than the price</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="costPrice"
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
			</CollapsibleContent>
		</Collapsible>
	);
}
