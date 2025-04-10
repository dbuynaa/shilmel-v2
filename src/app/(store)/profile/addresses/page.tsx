"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Address = {
	id: string;
	type: "home" | "work" | "other";
	isDefault?: boolean;
	name: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
};

const addressFormSchema = z.object({
	type: z.enum(["home", "work", "other"]),
	name: z.string().min(2, "Name is required"),
	street: z.string().min(5, "Street address is required"),
	city: z.string().min(2, "City is required"),
	state: z.string().min(2, "State is required"),
	postalCode: z.string().min(5, "Valid postal code is required"),
	country: z.string().min(2, "Country is required"),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

// Mock data - replace with your actual data fetching
const mockAddresses: Address[] = [
	{
		id: "1",
		type: "home",
		isDefault: true,
		name: "John Newman",
		street: "123 Main St",
		city: "New York",
		state: "NY",
		postalCode: "10001",
		country: "United States",
	},
];

export default function AddressesPage() {
	const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
	const [isAddingNew, setIsAddingNew] = useState(false);

	const form = useForm<AddressFormValues>({
		resolver: zodResolver(addressFormSchema),
		defaultValues: {
			type: "home",
			name: "",
			street: "",
			city: "",
			state: "",
			postalCode: "",
			country: "",
		},
	});

	function onSubmit(data: AddressFormValues) {
		const newAddress: Address = {
			id: Math.random().toString(36).substr(2, 9),
			...data,
		};
		setAddresses([...addresses, newAddress]);
		setIsAddingNew(false);
		form.reset();
	}

	return (
		<>
			<h1 className="text-2xl font-bold">MY ACCOUNT</h1>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-xl">Address Book</CardTitle>
					<Button variant="outline" onClick={() => setIsAddingNew(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Add New Address
					</Button>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{addresses.map((address) => (
							<AddressCard
								key={address.id}
								address={address}
								onDelete={(id) => setAddresses(addresses.filter((a) => a.id !== id))}
							/>
						))}
					</div>

					{isAddingNew && (
						<div className="mt-6 border-t pt-6">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
									<FormField
										control={form.control}
										name="type"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Address Type</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select address type" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="home">Home</SelectItem>
														<SelectItem value="work">Work</SelectItem>
														<SelectItem value="other">Other</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Full Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="street"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Street Address</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="city"
											render={({ field }) => (
												<FormItem>
													<FormLabel>City</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="state"
											render={({ field }) => (
												<FormItem>
													<FormLabel>State</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="postalCode"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Postal Code</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="country"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Country</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="flex gap-4">
										<Button type="submit">Save Address</Button>
										<Button type="button" variant="outline" onClick={() => setIsAddingNew(false)}>
											Cancel
										</Button>
									</div>
								</form>
							</Form>
						</div>
					)}
				</CardContent>
			</Card>
		</>
	);
}

function AddressCard({
	address,
	onDelete,
}: {
	address: Address;
	onDelete: (id: string) => void;
}) {
	return (
		<div className="flex items-start justify-between rounded-lg border p-4">
			<div className="space-y-1">
				<div className="flex items-center gap-2">
					<Home className="h-4 w-4" />
					<span className="font-medium">{address.type.toUpperCase()}</span>
					{address.isDefault && (
						<span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-600">Default</span>
					)}
				</div>
				<div className="text-sm">{address.name}</div>
				<div className="text-muted-foreground text-sm">
					{address.street}
					<br />
					{address.city}, {address.state} {address.postalCode}
					<br />
					{address.country}
				</div>
			</div>

			<Button variant="ghost" size="icon" onClick={() => onDelete(address.id)}>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	);
}
