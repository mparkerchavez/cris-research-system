import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

async function getTagsForDataPoint(
  ctx: { db: { query: Function; get: Function } },
  dataPointId: Id<"dataPoints">,
): Promise<Array<Doc<"tags">>> {
  const links = await ctx.db
    .query("dataPointTags")
    .withIndex("by_dataPoint", (q: any) => q.eq("dataPointId", dataPointId))
    .collect();

  const tags = await Promise.all(
    links.map((link: Doc<"dataPointTags">) => ctx.db.get(link.tagId)),
  );

  return tags.filter((tag): tag is Doc<"tags"> => tag !== null);
}

export const findSourceByContentHash = query({
  args: { contentHash: v.string() },
  returns: v.any(),
  handler: async (ctx, args) => {
    const sources = await ctx.db.query("sources").collect();
    return sources.find((source) => source.contentHash === args.contentHash) ?? null;
  },
});

export const getSourceById = query({
  args: { sourceId: v.id("sources") },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sourceId);
  },
});

export const insertSource = mutation({
  args: {
    title: v.string(),
    authorName: v.optional(v.string()),
    authorUrl: v.optional(v.string()),
    publisherName: v.optional(v.string()),
    publisherUrl: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    publishedDate: v.optional(v.string()),
    sourceType: v.string(),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    fullText: v.optional(v.string()),
    fullTextFormat: v.optional(v.string()),
    contentHash: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    storageId: v.optional(v.id("_storage")),
    ingestedDate: v.string(),
    originalFilePath: v.optional(v.string()),
    status: v.string(),
  },
  returns: v.id("sources"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("sources", args);
  },
});

export const getSourceWithDataPoints = query({
  args: { sourceId: v.id("sources") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const source = await ctx.db.get(args.sourceId);
    if (!source) {
      throw new Error("Source not found");
    }

    const dataPoints = await ctx.db
      .query("dataPoints")
      .withIndex("by_source", (q) => q.eq("sourceId", args.sourceId))
      .collect();

    const orderedDataPoints = [...dataPoints].sort(
      (left, right) => left.dpSequenceNumber - right.dpSequenceNumber,
    );

    const enrichedDataPoints = await Promise.all(
      orderedDataPoints.map(async (dataPoint) => ({
        ...dataPoint,
        tags: await getTagsForDataPoint(ctx, dataPoint._id),
      })),
    );

    return {
      source,
      dataPoints: enrichedDataPoints,
    };
  },
});

export const updateSourceStatus = mutation({
  args: {
    sourceId: v.id("sources"),
    status: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sourceId, { status: args.status });
    return null;
  },
});

export const generateSourceUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getSourceUsage = query({
  args: { sourceId: v.id("sources") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const source = await ctx.db.get(args.sourceId);
    if (!source) {
      throw new Error("Source not found");
    }

    const dataPoints = await ctx.db
      .query("dataPoints")
      .withIndex("by_source", (q) => q.eq("sourceId", args.sourceId))
      .collect();
    const dataPointIds = new Set(dataPoints.map((dataPoint) => dataPoint._id));

    const weeklyThemes = (await ctx.db.query("weeklyThemes").collect()).filter((theme) =>
      theme.citedDataPoints.some((dataPointId) => dataPointIds.has(dataPointId)),
    );
    const ideaEvidence = (await ctx.db.query("ideaEvidence").collect()).filter((entry) =>
      entry.citedDataPoints.some((dataPointId) => dataPointIds.has(dataPointId)),
    );
    const talkingPointEvidence = (
      await ctx.db.query("talkingPointEvidence").collect()
    ).filter((entry) =>
      entry.citedDataPoints.some((dataPointId) => dataPointIds.has(dataPointId)),
    );

    const ideas = new Map<string, { ideaId: Id<"ideas">; title: string }>();
    for (const evidence of ideaEvidence) {
      const idea = await ctx.db.get(evidence.ideaId);
      if (idea) {
        ideas.set(idea._id, { ideaId: idea._id, title: idea.title });
      }
    }

    const talkingPoints = new Map<
      string,
      { talkingPointId: Id<"talkingPoints">; title: string }
    >();
    for (const evidence of talkingPointEvidence) {
      const talkingPoint = await ctx.db.get(evidence.talkingPointId);
      if (talkingPoint) {
        talkingPoints.set(talkingPoint._id, {
          talkingPointId: talkingPoint._id,
          title: talkingPoint.title,
        });
      }
    }

    return {
      sourceId: args.sourceId,
      title: source.title,
      counts: {
        weeklyThemes: weeklyThemes.reduce(
          (count, theme) =>
            count +
            theme.citedDataPoints.filter((dataPointId) => dataPointIds.has(dataPointId))
              .length,
          0,
        ),
        ideaEvidence: ideaEvidence.reduce(
          (count, evidence) =>
            count +
            evidence.citedDataPoints.filter((dataPointId) => dataPointIds.has(dataPointId))
              .length,
          0,
        ),
        talkingPointEvidence: talkingPointEvidence.reduce(
          (count, evidence) =>
            count +
            evidence.citedDataPoints.filter((dataPointId) => dataPointIds.has(dataPointId))
              .length,
          0,
        ),
      },
      ideas: [...ideas.values()].sort((left, right) =>
        left.title.localeCompare(right.title),
      ),
      talkingPoints: [...talkingPoints.values()].sort((left, right) =>
        left.title.localeCompare(right.title),
      ),
    };
  },
});

export const migrationInsertSource = internalMutation({
  args: { doc: v.any() },
  returns: v.id("sources"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("sources", args.doc);
  },
});

export const migrationListSourceStats = internalQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const sources = await ctx.db.query("sources").collect();
    const canonicalUrlCounts = new Map<string, number>();

    for (const source of sources) {
      if (!source.canonicalUrl) {
        continue;
      }
      canonicalUrlCounts.set(
        source.canonicalUrl,
        (canonicalUrlCounts.get(source.canonicalUrl) ?? 0) + 1,
      );
    }

    const duplicateCanonicalUrlCount = [...canonicalUrlCounts.values()].filter(
      (count) => count > 1,
    ).length;

    return {
      totalSources: sources.length,
      markdownBackedSources: sources.filter(
        (source) => source.fullTextFormat === "markdown",
      ).length,
      pdfBackedSources: sources.filter(
        (source) => source.originalFilePath?.toLowerCase().endsWith(".pdf"),
      ).length,
      extractedSources: sources.filter((source) => source.status === "extracted")
        .length,
      indexedSources: sources.filter((source) => source.status === "indexed")
        .length,
      duplicateCanonicalUrlCount,
    };
  },
});
