"use client";

import Link from "next/link";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { quickCreateItems } from "@/data/nav-items-app";
import { cn } from "@/lib/utils";

export function QuickCreateMenu() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger
						// showChevron={false}

						className={cn(buttonVariants({ variant: "outline" }), "p-3")}
					>
						<Icons.plus className="size-4" aria-hidden="true" />
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 lg:w-[600px]">
							{quickCreateItems.map((item) => {
								const Icon = Icons[item.icon as keyof typeof Icons];
								return (
									<div key={item.title} className="">
										<div className={cn(buttonVariants({ variant: "ghost" }), "gap-2 hover:bg-transparent")}>
											<Icon className="size-4" />
											<span className="font-semibold">{item.title}</span>
										</div>
										{item.subitems.map((subitem) => (
											<Link key={subitem.title} href={subitem.href} legacyBehavior passHref>
												<NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "gap-2")}>
													<Icons.plus className="size-4" />
													<span className="text-muted-foreground">{subitem.title}</span>
												</NavigationMenuLink>
											</Link>
										))}
									</div>
								);
							})}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
