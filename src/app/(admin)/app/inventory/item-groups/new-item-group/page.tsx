import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { AddItemGroupForm } from "@/components/admin/forms/inventory/item-group/add-item-group-form"
import { SubSubHeader } from "@/components/admin/nav/subsubheader"

import type { JSX } from "react";

export default async function AppInventoryItemGroupsNewItemGroupPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  return (
    <div>
      <SubSubHeader />
      <div className="p-5">
        <AddItemGroupForm />
      </div>
    </div>
  )
}
