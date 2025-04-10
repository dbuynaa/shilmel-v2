"use client";

import { updateUserProfile } from "@/actions/store/profile-actions";
import { profileFormSchema } from "@/validations/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/hooks/use-toast";

// const profileFormSchema = z.object({
//   username: z.string().min(2).max(30),
//   email: z.string().email(),
//   bio: z.string().max(160).optional(),
//   name: z.string().min(2).max(50),
//   avatarUrl: z.string().url().optional(),
// })

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
	user: ProfileFormValues;
}

export function ProfileForm({ user }: ProfileFormProps) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: user,
		mode: "onChange",
	});

	async function onSubmit(data: ProfileFormValues) {
		setIsLoading(true);
		try {
			await updateUserProfile(data);
			toast({
				title: "Profile updated",
				description: "Your profile has been successfully updated.",
			});
		} catch (error) {
			console.error("Error updating profile:", error);
			toast({
				title: "Error",
				description: "There was a problem updating your profile.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="johndoe" {...field} />
							</FormControl>
							<FormDescription>This is your public display name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="johndoe@example.com" {...field} />
							</FormControl>
							<FormDescription>We'll never share your email with anyone else.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="John Doe" {...field} />
							</FormControl>
							<FormDescription>This is your full name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can @mention other users and organizations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Updating..." : "Update profile"}
				</Button>
			</form>
		</Form>
	);
}
