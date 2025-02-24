import { getUserOrders } from "@/actions/order-actions"

import { OrderList } from "@/components/store/order-list"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

export default async function OrderPage() {
  const orders = await getUserOrders()

  return (
    <div className="py-10">
      <h1 className="mb-5 text-2xl font-bold">Your Orders</h1>
      <OrderList initialOrders={orders} />
    </div>
  )
}
