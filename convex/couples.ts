import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new couple
 */
export const createCouple = mutation({
  args: {
    userId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const coupleId = await ctx.db.insert("couples", {
      user1Id: args.userId,
      user2Id: args.userId,
      inviteCode,
    });

    return { inviteCode, coupleId };
  },
});

/**
 * Join existing couple
 */
export const joinCouple = mutation({
  args: {
    userId: v.id("users"),
    inviteCode: v.string(),
  },

  handler: async (ctx, args) => {
    const couple = await ctx.db
      .query("couples")
      .filter((q) => q.eq(q.field("inviteCode"), args.inviteCode))
      .first();

    if (!couple) throw new Error("Invalid invite code");

    await ctx.db.patch(couple._id, {
      user2Id: args.userId,
    });

    return couple._id;
  },
});

/**
 * Get current user's couple
 */
export const getMyCouple = query({
  args: {
    userId: v.id("users"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("couples")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), args.userId),
          q.eq(q.field("user2Id"), args.userId)
        )
      )
      .first();
  },
});