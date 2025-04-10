"use client";

import { type SignInWithEmailFormInput, signInWithEmailSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import type { JSX } from "react";
import { useForm } from "react-hook-form";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/hooks/use-toast";

export function SignInWithEmailForm(): JSX.Element {
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const [isPending, startTransition] = React.useTransition();

	const form = useForm<SignInWithEmailFormInput>({
		resolver: zodResolver(signInWithEmailSchema),
		defaultValues: {
			email: "",
		},
	});

	function onSubmit(formData: SignInWithEmailFormInput): void {
		startTransition(async () => {
			try {
				await signIn("email", { email: formData.email });
			} catch (error) {
				searchParams.get("error") === "OAuthAccountNotLinked"
					? toast({
							title: "Email already in use with another provider",
							description: "Perhaps you signed up with another method?",
							variant: "destructive",
						})
					: toast({
							title: "Something went wrong",
							description: "Please try again",
							variant: "destructive",
						});
				console.error(error);
			}
		});
	}

	return (
		<Form {...form}>
			<form className="grid gap-4" onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="text" placeholder="johnsmith@gmail.com" {...field} />
							</FormControl>
							<FormMessage className="pt-2 sm:text-sm" />
						</FormItem>
					)}
				/>

				<Button>
					{isPending ? (
						<>
							<Icons.spinner className="mr-2 size-4 animate-spin" aria-hidden="true" />
							<span>Pending...</span>
						</>
					) : (
						<span>Continue</span>
					)}
					<span className="sr-only">Continue with magic link</span>
				</Button>
			</form>
		</Form>
	);
}
