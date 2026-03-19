import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { mutation, query } from "../lib/convex-client.ts";

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

function optionalString(value: unknown, fieldName: string): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string when provided`);
  }

  return value.trim();
}

function stringArray(value: unknown, fieldName: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return value.map((item, index) => requireString(item, `${fieldName}[${index}]`));
}

async function validateDataPointIds(dataPointIds: string[]) {
  if (dataPointIds.length === 0) {
    return;
  }

  const validation = await query("dataPoints:validateDataPointIds", {
    dataPointIds,
  });
  if (!validation.allValid) {
    throw new Error(
      `Invalid citedDataPointIds: ${validation.missingDataPointIds.join(", ")}`,
    );
  }
}

export const synthesisTools: Tool[] = [
  {
    name: "create_weekly_learning",
    description: "Create a weekly learning and its ordered themes.",
    inputSchema: {
      type: "object",
      properties: {
        weekStartDate: { type: "string" },
        weekEndDate: { type: "string" },
        title: { type: "string" },
        overview: { type: "string" },
        themes: { type: "array" },
      },
      required: ["weekStartDate", "weekEndDate", "themes"],
    },
  },
  {
    name: "update_idea",
    description: "Create or update an idea with evidence and counterarguments.",
    inputSchema: {
      type: "object",
      properties: {
        ideaId: { type: "string" },
        title: { type: "string" },
        currentPosition: { type: "string" },
        status: { type: "string" },
        tags: { type: "array" },
        evidence: { type: "array" },
        counterarguments: { type: "array" },
      },
      required: ["title", "currentPosition", "evidence"],
    },
  },
  {
    name: "update_talking_point",
    description: "Create or update a talking point with audiences, evidence, and pivots.",
    inputSchema: {
      type: "object",
      properties: {
        talkingPointId: { type: "string" },
        title: { type: "string" },
        coreMessage: { type: "string" },
        audiences: { type: "array" },
        evidence: { type: "array" },
        pivotPhrases: { type: "array" },
      },
      required: ["title", "coreMessage", "audiences", "evidence"],
    },
  },
  {
    name: "add_curator_note",
    description: "Add an immutable curator note to a CRIS entity.",
    inputSchema: {
      type: "object",
      properties: {
        entityType: { type: "string" },
        entityId: { type: "string" },
        noteText: { type: "string" },
        noteType: { type: "string" },
      },
      required: ["entityType", "entityId", "noteText", "noteType"],
    },
  },
];

export async function handleSynthesisTool(name: string, rawArgs: unknown) {
  const args = asObject(rawArgs ?? {});

  switch (name) {
    case "create_weekly_learning": {
      const weekStartDate = requireString(args.weekStartDate, "weekStartDate");
      const weekEndDate = requireString(args.weekEndDate, "weekEndDate");
      if (!Array.isArray(args.themes)) {
        throw new Error("themes must be an array");
      }

      const themes = args.themes.map((item, index) => {
        const theme = asObject(item);
        return {
          themeTitle: requireString(theme.themeTitle, `themes[${index}].themeTitle`),
          themeContent: requireString(
            theme.themeContent,
            `themes[${index}].themeContent`,
          ),
          citedDataPointIds: stringArray(
            theme.citedDataPointIds,
            `themes[${index}].citedDataPointIds`,
          ),
        };
      });

      await validateDataPointIds(
        themes.flatMap((theme) => theme.citedDataPointIds),
      );

      const result = await mutation("synthesis:insertWeeklyLearning", {
        weekStartDate,
        weekEndDate,
        title: optionalString(args.title, "title"),
        overview: optionalString(args.overview, "overview"),
        themes,
      });
      return createJsonResponse({ weeklyLearningId: result.weeklyLearningId });
    }

    case "update_idea": {
      const evidence = Array.isArray(args.evidence) ? args.evidence : null;
      if (!evidence) {
        throw new Error("evidence must be an array");
      }

      const parsedEvidence = evidence.map((item, index) => {
        const entry = asObject(item);
        return {
          evidenceDescription: requireString(
            entry.evidenceDescription,
            `evidence[${index}].evidenceDescription`,
          ),
          citedDataPointIds: stringArray(
            entry.citedDataPointIds,
            `evidence[${index}].citedDataPointIds`,
          ),
        };
      });

      const counterargumentsInput = Array.isArray(args.counterarguments)
        ? args.counterarguments
        : [];
      const parsedCounterarguments = counterargumentsInput.map((item, index) => {
        const entry = asObject(item);
        return {
          argument: requireString(entry.argument, `counterarguments[${index}].argument`),
          citedDataPointIds: stringArray(
            entry.citedDataPointIds,
            `counterarguments[${index}].citedDataPointIds`,
          ),
        };
      });

      await validateDataPointIds([
        ...parsedEvidence.flatMap((entry) => entry.citedDataPointIds),
        ...parsedCounterarguments.flatMap((entry) => entry.citedDataPointIds),
      ]);

      const result = await mutation("synthesis:upsertIdea", {
        ideaId: optionalString(args.ideaId, "ideaId"),
        title: requireString(args.title, "title"),
        currentPosition: requireString(args.currentPosition, "currentPosition"),
        status: optionalString(args.status, "status") ?? "active",
        tags: Array.isArray(args.tags) ? stringArray(args.tags, "tags") : [],
        evidence: parsedEvidence,
        counterarguments: parsedCounterarguments,
      });

      return createJsonResponse(result);
    }

    case "update_talking_point": {
      const audiences = Array.isArray(args.audiences) ? args.audiences : null;
      const evidence = Array.isArray(args.evidence) ? args.evidence : null;
      if (!audiences) {
        throw new Error("audiences must be an array");
      }
      if (!evidence) {
        throw new Error("evidence must be an array");
      }

      const parsedAudiences = audiences.map((item, index) => {
        const audience = asObject(item);
        return {
          audienceName: requireString(
            audience.audienceName,
            `audiences[${index}].audienceName`,
          ),
          audienceConcern: requireString(
            audience.audienceConcern,
            `audiences[${index}].audienceConcern`,
          ),
          hook: requireString(audience.hook, `audiences[${index}].hook`),
        };
      });

      const parsedEvidence = evidence.map((item, index) => {
        const entry = asObject(item);
        return {
          evidenceText: requireString(
            entry.evidenceText,
            `evidence[${index}].evidenceText`,
          ),
          citedDataPointIds: stringArray(
            entry.citedDataPointIds,
            `evidence[${index}].citedDataPointIds`,
          ),
        };
      });

      const pivotPhraseInput = Array.isArray(args.pivotPhrases)
        ? args.pivotPhrases
        : [];
      const pivotPhrases = pivotPhraseInput.map((item, index) => {
        const phrase = asObject(item);
        return {
          phrase: requireString(phrase.phrase, `pivotPhrases[${index}].phrase`),
          context: optionalString(phrase.context, `pivotPhrases[${index}].context`),
        };
      });

      await validateDataPointIds(
        parsedEvidence.flatMap((entry) => entry.citedDataPointIds),
      );

      const result = await mutation("synthesis:upsertTalkingPoint", {
        talkingPointId: optionalString(args.talkingPointId, "talkingPointId"),
        title: requireString(args.title, "title"),
        coreMessage: requireString(args.coreMessage, "coreMessage"),
        audiences: parsedAudiences,
        evidence: parsedEvidence,
        pivotPhrases,
      });

      return createJsonResponse(result);
    }

    case "add_curator_note": {
      const noteId = await mutation("curatorNotes:addNote", {
        entityType: requireString(args.entityType, "entityType"),
        entityId: requireString(args.entityId, "entityId"),
        noteText: requireString(args.noteText, "noteText"),
        noteType: requireString(args.noteType, "noteType"),
      });
      return createJsonResponse({ noteId });
    }

    default:
      throw new Error(`Unknown synthesis tool: ${name}`);
  }
}
