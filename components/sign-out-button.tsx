"use client";

import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <button
      onClick={() => {
        signOut({ redirectUrl: "/login" });
      }}
      className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium rounded-sm transition-all duration-150 group relative"
      style={{ color: "var(--text-secondary)" }}
    >
      <span
        className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ backgroundColor: "var(--danger-dim)" }}
        aria-hidden
      />
      <LogOut
        size={16}
        strokeWidth={2}
        className="relative z-10 flex-shrink-0"
        style={{ color: "var(--danger)" }}
      />
      <span className="relative z-10 group-hover:text-white transition-colors duration-150">
        Logout
      </span>
    </button>
  );
}
