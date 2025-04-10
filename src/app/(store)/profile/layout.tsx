"use client";

import {
	CreditCard,
	Gift,
	HelpCircle,
	LogOut,
	MessageSquare,
	Package,
	Settings,
	ShoppingBag,
	User,
	UserPlus,
	Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export type NavItem = {
	title: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	section?: "main" | "help";
};
const navigationItems: NavItem[] = [
	{
		title: "Account overview",
		href: "/profile",
		icon: User,
		section: "main",
	},
	{
		title: "My orders",
		href: "/profile/orders",
		icon: ShoppingBag,
		section: "main",
	},
	{
		title: "Premier Delivery",
		href: "/profile/delivery",
		icon: Package,
		section: "main",
	},
	{
		title: "My details",
		href: "/profile/details",
		icon: Settings,
		section: "main",
	},
	{
		title: "Change password",
		href: "/profile/password",
		icon: Settings,
		section: "main",
	},
	{
		title: "Address book",
		href: "/profile/addresses",
		icon: UserPlus,
		section: "main",
	},
	{
		title: "Payment methods",
		href: "/profile/payment",
		icon: CreditCard,
		section: "main",
	},
	{
		title: "Sign out",
		href: "/logout",
		icon: LogOut,
		section: "help",
	},
];

export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const user = useSession().data?.user;
	if (!user) {
		return null;
	}
	return (
		<main className="container mx-auto px-4 py-4">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
				{/* Sidebar */}
				<div className="space-y-6">
					<div className="bg-card rounded-lg p-6 shadow-sm">
						<div className="mb-4 flex items-center gap-4">
							<Avatar className="h-16 w-16">
								<AvatarFallback className="text-xl">{user.name?.charAt(0)}</AvatarFallback>
							</Avatar>
							<div>
								<p className="text-muted-foreground text-sm">Hi,</p>
								<h2 className="font-semibold">{user.name}</h2>
							</div>
						</div>

						<nav className="space-y-1">
							{navigationItems
								.filter((item) => item.section === "main")
								.map((item) => (
									<NavLink key={item.href} href={item.href} icon={item.icon} active={pathname === item.href}>
										{item.title}
									</NavLink>
								))}

							<Separator className="my-4" />

							{navigationItems
								.filter((item) => item.section === "help")
								.map((item) => (
									<NavLink key={item.href} href={item.href} icon={item.icon} active={pathname === item.href}>
										{item.title}
									</NavLink>
								))}
						</nav>
					</div>
				</div>

				{/* Main Content */}
				<div className="space-y-6">{children}</div>
			</div>
		</main>
	);
}

function NavLink({
	href,
	children,
	icon: Icon,
	active,
}: {
	href: string;
	children: React.ReactNode;
	icon: React.ComponentType<{ className?: string }>;
	active?: boolean;
}) {
	return (
		<Link
			href={href}
			className={`hover:bg-primary flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors ${
				active ? "text-foreground font-medium" : "text-muted-foreground"
			}`}
		>
			<Icon className="h-4 w-4" />
			{children}
		</Link>
	);
}
