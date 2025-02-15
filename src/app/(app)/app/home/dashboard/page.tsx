import type { JSX } from "react"

import { Banner } from "@/components/admin/dashboard/banner"
import { Footer } from "@/components/admin/dashboard/footer"
import { InventorySummary } from "@/components/admin/dashboard/inventory-summary"
import { ProductDetails } from "@/components/admin/dashboard/product-details"
import { PurchaseOrder } from "@/components/admin/dashboard/purchase-order"
import { SalesActivity } from "@/components/admin/dashboard/sales-activity"
import { SalesOrder } from "@/components/admin/dashboard/sales-order"
import { SalesOrderSummary } from "@/components/admin/dashboard/sales-order-summary"
import { TopSellingItems } from "@/components/admin/dashboard/top-selling-items"

export default function AppHomeDashboardPage(): JSX.Element {
  return (
    <div>
      <div className="flex w-full max-w-8xl flex-col gap-5 p-5">
        <Banner />

        <div className="flex w-full flex-col gap-5 xl:flex-row">
          <SalesActivity />
          <InventorySummary />
        </div>

        <div className="flex w-full flex-col gap-5 xl:flex-row">
          <ProductDetails />
          <TopSellingItems />
        </div>

        <div className="flex w-full flex-col gap-5 xl:flex-row">
          <PurchaseOrder />
          <SalesOrder />
        </div>

        <div className="flex w-full">
          <SalesOrderSummary />
        </div>
      </div>
      <Footer />
    </div>
  )
}
