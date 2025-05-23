import { env } from "@/env";
import type { Metadata } from "next";
import Link from "next/link";
import type { JSX } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
	title: "Oppps",
	description: "Something went wrong. Please go back to the SignIn page",
};

export default function AuthErrorPage(): JSX.Element {
	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<Card className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl">Oooooops</CardTitle>
					<CardDescription>Something went wrong. Please go back to the SignIn page.</CardDescription>
				</CardHeader>
				<CardContent>
					<Link aria-label="Back to the sign in page" href="/signin" className={buttonVariants()}>
						Go to Sign In page
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
