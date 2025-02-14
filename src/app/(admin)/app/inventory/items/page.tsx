import type { JSX } from "react"

import { OptionCards } from "@/components/admin/inventory/option-cards"
import { ItemsSubheader } from "@/components/admin/inventory/subheaders/items-subheader"

export default async function AppInventoryItemsPage(): Promise<JSX.Element> {
  return (
    <div>
      <ItemsSubheader />
      <OptionCards />
    </div>
  )
}
