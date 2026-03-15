"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Settings, Zap, Footprints } from "lucide-react"
import { SignOutButton } from "@/components/sign-out-button"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    href: "/orders",
  },
  {
    label: "Runner Orders",
    icon: Footprints,
    href: "/runner-orders",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)' }}
      className="flex flex-col h-full w-full">

      {/* Brand */}
      <div className="px-5 py-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-sm"
            style={{ backgroundColor: 'var(--accent)', color: '#080C14' }}
          >
            <Zap size={18} strokeWidth={2.5} />
          </div>
          <div>
            <span
              className="text-base font-bold tracking-tight block"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Runner Dash
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Operations</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-3 text-xs font-semibold tracking-widest uppercase"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Menu
        </p>
        {routes.map((route) => {
          const isActive = pathname === route.href
          return (
            <Link
              key={route.href}
              href={route.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-sm relative group"
              style={{
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-dim)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {/* Hover background */}
              <span
                className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{ backgroundColor: 'var(--bg-hover)' }}
                aria-hidden
              />
              <route.icon
                size={16}
                strokeWidth={isActive ? 2.5 : 2}
                className="relative z-10 flex-shrink-0"
              />
              <span className="relative z-10">{route.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <SignOutButton />
      </div>
    </div>
  )
}
