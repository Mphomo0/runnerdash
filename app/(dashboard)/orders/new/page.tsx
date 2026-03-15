import { OrderForm } from "@/components/orders/order-form"

export default function NewOrderPage() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Create New Order</h2>
      <OrderForm />
    </div>
  )
}
