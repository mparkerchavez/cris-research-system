import path from "node:path";
import {
  extractFirstHeading,
  extractMetadataFields,
  normalizeFullDate,
  parseSimpleFrontmatter,
} from "./normalize.ts";

export type ParsedExtractionDataPoint = {
  dpSequenceNumber: number;
  claimText: string;
  anchorQuote?: string;
  citationDisplay?: string;
  locationType?: string;
  locationStart?: number;
  locationEnd?: number;
  rawTags: string[];
};

export type ParsedExtraction = {
  title: string;
  sourceReference?: string;
  extractionDate: string;
  originalFilePath: string;
  dataPoints: ParsedExtractionDataPoint[];
  warnings: string[];
};

function normalizeHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isDataPointsHeading(heading: string): boolean {
  const normalized = normalizeHeading(heading);
  return normalized.includes("data points") ||
    normalized.includes("atomic data points");
}

function parseCitationLocation(citationDisplay?: string): {
  locationType?: string;
  locationStart?: number;
  locationEnd?: number;
} {
  if (!citationDisplay) {
    return {};
  }

  const normalized = citationDisplay.trim();
  const paragraphMatch = normalized.match(/para\.\s*(\d+)/i);
  if (paragraphMatch) {
    return {
      locationType: "paragraph",
      locationStart: Number.parseInt(paragraphMatch[1], 10),
    };
  }

  const pageRangeMatch = normalized.match(/p\.\s*(\d+)\s*,\s*(\d+)/i);
  if (pageRangeMatch) {
    return {
      locationType: "page",
      locationStart: Number.parseInt(pageRangeMatch[1], 10),
      locationEnd: Number.parseInt(pageRangeMatch[2], 10),
    };
  }

  const pageMatch = normalized.match(/p\.\s*(\d+)/i);
  if (pageMatch) {
    return {
      locationType: "page",
      locationStart: Number.parseInt(pageMatch[1], 10),
    };
  }

  return {};
}

function parseTags(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function parseExtractionSourceReference(text: string): string | undefined {
  const frontmatter = parseSimpleFrontmatter(text);
  const metadata = {
    ...(frontmatter?.attributes ?? {}),
    ...extractMetadataFields(text),
  };

  return metadata["Original Location"] ?? metadata["URL/Location"];
}

export function parseExtraction(
  relativePath: string,
  text: string,
): ParsedExtraction {
  const warnings: string[] = [];
  const frontmatter = parseSimpleFrontmatter(text);
  const metadata = {
    ...(frontmatter?.attributes ?? {}),
    ...extractMetadataFields(text),
  };

  const extractionDateRaw =
    metadata.Extracted ??
    metadata.Processed ??
    path.basename(relativePath).match(/(\d{4}-\d{2}-\d{2})/)?.[1];

  const extractionDate = extractionDateRaw
    ? normalizeFullDate(extractionDateRaw)
    : undefined;
  if (!extractionDate) {
    throw new Error(`Missing or invalid extraction date in ${relativePath}`);
  }

  const headingMatches = [...text.matchAll(/^\s*##\s+(.+?)\s*$/gm)];
  const dataSectionMatch = headingMatches.find((match) =>
    isDataPointsHeading(match[1] ?? "")
  );
  const firstDpMatch = text.match(/^\*\*DP\d+:/m);

  let afterDataSection: string;
  if (dataSectionMatch && dataSectionMatch.index !== undefined) {
    afterDataSection = text.slice(
      dataSectionMatch.index + dataSectionMatch[0].length,
    );
  } else if (firstDpMatch && firstDpMatch.index !== undefined) {
    warnings.push("No explicit data points heading found; fell back to first DP marker");
    afterDataSection = text.slice(firstDpMatch.index);
  } else {
    throw new Error(`Could not find data points section in ${relativePath}`);
  }

  const stopMatch = afterDataSection.match(/^\s*##\s+.+$/m);
  const dataBlock = stopMatch && stopMatch.index !== undefined
    ? afterDataSection.slice(0, stopMatch.index)
    : afterDataSection;

  const dpMatches = [
    ...dataBlock.matchAll(/^\*\*DP(\d+):(?:\*\*\s*(.+)|\s*(.+)\*\*)$/gm),
  ];
  const dataPoints: ParsedExtractionDataPoint[] = [];

  for (let index = 0; index < dpMatches.length; index += 1) {
    const current = dpMatches[index];
    const next = dpMatches[index + 1];
    const start = current.index ?? 0;
    const end = next?.index ?? dataBlock.length;
    const block = dataBlock.slice(start, end).trim();

    const dpSequenceNumber = Number.parseInt(current[1], 10);
    const claimText = (current[2] ?? current[3] ?? "").trim();
    const anchorQuote = block.match(/^- \*\*Anchor:\*\*\s*(.+)$/m)?.[1]?.trim();
    const citationDisplay = block.match(/^- \*\*Citation:\*\*\s*(.+)$/m)?.[1]?.trim();
    const rawTags = parseTags(
      block.match(/^- \*\*Tags:\*\*\s*(.+)$/m)?.[1]?.trim(),
    );

    if (!claimText) {
      warnings.push(`DP${dpSequenceNumber} missing claim text`);
    }

    dataPoints.push({
      dpSequenceNumber,
      claimText,
      anchorQuote,
      citationDisplay,
      ...parseCitationLocation(citationDisplay),
      rawTags,
    });
  }

  if (dataPoints.length === 0) {
    throw new Error(`No data points parsed from ${relativePath}`);
  }

  return {
    title:
      extractFirstHeading(text) ??
      path.basename(relativePath, path.extname(relativePath)),
    sourceReference:
      metadata["Original Location"] ?? metadata["URL/Location"],
    extractionDate,
    originalFilePath: relativePath,
    dataPoints,
    warnings,
  };
}
