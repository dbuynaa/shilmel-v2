import * as React from "react"
import type { JSX } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

interface AppLayoutProps {
  children: React.ReactNode
}

export default async function AppLayout({
  children,
}: AppLayoutProps): Promise<JSX.Element> {
  await headers()
  const session = await auth()
  if (!session) redirect("/signin")

  return <div>{children}</div>
}
