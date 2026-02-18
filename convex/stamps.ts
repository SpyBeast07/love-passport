import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Insert some default stamp templates
 */
export const seedStamps = mutation({
  handler: async (ctx) => {
    const stamps = [
      {
        title: "Honmei Chocolate Night",
        description: "Make premium homemade chocolate together",
        country: "Japan",
        icon: "🍫",
      },
      {
        title: "Dance Lesson Night",
        description: "Learn a simple samba step together",
        country: "Brazil",
        icon: "💃",
      },
      {
        title: "Edible Bouquet Date",
        description: "Create a bouquet of chocolates or macarons",
        country: "France",
        icon: "🌸",
      },
    ];

    for (const stamp of stamps) {
      await ctx.db.insert("stampTemplates", stamp);
    }

    return "Seeded successfully!";
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Fetch all stamp templates
 */
export const listTemplates = query({
  handler: async (ctx) => {
    return await ctx.db.query("stampTemplates").collect();
  },
});

/**
 * Redeem a stamp for a couple
 */
/**
 * Redeem a stamp for a couple
 */
export const redeemStamp = mutation({
  args: {
    stampId: v.id("stampTemplates"),
    storageId: v.optional(v.id("_storage")),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const userId = identity.subject;

    // Find the user's couple
    let couple = await ctx.db
      .query("couples")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), userId),
          q.eq(q.field("user2Id"), userId)
        )
      )
      .first();

    // If no couple, create one automatically
    if (!couple) {
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const coupleId = await ctx.db.insert("couples", {
        user1Id: userId,
        user2Id: userId,
        inviteCode,
      });
      // Fetch the newly created couple object to get _id securely
      const newCouple = await ctx.db.get(coupleId);
      if (!newCouple) throw new Error("Failed to create couple");
      couple = newCouple;
    }

    await ctx.db.insert("redeemedStamps", {
      coupleId: couple._id,
      stampId: args.stampId,
      storageId: args.storageId,
      redeemedAt: Date.now(),
    });
  },
});

/**
 * Get redeemed stamps for a couple
 */
export const listRedeemed = query({
  args: {},

  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const userId = identity.subject;

    // Find user's couple
    const couple = await ctx.db
      .query("couples")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), userId),
          q.eq(q.field("user2Id"), userId)
        )
      )
      .first();

    if (!couple) return [];

    const redeemed = await ctx.db
      .query("redeemedStamps")
      .filter((q) => q.eq(q.field("coupleId"), couple._id))
      .collect();

    // Join with stamp templates
    const result = [];

    for (const r of redeemed) {
      const stamp = await ctx.db.get(r.stampId);

      if (stamp) {
        const imageUrl = r.storageId
          ? await ctx.storage.getUrl(r.storageId)
          : null;

        result.push({
          ...stamp,
          _id: r._id, // Use the redemption ID as the unique key
          stampId: stamp._id, // Keep reference to template ID
          imageUrl,
          redeemedAt: r.redeemedAt,
        });
      }
    }

    return result;
  },
});