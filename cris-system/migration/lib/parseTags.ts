import { normalizeTagSlug } from "./normalize.ts";

export type ParsedTag = {
  rawTag: string;
  slug: string;
  name: string;
  category: "established" | "emerging" | "retired";
  description?: string;
};

export type ParsedTagsFile = {
  tags: ParsedTag[];
  warnings: string[];
};

function parseTableLine(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isDividerRow(line: string): boolean {
  return /^\|\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(line.trim());
}

function descriptionFromCells(
  category: ParsedTag["category"],
  cells: string[],
): string | undefined {
  if (category === "retired") {
    const action = cells[1];
    const date = cells[2];
    const notes = cells[3];
    const parts = [action ? `Action: ${action}` : "", date ? `Date: ${date}` : "", notes]
      .filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : undefined;
  }

  const definition = cells[1];
  const notes = cells[3];
  if (definition && notes) {
    return `${definition} Notes: ${notes}`;
  }
  return definition || notes || undefined;
}

export function parseTagsFile(text: string): ParsedTagsFile {
  const lines = text.split(/\r?\n/);
  const tags: ParsedTag[] = [];
  const warnings: string[] = [];
  let currentCategory: ParsedTag["category"] | null = null;
  const seenSlugs = new Set<string>();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) {
      continue;
    }

    if (/^##\s+Established Tags$/i.test(line)) {
      currentCategory = "established";
      continue;
    }
    if (/^##\s+Emerging Tags$/i.test(line)) {
      currentCategory = "emerging";
      continue;
    }
    if (/^##\s+Retired Tags$/i.test(line)) {
      currentCategory = "retired";
      continue;
    }

    if (!currentCategory || !line.startsWith("|")) {
      continue;
    }

    if (isDividerRow(line)) {
      continue;
    }

    const cells = parseTableLine(line);
    if (cells.length === 0 || /^tag$/i.test(cells[0])) {
      continue;
    }

    const rawTag = cells[0];
    if (!rawTag.startsWith("#")) {
      continue;
    }

    const slug = normalizeTagSlug(rawTag);
    if (!slug) {
      warnings.push(`Skipped invalid tag row: ${line}`);
      continue;
    }

    if (seenSlugs.has(slug)) {
      warnings.push(`Duplicate tag slug ignored: ${rawTag}`);
      continue;
    }
    seenSlugs.add(slug);

    tags.push({
      rawTag,
      slug,
      name: rawTag,
      category: currentCategory,
      description: descriptionFromCells(currentCategory, cells),
    });
  }

  return { tags, warnings };
}
