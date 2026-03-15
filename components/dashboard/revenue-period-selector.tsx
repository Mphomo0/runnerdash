"use client";

import { useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface PeriodData {
  revenue: number;
  runnerRevenue: number;
  ordersRevenue: number;
  activeOrders: number;
  completedOrders: number;
  pendingPayments: number;
}

interface RevenuePeriodSelectorProps {
  weeklyRevenue: {
    [week: string]: { total: number; runner: number; orders: number };
  };
  monthlyRevenue: {
    [month: string]: { total: number; runner: number; orders: number };
  };
  yearlyRevenue: {
    [year: string]: { total: number; runner: number; orders: number };
  };
  weeklyOrders: {
    [week: string]: {
      total: number;
      completed: number;
      pending: number;
      pendingPayment: number;
    };
  };
  monthlyOrders: {
    [month: string]: {
      total: number;
      completed: number;
      pending: number;
      pendingPayment: number;
    };
  };
  yearlyOrders: {
    [year: string]: {
      total: number;
      completed: number;
      pending: number;
      pendingPayment: number;
    };
  };
  pendingPayments: number;
}

export function RevenuePeriodSelector({
  weeklyRevenue,
  monthlyRevenue,
  yearlyRevenue,
  weeklyOrders,
  monthlyOrders,
  yearlyOrders,
  pendingPayments,
}: RevenuePeriodSelectorProps) {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">(
    "weekly",
  );
  const [selectedKey, setSelectedKey] = useState<string>("");

  const formatMonthKey = (key: string) => {
    const [year, month] = key.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const getPeriodKeys = () => {
    if (period === "weekly") {
      return Object.keys(weeklyRevenue).sort((a, b) => {
        const weekA = parseInt(a.match(/Week (\d+)/)?.[1] || "0");
        const weekB = parseInt(b.match(/Week (\d+)/)?.[1] || "0");
        return weekA - weekB;
      });
    }
    if (period === "monthly") {
      return Object.keys(monthlyRevenue).sort().reverse();
    }
    return Object.keys(yearlyRevenue).sort().reverse();
  };

  const getPeriodData = (key: string): PeriodData => {
    let revData = { total: 0, runner: 0, orders: 0 };
    let activeOrders = 0;
    let completedOrders = 0;
    let pendingPayments = 0;

    if (period === "weekly") {
      revData = weeklyRevenue[key] || { total: 0, runner: 0, orders: 0 };
      const orders = weeklyOrders[key] || {
        total: 0,
        completed: 0,
        pending: 0,
        pendingPayment: 0,
      };
      activeOrders = orders.pending;
      completedOrders = orders.completed;
      pendingPayments = orders.pendingPayment;
    } else if (period === "monthly") {
      revData = monthlyRevenue[key] || { total: 0, runner: 0, orders: 0 };
      const orders = monthlyOrders[key] || {
        total: 0,
        completed: 0,
        pending: 0,
        pendingPayment: 0,
      };
      activeOrders = orders.pending;
      completedOrders = orders.completed;
      pendingPayments = orders.pendingPayment;
    } else {
      revData = yearlyRevenue[key] || { total: 0, runner: 0, orders: 0 };
      const orders = yearlyOrders[key] || {
        total: 0,
        completed: 0,
        pending: 0,
        pendingPayment: 0,
      };
      activeOrders = orders.pending;
      completedOrders = orders.completed;
      pendingPayments = orders.pendingPayment;
    }

    return {
      revenue: revData.total,
      runnerRevenue: revData.runner,
      ordersRevenue: revData.orders,
      activeOrders,
      completedOrders,
      pendingPayments,
    };
  };

  const getCurrentWeekKey = () => {
    const now = new Date();
    const currentMonth = now.toLocaleString("default", { month: "long" });
    const weekOfMonth = Math.ceil(
      (now.getDate() +
        new Date(now.getFullYear(), now.getMonth(), 1).getDay()) /
        7,
    );
    return `Week ${weekOfMonth} of ${currentMonth}`;
  };

  const getCurrentMonthKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  const getCurrentYearKey = () => {
    return String(new Date().getFullYear());
  };

  const getDefaultKey = () => {
    if (selectedKey) return selectedKey;
    if (period === "weekly") {
      const currentWeekKey = getCurrentWeekKey();
      return (
        periodKeys.find((k) => k === currentWeekKey) ||
        periodKeys[periodKeys.length - 1] ||
        ""
      );
    }
    if (period === "monthly") {
      const currentMonthKey = getCurrentMonthKey();
      return (
        periodKeys.find((k) => k === currentMonthKey) || periodKeys[0] || ""
      );
    }
    const currentYearKey = getCurrentYearKey();
    return periodKeys.find((k) => k === currentYearKey) || periodKeys[0] || "";
  };

  const periodKeys = getPeriodKeys();
  const currentKey = getDefaultKey();
  const currentData = getPeriodData(currentKey);

  const stats = [
    {
      label: "Total Revenue",
      value: `R${currentData.revenue.toFixed(2)}`,
      subtext: `R${currentData.runnerRevenue.toFixed(2)} from runners + R${currentData.ordersRevenue.toFixed(2)} from orders`,
      icon: DollarSign,
      accentColor: "var(--accent)",
    },
    {
      label: "Active Orders",
      value: `${currentData.activeOrders}`,
      subtext: "Waiting for purchase/delivery",
      icon: ShoppingCart,
      accentColor: "var(--success)",
    },
    {
      label: "Completed",
      value: `${currentData.completedOrders}`,
      subtext: "Successfully delivered",
      icon: Package,
      accentColor: "#60A5FA",
    },
    {
      label: "Pending Payments",
      value: `${pendingPayments}`,
      subtext: "Unpaid items or runner fees",
      icon: AlertCircle,
      accentColor: "var(--danger)",
    },
  ];

  return (
    <div
      className="anim-fade-up overflow-hidden"
      style={{
        backgroundColor: "rgba(13, 20, 32, 0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Premium Period Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-8 py-6"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13, 20, 32, 0.8), rgba(8, 12, 20, 0.9))",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Analysis Period
            </span>
          </div>
          <div
            className="flex gap-1 p-1 rounded-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {(["weekly", "monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                  setSelectedKey("");
                }}
                className="px-4 py-2 text-[11px] font-bold tracking-wider uppercase rounded-sm transition-all duration-300 relative group"
                style={{
                  backgroundColor:
                    period === p ? "var(--accent)" : "transparent",
                  color: period === p ? "#080C14" : "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {p}
                {period !== p && (
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group max-w-xs w-full">
          <label
            className="block text-[10px] font-bold tracking-[0.15em] uppercase mb-2 ml-1"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Select {period.slice(0, -2)}
          </label>
          <div className="relative transition-all duration-300 focus-within:ring-1 focus-within:ring-[var(--accent)]/50">
            <select
              value={selectedKey || currentKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="appearance-none w-full pl-4 pr-10 py-3 text-sm rounded-sm cursor-pointer outline-none transition-all duration-300"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {periodKeys.length === 0 ? (
                <option value="">No data available</option>
              ) : (
                periodKeys.map((key) => (
                  <option
                    key={key}
                    value={key}
                    style={{ backgroundColor: "#080C14" }}
                  >
                    {period === "weekly"
                      ? key
                      : period === "monthly"
                        ? formatMonthKey(key)
                        : key}
                  </option>
                ))
              )}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-40%]"
              style={{ color: "var(--text-muted)" }}
            />
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-subtle)]">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="group relative p-6 md:p-8 transition-all duration-500 hover:bg-[rgba(255,255,255,0.02)]"
          >
            {/* Subtle highlight bar */}
            <div
              className="absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-x-0 group-hover:scale-x-100"
              style={{ backgroundColor: stat.accentColor }}
            />

            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1">
                <span
                  className="text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {stat.label}
                </span>
                <p
                  className="text-[11px] font-medium leading-tight max-w-[140px] opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stat.subtext}
                </p>
              </div>
              <div
                className="flex items-center justify-center w-8 h-8 rounded-sm shrink-0 transition-all duration-500 group-hover:rotate-[360deg] group-hover:bg-[rgba(255,255,255,0.05)]"
                style={{
                  backgroundColor: `${stat.accentColor}12`,
                  color: stat.accentColor,
                  border: `1px solid ${stat.accentColor}20`,
                }}
              >
                <stat.icon size={15} strokeWidth={2.5} />
              </div>
            </div>

            <div
              className="font-bold leading-none tracking-tight transition-transform duration-500 group-hover:translate-x-1"
              style={{
                fontSize: "2.25rem",
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
            >
              {stat.value}
            </div>

            {/* Visual indicator of health/importance */}
            <div className="mt-6 flex items-center gap-1">
              <div className="h-[2px] w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out delay-300"
                  style={{
                    backgroundColor: stat.accentColor,
                    width: "65%", // Placeholder for visual effect
                    opacity: 0.6,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
