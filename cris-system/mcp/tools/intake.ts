import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { mutation, query } from "../lib/convex-client.ts";
import { fetchWithJina } from "../lib/jina.ts";

type SourceMetadata = {
  title: string;
  authorName?: string;
  canonicalUrl?: string;
  publishedDate?: string;
  sourceType: string;
  publisherName?: string;
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

function optionalString(value: unknown, fieldName: string): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string when provided`);
  }

  return value.trim();
}

function optionalBoolean(value: unknown, defaultValue = false): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "boolean") {
    throw new Error("confirm must be a boolean");
  }

  return value;
}

function requireMetadata(value: unknown): SourceMetadata {
  const metadata = asObject(value);
  return {
    title: requireString(metadata.title, "metadata.title"),
    authorName: optionalString(metadata.authorName, "metadata.authorName"),
    canonicalUrl: optionalString(metadata.canonicalUrl, "metadata.canonicalUrl"),
    publishedDate: optionalString(metadata.publishedDate, "metadata.publishedDate"),
    sourceType: requireString(metadata.sourceType, "metadata.sourceType"),
    publisherName: optionalString(metadata.publisherName, "metadata.publisherName"),
  };
}

function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function countWords(content: string): number {
  const normalized = content.trim();
  return normalized ? normalized.split(/\s+/).length : 0;
}

async function findExistingSource(contentHash: string) {
  return await query<{ contentHash: string }, any>(
    "sources:findSourceByContentHash",
    { contentHash },
  );
}

async function insertSource(args: {
  title: string;
  authorName?: string;
  publisherName?: string;
  canonicalUrl?: string;
  publishedDate?: string;
  sourceType: string;
  description?: string;
  fullText: string;
  fullTextFormat: string;
  contentHash: string;
  wordCount: number;
  originalFilePath?: string;
}) {
  return await mutation("sources:insertSource", {
    ...args,
    ingestedDate: new Date().toISOString().slice(0, 10),
    status: "indexed",
  });
}

async function uploadFileToStorage(fileBuffer: Buffer, filePath: string) {
  const uploadUrl = await mutation<{}, string>("sources:generateSourceUploadUrl", {});
  const extension = path.extname(filePath).toLowerCase();
  const contentType =
    extension === ".pdf"
      ? "application/pdf"
      : extension === ".md"
        ? "text/markdown"
        : "text/plain";

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
    },
    body: new Blob([fileBuffer]),
  });

  if (!response.ok) {
    throw new Error(`Convex storage upload failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as { storageId?: string };
  if (!payload.storageId) {
    throw new Error("Convex storage upload did not return a storageId");
  }

  return payload.storageId;
}

export const intakeTools: Tool[] = [
  {
    name: "add_source_from_url",
    description:
      "Fetch a URL through Jina, propose the source metadata, and optionally save it to Convex.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to ingest.",
        },
        confirm: {
          type: "boolean",
          description: "Set true to save after reviewing the proposed source.",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "add_source_from_text",
    description: "Create a new source from pasted text and source metadata.",
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "Full source text.",
        },
        metadata: {
          type: "object",
          properties: {
            title: { type: "string" },
            authorName: { type: "string" },
            canonicalUrl: { type: "string" },
            publishedDate: { type: "string" },
            sourceType: { type: "string" },
            publisherName: { type: "string" },
          },
          required: ["title", "sourceType"],
        },
      },
      required: ["content", "metadata"],
    },
  },
  {
    name: "upload_source_file",
    description: "Read a local file, upload it to Convex storage, and create a source record.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "Absolute local file path.",
        },
        metadata: {
          type: "object",
          properties: {
            title: { type: "string" },
            authorName: { type: "string" },
            canonicalUrl: { type: "string" },
            publishedDate: { type: "string" },
            sourceType: { type: "string" },
            publisherName: { type: "string" },
          },
          required: ["title", "sourceType"],
        },
      },
      required: ["filePath", "metadata"],
    },
  },
];

export async function handleIntakeTool(name: string, rawArgs: unknown) {
  const args = asObject(rawArgs ?? {});

  switch (name) {
    case "add_source_from_url": {
      const url = requireString(args.url, "url");
      const confirm = optionalBoolean(args.confirm, false);
      const fetched = await fetchWithJina(url);
      const contentHash = sha256(fetched.content);
      const existingSource = await findExistingSource(contentHash);

      if (!confirm) {
        return createJsonResponse({
          proposedSource: {
            title: fetched.title,
            description: fetched.description,
            canonicalUrl: fetched.canonicalUrl,
            sourceType: "web",
            fullTextFormat: "markdown",
            wordCount: countWords(fetched.content),
            contentHash,
          },
          alreadyExists: existingSource
            ? {
                sourceId: existingSource._id,
                title: existingSource.title,
              }
            : null,
          note: "Review this source proposal and rerun with confirm=true to save it.",
        });
      }

      if (existingSource) {
        return createJsonResponse({
          sourceId: existingSource._id,
          title: existingSource.title,
          note: "Source already exists for this content hash.",
        });
      }

      const sourceId = await insertSource({
        title: fetched.title || url,
        canonicalUrl: fetched.canonicalUrl || url,
        description: fetched.description,
        sourceType: "web",
        fullText: fetched.content,
        fullTextFormat: "markdown",
        contentHash,
        wordCount: countWords(fetched.content),
      });

      return createJsonResponse({
        sourceId,
        title: fetched.title || url,
      });
    }

    case "add_source_from_text": {
      const content = requireString(args.content, "content");
      const metadata = requireMetadata(args.metadata);
      const contentHash = sha256(content);
      const existingSource = await findExistingSource(contentHash);

      if (existingSource) {
        return createJsonResponse({
          sourceId: existingSource._id,
          title: existingSource.title,
          note: "Source already exists for this content hash.",
        });
      }

      const sourceId = await insertSource({
        title: metadata.title,
        authorName: metadata.authorName,
        publisherName: metadata.publisherName,
        canonicalUrl: metadata.canonicalUrl,
        publishedDate: metadata.publishedDate,
        sourceType: metadata.sourceType,
        fullText: content,
        fullTextFormat: "markdown",
        contentHash,
        wordCount: countWords(content),
      });

      return createJsonResponse({
        sourceId,
        title: metadata.title,
      });
    }

    case "upload_source_file": {
      const filePath = requireString(args.filePath, "filePath");
      if (!path.isAbsolute(filePath)) {
        throw new Error("filePath must be an absolute path");
      }

      const metadata = requireMetadata(args.metadata);
      const fileBuffer = await fs.readFile(filePath);
      const extension = path.extname(filePath).toLowerCase();

      let content: string;
      if (extension === ".pdf") {
        const pdfParseModule = await import("pdf-parse");
        const pdfParse =
          "default" in pdfParseModule ? pdfParseModule.default : pdfParseModule;
        const parsed = await pdfParse(fileBuffer);
        content = parsed.text ?? "";
      } else {
        content = fileBuffer.toString("utf8");
      }

      const contentHash = sha256(content);
      const existingSource = await findExistingSource(contentHash);
      if (existingSource) {
        return createJsonResponse({
          sourceId: existingSource._id,
          title: existingSource.title,
          note: "Source already exists for this content hash.",
        });
      }

      const storageId = await uploadFileToStorage(fileBuffer, filePath);
      const fullTextFormat = extension === ".md" ? "markdown" : "text";
      const sourceId = await insertSource({
        title: metadata.title,
        authorName: metadata.authorName,
        publisherName: metadata.publisherName,
        canonicalUrl: metadata.canonicalUrl,
        publishedDate: metadata.publishedDate,
        sourceType: metadata.sourceType,
        fullText: content,
        fullTextFormat,
        contentHash,
        wordCount: countWords(content),
        originalFilePath: filePath,
        storageId,
      });

      return createJsonResponse({
        sourceId,
        title: metadata.title,
        wordCount: countWords(content),
      });
    }

    default:
      throw new Error(`Unknown intake tool: ${name}`);
  }
}
