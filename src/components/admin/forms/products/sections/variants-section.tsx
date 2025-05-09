"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ProductFormValues } from "@/lib/validations/product";
import { ChevronDown, ChevronUp, Eye, ImageIcon, Plus, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

type VariantsSectionProps = {
	open: boolean;
	onToggle: () => void;
	form: UseFormReturn<ProductFormValues>;
	variantImages: Record<number, Array<{ id?: string; url: string; alt?: string; position: number }>>;
	setSelectedVariantIndex: React.Dispatch<React.SetStateAction<number | null>>;
	variantHelpers: {
		addOption: () => void;
		removeOption: (index: number) => void;
		addOptionValue: (optionIndex: number) => void;
		removeOptionValue: (optionIndex: number, valueIndex: number) => void;
		moveOption: (index: number, direction: "up" | "down") => void;
		moveOptionValue: (optionIndex: number, valueIndex: number, direction: "up" | "down") => void;
	};
};

export function VariantsSection({
	open,
	onToggle,
	form,
	variantImages,
	setSelectedVariantIndex,
	variantHelpers,
}: VariantsSectionProps) {
	const { addOption, removeOption, addOptionValue, removeOptionValue, moveOption, moveOptionValue } =
		variantHelpers;

	// Open variant details dialog
	const openVariantDetails = (index: number) => {
		setSelectedVariantIndex(index);
	};

	return (
		<Collapsible open={open} onOpenChange={onToggle} className="border rounded-md shadow-sm">
			<CollapsibleTrigger asChild>
				<div className="flex items-center justify-between p-6 cursor-pointer bg-card">
					<h2 className="text-lg font-medium">
						Variants{" "}
						{form.watch("variants")!.length > 0 && (
							<span className="text-sm text-muted-foreground ml-2">({form.watch("variants")!.length})</span>
						)}
					</h2>
					{open ? (
						<ChevronUp className="h-5 w-5 text-muted-foreground" />
					) : (
						<ChevronDown className="h-5 w-5 text-muted-foreground" />
					)}
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="p-6 pt-0">
				<div className="space-y-6">
					<p className="text-sm text-muted-foreground">
						Add options like size or color to create variants of this product
					</p>

					{form.watch("options")?.map((_option, optionIndex: number) => (
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

								<div className="flex items-center gap-2 ml-2 mt-6">
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => moveOption(optionIndex, "up")}
										disabled={optionIndex === 0}
										className="h-8 w-8 p-0"
									>
										<ChevronUp className="h-4 w-4" />
										<span className="sr-only">Move up</span>
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => moveOption(optionIndex, "down")}
										disabled={optionIndex === form.watch("options")!.length - 1}
										className="h-8 w-8 p-0"
									>
										<ChevronDown className="h-4 w-4" />
										<span className="sr-only">Move down</span>
									</Button>
									<Button type="button" variant="ghost" size="sm" onClick={() => removeOption(optionIndex)}>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
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

												<div className="flex items-center gap-1">
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => moveOptionValue(optionIndex, valueIndex, "up")}
														disabled={valueIndex === 0}
														className="h-8 w-8 p-0"
													>
														<ChevronUp className="h-4 w-4" />
														<span className="sr-only">Move up</span>
													</Button>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => moveOptionValue(optionIndex, valueIndex, "down")}
														disabled={valueIndex === form.watch(`options.${optionIndex}.values`).length - 1}
														className="h-8 w-8 p-0"
													>
														<ChevronDown className="h-4 w-4" />
														<span className="sr-only">Move down</span>
													</Button>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => removeOptionValue(optionIndex, valueIndex)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
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

						<Alert className="bg-muted/50 border-muted">
							<AlertDescription className="text-sm text-muted-foreground">
								Variants are automatically generated as you add or modify options.
							</AlertDescription>
						</Alert>
					</div>

					{form.watch("variants") && form.watch("variants")!.length > 0 && (
						<div className="space-y-4 mt-8">
							<div className="flex items-center justify-between">
								<h3 className="text-base font-medium">Variants ({form.watch("variants")!.length})</h3>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button variant="ghost" size="sm" type="button">
												<Eye className="w-4 h-4 mr-2" />
												Show all fields
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Edit additional details for each variant</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>

							<div className="border rounded-lg overflow-hidden">
								<div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500">
									<div className="col-span-4">Variant</div>
									<div className="col-span-2">Price</div>
									<div className="col-span-2">Quantity</div>
									<div className="col-span-2">Images</div>
									<div className="col-span-2">Actions</div>
								</div>
								<div className="divide-y max-h-[400px] overflow-y-auto">
									{form.watch("variants")?.map((variant, index: number) => (
										<div key={index} className="grid grid-cols-12 px-4 py-3 items-center">
											<div className="col-span-4 text-sm font-medium truncate">{variant.title}</div>

											<FormField
												control={form.control}
												name={`variants.${index}.price`}
												render={({ field }) => (
													<FormItem className="col-span-2">
														<FormControl>
															<div className="relative">
																<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
																	$
																</span>
																<Input
																	type="number"
																	step="0.01"
																	placeholder="0.00"
																	className="pl-7"
																	value={field.value || ""}
																	onChange={field.onChange}
																/>
															</div>
														</FormControl>
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name={`variants.${index}.stock`}
												render={({ field }) => (
													<FormItem className="col-span-2">
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

											<div className="col-span-2 flex items-center">
												<Dialog>
													<DialogTrigger asChild>
														<Button variant="outline" size="sm" className="flex items-center gap-1">
															<ImageIcon className="h-4 w-4" />
															<span>{variantImages[index]?.length || 0}</span>
														</Button>
													</DialogTrigger>
													<DialogContent className="max-w-3xl">
														<DialogHeader>
															<DialogTitle>Variant Images: {variant.title}</DialogTitle>
														</DialogHeader>
														<div className="py-4">
															{/* Image upload component would go here */}
															<p className="text-sm text-muted-foreground">
																Upload images specific to this variant.
															</p>
														</div>
													</DialogContent>
												</Dialog>
											</div>

											<div className="col-span-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => openVariantDetails(index)}
													className="w-full"
												>
													Edit Details
												</Button>
											</div>
										</div>
									))}
								</div>
							</div>

							<Alert>
								<AlertDescription className="text-sm text-muted-foreground">
									Click on "Edit Details" to manage additional properties for each variant.
								</AlertDescription>
							</Alert>
						</div>
					)}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
