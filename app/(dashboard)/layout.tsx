import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import "../globals.css";

export const metadata: Metadata = {
  title: "Runner Dash",
  description: "Runner Dashboard - Order Management",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ConvexClientProvider>
          <div
            className="flex h-screen overflow-hidden"
            style={{ backgroundColor: "var(--bg-base)" }}
          >
            <div className="hidden md:flex md:w-64 md:flex-shrink-0">
              <Sidebar />
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
              <MobileNav />

              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
