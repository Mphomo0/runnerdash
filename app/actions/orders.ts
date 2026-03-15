"use server"

import { convex } from "@/lib/convex"
import { api } from "@/convex/_generated/api"
import { revalidatePath } from "next/cache"
import { Id } from "@/convex/_generated/dataModel"

export async function getOrders(search?: string) {
  // convex query args with optional values must be explicitly passed or omitted.
  return await convex.query(api.orders.getOrders, search ? { search } : {});
}

export async function getOrder(id: string) {
  return await convex.query(api.orders.getOrder, { id: id as Id<"orders"> });
}

export async function createOrder(data: {
  customerName: string
  customerPhone: string
  notes?: string
  items: { name: string; size?: string; colour?: string; price: number; quantity: number }[]
}) {
  await convex.mutation(api.orders.createOrder, data);
  revalidatePath('/orders')
  revalidatePath('/')
}

export async function updateOrder(id: string, data: {
  customerName?: string
  customerPhone?: string
  status?: string
  itemsPaid?: boolean
  runnerFeePaid?: boolean
  notes?: string
  items?: { id?: string; name: string; size?: string; colour?: string; price: number; quantity: number }[]
}) {
  await convex.mutation(api.orders.updateOrder, { id: id as Id<"orders">, ...data });
  revalidatePath('/orders')
  revalidatePath(`/orders/${id}`)
  revalidatePath('/')
}

export async function deleteOrder(id: string) {
  await convex.mutation(api.orders.deleteOrder, { id: id as Id<"orders"> });
  revalidatePath('/orders')
  revalidatePath('/')
}
