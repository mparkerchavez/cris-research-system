import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { mutation, query } from "../lib/convex-client.ts";

const EXTRACTION_PROMPT = `Extract atomic data points from this source. For each data point:
- claimText: The interpreted insight (1-2 sentences, your words)
- anchorQuote: Verbatim text from the source that supports the claim
- citationDisplay: Human-readable location e.g. "(para. 3)" or "(p. 12)"
- locationType: "paragraph" | "page" | "timestamp" | "section"
- locationStart: The number (paragraph number, page number, etc.)
- evidenceType: "empirical" | "anecdotal" | "framework" | "prediction" | "case_study" | "expert_opinion" | "data_metric"
- tags: Array of tag slugs from the CRIS tag vocabulary
Return as JSON array. Aim for 15-25 data points per source.`;

type ExtractionInput = {
  claimText: string;
  anchorQuote?: string;
  citationDisplay?: string;
  locationType?: string;
  locationStart?: number;
  evidenceType?: string;
  tags: string[];
};

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

  return value.trim();
}

function optionalBoolean(value: unknown, fieldName: string, defaultValue: boolean) {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "boolean") {
    throw new Error(`${fieldName} must be a boolean`);
  }

  return value;
}

function optionalString(value: unknown, fieldName: string): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string when provided`);
  }

  return value.trim();
}

function optionalNumber(value: unknown, fieldName: string): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${fieldName} must be a number when provided`);
  }

  return value;
}

function parseDataPoints(value: unknown): ExtractionInput[] {
  if (!Array.isArray(value)) {
    throw new Error("dataPoints must be an array");
  }

  return value.map((item, index) => {
    const entry = asObject(item);
    const tags = entry.tags;

    if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
      throw new Error(`dataPoints[${index}].tags must be an array of strings`);
    }

    return {
      claimText: requireString(entry.claimText, `dataPoints[${index}].claimText`),
      anchorQuote: optionalString(
        entry.anchorQuote,
        `dataPoints[${index}].anchorQuote`,
      ),
      citationDisplay: optionalString(
        entry.citationDisplay,
        `dataPoints[${index}].citationDisplay`,
      ),
      locationType: optionalString(
        entry.locationType,
        `dataPoints[${index}].locationType`,
      ),
      locationStart: optionalNumber(
        entry.locationStart,
        `dataPoints[${index}].locationStart`,
      ),
      evidenceType: optionalString(
        entry.evidenceType,
        `dataPoints[${index}].evidenceType`,
      ),
      tags,
    };
  });
}

export const extractionTools: Tool[] = [
  {
    name: "extract_data_points",
    description: "Return source text and the extraction prompt for manual extraction.",
    inputSchema: {
      type: "object",
      properties: {
        sourceId: {
          type: "string",
          description: "Convex source document ID.",
        },
        forceReExtract: {
          type: "boolean",
          description: "Ignore prior extraction status when true.",
        },
      },
      required: ["sourceId"],
    },
  },
  {
    name: "save_data_points",
    description: "Persist extracted data points, tag links, and extraction tracking.",
    inputSchema: {
      type: "object",
      properties: {
        sourceId: {
          type: "string",
          description: "Convex source document ID.",
        },
        dataPoints: {
          type: "array",
          description: "Extracted data point objects following the CRIS spec.",
        },
      },
      required: ["sourceId", "dataPoints"],
    },
  },
];

export async function handleExtractionTool(name: string, rawArgs: unknown) {
  const args = asObject(rawArgs ?? {});

  switch (name) {
    case "extract_data_points": {
      const sourceId = requireString(args.sourceId, "sourceId");
      const forceReExtract = optionalBoolean(
        args.forceReExtract,
        "forceReExtract",
        false,
      );
      const source = await query<{ sourceId: string }, any>("sources:getSourceById", {
        sourceId,
      });

      if (!source) {
        throw new Error("Source not found");
      }

      const existingTracker = await query<{ sourceId: string }, any>(
        "dataPoints:getExtractionStatusForSource",
        { sourceId },
      );

      if (existingTracker && !forceReExtract) {
        return createJsonResponse({
          warning: "Source has already been extracted. Re-run with forceReExtract=true to continue.",
          sourceId,
          extractionTracker: existingTracker,
        });
      }

      if (!source.fullText) {
        throw new Error("Source does not contain fullText");
      }

      return createJsonResponse({
        sourceId,
        title: source.title,
        fullText: source.fullText,
        extractionPrompt: EXTRACTION_PROMPT,
      });
    }

    case "save_data_points": {
      const sourceId = requireString(args.sourceId, "sourceId");
      const dataPoints = parseDataPoints(args.dataPoints);
      const extractionDate = new Date().toISOString().slice(0, 10);
      const dataPointIds: string[] = [];

      for (const dataPoint of dataPoints) {
        const result = await mutation("dataPoints:insertDataPointWithTags", {
          sourceId,
          claimText: dataPoint.claimText,
          anchorQuote: dataPoint.anchorQuote,
          citationDisplay: dataPoint.citationDisplay,
          locationType: dataPoint.locationType,
          locationStart: dataPoint.locationStart,
          evidenceType: dataPoint.evidenceType,
          extractionDate,
          tagSlugs: dataPoint.tags,
        });

        dataPointIds.push(result.dataPointId);
      }

      const source = await query<{ sourceId: string }, any>("sources:getSourceById", {
        sourceId,
      });

      const extractionTrackerId = await mutation("dataPoints:insertExtractionTracker", {
        sourceId,
        originalFilePath: source?.originalFilePath,
        extractionDate,
        dataPointCount: dataPoints.length,
        status: "complete",
      });

      await mutation("sources:updateSourceStatus", {
        sourceId,
        status: "extracted",
      });

      return createJsonResponse({
        saved: dataPoints.length,
        dataPointIds,
        extractionTrackerId,
      });
    }

    default:
      throw new Error(`Unknown extraction tool: ${name}`);
  }
}
