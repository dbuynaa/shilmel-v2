import * as React from "react"
import type { JSX } from "react"

interface AppLayoutProps {
  children: React.ReactNode
}

export default async function AppLayout({
  children,
}: AppLayoutProps): Promise<JSX.Element> {
  return <div>{children}</div>
}
