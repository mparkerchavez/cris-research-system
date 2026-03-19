import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const migrationInsertTag = internalMutation({
  args: { doc: v.any() },
  returns: v.id("tags"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("tags", args.doc);
  },
});

export const migrationListTagStats = internalQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const tags = await ctx.db.query("tags").collect();
    const dataPointTags = await ctx.db.query("dataPointTags").collect();

    return {
      totalTags: tags.length,
      establishedTags: tags.filter((tag) => tag.category === "established").length,
      emergingTags: tags.filter((tag) => tag.category === "emerging").length,
      retiredTags: tags.filter((tag) => tag.category === "retired").length,
      totalDataPointTagLinks: dataPointTags.length,
    };
  },
});
