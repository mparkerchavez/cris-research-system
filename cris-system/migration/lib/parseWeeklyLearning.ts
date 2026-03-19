import path from "node:path";
import { parseCitationComments, type ParsedCitationComment } from "./parseCitationComment.ts";

export type ParsedWeeklyTheme = {
  themeTitle: string;
  themeContent: string;
  orderIndex: number;
  citationComments: ParsedCitationComment[];
};

export type ParsedWeeklyLearning = {
  title: string;
  weekStartDate: string;
  weekEndDate: string;
  overview: string;
  themes: ParsedWeeklyTheme[];
  originalFilePath: string;
};

const MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

function formatDate(year: number, month: number, day: number): string {
  return [
    `${year}`.padStart(4, "0"),
    `${month}`.padStart(2, "0"),
    `${day}`.padStart(2, "0"),
  ].join("-");
}

function parseWeekDates(title: string, relativePath: string): {
  weekStartDate: string;
  weekEndDate: string;
} {
  const match = title.match(
    /^#\s+Weekly Learnings:\s+([A-Za-z]+)\s+(\d{1,2})(?:-(\d{1,2}))?,\s+(\d{4})$/,
  );

  if (match) {
    const month = MONTHS[match[1].toLowerCase()];
    if (!month) {
      throw new Error(`Unknown month in title: ${title}`);
    }
    const startDay = Number.parseInt(match[2], 10);
    const endDay = Number.parseInt(match[3] ?? match[2], 10);
    const year = Number.parseInt(match[4], 10);
    return {
      weekStartDate: formatDate(year, month, startDay),
      weekEndDate: formatDate(year, month, endDay),
    };
  }

  const fallbackEnd = path.basename(relativePath).match(/(\d{4}-\d{2}-\d{2})/);
  if (!fallbackEnd) {
    throw new Error(`Could not derive weekly dates from ${relativePath}`);
  }

  return {
    weekStartDate: fallbackEnd[1],
    weekEndDate: fallbackEnd[1],
  };
}

function extractOverview(text: string): string {
  const synthesisIndex = text.search(/^##\s+Synthesis by Tag\s*$/m);
  if (synthesisIndex === -1) {
    return "";
  }

  let overview = text.slice(0, synthesisIndex);
  overview = overview.replace(/^#.+$/m, "");
  overview = overview.replace(/<!--[\s\S]*?-->/g, "");
  overview = overview.replace(
    /^##\s+Sources Processed[\s\S]*$/m,
    "",
  );
  return overview.trim();
}

export function parseWeeklyLearning(
  relativePath: string,
  text: string,
): ParsedWeeklyLearning {
  const titleMatch = text.match(/^#\s+.+$/m);
  if (!titleMatch) {
    throw new Error(`Could not find weekly learning title in ${relativePath}`);
  }

  const { weekStartDate, weekEndDate } = parseWeekDates(
    titleMatch[0],
    relativePath,
  );

  const themeMatches = [...text.matchAll(/^###\s+(.+)$/gm)];
  if (themeMatches.length === 0) {
    throw new Error(`No weekly themes found in ${relativePath}`);
  }

  const themes: ParsedWeeklyTheme[] = [];
  for (let index = 0; index < themeMatches.length; index += 1) {
    const current = themeMatches[index];
    const next = themeMatches[index + 1];
    const start = current.index ?? 0;
    const end = next?.index ?? text.length;
    const themeContent = text.slice(start, end).trim();

    themes.push({
      themeTitle: current[1].trim(),
      themeContent,
      orderIndex: index,
      citationComments: parseCitationComments(themeContent),
    });
  }

  return {
    title: titleMatch[0].replace(/^#\s+/, "").trim(),
    weekStartDate,
    weekEndDate,
    overview: extractOverview(text),
    themes,
    originalFilePath: relativePath,
  };
}
