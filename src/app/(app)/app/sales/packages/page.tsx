import { redirect } from "next/navigation"
import { auth } from "@/auth"

import type { JSX } from "react";

export default async function AppSalesPackagesPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  return <div>App Sales Packages Page</div>
}
