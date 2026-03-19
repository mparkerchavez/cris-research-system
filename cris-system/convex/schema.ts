import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  sources: defineTable({
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
  })
    .index("by_status", ["status"])
    .index("by_ingestedDate", ["ingestedDate"])
    .index("by_canonicalUrl", ["canonicalUrl"])
    .searchIndex("search_title", { searchField: "title" }),

  dataPoints: defineTable({
    sourceId: v.id("sources"),
    dpSequenceNumber: v.number(),
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
    embeddingStatus: v.optional(v.string()),
  })
    .index("by_source", ["sourceId"])
    .index("by_extractionDate", ["extractionDate"])
    .index("by_evidenceType", ["evidenceType"])
    .index("by_embeddingStatus", ["embeddingStatus"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["evidenceType"],
    }),

  tags: defineTable({
    name: v.string(),
    slug: v.string(),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
  })
    .index("by_slug", ["slug"]),

  dataPointTags: defineTable({
    dataPointId: v.id("dataPoints"),
    tagId: v.id("tags"),
  })
    .index("by_dataPoint", ["dataPointId"])
    .index("by_tag", ["tagId"]),

  sourceChunks: defineTable({
    sourceId: v.id("sources"),
    chunkText: v.string(),
    chunkSequence: v.number(),
    charOffsetStart: v.number(),
    charOffsetEnd: v.number(),
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_source", ["sourceId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),

  weeklyLearnings: defineTable({
    weekStartDate: v.string(),
    weekEndDate: v.string(),
    title: v.optional(v.string()),
    overview: v.optional(v.string()),
    status: v.string(),
  })
    .index("by_weekStart", ["weekStartDate"])
    .index("by_status", ["status"]),

  weeklyThemes: defineTable({
    weeklyLearningId: v.id("weeklyLearnings"),
    themeTitle: v.string(),
    themeContent: v.string(),
    citedDataPoints: v.array(v.id("dataPoints")),
    orderIndex: v.number(),
  })
    .index("by_weeklyLearning", ["weeklyLearningId"]),

  ideas: defineTable({
    title: v.string(),
    currentPosition: v.string(),
    status: v.string(),
    firstCapturedDate: v.string(),
    lastUpdatedDate: v.string(),
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_status", ["status"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),

  ideaTags: defineTable({
    ideaId: v.id("ideas"),
    tagId: v.id("tags"),
  })
    .index("by_idea", ["ideaId"])
    .index("by_tag", ["tagId"]),

  ideaEvidence: defineTable({
    ideaId: v.id("ideas"),
    evidenceDescription: v.string(),
    citedDataPoints: v.array(v.id("dataPoints")),
    orderIndex: v.number(),
  })
    .index("by_idea", ["ideaId"]),

  ideaCounterarguments: defineTable({
    ideaId: v.id("ideas"),
    argument: v.string(),
    citedDataPoints: v.array(v.id("dataPoints")),
    orderIndex: v.number(),
  })
    .index("by_idea", ["ideaId"]),

  ideaEvolutionLog: defineTable({
    ideaId: v.id("ideas"),
    previousPosition: v.string(),
    changeDescription: v.string(),
    logDate: v.string(),
  })
    .index("by_idea", ["ideaId"]),

  talkingPoints: defineTable({
    title: v.string(),
    coreMessage: v.string(),
    status: v.string(),
    createdDate: v.string(),
  })
    .index("by_status", ["status"]),

  talkingPointAudiences: defineTable({
    talkingPointId: v.id("talkingPoints"),
    audienceName: v.string(),
    audienceConcern: v.string(),
    hook: v.string(),
    orderIndex: v.number(),
  })
    .index("by_talkingPoint", ["talkingPointId"]),

  talkingPointEvidence: defineTable({
    talkingPointId: v.id("talkingPoints"),
    evidenceText: v.string(),
    citedDataPoints: v.array(v.id("dataPoints")),
    orderIndex: v.number(),
  })
    .index("by_talkingPoint", ["talkingPointId"]),

  talkingPointPivotPhrases: defineTable({
    talkingPointId: v.id("talkingPoints"),
    phrase: v.string(),
    context: v.optional(v.string()),
  })
    .index("by_talkingPoint", ["talkingPointId"]),

  languageAssets: defineTable({
    assetType: v.string(),
    title: v.string(),
    description: v.string(),
    usageContext: v.optional(v.string()),
    sourceId: v.id("sources"),
    anchorQuote: v.optional(v.string()),
    citationDisplay: v.optional(v.string()),
    locationCharOffset: v.optional(v.number()),
    status: v.string(),
    extractionWeek: v.optional(v.string()),
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_assetType", ["assetType"])
    .index("by_source", ["sourceId"])
    .index("by_status", ["status"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),

  languageAssetTags: defineTable({
    assetId: v.id("languageAssets"),
    tagId: v.id("tags"),
  })
    .index("by_asset", ["assetId"])
    .index("by_tag", ["tagId"]),

  curatorNotes: defineTable({
    entityType: v.string(),
    entityId: v.string(),
    noteText: v.string(),
    noteType: v.string(),
    contextDescription: v.optional(v.string()),
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_entity", ["entityType", "entityId"])
    .index("by_noteType", ["noteType"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),

  extractionTracker: defineTable({
    sourceId: v.id("sources"),
    originalFilePath: v.optional(v.string()),
    extractionDate: v.string(),
    dataPointCount: v.number(),
    status: v.string(),
    notes: v.optional(v.string()),
  })
    .index("by_source", ["sourceId"])
    .index("by_status", ["status"]),

});
