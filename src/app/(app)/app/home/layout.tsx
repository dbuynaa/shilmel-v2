import * as React from "react"

import { Subheader } from "@/components/nav/app/subheader"

import type { JSX } from "react";

interface AppHomeLayoutProps {
  children: React.ReactNode
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
