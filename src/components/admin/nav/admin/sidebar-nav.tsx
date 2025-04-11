"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import type { JSX } from "react";

import { CustomTooltip } from "@/components/custom-tooltip";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { sidebarItems } from "@/data/nav-items-app";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
	collapsed: boolean;
	setCollapsedAction: (collapsed: boolean) => void;
}

export function SidebarNav({ collapsed, setCollapsedAction }: SidebarNavProps): JSX.Element {
	const pathname = usePathname();
	const router = useRouter();
	const [openCollapsible, setOpenCollapsible] = React.useState<string | null>();

	const handleCollapsibleToggle = (href: string): void => {
		router.push(href);
		setOpenCollapsible((prev) => (prev === href ? null : href));
	};

	return (
		<nav className="max-h-[79vh] space-y-2 overflow-y-auto px-2 py-5">
			{sidebarItems.map((item) => {
				const Icon = Icons[item.icon as keyof typeof Icons];

				const isCollapsibleOpen = pathname === item.href || openCollapsible === item.href;

				return (
					<div key={item.href}>
						{item.subitems && item.subitems.length > 0 && item.title !== "Home" ? (
							<Collapsible
								open={isCollapsibleOpen}
								onOpenChange={(open) => {
									if (open) {
										handleCollapsibleToggle(item.href);
									}
								}}
							>
								<CollapsibleTrigger
									className={cn(
										pathname === item.href
											? buttonVariants({ variant: "secondary" })
											: buttonVariants({ variant: "ghost" }),
										"flex w-full items-center text-sm",
										collapsed ? "justify-center " : "justify-between",
									)}
									onClick={() => setCollapsedAction(false)}
								>
									<div className="flex items-center gap-2">
										<Icon className="size-4" />
										<span className={cn("text-sidebar-foreground", collapsed && "hidden")}>{item.title}</span>
									</div>
								</CollapsibleTrigger>

								<CollapsibleContent className="w-full space-y-1 py-1 pl-6">
									{item.subitems.map((subitem) => (
										<Button
											variant={pathname === subitem.href ? "secondary" : "ghost"}
											key={subitem.href}
											className={cn(
												"group flex w-full items-center justify-between gap-2 text-sm",
												pathname === subitem.href ? "text-foreground" : "text-muted-foreground",
											)}
										>
											<Link href={subitem.href} className="flex flex-1 items-start">
												{subitem.title}
											</Link>

											{subitem.hrefPlus && (
												<Link
													href={subitem.hrefPlus}
													className="text-sidebar-border hover:text-foreground hidden group-hover:flex"
												>
													<Icons.plusCircle className="size-4" />
												</Link>
											)}
										</Button>
									))}
								</CollapsibleContent>
							</Collapsible>
						) : (
							<CustomTooltip text={item.title}>
								<Link
									href={item.href}
									className={cn(
										(pathname.startsWith("/admin/home") && item.href.startsWith("/admin/home")) ||
											pathname === item.href
											? buttonVariants({ variant: "secondary" })
											: buttonVariants({ variant: "ghost" }),
										"group flex w-full justify-start gap-2 text-sm",
									)}
									onClick={() => setOpenCollapsible(item.href)}
								>
									<Icon className="size-4" />
									<span
										className={cn(
											(pathname.startsWith("/admin/home") && item.href.startsWith("/admin/home")) ||
												pathname === item.href
												? "text-foreground"
												: "text-sidebar-foreground",
											"group-hover:text-foreground",
											collapsed && "hidden",
										)}
									>
										{item.title}
									</span>
								</Link>
							</CustomTooltip>
						)}
					</div>
				);
			})}
		</nav>
	);
}
