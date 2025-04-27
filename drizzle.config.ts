import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema",
	out: "./src/db/migrations",
	dialect: "postgresql",
	casing: "camelCase",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
