import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  admins: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    createdAt: v.number()
  }).index("by_clerk_user_id", ["clerkUserId"]),
  orders: defineTable({
    customerName: v.string(),
    customerPhone: v.string(),
    notes: v.optional(v.string()),
    status: v.string(), // e.g. "PENDING", "COMPLETED"
    itemsPaid: v.boolean(),
    runnerFeePaid: v.boolean(),
    itemsTotal: v.number(),
    runnerFee: v.number(),
    grandTotal: v.number(),
    items: v.array(v.object({
      name: v.string(),
      size: v.optional(v.string()),
      colour: v.optional(v.string()),
      price: v.number(),
      quantity: v.number()
    }))
  }),
  runnerOrders: defineTable({
    customerName: v.string(),
    customerPhone: v.string(),
    notes: v.optional(v.string()),
    status: v.string(),
    itemsPaid: v.boolean(),
    runnerFeePaid: v.boolean(),
    itemsTotal: v.number(),
    runnerFee: v.number(),
    grandTotal: v.number(),
    items: v.array(v.object({
      name: v.string(),
      size: v.optional(v.string()),
      colour: v.optional(v.string()),
      price: v.number(),
      quantity: v.number()
    }))
  }),
  runnerFeeTiers: defineTable({
    minItems: v.number(),
    maxItems: v.number(),
    feeAmount: v.number()
  })
});
