"use server";

import { getUserByEmail, getUserByResetPasswordToken } from "@/actions/users";
import { signIn } from "@/auth";
import {
	psCreateUser,
	psLinkOAuthAccount,
	psUpdateUserEmailVerificationToken,
	psUpdateUserPassword,
	psUpdateUserResetPasswordToken,
} from "@/db/prepared/auth.statements";
import {
	type SignInWithPasswordFormInput,
	type SignUpWithPasswordFormInput,
	signInWithPasswordSchema,
	signUpWithPasswordSchema,
} from "@/validations/auth";
import bcryptjs from "bcryptjs";
// import crypto from "crypto"
import { AuthError } from "next-auth";

import { EmailVerificationEmail } from "@/components/admin/emails/email-verification-email";
import { ResetPasswordEmail } from "@/components/admin/emails/reset-password-email";
import { resend } from "@/config/email";

async function generateRandomBytes(length: number): Promise<Uint8Array> {
	const randomBytes = new Uint8Array(length);
	crypto.getRandomValues(randomBytes);
	return randomBytes;
}
export async function signUpWithPassword(
	rawInput: SignUpWithPasswordFormInput,
): Promise<"invalid-input" | "exists" | "success" | "error"> {
	const validatedInput = signUpWithPasswordSchema.safeParse(rawInput);
	if (!validatedInput.success) return "invalid-input";

	try {
		const user = await getUserByEmail(validatedInput.data.email);
		if (user) return "exists";

		const passwordHash = await bcryptjs.hash(validatedInput.data.password, 10);
		const userId = crypto.randomUUID();

		// Use prepared statement to create user
		const newUserResponse = await psCreateUser.execute({
			id: userId,
			email: validatedInput.data.email,
			password: passwordHash,
			role: "CUSTOMER",
			updatedAt: new Date().toISOString(),
		});

		if (!newUserResponse) return "error";

		const emailVerificationToken = generateRandomBytes(32).toString();

		// Using prepared statement
		const updatedUserResponse = await psUpdateUserEmailVerificationToken.execute({
			emailVerificationToken,
			email: validatedInput.data.email,
		});

		const emailSent = await resend.emails.send({
			// from: env.RESEND_EMAIL_FROM,
			from: "f7M2H@example.com",
			to: [validatedInput.data.email],
			subject: "Verify your email address",
			react: EmailVerificationEmail({
				email: validatedInput.data.email,
				emailVerificationToken,
			}),
		});

		return updatedUserResponse && emailSent ? "success" : "error";

		// return updatedUserResponse ? "success" : "error"
	} catch (error) {
		console.error(error);
		throw new Error("Error signing up with password");
	}
}

export async function signInWithPassword(
	rawInput: SignInWithPasswordFormInput,
): Promise<
	| "invalid-input"
	| "invalid-credentials"
	| "not-registered"
	| "unverified-email"
	| "incorrect-provider"
	| "success"
> {
	const validatedInput = signInWithPasswordSchema.safeParse(rawInput);
	if (!validatedInput.success) return "invalid-input";

	const existingUser = await getUserByEmail(validatedInput.data.email);
	if (!existingUser) return "not-registered";

	if (!existingUser.email || !existingUser.password) return "incorrect-provider";

	if (!existingUser.emailVerified) return "unverified-email";

	try {
		await signIn("credentials", {
			email: validatedInput.data.email,
			password: validatedInput.data.password,
			redirect: false,
		});

		return "success";
	} catch (error) {
		console.error(error);
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return "invalid-credentials";
				default:
					throw error;
			}
		} else {
			throw error;
		}
	}
}

export async function resetPassword(email: string): Promise<"not-found" | "success" | null> {
	const user = await getUserByEmail(email);
	if (!user) return "not-found";

	const today = new Date();
	const resetPasswordToken = generateRandomBytes(32).toString();
	const resetPasswordTokenExpiry = new Date(today.setDate(today.getDate() + 1)).toISOString(); // 24 hours from now as ISO string

	try {
		// Using prepared statement
		const userUpdatedResponse = await psUpdateUserResetPasswordToken.execute({
			resetPasswordToken,
			resetPasswordTokenExpiry,
			email,
		});

		const emailSent = await resend.emails.send({
			// from: env.RESEND_EMAIL_FROM,
			from: "f7M2H@example.com",
			to: [email],
			subject: "Reset your password",
			react: ResetPasswordEmail({ email, resetPasswordToken }),
		});

		return userUpdatedResponse && emailSent ? "success" : null;

		// return userUpdatedResponse ? "success" : null
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function updatePassword(
	resetPasswordToken: string,
	password: string,
): Promise<"not-found" | "expired" | "success" | null> {
	try {
		const user = await getUserByResetPasswordToken(resetPasswordToken);
		if (!user) return "not-found";

		const resetPasswordExpiry = user.resetPasswordTokenExpiry;
		// Convert string date to Date object for comparison if it exists
		if (!resetPasswordExpiry || new Date(resetPasswordExpiry) < new Date()) return "expired";

		const passwordHash = await bcryptjs.hash(password, 10);

		// Using prepared statement
		const userUpdatedResponse = await psUpdateUserPassword.execute({
			password: passwordHash,
			id: user.id,
		});

		return userUpdatedResponse ? "success" : null;
	} catch (error) {
		console.error(error);
		throw new Error("Error updating password");
	}
}

export async function linkOAuthAccount(userId: string): Promise<void> {
	try {
		await psLinkOAuthAccount.execute({
			emailVerified: new Date().toISOString(),
			id: userId,
		});
	} catch (error) {
		console.error(error);
		throw new Error("Error linking OAuth account");
	}
}
