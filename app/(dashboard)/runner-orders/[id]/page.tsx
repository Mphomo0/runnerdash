import {
  getRunnerOrder,
  deleteRunnerOrder,
  updateRunnerOrder,
} from "@/app/actions/runner-orders";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { notFound, redirect } from "next/navigation";

export default async function RunnerOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getRunnerOrder(id);

  if (!order) {
    notFound();
  }

  const orderId = order.id;

  async function handleDelete() {
    "use server";
    await deleteRunnerOrder(orderId);
    redirect("/runner-orders");
  }

  async function toggleStatus(field: string, value: boolean) {
    "use server";
    await updateRunnerOrder(orderId, { [field]: value });
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/runner-orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">
            Runner Order {order.id.slice(-6)}
          </h2>
          <Badge
            variant={
              order.status === "COMPLETED"
                ? "success"
                : order.status === "PENDING"
                  ? "warning"
                  : "secondary"
            }
          >
            {order.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/runner-orders/${order.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
          <form action={handleDelete}>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Name:</div>
              <div className="col-span-2">{order.customerName}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Phone:</div>
              <div className="col-span-2">{order.customerPhone}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Notes:</div>
              <div className="col-span-2 text-muted-foreground">
                {order.notes || "No notes"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Date:</div>
              <div className="col-span-2">
                {format(order.createdAt, "PPP p")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 sm:pb-2">
              <span
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Items Payment
              </span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <Badge
                  variant={order.itemsPaid ? "success" : "destructive"}
                  className="sm:order-2 sm:ml-2"
                >
                  {order.itemsPaid ? "Paid" : "Unpaid"}
                </Badge>
                <form
                  action={async () => {
                    "use server";
                    await updateRunnerOrder(order.id, {
                      itemsPaid: !order.itemsPaid,
                    });
                  }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    type="submit"
                    className="w-full sm:w-auto text-base sm:text-sm py-1.5 sm:py-0.5"
                  >
                    {order.itemsPaid ? "Mark Unpaid" : "Mark Paid"}
                  </Button>
                </form>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 sm:pb-2">
              <span
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Runner Fee Payment
              </span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <Badge
                  variant={order.runnerFeePaid ? "success" : "destructive"}
                  className="sm:order-2 sm:ml-2"
                >
                  {order.runnerFeePaid ? "Paid" : "Unpaid"}
                </Badge>
                <form
                  action={async () => {
                    "use server";
                    await updateRunnerOrder(order.id, {
                      runnerFeePaid: !order.runnerFeePaid,
                    });
                  }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    type="submit"
                    className="w-full sm:w-auto text-base sm:text-sm py-1.5 sm:py-0.5"
                  >
                    {order.runnerFeePaid ? "Mark Unpaid" : "Mark Paid"}
                  </Button>
                </form>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <span
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Order Status
              </span>
              <form
                action={async () => {
                  "use server";
                  const nextStatus =
                    order.status === "PENDING"
                      ? "BOUGHT"
                      : order.status === "BOUGHT"
                        ? "DELIVERED"
                        : order.status === "DELIVERED"
                          ? "COMPLETED"
                          : "PENDING";
                  await updateRunnerOrder(order.id, { status: nextStatus });
                }}
                className="w-full sm:w-auto"
              >
                <Button
                  size="sm"
                  variant="outline"
                  type="submit"
                  className="w-full sm:w-auto text-base sm:text-sm py-1.5 sm:py-0.5"
                >
                  Advance to{" "}
                  {order.status === "PENDING"
                    ? "Bought"
                    : order.status === "BOUGHT"
                      ? "Delivered"
                      : order.status === "DELIVERED"
                        ? "Completed"
                        : "Pending"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block relative w-full">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Item
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Size
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Colour
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Quantity
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {order.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle font-medium">
                      {item.name}
                    </td>
                    <td className="p-4 align-middle">{item.size || "-"}</td>
                    <td className="p-4 align-middle">{item.colour || "-"}</td>
                    <td className="p-4 align-middle text-right">
                      R{item.price.toFixed(2)}
                    </td>
                    <td className="p-4 align-middle text-right">
                      {item.quantity}
                    </td>
                    <td className="p-4 align-middle text-right">
                      R{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/50 font-medium">
                <tr>
                  <td colSpan={3} className="p-4 align-middle text-right">
                    Items Total
                  </td>
                  <td className="p-4 align-middle text-right">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </td>
                  <td className="p-4 align-middle text-right">
                    R{order.itemsTotal.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="p-4 align-middle text-right">
                    Runner Fee
                  </td>
                  <td className="p-4 align-middle text-right">
                    R{order.runnerFee.toFixed(2)}
                  </td>
                </tr>
                <tr className="text-lg font-bold">
                  <td colSpan={4} className="p-4 align-middle text-right">
                    Grand Total
                  </td>
                  <td className="p-4 align-middle text-right">
                    R{order.grandTotal.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-md border"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.name}
                  </span>
                  <span
                    className="font-semibold"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    R{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Size
                    </span>
                    <p style={{ color: "var(--text-secondary)" }}>
                      {item.size || "-"}
                    </p>
                  </div>
                  <div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Colour
                    </span>
                    <p style={{ color: "var(--text-secondary)" }}>
                      {item.colour || "-"}
                    </p>
                  </div>
                  <div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Price
                    </span>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      R{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Quantity
                    </span>
                    <p style={{ color: "var(--text-secondary)" }}>
                      {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div
              className="p-4 rounded-md border"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="flex justify-between mb-2">
                <span style={{ color: "var(--text-secondary)" }}>
                  Items Total
                </span>
                <span
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                  items
                </span>
                <span
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  R{order.itemsTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span style={{ color: "var(--text-secondary)" }}>
                  Runner Fee
                </span>
                <span
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  R{order.runnerFee.toFixed(2)}
                </span>
              </div>
              <div
                className="flex justify-between pt-2 border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <span
                  className="font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Grand Total
                </span>
                <span
                  className="font-bold"
                  style={{
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  R{order.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
