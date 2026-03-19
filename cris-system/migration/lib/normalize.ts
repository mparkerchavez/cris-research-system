import path from "node:path";

export type ParsedFrontmatter = {
  attributes: Record<string, string>;
  body: string;
};

function cleanSegment(segment: string): string {
  return segment
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeTagSlug(value: string): string {
  return cleanSegment(value.replace(/^#/, ""));
}

export function toPosixPath(value: string): string {
  return value.replaceAll("\\", "/");
}

export function stripExtension(value: string): string {
  const parsed = path.posix.parse(toPosixPath(value));
  if (!parsed.ext) {
    return toPosixPath(value);
  }
  return toPosixPath(path.posix.join(parsed.dir, parsed.name));
}

export function normalizeForMatch(value: string): string {
  const posix = stripExtension(value);
  const segments = posix
    .split("/")
    .map((segment) => cleanSegment(segment))
    .filter(Boolean);
  return segments.join("/");
}

export function cleanFilenameToTitle(value: string): string {
  return stripExtension(path.posix.basename(toPosixPath(value)))
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  const matches = text.match(/[A-Za-z0-9]+/g);
  return matches ? matches.length : 0;
}

export function parseSimpleFrontmatter(text: string): ParsedFrontmatter | null {
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) {
    return null;
  }

  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return null;
  }

  const attributes: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const keyValue = line.match(/^([A-Za-z0-9 _/-]+):\s*(.*)$/);
    if (!keyValue) {
      continue;
    }
    attributes[keyValue[1].trim()] = keyValue[2].trim();
  }

  return {
    attributes,
    body: text.slice(match[0].length),
  };
}

export function extractFirstHeading(text: string): string | undefined {
  return text.match(/^#\s+(.+)$/m)?.[1]?.trim();
}

export function extractMetadataFields(text: string): Record<string, string> {
  const metadata: Record<string, string> = {};
  const lines = text.split(/\r?\n/);
  let inMetadataSection = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (/^##\s+Metadata\s*$/i.test(line.trim())) {
      inMetadataSection = true;
      continue;
    }

    if (inMetadataSection) {
      if (/^##\s+/.test(line) || /^---\s*$/.test(line)) {
        inMetadataSection = false;
        continue;
      }
      const bulletMatch = line.match(/^[-*]\s+\*\*([^:*]+):\*\*\s*(.+?)\s*$/);
      const plainMatch = line.match(/^[-*]\s+([^:*]+):\s*(.+?)\s*$/);
      if (bulletMatch) {
        metadata[bulletMatch[1].trim()] = bulletMatch[2].trim();
      } else if (plainMatch) {
        metadata[plainMatch[1].trim()] = plainMatch[2].trim();
      }
      continue;
    }

    const boldMatch = line.match(/^\*\*([^:*]+):\*\*\s*(.+?)\s*$/);
    const bulletBoldMatch = line.match(/^[-*]\s+\*\*([^:*]+):\*\*\s*(.+?)\s*$/);
    if (boldMatch) {
      metadata[boldMatch[1].trim()] = boldMatch[2].trim();
    } else if (bulletBoldMatch) {
      metadata[bulletBoldMatch[1].trim()] = bulletBoldMatch[2].trim();
    }
  }

  return metadata;
}

export function extractBodyAfterMetadata(text: string): string {
  const frontmatter = parseSimpleFrontmatter(text);
  if (frontmatter) {
    return frontmatter.body.trim();
  }

  const horizontalRule = text.match(/\r?\n---\r?\n/);
  if (horizontalRule && horizontalRule.index !== undefined) {
    return text
      .slice(horizontalRule.index + horizontalRule[0].length)
      .trim();
  }

  const firstHeading = text.match(/^#\s+.+$/m);
  if (!firstHeading || firstHeading.index === undefined) {
    return text.trim();
  }

  return text.slice(firstHeading.index + firstHeading[0].length).trim();
}

export function normalizeFullDate(value: string): string | undefined {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  const month = `${parsed.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getUTCDate()}`.padStart(2, "0");
  return `${parsed.getUTCFullYear()}-${month}-${day}`;
}

export function sourceTypeFromMetadata(
  rawType: string | undefined,
  filePath: string,
): string {
  const value = rawType?.toLowerCase() ?? "";
  const isPdf = filePath.toLowerCase().endsWith(".pdf");

  if (value.includes("blog")) {
    return "blog_post";
  }
  if (value.includes("podcast")) {
    return "podcast_transcript";
  }
  if (value.includes("video")) {
    return "video_transcript";
  }
  if (value.includes("research report") || value.includes("report") || isPdf) {
    return "report";
  }
  if (value.includes("paper")) {
    return "research_paper";
  }

  return "article";
}
