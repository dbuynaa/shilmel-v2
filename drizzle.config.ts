import { env } from "@/env.mjs";
import type { Config } from "drizzle-kit";

export default {
	schema: "./src/db/schema/index.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	strict: true,
	casing: "camelCase",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
} satisfies Config;
