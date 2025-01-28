import type { UserRole } from "@/types/auth"

import { cache } from "react"
import NextAuth from "next-auth"
import { linkOAuthAccount } from "@/actions/auth"
import { getUserById } from "@/actions/users"
import { db } from "@/db/index"
import { env } from "@/env.js"
import { DrizzleAdapter } from "@auth/drizzle-adapter"

import authConfig from "@/config/authConfig"

const { auth, handlers, signIn, signOut } = NextAuth({
  // debug: env.NODE_ENV === "development",
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    verifyRequest: "/signin/magic-link-signin",
    error: "/error",
  },
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 daysd
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // events: {
  //   async linkAccount({ user }) {
  //     await linkOAuthAccount(user.id as string)
  //   },
  // },
  callbacks: {
    // async signIn({ user, account }) {
    //   if (account?.provider !== "credentials") return true

    //   return true
    // },

    async jwt({ token, user }) {
      // if (!token.sub) return token
      if (user) {
        token.id = user.id
        token.name = user.name
        // token.role = user.role
      }

      const existingUser = await getUserById(token.sub as string)
      if (!existingUser) return token

      // token.id = existingUser.id
      // token.role = existingUser.role
      return token
    },

    async session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string
      if (session.user && token.name) session.user.name = token.name
      // if (session.user && token.role) session.user.role = token.role as UserRole
      return session
    },
  },
  adapter: DrizzleAdapter(db),
  ...authConfig,
})

// const auth = uncachedAuth

export { auth, handlers, signIn, signOut }
