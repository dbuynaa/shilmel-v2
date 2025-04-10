import { getUserByEmail } from "@/actions/users";
import { env } from "@/env";
import { signInWithPasswordSchema } from "@/validations/auth";
import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";

import { MagicLinkEmail } from "@/components/admin/emails/magic-link-email";
import { resend } from "@/config/email";
import { siteConfig } from "@/config/site";

export default {
	providers: [
		// GoogleProvider({
		//   clientId: env.GOOGLE_ID,
		//   clientSecret: env.GOOGLE_SECRET,
		//   allowDangerousEmailAccountLinking: true,
		// }),
		ResendProvider({
			server: {
				host: env.RESEND_HOST,
				port: Number(env.RESEND_PORT),
				auth: {
					user: env.RESEND_USERNAME,
					pass: env.RESEND_API_KEY,
				},
			},
			async sendVerificationRequest({
				identifier,
				url,
			}: {
				identifier: string;
				url: string;
			}) {
				try {
					await resend.emails.send({
						from: env.RESEND_EMAIL_FROM,
						to: [identifier],
						subject: `${siteConfig.name} magic link sign in`,
						react: MagicLinkEmail({ identifier, url }),
					});

					console.log("Verification email sent");
				} catch (error) {
					throw new Error("Failed to send verification email");
				}
			},
		}),
		CredentialsProvider({
			async authorize(rawCredentials) {
				const validatedCredentials = signInWithPasswordSchema.safeParse(rawCredentials);

				if (validatedCredentials.success) {
					const user = await getUserByEmail(validatedCredentials.data.email);
					if (!user || !user.password) return null;

					const passwordIsValid = await compare(validatedCredentials.data.password, user.password);

					if (passwordIsValid) return user;
				}
				return null;
			},
		}),
	],
} satisfies NextAuthConfig;
