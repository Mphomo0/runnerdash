import { getOrder } from "@/app/actions/orders";
import { OrderForm } from "@/components/orders/order-form";
import { notFound } from "next/navigation";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">
        Edit Order {order.id.slice(-6)}
      </h2>
      <OrderForm initialData={order} isEdit />
    </div>
  );
}
