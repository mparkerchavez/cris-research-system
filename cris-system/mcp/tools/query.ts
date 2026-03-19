import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { action, query } from "../lib/convex-client.ts";
import { getOpenAIClient } from "../lib/openai-client.ts";

const SEARCH_MODEL = "text-embedding-3-small";
const DEFAULT_LIMIT = 10;

function createJsonResponse(result: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Tool arguments must be an object");
  }

  return value as Record<string, unknown>;
}

function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  return value;
}

type SearchFilters = {
  evidenceType?: string;
  tags?: string[];
};

type VectorSearchResult = {
  _id: string;
  _score: number;
  claimText: string;
  anchorQuote?: string;
  citationDisplay?: string;
  evidenceType?: string;
  sourceId: string;
  tagSlugs: string[];
};

function applySearchFilters(
  results: VectorSearchResult[],
  filters: SearchFilters | undefined,
): VectorSearchResult[] {
  const tagFilters = new Set(filters?.tags ?? []);

  return results.filter((result) => {
    if (filters?.evidenceType && result.evidenceType !== filters.evidenceType) {
      return false;
    }

    if (tagFilters.size > 0) {
      for (const tag of tagFilters) {
        if (!result.tagSlugs.includes(tag)) {
          return false;
        }
      }
    }

    return true;
  });
}

export const queryTools: Tool[] = [
  {
    name: "get_source",
    description: "Return source metadata and all data points for a source.",
    inputSchema: {
      type: "object",
      properties: {
        sourceId: {
          type: "string",
          description: "Convex source document ID.",
        },
      },
      required: ["sourceId"],
    },
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  {
    name: "get_data_point",
    description: "Return a data point with source context and tags.",
    inputSchema: {
      type: "object",
      properties: {
        dataPointId: {
          type: "string",
          description: "Convex data point document ID.",
        },
      },
      required: ["dataPointId"],
    },
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  {
    name: "get_data_point_usage",
    description: "Return downstream usage for a data point across synthesis artifacts.",
    inputSchema: {
      type: "object",
      properties: {
        dataPointId: {
          type: "string",
          description: "Convex data point document ID.",
        },
      },
      required: ["dataPointId"],
    },
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  {
    name: "get_source_usage",
    description: "Return how a source is used across themes, ideas, and talking points.",
    inputSchema: {
      type: "object",
      properties: {
        sourceId: {
          type: "string",
          description: "Convex source document ID.",
        },
      },
      required: ["sourceId"],
    },
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  {
    name: "search_knowledge_base",
    description: "Search data points semantically using vector embeddings.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search text.",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return.",
        },
        filters: {
          type: "object",
          properties: {
            evidenceType: { type: "string" },
            tags: { type: "array" },
          },
        },
      },
      required: ["query"],
    },
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  {
    name: "get_week_data_points",
    description: "Return all data points extracted within an ISO date range.",
    inputSchema: {
      type: "object",
      properties: {
        weekStartDate: {
          type: "string",
          description: "ISO Monday date.",
        },
        weekEndDate: {
          type: "string",
          description: "ISO Sunday date.",
        },
      },
      required: ["weekStartDate", "weekEndDate"],
    },
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
];

export async function handleQueryTool(name: string, rawArgs: unknown) {
  const args = asObject(rawArgs ?? {});

  switch (name) {
    case "get_source": {
      const sourceId = requireString(args.sourceId, "sourceId");
      const result = await query("sources:getSourceWithDataPoints", { sourceId });
      return createJsonResponse(result);
    }

    case "get_data_point": {
      const dataPointId = requireString(args.dataPointId, "dataPointId");
      const result = await query("dataPoints:getDataPointWithContext", {
        dataPointId,
      });
      return createJsonResponse(result);
    }

    case "get_week_data_points": {
      const weekStartDate = requireString(args.weekStartDate, "weekStartDate");
      const weekEndDate = requireString(args.weekEndDate, "weekEndDate");
      const result = await query("dataPoints:getDataPointsByDateRange", {
        weekStartDate,
        weekEndDate,
      });
      return createJsonResponse(result);
    }

    case "get_data_point_usage": {
      const dataPointId = requireString(args.dataPointId, "dataPointId");
      const result = await query("dataPoints:getDataPointUsage", { dataPointId });
      return createJsonResponse(result);
    }

    case "get_source_usage": {
      const sourceId = requireString(args.sourceId, "sourceId");
      const result = await query("sources:getSourceUsage", { sourceId });
      return createJsonResponse(result);
    }

    case "search_knowledge_base": {
      const searchText = requireString(args.query, "query");
      const filters =
        args.filters && typeof args.filters === "object" && !Array.isArray(args.filters)
          ? (args.filters as Record<string, unknown>)
          : undefined;
      const limit =
        typeof args.limit === "number" && !Number.isNaN(args.limit)
          ? args.limit
          : undefined;
      const tagFilters = Array.isArray(filters?.tags)
        ? filters.tags.map((tag) => requireString(tag, "filters.tags[]"))
        : undefined;
      const normalizedFilters = filters
        ? {
            evidenceType:
              typeof filters.evidenceType === "string"
                ? filters.evidenceType
                : undefined,
            tags: tagFilters,
          }
        : undefined;
      const requestedLimit =
        typeof limit === "number" ? Math.max(1, Math.min(Math.floor(limit), 50)) : DEFAULT_LIMIT;
      const vectorSearchLimit = normalizedFilters
        ? Math.min(requestedLimit * 5, 256)
        : requestedLimit;
      const openai = await getOpenAIClient();
      const embeddingResponse = await openai.embeddings.create({
        model: SEARCH_MODEL,
        input: searchText,
      });
      const queryVector = embeddingResponse.data[0]?.embedding;

      if (!queryVector) {
        throw new Error("OpenAI did not return an embedding for the search query.");
      }

      const result = await action<
        { vector: number[]; limit?: number },
        { note: string; results: VectorSearchResult[] }
      >("search:vectorSearchDataPoints", {
        vector: queryVector,
        limit: vectorSearchLimit,
      });
      const filteredResults = applySearchFilters(result.results, normalizedFilters).slice(
        0,
        requestedLimit,
      );

      return createJsonResponse({
        note: result.note,
        filtersApplied: normalizedFilters ?? null,
        results: filteredResults,
      });
    }

    default:
      throw new Error(`Unknown query tool: ${name}`);
  }
}
