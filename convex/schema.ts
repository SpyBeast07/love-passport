import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  couples: defineTable({
    user1Id: v.id("users"),
    user2Id: v.id("users"),
    inviteCode: v.string(),
  }),

  stampTemplates: defineTable({
    title: v.string(),
    description: v.string(),
    country: v.string(),
    icon: v.string(),
  }),

  redeemedStamps: defineTable({
    coupleId: v.id("couples"),
    stampId: v.id("stampTemplates"),
    storageId: v.optional(v.id("_storage")),
    note: v.optional(v.string()),
    redeemedAt: v.number(),
  }),
});