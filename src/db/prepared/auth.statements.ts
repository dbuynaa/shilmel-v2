import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const psGetUserById = db
	.select()
	.from(users)
	.where(eq(users.id, sql.placeholder("id")))
	.prepare("psGetUserById");

export const psGetUserByEmail = db
	.select()
	.from(users)
	.where(eq(users.email, sql.placeholder("email")))
	.prepare("psGetUserByEmail");

export const psGetUserByEmailVerificationToken = db
	.select()
	.from(users)
	.where(eq(users.emailVerificationToken, sql.placeholder("emailVerificationToken")))
	.prepare("psGetUserByEmailVerificationToken");

export const psGetUserByResetPasswordToken = db
	.select()
	.from(users)
	.where(eq(users.resetPasswordToken, sql.placeholder("resetPasswordToken")))
	.prepare("psGetUserByResetPasswordToken");

export const psUpdateUserEmailVerificationToken = db
	.update(users)
	.set({
		emailVerificationToken: sql`${sql.placeholder("emailVerificationToken")}`,
	})
	.where(eq(users.email, sql.placeholder("email")))
	.prepare("psUpdateUserEmailVerificationToken");

export const psUpdateUserResetPasswordToken = db
	.update(users)
	.set({
		resetPasswordToken: sql`${sql.placeholder("resetPasswordToken")}`,
		resetPasswordTokenExpiry: sql`${sql.placeholder("resetPasswordTokenExpiry")}`,
	})
	.where(eq(users.email, sql.placeholder("email")))
	.prepare("psUpdateUserResetPasswordToken");

export const psUpdateUserPassword = db
	.update(users)
	.set({
		password: sql`${sql.placeholder("password")}`,
		resetPasswordToken: null,
		resetPasswordTokenExpiry: null,
	})
	.where(eq(users.id, sql.placeholder("id")))
	.prepare("psUpdateUserPassword");

export const psLinkOAuthAccount = db
	.update(users)
	.set({
		emailVerified: sql`${sql.placeholder("emailVerified")}`,
	})
	.where(eq(users.id, sql.placeholder("id")))
	.prepare("psLinkOAuthAccount");

export const psCreateUser = db
	.insert(users)
	.values({
		id: sql`${sql.placeholder("id")}`,
		email: sql`${sql.placeholder("email")}`,
		password: sql`${sql.placeholder("password")}`,
		role: sql`${sql.placeholder("role")}`,
		updatedAt: sql`${sql.placeholder("updatedAt")}`,
	})
	.prepare("psCreateUser");
