"use client";

import { signOut } from "next-auth/react";
import type { JSX } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function SignOutButton({
	title = "Sign out",
}: {
	title?: string;
}): JSX.Element {
	return (
		<Button
			aria-label="Sign Out"
			variant="ghost"
			size="sm"
			className="w-full justify-start text-sm"
			onClick={() =>
				void signOut({
					callbackUrl: "/",
					redirect: true,
				})
			}
		>
			<Icons.logout className="mr-2 size-4" aria-hidden="true" />
			{title}
		</Button>
	);
}
