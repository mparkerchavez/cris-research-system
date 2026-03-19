import path from "node:path";
import {
  cleanFilenameToTitle,
  countWords,
  extractBodyAfterMetadata,
  extractFirstHeading,
  extractMetadataFields,
  normalizeFullDate,
  parseSimpleFrontmatter,
  sourceTypeFromMetadata,
} from "./normalize.ts";

export type ParsedRawSource = {
  title: string;
  authorName?: string;
  publisherName?: string;
  canonicalUrl?: string;
  publishedDate?: string;
  sourceType: string;
  fullText?: string;
  fullTextFormat?: "markdown";
  wordCount?: number;
  originalFilePath: string;
  warnings: string[];
};

function pickMetadata(
  metadata: Record<string, string>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = metadata[key];
    if (value) {
      return value;
    }
  }
  return undefined;
}

export function parseRawSource(
  relativePath: string,
  text: string | null,
): ParsedRawSource {
  const warnings: string[] = [];
  const isPdf = relativePath.toLowerCase().endsWith(".pdf");

  if (isPdf || text === null) {
    return {
      title: cleanFilenameToTitle(relativePath),
      sourceType: "report",
      originalFilePath: relativePath,
      warnings,
    };
  }

  const frontmatter = parseSimpleFrontmatter(text);
  const metadata = {
    ...(frontmatter?.attributes ?? {}),
    ...extractMetadataFields(text),
  };
  const title =
    extractFirstHeading(text) ??
    pickMetadata(metadata, ["Title", "title"]) ??
    cleanFilenameToTitle(relativePath);

  const fullText = extractBodyAfterMetadata(text);
  const publishedRaw = pickMetadata(metadata, [
    "Published",
    "published",
    "Date",
    "Captured",
    "Transcript Extracted",
  ]);
  const publishedDate = publishedRaw ? normalizeFullDate(publishedRaw) : undefined;
  if (publishedRaw && !publishedDate) {
    warnings.push(`Could not normalize published date: ${publishedRaw}`);
  }

  const sourceType = sourceTypeFromMetadata(
    pickMetadata(metadata, ["Type", "Document Type"]),
    relativePath,
  );

  const wordCount = countWords(fullText);
  return {
    title,
    authorName: pickMetadata(metadata, ["Author"]),
    publisherName: pickMetadata(metadata, [
      "Publisher",
      "Publication",
      "Channel",
      "Source",
    ]),
    canonicalUrl: pickMetadata(metadata, ["URL"]),
    publishedDate,
    sourceType,
    fullText: fullText || undefined,
    fullTextFormat: fullText ? "markdown" : undefined,
    wordCount: wordCount > 0 ? wordCount : undefined,
    originalFilePath: relativePath.split(path.sep).join("/"),
    warnings,
  };
}
