import * as schema from "@/db/schema"
import { env } from "@/env"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

const sql = neon(env.DATABASE_URI)

export const db = drizzle(sql, { schema })
