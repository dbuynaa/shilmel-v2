"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Order {
	id: string;
	date: Date;
	total: number;
	status: string;
	items: {
		quantity: number;
		price: number;
		product: {
			name: string;
			image: string | undefined;
		};
	}[];
}

interface OrderListProps {
	initialOrders: Order[];
}

export function OrderList({ initialOrders }: OrderListProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [currentPage, setCurrentPage] = useState(1);
	const ordersPerPage = 5;

	const filteredOrders = initialOrders.filter(
		(order) =>
			(order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.items.some((item) => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))) &&
			(statusFilter === "All" || order.status === statusFilter),
	);

	const indexOfLastOrder = currentPage * ordersPerPage;
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
	const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
	const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

	return (
		<div className="space-y-4">
			<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<div className="relative w-full sm:w-64">
					<Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
					<Input
						placeholder="Search orders..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-8"
					/>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full sm:w-40">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="All">All</SelectItem>
						<SelectItem value="PENDING">Pending</SelectItem>
						<SelectItem value="PROCESSING">Processing</SelectItem>
						<SelectItem value="SHIPPED">Shipped</SelectItem>
						<SelectItem value="DELIVERED">Delivered</SelectItem>
						<SelectItem value="CANCELLED">Cancelled</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Items</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentOrders.map((order) => (
							<TableRow key={order.id}>
								<TableCell>{order.id}</TableCell>
								<TableCell>
									{order.items.map((item) => `${item.quantity}x ${item.product.name}`).join(", ")}
								</TableCell>
								<TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
								<TableCell>${order.total.toFixed(2)}</TableCell>
								<TableCell>{order.status}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<div className="text-muted-foreground text-sm">
					Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
					{filteredOrders.length} orders
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
						disabled={currentPage === totalPages}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
