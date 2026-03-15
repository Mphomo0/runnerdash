"use client"

import { useState } from "react"
import { DollarSign, ShoppingCart, Package, AlertCircle, ChevronDown } from "lucide-react"

interface RevenueSummaryDropdownProps {
  totalRevenue: number
  runnerRevenue: number
  ordersRevenue: number
  activeOrders: number
  ordersToBuy: number
  completedOrders: number
  pendingPayments: number
  weeklyRevenue: { [week: string]: number }
  monthlyRevenue: { [month: string]: number }
  yearlyRevenue: { [year: string]: number }
}

export function RevenueSummaryDropdown({
  totalRevenue,
  runnerRevenue,
  ordersRevenue,
  activeOrders,
  ordersToBuy,
  completedOrders,
  pendingPayments,
  weeklyRevenue,
  monthlyRevenue,
  yearlyRevenue,
}: RevenueSummaryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "yearly">("weekly")

  const formatMonthKey = (key: string) => {
    const [year, month] = key.split("-")
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  const sortedWeekly = Object.entries(weeklyRevenue)
    .sort((a, b) => {
      const weekMatchA = a[0].match(/Week (\d+)/)
      const weekMatchB = b[0].match(/Week (\d+)/)
      return (weekMatchA ? parseInt(weekMatchA[1]) : 0) - (weekMatchB ? parseInt(weekMatchB[1]) : 0)
    })

  const sortedMonthly = Object.entries(monthlyRevenue)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reverse()

  const sortedYearly = Object.entries(yearlyRevenue)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reverse()

  const totalWeekly = Object.values(weeklyRevenue).reduce((sum, val) => sum + val, 0)
  const totalMonthly = Object.values(monthlyRevenue).reduce((sum, val) => sum + val, 0)
  const totalYearly = Object.values(yearlyRevenue).reduce((sum, val) => sum + val, 0)

  const stats = [
    { label: "Total Revenue", value: `R${totalRevenue.toFixed(2)}`, subtext: `R${runnerRevenue.toFixed(2)} runners + R${ordersRevenue.toFixed(2)} orders`, icon: DollarSign, accentColor: "var(--accent)" },
    { label: "Active Orders", value: `${activeOrders}`, subtext: `${ordersToBuy} waiting to buy`, icon: ShoppingCart, accentColor: "var(--success)" },
    { label: "Completed", value: `${completedOrders}`, subtext: "All time completions", icon: Package, accentColor: "#60A5FA" },
    { label: "Pending Payments", value: `${pendingPayments}`, subtext: "Unpaid fees & items", icon: AlertCircle, accentColor: "var(--danger)" },
  ]

  return (
    <div
      className="anim-fade-up"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="p-4 md:p-5"
              style={{
                borderBottom: index < 4 ? '1px solid var(--border-subtle)' : 'none',
                borderRight: index % 2 === 0 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={14} style={{ color: stat.accentColor }} />
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                >
                  {stat.label}
                </span>
              </div>
              <div
                className="font-bold"
                style={{
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                }}
              >
                {stat.value}
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-center gap-2 py-3 transition-colors"
          style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <span className="text-xs font-medium">View Details</span>
          <ChevronDown
            size={14}
            className="transition-transform duration-200"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </div>

      {isOpen && (
        <div className="p-4 md:p-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex gap-2 mb-4 md:mb-6">
            {(["weekly", "monthly", "yearly"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-1.5 text-xs font-medium rounded-sm transition-colors"
                style={{
                  backgroundColor: activeTab === tab ? 'var(--accent)' : 'transparent',
                  color: activeTab === tab ? '#080C14' : 'var(--text-muted)',
                  border: `1px solid ${activeTab === tab ? 'var(--accent)' : 'var(--border-subtle)'}`,
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "weekly" && (
            <div className="space-y-3">
              {sortedWeekly.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No revenue data yet</p>
              ) : (
                sortedWeekly.map(([week, amount]) => (
                  <div key={week} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{week}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      R{amount.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
              {sortedWeekly.length > 0 && (
                <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Total</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
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
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No revenue data yet</p>
              ) : (
                sortedMonthly.map(([month, amount]) => (
                  <div key={month} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{formatMonthKey(month)}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      R{amount.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
              {sortedMonthly.length > 0 && (
                <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Total</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
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
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No revenue data yet</p>
              ) : (
                sortedYearly.map(([year, amount]) => (
                  <div key={year} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{year}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      R{amount.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
              {sortedYearly.length > 0 && (
                <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Total</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      R{totalYearly.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
