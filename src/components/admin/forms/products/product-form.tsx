"use client";

import { addProduct } from "@/actions/product/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, ExternalLink, Globe, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ProductCategories } from "@/components/admin/products/product-categories";
import { ProductImageUpload } from "@/components/admin/products/product-image";
import { ProductPreview } from "@/components/admin/products/product-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import config from "@/config/store.config";
import type { Product } from "@/db/schema";
import { ProductStatusEnum } from "@/types/types";
import { type ProductFormValues, productSchema } from "@/validations/product";
import { toast } from "sonner";

interface OptionValueType {
	option: string;
	value: string;
}

interface ProductOption {
	name: string;
	values: { value: string }[];
}

type WeightUnitType = "KG" | "G" | "LB" | "OZ";

export function ProductForm({ product }: { product?: Product }) {
	const router = useRouter();
	const [categories, setCategories] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [images, setImages] = useState<Array<{ id?: string; url: string; alt?: string }>>([]);

	// Collapsible sections state
	const [openSections, setOpenSections] = useState({
		media: true,
		pricing: true,
		inventory: true,
		organization: true,
		variants: true,
		metaData: true,
		options: false,
	});

	// TODO: change the inventory thing

	const toggleSection = (section: keyof typeof openSections) => {
		setOpenSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			title: "",
			status: ProductStatusEnum.DRAFT,
			slug: "",
			sku: "",
			price: 0,
			compareAtPrice: 0,
			costPrice: 0,
			inventoryQuantity: 0,
			description: "",
			categories: [],
			images: [],
			isPublished: false,
			options: [{ name: "Size", values: [{ value: "Small" }, { value: "Medium" }, { value: "Large" }] }],
			variants: [
				{
					title: "",
					sku: "",
					price: 0,
					compareAtPrice: 0,
					inventoryQuantity: 0,
					requiresShipping: true,
					isTaxable: true,
					weight: 0,
					weightUnit: "KG",
				},
			],
			metaData: {
				title: "",
				description: "",
			},
		},
	});

	async function onSubmit(data: ProductFormValues) {
		console.log("Form submitted:", data);
		try {
			setIsSubmitting(true);
			toast("Creating product...", {
				description: "Your product is being created.",
				duration: 3000,
			});

			// Update with product categories and images from state
			const productData = {
				...data,
				categories,
				// images,
			};

			const result = await addProduct(productData);

			if (result?.success) {
				toast.success("Product created successfully", {
					description: "Your product has been created successfully.",
					duration: 3000,
				});
				router.push("/admin/products");
				router.refresh();
			} else {
				throw new Error(result?.error || "Failed to create product");
			}
		} catch (error: unknown) {
			console.error("Failed to create product:", error);
			toast.error("Error creating product", {
				description: error instanceof Error ? error.message : "Unknown error occurred",
			});
		} finally {
			setIsSubmitting(false);
			form.reset();
			setCategories([]);
			setImages([]);
			setOpenSections({
				media: true,
				pricing: true,
				inventory: true,
				organization: true,
				variants: true,
				metaData: true,
				options: false,
			});
		}
	}

	const watchedValues = {
		title: form.watch("title"),
		price: form.watch("price"),
		compareAtPrice: form.watch("compareAtPrice"),
		status: form.watch("status"),
	};

	// Options and variants management
	const addOption = () => {
		const currentOptions = form.getValues("options") || [];
		form.setValue("options", [...currentOptions, { name: "", values: [{ value: "" }] }]);
	};

	const removeOption = (index: number) => {
		const currentOptions = form.getValues("options") || [];
		form.setValue(
			"options",
			currentOptions.filter((_: ProductOption, i: number) => i !== index),
		);
	};

	const addOptionValue = (optionIndex: number) => {
		const currentOptions = form.getValues("options") || [];
		const currentOption = currentOptions[optionIndex];

		if (currentOption) {
			const updatedOptions = [...currentOptions];
			updatedOptions[optionIndex] = {
				...currentOption,
				values: [...currentOption.values, { value: "" }],
			};
			form.setValue("options", updatedOptions);
		}
	};

	const removeOptionValue = (optionIndex: number, valueIndex: number) => {
		const currentOptions = form.getValues("options") || [];
		const currentOption = currentOptions[optionIndex];

		if (currentOption) {
			const updatedOptions = [...currentOptions];
			updatedOptions[optionIndex] = {
				...currentOption,
				values: currentOption.values.filter((_: { value: string }, i: number) => i !== valueIndex),
			};
			form.setValue("options", updatedOptions);
		}
	};

	// Dynamically generate variants based on options
	const generateCombinations = (
		arrays: OptionValueType[][],
		current: OptionValueType[] = [],
		index = 0,
	): OptionValueType[][] => {
		if (index === arrays.length) {
			return [current];
		}

		return (
			arrays[index]?.flatMap((item) => generateCombinations(arrays, [...current, item], index + 1)) || []
		);
	};

	const emptyVariant = {
		title: "",
		sku: "",
		price: 0,
		compareAtPrice: 0,
		inventoryQuantity: 0,
		requiresShipping: true,
		isTaxable: true,
		weight: 0,
		weightUnit: "KG" as WeightUnitType,
	};

	const generateVariants = () => {
		const options = form.getValues("options");

		// Check if we have valid options
		if (!options?.every((option: ProductOption) => option.name && option.values.length > 0)) {
			return;
		}

		// Extract all option values
		const optionValues = options.map((option: ProductOption) =>
			option.values.map((v: { value: string }) => ({ option: option.name, value: v.value })),
		);

		const combinations = generateCombinations(optionValues);

		// Create variants from combinations
		const newVariants = combinations.map((combo) => ({
			...emptyVariant,
			title: combo.map((c) => c.value).join(" / "),
		}));

		form.setValue("variants", newVariants);
	};

	function generateSlug(title: string | number): string {
		return String(title)
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	}

	const ChevroButton = ({
		openSection,
		isOpen,
		title,
	}: { openSection: () => void; isOpen: boolean; title: string }) => (
		<div className="flex items-center justify-between p-6">
			<CardTitle className="text-lg font-medium">{title}</CardTitle>
			{/* <Button variant="ghost" type="button" size="icon">
				{isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
			</Button> */}
		</div>
	);
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				{/* Header with status bar */}
				<div className="sticky top-0 z-10 bg-background border-b shadow-sm">
					<div className="container flex items-center justify-between h-16 px-4 mx-auto">
						<div className="flex items-center gap-4">
							<Button type="button" variant="outline" onClick={() => router.back()}>
								Back
							</Button>
							<h1 className="text-xl font-semibold">Add product</h1>
						</div>
						<div className="flex items-center gap-2">
							<Select
								defaultValue={form.getValues("status") || ProductStatusEnum.DRAFT}
								onValueChange={(value: ProductStatusEnum) => form.setValue("status", value)}
							>
								<SelectTrigger className="w-[140px]">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={ProductStatusEnum.DRAFT}>Draft</SelectItem>
									<SelectItem value={ProductStatusEnum.ACTIVE}>Active</SelectItem>
									<SelectItem value={ProductStatusEnum.ARCHIVED}>Archived</SelectItem>
									<SelectItem value={ProductStatusEnum.PUBLISHED}>PUBLISHED</SelectItem>
								</SelectContent>
							</Select>
							<Button type="submit" disabled={isSubmitting}>
								<Save className="w-4 h-4 mr-2" />
								{isSubmitting ? "Saving..." : "Save"}
							</Button>
						</div>
					</div>
				</div>

				{/* Main content */}
				<div className="container px-4 py-6 mx-auto">
					<div className="grid gap-6 md:grid-cols-3">
						{/* Left column - Main form */}
						<div className="space-y-6 md:col-span-2">
							{/* Title and description */}
							<Card>
								<CardContent className="pt-6">
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Short sleeve t-shirt"
														className="text-lg"
														{...field}
														onChange={(e) => {
															field.onChange(e);
															form.setValue("slug", generateSlug(e.target.value));
															// Auto-generate metaData title from product title
															form.setValue("metaData.title", e.target.value);
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
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Media section */}
							<Card>
								<div
									className="flex items-center justify-between p-6 cursor-pointer"
									onClick={() => toggleSection("media")}
								>
									<h2 className="text-lg font-medium">Media</h2>
									<Button variant="ghost" size="icon">
										{openSections.media ? (
											<ChevronUp className="w-4 h-4" />
										) : (
											<ChevronDown className="w-4 h-4" />
										)}
									</Button>
								</div>
								{openSections.media && (
									<CardContent className="pt-0">
										<ProductImageUpload
											images={images}
											setImagesAction={(newImages) => {
												setImages(newImages);
												form.setValue(
													"images",
													newImages.map((image) => ({
														...image,
														position: newImages.indexOf(image),
													})),
												);
											}}
										/>
									</CardContent>
								)}
							</Card>

							{/* Pricing section */}
							<Card>
								<ChevroButton
									title="Pricing"
									openSection={() => toggleSection("pricing")}
									isOpen={openSections.pricing}
								/>

								{openSections.pricing && (
									<CardContent className="pt-0">
										<div className="grid gap-6 md:grid-cols-2">
											<FormField
												control={form.control}
												name="price"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Price</FormLabel>
														<FormControl>
															<div className="relative">
																<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
																	$
																</span>
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
														<FormDescription>Price customers will see when they check outs</FormDescription>
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
																<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
																	$
																</span>
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
														<FormDescription>
															To show a reduced price, set this higher than the price
														</FormDescription>
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
																<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
																	$
																</span>
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
									</CardContent>
								)}
							</Card>

							{/* Inventory section */}
							<Card>
								<ChevroButton
									title="Inventory"
									openSection={() => toggleSection("inventory")}
									isOpen={openSections.inventory}
								/>

								{openSections.inventory && (
									<CardContent className="pt-0">
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
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="inventoryQuantity"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Quantity</FormLabel>
														<FormControl>
															<Input type="number" min="0" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="grid gap-6 mt-6 md:grid-cols-2">
											<FormField
												control={form.control}
												name="weight"
												render={({ field }) => (
													<FormItem>
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
													<FormItem>
														<FormLabel>Weight unit</FormLabel>
														<Select onValueChange={field.onChange} defaultValue={field.value}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select weight unit" />
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
									</CardContent>
								)}
							</Card>
							{/* { Shipping secion } */}
							<Card>
								<CardTitle className="text-lg font-medium p-6">Shipping</CardTitle>
								<CardDescription className="px-6">
									Manage how this product is shipped to customers
								</CardDescription>

								<CardContent className="pt-0">
									<div className="flex flex-col">
										<FormField
											control={form.control}
											name="requiresShipping"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">Requires shipping</FormLabel>
														<FormDescription>Check if this product requires shipping</FormDescription>
													</div>
													<FormControl>
														<Switch checked={field.value} onCheckedChange={field.onChange} />
													</FormControl>
												</FormItem>
											)}
										/>
										<div className="flex mt-6 gap-2 ">
											<FormField
												control={form.control}
												name="weight"
												render={({ field }) => (
													<FormItem className="flex-1/2">
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
													<FormItem className="mt-5">
														<Select onValueChange={field.onChange} defaultValue={field.value}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select weight unit" />
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
									</div>
								</CardContent>
							</Card>

							{/* Variants section */}
							<Card className="shadow-sm border-gray-200">
								<ChevroButton
									title="Variants"
									openSection={() => toggleSection("variants")}
									isOpen={openSections.variants}
								/>

								{openSections.variants && (
									<CardContent className="p-6 pt-0">
										<div className="space-y-6">
											<p className="text-sm text-gray-500">
												Add options like size or color to create variants of this product
											</p>

											{form.watch("options").map((_option: ProductOption, optionIndex: number) => (
												<div key={optionIndex} className="bg-muted rounded-lg p-4">
													<div className="flex justify-between items-center mb-4">
														<FormField
															control={form.control}
															name={`options.${optionIndex}.name`}
															render={({ field }) => (
																<FormItem className="flex-1">
																	<FormLabel className="text-sm font-medium">Option name</FormLabel>
																	<FormControl>
																		<Input placeholder="Size, Color, Material, Style..." {...field} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => removeOption(optionIndex)}
															className="ml-2 mt-6"
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>

													<div className="space-y-2">
														<h2 className="text-sm font-medium">Option values</h2>

														<div className="space-y-2">
															{form
																.watch(`options.${optionIndex}.values`)
																.map((_value: { value: string }, valueIndex: number) => (
																	<div key={valueIndex} className="flex items-center space-x-2">
																		<FormField
																			control={form.control}
																			name={`options.${optionIndex}.values.${valueIndex}.value`}
																			render={({ field }) => (
																				<FormItem className="flex-1">
																					<FormControl>
																						<Input placeholder="Enter option value" {...field} />
																					</FormControl>
																					<FormMessage />
																				</FormItem>
																			)}
																		/>

																		<Button
																			type="button"
																			variant="ghost"
																			size="sm"
																			onClick={() => removeOptionValue(optionIndex, valueIndex)}
																		>
																			<Trash2 className="w-4 h-4" />
																		</Button>
																	</div>
																))}

															<Button
																type="button"
																variant="outline"
																size="sm"
																onClick={() => addOptionValue(optionIndex)}
																className="mt-2"
															>
																<Plus className="w-4 h-4 mr-2" /> Add value
															</Button>
														</div>
													</div>
												</div>
											))}

											<div className="flex flex-col gap-3">
												<Button type="button" variant="outline" className="w-full" onClick={addOption}>
													<Plus className="w-4 h-4 mr-2" /> Add another option
												</Button>

												<Button type="button" onClick={generateVariants} className="w-full">
													Generate variants
												</Button>
											</div>

											{form.watch("variants").length > 0 && (
												<div className="space-y-4 mt-8">
													<h3 className="text-base font-medium">Variants</h3>

													<div className="border rounded-lg overflow-hidden">
														<div className="grid grid-cols-3 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500">
															<div>Variant</div>
															<div>Price</div>
															<div>Quantity</div>
														</div>
														<div className="divide-y">
															{form.watch("variants").map((_variant, index: number) => (
																<div key={index} className="grid grid-cols-3 px-4 py-3 items-center">
																	<div className="text-sm font-medium">
																		{_variant.title}
																		{/* {form.watch(`variants.${index}.title`)} */}
																	</div>

																	<FormField
																		control={form.control}
																		name={`variants.${index}.price`}
																		render={({ field }) => (
																			<FormItem>
																				<FormControl>
																					<Input
																						type="number"
																						step="0.01"
																						placeholder="0.00"
																						value={field.value || ""}
																						onChange={field.onChange}
																					/>
																				</FormControl>
																			</FormItem>
																		)}
																	/>

																	<FormField
																		control={form.control}
																		name={`variants.${index}.inventoryQuantity`}
																		render={({ field }) => (
																			<FormItem>
																				<FormControl>
																					<Input
																						type="number"
																						placeholder="0"
																						value={field.value || ""}
																						onChange={field.onChange}
																					/>
																				</FormControl>
																			</FormItem>
																		)}
																	/>
																</div>
															))}
														</div>
													</div>
												</div>
											)}
										</div>
									</CardContent>
								)}
							</Card>

							{/* Organization section */}
							<Card>
								<ChevroButton
									title="Organization"
									openSection={() => toggleSection("organization")}
									isOpen={openSections.organization}
								/>
								{openSections.organization && (
									<CardContent className="pt-0">
										<div className="grid gap-6">
											<div className="mt-4">
												<h3 className="mb-4 font-medium">Categories</h3>
												<ProductCategories
													selectedCategories={categories}
													setSelectedCategories={setCategories}
												/>
											</div>

											<FormField
												control={form.control}
												name="featured"
												render={({ field }) => (
													<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
														<div className="space-y-0.5">
															<FormLabel className="text-base">Featured product</FormLabel>
															<FormDescription>
																Feature this product on your homepage and collections
															</FormDescription>
														</div>
														<FormControl>
															<Switch checked={field.value} onCheckedChange={field.onChange} />
														</FormControl>
													</FormItem>
												)}
											/>
										</div>
									</CardContent>
								)}
							</Card>

							{/* metaData section */}
							<Card>
								<ChevroButton
									title="Meta"
									openSection={() => toggleSection("metaData")}
									isOpen={openSections.metaData}
								/>
								{openSections.metaData && (
									<CardContent className="pt-0">
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
														<FormDescription>
															Defaults to product title. 70 characters maximum.
														</FormDescription>
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
														<FormDescription>
															Defaults to product description. 320 characters maximum.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<div className="p-4 mt-2 border rounded-md bg-muted/50">
												<h4 className="text-sm font-medium text-blue-600 truncate">
													{form.watch("metaData.title") ||
														form.watch("slug") ||
														form.watch("title") ||
														"Product Title"}
												</h4>
												<p className="text-sm text-green-700 truncate">
													<Globe className="inline w-3 h-3 mr-1" />
													{config.storeName.toLowerCase()}/products/
													{form.watch("metaData.title") ||
														form.watch("slug") ||
														form.watch("title") ||
														"product-slug"}
												</p>
												<p className="text-sm text-muted-foreground line-clamp-2">
													{form.watch("metaData.description") ||
														form.watch("description") ||
														"Product description will appear here."}
												</p>
											</div>
										</div>
									</CardContent>
								)}
							</Card>
						</div>

						{/* Right column - Preview and status */}
						<div className="space-y-6">
							<Card className="sticky top-24">
								<CardContent className="p-6">
									<h2 className="mb-4 text-lg font-medium">Product preview</h2>
									<ProductPreview
										title={watchedValues.title || "Product title"}
										price={watchedValues.price || 0}
										compareAtPrice={watchedValues.compareAtPrice}
										status={watchedValues.status}
										image={form.getValues("images")?.[0]?.url || ""}
									/>
									<div className="mt-6">
										<Button variant="outline" className="w-full" disabled={!form.getValues("slug")}>
											<ExternalLink className="w-4 h-4 mr-2" />
											Preview
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
