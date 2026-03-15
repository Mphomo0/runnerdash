import { getDashboardStats, getRecentOrders } from "@/app/actions/dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { format } from "date-fns";
import {
  Package,
  ShoppingCart,
  ArrowUpRight,
  Plus,
  Settings2,
  TrendingUp,
} from "lucide-react";
import { RevenuePeriodSelector } from "@/components/dashboard/revenue-period-selector";

// ── Status Badge ─────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED: "badge-success",
    PENDING: "badge-warning",
    CANCELLED: "badge-danger",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-sm ${map[status] ?? "badge-default"}`}
      style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}
    >
      {status}
    </span>
  );
}

// ── Quick Action Button ───────────────────────────────────────
function QuickAction({
  href,
  icon: Icon,
  label,
  description,
  accentColor = "var(--accent)",
  delay = 0,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  accentColor?: string;
  delay?: number;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 p-4 transition-all duration-200 anim-fade-up delay-${delay}`}
      style={{
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-sm transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
      >
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-semibold"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-display)",
          }}
        >
          {label}
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {description}
        </div>
      </div>
      <ArrowUpRight
        size={14}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{ color: accentColor }}
      />
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentOrders = await getRecentOrders();

  const activeOrders = stats.totalOrders - stats.completedOrders;

  return (
    <div
      className="min-h-full p-4 sm:p-8"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* ── Page Header ─────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 anim-fade-in">
        <div>
          <p
            className="text-base sm:text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
          >
            Overview
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold leading-none"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <Link
          href="/orders/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 w-full sm:w-auto"
          style={{
            backgroundColor: "var(--accent)",
            color: "#080C14",
            fontFamily: "var(--font-display)",
            border: "1px solid white",
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          New Order
        </Link>
      </header>

      {/* ── Revenue Period Selector ─────────────────────────────────── */}
      <section
        className="grid grid-cols-1 gap-px mb-px"
        aria-label="Revenue Summary"
      >
        <RevenuePeriodSelector
          weeklyRevenue={stats.weeklyRevenue}
          monthlyRevenue={stats.monthlyRevenue}
          yearlyRevenue={stats.yearlyRevenue}
          weeklyOrders={stats.weeklyOrders}
          monthlyOrders={stats.monthlyOrders}
          yearlyOrders={stats.yearlyOrders}
          pendingPayments={stats.pendingPayments}
        />
      </section>

      {/* ── Content Grid ────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table — takes 2/3 */}
        <section
          className="lg:col-span-2 anim-fade-up delay-4"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {/* Section Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={15} style={{ color: "var(--accent)" }} />
              <h2
                className="text-sm font-semibold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--text-primary)",
                }}
              >
                Recent Orders
              </h2>
            </div>
            <Link
              href="/orders"
              className="flex items-center gap-1 text-xs font-medium transition-colors duration-150"
              style={{ color: "var(--text-muted)" }}
            >
              View all
              <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto hidden md:block">
            {recentOrders.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16"
                style={{ color: "var(--text-muted)" }}
              >
                <ShoppingCart
                  size={32}
                  strokeWidth={1}
                  className="mb-3 opacity-40"
                />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  >
                    {["Customer", "Items", "Date", "Total", "Status", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                          style={{
                            color: "var(--text-muted)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr
                      key={order.id}
                      className={`group transition-colors duration-100 anim-fade-up delay-${i} hover:bg-[var(--bg-hover)]`}
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
                    >
                      <td
                        className="px-6 py-4 font-medium"
                        style={{
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {order.customerName}
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {order.items.length}
                      </td>
                      <td
                        className="px-6 py-4 text-xs"
                        style={{
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {format(order.createdAt, "MMM d, yyyy")}
                      </td>
                      <td
                        className="px-6 py-4 font-semibold"
                        style={{
                          color: "var(--accent)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        R{order.grandTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/orders/${order.id}`}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center w-7 h-7 rounded-sm"
                          style={{
                            backgroundColor: "var(--accent-dim)",
                            color: "var(--accent)",
                          }}
                          aria-label={`View order ${order.id}`}
                        >
                          <ArrowUpRight size={13} />
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
            {recentOrders.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16"
                style={{ color: "var(--text-muted)" }}
              >
                <ShoppingCart
                  size={32}
                  strokeWidth={1}
                  className="mb-3 opacity-40"
                />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {recentOrders.map((order, i) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className={`flex items-center justify-between p-4 transition-colors duration-100 hover:bg-[var(--bg-hover)]`}
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
                      <div className="flex items-center justify-between">
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
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions — takes 1/3 */}
        <section className="anim-fade-up delay-5">
          <div
            className="mb-4 pb-3"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Quick Actions
            </p>
          </div>
          <div className="space-y-2">
            <QuickAction
              href="/orders/new"
              icon={ShoppingCart}
              label="New Order"
              description="Create a customer order"
              accentColor="var(--accent)"
              delay={5}
            />
            <QuickAction
              href="/orders"
              icon={Package}
              label="All Orders"
              description="Browse & manage orders"
              accentColor="var(--success)"
              delay={5}
            />
            <QuickAction
              href="/settings"
              icon={Settings2}
              label="Fee Settings"
              description="Manage runner fee tiers"
              accentColor="#60A5FA"
              delay={5}
            />
          </div>

          {/* Status Summary */}
          <div
            className="mt-6 p-4"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderLeft: "3px solid var(--accent)",
            }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Pipeline
            </p>
            <div className="space-y-2">
              {[
                {
                  label: "To Buy",
                  value: stats.ordersToBuy,
                  color: "var(--warning)",
                },
                {
                  label: "Active",
                  value: activeOrders,
                  color: "var(--success)",
                },
                {
                  label: "Unpaid",
                  value: stats.pendingPayments,
                  color: "var(--danger)",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {label}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color, fontFamily: "var(--font-mono)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
