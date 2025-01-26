import * as React from "react"

import type { JSX } from "react";

interface AppInventoryLayoutProps {
  children: React.ReactNode
}

export default function AppInventoryLayout({
  children,
}: AppInventoryLayoutProps): JSX.Element {
  return <div>{children}</div>
}
