import * as React from "react"

import type { JSX } from "react";

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  return (
    <div className="flex h-auto min-h-screen w-full items-center justify-center">
      {children}
    </div>
  )
}
