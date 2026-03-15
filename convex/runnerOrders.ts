import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const calculateOrderTotals = async (ctx: any, items: { price: number; quantity: number }[]) => {
    const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    const tiers = await ctx.db.query("runnerFeeTiers").collect();
    const tier = tiers.find((t: any) => totalQuantity >= t.minItems && totalQuantity <= t.maxItems);

    let runnerFee = 0;
    if (totalQuantity > 0) {
        if (tier) {
            runnerFee = tier.feeAmount;
        } else {
            const highestTier = [...tiers].sort((a: any, b: any) => b.maxItems - a.maxItems)[0];
            if (highestTier && totalQuantity > highestTier.maxItems) {
                runnerFee = highestTier.feeAmount;
            }
        }
    }

    return {
        itemsTotal,
        runnerFee,
        grandTotal: itemsTotal + runnerFee
    };
};

export const getRunnerOrders = query({
    args: { search: v.optional(v.string()) },
    handler: async (ctx, args) => {
        let orders = await ctx.db.query("runnerOrders").order("desc").collect();
        if (args.search) {
            const s = args.search.toLowerCase();
            orders = orders.filter(o =>
                o.customerName.toLowerCase().includes(s) ||
                o.customerPhone.toLowerCase().includes(s)
            );
        }
        return orders.map(o => ({ ...o, id: o._id, createdAt: o._creationTime }));
    }
});

export const getRunnerOrder = query({
    args: { id: v.id("runnerOrders") },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.id);
        if (!order) return null;
        return { ...order, id: order._id, createdAt: order._creationTime };
    }
});

export const createRunnerOrder = mutation({
    args: {
        customerName: v.string(),
        customerPhone: v.string(),
        notes: v.optional(v.string()),
        items: v.array(v.object({
            name: v.string(),
            size: v.optional(v.string()),
            colour: v.optional(v.string()),
            price: v.number(),
            quantity: v.number()
        }))
    },
    handler: async (ctx, args) => {
        const { itemsTotal, runnerFee, grandTotal } = await calculateOrderTotals(ctx, args.items);
        await ctx.db.insert("runnerOrders", {
            customerName: args.customerName,
            customerPhone: args.customerPhone,
            notes: args.notes,
            itemsTotal,
            runnerFee,
            grandTotal,
            items: args.items,
            status: "PENDING",
            itemsPaid: false,
            runnerFeePaid: false
        });
    }
});

export const updateRunnerOrder = mutation({
    args: {
        id: v.id("runnerOrders"),
        customerName: v.optional(v.string()),
        customerPhone: v.optional(v.string()),
        status: v.optional(v.string()),
        itemsPaid: v.optional(v.boolean()),
        runnerFeePaid: v.optional(v.boolean()),
        notes: v.optional(v.string()),
        items: v.optional(v.array(v.object({
            id: v.optional(v.string()),
            name: v.string(),
            size: v.optional(v.string()),
            colour: v.optional(v.string()),
            price: v.number(),
            quantity: v.number()
        })))
    },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.id);
        if (!order) return;

        let updates: any = {};
        if (args.customerName !== undefined) updates.customerName = args.customerName;
        if (args.customerPhone !== undefined) updates.customerPhone = args.customerPhone;
        if (args.status !== undefined) updates.status = args.status;
        if (args.itemsPaid !== undefined) updates.itemsPaid = args.itemsPaid;
        if (args.runnerFeePaid !== undefined) updates.runnerFeePaid = args.runnerFeePaid;
        if (args.notes !== undefined) updates.notes = args.notes;

        if (args.items) {
            const { itemsTotal, runnerFee, grandTotal } = await calculateOrderTotals(ctx, args.items);
            updates.items = args.items;
            updates.itemsTotal = itemsTotal;
            updates.runnerFee = runnerFee;
            updates.grandTotal = grandTotal;
        }

        await ctx.db.patch(args.id, updates);
    }
});

export const deleteRunnerOrder = mutation({
    args: { id: v.id("runnerOrders") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});
