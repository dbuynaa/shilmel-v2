import type { JSX } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { OptionCards } from "@/components/admin/inventory/option-cards"
import { ItemsSubheader } from "@/components/admin/inventory/subheaders/items-subheader"

export default async function AppInventoryItemsPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  return (
    <div>
      <ItemsSubheader />
      <OptionCards />
    </div>
  )
}
