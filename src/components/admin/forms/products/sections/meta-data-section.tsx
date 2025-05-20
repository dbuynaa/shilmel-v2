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
import { Textarea } from "@/components/ui/textarea";
import config from "@/config/store.config";
import { generateSlug } from "@/hooks/use-product-variants";
import type { ProductFormValues } from "@/lib/validations/product";
import { ChevronDown, ChevronUp, Globe } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface MetaDataSectionProps {
	open: boolean;
	onToggle: () => void;
	form: UseFormReturn<ProductFormValues>;
}

export function MetaDataSection({ open, onToggle, form }: MetaDataSectionProps) {
	return (
		<Collapsible open={open} onOpenChange={onToggle} className="border rounded-md shadow-sm">
			<CollapsibleTrigger asChild>
				<div className="flex items-center justify-between p-6 cursor-pointer bg-card">
					<h2 className="text-lg font-medium">SEO & Meta</h2>
					{open ? (
						<ChevronUp className="h-5 w-5 text-muted-foreground" />
					) : (
						<ChevronDown className="h-5 w-5 text-muted-foreground" />
					)}
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="p-6 pt-0">
				<div className="grid gap-4">
					<FormField
						control={form.control}
						name="metaData.title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Page title</FormLabel>
								<FormControl>
									<Input placeholder="Page title" {...field} value={field.value || ""} />
								</FormControl>
								<FormDescription>Defaults to product title. 70 characters maximum.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="metaData.description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Description for search engines"
										className="resize-y"
										{...field}
										value={field.value || ""}
									/>
								</FormControl>
								<FormDescription>Defaults to product description. 320 characters maximum.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="p-4 mt-2 border rounded-md bg-muted/50">
						<h4 className="text-sm font-medium text-blue-600 truncate">
							{form.watch("metaData.title") || form.watch("name") || "Product Title"}
						</h4>
						<p className="text-sm text-green-700 truncate">
							<Globe className="inline w-3 h-3 mr-1" />
							{config.storeName.toLowerCase()}/products/
							{form.watch("slug") || generateSlug(form.watch("name")) || "product-slug"}
						</p>
						<p className="text-sm text-muted-foreground line-clamp-2">
							{form.watch("metaData.description") ||
								form.watch("description") ||
								"Product description will appear here."}
						</p>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
