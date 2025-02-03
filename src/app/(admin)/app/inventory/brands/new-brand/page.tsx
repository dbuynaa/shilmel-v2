import type { JSX } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddBrandForm } from "@/components/admin/forms/inventory/brands/add-brand-form"
import { SubSubHeader } from "@/components/admin/nav/subsubheader"

export default async function AppInventoryBrandsNewBrandPage(): Promise<JSX.Element> {
  return (
    <div>
      <SubSubHeader />
      <div className="p-5">
        <Card className="max-w-5xl rounded-md bg-tertiary">
          <CardHeader className="px-5 pt-5">
            <CardTitle className="text-2xl">New Brand</CardTitle>
            <CardDescription className="text-base">
              Add new brand
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pt-2">
            <AddBrandForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
