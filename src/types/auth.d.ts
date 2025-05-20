import type { DefaultSession } from "next-auth";

export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";

export type ExtendedUser = DefaultSession["user"] & {
	role: UserRole;
};

declare module "next-auth" {
	interface Session {
		user: ExtendedUser;
	}
}
