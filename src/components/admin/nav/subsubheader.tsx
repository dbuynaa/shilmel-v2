"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import type { JSX } from "react";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SubSubHeader(): JSX.Element {
	const paths = usePathname();
	const pathNames = paths
		.split("/")
		.filter((path) => path)
		.slice(1);

	return (
		<ul className="bg-tertiary flex h-20 w-full items-center gap-1 border-b px-5">
			{pathNames.length > 3 && <Icons.chevronRight className="size-4" />}
			{pathNames.map((link, index) => {
				const href = `/admin/${pathNames.slice(0, index + 1).join("/")}`;

				return (
					<React.Fragment key={index}>
						<li
							className={cn(
								buttonVariants({ variant: "ghost" }),
								index === 0 && "cursor-default hover:bg-transparent",
								"px-2 capitalize",
							)}
						>
							{/* {index === 0 ? (
								<p>{pathNames[0]}</p>
							) : (
								<Link href={href} className="tracking-wide">
									{link.replace(/-/g, " ")}
								</Link>
							)} */}
							<Link href={href} className="tracking-wide">
								{link.replace(/-/g, " ")}
							</Link>
						</li>
						{pathNames.length !== index + 1 && (
							<Icons.chevronRight className="text-muted-foreground size-4" />
						)}
					</React.Fragment>
				);
			})}
		</ul>
	);
}
