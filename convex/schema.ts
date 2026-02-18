import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  couples: defineTable({
    user1Id: v.string(), // Better Auth User ID
    user2Id: v.string(), // Better Auth User ID
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