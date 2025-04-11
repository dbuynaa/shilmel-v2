"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { getAllCategories } from "@/actions/inventory/categories";
import { NavMobileMenu } from "@/components/store/nav/nav-mobile-menu.client";
import { cn, deslugify, slugify } from "@/lib/utils";

export const NavMenu = ({ categories }: { categories: Awaited<ReturnType<typeof getAllCategories>> }) => {
	const pathname = usePathname();

	// const categories = await db.query.categories.findMany();
	const links = [
		...categories!.map(({ name, slug }) => ({
			label: name,
			href: `/category/${slugify(slug).toLowerCase()}`,
		})),
	];
	return (
		<>
			<div className="hidden sm:block">
				<ul className="flex flex-row items-center justify-center gap-x-1">
					{links.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								className={cn(
									"group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-hidden",
									link.href === pathname ? "bg-accent text-accent-foreground" : "text-foreground",
								)}
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</div>
			<div className="flex items-center sm:hidden">
				<NavMobileMenu>
					<ul className="flex flex-col items-stretch justify-center gap-x-1 pb-8">
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-full items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-hidden"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</NavMobileMenu>
			</div>
		</>
	);
};
