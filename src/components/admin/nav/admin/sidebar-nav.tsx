"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
	return (
		<nav className="max-h-[79vh] space-y-2 overflow-y-auto px-2 py-5">
			{sidebarItems.map((item) => {
				const Icon = Icons[item.icon as keyof typeof Icons];

				const isCollapsibleOpen = !collapsed && (pathname.startsWith(item.href) || pathname === item.href);

				return (
					<div key={item.href}>
						{item.subitems && item.subitems.length > 0 && item.title !== "Home" ? (
							<Collapsible open={isCollapsibleOpen}>
								<CollapsibleTrigger
									className={cn(
										pathname === item.href ||
											pathname === item.href + "/new" ||
											(pathname.startsWith(item.href) && collapsed)
											? buttonVariants({ variant: "default" })
											: buttonVariants({ variant: "ghost" }),
										"flex w-full items-center text-sm",
										collapsed ? "justify-center " : "justify-between",
									)}
									onClick={() => {
										setCollapsedAction(false);
									}}
								>
									<Link href={item.href} className="flex w-full items-center gap-2">
										<Icon className="size-4" />
										<span className={cn(collapsed && "hidden")}>{item.title}</span>
									</Link>
								</CollapsibleTrigger>

								<CollapsibleContent className="w-full space-y-1 py-1 pl-6">
									{item.subitems.map((subitem) => (
										<Button
											variant={pathname.startsWith(subitem.href) ? "default" : "ghost"}
											key={subitem.href}
											className={cn(
												"group flex w-full items-center justify-between gap-2 text-sm",
												pathname.startsWith(subitem.href)
													? "text-primary-foreground"
													: "text-muted-foreground",
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
											? buttonVariants({ variant: "default" })
											: buttonVariants({ variant: "ghost" }),
										"group flex w-full justify-start gap-2 text-sm",
									)}
								>
									<Icon className="size-4" />
									<span
										className={cn(
											(pathname.startsWith("/admin/home") && item.href.startsWith("/admin/home")) ||
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
