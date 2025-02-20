import type { DefaultSession } from "next-auth"

export type UserRole = "USER" | "ADMIN"

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
