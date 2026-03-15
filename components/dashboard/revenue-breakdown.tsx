"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";

interface RevenueBreakdownProps {
  weeklyRevenue: { [week: string]: number };
  monthlyRevenue: { [month: string]: number };
  yearlyRevenue: { [year: string]: number };
}

export function RevenueBreakdown({
  weeklyRevenue,
  monthlyRevenue,
  yearlyRevenue,
}: RevenueBreakdownProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "yearly">(
    "weekly",
  );

  const formatMonthKey = (key: string) => {
    const [year, month] = key.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const sortedWeekly = Object.entries(weeklyRevenue).sort((a, b) => {
    const weekMatchA = a[0].match(/Week (\d+)/);
    const weekMatchB = b[0].match(/Week (\d+)/);
    return (
      (weekMatchA ? parseInt(weekMatchA[1]) : 0) -
      (weekMatchB ? parseInt(weekMatchB[1]) : 0)
    );
  });

  const sortedMonthly = Object.entries(monthlyRevenue)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reverse();

  const sortedYearly = Object.entries(yearlyRevenue)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reverse();

  const totalWeekly = Object.values(weeklyRevenue).reduce(
    (sum, val) => sum + val,
    0,
  );
  const totalMonthly = Object.values(monthlyRevenue).reduce(
    (sum, val) => sum + val,
    0,
  );
  const totalYearly = Object.values(yearlyRevenue).reduce(
    (sum, val) => sum + val,
    0,
  );

  return (
    <div
      className="anim-fade-up"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <DollarSign size={15} style={{ color: "var(--accent)" }} />
          <h2
            className="text-sm font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            Revenue Breakdown
          </h2>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6">
          {(["weekly", "monthly", "yearly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 text-xs font-medium rounded-sm transition-colors"
              style={{
                backgroundColor:
                  activeTab === tab ? "var(--accent)" : "transparent",
                color: activeTab === tab ? "#080C14" : "var(--text-muted)",
                border: `1px solid ${activeTab === tab ? "var(--accent)" : "var(--border-subtle)"}`,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "weekly" && (
          <div className="space-y-3">
            {sortedWeekly.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No revenue data yet
              </p>
            ) : (
              sortedWeekly.map(([week, amount]) => (
                <div key={week} className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {week}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    R{amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
            {sortedWeekly.length > 0 && (
              <div
                className="pt-3 mt-3"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Total
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    R{totalWeekly.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "monthly" && (
          <div className="space-y-3">
            {sortedMonthly.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No revenue data yet
              </p>
            ) : (
              sortedMonthly.map(([month, amount]) => (
                <div key={month} className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {formatMonthKey(month)}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    R{amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
            {sortedMonthly.length > 0 && (
              <div
                className="pt-3 mt-3"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Total
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    R{totalMonthly.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "yearly" && (
          <div className="space-y-3">
            {sortedYearly.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No revenue data yet
              </p>
            ) : (
              sortedYearly.map(([year, amount]) => (
                <div key={year} className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {year}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    R{amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
            {sortedYearly.length > 0 && (
              <div
                className="pt-3 mt-3"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Total
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    R{totalYearly.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
