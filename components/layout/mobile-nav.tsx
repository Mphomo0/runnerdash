"use client"

import { Menu } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { useState } from "react"
import { usePathname } from "next/navigation"

export const MobileNav = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className="md:hidden flex items-center px-4 py-3"
      style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-9 h-9 rounded-sm transition-colors"
        style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-elevated)' }}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      <span
        className="ml-3 text-sm font-semibold"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
      >
        Runner Dash
      </span>

      {open && (
        <div
          className="fixed inset-0 z-50"
          style={{ backgroundColor: 'rgba(8,12,20,0.85)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-64 h-full"
            style={{ backgroundColor: 'var(--bg-surface)' }}
            onClick={e => e.stopPropagation()}
          >
            <Sidebar key={pathname} />
          </div>
        </div>
      )}
    </div>
  )
}
