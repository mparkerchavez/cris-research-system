import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addNote = mutation({
  args: {
    entityType: v.string(),
    entityId: v.string(),
    noteText: v.string(),
    noteType: v.string(),
    contextDescription: v.optional(v.string()),
  },
  returns: v.id("curatorNotes"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("curatorNotes", args);
  },
});
