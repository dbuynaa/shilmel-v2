import { auth } from "@/auth";
import Link from "next/link";
import type { JSX } from "react";

import { NotificationsMenu } from "@/components/admin/nav/admin/menus/notifications-menu";
import { CustomTooltip } from "@/components/custom-tooltip";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

export async function Header(): Promise<JSX.Element> {
	const session = await auth();

	return (
		<header className="bg-tertiary bg-secondary sticky top-0 z-50 flex h-14 items-center justify-between gap-8 border-b px-5">
			<div className="flex h-full items-center gap-2"></div>

			<div className="flex items-center justify-center gap-2">
				<div className="flex items-center justify-center">
					<NotificationsMenu />

					<CustomTooltip text="Settings">
						<Link
							href="/admin/settings"
							aria-label="Settings"
							className={cn(buttonVariants({ variant: "ghost" }), "p-3")}
						>
							<Icons.settings aria-hidden="true" className="size-4" />
						</Link>
					</CustomTooltip>
				</div>

				<UserMenu session={session!} />
			</div>
		</header>
	);
}
