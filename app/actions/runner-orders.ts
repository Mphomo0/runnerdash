"use server";

import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { revalidatePath } from "next/cache";
import { Id } from "@/convex/_generated/dataModel";

export async function getRunnerOrders(search?: string) {
  return await convex.query(
    api.runnerOrders.getRunnerOrders,
    search ? { search } : {},
  );
}

export async function getRunnerOrder(id: string) {
  return await convex.query(api.runnerOrders.getRunnerOrder, {
    id: id as Id<"runnerOrders">,
  });
}

export async function createRunnerOrder(data: {
  customerName: string;
  customerPhone: string;
  notes?: string;
  items: {
    name: string;
    size?: string;
    colour?: string;
    price: number;
    quantity: number;
  }[];
}) {
  await convex.mutation(api.runnerOrders.createRunnerOrder, data);
  revalidatePath("/runner-orders");
}

export async function updateRunnerOrder(
  id: string,
  data: {
    customerName?: string;
    customerPhone?: string;
    status?: string;
    itemsPaid?: boolean;
    runnerFeePaid?: boolean;
    notes?: string;
    items?: {
      id?: string;
      name: string;
      size?: string;
      colour?: string;
      price: number;
      quantity: number;
    }[];
  },
) {
  await convex.mutation(api.runnerOrders.updateRunnerOrder, {
    id: id as Id<"runnerOrders">,
    ...data,
  });
  revalidatePath("/runner-orders");
  revalidatePath(`/runner-orders/${id}`);
}

export async function deleteRunnerOrder(id: string) {
  await convex.mutation(api.runnerOrders.deleteRunnerOrder, {
    id: id as Id<"runnerOrders">,
  });
  revalidatePath("/runner-orders");
}
