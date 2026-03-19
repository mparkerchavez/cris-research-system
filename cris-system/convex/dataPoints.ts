import {
  mutation,
  query,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

async function getNextSequenceNumber(
  ctx: { db: { query: Function } },
  sourceId: Id<"sources">,
): Promise<number> {
  const existing = await ctx.db
    .query("dataPoints")
    .withIndex("by_source", (q: any) => q.eq("sourceId", sourceId))
    .collect();

  const maxSequence = existing.reduce(
    (currentMax: number, dataPoint: Doc<"dataPoints">) =>
      Math.max(currentMax, dataPoint.dpSequenceNumber),
    0,
  );

  return maxSequence + 1;
}

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

export const getExtractionStatusForSource = query({
  args: { sourceId: v.id("sources") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const trackers = await ctx.db
      .query("extractionTracker")
      .withIndex("by_source", (q) => q.eq("sourceId", args.sourceId))
      .collect();

    const ordered = [...trackers].sort((left, right) =>
      right.extractionDate.localeCompare(left.extractionDate),
    );

    return ordered[0] ?? null;
  },
});

export const insertDataPoint = mutation({
  args: {
    sourceId: v.id("sources"),
    claimText: v.string(),
    anchorQuote: v.optional(v.string()),
    curatorInterpretation: v.optional(v.string()),
    citationDisplay: v.optional(v.string()),
    locationType: v.optional(v.string()),
    locationStart: v.optional(v.number()),
    locationEnd: v.optional(v.number()),
    locationSection: v.optional(v.string()),
    locationCharOffset: v.optional(v.number()),
    evidenceType: v.optional(v.string()),
    confidenceScore: v.optional(v.number()),
    normalizationLevel: v.optional(v.number()),
    isControversial: v.optional(v.boolean()),
    extractionDate: v.string(),
    processedDate: v.optional(v.string()),
    embedding: v.optional(v.array(v.float64())),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const dpSequenceNumber = await getNextSequenceNumber(ctx, args.sourceId);
    const dataPointId = await ctx.db.insert("dataPoints", {
      ...args,
      dpSequenceNumber,
    });

    return {
      dataPointId,
      dpSequenceNumber,
    };
  },
});

export const insertDataPointWithTags = mutation({
  args: {
    sourceId: v.id("sources"),
    claimText: v.string(),
    anchorQuote: v.optional(v.string()),
    curatorInterpretation: v.optional(v.string()),
    citationDisplay: v.optional(v.string()),
    locationType: v.optional(v.string()),
    locationStart: v.optional(v.number()),
    locationEnd: v.optional(v.number()),
    locationSection: v.optional(v.string()),
    locationCharOffset: v.optional(v.number()),
    evidenceType: v.optional(v.string()),
    confidenceScore: v.optional(v.number()),
    normalizationLevel: v.optional(v.number()),
    isControversial: v.optional(v.boolean()),
    extractionDate: v.string(),
    processedDate: v.optional(v.string()),
    embedding: v.optional(v.array(v.float64())),
    tagSlugs: v.array(v.string()),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const { tagSlugs, ...dataPointFields } = args;
    const dpSequenceNumber = await getNextSequenceNumber(ctx, args.sourceId);
    const dataPointId = await ctx.db.insert("dataPoints", {
      ...dataPointFields,
      dpSequenceNumber,
    });

    const uniqueTagSlugs = [...new Set(tagSlugs)];
    const tagIds: Array<Id<"tags">> = [];

    for (const slug of uniqueTagSlugs) {
      const tag = await ctx.db
        .query("tags")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (!tag) {
        throw new Error(`Unknown tag slug: ${slug}`);
      }

      await ctx.db.insert("dataPointTags", {
        dataPointId,
        tagId: tag._id,
      });
      tagIds.push(tag._id);
    }

    return {
      dataPointId,
      dpSequenceNumber,
      tagIds,
    };
  },
});

export const insertExtractionTracker = mutation({
  args: {
    sourceId: v.id("sources"),
    originalFilePath: v.optional(v.string()),
    extractionDate: v.string(),
    dataPointCount: v.number(),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  returns: v.id("extractionTracker"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("extractionTracker", args);
  },
});

export const getDataPointWithContext = query({
  args: { dataPointId: v.id("dataPoints") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const dataPoint = await ctx.db.get(args.dataPointId);
    if (!dataPoint) {
      throw new Error("Data point not found");
    }

    const source = await ctx.db.get(dataPoint.sourceId);
    const tags = await getTagsForDataPoint(ctx, dataPoint._id);

    return {
      dataPoint,
      source,
      tags,
    };
  },
});

export const getDataPointsByDateRange = query({
  args: {
    weekStartDate: v.string(),
    weekEndDate: v.string(),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const dataPoints = await ctx.db
      .query("dataPoints")
      .withIndex("by_extractionDate", (q) =>
        q.gte("extractionDate", args.weekStartDate).lte("extractionDate", args.weekEndDate),
      )
      .collect();
    const uniqueSourceIds = [...new Set(dataPoints.map((dataPoint) => dataPoint.sourceId))];
    const sourceMap = new Map(
      (
        await Promise.all(
          uniqueSourceIds.map(async (sourceId) => [sourceId, await ctx.db.get(sourceId)] as const),
        )
      ).filter((entry): entry is readonly [Id<"sources">, NonNullable<(typeof entry)[1]>] =>
        entry[1] !== null,
      ),
    );

    const grouped = new Map<
      string,
      {
        sourceId: Id<"sources">;
        sourceTitle: string;
        dataPoints: Array<Doc<"dataPoints">>;
      }
    >();

    for (const dataPoint of dataPoints) {
      const source = sourceMap.get(dataPoint.sourceId);
      const sourceTitle = source?.title ?? "Unknown source";
      const existingGroup = grouped.get(sourceTitle);

      if (existingGroup) {
        existingGroup.dataPoints.push(dataPoint);
        continue;
      }

      grouped.set(sourceTitle, {
        sourceId: source?._id ?? dataPoint.sourceId,
        sourceTitle,
        dataPoints: [dataPoint],
      });
    }

    return [...grouped.values()]
      .map((group) => ({
        ...group,
        dataPoints: group.dataPoints.sort(
          (left, right) => left.dpSequenceNumber - right.dpSequenceNumber,
        ),
      }))
      .sort((left, right) => left.sourceTitle.localeCompare(right.sourceTitle));
  },
});

export const validateDataPointIds = query({
  args: { dataPointIds: v.array(v.id("dataPoints")) },
  returns: v.any(),
  handler: async (ctx, args) => {
    const existingDataPointIds: Array<Id<"dataPoints">> = [];
    const missingDataPointIds: Array<Id<"dataPoints">> = [];

    for (const dataPointId of args.dataPointIds) {
      const dataPoint = await ctx.db.get(dataPointId);
      if (dataPoint) {
        existingDataPointIds.push(dataPointId);
      } else {
        missingDataPointIds.push(dataPointId);
      }
    }

    return {
      existingDataPointIds,
      missingDataPointIds,
      allValid: missingDataPointIds.length === 0,
    };
  },
});

export const listDataPointsNeedingEmbedding = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.object({
    dataPoints: v.array(
      v.object({
        _id: v.id("dataPoints"),
        claimText: v.string(),
        anchorQuote: v.optional(v.string()),
      }),
    ),
    isDone: v.boolean(),
    nextCursor: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 20, 100));
    const page = await ctx.db
      .query("dataPoints")
      .withIndex("by_embeddingStatus", (q) => q.eq("embeddingStatus", undefined))
      .paginate({
        cursor: args.cursor ?? null,
        numItems: limit,
      });

    return {
      dataPoints: page.page.map((dataPoint) => ({
        _id: dataPoint._id,
        claimText: dataPoint.claimText,
        anchorQuote: dataPoint.anchorQuote,
      })),
      isDone: page.isDone,
      nextCursor: page.isDone ? undefined : page.continueCursor,
    };
  },
});

export const getDataPointUsage = query({
  args: { dataPointId: v.id("dataPoints") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const weeklyThemes = (await ctx.db.query("weeklyThemes").collect()).filter((theme) =>
      theme.citedDataPoints.includes(args.dataPointId),
    );
    const ideaEvidence = (await ctx.db.query("ideaEvidence").collect()).filter((entry) =>
      entry.citedDataPoints.includes(args.dataPointId),
    );
    const ideaCounterarguments = (
      await ctx.db.query("ideaCounterarguments").collect()
    ).filter((entry) => entry.citedDataPoints.includes(args.dataPointId));
    const talkingPointEvidence = (
      await ctx.db.query("talkingPointEvidence").collect()
    ).filter((entry) => entry.citedDataPoints.includes(args.dataPointId));

    return {
      weeklyThemes: await Promise.all(
        weeklyThemes.map(async (theme) => {
          const weeklyLearning = await ctx.db.get(theme.weeklyLearningId);
          return {
            weeklyLearningId: theme.weeklyLearningId,
            weeklyLearningTitle:
              weeklyLearning?.title ??
              `${weeklyLearning?.weekStartDate ?? "Unknown week"} learning`,
            themeTitle: theme.themeTitle,
            relevantText: theme.themeContent,
          };
        }),
      ),
      ideaEvidence: await Promise.all(
        ideaEvidence.map(async (entry) => {
          const idea = await ctx.db.get(entry.ideaId);
          return {
            ideaId: entry.ideaId,
            title: idea?.title ?? "Unknown idea",
            relevantText: entry.evidenceDescription,
          };
        }),
      ),
      ideaCounterarguments: await Promise.all(
        ideaCounterarguments.map(async (entry) => {
          const idea = await ctx.db.get(entry.ideaId);
          return {
            ideaId: entry.ideaId,
            title: idea?.title ?? "Unknown idea",
            relevantText: entry.argument,
          };
        }),
      ),
      talkingPointEvidence: await Promise.all(
        talkingPointEvidence.map(async (entry) => {
          const talkingPoint = await ctx.db.get(entry.talkingPointId);
          return {
            talkingPointId: entry.talkingPointId,
            title: talkingPoint?.title ?? "Unknown talking point",
            relevantText: entry.evidenceText,
          };
        }),
      ),
    };
  },
});

export const setEmbedding = mutation({
  args: {
    dataPointId: v.id("dataPoints"),
    embedding: v.array(v.float64()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.dataPointId, {
      embedding: args.embedding,
      embeddingStatus: "done",
    });
    return null;
  },
});

export const markExistingEmbeddingsAsDone = mutation({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.object({
    updatedCount: v.number(),
    scannedCount: v.number(),
    isDone: v.boolean(),
    nextCursor: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 50, 100));
    const page = await ctx.db
      .query("dataPoints")
      .paginate({
        cursor: args.cursor ?? null,
        numItems: limit,
      });

    let updatedCount = 0;

    for (const dataPoint of page.page) {
      if (dataPoint.embedding === undefined || dataPoint.embeddingStatus === "done") {
        continue;
      }

      await ctx.db.patch(dataPoint._id, {
        embeddingStatus: "done",
      });
      updatedCount += 1;
    }

    return {
      updatedCount,
      scannedCount: page.page.length,
      isDone: page.isDone,
      nextCursor: page.isDone ? undefined : page.continueCursor,
    };
  },
});

export const migrationImportExtraction = internalMutation({
  args: {
    extraction: v.any(),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const dataPointIds: string[] = [];
    let dataPointTagLinkCount = 0;

    for (const dataPoint of args.extraction.dataPoints) {
      const { tagIds = [], ...dataPointDoc } = dataPoint;
      const id = await ctx.db.insert("dataPoints", dataPointDoc);
      dataPointIds.push(id);

      for (const tagId of [...new Set(tagIds)]) {
        await ctx.db.insert("dataPointTags", {
          dataPointId: id,
          tagId,
        });
        dataPointTagLinkCount += 1;
      }
    }

    const extractionTrackerId = await ctx.db.insert("extractionTracker", {
      sourceId: args.extraction.sourceId,
      originalFilePath: args.extraction.originalFilePath,
      extractionDate: args.extraction.extractionDate,
      dataPointCount: args.extraction.dataPoints.length,
      status: "complete",
      notes: args.extraction.notes,
    });

    return {
      extractionTrackerId,
      dataPointIds,
      dataPointTagLinkCount,
    };
  },
});

export const migrationListDataPointStats = internalQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const dataPoints = await ctx.db.query("dataPoints").collect();
    const extractionTrackers = await ctx.db.query("extractionTracker").collect();

    return {
      totalDataPoints: dataPoints.length,
      totalExtractions: extractionTrackers.length,
      averageDataPointsPerExtraction:
        extractionTrackers.length === 0
          ? 0
          : Number((dataPoints.length / extractionTrackers.length).toFixed(2)),
      missingSourceIdCount: dataPoints.filter((dataPoint) => !dataPoint.sourceId)
        .length,
      missingClaimTextCount: dataPoints.filter(
        (dataPoint) => !dataPoint.claimText?.trim(),
      ).length,
      paragraphLocationCount: dataPoints.filter(
        (dataPoint) => dataPoint.locationType === "paragraph",
      ).length,
      pageLocationCount: dataPoints.filter(
        (dataPoint) => dataPoint.locationType === "page",
      ).length,
      totalDataPointTagLinks: (await ctx.db.query("dataPointTags").collect()).length,
    };
  },
});
