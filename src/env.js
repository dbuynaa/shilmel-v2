import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]),
		NEXTAUTH_URL: z.string().url(),
		AUTH_SECRET: process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),
		DATABASE_URL: z.string(),
		UPLOADTHING_TOKEN: z.string(),
		RESEND_API_KEY: z.string().optional(),
		RESEND_EMAIL_FROM: z.string().email().optional(),
		RESEND_HOST: z.string(),
		RESEND_USERNAME: z.string(),
		RESEND_PORT: z.number(),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		NEXT_PUBLIC_APP_URL: z.string().url(),
		NEXT_PUBLIC_LANGUAGE: z.string().optional().default("en-US"),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		NODE_ENV: process.env.NODE_ENV,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		AUTH_SECRET: process.env.AUTH_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM,
		RESEND_HOST: process.env.RESEND_HOST,
		RESEND_USERNAME: process.env.RESEND_USERNAME,
		RESEND_PORT: Number(process.env.RESEND_PORT),
		NEXT_PUBLIC_LANGUAGE: process.env.NEXT_PUBLIC_LANGUAGE,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
	 * This is especially useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});