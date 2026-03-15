"use server";

import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export async function getDashboardStats() {
  return await convex.query(api.dashboard.getDashboardStats);
}

export async function getRecentOrders() {
  const orders = await convex.query(api.orders.getOrders, {});
  const runnerOrders = await convex.query(api.runnerOrders.getRunnerOrders, {});

  const combined = [...orders, ...runnerOrders]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return combined;
}
