import Link from "next/link";
import type { JSX } from "react";

import { InstantHelperMenu } from "@/components/admin/nav/admin/menus/instant-helper-menu";
import { CustomTooltip } from "@/components/custom-tooltip";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubheaderProps {
	buttonText: string;
	buttonLink: string;
}

export function Subheader({ buttonText, buttonLink }: SubheaderProps): JSX.Element {
	return (
		<div className="bg-tertiary flex h-20 w-full items-center justify-end border-b px-5">
			<div className="flex items-center gap-2">
				<CustomTooltip text="Add New Category">
					<Link href={buttonLink} className={cn(buttonVariants(), "gap-1")} aria-label="Add new item">
						<Icons.plus aria-hidden="true" className="size-4" />
						<span>{buttonText}</span>
					</Link>
				</CustomTooltip>
				<InstantHelperMenu />
			</div>
		</div>
	);
}
