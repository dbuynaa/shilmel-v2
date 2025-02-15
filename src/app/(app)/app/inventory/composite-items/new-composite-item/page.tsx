import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { AddCompositeItemForm } from "@/components/admin/forms/inventory/composite-items/add-composite-item-form"
import { SubSubHeader } from "@/components/admin/nav/subsubheader"

import type { JSX } from "react";

export default async function AppInventoryCompositeItemsNewCompositeItemPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  return (
    <div>
      <SubSubHeader />
      <div className="p-5">
        <AddCompositeItemForm />
      </div>
    </div>
  )
}
