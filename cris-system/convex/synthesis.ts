import { mutation, internalMutation, internalQuery } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";

async function replaceIdeaTags(
  ctx: { db: { query: Function; delete: Function; insert: Function } },
  ideaId: Id<"ideas">,
  tagSlugs: string[],
) {
  const existingTags = await ctx.db
    .query("ideaTags")
    .withIndex("by_idea", (q: any) => q.eq("ideaId", ideaId))
    .collect();
  for (const link of existingTags) {
    await ctx.db.delete(link._id);
  }

  for (const slug of [...new Set(tagSlugs)]) {
    const tag = await ctx.db
      .query("tags")
      .withIndex("by_slug", (q: any) => q.eq("slug", slug))
      .unique();

    if (!tag) {
      throw new Error(`Unknown tag slug: ${slug}`);
    }

    await ctx.db.insert("ideaTags", {
      ideaId,
      tagId: tag._id,
    });
  }
}

async function replaceIdeaEvidence(
  ctx: { db: { query: Function; delete: Function; insert: Function } },
  ideaId: Id<"ideas">,
  evidence: Array<{
    evidenceDescription: string;
    citedDataPointIds: Array<Id<"dataPoints">>;
  }>,
) {
  const existing = await ctx.db
    .query("ideaEvidence")
    .withIndex("by_idea", (q: any) => q.eq("ideaId", ideaId))
    .collect();
  for (const record of existing) {
    await ctx.db.delete(record._id);
  }

  for (const [index, entry] of evidence.entries()) {
    await ctx.db.insert("ideaEvidence", {
      ideaId,
      evidenceDescription: entry.evidenceDescription,
      citedDataPoints: entry.citedDataPointIds,
      orderIndex: index,
    });
  }
}

async function replaceIdeaCounterarguments(
  ctx: { db: { query: Function; delete: Function; insert: Function } },
  ideaId: Id<"ideas">,
  counterarguments: Array<{
    argument: string;
    citedDataPointIds: Array<Id<"dataPoints">>;
  }>,
) {
  const existing = await ctx.db
    .query("ideaCounterarguments")
    .withIndex("by_idea", (q: any) => q.eq("ideaId", ideaId))
    .collect();
  for (const record of existing) {
    await ctx.db.delete(record._id);
  }

  for (const [index, entry] of counterarguments.entries()) {
    await ctx.db.insert("ideaCounterarguments", {
      ideaId,
      argument: entry.argument,
      citedDataPoints: entry.citedDataPointIds,
      orderIndex: index,
    });
  }
}

async function replaceTalkingPointAudiences(
  ctx: { db: { query: Function; delete: Function; insert: Function } },
  talkingPointId: Id<"talkingPoints">,
  audiences: Array<{
    audienceName: string;
    audienceConcern: string;
    hook: string;
  }>,
) {
  const existing = await ctx.db
    .query("talkingPointAudiences")
    .withIndex("by_talkingPoint", (q: any) => q.eq("talkingPointId", talkingPointId))
    .collect();
  for (const record of existing) {
    await ctx.db.delete(record._id);
  }

  for (const [index, audience] of audiences.entries()) {
    await ctx.db.insert("talkingPointAudiences", {
      talkingPointId,
      audienceName: audience.audienceName,
      audienceConcern: audience.audienceConcern,
      hook: audience.hook,
      orderIndex: index,
    });
  }
}

async function replaceTalkingPointEvidence(
  ctx: { db: { query: Function; delete: Function; insert: Function } },
  talkingPointId: Id<"talkingPoints">,
  evidence: Array<{
    evidenceText: string;
    citedDataPointIds: Array<Id<"dataPoints">>;
  }>,
) {
  const existing = await ctx.db
    .query("talkingPointEvidence")
    .withIndex("by_talkingPoint", (q: any) => q.eq("talkingPointId", talkingPointId))
    .collect();
  for (const record of existing) {
    await ctx.db.delete(record._id);
  }

  for (const [index, entry] of evidence.entries()) {
    await ctx.db.insert("talkingPointEvidence", {
      talkingPointId,
      evidenceText: entry.evidenceText,
      citedDataPoints: entry.citedDataPointIds,
      orderIndex: index,
    });
  }
}

async function replaceTalkingPointPivotPhrases(
  ctx: { db: { query: Function; delete: Function; insert: Function } },
  talkingPointId: Id<"talkingPoints">,
  pivotPhrases: Array<{ phrase: string; context?: string }>,
) {
  const existing = await ctx.db
    .query("talkingPointPivotPhrases")
    .withIndex("by_talkingPoint", (q: any) => q.eq("talkingPointId", talkingPointId))
    .collect();
  for (const record of existing) {
    await ctx.db.delete(record._id);
  }

  for (const phrase of pivotPhrases) {
    await ctx.db.insert("talkingPointPivotPhrases", {
      talkingPointId,
      phrase: phrase.phrase,
      context: phrase.context,
    });
  }
}

export const insertWeeklyLearning = mutation({
  args: {
    weekStartDate: v.string(),
    weekEndDate: v.string(),
    title: v.optional(v.string()),
    overview: v.optional(v.string()),
    themes: v.array(
      v.object({
        themeTitle: v.string(),
        themeContent: v.string(),
        citedDataPointIds: v.array(v.id("dataPoints")),
      }),
    ),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const weeklyLearningId = await ctx.db.insert("weeklyLearnings", {
      weekStartDate: args.weekStartDate,
      weekEndDate: args.weekEndDate,
      title: args.title,
      overview: args.overview,
      status: "published",
    });

    const weeklyThemeIds = [];
    for (const [index, theme] of args.themes.entries()) {
      const weeklyThemeId = await ctx.db.insert("weeklyThemes", {
        weeklyLearningId,
        themeTitle: theme.themeTitle,
        themeContent: theme.themeContent,
        citedDataPoints: theme.citedDataPointIds,
        orderIndex: index,
      });
      weeklyThemeIds.push(weeklyThemeId);
    }

    return {
      weeklyLearningId,
      weeklyThemeIds,
    };
  },
});

export const upsertIdea = mutation({
  args: {
    ideaId: v.optional(v.id("ideas")),
    title: v.string(),
    currentPosition: v.string(),
    status: v.string(),
    tags: v.array(v.string()),
    evidence: v.array(
      v.object({
        evidenceDescription: v.string(),
        citedDataPointIds: v.array(v.id("dataPoints")),
      }),
    ),
    counterarguments: v.array(
      v.object({
        argument: v.string(),
        citedDataPointIds: v.array(v.id("dataPoints")),
      }),
    ),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const now = new Date().toISOString().slice(0, 10);
    let ideaId = args.ideaId;

    if (ideaId) {
      const existingIdea = await ctx.db.get(ideaId);
      if (!existingIdea) {
        throw new Error("Idea not found");
      }

      await ctx.db.insert("ideaEvolutionLog", {
        ideaId,
        previousPosition: existingIdea.currentPosition,
        changeDescription: "Updated via MCP",
        logDate: now,
      });

      await ctx.db.patch(ideaId, {
        title: args.title,
        currentPosition: args.currentPosition,
        status: args.status,
        lastUpdatedDate: now,
      });
    } else {
      ideaId = await ctx.db.insert("ideas", {
        title: args.title,
        currentPosition: args.currentPosition,
        status: args.status,
        firstCapturedDate: now,
        lastUpdatedDate: now,
      });
    }

    await replaceIdeaTags(ctx, ideaId, args.tags);
    await replaceIdeaEvidence(ctx, ideaId, args.evidence);
    await replaceIdeaCounterarguments(ctx, ideaId, args.counterarguments);

    return { ideaId };
  },
});

export const upsertTalkingPoint = mutation({
  args: {
    talkingPointId: v.optional(v.id("talkingPoints")),
    title: v.string(),
    coreMessage: v.string(),
    audiences: v.array(
      v.object({
        audienceName: v.string(),
        audienceConcern: v.string(),
        hook: v.string(),
      }),
    ),
    evidence: v.array(
      v.object({
        evidenceText: v.string(),
        citedDataPointIds: v.array(v.id("dataPoints")),
      }),
    ),
    pivotPhrases: v.array(
      v.object({
        phrase: v.string(),
        context: v.optional(v.string()),
      }),
    ),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const now = new Date().toISOString().slice(0, 10);
    let talkingPointId = args.talkingPointId;

    if (talkingPointId) {
      const existingTalkingPoint = await ctx.db.get(talkingPointId);
      if (!existingTalkingPoint) {
        throw new Error("Talking point not found");
      }

      await ctx.db.patch(talkingPointId, {
        title: args.title,
        coreMessage: args.coreMessage,
      });
    } else {
      talkingPointId = await ctx.db.insert("talkingPoints", {
        title: args.title,
        coreMessage: args.coreMessage,
        status: "active",
        createdDate: now,
      });
    }

    await replaceTalkingPointAudiences(ctx, talkingPointId, args.audiences);
    await replaceTalkingPointEvidence(ctx, talkingPointId, args.evidence);
    await replaceTalkingPointPivotPhrases(ctx, talkingPointId, args.pivotPhrases);

    return { talkingPointId };
  },
});

export const migrationImportWeeklyLearning = internalMutation({
  args: {
    weeklyLearning: v.any(),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const weeklyLearningId = await ctx.db.insert("weeklyLearnings", {
      weekStartDate: args.weeklyLearning.weekStartDate,
      weekEndDate: args.weeklyLearning.weekEndDate,
      title: args.weeklyLearning.title,
      overview: args.weeklyLearning.overview,
      status: "published",
    });

    const weeklyThemeIds: string[] = [];
    for (const theme of args.weeklyLearning.themes) {
      const id = await ctx.db.insert("weeklyThemes", {
        weeklyLearningId,
        themeTitle: theme.themeTitle,
        themeContent: theme.themeContent,
        citedDataPoints: theme.citedDataPoints,
        orderIndex: theme.orderIndex,
      });
      weeklyThemeIds.push(id);
    }

    return {
      weeklyLearningId,
      weeklyThemeIds,
    };
  },
});

export const migrationListWeeklyStats = internalQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const weeklyLearnings = await ctx.db.query("weeklyLearnings").collect();
    const weeklyThemes = await ctx.db.query("weeklyThemes").collect();

    return {
      totalWeeklyLearnings: weeklyLearnings.length,
      totalWeeklyThemes: weeklyThemes.length,
      themesWithZeroCitations: weeklyThemes.filter(
        (theme) => theme.citedDataPoints.length === 0,
      ).length,
    };
  },
});
