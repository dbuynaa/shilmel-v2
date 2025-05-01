import { env } from "@/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index";

const sql = neon(env.DATABASE_URL);

export const db = drizzle({ schema, casing: "snake_case", client: sql });
