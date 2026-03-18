import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper to calculate totals (no runner fee for regular orders)
const calculateOrderTotals = async (
  ctx: any,
  items: { price: number; quantity: number }[],
) => {
  const itemsTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    itemsTotal,
    runnerFee: 0,
    grandTotal: itemsTotal,
  };
};

export const getOrders = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let orders = await ctx.db.query("orders").order("desc").collect();
    if (args.search) {
      const s = args.search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.customerName.toLowerCase().includes(s) ||
          o.customerPhone.toLowerCase().includes(s),
      );
    }
    // Prisma included `id` implicitly, Convex uses `_id` and `_creationTime`
    return orders.map((o) => ({ ...o, id: o._id, createdAt: o._creationTime }));
  },
});

export const getOrder = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return null;
    return { ...order, id: order._id, createdAt: order._creationTime };
  },
});

export const createOrder = mutation({
  args: {
    customerName: v.string(),
    customerPhone: v.string(),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        name: v.string(),
        size: v.optional(v.string()),
        colour: v.optional(v.string()),
        price: v.number(),
        quantity: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { itemsTotal, runnerFee, grandTotal } = await calculateOrderTotals(
      ctx,
      args.items,
    );
    await ctx.db.insert("orders", {
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      notes: args.notes,
      itemsTotal,
      runnerFee,
      grandTotal,
      items: args.items,
      status: "PENDING",
      itemsPaid: false,
      runnerFeePaid: false,
    });
  },
});

export const updateOrder = mutation({
  args: {
    id: v.id("orders"),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    status: v.optional(v.string()),
    itemsPaid: v.optional(v.boolean()),
    runnerFeePaid: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    items: v.optional(
      v.array(
        v.object({
          id: v.optional(v.string()),
          name: v.string(),
          size: v.optional(v.string()),
          colour: v.optional(v.string()),
          price: v.number(),
          quantity: v.number(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return;

    let updates: any = {};
    if (args.customerName !== undefined)
      updates.customerName = args.customerName;
    if (args.customerPhone !== undefined)
      updates.customerPhone = args.customerPhone;
    if (args.status !== undefined) updates.status = args.status;
    if (args.itemsPaid !== undefined) updates.itemsPaid = args.itemsPaid;
    if (args.runnerFeePaid !== undefined)
      updates.runnerFeePaid = args.runnerFeePaid;
    if (args.notes !== undefined) updates.notes = args.notes;

    if (args.items) {
      const { itemsTotal, runnerFee, grandTotal } = await calculateOrderTotals(
        ctx,
        args.items,
      );
      updates.items = args.items;
      updates.itemsTotal = itemsTotal;
      updates.runnerFee = runnerFee;
      updates.grandTotal = grandTotal;
    }

    await ctx.db.patch(args.id, updates);
  },
});

export const deleteOrder = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
