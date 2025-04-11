import type { AppSidebarNavItem, QuickCreateItem } from "@/types";

export const sidebarItems = [
	{
		title: "Home",
		href: "/admin/home/dashboard",
		icon: "home",
		subitems: [
			{
				title: "Dashboard",
				href: "/admin/home/dashboard",
			},
			{
				title: "Getting Started",
				href: "/admin/home/getting-started",
			},
			{
				title: "Recent Updates",
				href: "/admin/home/updates",
			},
			{
				title: "Announcements",
				href: "/admin/home/announcements",
			},
		],
	},
	{
		title: "Products",
		href: "/admin/products",
		icon: "inventory",
		subitems: [
			{
				title: "Inventory",
				href: "/admin/products/inventory",
				hrefPlus: "/admin/products/inventory/new-product",
			},
			{
				title: "Categories",
				href: "/admin/products/categories",
				hrefPlus: "/admin/products/categories/new-category",
			},
			{
				title: "Items",
				href: "/admin/products/items",
				hrefPlus: "/admin/products/items/new-item",
			},
			{
				title: "products Adjustments",
				href: "/admin/products/inventory-adjustments",
				hrefPlus: "/admin/products/inventory-adjustments/new-adjustment",
			},
		],
	},
	{
		title: "Sales",
		href: "/admin/sales",
		icon: "shoppingCart",
		subitems: [
			{
				title: "Customers",
				href: "/admin/sales/customers",
				hrefPlus: "/admin/sales/customers/new-customer",
			},
			{
				title: "Sales Orders",
				href: "/admin/sales/sales-orders",
				hrefPlus: "/admin/sales/sales-orders/new-order",
			},
			{
				title: "Packages",
				href: "/admin/sales/packages",
				hrefPlus: "/admin/sales/packages/new-package",
			},
			{
				title: "Shipments",
				href: "/admin/sales/shipments",
				hrefPlus: "/admin/sales/shipments/new-shipment",
			},
			{
				title: "Invoices",
				href: "/admin/sales/invoices",
				hrefPlus: "/admin/sales/invoices/new-invoice",
			},
			{
				title: "Sales Receipts",
				href: "/admin/sales/sales-receipts",
				hrefPlus: "/admin/sales/sales-receipts/new-receipt",
			},
			{
				title: "Payments Received",
				href: "/admin/sales/payments-received",
				hrefPlus: "/admin/sales/payments-received/record-payment",
			},
			{
				title: "Sales Returns",
				href: "/admin/sales/sales-returns",
			},
			{
				title: "Credit Notes",
				href: "/admin/sales/credit-notes",
				hrefPlus: "/admin/sales/credit-notes/new-note",
			},
		],
	},
	{
		title: "Purchases",
		href: "/admin/purchases",
		icon: "shoppingBasket",
		subitems: [
			{
				title: "Vendors",
				href: "/admin/purchases/vendors",
				hrefPlus: "/admin/purchases/vendors/new-vendor",
			},
			{
				title: "Expenses",
				href: "/admin/purchases/expenses",
				hrefPlus: "/admin/purchases/expenses/new-expense",
			},
			{
				title: "Purchase Orders",
				href: "/admin/purchases/purchase-orders",
				hrefPlus: "/admin/purchases/purchase-orders/new-order",
			},
			{
				title: "Purchase Receives",
				href: "/admin/purchases/purchase-receives",
				hrefPlus: "/admin/purchases/purchase-receives/new-receive",
			},
		],
	},
	{
		title: "Reports",
		href: "/admin/reports",
		icon: "barChart",
	},
] satisfies AppSidebarNavItem[];

export const quickCreateItems = [
	{
		title: "General",
		href: "",
		icon: "layoutGrid",
		subitems: [
			{
				title: "Add Users",
				href: "",
			},
			{
				title: "Item",
				href: "",
			},
			{
				title: "Item Groups",
				href: "",
			},
			{
				title: "Inventory Adjustments",
				href: "",
			},
		],
	},
	{
		title: "Sales",
		href: "",
		icon: "shoppingCart",
		subitems: [
			{
				title: "Customer",
				href: "",
			},
			{
				title: "Invoices",
				href: "",
			},
			{
				title: "Sales Receipts",
				href: "",
			},
			{
				title: "Sales Order",
				href: "",
			},
			{
				title: "Packages",
				href: "",
			},
			{
				title: "Shipment",
				href: "",
			},
			{
				title: "Customer Payment",
				href: "",
			},
			{
				title: "Credit Notes",
				href: "",
			},
		],
	},
	{
		title: "Purchases",
		href: "",
		icon: "shoppingBasket",
		subitems: [
			{
				title: "Vendor",
				href: "",
			},
			{
				title: "Expenses",
				href: "",
			},
			{
				title: "Bills",
				href: "",
			},
			{
				title: "Purchase Orders",
				href: "",
			},
			{
				title: "Purchase Receives",
				href: "",
			},
			{
				title: "Vendor Payment",
				href: "",
			},
			{
				title: "Vendor Credits",
				href: "",
			},
		],
	},
] satisfies QuickCreateItem[];
