import { getRunnerOrder } from "@/app/actions/runner-orders";
import { RunnerOrderForm } from "@/components/runner-order-form";
import { notFound } from "next/navigation";

export default async function EditRunnerOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getRunnerOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">
        Edit Runner Order {order.id.slice(-6)}
      </h2>
      <RunnerOrderForm initialData={order} isEdit />
    </div>
  );
}
