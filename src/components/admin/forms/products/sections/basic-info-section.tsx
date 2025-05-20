"use client";

import { Card, CardContent } from "@/components/ui/card";
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
import { generateSlug } from "@/hooks/use-product-variants";
import type { ProductFormValues } from "@/lib/validations/product";
import type { UseFormReturn } from "react-hook-form";

interface BasicInfoSectionProps {
	form: UseFormReturn<ProductFormValues>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder="Short sleeve t-shirt"
									className="text-lg"
									{...field}
									value={field.value || ""}
									onChange={(e) => {
										field.onChange(e);
										form.setValue("slug", generateSlug(e.target.value));
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem className="mt-4">
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Add a description to help customers understand your product..."
									className="min-h-32 resize-y"
									{...field}
									value={field.value || ""}
								/>
							</FormControl>
							<FormDescription>This description will be displayed on the product page</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem className="mt-4">
							<FormLabel>Slug</FormLabel>
							<FormControl>
								<Input
									placeholder="short-sleeve-t-shirt"
									className="text-sm"
									{...field}
									value={field.value || ""}
								/>
							</FormControl>
							<FormDescription>The URL-friendly version of the product name</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
}
