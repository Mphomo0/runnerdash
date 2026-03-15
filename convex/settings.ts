import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getRunnerFeeTiers = query({
  args: {},
  handler: async (ctx) => {
    const tiers = await ctx.db.query("runnerFeeTiers").collect();
    return tiers
      .sort((a, b) => a.minItems - b.minItems)
      .map((t) => ({ ...t, id: t._id }));
  },
});

export const createRunnerFeeTier = mutation({
  args: {
    minItems: v.number(),
    maxItems: v.number(),
    feeAmount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("runnerFeeTiers", args);
  },
});

export const updateRunnerFeeTier = mutation({
  args: {
    id: v.id("runnerFeeTiers"),
    minItems: v.number(),
    maxItems: v.number(),
    feeAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const deleteRunnerFeeTier = mutation({
  args: { id: v.id("runnerFeeTiers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
