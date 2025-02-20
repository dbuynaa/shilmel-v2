import type { JSX, ReactNode } from "react"

import { Subheader } from "@/components/admin/nav/admin/subheader"

interface AppHomeLayoutProps {
  children: ReactNode
}

export default function AppHomeLayout({
  children,
}: AppHomeLayoutProps): JSX.Element {
  return (
    <div>
      <Subheader />
      <div>{children}</div>
    </div>
  )
}
