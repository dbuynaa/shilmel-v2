"use client";

import { signIn } from "next-auth/react";
import { unstable_noStore as noStore } from "next/cache";
import type { JSX } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DEFAULT_SIGNIN_REDIRECT } from "@/data/constants/index";
import { useToast } from "@/lib/hooks/use-toast";

export function OAuthButtons(): JSX.Element {
	const { toast } = useToast();
	async function handleOAuthSignIn(provider: "google" | "github"): Promise<void> {
		noStore();

		try {
			await signIn(provider, {
				callbackUrl: DEFAULT_SIGNIN_REDIRECT,
			});

			toast({
				title: "Success!",
				description: "You are now signed in",
			});
		} catch (error) {
			toast({
				title: "Something went wrong",
				description: "Plrease try again",
			});

			console.error(error);
			throw new Error(`Error signing in with ${provider}`);
		}
	}

	return (
		<div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
			<Button
				aria-label="Sign in with Google"
				variant="outline"
				onClick={() => void handleOAuthSignIn("google")}
				className="w-full sm:w-auto"
			>
				<Icons.google className="mr-2 size-4" />
				Google
			</Button>

			<Button
				aria-label="Sign in with gitHub"
				variant="outline"
				onClick={() => void handleOAuthSignIn("github")}
				className="w-full sm:w-auto"
			>
				<Icons.gitHub className="mr-2 size-4" />
				GitHub
			</Button>
		</div>
	);
}
