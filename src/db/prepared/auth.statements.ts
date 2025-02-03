import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

export const psGetUserById = db
  .select()
  .from(users)
  .where(eq(users.id, sql.placeholder("id")))
  .prepare("psGetUserById")

export const psGetUserByEmail = db
  .select()
  .from(users)
  .where(eq(users.email, sql.placeholder("email")))
  .prepare("psGetUserByEmail")

export const psGetUserByEmailVerificationToken = db
  .select()
  .from(users)
  .where(
    eq(users.emailVerificationToken, sql.placeholder("emailVerificationToken"))
  )
  .prepare("psGetUserByEmailVerificationToken")

export const psGetUserByResetPasswordToken = db
  .select()
  .from(users)
  .where(eq(users.resetPasswordToken, sql.placeholder("resetPasswordToken")))
  .prepare("psGetUserByResetPasswordToken")

export const psUpdateUserEmailVerificationToken = db
  .update(users)
  .set({
    emailVerificationToken: sql`${sql.placeholder("emailVerificationToken")}`,
  })
  .where(eq(users.email, sql.placeholder("email")))
  .prepare("psUpdateUserEmailVerificationToken")

export const psMarkEmailAsVerified = db
  .update(users)
  .set({
    emailVerified: sql`${sql.placeholder("emailVerified")}`,
    emailVerificationToken: sql`${sql.placeholder("emailVerificationToken")}`,
  })
  .where(
    eq(users.emailVerificationToken, sql`${sql.placeholder("currentToken")}`)
  )
  .prepare("psMarkEmailAsVerified")
