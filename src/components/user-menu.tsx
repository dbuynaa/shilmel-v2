"use client";

import { useTranslations } from "@/i18n/client";
import { getTranslations } from "@/i18n/server";
import { Bolt, BookOpen, Layers2, NotebookTabs, ShoppingCart, UserIcon, UserPen } from "lucide-react";
import type { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";

import { SignOutButton } from "@/components/auth/signout-button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { CustomTooltip } from "./custom-tooltip";
import { buttonVariants } from "./ui/button";

export function UserMenu({ session }: { session: Session }) {
	const user = session.user;
	const t = useTranslations("Global.userMenu");
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{/* <UserIcon className="cursor-pointer hover:text-neutral-500" />
				 */}
				<div className={cn(buttonVariants({ variant: "outline" }), "rounded-full p-2")}>
					<CustomTooltip text={user?.name ?? ""}>
						<h1
							className="flex size-5 cursor-pointer items-center justify-center text-[15px]"
							aria-hidden="true"
						>
							{user?.name?.slice(0, 1)}
						</h1>
					</CustomTooltip>
				</div>

				{/* <h1 className="hover:text-accent-foreground hover:bg-accent flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border">
          {user?.name?.slice(0, 1)}
        </h1> */}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="max-w-64">
				<DropdownMenuLabel className="flex items-start gap-3">
					{user?.image ? (
						<Image
							src={user.image ?? ""}
							alt="Avatar"
							width={32}
							height={32}
							sizes="32px"
							className="shrink-0 rounded-full"
						/>
					) : (
						<h1 className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
							{user?.name?.slice(0, 1)}
						</h1>
					)}
					<div className="flex min-w-0 flex-col">
						<span className="text-foreground truncate text-sm font-medium">{user?.name}</span>
						<span className="text-muted-foreground truncate text-xs font-normal">{user?.email}</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{user.role === "ADMIN" && (
						<>
							<DropdownMenuItem asChild>
								<Link href="/admin">
									<Bolt size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
									<span>Admin</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/">
									<Layers2 size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
									<span>Landing</span>
								</Link>
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/profile/orders">
							<ShoppingCart size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
							<span>{t("orders")}</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/profile">
							<UserPen size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
							<span>{t("account")}</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<SignOutButton title={t("logout")} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
