"use server";

import crypto from "crypto";

import { getUserByEmail } from "@/actions/users";
import { psMarkEmailAsVerified, psUpdateUserEmailVerificationToken } from "@/db/prepared/auth.statements";

import { unstable_noStore as noStore } from "next/cache";

import { EmailVerificationEmail } from "@/components/admin/emails/email-verification-email";
import { resend } from "@/config/email";

export async function resendEmailVerificationLink(email: string): Promise<"not-found" | "success" | null> {
	try {
		const user = await getUserByEmail(email);
		if (!user) return "not-found";

		const emailVerificationToken = crypto.randomBytes(32).toString("base64url");

		const userUpdated = await psUpdateUserEmailVerificationToken.execute({
			email,
			emailVerificationToken,
		});

		const emailSent = await resend.emails.send({
			// from: env.RESEND_EMAIL_FROM,
			from: "qKU1o@example.com",
			to: [email],
			subject: "Verify your email address",
			react: EmailVerificationEmail({ email, emailVerificationToken }),
		});

		return userUpdated && emailSent ? "success" : null;
	} catch (error) {
		console.error(error);
		throw new Error("Error resending email verification link");
	}
}

export async function checkIfEmailVerified(email: string): Promise<boolean> {
	try {
		noStore();
		const user = await getUserByEmail(email);
		return user?.emailVerified ? true : false;
	} catch (error) {
		console.error(error);
		throw new Error("Error checking if email verified");
	}
}

export async function markEmailAsVerified(emailVerificationToken: string): Promise<boolean> {
	try {
		const userUpdated = await psMarkEmailAsVerified.execute({
			emailVerified: new Date(),
			emailVerificationToken: null,
			currentToken: emailVerificationToken,
		});

		return userUpdated ? true : false;
	} catch (error) {
		console.error(error);
		throw new Error("Error marking email as verified");
	}
}
