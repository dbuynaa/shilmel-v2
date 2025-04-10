import type { AccountDetails, PaymentMethod } from "@/types/account";

import { getUserProfile } from "@/actions/store/profile-actions";
import { CreditCard, MapPin, Package, Settings, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This will be implemented later in a separate PR
const mockFetchPaymentMethods = (): Promise<PaymentMethod[]> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve([
				{
					id: "1",
					type: "visa",
					last4: "4242",
					expiry: "12/24",
					name: "John Newman",
					isDefault: true,
				},
			]);
		}, 1000);
	});

export default async function AccountOverviewPage() {
	const user = await getUserProfile();
	const paymentMethods = await mockFetchPaymentMethods();

	// Format user data for display
	const accountDetails: AccountDetails = {
		id: user.id,
		name: user.name,
		email: user.email,
		image: user.image,
		lastActivityDate: user.lastActivityDate,
	};

	const addresses = user.addresses;
	const recentOrders = user.orders ?? [];

	return (
		<>
			<h1 className="mb-6 text-2xl font-bold">Account Overview</h1>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Personal Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-4">
							<Avatar className="h-20 w-20">
								{accountDetails.image ? (
									<AvatarImage src={accountDetails.image} alt={accountDetails.name ?? ""} />
								) : (
									<AvatarFallback className="text-2xl">
										{accountDetails.name?.charAt(0) ?? "?"}
									</AvatarFallback>
								)}
							</Avatar>
							<div>
								<h3 className="font-semibold">{accountDetails.name ?? "No name set"}</h3>
								<p className="text-muted-foreground text-sm">{accountDetails.email}</p>
								<p className="text-muted-foreground text-sm">
									Last active: {accountDetails.lastActivityDate?.toLocaleDateString() ?? "Never"}
								</p>
							</div>
						</div>
						<div className="mt-4">
							<Button variant="outline" asChild>
								<Link href="/account/details">
									<Settings className="mr-2 h-4 w-4" />
									Edit Details
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Orders</CardTitle>
					</CardHeader>
					<CardContent>
						{recentOrders.length > 0 ? (
							<ul className="space-y-4">
								{recentOrders.map((order) => (
									<li key={order.id} className="flex items-center justify-between">
										<div>
											<p className="font-medium">{order.id}</p>
											<p className="text-muted-foreground text-sm">{order.createdAt.toLocaleDateString()}</p>
										</div>
										<div className="text-right">
											<Badge
												variant={
													order.status === "DELIVERED"
														? "default"
														: order.status === "SHIPPED"
															? "secondary"
															: "outline"
												}
											>
												{order.status}
											</Badge>
											<p className="mt-1 text-sm font-medium">${Number(order.totalAmount).toFixed(2)}</p>
										</div>
									</li>
								))}
							</ul>
						) : (
							<p className="text-muted-foreground">No orders found.</p>
						)}
						<div className="mt-4">
							<Button variant="outline" asChild>
								<Link href="/profile/orders">
									<ShoppingBag className="mr-2 h-4 w-4" />
									View All Orders
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Default Address</CardTitle>
					</CardHeader>
					<CardContent>
						{addresses.length > 0 ? (
							<div>
								<p className="font-medium">{accountDetails.name}</p>
								<p className="text-muted-foreground text-sm">{addresses[0].street}</p>
								<p className="text-muted-foreground text-sm">
									{addresses[0].city}, {addresses[0].state} {addresses[0].postalCode}
								</p>
								<p className="text-muted-foreground text-sm">{addresses[0].country}</p>
							</div>
						) : (
							<p className="text-muted-foreground">No addresses found.</p>
						)}
						<div className="mt-4">
							<Button variant="outline" asChild>
								<Link href="/profile/addresses">
									<MapPin className="mr-2 h-4 w-4" />
									Manage Addresses
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Default Payment Method</CardTitle>
					</CardHeader>
					<CardContent>
						{paymentMethods.length > 0 ? (
							<div>
								<p className="font-medium">
									{paymentMethods[0].type.toUpperCase()} **** {paymentMethods[0].last4}
								</p>
								<p className="text-muted-foreground text-sm">Expires: {paymentMethods[0].expiry}</p>
								<p className="text-muted-foreground text-sm">{paymentMethods[0].name}</p>
							</div>
						) : (
							<p className="text-muted-foreground">No payment methods found.</p>
						)}
						<div className="mt-4">
							<Button variant="outline" asChild>
								<Link href="/account/payment">
									<CreditCard className="mr-2 h-4 w-4" />
									Manage Payment Methods
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<Button variant="outline" asChild>
							<Link href="/account/orders/track">
								<Package className="mr-2 h-4 w-4" />
								Track an Order
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/returns">
								<ShoppingBag className="mr-2 h-4 w-4" />
								Return an Item
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/account/preferences">
								<Settings className="mr-2 h-4 w-4" />
								Update Preferences
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
