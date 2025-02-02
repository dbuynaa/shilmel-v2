import { OrderList } from "@/components/store/order-list"

export default function OrderPage() {
  return (
    <div className="py-10">
      <h1 className="mb-5 text-2xl font-bold">Your Orders</h1>
      <OrderList />
    </div>
  )
}
