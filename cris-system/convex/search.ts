import { internal } from "./_generated/api";
import { action, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";

export const getVectorSearchDataPointsByIds = internalQuery({
  args: {
    dataPointIds: v.array(v.id("dataPoints")),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const results = [];

    for (const dataPointId of args.dataPointIds) {
      const dataPoint = await ctx.db.get(dataPointId);
      if (!dataPoint) {
        continue;
      }

      const tagLinks = await ctx.db
        .query("dataPointTags")
        .withIndex("by_dataPoint", (q) => q.eq("dataPointId", dataPoint._id))
        .collect();
      const tags = (
        await Promise.all(tagLinks.map((link) => ctx.db.get(link.tagId)))
      ).filter((tag): tag is NonNullable<typeof tag> => tag !== null);

      results.push({
        _id: dataPoint._id,
        claimText: dataPoint.claimText,
        anchorQuote: dataPoint.anchorQuote,
        citationDisplay: dataPoint.citationDisplay,
        evidenceType: dataPoint.evidenceType,
        sourceId: dataPoint.sourceId,
        tagSlugs: tags.map((tag) => tag.slug),
      });
    }

    return results;
  },
});

export const vectorSearchDataPoints = action({
  args: {
    vector: v.array(v.float64()),
    limit: v.optional(v.number()),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 10, 256));
    const matches = await ctx.vectorSearch("dataPoints", "by_embedding", {
      vector: args.vector,
      limit,
    });
    const hydratedResults = await ctx.runQuery(internal.search.getVectorSearchDataPointsByIds, {
      dataPointIds: matches.map((match) => match._id),
    });
    const scoreById = new Map(matches.map((match) => [match._id, match._score]));
    const results = hydratedResults.map((result) => ({
      ...result,
      _score: scoreById.get(result._id) ?? 0,
    }));

    return {
      note: "Using Convex vector search over embedded data points.",
      results,
    };
  },
});

export const searchKnowledgeBase = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
    filters: v.optional(
      v.object({
        evidenceType: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
      }),
    ),
  },
  returns: v.any(),
  handler: async (_ctx, _args) => {
    return {
      note: "Deprecated fallback. Use search:vectorSearchDataPoints via the MCP search_knowledge_base tool.",
      results: [],
    };
  },
});
