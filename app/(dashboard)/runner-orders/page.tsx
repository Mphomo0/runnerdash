import { getRunnerOrders } from "@/app/actions/runner-orders";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import {
  Plus,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ShoppingCart,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "COMPLETED"
      ? "success"
      : status === "PENDING"
        ? "warning"
        : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

export default async function RunnerOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const orders = await getRunnerOrders(search);

  return (
    <div
      className="min-h-full p-4 sm:p-8"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p
            className="text-base sm:text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
          >
            Runner Orders
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            Runner Orders
          </h2>
        </div>
        <Link href="/runner-orders/new" className="w-full sm:w-auto">
          <Button
            className="w-full sm:w-auto"
            style={{ border: "1px solid white" }}
          >
            <Plus className="mr-2 h-4 w-4" /> New Runner Order
          </Button>
        </Link>
      </header>

      {/* Search */}
      <div className="mb-6">
        <form className="flex w-full items-center space-x-2">
          <Input
            type="search"
            placeholder="Search customer..."
            name="search"
            defaultValue={search}
            className="h-9 flex-1"
          />
          <Button type="submit" size="sm" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Desktop Table View */}
      <div
        className="hidden md:block rounded-md border"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-subtle)",
        }}
      >
        {orders.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16"
            style={{ color: "var(--text-muted)" }}
          >
            <ShoppingCart
              size={32}
              strokeWidth={1}
              className="mb-3 opacity-40"
            />
            <p className="text-sm">No runner orders found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Order ID
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Customer
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Status
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Items
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Total
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Payment
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-semibold tracking-widest uppercase"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Date
                </th>
                <th className="px-4 py-3 w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="group transition-colors duration-100 hover:bg-[var(--bg-hover)]"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    <Link
                      href={`/runner-orders/${order.id}`}
                      className="hover:underline"
                    >
                      {order.id.slice(-6)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {order.customerName}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {order.customerPhone}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {order.items.length}
                  </td>
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    R{order.grandTotal.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={
                          order.runnerFeePaid ? "success" : "destructive"
                        }
                        className="w-fit text-[10px] px-1 py-0"
                      >
                        Fee: {order.runnerFeePaid ? "Paid" : "Unpaid"}
                      </Badge>
                      <Badge
                        variant={order.itemsPaid ? "success" : "destructive"}
                        className="w-fit text-[10px] px-1 py-0"
                      >
                        Items: {order.itemsPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 text-right text-xs"
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {format(order.createdAt, "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/runner-orders/${order.id}`}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {orders.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-md"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
            }}
          >
            <ShoppingCart
              size={32}
              strokeWidth={1}
              className="mb-3 opacity-40"
            />
            <p className="text-sm">No runner orders found.</p>
          </div>
        ) : (
          <div
            className="rounded-md border"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/runner-orders/${order.id}`}
                  className="flex items-center justify-between p-4 transition-colors duration-100 hover:bg-[var(--bg-hover)]"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-medium truncate"
                        style={{
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {order.customerName}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {order.items.length} items
                      </span>
                      <span
                        className="text-xs"
                        style={{
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {format(order.createdAt, "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          order.runnerFeePaid ? "success" : "destructive"
                        }
                        className="text-[10px] px-1 py-0"
                      >
                        Fee: {order.runnerFeePaid ? "Paid" : "Unpaid"}
                      </Badge>
                      <Badge
                        variant={order.itemsPaid ? "success" : "destructive"}
                        className="text-[10px] px-1 py-0"
                      >
                        Items: {order.itemsPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span
                      className="font-semibold"
                      style={{
                        color: "var(--accent)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      R{order.grandTotal.toFixed(2)}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="ml-2 inline-block"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
