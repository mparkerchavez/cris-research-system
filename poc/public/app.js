/**
 * CRIS Research Observatory
 * Bloomberg-inspired editorial interface for research exploration
 */

// =============================================================================
// STATE
// =============================================================================

const state = {
  index: null,
  files: [],
  filtered: [],
  selected: null,
  selectedData: null,
  selectedClaims: [],
  viewMode: "rendered",
  view: "pulse",
  sortOrder: "newest",
  fileMap: new Map(),
  fileNameMap: new Map(),
  citationContextCache: new Map(),
  citationSourceCache: new Map(),
  rootFolders: new Set(),
  aliasMap: new Map(),
  activeFilters: {
    types: new Set(),
    tags: new Set(),
  },
  home: {
    synthesis: null,
    synthesisPath: "06_Current_Understanding/Current_Synthesis.md",
    ideasMeta: {
      lastUpdated: "",
      totalActiveIdeas: "",
      evidenceBase: "",
    },
    weeklyInsights: {
      sourcePath: "",
      title: "",
      trends: [],
      openThreads: [],
      reflectionParagraphs: [],
    },
    ideas: [],
    ideasByKey: new Map(),
    ideaUpdated: new Map(),
    talkingPointsMeta: {
      title: "",
      subtitle: "",
      date: "",
      preparedBy: "",
      nextUpdate: "",
      dataPointsSynthesized: "",
      researchPeriod: "",
      keyFrameworks: "",
      sourcePath: "",
    },
    talkingPoints: [],
    talkingPointsByKey: new Map(),
    activity: [],
  },
  ideas: {
    selectedKey: null,
  },
  talkingPoints: {
    selectedKey: null,
  },
  pulse: {
    activeTrendIndex: null,
  },
  explore: {
    activeClaimIndex: null,
    tagsExpanded: false,
    tracePanelMode: "claims",
    activeLineagePayload: null,
    isLineageLoading: false,
    lineageRequestId: 0,
    lineageUi: {
      defaultOpenGroup: "issues-or-dp",
    },
  },
};

// =============================================================================
// DOM REFERENCES
// =============================================================================

const $ = (id) => document.getElementById(id);

const refs = {
  // Header
  mainNav: $("mainNav"),
  fileCount: $("fileCount"),
  statusIndicator: $("statusIndicator"),
  reindexBtn: $("reindexBtn"),

  // Control Panel
  controlPanel: $("controlPanel"),
  compressionList: $("compressionList"),
  tagsList: $("tagsList"),
  sortList: $("sortList"),

  // Views
  mainLayout: $("mainLayout"),
  pulseView: $("pulseView"),
  exploreView: $("exploreView"),
  ideasView: $("ideasView"),
  talkingPointsView: $("talkingPointsView"),

  // Pulse View
  synthesisHeadline: $("synthesisHeadline"),
  synthesisLede: $("synthesisLede"),
  synthesisSummary: $("synthesisSummary"),
  synthesisMeta: $("synthesisMeta"),
  synthesisTakeaways: $("synthesisTakeaways"),
  pulseTrendsList: $("pulseTrendsList"),
  pulseWeeklyOpenThreadsList: $("pulseWeeklyOpenThreadsList"),
  pulseReflectionContent: $("pulseReflectionContent"),

  // Ideas View
  ideasList: $("ideasList"),
  ideasListMeta: $("ideasListMeta"),
  ideasEmpty: $("ideasEmpty"),
  ideaDetailContent: $("ideaDetailContent"),
  talkingPointsList: $("talkingPointsList"),
  talkingPointsListMeta: $("talkingPointsListMeta"),
  talkingPointsEmpty: $("talkingPointsEmpty"),
  talkingPointDetailContent: $("talkingPointDetailContent"),

  // Explore View
  searchInput: $("searchInput"),
  filterSummary: $("filterSummary"),
  filterCount: $("filterCount"),
  filterHint: $("filterHint"),
  filterChips: $("filterChips"),
  clearFiltersBtn: $("clearFiltersBtn"),
  fileList: $("fileList"),
  docPreview: $("docPreview"),
  emptyPreview: $("emptyPreview"),
  docHeader: $("docHeader"),
  docType: $("docType"),
  docTitle: $("docTitle"),
  docPath: $("docPath"),
  docStats: $("docStats"),
  docTagsWrap: $("docTagsWrap"),
  docTags: $("docTags"),
  docTagsToggleBtn: $("docTagsToggleBtn"),
  openTraceBtn: $("openTraceBtn"),
  traceSummary: $("traceSummary"),
  docContent: $("docContent"),
  copyMarkdownBtn: $("copyMarkdownBtn"),
  copyFilenameBtn: $("copyFilenameBtn"),
  toggleRawBtn: $("toggleRawBtn"),

  // Drawers
  lineageDrawer: $("lineageDrawer"),
  lineageBackdrop: $("lineageBackdrop"),
  lineageDrawerBody: $("lineageDrawerBody"),
  closeLineageDrawer: $("closeLineageDrawer"),
  ideaDrawer: $("ideaDrawer"),
  ideaBackdrop: $("ideaBackdrop"),
  ideaDrawerTitle: $("ideaDrawerTitle"),
  ideaDrawerBody: $("ideaDrawerBody"),
  closeIdeaDrawer: $("closeIdeaDrawer"),
  takeawayDrawer: $("takeawayDrawer"),
  takeawayBackdrop: $("takeawayBackdrop"),
  takeawayDrawerTitle: $("takeawayDrawerTitle"),
  takeawayDrawerBody: $("takeawayDrawerBody"),
  closeTakeawayDrawer: $("closeTakeawayDrawer"),
  trendDrawer: $("trendDrawer"),
  trendBackdrop: $("trendBackdrop"),
  trendDrawerTitle: $("trendDrawerTitle"),
  trendDrawerBody: $("trendDrawerBody"),
  closeTrendDrawer: $("closeTrendDrawer"),
  positionDrawer: $("positionDrawer"),
  positionBackdrop: $("positionBackdrop"),
  positionDrawerTitle: $("positionDrawerTitle"),
  positionDrawerBody: $("positionDrawerBody"),
  closePositionDrawer: $("closePositionDrawer"),
};

// =============================================================================
// CONSTANTS
// =============================================================================

const COMPRESSION_CHAIN = [
  { key: "Current Understanding", label: "Current Understanding", folder: "06_Current_Understanding", color: "var(--color-accent-violet)" },
  { key: "Weekly Learnings", label: "Weekly Learnings", folder: "03_Weekly_Learnings", color: "var(--color-accent-green)" },
  { key: "Monthly Synthesis", label: "Month Synthesis", folder: "04_Monthly_Synthesis", color: "var(--color-accent-green)" },
  { key: "Extractions", label: "Extractions", folder: "02_Extractions", color: "var(--color-accent-red)" },
  { key: "Raw Inputs", label: "Raw Inputs", folder: "01_Raw_Inputs", color: "var(--color-muted)" },
  { key: "Other", label: "Other", folder: "", color: "var(--color-muted)" },
];

const PRIMARY_COMPRESSION_TYPES = new Set([
  "Current Understanding",
  "Weekly Learnings",
  "Monthly Synthesis",
  "Extractions",
  "Raw Inputs",
]);

const RAW_EXTENSIONS = new Set(["md", "markdown", "mdx"]);
const LOCAL_EXTENSIONS = ["md", "markdown", "mdx", "pdf"];
const DOC_TAG_LIMIT_DESKTOP = 8;
const DOC_TAG_LIMIT_MOBILE = 6;

const matchesCompressionType = (file, compressionType) => {
  if (!file) return false;
  const fileType = file.type || "";
  if (compressionType === "Other") {
    return !PRIMARY_COMPRESSION_TYPES.has(fileType);
  }
  return fileType === compressionType;
};

const getCompressionTypeLabel = (compressionType) =>
  COMPRESSION_CHAIN.find((item) => item.key === compressionType)?.label || compressionType;

const COMPRESSION_SLUG_BY_KEY = {
  "Current Understanding": "current-understanding",
  "Weekly Learnings": "weekly-learnings",
  "Monthly Synthesis": "monthly-synthesis",
  "Extractions": "extractions",
  "Raw Inputs": "raw-inputs",
  "Other": "other",
};

const COMPRESSION_KEY_BY_SLUG = new Map(
  Object.entries(COMPRESSION_SLUG_BY_KEY).map(([key, slug]) => [slug, key]),
);

// =============================================================================
// UTILITIES
// =============================================================================

const escapeHtml = (str) =>
  (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderInlineMarkdownBold = (value) => {
  const escaped = escapeHtml(value || "");
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>");
};

const cleanLineageText = (value) => {
  if (value == null) return "";
  return String(value)
    .replace(/\r\n/g, "\n")
    .replace(/^\s*\*\*\s*/, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeNewlines = (text) =>
  text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

const normalizePath = (value) => {
  const cleaned = value.replace(/\\/g, "/");
  const parts = cleaned.split("/").filter(Boolean);
  const stack = [];
  parts.forEach((part) => {
    if (part === ".") return;
    if (part === "..") {
      stack.pop();
      return;
    }
    stack.push(part);
  });
  return stack.join("/");
};

const normalizeLookupKey = (value) =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

const CITE_COMMENT_RE = /<!--\s*cite:([^>]+?)\s*-->/gi;
const WL_REFERENCE_RE = /^WL_\d{4}-\d{2}-\d{2}$/i;
const SOURCE_DP_SEGMENT_RE = /([A-Za-z0-9_]+)\s+(DP\s*\d+(?:\s*,\s*DP\s*\d+)*)/gi;

const extractCitationMetadataBlocks = (value) => {
  const blocks = [];
  if (!value) return blocks;
  let match;
  while ((match = CITE_COMMENT_RE.exec(String(value))) !== null) {
    blocks.push((match[1] || "").trim());
  }
  CITE_COMMENT_RE.lastIndex = 0;
  return blocks;
};

const stripCitationMetadataBlocks = (value) => {
  if (!value) return "";
  const cleaned = String(value).replace(CITE_COMMENT_RE, " ");
  CITE_COMMENT_RE.lastIndex = 0;
  return cleaned.replace(/\s+/g, " ").trim();
};

const splitCitationSegments = (value) => {
  const cleaned = stripCitationMetadataBlocks(value || "");
  if (!cleaned) return [];
  const bracketless = cleaned.startsWith("[") && cleaned.endsWith("]")
    ? cleaned.slice(1, -1).trim()
    : cleaned;
  const coarseSegments = bracketless
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
  const segments = [];

  coarseSegments.forEach((segment) => {
    if (WL_REFERENCE_RE.test(segment)) {
      segments.push(segment);
      return;
    }

    const matches = [];
    let match;
    while ((match = SOURCE_DP_SEGMENT_RE.exec(segment)) !== null) {
      const source = (match[1] || "").trim();
      const dpClause = (match[2] || "").trim();
      if (source && dpClause) matches.push(`${source} ${dpClause}`);
    }
    SOURCE_DP_SEGMENT_RE.lastIndex = 0;

    if (matches.length) {
      segments.push(...matches);
      return;
    }

    segments.push(segment);
  });

  return segments;
};

const normalizeIdeaTitle = (value) => {
  if (!value) return "";
  return value
    .replace(/^idea\s*\d+\s*:\s*/i, "")
    .replace(/^idea\s*\d+\s*/i, "")
    .replace(/^the\s+/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
};

const formatDate = (ts) => {
  if (!ts) return "";
  const date = new Date(ts * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatRelativeDate = (ts) => {
  if (!ts) return "";
  const now = Date.now();
  const then = ts * 1000;
  const diff = now - then;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(ts);
};

const hasScheme = (value) => /^[a-z][a-z0-9+.-]*:/.test(value);

const isExternalLink = (value) => {
  if (!value) return false;
  if (value.startsWith("mailto:") || value.startsWith("tel:")) return true;
  if (value.startsWith("#")) return false;
  return hasScheme(value);
};

const stripQueryHash = (value) => value.split(/[?#]/)[0];

// =============================================================================
// FILE RESOLUTION
// =============================================================================

const resolveLinkPath = (basePath, href) => {
  if (!href || href.startsWith("#") || hasScheme(href)) return null;
  let clean = stripQueryHash(href);
  try {
    clean = decodeURIComponent(clean);
  } catch (err) {}
  if (!clean) return null;
  if (clean.startsWith("/")) {
    return normalizePath(clean.slice(1));
  }
  const normalized = normalizePath(clean);
  const firstSegment = normalized.split("/")[0];
  const isExplicitRelative = clean.startsWith(".") || clean.startsWith("..");
  if (!isExplicitRelative && state.rootFolders.has(firstSegment)) {
    return normalized;
  }
  const baseDir = basePath ? basePath.split("/").slice(0, -1).join("/") : "";
  const combined = baseDir ? `${baseDir}/${normalized}` : normalized;
  return normalizePath(combined);
};

const resolveLocalFile = (basePath, href) => {
  const resolved = resolveLinkPath(basePath, href);
  if (!resolved) return null;
  if (state.fileMap.has(resolved)) return resolved;
  const aliased = state.aliasMap.get(resolved);
  if (aliased) return aliased;

  const trimmed = resolved.replace(/\/$/, "");
  if (trimmed !== resolved) {
    const trimmedAliased = state.aliasMap.get(trimmed);
    if (trimmedAliased) return trimmedAliased;
  }
  const hasExtension = trimmed.includes(".");
  if (!hasExtension) {
    for (const ext of LOCAL_EXTENSIONS) {
      const candidate = `${trimmed}.${ext}`;
      if (state.fileMap.has(candidate)) return candidate;
      const candidateAliased = state.aliasMap.get(candidate);
      if (candidateAliased) return candidateAliased;
    }
  }

  if (!trimmed.includes("/")) {
    const key = normalizeLookupKey(trimmed);
    const byName = state.fileNameMap.get(key);
    if (byName) return byName;
  }

  return null;
};

const isMarkdownFile = (file) => {
  if (!file) return false;
  const ext = (file.ext || "").toLowerCase();
  if (ext) return [".md", ".markdown", ".mdx"].includes(ext);
  const name = (file.name || file.path || "").toLowerCase();
  return [".md", ".markdown", ".mdx"].some((suffix) => name.endsWith(suffix));
};

const isPdfFile = (file) => {
  if (!file) return false;
  const ext = (file.ext || "").toLowerCase();
  if (ext) return ext === ".pdf";
  const name = (file.name || file.path || "").toLowerCase();
  return name.endsWith(".pdf");
};

// =============================================================================
// FILE MAP BUILDING
// =============================================================================

const EXTRACTION_DATE_SUFFIX_RE = /_(\d{4}-\d{2}-\d{2})$/;
const EXTRACTION_PATH_RE = /^02_Extractions\/(\d{4}-\d{2})\/(.+)_\d{4}-\d{2}-\d{2}\.md$/;
const RAW_INPUTS_RANGE_RE = /^01_Raw_Inputs\/(\d{4}-\d{2})\/\d{4}-\d{2}-\d{2}_to_\d{2}\/(.+)$/;

const parseProcessingDate = (value) => {
  if (!value) return null;
  const match = value.match(EXTRACTION_DATE_SUFFIX_RE);
  return match ? match[1] : null;
};

const dateKey = (value) => {
  if (!value) return 0;
  const numeric = Number(value.replace(/-/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
};

const stripProcessingDate = (value) => {
  if (!value) return "";
  return value.replace(EXTRACTION_DATE_SUFFIX_RE, "");
};

const buildFileMap = (files) => {
  state.fileMap = new Map();
  state.fileNameMap = new Map();
  state.rootFolders = new Set();
  state.aliasMap = new Map();
  const aliasMeta = new Map();

  const registerLookupKey = (rawKey, path) => {
    const key = normalizeLookupKey(rawKey || "");
    if (!key) return;
    if (state.fileNameMap.has(key) && state.fileNameMap.get(key) !== path) {
      state.fileNameMap.set(key, null);
    } else {
      state.fileNameMap.set(key, path);
    }
  };

  const registerAlias = (alias, path, priority) => {
    if (!alias) return;
    const existing = aliasMeta.get(alias);
    if (!existing || priority > existing.priority) {
      aliasMeta.set(alias, { path, priority });
    }
  };

  files.forEach((file) => {
    state.fileMap.set(file.path, file);
    const top = file.path.split("/")[0];
    if (top) state.rootFolders.add(top);

    registerLookupKey(file.name, file.path);
    registerLookupKey(file.stem, file.path);

    if (file.path.startsWith("02_Extractions/")) {
      const match = file.path.match(EXTRACTION_PATH_RE);
      if (match) {
        const aliasPath = `02_Extractions/${match[1]}/${match[2]}.md`;
        const processingDate = parseProcessingDate(file.stem);
        const priority = dateKey(processingDate) || file.mtime || 0;
        registerAlias(aliasPath, file.path, priority);
      }
      const strippedStem = stripProcessingDate(file.stem);
      if (strippedStem && strippedStem !== file.stem) {
        registerLookupKey(strippedStem, file.path);
      }
    }

    if (file.path.startsWith("01_Raw_Inputs/")) {
      const rawMatch = file.path.match(RAW_INPUTS_RANGE_RE);
      if (rawMatch) {
        const aliasPath = `01_Raw_Inputs/${rawMatch[1]}/${rawMatch[2]}`;
        registerAlias(aliasPath, file.path, file.mtime || 0);
      }
    }
  });

  aliasMeta.forEach((value, key) => {
    state.aliasMap.set(key, value.path);
  });
};

// =============================================================================
// VIEW MANAGEMENT
// =============================================================================

const VIEW_NAMES = ["pulse", "ideas", "talking-points", "explore"];
const LEGACY_VIEW_REDIRECTS = {
  verify: "explore",
  talkingpoints: "talking-points",
  talking_points: "talking-points",
};

const normalizeViewName = (view) => {
  const normalized = String(view || "").trim().toLowerCase();
  if (LEGACY_VIEW_REDIRECTS[normalized]) {
    return LEGACY_VIEW_REDIRECTS[normalized];
  }
  return VIEW_NAMES.includes(normalized) ? normalized : "pulse";
};

const getViewFromUrl = () => {
  const url = new URL(window.location.href);
  return normalizeViewName(url.searchParams.get("view"));
};

const getCompressionFromUrl = () => {
  const url = new URL(window.location.href);
  const raw = (url.searchParams.get("compression") || "").trim().toLowerCase();
  if (!raw) return { type: null, invalid: false };
  const type = COMPRESSION_KEY_BY_SLUG.get(raw) || null;
  return { type, invalid: !type };
};

const buildViewUrl = (view) => {
  const url = new URL(window.location.href);
  if (view === "pulse") {
    url.searchParams.delete("view");
  } else {
    url.searchParams.set("view", view);
  }
  return `${url.pathname}${url.search}${url.hash}`;
};

const syncViewUrl = (view, replace = false) => {
  const nextUrl = buildViewUrl(view);
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl === currentUrl) return;
  if (replace) {
    window.history.replaceState({ view }, "", nextUrl);
  } else {
    window.history.pushState({ view }, "", nextUrl);
  }
};

const getActiveCompressionType = () => (
  state.activeFilters.types.size === 1
    ? Array.from(state.activeFilters.types)[0]
    : null
);

const buildCompressionUrl = (compressionType) => {
  const url = new URL(window.location.href);
  const slug = compressionType ? COMPRESSION_SLUG_BY_KEY[compressionType] : null;
  if (slug) {
    url.searchParams.set("compression", slug);
  } else {
    url.searchParams.delete("compression");
  }
  return `${url.pathname}${url.search}${url.hash}`;
};

const syncCompressionUrl = (compressionType, replace = false) => {
  const nextUrl = buildCompressionUrl(compressionType);
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl === currentUrl) return;
  if (replace) {
    window.history.replaceState({ view: state.view }, "", nextUrl);
  } else {
    window.history.pushState({ view: state.view }, "", nextUrl);
  }
};

const syncCompressionUrlFromState = (replace = false) => {
  syncCompressionUrl(getActiveCompressionType(), replace);
};

const applyCompressionFilterFromUrl = (options = {}) => {
  const { normalizeUrl = false, replaceHistory = false } = options;
  const { type, invalid } = getCompressionFromUrl();
  state.activeFilters.types.clear();
  if (type) state.activeFilters.types.add(type);

  if (normalizeUrl && invalid) {
    syncCompressionUrlFromState(replaceHistory);
  }
};

const setView = (view, options = {}) => {
  const { syncUrl = true, replaceHistory = false } = options;
  const nextView = normalizeViewName(view);
  const previousView = state.view;
  state.view = nextView;

  // Update nav links
  refs.mainNav?.querySelectorAll(".cr-shell-nav-link").forEach((link) => {
    const isActive = link.dataset.view === nextView;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // Toggle view classes on body for CSS rules
  VIEW_NAMES.forEach((name) => {
    document.body.classList.toggle(`state-view-${name}`, name === nextView);
  });

  // Toggle control panel visibility (Explore only)
  if (refs.controlPanel) {
    refs.controlPanel.style.display = nextView === "explore" ? "" : "none";
  }

  if (syncUrl) {
    const shouldReplace = replaceHistory || nextView === previousView;
    syncViewUrl(nextView, shouldReplace);
  }

  if (nextView === "ideas") renderIdeasView();
  if (nextView === "talking-points") renderTalkingPointsView();
};

// =============================================================================
// CONTROL PANEL
// =============================================================================

const renderCompressionList = () => {
  if (!refs.compressionList) return;
  refs.compressionList.innerHTML = "";

  COMPRESSION_CHAIN.forEach((item) => {
    const count = (state.files || []).filter((file) => matchesCompressionType(file, item.key)).length;
    const isActive = state.activeFilters.types.has(item.key);

    const el = document.createElement("button");
    el.type = "button";
    el.className = `cr-filter-item${isActive ? " is-active" : ""}`;
    el.setAttribute("aria-pressed", String(isActive));
    el.dataset.type = item.key;
    el.innerHTML = `
      <span class="cr-filter-item-label">
        <span class="cr-filter-item-check"></span>
        ${escapeHtml(item.label || item.key)}
      </span>
      <span class="cr-filter-item-count">${count}</span>
    `;
    refs.compressionList.appendChild(el);
  });
};

const setCompressionTypeFilter = (type) => {
  if (!type) return;
  const activeTypes = state.activeFilters.types;
  if (activeTypes.has(type)) {
    activeTypes.clear();
    return;
  }
  activeTypes.clear();
  activeTypes.add(type);
};

const renderTagsList = () => {
  if (!refs.tagsList) return;
  refs.tagsList.innerHTML = "";

  // Collect all tags
  const tagCounts = new Map();
  state.files.forEach((file) => {
    (file.tags || []).forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // Sort by count, take top 15
  const sorted = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  sorted.forEach(([tag, count]) => {
    const isActive = state.activeFilters.tags.has(tag);
    const el = document.createElement("button");
    el.type = "button";
    el.className = `cr-filter-tag${isActive ? " is-active" : ""}`;
    el.setAttribute("aria-pressed", String(isActive));
    el.dataset.tag = tag;
    el.textContent = tag;
    refs.tagsList.appendChild(el);
  });
};

const renderSortOptions = () => {
  refs.sortList?.querySelectorAll(".cr-filter-item").forEach((item) => {
    const isActive = item.dataset.sort === state.sortOrder;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
};

// =============================================================================
// PULSE VIEW
// =============================================================================

const parseCurrentSynthesis = (text) => {
  const result = {
    headline: "",
    lede: "",
    updated: "",
    summaryText: "",
    summaryParagraphs: [],
    summaryParagraphsClean: [],
    summaryParagraphEntries: [],
    summaryCitations: [],
    takeaways: [],
    activeIdeasSnapshot: [],
    openThreads: [],
    evidenceBase: [],
    changeLog: [],
  };
  if (!text) return result;

  const normalizeSectionKey = (value) => normalizeLookupKey(value || "");
  const cleanMarkdownInline = (value) =>
    (value || "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      .trim();

  const splitCitationList = (value, metadataBlocks = []) => {
    const segments = splitCitationSegments(value || "");
    return segments.map((segment, index) => {
      const metadata = metadataBlocks[index];
      return metadata ? `${segment} <!-- cite:${metadata} -->` : segment;
    });
  };

  const extractLeadingBoldSegment = (value) => {
    const match = value.match(/^\*\*([^*]+)\*\*\s*(.*)$/);
    if (!match) return null;
    return {
      label: cleanMarkdownInline(match[1]),
      rest: cleanMarkdownInline(match[2].replace(/^[:\-–]\s*/, "")),
    };
  };

  const TAKEAWAY_INLINE_CITATION_RE = /\[[^\]]*(?:DP\s*\d+|WL_\d{4}-\d{2}-\d{2}|[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)+_\d{4}-\d{2}-\d{2})[^\]]*\]/g;

  const buildMetadataOnlyTakeawayCitationInput = (metadata) => {
    const cleanedMetadata = cleanLineageText(metadata || "");
    if (!cleanedMetadata) return "";
    const pathMatch = cleanedMetadata.match(/(?:^|;)\s*path=([^;]+)\s*/i);
    const sourceLabel = pathMatch
      ? cleanLineageText(pathMatch[1]).split("/").pop().replace(/\.[^.]+$/, "")
      : "Source";
    const dpMatch = cleanedMetadata.match(/(?:^|;)\s*dp=([^;]+)\s*/i);
    const dpLabels = (dpMatch?.[1] || "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const dpNumber = entry.match(/\d+/)?.[0];
        return dpNumber ? `DP${dpNumber}` : cleanLineageText(entry);
      })
      .filter(Boolean);
    const base = dpLabels.length ? `${sourceLabel} ${dpLabels.join(", ")}` : sourceLabel;
    return `${base} <!-- cite:${cleanedMetadata} -->`;
  };

  const extractAllInlineCitations = (value) => {
    const metadataBlocks = extractCitationMetadataBlocks(value);
    const stripped = stripCitationMetadataBlocks(value);
    const citationPattern = /\[([^\]]*(?:DP\s*\d+|WL_\d{4}-\d{2}-\d{2}|[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)+_\d{4}-\d{2}-\d{2})[^\]]*)\]/g;
    const allSegments = [];
    let match;
    while ((match = citationPattern.exec(stripped)) !== null) {
      const raw = match[1].trim();
      const segments = splitCitationSegments(raw);
      segments.forEach((seg) => allSegments.push(seg));
    }
    const decorated = allSegments.map((segment, index) => {
      const metadata = metadataBlocks[index];
      return metadata ? `${segment} <!-- cite:${metadata} -->` : segment;
    });
    if (metadataBlocks.length > allSegments.length) {
      metadataBlocks.slice(allSegments.length).forEach((metadata) => {
        const extra = buildMetadataOnlyTakeawayCitationInput(metadata);
        if (extra) decorated.push(extra);
      });
    }
    if (!decorated.length && metadataBlocks.length) {
      return metadataBlocks
        .map((metadata) => buildMetadataOnlyTakeawayCitationInput(metadata))
        .filter(Boolean);
    }
    return decorated;
  };

  const parseTakeawayLine = (value) => {
    const metadataBlocks = extractCitationMetadataBlocks(value);
    let textValue = stripCitationMetadataBlocks(value).trim();
    let citationRaw = "";
    const citationMatch = textValue.match(/\[([^\]]+)\]\s*$/);
    if (citationMatch) {
      citationRaw = citationMatch[1].trim();
      textValue = textValue.slice(0, citationMatch.index).trim();
    }

    let title = "";
    let detail = "";
    const lead = extractLeadingBoldSegment(textValue);
    if (lead) {
      title = lead.label;
      detail = lead.rest;
    } else {
      const sentenceMatch = textValue.match(/^(.+?[.!?])\s+(.*)$/);
      if (sentenceMatch) {
        title = cleanMarkdownInline(sentenceMatch[1]);
        detail = cleanMarkdownInline(sentenceMatch[2]);
      } else {
        title = cleanMarkdownInline(textValue);
      }
    }

    return {
      title,
      detail,
      fullText: cleanMarkdownInline(textValue),
      citationRaw,
      citations: splitCitationList(citationRaw, metadataBlocks),
    };
  };

  const parseTakeawayBlock = (headerLine, bodyLines) => {
    const fullText = [headerLine, ...bodyLines].join(" ");
    const citations = extractAllInlineCitations(fullText);

    let title = "";
    const headerClean = stripCitationMetadataBlocks(headerLine).trim();
    const boldNumbered = headerClean.match(/^\*\*(?:\d+\.\s*)?(.+?)\*\*\s*$/);
    if (boldNumbered) {
      title = cleanMarkdownInline(boldNumbered[1]);
    } else {
      const markdownHeader = headerClean.match(/^#{3,6}\s+(?:\d+\.\s*)?(.+?)\s*$/);
      if (markdownHeader) {
        title = cleanMarkdownInline(markdownHeader[1]);
      } else {
        const lead = extractLeadingBoldSegment(headerClean);
        title = lead ? lead.label : cleanMarkdownInline(headerClean);
      }
    }

    const bodyRaw = bodyLines.join(" ");
    let detail = cleanMarkdownInline(stripCitationMetadataBlocks(bodyRaw));
    detail = detail.replace(TAKEAWAY_INLINE_CITATION_RE, " ").replace(/\s{2,}/g, " ").trim();

    const citationRaw = citations.map((c) => c.replace(/\s*<!--.*?-->\s*/g, "")).join("; ");

    return {
      title,
      detail,
      fullText: cleanMarkdownInline(stripCitationMetadataBlocks(fullText).replace(TAKEAWAY_INLINE_CITATION_RE, " ")),
      citationRaw,
      citations,
    };
  };

  const parseMarkdownTableRows = (lines) => {
    const tableLines = (lines || [])
      .map((line) => line.trim())
      .filter((line) => line.startsWith("|"));
    if (tableLines.length < 2) return [];

    const headers = tableLines[0].split("|").map((cell) => cell.trim()).filter(Boolean);
    const rows = [];
    tableLines.slice(1).forEach((line) => {
      if (line.includes("---")) return;
      const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
      if (!cells.length) return;
      const row = {};
      headers.forEach((header, index) => {
        row[header] = cleanMarkdownInline(cells[index] || "");
      });
      rows.push(row);
    });
    return rows;
  };

  const parseOpenThreads = (lines) => {
    const items = [];
    (lines || []).forEach((raw) => {
      const line = raw.trim();
      if (!line) return;

      let title = "";
      let detail = "";
      let match = line.match(/^\d+\.\s+\*\*([^*]+)\*\*\s*[—-]\s*(.+)$/);
      if (match) {
        title = cleanMarkdownInline(match[1]);
        detail = cleanMarkdownInline(match[2]);
      } else {
        match = line.match(/^\d+\.\s+(.+)$/);
        if (match) {
          const textOnly = cleanMarkdownInline(match[1]);
          const parts = textOnly.split(/\s+[—-]\s+/);
          title = (parts[0] || "").trim();
          detail = (parts.slice(1).join(" - ") || "").trim();
        } else {
          match = line.match(/^[-*]\s+\*\*([^*]+)\*\*\s*[—-]\s*(.+)$/);
          if (match) {
            title = cleanMarkdownInline(match[1]);
            detail = cleanMarkdownInline(match[2]);
          } else {
            match = line.match(/^[-*]\s+(.+)$/);
            if (match) {
              title = cleanMarkdownInline(match[1]);
            }
          }
        }
      }

      if (!title) return;
      items.push({ title, detail });
    });
    return items;
  };

  const parseEvidenceBase = (lines) => {
    const items = [];
    (lines || []).forEach((raw) => {
      const line = raw.trim();
      const boldMatch = line.match(/^[-*]\s+\*\*([^*]+)\*\*\s*(.*)$/);
      if (boldMatch) {
        items.push({
          label: cleanMarkdownInline(boldMatch[1]),
          value: cleanMarkdownInline(boldMatch[2]),
        });
        return;
      }
      const basicMatch = line.match(/^[-*]\s+(.+)$/);
      if (basicMatch) {
        items.push({
          label: cleanMarkdownInline(basicMatch[1]),
          value: "",
        });
      }
    });
    return items;
  };

  const parseChangeLog = (lines) => {
    const items = [];
    (lines || []).forEach((raw) => {
      const line = raw.trim();
      const match = line.match(/^[-*]\s+(.+)$/);
      if (match) items.push(cleanMarkdownInline(match[1]));
    });
    return items;
  };

  const parseSummaryChunk = (value) => {
    const metadataBlocks = extractCitationMetadataBlocks(value);
    const stripped = stripCitationMetadataBlocks(value);
    const citationPattern = /\[([^\]]*(?:DP\s*\d+|WL_\d{4}-\d{2}-\d{2})[^\]]*)\]/gi;
    const citations = [];
    let match;

    while ((match = citationPattern.exec(stripped)) !== null) {
      const raw = (match[1] || "").trim();
      const segments = splitCitationSegments(raw);
      segments.forEach((segment) => citations.push(segment));
    }

    const cleanText = cleanMarkdownInline(
      stripped.replace(/\[[^\]]*(?:DP\s*\d+|WL_\d{4}-\d{2}-\d{2})[^\]]*\]/gi, " "),
    ).replace(/\s+/g, " ").trim();

    const citationInputs = citations.map((citation, index) => {
      const metadata = metadataBlocks[index];
      return metadata ? `${citation} <!-- cite:${metadata} -->` : citation;
    });

    return { text: cleanText, citations: citationInputs };
  };

  const collectH2Sections = (value) => {
    const sections = new Map();
    let currentSection = "";
    normalizeNewlines(value).split("\n").forEach((raw) => {
      const h2 = raw.match(/^##\s+(.+)/);
      if (h2) {
        currentSection = normalizeSectionKey(h2[1]);
        if (!sections.has(currentSection)) sections.set(currentSection, []);
        return;
      }
      if (!currentSection) return;
      sections.get(currentSection).push(raw);
    });
    return sections;
  };

  const getSection = (sections, fragment) => {
    const target = normalizeSectionKey(fragment);
    for (const [key, lines] of sections.entries()) {
      if (key.includes(target)) return lines;
    }
    return [];
  };

  const updatedMatch = text.match(/^\s*\*\*Last Updated:\*\*\s*([^\n]+)\s*$/im);
  if (updatedMatch) result.updated = cleanMarkdownInline(updatedMatch[1]);

  const sections = collectH2Sections(text);
  const summaryLines = getSection(sections, "summary");
  const summaryRaw = summaryLines.join("\n").trim();
  const summaryChunks = summaryRaw
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  const parsedSummaryEntries = summaryChunks
    .map((chunk) => parseSummaryChunk(chunk))
    .map((chunk) => ({
      text: (chunk.text || "").replace(/\s+/g, " ").trim(),
      citations: (chunk.citations || [])
        .map((citation) => String(citation || "").trim())
        .filter(Boolean),
    }));
  const summaryParagraphs = parsedSummaryEntries
    .map((chunk) => chunk.text)
    .filter(Boolean)
    .map((chunk) => chunk.replace(/\s+/g, " ").trim());
  const summaryCitations = [];
  const summaryCitationSeen = new Set();
  parsedSummaryEntries.forEach((chunk) => {
    (chunk.citations || []).forEach((citation) => {
      const key = String(citation || "").trim();
      if (!key || summaryCitationSeen.has(key)) return;
      summaryCitationSeen.add(key);
      summaryCitations.push(key);
    });
  });
  const summaryText = summaryParagraphs.join(" ").trim();
  result.summaryText = summaryText;
  result.summaryParagraphs = summaryParagraphs.slice();
  result.summaryParagraphsClean = summaryParagraphs.slice();
  result.summaryParagraphEntries = parsedSummaryEntries
    .filter((entry) => entry.text)
    .map((entry) => ({ text: entry.text, citations: entry.citations.slice() }));
  result.summaryCitations = summaryCitations;

  if (summaryParagraphs.length) {
    const firstParagraph = summaryParagraphs[0];
    const firstSentenceMatch = firstParagraph.match(/^(.+?[.!?])\s*(.*)$/);
    if (firstSentenceMatch) {
      result.headline = firstSentenceMatch[1];
      const remainder = firstSentenceMatch[2].trim();
      const firstEntry = parsedSummaryEntries[0] || { text: "", citations: [] };
      const bodyEntries = parsedSummaryEntries
        .slice(1)
        .filter((entry) => entry.text)
        .map((entry) => ({ text: entry.text, citations: entry.citations.slice() }));
      if (remainder) {
        bodyEntries.unshift({
          text: remainder,
          citations: (firstEntry.citations || []).slice(),
        });
      }
      const bodyParagraphs = bodyEntries.map((entry) => entry.text).filter(Boolean);
      result.lede = remainder;
      result.summaryParagraphs = bodyParagraphs;
      result.summaryParagraphsClean = bodyParagraphs.slice();
      result.summaryParagraphEntries = bodyEntries;
      result.summaryText = bodyParagraphs.join(" ").trim();
    } else {
      result.headline = firstParagraph;
      const bodyEntries = parsedSummaryEntries
        .slice(1)
        .filter((entry) => entry.text)
        .map((entry) => ({ text: entry.text, citations: entry.citations.slice() }));
      result.summaryParagraphs = bodyEntries.map((entry) => entry.text);
      result.summaryParagraphsClean = result.summaryParagraphs.slice();
      result.summaryParagraphEntries = bodyEntries;
      result.summaryText = result.summaryParagraphs.join(" ").trim();
    }
  } else {
    result.headline = summaryText;
  }

  const takeawayLines = getSection(sections, "key takeaways");
  const isTakeawayHeaderLine = (value) => {
    const line = (value || "").trim();
    if (!line) return false;
    // Support both legacy bold headers and markdown subheaders in Key Takeaways.
    return /^\*\*(?:\d+\.\s*)?.+\*\*\s*$/.test(line) || /^#{3,6}\s+.+$/.test(line);
  };
  // Parse takeaways as blocks: bold header + body paragraphs
  // New format: **N. Title**\n\nParagraph with [Citation DP#] inline...
  // Old format: - **Title** detail text [Citation DP#]
  const takeawayBlocks = [];
  let currentHeader = null;
  let currentBody = [];
  const flushTakeawayBlock = () => {
    if (currentHeader) {
      takeawayBlocks.push({ header: currentHeader, body: currentBody });
    }
    currentHeader = null;
    currentBody = [];
  };
  takeawayLines.forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    // Detect block header from supported takeaway heading formats.
    const isHeader = isTakeawayHeaderLine(line);
    // Detect single-line format: - **Title** detail [Citation]  or  1. **Title** detail
    const isSingleLine = /^(?:[-*]|\d+\.)\s+\*\*[^*]+\*\*/.test(line) && !/^\*\*/.test(line);
    if (isHeader) {
      flushTakeawayBlock();
      currentHeader = line;
    } else if (isSingleLine && !currentHeader) {
      // Old single-line bullet format — parse directly with legacy parser
      const match = line.match(/^(?:[-*]|\d+\.)\s+(.+)/);
      if (match) result.takeaways.push(parseTakeawayLine(match[1]));
    } else if (currentHeader) {
      currentBody.push(line);
    }
  });
  flushTakeawayBlock();
  takeawayBlocks.forEach(({ header, body }) => {
    result.takeaways.push(parseTakeawayBlock(header, body));
  });
  if (!result.takeaways.length && takeawayLines.some((line) => line.trim())) {
    console.warn(
      "[CRIS] Key Takeaways section has content but no takeaways were parsed. Check heading format and parser rules.",
    );
  }

  const activeIdeaRows = parseMarkdownTableRows(getSection(sections, "active ideas"));
  result.activeIdeasSnapshot = activeIdeaRows.map((row) => ({
    idea: row["Idea"] || "",
    thesis: row["Core Thesis"] || "",
    evidence: row["Key Evidence"] || "",
  }));

  result.openThreads = parseOpenThreads(getSection(sections, "open threads"));
  result.evidenceBase = parseEvidenceBase(getSection(sections, "evidence base"));
  result.changeLog = parseChangeLog(getSection(sections, "what's changed"));

  return result;
};

const parseWeeklyInsights = (text) => {
  const detectDocumentType = (raw) => {
    if (!raw) return "incremental";
    if (/REBUILD NOTE:/i.test(raw) || /Rebuild Edition/i.test(raw)) return "rebuild";
    return "incremental";
  };

  const result = {
    title: "",
    documentType: "incremental",
    trends: [],
    openThreads: [],
    reflectionParagraphs: [],
  };
  if (!text) return result;

  result.documentType = detectDocumentType(text);

  const cleanMarkdownInline = (value) =>
    (value || "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      .replace(/\s+/g, " ")
      .trim();

  const cleanDisplayText = (value) =>
    cleanMarkdownInline(stripCitationMetadataBlocks(value || "").replace(/\[[^\]]*(?:DP\s*\d+|WL_\d{4}-\d{2}-\d{2})[^\]]*\]/gi, ""));

  const normalizeSectionKey = (value) => normalizeLookupKey(value || "");
  const sections = new Map();
  let currentSection = "";
  const lines = normalizeNewlines(text).split("\n");

  const titleMatch = text.match(/^#\s+(.+)$/m);
  if (titleMatch) result.title = cleanMarkdownInline(titleMatch[1]);

  lines.forEach((raw) => {
    const h2 = raw.match(/^##\s+(.+)/);
    if (h2) {
      currentSection = normalizeSectionKey(h2[1]);
      if (!sections.has(currentSection)) sections.set(currentSection, []);
      return;
    }
    if (!currentSection) return;
    sections.get(currentSection).push(raw);
  });

  const getSection = (fragment) => {
    const target = normalizeSectionKey(fragment);
    for (const [key, value] of sections.entries()) {
      if (key.includes(target)) return value;
    }
    return [];
  };

  const toParagraphs = (rawLines) => {
    const paragraphs = [];
    let buffer = [];
    const flush = () => {
      const textValue = cleanDisplayText(buffer.join(" "));
      if (textValue) paragraphs.push(textValue);
      buffer = [];
    };

    (rawLines || []).forEach((raw) => {
      const line = raw.trim();
      if (!line) {
        flush();
        return;
      }
      if (line.startsWith("<!--")) return;
      buffer.push(line);
    });
    flush();
    return paragraphs;
  };

  const buildCitationInputFromLine = (line) => {
    const metadataBlocks = extractCitationMetadataBlocks(line || "");
    const segments = splitCitationSegments(line || "");
    if (!segments.length) return "";
    let citation = `[${segments.join("; ")}]`;
    metadataBlocks.forEach((metadata) => {
      citation += ` <!-- cite:${metadata} -->`;
    });
    return citation;
  };

  const trendLines = getSection("synthesis by tag");
  const trendBlocks = [];
  let activeTrend = null;

  trendLines.forEach((raw) => {
    const headingMatch = raw.trim().match(/^###\s+(#\S+)/);
    if (headingMatch) {
      if (activeTrend) trendBlocks.push(activeTrend);
      activeTrend = { tag: cleanMarkdownInline(headingMatch[1]), lines: [] };
      return;
    }
    if (!activeTrend) return;
    activeTrend.lines.push(raw);
  });
  if (activeTrend) trendBlocks.push(activeTrend);

  trendBlocks.forEach((trend) => {
    const record = {
      tag: trend.tag,
      summary: "",
      whatShiftedOrNew: "",
      whatShiftedOrNewLabel: "",
      whatHeldSteady: "",
      connections: [],
      subtrends: [],
    };
    let activeSubtrend = null;
    let activeCitationIndex = -1;
    let paragraphBuffer = [];
    let inConnectionList = false;
    let inKeyDevelopmentsList = false;

    const startSubtrend = () => {
      const subtrend = {
        title: "",
        paragraphs: [],
        citations: [],
      };
      record.subtrends.push(subtrend);
      activeSubtrend = subtrend;
      return subtrend;
    };

    const ensureSubtrendForParagraph = () => {
      if (!activeSubtrend) return startSubtrend();
      if (activeSubtrend.paragraphs.length && activeSubtrend.citations.length) {
        return startSubtrend();
      }
      return activeSubtrend;
    };

    const flushParagraphBuffer = () => {
      const paragraphText = cleanDisplayText(paragraphBuffer.join(" "));
      if (paragraphText) {
        const subtrend = ensureSubtrendForParagraph();
        subtrend.paragraphs.push(paragraphText);
      }
      paragraphBuffer = [];
      activeCitationIndex = -1;
    };

    trend.lines.forEach((raw) => {
      const line = raw.trim();
      if (!line) {
        flushParagraphBuffer();
        return;
      }

      if (line.startsWith("<!--")) {
        if (activeSubtrend && activeCitationIndex >= 0 && activeSubtrend.citations[activeCitationIndex]) {
          const metadataBlocks = extractCitationMetadataBlocks(line);
          metadataBlocks.forEach((metadata) => {
            activeSubtrend.citations[activeCitationIndex] += ` <!-- cite:${metadata} -->`;
          });
        }
        return;
      }

      // Old format: **What shifted:** inline text  /  **What is new:** inline text
      const shiftedMatch = line.match(/^\*\*(What shifted|What is new):\*\*\s*(.+)$/i);
      if (shiftedMatch) {
        flushParagraphBuffer();
        record.whatShiftedOrNew = cleanDisplayText(shiftedMatch[2]);
        record.whatShiftedOrNewLabel = shiftedMatch[1];
        inConnectionList = false;
        inKeyDevelopmentsList = false;
        return;
      }

      // New format: **Key Developments:** header followed by bullet list
      if (/^\*\*Key Developments:\*\*$/i.test(line)) {
        flushParagraphBuffer();
        record.whatShiftedOrNewLabel = "Key Developments";
        inKeyDevelopmentsList = true;
        inConnectionList = false;
        return;
      }

      if (inKeyDevelopmentsList) {
        const bulletMatch = line.match(/^[-*]\s+(.+)/);
        if (bulletMatch) {
          const textValue = cleanDisplayText(bulletMatch[1]);
          if (textValue) {
            record.whatShiftedOrNew += (record.whatShiftedOrNew ? "\n" : "") + textValue;
          }
          return;
        }
        inKeyDevelopmentsList = false;
      }

      const steadyMatch = line.match(/^\*\*What held steady:\*\*\s*(.+)$/i);
      if (steadyMatch) {
        flushParagraphBuffer();
        record.whatHeldSteady = cleanDisplayText(steadyMatch[1]);
        inConnectionList = false;
        inKeyDevelopmentsList = false;
        return;
      }

      // Old format: **Connection to Current Understanding:**
      // New format: **Connection to Active Ideas:**
      if (/^\*\*Connection to (?:Current Understanding|Active Ideas):\*\*$/i.test(line)) {
        flushParagraphBuffer();
        inConnectionList = true;
        inKeyDevelopmentsList = false;
        return;
      }

      if (inConnectionList) {
        const bulletMatch = line.match(/^[-*]\s+(.+)/);
        if (bulletMatch) {
          const textValue = cleanDisplayText(bulletMatch[1]);
          if (textValue) record.connections.push(textValue);
          return;
        }
        inConnectionList = false;
      }

      const citationLine = stripCitationMetadataBlocks(line);
      if (/^\[[^\]]+\]$/.test(citationLine)) {
        flushParagraphBuffer();
        const citationInput = buildCitationInputFromLine(line);
        if (!citationInput) return;
        const subtrend = activeSubtrend || startSubtrend();
        subtrend.citations.push(citationInput);
        activeCitationIndex = subtrend.citations.length - 1;
        return;
      }

      paragraphBuffer.push(raw);
    });

    flushParagraphBuffer();

    record.subtrends = record.subtrends
      .map((subtrend, index) => {
        const firstParagraph = (subtrend.paragraphs || []).find(Boolean) || "";
        let title = "";
        if (firstParagraph) {
          const sentenceMatch = firstParagraph.match(/^(.{1,120}?[.!?])(?:\s|$)/);
          title = (sentenceMatch ? sentenceMatch[1] : firstParagraph)
            .replace(/[.!?]+$/g, "")
            .trim();
          if (title.length > 96) {
            title = `${title.slice(0, 93).trimEnd()}...`;
          }
        }
        if (!title) title = `Subtrend ${index + 1}`;
        return {
          ...subtrend,
          title,
        };
      })
      .filter((subtrend) => subtrend.paragraphs.length || subtrend.citations.length);

    if (!record.summary && record.subtrends.length) {
      record.summary = record.subtrends[0].paragraphs[0] || "";
    }

    if (record.tag && (record.summary || record.whatShiftedOrNew || record.whatHeldSteady || record.connections.length || record.subtrends.length)) {
      result.trends.push(record);
    }
  });

  const openThreadLines = getSection("open threads");
  openThreadLines.forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    // Try em-dash / hyphen separator first (incremental format: **Title** — detail)
    let numbered = line.match(/^\d+\.\s+\*\*([^*]+)\*\*\s*[—-]\s*(.+)$/);
    if (!numbered) {
      // Try colon separator (rebuild format: **Title (Category):** detail)
      numbered = line.match(/^\d+\.\s+\*\*([^*]+)\*\*:\s*(.+)$/);
    }
    if (numbered) {
      result.openThreads.push({
        title: cleanDisplayText(numbered[1]),
        detail: cleanDisplayText(numbered[2]),
      });
      return;
    }
    const fallback = line.match(/^\d+\.\s+(.+)$/);
    if (fallback) {
      result.openThreads.push({
        title: cleanDisplayText(fallback[1]),
        detail: "",
      });
    }
  });

  result.reflectionParagraphs = toParagraphs(getSection("reflection"));
  return result;
};

const parseActiveIdeas = (text) => {
  return parseActiveIdeasDocument(text).ideas;
};

const parseTalkingPointsDocument = (text) => {
  const meta = {
    title: "",
    subtitle: "",
    date: "",
    preparedBy: "",
    nextUpdate: "",
    dataPointsSynthesized: "",
    researchPeriod: "",
    keyFrameworks: "",
    sourcePath: "",
  };
  if (!text) return {
    meta,
    points: [],
    quickReferenceRows: [],
    conversationStarterGroups: [],
  };

  const lines = normalizeNewlines(text).split("\n");
  const titleMatch = text.match(/^\s*#\s+(.+)\s*$/m);
  if (titleMatch) {
    meta.title = cleanLineageText(titleMatch[1]);
  }

  const readMetaLine = (label) => {
    const pattern = new RegExp(`^\\s*\\*\\*${label}:\\*\\*\\s*([^\\n]+)\\s*$`, "im");
    const match = text.match(pattern);
    return match ? cleanLineageText(match[1]) : "";
  };

  meta.date = readMetaLine("Date");
  meta.preparedBy = readMetaLine("Prepared by");
  meta.nextUpdate = readMetaLine("Next Update");
  meta.dataPointsSynthesized = readMetaLine("Data Points Synthesized");
  meta.researchPeriod = readMetaLine("Research Period");
  meta.keyFrameworks = readMetaLine("Key Frameworks");

  const parseSubtitleParts = (value) => {
    const subtitle = cleanLineageText(value || "");
    if (!subtitle) return;
    if (!meta.subtitle) meta.subtitle = subtitle;
    const parts = subtitle.split("|").map((part) => cleanLineageText(part)).filter(Boolean);
    if (!parts.length) return;
    const dateMatch = parts[0].match(/\b([A-Za-z]+ \d{1,2}, \d{4})\b/);
    if (dateMatch && !meta.date) {
      meta.date = cleanLineageText(dateMatch[1]);
    }
    if (parts.length > 1 && !meta.preparedBy) {
      meta.preparedBy = cleanLineageText(parts[1]);
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    const h2Match = line.match(/^##\s+(.+)$/);
    if (!h2Match) return;
    const heading = cleanLineageText(h2Match[1]);
    if (!heading) return;
    if (!meta.subtitle) {
      const normalizedHeading = normalizeLookupKey(heading);
      const isPointHeading = /^tp\s*\d+/.test(normalizedHeading) || /^talking point\s+\d+/.test(normalizedHeading);
      if (!isPointHeading && !normalizedHeading.includes("quick reference card")) {
        parseSubtitleParts(heading);
      }
    }
  });

  const normalizeTalkingPointSectionKey = (value) =>
    normalizeLookupKey(value || "")
      .replace(/\s+/g, " ")
      .trim();

  const getTalkingPointSectionLines = (sections, sectionKeys = []) => {
    const normalizedTargets = sectionKeys
      .map((key) => normalizeTalkingPointSectionKey(key))
      .filter(Boolean);
    if (!normalizedTargets.length) return [];

    for (const target of normalizedTargets) {
      if (sections[target]) return sections[target];
    }

    const sectionEntries = Object.entries(sections);
    for (const [key, values] of sectionEntries) {
      if (normalizedTargets.some((target) => key.includes(target))) {
        return values;
      }
    }

    return [];
  };

  const pointRecords = [];
  let currentPoint = null;
  let section = "";
  let sectionLines = [];

  const flushSection = () => {
    if (!currentPoint || !section) return;
    currentPoint.sections[normalizeTalkingPointSectionKey(section)] = sectionLines.slice();
    sectionLines = [];
  };

  const flushPoint = () => {
    if (!currentPoint) return;
    flushSection();
    pointRecords.push(currentPoint);
    currentPoint = null;
    section = "";
    sectionLines = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    const pointHeading = line.match(/^##\s+(?:TP\s*(\d+)|Talking\s+Point\s+(\d+))\s*:\s*(.+)$/i);
    if (pointHeading) {
      flushPoint();
      const number = Number(pointHeading[1] || pointHeading[2] || 0);
      const cleanedTitle = cleanLineageText(pointHeading[3]).replace(/^["']|["']$/g, "").trim();
      currentPoint = {
        order: pointRecords.length,
        number: Number.isInteger(number) && number > 0 ? number : null,
        rawTitle: cleanedTitle,
        title: cleanedTitle,
        sections: {},
      };
      section = "";
      sectionLines = [];
      return;
    }

    if (!currentPoint) return;

    if (/^##\s+/.test(line)) {
      flushPoint();
      return;
    }

    const sectionHeading = line.match(/^###\s+(.+)/);
    if (sectionHeading) {
      flushSection();
      section = sectionHeading[1].trim();
      return;
    }

    if (!section) return;
    sectionLines.push(rawLine);
  });

  flushPoint();

  const parseAudienceRows = (rows = []) => {
    const tableRows = parseMarkdownTableRows(rows);
    if (!tableRows.length) return [];

    const readValue = (row, candidates = []) => {
      const entries = Object.entries(row || {});
      for (const candidate of candidates) {
        const target = normalizeLookupKey(candidate);
        const found = entries.find(([key]) => normalizeLookupKey(key) === target);
        if (found) {
          const cleaned = cleanLineageText(found[1]);
          if (cleaned) return cleaned;
        }
      }
      return "";
    };

    return tableRows
      .map((row) => ({
        audience: readValue(row, ["Audience"]),
        concern: readValue(row, ["Concern", "Their Angle", "Angle"]),
        conversationHook: readValue(row, ["Conversation Hook", "Hook"]),
      }))
      .filter((row) => row.audience || row.concern || row.conversationHook);
  };

  const citationPattern = /\[([^\]]*(?:DP\s*\d+|WL_\d{4}-\d{2}-\d{2})[^\]]*)\]/gi;

  const buildMetadataOnlyCitationInput = (metadata) => {
    const cleanedMetadata = cleanLineageText(metadata || "");
    if (!cleanedMetadata) return "";
    const pathMatch = cleanedMetadata.match(/(?:^|;)\s*path=([^;]+)\s*/i);
    const sourceLabel = pathMatch
      ? cleanLineageText(pathMatch[1]).split("/").pop().replace(/\.[^.]+$/, "")
      : "Source";
    const dpMatch = cleanedMetadata.match(/(?:^|;)\s*dp=([^;]+)\s*/i);
    const dpLabels = (dpMatch?.[1] || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => {
        const dpNumber = value.match(/\d+/)?.[0];
        return dpNumber ? `DP${dpNumber}` : cleanLineageText(value);
      })
      .filter(Boolean);
    const base = dpLabels.length ? `${sourceLabel} ${dpLabels.join(", ")}` : sourceLabel;
    return `${base} <!-- cite:${cleanedMetadata} -->`;
  };

  const parseCitationInputsFromLine = (value) => {
    if (!value) return [];
    const metadataBlocks = extractCitationMetadataBlocks(value);
    const stripped = stripCitationMetadataBlocks(value);
    const segments = [];
    let match;
    while ((match = citationPattern.exec(stripped)) !== null) {
      const citationRaw = (match[1] || "").trim();
      splitCitationSegments(citationRaw).forEach((segment) => {
        const cleanedSegment = cleanLineageText(segment);
        if (cleanedSegment) segments.push(cleanedSegment);
      });
    }
    citationPattern.lastIndex = 0;

    if (segments.length) {
      return segments.map((segment, index) => {
        const metadata = metadataBlocks[index];
        return metadata ? `${segment} <!-- cite:${metadata} -->` : segment;
      });
    }

    if (metadataBlocks.length) {
      return metadataBlocks
        .map((metadata) => buildMetadataOnlyCitationInput(metadata))
        .filter(Boolean);
    }

    return [];
  };

  const applyMetadataToCitations = (citationInputs, metadataBlocks = []) => {
    if (!metadataBlocks.length) return citationInputs;
    if (!citationInputs.length) {
      return metadataBlocks
        .map((metadata) => buildMetadataOnlyCitationInput(metadata))
        .filter(Boolean);
    }

    const decorated = citationInputs.map((input, index) => {
      const metadata = metadataBlocks[index];
      if (!metadata) return input;
      if (/<!--\s*cite:/i.test(input)) return input;
      return `${input} <!-- cite:${metadata} -->`;
    });

    if (metadataBlocks.length > citationInputs.length) {
      metadataBlocks.slice(citationInputs.length).forEach((metadata) => {
        const extra = buildMetadataOnlyCitationInput(metadata);
        if (extra) decorated.push(extra);
      });
    }
    return decorated;
  };

  const parseEvidenceSection = (sectionLinesRaw = []) => {
    const entries = [];

    sectionLinesRaw.forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line || line.startsWith("|")) return;

      const metadataOnly = line.match(/^<!--\s*cite:([^>]+)\s*-->$/i);
      if (metadataOnly) {
        if (!entries.length) return;
        const metadataBlocks = extractCitationMetadataBlocks(line);
        const last = entries[entries.length - 1];
        last.citationInputs = applyMetadataToCitations(last.citationInputs || [], metadataBlocks);
        return;
      }

      const bulletMatch = line.match(/^[-*]\s+(.+)$/) || line.match(/^\d+\.\s+(.+)$/);
      const lineValue = bulletMatch ? bulletMatch[1].trim() : line;
      const citationInputs = parseCitationInputsFromLine(lineValue);
      const displayText = stripCitationMetadataBlocks(lineValue)
        .replace(citationPattern, " ")
        .replace(/\s{2,}/g, " ")
        .trim();

      if (displayText) {
        entries.push({
          text: displayText,
          citationInputs,
        });
        return;
      }

      if (citationInputs.length && entries.length) {
        const last = entries[entries.length - 1];
        last.citationInputs = [...(last.citationInputs || []), ...citationInputs];
      }
    });

    const evidenceItems = entries
      .map((entry) => String(entry.text || "").replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const evidenceCitations = [...new Set(
      entries
        .flatMap((entry) => entry.citationInputs || [])
        .map((citation) => cleanLineageText(citation) ? citation : "")
        .filter(Boolean),
    )];

    return {
      evidenceItems,
      evidenceCitations,
    };
  };

  const normalizeTalkingPointKey = (number, title) => {
    const normalized = cleanLineageText(`${number || ""} ${title || ""}`)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (normalized) return normalized;
    if (number) return `tp-${number}`;
    return "tp-untitled";
  };

  const points = pointRecords.map((point) => {
    const sections = point.sections || {};
    const pointLines = getTalkingPointSectionLines(sections, ["the point"]);
    const whyLines = getTalkingPointSectionLines(sections, ["why it matters"]);
    const whoCaresLines = getTalkingPointSectionLines(sections, ["who cares"]);
    const evidenceLines = getTalkingPointSectionLines(sections, ["evidence"]);
    const yourAngleLines = getTalkingPointSectionLines(sections, ["your angle"]);
    const pivotLines = getTalkingPointSectionLines(sections, ["pivot phrases"]);
    const evidenceSection = parseEvidenceSection(evidenceLines);

    return {
      kind: "talking-point",
      number: point.number,
      title: cleanLineageText(point.title),
      key: normalizeTalkingPointKey(point.number, point.title || `point-${point.order + 1}`),
      pointParagraphs: parseSectionItems(pointLines).map((entry) => cleanLineageText(entry)).filter(Boolean),
      // Preserve inline markdown emphasis (for labels like **Business:**) for renderInlineMarkdownBold.
      whyItMattersItems: parseSectionItems(whyLines).map((entry) => String(entry || "").trim()).filter(Boolean),
      whoCaresRows: parseAudienceRows(whoCaresLines),
      evidenceItems: evidenceSection.evidenceItems.length
        ? evidenceSection.evidenceItems
        : parseSectionItems(evidenceLines).map((entry) => String(entry || "").trim()).filter(Boolean),
      evidenceCitations: evidenceSection.evidenceCitations,
      yourAngleParagraphs: parseSectionItems(yourAngleLines).map((entry) => cleanLineageText(entry)).filter(Boolean),
      pivotPhrases: parseSectionItems(pivotLines).map((entry) => cleanLineageText(entry)).filter(Boolean),
    };
  });

  const quickReferenceRows = [];
  const conversationStarterGroups = [];
  let activeH2Heading = "";
  let activeH2Lines = [];

  const parseConversationStarterGroups = (sectionLines = []) => {
    const groups = [];
    let currentGroup = null;

    const ensureGroup = () => {
      if (currentGroup) return currentGroup;
      currentGroup = { title: "", starters: [] };
      groups.push(currentGroup);
      return currentGroup;
    };

    sectionLines.forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line || line === "---") return;
      if (line.startsWith("|")) return;

      const headingMatch = line.match(/^\*\*(.+?)\*\*\s*$/);
      if (headingMatch) {
        const headingLabel = cleanLineageText(headingMatch[1]).replace(/:\s*$/, "").trim();
        if (!headingLabel) return;
        currentGroup = { title: headingLabel, starters: [] };
        groups.push(currentGroup);
        return;
      }

      const bulletMatch = line.match(/^[-*]\s+(.+)/);
      const starterText = cleanLineageText(bulletMatch ? bulletMatch[1] : line);
      if (!starterText) return;
      ensureGroup().starters.push(starterText);
    });

    return groups.filter((group) => group.title || group.starters.length);
  };

  const flushH2Section = () => {
    const normalizedHeading = normalizeLookupKey(activeH2Heading || "");
    if (normalizedHeading.includes("quick reference card")) {
      quickReferenceRows.push(...parseMarkdownTableRows(activeH2Lines));
    }
    if (normalizedHeading.includes("conversation starters")) {
      conversationStarterGroups.push(...parseConversationStarterGroups(activeH2Lines));
    }
    activeH2Lines = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    const h2Match = line.match(/^##\s+(.+)/);
    if (h2Match) {
      flushH2Section();
      activeH2Heading = cleanLineageText(h2Match[1]);
      return;
    }
    if (!activeH2Heading) return;
    activeH2Lines.push(rawLine);
  });
  flushH2Section();

  return {
    meta,
    points,
    quickReferenceRows,
    conversationStarterGroups,
  };
};

const parseActiveIdeasDocument = (text) => {
  const meta = {
    lastUpdated: "",
    totalActiveIdeas: "",
    evidenceBase: "",
  };
  if (!text) return { ideas: [], meta };

  const lastUpdatedMatch = text.match(/^\s*\*\*Last Updated:\*\*\s*([^\n]+)\s*$/im);
  if (lastUpdatedMatch) meta.lastUpdated = cleanLineageText(lastUpdatedMatch[1]);

  const totalIdeasMatch = text.match(/^\s*\*\*Total Active Ideas:\*\*\s*([^\n]+)\s*$/im);
  if (totalIdeasMatch) meta.totalActiveIdeas = cleanLineageText(totalIdeasMatch[1]);

  const evidenceBaseMatch = text.match(/^\s*\*\*Evidence Base:\*\*\s*([^\n]+)\s*$/im);
  if (evidenceBaseMatch) meta.evidenceBase = cleanLineageText(evidenceBaseMatch[1]);

  const lines = normalizeNewlines(text).split("\n");
  const ideas = [];
  let current = null;
  let section = "";
  let sectionLines = [];

  const normalizeIdeaSectionKey = (value) =>
    normalizeLookupKey(value || "")
      .replace(/\s+/g, " ")
      .trim();

  const getIdeaSectionLines = (sections, sectionKeys = []) => {
    const normalizedTargets = sectionKeys
      .map((key) => normalizeIdeaSectionKey(key))
      .filter(Boolean);
    if (!normalizedTargets.length) return [];

    for (const target of normalizedTargets) {
      if (sections[target]) return sections[target];
    }

    const sectionEntries = Object.entries(sections);
    for (const [key, values] of sectionEntries) {
      if (normalizedTargets.some((target) => key.includes(target))) {
        return values;
      }
    }

    return [];
  };

  const flushSection = () => {
    if (!current || !section) return;
    current.sections[normalizeIdeaSectionKey(section)] = sectionLines.slice();
    sectionLines = [];
  };

  const flushIdea = () => {
    if (!current) return;
    flushSection();
    ideas.push(current);
    current = null;
  };

  lines.forEach((raw) => {
    const line = raw.trim();
    const ideaHeading = line.match(/^##\s+Idea\s+(\d+)\s*:\s*(.+)$/i);
    if (ideaHeading) {
      flushIdea();
      current = {
        order: ideas.length,
        number: Number(ideaHeading[1]),
        rawTitle: ideaHeading[2].trim(),
        title: ideaHeading[2].trim(),
        status: "",
        confidence: "",
        tags: [],
        sections: {},
      };
      section = "";
      sectionLines = [];
      return;
    }

    if (!current) return;

    const sectionHeading = line.match(/^###\s+(.+)/);
    if (sectionHeading) {
      flushSection();
      section = sectionHeading[1].trim();
      return;
    }

    if (!section) {
      const statusMatch = line.match(/^\*\*Status:\*\*\s*(.+)$/i);
      if (statusMatch) {
        current.status = statusMatch[1].trim();
        return;
      }
      const confidenceMatch = line.match(/^\*\*Confidence:\*\*\s*(.+)$/i);
      if (confidenceMatch) {
        current.confidence = confidenceMatch[1].trim();
        return;
      }
      const tagsMatch = line.match(/^\*\*Tags:\*\*\s*(.+)$/i);
      if (tagsMatch) {
        current.tags = tagsMatch[1].split(",").map((t) => t.trim()).filter(Boolean);
        return;
      }
      return;
    }

    sectionLines.push(raw);
  });

  flushIdea();

  const parseIdeaCounterarguments = (lines = []) => {
    const tableLines = lines.filter((line) => line.trim().startsWith("|"));
    if (tableLines.length >= 2) {
      const headerCells = tableLines[0]
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean)
        .map((cell) => normalizeLookupKey(cell));

      const challengeIndex = headerCells.findIndex((cell) => cell.includes("challenge"));
      const sourceIndex = headerCells.findIndex((cell) => cell === "source");
      const dpIndex = headerCells.findIndex((cell) => cell === "dp" || cell === "dps");

      if (challengeIndex !== -1) {
        const applyCitationMetadata = (segments = [], metadataBlocks = []) =>
          segments.map((segment, index) => {
            const metadata = metadataBlocks[index];
            return metadata ? `${segment} <!-- cite:${metadata} -->` : segment;
          });

        const buildCounterargumentCitations = (sourceRaw = "", dpRaw = "", metadataBlocks = []) => {
          const inlineMetadataBlocks = extractCitationMetadataBlocks(sourceRaw);
          const mergedMetadata = [...inlineMetadataBlocks, ...metadataBlocks];

          const sourceSegments = splitCitationSegments(sourceRaw);
          if (sourceSegments.length) {
            return applyCitationMetadata(sourceSegments, mergedMetadata);
          }

          const sourceClean = cleanLineageText(
            stripCitationMetadataBlocks(sourceRaw)
              .replace(/^\[\s*/, "")
              .replace(/\s*\]$/, ""),
          );
          const dpClean = cleanLineageText(stripCitationMetadataBlocks(dpRaw));
          const fallbackSegment = [sourceClean, dpClean].filter(Boolean).join(" ").trim();
          if (!fallbackSegment) return [];

          return applyCitationMetadata([fallbackSegment], mergedMetadata);
        };

        const rows = [];
        for (let rowIndex = 1; rowIndex < tableLines.length; rowIndex += 1) {
          const row = tableLines[rowIndex];
          if (row.includes("---")) continue;
          const cells = row.split("|").map((cell) => cell.trim()).filter(Boolean);
          if (cells.length <= challengeIndex) continue;

          const challengeRaw = cells[challengeIndex] || "";
          const metadataOnlyRow = cells.length === 1 && /<!--\s*cite:/i.test(challengeRaw);
          if (metadataOnlyRow) {
            continue;
          }

          const sourceRaw = sourceIndex >= 0 ? (cells[sourceIndex] || "") : "";
          const dpRaw = dpIndex >= 0 ? (cells[dpIndex] || "") : "";
          const challenge = cleanLineageText(stripCitationMetadataBlocks(challengeRaw));
          const source = cleanLineageText(
            stripCitationMetadataBlocks(sourceRaw)
              .replace(/^\[\s*/, "")
              .replace(/\s*\]$/, ""),
          );
          const dp = cleanLineageText(stripCitationMetadataBlocks(dpRaw));

          if (!challenge) continue;

          let metadataBlocks = [];
          const nextRow = tableLines[rowIndex + 1] || "";
          if (nextRow) {
            const nextCells = nextRow.split("|").map((cell) => cell.trim()).filter(Boolean);
            const nextIsMetadataOnly = nextCells.length === 1 && /<!--\s*cite:/i.test(nextCells[0] || "");
            if (nextIsMetadataOnly) {
              metadataBlocks = extractCitationMetadataBlocks(nextCells[0]);
              rowIndex += 1;
            }
          }

          const citations = buildCounterargumentCitations(sourceRaw, dpRaw, metadataBlocks);
          rows.push({
            challenge,
            source,
            dp,
            citations,
          });
        }

        if (rows.length) return rows;
      }
    }

    return parseSectionItems(lines).map((challenge) => ({
      challenge: cleanLineageText(challenge),
      source: "",
      dp: "",
      citations: [],
    }));
  };

  const parseRelatedIdeas = (lines = [], currentIdeaNumber = null) => {
    const sectionItems = parseSectionItems(lines).map((item) => cleanLineageText(item)).filter(Boolean);
    const sectionText = sectionItems.join(" ");
    const numbers = new Set();
    const labels = [];

    const numberMatches = sectionText.matchAll(/\bIdea(?:s)?\b([^.;\n]*)/gi);
    for (const match of numberMatches) {
      const chunk = match[1] || "";
      const chunkNumbers = chunk.match(/\b\d+\b/g) || [];
      chunkNumbers.forEach((value) => {
        const parsed = Number(value);
        if (Number.isInteger(parsed) && parsed > 0) numbers.add(parsed);
      });
    }

    const directMatches = sectionText.matchAll(/\bIdea\s+(\d+)\b/gi);
    for (const match of directMatches) {
      const parsed = Number(match[1]);
      if (Number.isInteger(parsed) && parsed > 0) numbers.add(parsed);
    }

    if (Number.isInteger(currentIdeaNumber)) {
      numbers.delete(currentIdeaNumber);
    }

    const sortedNumbers = [...numbers].sort((left, right) => left - right);
    if (sortedNumbers.length) {
      sortedNumbers.forEach((number) => labels.push(`Idea ${number}`));
    } else if (sectionItems.length) {
      labels.push(...sectionItems);
    }

    return {
      relatedIdeaNumbers: sortedNumbers,
      relatedIdeaLabels: labels,
    };
  };

  const parsedIdeas = ideas.map((idea) => {
    const sections = idea.sections;
    const currentPosition = getIdeaSectionLines(sections, ["current position"]);
    const driversLines = getIdeaSectionLines(sections, ["drivers"]);
    const evidenceLines = getIdeaSectionLines(sections, ["supporting evidence", "supporting citations"]);
    const questionsLines = getIdeaSectionLines(sections, ["open questions"]);
    const counterargumentLines = getIdeaSectionLines(sections, ["counterarguments", "counter arguments", "challenges"]);
    const observationsLines = getIdeaSectionLines(sections, ["user observations integrated", "user observations"]);
    const relatedIdeasLines = getIdeaSectionLines(sections, ["related ideas", "related idea"]);
    const evolutionLines = getIdeaSectionLines(sections, ["evolution log", "evolution"]);

    const positionItems = parseSectionItems(currentPosition);
    const drivers = parseSectionItems(driversLines);
    const evidence = parseEvidenceTable(evidenceLines);
    const counterarguments = parseIdeaCounterarguments(counterargumentLines);
    const userObservations = parseSectionItems(observationsLines).map((item) => cleanLineageText(item)).filter(Boolean);
    const relatedIdeaMeta = parseRelatedIdeas(relatedIdeasLines, idea.number);
    const evolutionLog = parseSectionItems(evolutionLines);
    const openQuestions = parseSectionItems(questionsLines).map((item) => cleanLineageText(item)).filter(Boolean);

    return {
      ...idea,
      title: idea.title.replace(/^Idea\s+\d+\s*:\s*/i, "").trim(),
      summary: positionItems[0] || "",
      positionItems,
      drivers,
      evidence,
      counterarguments,
      userObservations,
      relatedIdeaNumbers: relatedIdeaMeta.relatedIdeaNumbers,
      relatedIdeaLabels: relatedIdeaMeta.relatedIdeaLabels,
      relatedIdeas: [],
      evolutionLog,
      openQuestions,
      key: normalizeIdeaTitle(idea.title),
    };
  });

  const ideasByNumber = new Map(parsedIdeas.map((idea) => [idea.number, idea]));
  const finalizedIdeas = parsedIdeas.map((idea) => {
    const relatedIdeas = (idea.relatedIdeaNumbers || []).map((number) => {
      const relatedIdea = ideasByNumber.get(number);
      if (relatedIdea) {
        return {
          number,
          key: relatedIdea.key,
          title: relatedIdea.title,
        };
      }
      return {
        number,
        key: "",
        title: `Idea ${number}`,
      };
    });

    const numericLabelSet = new Set((idea.relatedIdeaNumbers || []).map((number) => `Idea ${number}`));
    const fallbackLabels = (idea.relatedIdeaLabels || [])
      .map((label) => cleanLineageText(label))
      .filter(Boolean)
      .filter((label) => !numericLabelSet.has(label));

    return {
      ...idea,
      relatedIdeas,
      relatedIdeaLabels: fallbackLabels,
    };
  });

  return {
    ideas: finalizedIdeas,
    meta,
  };
};

const parseSectionItems = (lines) => {
  const items = [];
  let buffer = [];
  const flush = () => {
    const text = buffer.join(" ").replace(/\s+/g, " ").trim();
    if (text) items.push(text);
    buffer = [];
  };

  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) {
      flush();
      return;
    }
    const bullet = line.match(/^[-*]\s+(.+)/);
    if (bullet) {
      flush();
      items.push(bullet[1].trim());
      return;
    }
    buffer.push(line);
  });
  flush();
  return items;
};

const parseMarkdownTableRows = (lines = []) => {
  const tableLines = (lines || [])
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"));
  if (tableLines.length < 2) return [];

  const headers = tableLines[0]
    .split("|")
    .map((cell) => cleanLineageText(cell))
    .filter(Boolean);
  if (!headers.length) return [];

  const rows = [];
  tableLines.slice(1).forEach((line) => {
    if (/^\|\s*:?-{2,}/.test(line) || line.includes("---")) return;
    const cells = line
      .split("|")
      .map((cell) => cleanLineageText(cell))
      .filter((cell, index, all) => !(index === 0 && cell === "" && all.length > headers.length));
    if (!cells.length) return;
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cleanLineageText(cells[index] || "");
    });
    rows.push(row);
  });
  return rows;
};

const parseEvidenceTable = (lines) => {
  const tableLines = lines.filter((line) => line.trim().startsWith("|"));
  if (tableLines.length < 2) return [];

  const headerCells = tableLines[0].split("|").map((c) => c.trim()).filter(Boolean);
  const sourceIndex = headerCells.findIndex((c) => c.toLowerCase() === "source");
  const dpIndex = headerCells.findIndex((c) => {
    const normalized = c.toLowerCase();
    return normalized === "dp" || normalized === "dps";
  });

  if (sourceIndex === -1 || dpIndex === -1) return [];

  const evidence = [];
  tableLines.slice(1).forEach((row) => {
    if (row.includes("---")) return;
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length <= Math.max(sourceIndex, dpIndex)) return;
    const source = cells[sourceIndex];
    const dp = cells[dpIndex];
    if (source && dp) evidence.push({ source, dp });
  });
  return evidence;
};

const renderPulsePosition = (synthesis) => {
  if (!refs.synthesisHeadline) return;

  if (!synthesis || (!synthesis.headline && !synthesis.summaryText)) {
    refs.synthesisHeadline.textContent = "No synthesis found yet";
    if (refs.synthesisLede) refs.synthesisLede.textContent = "Add 06_Current_Understanding/Current_Synthesis.md to populate this view.";
    if (refs.synthesisSummary) refs.synthesisSummary.innerHTML = "";
    if (refs.synthesisMeta) refs.synthesisMeta.textContent = "";
    return;
  }

  refs.synthesisHeadline.textContent = synthesis.headline || "Current synthesis available";
  const summaryParagraphEntries = Array.isArray(synthesis.summaryParagraphEntries)
    ? synthesis.summaryParagraphEntries.filter((entry) => entry && entry.text)
    : [];
  const summaryParagraphsClean = Array.isArray(synthesis.summaryParagraphsClean)
    ? synthesis.summaryParagraphsClean.filter(Boolean)
    : [];
  const summaryParagraphsFromEntries = summaryParagraphEntries
    .map((entry) => entry.text)
    .filter(Boolean);
  const summaryParagraphs = summaryParagraphsFromEntries.length
    ? summaryParagraphsFromEntries
    : (summaryParagraphsClean.length
    ? summaryParagraphsClean
    : (Array.isArray(synthesis.summaryParagraphs) ? synthesis.summaryParagraphs.filter(Boolean) : []));
  const hasSummarySources = summaryParagraphEntries.some((entry) =>
    Array.isArray(entry.citations) && entry.citations.some(Boolean),
  );
  const hasSummary = summaryParagraphs.length > 0 || Boolean(synthesis.summaryText);
  if (refs.synthesisLede) refs.synthesisLede.textContent = hasSummary ? "" : (synthesis.lede || "");
  if (refs.synthesisSummary) {
    const fallbackParagraphs = hasSummary ? [synthesis.summaryText].filter(Boolean) : [];
    const renderParagraphs = summaryParagraphs.length ? summaryParagraphs : fallbackParagraphs;
    refs.synthesisSummary.innerHTML = renderParagraphs
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");
  }

  if (refs.synthesisMeta) {
    const metaMarkup = [];
    if (synthesis.updated) metaMarkup.push(`<span>${escapeHtml(`Last updated ${synthesis.updated}`)}</span>`);
    if (Array.isArray(synthesis.takeaways) && synthesis.takeaways.length) {
      metaMarkup.push(`<span>${escapeHtml(`${synthesis.takeaways.length} key takeaways`)}</span>`);
    }
    if (Array.isArray(synthesis.activeIdeasSnapshot) && synthesis.activeIdeasSnapshot.length) {
      metaMarkup.push(`<span>${escapeHtml(`${synthesis.activeIdeasSnapshot.length} synthesis ideas`)}</span>`);
    }
    if (hasSummarySources) {
      metaMarkup.push(
        '<button class="cr-btn cr-btn--sm cr-btn--position-sources" data-action="open-position-sources" type="button">View Sources</button>',
      );
    }

    refs.synthesisMeta.innerHTML = metaMarkup.join("");
  }
};

const openPositionDrawer = () => {
  const synthesis = state.home?.synthesis;
  if (!synthesis || !refs.positionDrawer || !refs.positionDrawerBody) return;

  const summaryParagraphEntries = Array.isArray(synthesis.summaryParagraphEntries)
    ? synthesis.summaryParagraphEntries
      .filter((entry) => entry && entry.text)
      .map((entry) => ({
        text: String(entry.text || "").trim(),
        citations: (Array.isArray(entry.citations) ? entry.citations : [])
          .map((citation) => String(citation || "").trim())
          .filter(Boolean),
      }))
      .filter((entry) => entry.text)
    : [];
  const fallbackEntries = synthesis.summaryText
    ? [{
      text: String(synthesis.summaryText || "").trim(),
      citations: (Array.isArray(synthesis.summaryCitations) ? synthesis.summaryCitations : [])
        .map((citation) => String(citation || "").trim())
        .filter(Boolean),
    }]
    : [];
  const entries = summaryParagraphEntries.length ? summaryParagraphEntries : fallbackEntries;
  const citationCount = entries.reduce(
    (sum, entry) => sum + (Array.isArray(entry.citations) ? entry.citations.length : 0),
    0,
  );
  const citationMeta = citationCount
    ? `${citationCount} citation${citationCount === 1 ? "" : "s"}`
    : "Narrative only";

  if (refs.positionDrawerTitle) refs.positionDrawerTitle.textContent = "Current Position Sources";

  refs.positionDrawerBody.innerHTML = `
    <article class="cr-drawer-doc cr-drawer-doc--trend">
      <header class="cr-drawer-doc-hero">
        <div class="cr-drawer-doc-identity-row cr-drawer-doc-identity-row--takeaway">
          <span class="cr-drawer-doc-meta">${escapeHtml(citationMeta)}</span>
        </div>
        <h2 class="cr-drawer-doc-takeaway-title">${escapeHtml(synthesis.headline || "Current Position")}</h2>
      </header>

      <section class="cr-drawer-doc-section">
        <h4 class="cr-drawer-doc-section-title">Summary by Paragraph</h4>
        <div class="cr-trend-subtrend-list">
          ${entries.length ? entries.map((entry, index) => `
            <article class="cr-drawer-doc-section cr-trend-subtrend-card">
              <div class="cr-trend-subtrend-body">
                <p>${escapeHtml(entry.text)}</p>
              </div>
              <div class="cr-citation-host" data-citation-host="position-paragraph-${index}"></div>
            </article>
          `).join("") : '<div class="cr-empty-text">No summary context available.</div>'}
        </div>
      </section>
    </article>
  `;

  refs.positionDrawer.classList.add("is-open");
  syncDrawerState();

  entries.forEach((entry, index) => {
    const host = refs.positionDrawerBody.querySelector(`[data-citation-host="position-paragraph-${index}"]`);
    if (!host) return;
    hydrateCitationHost(host, entry.citations || [], state.home?.synthesisPath || "06_Current_Understanding/Current_Synthesis.md", {
      emptyText: "No explicit citations listed for this paragraph.",
      compact: true,
    });
  });
};

const closePositionDrawer = () => {
  refs.positionDrawer?.classList.remove("is-open");
  syncDrawerState();
};

const renderPulseTakeaways = (takeaways = []) => {
  if (!refs.synthesisTakeaways) return;
  refs.synthesisTakeaways.innerHTML = "";

  if (!takeaways.length) {
    refs.synthesisTakeaways.innerHTML = '<div class="cr-empty-text">No takeaways available.</div>';
    return;
  }

  takeaways.forEach((takeaway, index) => {
    const row = document.createElement("div");
    row.className = "cr-takeaway-row cr-divider-row";
    const rank = String(index + 1).padStart(2, "0");
    const citationCount = takeaway.citations?.length || 0;
    const citationMeta = citationCount
      ? `${citationCount} citation${citationCount === 1 ? "" : "s"}`
      : "Narrative";
    const detail = takeaway.detail || takeaway.fullText || "";
    row.innerHTML = `
      <div class="cr-takeaway-rank">${rank}</div>
      <div class="cr-takeaway-main">
        <div class="cr-takeaway-title">${escapeHtml(takeaway.title || "Takeaway")}</div>
        ${detail ? `<div class="cr-takeaway-kicker">${escapeHtml(detail)}</div>` : ""}
        <footer class="cr-trend-card-footer cr-takeaway-row-footer">
          <span class="cr-trend-card-meta">${escapeHtml(citationMeta)}</span>
          <button class="cr-btn cr-btn--sm" data-takeaway-index="${index}" type="button">View Sources</button>
        </footer>
      </div>
    `;
    refs.synthesisTakeaways.appendChild(row);
  });
};

const renderPulseTrends = (trends = []) => {
  if (!refs.pulseTrendsList) return;
  refs.pulseTrendsList.innerHTML = "";

  if (!trends.length) {
    refs.pulseTrendsList.innerHTML = '<div class="cr-empty-text">No trend synthesis available.</div>';
    return;
  }

  trends.forEach((trend, trendIndex) => {
    const card = document.createElement("article");
    card.className = "cr-trend-card";
    const subtrends = Array.isArray(trend.subtrends) ? trend.subtrends : [];
    const citationCount = subtrends.reduce(
      (sum, subtrend) => sum + ((subtrend.citations || []).flatMap(expandCitationInputs).length),
      0,
    );
    const connections = Array.isArray(trend.connections) ? trend.connections.filter(Boolean) : [];
    const cardMeta = `${subtrends.length} subtrend${subtrends.length === 1 ? "" : "s"} · ${citationCount} citation${citationCount === 1 ? "" : "s"}`;
    card.innerHTML = `
      <header class="cr-trend-card-header">
        <span class="cr-trend-tag">${escapeHtml(trend.tag || "#trend")}</span>
      </header>
      ${trend.summary ? `<p class="cr-trend-summary">${escapeHtml(trend.summary)}</p>` : ""}
      ${trend.whatShiftedOrNew ? `
        <div class="cr-trend-callout">
          <h4 class="cr-trend-callout-label">${escapeHtml(trend.whatShiftedOrNewLabel || "Key Developments")}</h4>
          ${trend.whatShiftedOrNew.includes("\n")
            ? `<ul class="cr-trend-callout-list">${trend.whatShiftedOrNew.split("\n").filter(Boolean).map((item) => `<li class="cr-trend-callout-text">${escapeHtml(item)}</li>`).join("")}</ul>`
            : `<p class="cr-trend-callout-text">${escapeHtml(trend.whatShiftedOrNew)}</p>`
          }
        </div>
      ` : ""}
      ${trend.whatHeldSteady ? `
        <div class="cr-trend-callout is-steady">
          <h4 class="cr-trend-callout-label">What Held Steady</h4>
          <p class="cr-trend-callout-text">${escapeHtml(trend.whatHeldSteady)}</p>
        </div>
      ` : ""}
      ${connections.length ? `
        <div class="cr-trend-connections">
          <h4 class="cr-trend-callout-label">Connection to Active Ideas</h4>
          <ul class="cr-trend-connection-list">
            ${connections.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>
      ` : ""}
      <footer class="cr-trend-card-footer">
        <span class="cr-trend-card-meta">${escapeHtml(cardMeta)}</span>
        <button class="cr-btn cr-btn--sm" data-trend-index="${trendIndex}" type="button">View Sources</button>
      </footer>
    `;
    refs.pulseTrendsList.appendChild(card);
  });
};

const renderPulseWeeklyOpenThreads = (threads = []) => {
  if (!refs.pulseWeeklyOpenThreadsList) return;
  refs.pulseWeeklyOpenThreadsList.innerHTML = "";

  if (!threads.length) {
    refs.pulseWeeklyOpenThreadsList.innerHTML = '<li class="cr-empty-text">No open threads available.</li>';
    return;
  }

  threads.forEach((thread, index) => {
    const item = document.createElement("li");
    item.className = "cr-weekly-open-thread-item";
    item.innerHTML = `
      <span class="cr-weekly-open-thread-rank">${index + 1}</span>
      <span class="cr-weekly-open-thread-body">
        <span class="cr-weekly-open-thread-title">${escapeHtml(thread.title || "Thread")}</span>
        ${thread.detail ? `<span class="cr-weekly-open-thread-detail">${escapeHtml(thread.detail)}</span>` : ""}
      </span>
    `;
    refs.pulseWeeklyOpenThreadsList.appendChild(item);
  });
};

const renderPulseReflection = (paragraphs = []) => {
  if (!refs.pulseReflectionContent) return;
  refs.pulseReflectionContent.innerHTML = "";

  const items = (Array.isArray(paragraphs) ? paragraphs : []).filter(Boolean);
  if (!items.length) {
    refs.pulseReflectionContent.innerHTML = '<p class="cr-empty-text">No reflection available.</p>';
    return;
  }

  refs.pulseReflectionContent.innerHTML = items
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
};

const openTakeawayDrawer = (index) => {
  const takeaway = state.home?.synthesis?.takeaways?.[index];
  if (!takeaway || !refs.takeawayDrawer || !refs.takeawayDrawerBody) return;

  if (refs.takeawayDrawerTitle) {
    refs.takeawayDrawerTitle.textContent = "Key Takeaway";
  }
  const citationInputs = takeaway.citations || [];
  const citationMeta = citationInputs.length
    ? `${citationInputs.length} citation${citationInputs.length === 1 ? "" : "s"}`
    : "Narrative only";

  refs.takeawayDrawerBody.innerHTML = `
    <article class="cr-drawer-doc cr-drawer-doc--takeaway">
      <header class="cr-drawer-doc-hero">
        <div class="cr-drawer-doc-identity-row cr-drawer-doc-identity-row--takeaway">
          <span class="cr-drawer-doc-meta">${citationMeta}</span>
        </div>
        <h2 class="cr-drawer-doc-takeaway-title">${renderInlineMarkdownBold(takeaway.title || takeaway.fullText || "Takeaway")}</h2>
      </header>

      <section class="cr-drawer-doc-section">
        <h4 class="cr-drawer-doc-section-title">Summary</h4>
        <div class="cr-drawer-doc-section-body">
          <p>${renderInlineMarkdownBold(takeaway.detail || takeaway.fullText || "No additional detail provided.")}</p>
        </div>
      </section>

      <section class="cr-drawer-doc-section">
        <h4 class="cr-drawer-doc-section-title">Evidence Trace</h4>
        <div class="cr-drawer-doc-section-body">
          <div class="cr-citation-host" data-citation-host="takeaway"></div>
        </div>
      </section>
    </article>
  `;

  refs.takeawayDrawer.classList.add("is-open");
  syncDrawerState();

  const host = refs.takeawayDrawerBody.querySelector('[data-citation-host="takeaway"]');
  hydrateCitationHost(host, citationInputs, state.home?.synthesisPath || "06_Current_Understanding/Current_Synthesis.md", {
    emptyText: "No explicit citations listed.",
  });
};

const closeTakeawayDrawer = () => {
  refs.takeawayDrawer?.classList.remove("is-open");
  syncDrawerState();
};

const openTrendDrawer = (index) => {
  const trendIndex = Number(index);
  if (Number.isNaN(trendIndex)) return;
  const trend = state.home?.weeklyInsights?.trends?.[trendIndex];
  if (!trend || !refs.trendDrawer || !refs.trendDrawerBody) return;

  state.pulse.activeTrendIndex = trendIndex;
  if (refs.trendDrawerTitle) refs.trendDrawerTitle.textContent = "Trend";

  const subtrends = Array.isArray(trend.subtrends) ? trend.subtrends : [];
  const sourcePath = state.home?.weeklyInsights?.sourcePath || "";
  const citationCount = subtrends.reduce(
    (sum, subtrend) => sum + ((subtrend.citations || []).flatMap(expandCitationInputs).length),
    0,
  );
  const shiftedLabel = trend.whatShiftedOrNewLabel || (/new/i.test(trend.whatShiftedOrNewLabel || "") ? "What Is New" : "What Shifted");

  refs.trendDrawerBody.innerHTML = `
    <article class="cr-drawer-doc cr-drawer-doc--trend">
      <header class="cr-drawer-doc-hero">
        <div class="cr-drawer-doc-identity-row cr-drawer-doc-identity-row--takeaway">
          <span class="cr-drawer-doc-meta">
            ${subtrends.length} subtrend${subtrends.length === 1 ? "" : "s"} · ${citationCount} citation${citationCount === 1 ? "" : "s"}
          </span>
        </div>
        <h3 class="cr-drawer-doc-takeaway-title">${escapeHtml(trend.tag || "#trend")}</h3>
      </header>

      <section class="cr-drawer-doc-section">
        <h4 class="cr-drawer-doc-section-title">Summary</h4>
        <div class="cr-drawer-doc-section-body">
          <p>${escapeHtml(trend.summary || "No summary available.")}</p>
        </div>
      </section>

      ${trend.whatShiftedOrNew ? `
        <section class="cr-drawer-doc-section">
          <h4 class="cr-drawer-doc-section-title">${escapeHtml(shiftedLabel)}</h4>
          <div class="cr-drawer-doc-section-body">
            ${trend.whatShiftedOrNew.includes("\n")
              ? `<ul class="cr-trend-connection-inline-list">${trend.whatShiftedOrNew.split("\n").filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
              : `<p>${escapeHtml(trend.whatShiftedOrNew)}</p>`
            }
          </div>
        </section>
      ` : ""}

      ${trend.whatHeldSteady ? `
        <section class="cr-drawer-doc-section">
          <h4 class="cr-drawer-doc-section-title">What Held Steady</h4>
          <div class="cr-drawer-doc-section-body">
            <p>${escapeHtml(trend.whatHeldSteady)}</p>
          </div>
        </section>
      ` : ""}

      ${Array.isArray(trend.connections) && trend.connections.length ? `
        <section class="cr-drawer-doc-section">
          <h4 class="cr-drawer-doc-section-title">Connection to Active Ideas</h4>
          <div class="cr-drawer-doc-section-body">
            <ul class="cr-trend-connection-inline-list">
              ${trend.connections.map((connection) => `<li>${escapeHtml(connection)}</li>`).join("")}
            </ul>
          </div>
        </section>
      ` : ""}

      <section class="cr-drawer-doc-section">
        <h4 class="cr-drawer-doc-section-title">Evidence Trace by Subtrend</h4>
        <div class="cr-trend-subtrend-list">
          ${subtrends.length ? subtrends.map((subtrend, subIndex) => `
            <article class="cr-drawer-doc-section cr-trend-subtrend-card">
              <div class="cr-trend-subtrend-body">
                ${(subtrend.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
              </div>
              <div class="cr-citation-host" data-citation-host="trend-subtrend-${trendIndex}-${subIndex}"></div>
            </article>
          `).join("") : '<div class="cr-empty-text">No subtrends available.</div>'}
        </div>
      </section>
    </article>
  `;

  refs.trendDrawer.classList.add("is-open");
  syncDrawerState();

  subtrends.forEach((subtrend, subIndex) => {
    const host = refs.trendDrawerBody?.querySelector(`[data-citation-host="trend-subtrend-${trendIndex}-${subIndex}"]`);
    if (!host) return;
    hydrateCitationHost(host, subtrend.citations || [], sourcePath, {
      emptyText: "No explicit citations listed for this subtrend.",
      compact: true,
    });
  });
};

const closeTrendDrawer = () => {
  state.pulse.activeTrendIndex = null;
  refs.trendDrawer?.classList.remove("is-open");
  syncDrawerState();
};


// =============================================================================
// IDEAS VIEW
// =============================================================================

const parseDpId = (value) => {
  if (!value) return null;
  const match = String(value).match(/DP\s*(\d+)/i);
  return match ? `DP${match[1]}` : null;
};

const getIdeaStageValue = (status) => cleanLineageText(status || "");

const getIdeaConfidenceValue = (confidence) => cleanLineageText(confidence || "");

const getIdeaConfidenceClass = (confidence) => {
  const normalized = normalizeLookupKey(cleanLineageText(confidence || ""));
  if (!normalized) return "";
  if (normalized.includes("very") && normalized.includes("high")) return "is-very-high";
  if (normalized.includes("medium") && normalized.includes("high")) return "is-medium-high";
  if (normalized === "high" || normalized.endsWith(" high")) return "is-high";
  return "";
};

const renderIdeaSignals = (stageValue, confidenceValue, confidenceClass) => {
  const parts = [];

  if (stageValue) {
    parts.push(`
      <span class="cr-idea-signal is-stage">
        <span class="cr-idea-signal-label">Stage:</span>
        <span class="cr-idea-signal-value">${escapeHtml(stageValue)}</span>
      </span>
    `);
  }

  if (confidenceValue) {
    parts.push(`
      <span class="cr-idea-signal is-confidence ${confidenceClass}">
        <span class="cr-idea-signal-label">Confidence:</span>
        <span class="cr-idea-signal-value">${escapeHtml(confidenceValue)}</span>
        <span class="cr-confidence-meter" aria-hidden="true">
          <span class="cr-confidence-meter-fill"></span>
        </span>
      </span>
    `);
  }

  if (!parts.length) return "";
  return parts.join("");
};

const renderIdeasView = () => {
  const ideas = state.home?.ideas || [];
  const updatedMap = state.home?.ideaUpdated || new Map();
  renderIdeaList(ideas, updatedMap);

  if (!ideas.length) {
    if (refs.ideaDetailContent) refs.ideaDetailContent.style.display = "none";
    if (refs.ideasEmpty) refs.ideasEmpty.style.display = "flex";
    return;
  }

  if (!state.ideas.selectedKey || !state.home.ideasByKey.has(state.ideas.selectedKey)) {
    state.ideas.selectedKey = ideas[0].key;
  }

  setSelectedIdea(state.ideas.selectedKey);
};

const renderIdeaList = (ideas, updatedMap) => {
  if (!refs.ideasList) return;
  refs.ideasList.innerHTML = "";

  if (refs.ideasListMeta) {
    const ideasMeta = state.home?.ideasMeta || {};
    const declaredTotal = Number.parseInt(ideasMeta.totalActiveIdeas, 10);
    const totalIdeas = Number.isInteger(declaredTotal) ? declaredTotal : ideas.length;
    const summaryParts = [];
    summaryParts.push(totalIdeas ? `${totalIdeas} ideas` : "No ideas");
    if (ideasMeta.lastUpdated) summaryParts.push(`Last updated ${ideasMeta.lastUpdated}`);
    if (ideasMeta.evidenceBase) summaryParts.push(ideasMeta.evidenceBase);
    refs.ideasListMeta.textContent = summaryParts.join(" · ");
  }

  if (!ideas.length) {
    refs.ideasList.innerHTML = '<div class="cr-empty-text">No active ideas found.</div>';
    return;
  }

  ideas.forEach((idea) => {
    const updated = updatedMap.get(idea.key) || state.home?.ideasMeta?.lastUpdated || "";
    const confidenceClass = getIdeaConfidenceClass(idea.confidence);
    const stageValue = getIdeaStageValue(idea.status);
    const confidenceValue = getIdeaConfidenceValue(idea.confidence);
    const hasSignals = Boolean(stageValue || confidenceValue);
    const signalItems = renderIdeaSignals(stageValue, confidenceValue, confidenceClass);
    const tagList = (idea.tags || []).slice(0, 4).map((t) => `<span class="cr-idea-list-tag">${escapeHtml(t)}</span>`).join("");
    const evidenceCount = idea.evidence?.length || 0;
    const questionCount = idea.openQuestions?.length || 0;
    const citationCountLabel = `${evidenceCount} citation${evidenceCount === 1 ? "" : "s"}`;

    const item = document.createElement("button");
    item.type = "button";
    item.className = `cr-idea-list-item${state.ideas.selectedKey === idea.key ? " is-active" : ""}`;
    item.setAttribute("aria-pressed", String(state.ideas.selectedKey === idea.key));
    item.setAttribute("aria-label", `Open idea: ${idea.title || "Idea"}`);
    item.dataset.ideaKey = idea.key;
    item.innerHTML = `
      <div class="cr-idea-list-header">
        <div class="cr-idea-list-title">${escapeHtml(idea.title)}</div>
        ${updated ? `<span class="cr-idea-list-updated">${escapeHtml(updated)}</span>` : ""}
      </div>
      ${hasSignals ? `<div class="cr-idea-signal-row cr-idea-list-signals">${signalItems}</div>` : ""}
      ${tagList ? `<div class="cr-idea-list-tags">${tagList}</div>` : ""}
      <span class="cr-idea-list-counts">${citationCountLabel} · ${questionCount} questions</span>
    `;
    refs.ideasList.appendChild(item);
  });
};

const setSelectedIdea = (key, options = {}) => {
  if (!key || !state.home?.ideasByKey?.has(key)) return false;

  state.ideas.selectedKey = key;
  const updatedMap = state.home?.ideaUpdated || new Map();
  renderIdeaList(state.home?.ideas || [], updatedMap);
  const selectedIdea = state.home.ideasByKey.get(key) || null;
  renderIdeaDetail(selectedIdea, updatedMap);

  if (options.scrollIntoView) {
    const selectedItem = refs.ideasList?.querySelector(".cr-idea-list-item.is-active");
    selectedItem?.scrollIntoView({ block: "nearest" });
  }

  return true;
};

const renderIdeaDetail = (idea, updatedMap) => {
  if (!refs.ideaDetailContent || !refs.ideasEmpty) return;
  if (!idea) {
    refs.ideaDetailContent.style.display = "none";
    refs.ideasEmpty.style.display = "flex";
    return;
  }

  refs.ideasEmpty.style.display = "none";
  refs.ideaDetailContent.style.display = "grid";

  const updated = updatedMap.get(idea.key) || state.home?.ideasMeta?.lastUpdated || "";
  const tags = (idea.tags || []).map((t) => `<span class="cr-idea-detail-tag">${escapeHtml(t)}</span>`).join("");
  const confidenceClass = getIdeaConfidenceClass(idea.confidence);
  const stageValue = getIdeaStageValue(idea.status);
  const confidenceValue = getIdeaConfidenceValue(idea.confidence);
  const hasSignals = Boolean(stageValue || confidenceValue);
  const signalItems = renderIdeaSignals(stageValue, confidenceValue, confidenceClass);
  const evidenceCount = idea.evidence?.length || 0;
  const evidenceCitations = (idea.evidence || [])
    .map((item) => `${item.source || ""}${item.dp ? ` ${item.dp}` : ""}`.trim())
    .filter(Boolean);
  const evidenceSummary = evidenceCount
    ? `${evidenceCount} citation${evidenceCount === 1 ? "" : "s"} mapped to this idea.`
    : "No citations listed for this idea.";

  const positionBlocks = (idea.positionItems || []).map((text) => `<p>${escapeHtml(text)}</p>`).join("");
  const drivers = idea.drivers?.length
    ? `<ul class="cr-idea-detail-list">${idea.drivers.map((d) => `<li>${renderInlineMarkdownBold(d)}</li>`).join("")}</ul>`
    : '<div class="cr-empty-text">No drivers listed.</div>';

  const questions = idea.openQuestions?.length
    ? `<ul class="cr-idea-detail-list cr-idea-detail-list--bulleted">${idea.openQuestions.map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ul>`
    : '<div class="cr-empty-text">No open questions listed.</div>';

  const counterarguments = idea.counterarguments?.length
    ? `
      <ul class="cr-idea-detail-list">
        ${idea.counterarguments.map((entry, index) => `
          <li>
            <span>${escapeHtml(entry.challenge || "")}</span>
            ${(entry.source || entry.dp)
    ? `<span class="cr-idea-detail-list-meta">${escapeHtml([entry.source, entry.dp].filter(Boolean).join(" · "))}</span>`
    : ""}
            ${Array.isArray(entry.citations) && entry.citations.length
    ? `<div class="cr-citation-host cr-idea-counterargument-citation-host" data-citation-host="idea-counterargument-${index}"></div>`
    : ""}
          </li>
        `).join("")}
      </ul>
    `
    : '<div class="cr-empty-text">No counterarguments listed.</div>';

  const userObservations = idea.userObservations?.length
    ? `<ul class="cr-idea-detail-list cr-idea-detail-list--bulleted">${idea.userObservations.map((observation) => `<li>${renderInlineMarkdownBold(observation)}</li>`).join("")}</ul>`
    : '<div class="cr-empty-text">No user observations listed.</div>';

  const relatedMapped = (idea.relatedIdeas || []).map((relatedIdea) => {
    const label = relatedIdea.title || `Idea ${relatedIdea.number}`;
    if (relatedIdea.key) {
      return `<button class="cr-btn cr-btn--sm cr-idea-related-btn" data-action="jump-related-idea" data-idea-key="${escapeHtml(relatedIdea.key)}" type="button">${escapeHtml(label)}</button>`;
    }
    return `<span class="cr-idea-related-pill">${escapeHtml(label)}</span>`;
  });

  const relatedFallback = (idea.relatedIdeaLabels || []).map((label) => `<span class="cr-idea-related-pill">${escapeHtml(label)}</span>`);
  const relatedIdeas = [...relatedMapped, ...relatedFallback].join("");

  const evolution = idea.evolutionLog?.length
    ? `<ul class="cr-idea-detail-list">${idea.evolutionLog.map((e) => `<li>${escapeHtml(e)}</li>`).join("")}</ul>`
    : "";

  refs.ideaDetailContent.innerHTML = `
    <div class="cr-idea-detail-header">
      <div class="cr-idea-detail-kicker cr-text-label">Active Idea</div>
      <h1 class="cr-idea-detail-title">${escapeHtml(idea.title)}</h1>
      ${hasSignals ? `<div class="cr-idea-signal-row cr-idea-detail-signals">${signalItems}</div>` : ""}
      ${tags ? `<div class="cr-idea-detail-tags">${tags}</div>` : ""}
      ${updated ? `<div class="cr-idea-detail-updated">Last updated ${escapeHtml(updated)}</div>` : ""}
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">Current Position</div>
      <div class="cr-idea-detail-section-body">${positionBlocks || '<div class="cr-empty-text">No position listed.</div>'}</div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">Drivers</div>
      <div class="cr-idea-detail-section-body">${drivers}</div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">Supporting Evidence</div>
      <div class="cr-idea-detail-section-body">
        <p class="cr-idea-detail-evidence-summary">${escapeHtml(evidenceSummary)}</p>
        <div class="cr-citation-host cr-idea-detail-evidence-host" data-citation-host="idea-detail-inline"></div>
      </div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">Open Questions</div>
      <div class="cr-idea-detail-section-body">${questions}</div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">Counterarguments</div>
      <div class="cr-idea-detail-section-body">${counterarguments}</div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">User Observations</div>
      <div class="cr-idea-detail-section-body">${userObservations}</div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">Related Ideas</div>
      <div class="cr-idea-detail-section-body">
        ${relatedIdeas
    ? `<div class="cr-idea-related-list">${relatedIdeas}</div>`
    : '<div class="cr-empty-text">No related ideas listed.</div>'}
      </div>
    </div>

    ${evolution ? `
      <div class="cr-idea-detail-section">
        <div class="cr-idea-detail-section-title">Evolution Log</div>
        <div class="cr-idea-detail-section-body">${evolution}</div>
      </div>
    ` : ""}
  `;

  const evidenceHost = refs.ideaDetailContent.querySelector('[data-citation-host="idea-detail-inline"]');
  hydrateCitationHost(evidenceHost, evidenceCitations, "06_Current_Understanding/Active_Ideas.md", {
    emptyText: "No citations listed for this idea.",
    groupBySource: true,
  });

  (idea.counterarguments || []).forEach((entry, index) => {
    const counterargumentCitations = Array.isArray(entry.citations) ? entry.citations.filter(Boolean) : [];
    if (!counterargumentCitations.length) return;
    const host = refs.ideaDetailContent.querySelector(`[data-citation-host="idea-counterargument-${index}"]`);
    if (!host) return;
    hydrateCitationHost(host, counterargumentCitations, "06_Current_Understanding/Active_Ideas.md", {
      emptyText: "No citations listed for this counterargument.",
      compact: true,
      groupBySource: true,
    });
  });
};

// =============================================================================
// TALKING POINTS VIEW
// =============================================================================

const renderTalkingPointsView = () => {
  const points = state.home?.talkingPoints || [];
  renderTalkingPointsList(points);

  if (!points.length) {
    if (refs.talkingPointDetailContent) refs.talkingPointDetailContent.style.display = "none";
    if (refs.talkingPointsEmpty) refs.talkingPointsEmpty.style.display = "flex";
    return;
  }

  if (!state.talkingPoints.selectedKey || !state.home.talkingPointsByKey.has(state.talkingPoints.selectedKey)) {
    state.talkingPoints.selectedKey = points[0].key;
  }

  setSelectedTalkingPoint(state.talkingPoints.selectedKey);
};

const renderTalkingPointsList = (points = []) => {
  if (!refs.talkingPointsList) return;
  refs.talkingPointsList.innerHTML = "";

  const meta = state.home?.talkingPointsMeta || {};
  if (refs.talkingPointsListMeta) {
    const summaryParts = [];
    const talkingPointCount = points.filter((point) => point.kind !== "conversation-starters").length;
    const hasConversationStarters = points.some((point) => point.kind === "conversation-starters");
    summaryParts.push(talkingPointCount ? `${talkingPointCount} talking points` : "No talking points");
    if (hasConversationStarters) summaryParts.push("Conversation starters");
    if (meta.date) summaryParts.push(`Updated ${meta.date}`);
    if (meta.researchPeriod) summaryParts.push(meta.researchPeriod);
    refs.talkingPointsListMeta.textContent = summaryParts.join(" · ");
  }

  if (!points.length) {
    refs.talkingPointsList.innerHTML = '<div class="cr-empty-text">No talking points found.</div>';
    return;
  }

  points.forEach((point) => {
    const isConversationStarters = point.kind === "conversation-starters";
    const evidenceCount = point.evidenceItems?.length || 0;
    const audienceCount = point.whoCaresRows?.length || 0;
    const starterGroupCount = (point.conversationStarterGroups || []).length;
    const starterCount = Number.isFinite(point.conversationStarterCount)
      ? point.conversationStarterCount
      : (point.conversationStarterGroups || []).reduce((total, group) => total + ((group?.starters || []).length), 0);
    const detailLabel = isConversationStarters
      ? "START"
      : (point.number ? `TP${point.number}` : "TP");
    const countLabel = isConversationStarters
      ? `${starterCount} starter${starterCount === 1 ? "" : "s"} · ${starterGroupCount} group${starterGroupCount === 1 ? "" : "s"}`
      : `${evidenceCount} evidence line${evidenceCount === 1 ? "" : "s"} · ${audienceCount} audience${audienceCount === 1 ? "" : "s"}`;

    const item = document.createElement("button");
    item.type = "button";
    item.className = `cr-idea-list-item cr-talking-point-list-item${state.talkingPoints.selectedKey === point.key ? " is-active" : ""}`;
    item.setAttribute("aria-pressed", String(state.talkingPoints.selectedKey === point.key));
    item.setAttribute("aria-label", `Open talking point: ${point.title || detailLabel}`);
    item.dataset.talkingPointKey = point.key;
    item.innerHTML = `
      <div class="cr-idea-list-header">
        <div class="cr-idea-list-title">${escapeHtml(point.title || detailLabel)}</div>
        <span class="cr-idea-list-updated">${escapeHtml(detailLabel)}</span>
      </div>
      <span class="cr-idea-list-counts">${escapeHtml(countLabel)}</span>
    `;
    refs.talkingPointsList.appendChild(item);
  });
};

const setSelectedTalkingPoint = (key, options = {}) => {
  if (!key || !state.home?.talkingPointsByKey?.has(key)) return false;

  state.talkingPoints.selectedKey = key;
  renderTalkingPointsList(state.home?.talkingPoints || []);
  const selectedPoint = state.home.talkingPointsByKey.get(key) || null;
  renderTalkingPointDetail(selectedPoint);

  if (options.scrollIntoView) {
    const selectedItem = refs.talkingPointsList?.querySelector(".cr-talking-point-list-item.is-active");
    selectedItem?.scrollIntoView({ block: "nearest" });
  }

  return true;
};

const renderTalkingPointDetail = (point) => {
  if (!refs.talkingPointDetailContent || !refs.talkingPointsEmpty) return;
  if (!point) {
    refs.talkingPointDetailContent.style.display = "none";
    refs.talkingPointsEmpty.style.display = "flex";
    return;
  }

  refs.talkingPointsEmpty.style.display = "none";
  refs.talkingPointDetailContent.style.display = "grid";

  const meta = state.home?.talkingPointsMeta || {};
  if (point.kind === "conversation-starters") {
    const starterGroups = Array.isArray(point.conversationStarterGroups) ? point.conversationStarterGroups : [];
    const totalStarterCount = Number.isFinite(point.conversationStarterCount)
      ? point.conversationStarterCount
      : starterGroups.reduce((total, group) => total + ((group?.starters || []).length), 0);
    const summaryParts = ["Starter Pack"];
    if (meta.date) summaryParts.push(meta.date);
    if (totalStarterCount) summaryParts.push(`${totalStarterCount} starters`);
    const startersBody = starterGroups.length
      ? `
        <div class="cr-talking-point-starter-groups">
          ${starterGroups.map((group) => `
            <section class="cr-talking-point-starter-group">
              ${group.title ? `<h4 class="cr-talking-point-starter-title">${renderInlineMarkdownBold(group.title)}</h4>` : ""}
              ${(group.starters || []).length
    ? `<ul class="cr-idea-detail-list cr-idea-detail-list--bulleted cr-talking-point-starter-list">${(group.starters || []).map((starter) => `<li>${renderInlineMarkdownBold(starter)}</li>`).join("")}</ul>`
    : '<div class="cr-empty-text">No starters listed in this group.</div>'}
            </section>
          `).join("")}
        </div>
      `
      : '<div class="cr-empty-text">No conversation starters listed.</div>';

    refs.talkingPointDetailContent.innerHTML = `
      <div class="cr-idea-detail-header">
        <div class="cr-idea-detail-kicker cr-text-label">Talking Point</div>
        <h1 class="cr-idea-detail-title">${escapeHtml(point.title || "Conversation Starters")}</h1>
        <div class="cr-idea-detail-updated">${escapeHtml(summaryParts.join(" · "))}</div>
      </div>
      <div class="cr-idea-detail-section">
        <div class="cr-idea-detail-section-title">Conversation Starters</div>
        <div class="cr-idea-detail-section-body">${startersBody}</div>
      </div>
    `;
    return;
  }

  const pointLabel = point.number ? `TP${point.number}` : "Talking Point";
  const pointBody = (point.pointParagraphs || []).length
    ? (point.pointParagraphs || []).map((text) => `<p>${renderInlineMarkdownBold(text)}</p>`).join("")
    : '<div class="cr-empty-text">No core point listed.</div>';
  const whyList = (point.whyItMattersItems || []).length
    ? `<ul class="cr-idea-detail-list cr-idea-detail-list--bulleted">${point.whyItMattersItems.map((item) => `<li>${renderInlineMarkdownBold(item)}</li>`).join("")}</ul>`
    : '<div class="cr-empty-text">No strategic implications listed.</div>';
  const audienceRows = (point.whoCaresRows || []).length
    ? `
      <div class="cr-talking-point-audience-list">
        ${point.whoCaresRows.map((row) => `
          <article class="cr-talking-point-audience-row">
            ${row.audience ? `<h4 class="cr-talking-point-audience-title"><strong>${escapeHtml(row.audience)}</strong></h4>` : ""}
            ${row.concern ? `
              <p class="cr-talking-point-audience-line">
                <span class="cr-talking-point-audience-label">Concern:</span>
                <span><strong>${renderInlineMarkdownBold(row.concern)}</strong></span>
              </p>
            ` : ""}
            ${row.conversationHook ? `
              <p class="cr-talking-point-audience-hook">
                <span class="cr-talking-point-audience-label">Hook:</span>
                <span>${renderInlineMarkdownBold(row.conversationHook)}</span>
              </p>
            ` : ""}
          </article>
        `).join("")}
      </div>
    `
    : '<div class="cr-empty-text">No audience guidance listed.</div>';
  const evidenceItems = Array.isArray(point.evidenceItems) ? point.evidenceItems : [];
  const hasEvidenceGroupTitles = evidenceItems.some((item) => /^\*\*(.+?)\*\*$/.test(String(item || "").trim()));
  const evidenceList = evidenceItems.length
    ? (() => {
      if (!hasEvidenceGroupTitles) {
        return `<ul class="cr-idea-detail-list cr-idea-detail-list--bulleted">${evidenceItems.map((item) => `<li>${renderInlineMarkdownBold(item)}</li>`).join("")}</ul>`;
      }

      const groups = [];
      let currentGroup = null;

      evidenceItems.forEach((item) => {
        const text = String(item || "").trim();
        if (!text) return;
        const titleMatch = text.match(/^\*\*(.+?)\*\*$/);
        if (titleMatch) {
          currentGroup = {
            title: titleMatch[1].trim(),
            items: [],
          };
          groups.push(currentGroup);
          return;
        }
        if (!currentGroup) {
          currentGroup = { title: "", items: [] };
          groups.push(currentGroup);
        }
        currentGroup.items.push(text);
      });

      if (!groups.length) {
        return '<div class="cr-empty-text">No evidence listed.</div>';
      }

      return `
        <div class="cr-talking-point-evidence-groups">
          ${groups.map((group) => `
            <section class="cr-talking-point-evidence-group">
              ${group.title ? `<h4 class="cr-talking-point-evidence-group-title">${escapeHtml(group.title)}</h4>` : ""}
              ${group.items.length
    ? `<ul class="cr-idea-detail-list cr-idea-detail-list--bulleted cr-talking-point-evidence-group-list">${group.items.map((entry) => `<li>${renderInlineMarkdownBold(entry)}</li>`).join("")}</ul>`
    : ""}
            </section>
          `).join("")}
        </div>
      `;
    })()
    : '<div class="cr-empty-text">No evidence listed.</div>';
  const yourAngle = (point.yourAngleParagraphs || []).length
    ? (point.yourAngleParagraphs || []).map((text) => `<p>${renderInlineMarkdownBold(text)}</p>`).join("")
    : '<div class="cr-empty-text">No personal angle listed.</div>';
  const pivotPhrases = (point.pivotPhrases || []).length
    ? `<ul class="cr-idea-detail-list cr-idea-detail-list--bulleted">${point.pivotPhrases.map((item) => `<li>${renderInlineMarkdownBold(item)}</li>`).join("")}</ul>`
    : '<div class="cr-empty-text">No pivot phrases listed.</div>';
  const evidenceCitations = Array.isArray(point.evidenceCitations)
    ? point.evidenceCitations.filter(Boolean)
    : [];
  const sourcePath = meta.sourcePath || "09_Deliverables/Talking_Points";
  const summaryParts = [pointLabel];
  if (meta.date) summaryParts.push(meta.date);

  refs.talkingPointDetailContent.innerHTML = `
    <div class="cr-idea-detail-header">
      <div class="cr-idea-detail-kicker cr-text-label">Talking Point</div>
      <h1 class="cr-idea-detail-title">${escapeHtml(point.title || pointLabel)}</h1>
      <div class="cr-idea-detail-updated">${escapeHtml(summaryParts.join(" · "))}</div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">The Point</div>
      <div class="cr-idea-detail-section-body">${pointBody}</div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">Why It Matters</div>
      <div class="cr-idea-detail-section-body">${whyList}</div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">Who Cares</div>
      <div class="cr-idea-detail-section-body">${audienceRows}</div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">Evidence</div>
      <div class="cr-idea-detail-section-body">
        ${evidenceList}
        ${evidenceCitations.length ? '<div class="cr-citation-host cr-idea-detail-evidence-host cr-talking-point-evidence-host" data-citation-host="talking-point-evidence"></div>' : ""}
      </div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">Your Angle</div>
      <div class="cr-idea-detail-section-body">${yourAngle}</div>
    </div>

    <div class="cr-idea-detail-section">
      <div class="cr-idea-detail-section-title">Pivot Phrases</div>
      <div class="cr-idea-detail-section-body">${pivotPhrases}</div>
    </div>
  `;

  if (!evidenceCitations.length) return;
  const evidenceHost = refs.talkingPointDetailContent.querySelector('[data-citation-host="talking-point-evidence"]');
  hydrateCitationHost(evidenceHost, evidenceCitations, sourcePath, {
    emptyText: "No explicit citations listed for this talking point.",
    groupBySource: true,
  });
};

// =============================================================================
// EXPLORE VIEW
// =============================================================================

const getDocTagLimit = () =>
  window.matchMedia("(max-width: 768px)").matches
    ? DOC_TAG_LIMIT_MOBILE
    : DOC_TAG_LIMIT_DESKTOP;

const setDocTagsExpanded = (expanded) => {
  state.explore.tagsExpanded = Boolean(expanded);
  renderDocTags(state.selectedData?.tags || []);
};

const renderDocTags = (tags = []) => {
  if (!refs.docTags) return;
  const safeTags = Array.isArray(tags) ? tags.filter(Boolean) : [];
  if (refs.docTagsWrap) {
    refs.docTagsWrap.hidden = safeTags.length === 0;
  }
  if (!safeTags.length) {
    refs.docTags.innerHTML = "";
    if (refs.docTagsToggleBtn) {
      refs.docTagsToggleBtn.hidden = true;
      refs.docTagsToggleBtn.textContent = "Show all tags";
      refs.docTagsToggleBtn.setAttribute("aria-expanded", "false");
    }
    return;
  }

  const limit = getDocTagLimit();
  const hasOverflow = safeTags.length > limit;
  const shouldCollapse = hasOverflow && !state.explore.tagsExpanded;

  refs.docTags.innerHTML = "";
  safeTags.forEach((tag, idx) => {
    const el = document.createElement("span");
    el.className = "cr-doc-tag";
    if (shouldCollapse && idx >= limit) {
      el.classList.add("is-hidden");
    }
    el.textContent = tag;
    refs.docTags.appendChild(el);
  });

  if (refs.docTagsWrap) {
    refs.docTagsWrap.classList.toggle("is-expanded", state.explore.tagsExpanded);
  }

  if (refs.docTagsToggleBtn) {
    refs.docTagsToggleBtn.hidden = !hasOverflow;
    refs.docTagsToggleBtn.textContent = state.explore.tagsExpanded
      ? "Show fewer"
      : `Show all tags (${safeTags.length})`;
    refs.docTagsToggleBtn.setAttribute("aria-expanded", String(state.explore.tagsExpanded));
  }
};

const summarizeClaimsWorkspace = (claims = []) => {
  const totals = {
    claims: claims.length,
    citations: 0,
    dps: 0,
    withoutCitations: 0,
  };

  claims.forEach((claim) => {
    const citationCount = (claim.citations || []).flatMap((citation) => expandCitationInputs(citation)).length;
    const dpCount = (claim.dp_refs || []).reduce((sum, ref) => sum + (ref.dp_ids || []).length, 0);
    totals.citations += citationCount;
    totals.dps += dpCount;
    if (citationCount === 0) totals.withoutCitations += 1;
  });

  return totals;
};

const renderTraceEntrySummary = (claims = []) => {
  const totals = summarizeClaimsWorkspace(claims);
  if (refs.traceSummary) {
    refs.traceSummary.textContent = totals.claims
      ? `${totals.claims} claim${totals.claims === 1 ? "" : "s"} · ${totals.citations} citation${totals.citations === 1 ? "" : "s"}`
      : "No claims detected";
  }
  if (refs.openTraceBtn) {
    refs.openTraceBtn.disabled = totals.claims === 0;
  }
};

const buildExploreClaimItemMarkup = (claim, isActive = false) => {
  const citationInputs = (claim.citations || []).flatMap((citation) => expandCitationInputs(citation));
  const citationCount = citationInputs.length;
  const dpCount = (claim.dp_refs || []).reduce((sum, ref) => sum + (ref.dp_ids || []).length, 0);
  const claimText = cleanLineageText(claim.text || "Claim");
  const compactText = claimText.length > 150 ? `${claimText.slice(0, 147)}...` : claimText;
  const claimNumber = Number.isFinite(Number(claim.index)) ? Number(claim.index) + 1 : null;
  const claimLabel = claimNumber ? `Claim ${claimNumber}` : "Claim";
  const metrics = `${dpCount} DP ref${dpCount === 1 ? "" : "s"} · ${citationCount} citation${citationCount === 1 ? "" : "s"}`;

  return `
      <button
        type="button"
        class="cr-trace-claim-item${isActive ? " is-active" : ""}"
        data-trace-claim-index="${claim.index}"
        aria-pressed="${String(isActive)}"
        aria-label="Open lineage for ${escapeHtml(claimLabel)}"
      >
        <span class="cr-trace-claim-header">
          <span class="cr-trace-claim-label">${escapeHtml(claimLabel)}</span>
          <span class="cr-trace-claim-meta">${escapeHtml(metrics)}</span>
        </span>
        <span class="cr-trace-claim-text">${escapeHtml(compactText)}</span>
      </button>
    `;
};

const focusClaimInDrawer = (claimIndex) => {
  const normalizedIndex = Number(claimIndex);
  if (Number.isNaN(normalizedIndex)) return;
  const target = refs.lineageDrawerBody?.querySelector(`[data-trace-claim-index="${normalizedIndex}"]`);
  if (!target) return;
  target.focus({ preventScroll: true });
};

const renderExploreTraceDrawer = (lineageMarkup = "") => {
  if (!refs.lineageDrawerBody) return;
  const claims = Array.isArray(state.selectedClaims) ? state.selectedClaims : [];
  const claimsSignature = claims
    .map((claim) => {
      const claimIndex = Number(claim.index);
      const normalizedIndex = Number.isNaN(claimIndex) ? String(claim.index ?? "") : String(claimIndex);
      const citationCount = (claim.citations || []).length;
      const dpCount = (claim.dp_refs || []).reduce((sum, ref) => sum + (ref.dp_ids || []).length, 0);
      return `${normalizedIndex}:${dpCount}:${citationCount}`;
    })
    .join("|");
  const totals = summarizeClaimsWorkspace(claims);
  const activeClaim = claims.find((claim) => claim.index === state.explore.activeClaimIndex) || null;
  const activeClaimLabel = activeClaim && Number.isFinite(Number(activeClaim.index))
    ? `Claim ${Number(activeClaim.index) + 1}`
    : "No claim selected";
  const claimsMarkup = claims.length
    ? claims
      .map((claim) => buildExploreClaimItemMarkup(claim, state.explore.activeClaimIndex === claim.index))
      .join("")
    : '<div class="cr-empty-text">No claims detected in this document.</div>';

  const fallbackLineage = claims.length
    ? '<div class="cr-empty-text">Select a claim or click a citation in the document to view grouped lineage details.</div>'
    : '<div class="cr-empty-text">Lineage trace is unavailable for files without claims.</div>';
  const activeClaimKey = Number.isFinite(Number(state.explore.activeClaimIndex))
    ? String(Number(state.explore.activeClaimIndex))
    : "";

  const existingDoc = refs.lineageDrawerBody.querySelector(".cr-drawer-doc--explore-trace");
  const isIncrementalUpdate = Boolean(
    existingDoc && existingDoc.dataset.traceClaimsSignature === claimsSignature,
  );
  if (isIncrementalUpdate) {
    const claimsMeta = existingDoc.querySelector('[data-trace-claims-meta="true"]');
    if (claimsMeta) {
      claimsMeta.textContent = `${totals.claims} claim${totals.claims === 1 ? "" : "s"} · ${totals.citations} citation${totals.citations === 1 ? "" : "s"}`;
    }
    existingDoc.querySelectorAll("[data-trace-claim-index]").forEach((btn) => {
      const isActive = btn.dataset.traceClaimIndex === activeClaimKey;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
    const activeClaimMeta = existingDoc.querySelector('[data-trace-active-claim="true"]');
    if (activeClaimMeta) {
      activeClaimMeta.textContent = activeClaimLabel;
    }
    const lineageBody = existingDoc.querySelector(".cr-trace-lineage-body");
    const nextLineageMarkup = lineageMarkup || fallbackLineage;
    if (lineageBody) {
      if (lineageBody.innerHTML !== nextLineageMarkup) {
        lineageBody.innerHTML = nextLineageMarkup;
      }
    }
    return;
  }

  const previousClaimList = refs.lineageDrawerBody.querySelector(".cr-trace-claim-list");
  const previousClaimListScrollTop = previousClaimList ? previousClaimList.scrollTop : null;

  refs.lineageDrawerBody.innerHTML = `
    <article class="cr-drawer-doc cr-drawer-doc--explore-trace" data-trace-claims-signature="${escapeHtml(claimsSignature)}">
      <section class="cr-drawer-doc-section">
        <div class="cr-drawer-doc-identity-row">
          <span class="cr-drawer-doc-section-title">Claim navigator</span>
          <span class="cr-drawer-doc-meta" data-trace-claims-meta="true">${totals.claims} claim${totals.claims === 1 ? "" : "s"} · ${totals.citations} citation${totals.citations === 1 ? "" : "s"}</span>
        </div>
        <div class="cr-drawer-doc-section-body">
          <div class="cr-trace-claim-list">${claimsMarkup}</div>
        </div>
      </section>
      <section class="cr-drawer-doc-section">
        <div class="cr-drawer-doc-identity-row">
          <h4 class="cr-drawer-doc-section-title">Selected claim lineage</h4>
          <span class="cr-drawer-doc-meta" data-trace-active-claim="true">${escapeHtml(activeClaimLabel)}</span>
        </div>
        <div class="cr-drawer-doc-section-body cr-trace-lineage-body">
          ${lineageMarkup || fallbackLineage}
        </div>
      </section>
    </article>
  `;

  if (previousClaimListScrollTop != null) {
    const nextClaimList = refs.lineageDrawerBody.querySelector(".cr-trace-claim-list");
    if (nextClaimList) {
      nextClaimList.scrollTop = previousClaimListScrollTop;
    }
  }
};

const renderFilterSummary = () => {
  if (!refs.filterSummary) return;

  const total = state.files.length || 0;
  const count = state.filtered.length || 0;
  if (refs.filterCount) {
    refs.filterCount.textContent = `${count} of ${total} files`;
  }

  const chips = [];
  const searchValue = refs.searchInput?.value.trim() || "";
  if (searchValue) chips.push({ label: `Search: ${searchValue}`, kind: "search" });

  Array.from(state.activeFilters.types || []).forEach((type) => {
    chips.push({ label: getCompressionTypeLabel(type), kind: "type" });
  });

  Array.from(state.activeFilters.tags || []).forEach((tag) => {
    chips.push({ label: tag, kind: "tag" });
  });

  if (refs.filterHint) {
    refs.filterHint.textContent = chips.length ? "Filtering active" : "All files";
  }

  if (refs.filterChips) {
    if (!chips.length) {
      refs.filterChips.innerHTML = '<span class="cr-filter-muted">No filters active</span>';
    } else {
      refs.filterChips.innerHTML = chips
        .map((chip) => {
          const kindClass = chip.kind ? ` is-${chip.kind}` : "";
          return `<span class="cr-filter-chip${kindClass}">${escapeHtml(chip.label)}</span>`;
        })
        .join("");
    }
  }

  if (refs.clearFiltersBtn) {
    refs.clearFiltersBtn.style.visibility = chips.length ? "visible" : "hidden";
  }
};

const applyFilters = () => {
  const searchValue = refs.searchInput?.value.trim().toLowerCase() || "";
  const activeTypes = state.activeFilters.types;
  const activeTags = state.activeFilters.tags;

  state.filtered = state.files.filter((file) => {
    // Type filter
    if (activeTypes.size > 0) {
      const hasTypeMatch = Array.from(activeTypes).some((type) => matchesCompressionType(file, type));
      if (!hasTypeMatch) return false;
    }

    // Tag filter
    if (activeTags.size > 0) {
      const fileTags = new Set(file.tags || []);
      let hasMatch = false;
      activeTags.forEach((tag) => {
        if (fileTags.has(tag)) hasMatch = true;
      });
      if (!hasMatch) return false;
    }

    // Search filter
    if (searchValue) {
      const haystack = [
        file.title,
        file.name,
        (file.tags || []).join(" "),
        file.path,
      ].join(" ").toLowerCase();
      if (!haystack.includes(searchValue)) return false;
    }

    return true;
  });

  // Sort
  const sortFn = {
    newest: (a, b) => (b.mtime || 0) - (a.mtime || 0),
    oldest: (a, b) => (a.mtime || 0) - (b.mtime || 0),
    name: (a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""),
  };

  state.filtered.sort(sortFn[state.sortOrder] || sortFn.newest);
  renderFileList();
  renderFilterSummary();
};

const renderFileList = () => {
  if (!refs.fileList) return;
  refs.fileList.innerHTML = "";

  if (!state.filtered.length) {
    refs.fileList.innerHTML = '<div class="cr-empty"><div class="cr-empty-text">No files match your filters</div></div>';
    return;
  }

  state.filtered.forEach((file) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "cr-file-card cr-file-card--explore";
    const isSelected = state.selected?.path === file.path;
    if (isSelected) {
      card.classList.add("is-selected");
    }
    card.setAttribute("aria-pressed", String(isSelected));

    const title = file.title || file.stem || file.name;
    const type = file.type || "File";
    const cardStats = [];
    const dpCount = Math.max(Number(file.dp_detail_count) || 0, Number(file.dp_count) || 0);
    const claimCount = Number(file.claim_count) || 0;
    const tagCount = Array.isArray(file.tags) ? file.tags.length : 0;
    const evidenceCount = Number(file.evidence_links_count) || 0;

    if (dpCount > 0) cardStats.push(`${dpCount} DPs`);
    if (claimCount > 0) cardStats.push(`${claimCount} claims`);
    if (tagCount > 0) cardStats.push(`${tagCount} tags`);
    if (evidenceCount > 0) cardStats.push(`${evidenceCount} citation links`);

    if (!cardStats.length && Number(file.size) > 0) {
      cardStats.push(`${(Number(file.size) / 1024).toFixed(1)} KB`);
    }

    card.innerHTML = `
      <span class="cr-file-card-header">
        <span class="cr-file-card-type">${escapeHtml(type)}</span>
        <span class="cr-file-card-date">${formatRelativeDate(file.mtime)}</span>
      </span>
      <span class="cr-file-card-title">${escapeHtml(title)}</span>
      ${cardStats.length ? `<span class="cr-file-card-meta">${escapeHtml(cardStats.join(" · "))}</span>` : ""}
    `;

    card.addEventListener("click", () => selectFile(file));
    refs.fileList.appendChild(card);
  });
};

const selectFile = async (file) => {
  state.selected = file;
  renderFileList();

  // Show header, hide empty state
  if (refs.emptyPreview) refs.emptyPreview.style.display = "none";
  if (refs.docHeader) refs.docHeader.style.display = "block";

  // Populate header
  if (refs.docType) refs.docType.textContent = file.type || "Document";
  if (refs.docTitle) refs.docTitle.textContent = file.title || file.stem || file.name;
  if (refs.docPath) refs.docPath.textContent = file.path;
  if (refs.docContent) refs.docContent.textContent = "Loading...";

  // Fetch file content
  const res = await fetch(`/api/file?path=${encodeURIComponent(file.path)}`);
  const data = await res.json();
  state.selectedData = data;
  state.selectedClaims = (data.claim_refs || []).map((claim, index) => ({ ...claim, index }));
  state.explore.activeClaimIndex = null;
  state.explore.activeLineagePayload = null;
  state.explore.isLineageLoading = false;
  state.explore.lineageRequestId += 1;
  state.explore.tracePanelMode = "claims";
  state.explore.tagsExpanded = false;

  // Update stats
  const sizeKB = ((data.size || 0) / 1024).toFixed(1);
  const stats = [`${sizeKB} KB`, formatDate(data.mtime)];
  if (data.dp_count) stats.unshift(`${data.dp_count} DPs`);
  if (data.claim_count) stats.unshift(`${data.claim_count} claims`);
  if (refs.docStats) refs.docStats.textContent = stats.join(" · ");

  renderDocTags(data.tags || []);
  renderClaimsList(state.selectedClaims);

  // Render content
  renderDocContent(data);
  refs.docContent?.scrollTo({ top: 0 });
};

const renderDocContent = (data) => {
  if (!refs.docContent) return;

  if (!data.content) {
    const isPdf = isPdfFile(data);
    const openPdfAction = isPdf && data.path
      ? `<div class="cr-empty-action"><a class="cr-btn cr-btn--sm" href="/files?path=${encodeURIComponent(data.path)}" target="_blank" rel="noopener noreferrer">Open PDF</a></div>`
      : "";
    refs.docContent.innerHTML = `
      <div class="cr-empty">
        <div class="cr-empty-title">Preview not available</div>
        <div class="cr-empty-text">This file type cannot be previewed inline.</div>
        ${openPdfAction}
      </div>
    `;
    return;
  }

  if (isMarkdownFile(data) && state.viewMode === "rendered") {
    renderMarkdown(data.content, state.selectedClaims);
  } else {
    renderRaw(data.content);
  }
};

const renderMarkdown = (content, claims = []) => {
  const markedLib = window.marked;
  const purifier = window.DOMPurify;

  if (!markedLib || !purifier) {
    renderRaw(content);
    return;
  }

  markedLib.setOptions({ gfm: true, breaks: true });

  const enriched = injectClaimMarkup(content, claims);
  const prepared = prepareMarkdownForRender(enriched);
  const rawHtml = markedLib.parse(prepared);
  const cleanHtml = purifier.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["data-claim-index", "role", "tabindex", "aria-label"],
  });

  refs.docContent.innerHTML = cleanHtml;
  refs.docContent.classList.remove("is-raw");
  refs.docContent.classList.add("is-markdown");

  // Process links
  refs.docContent.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.dataset.originalHref = href;

    const resolved = resolveLocalFile(state.selectedData?.path, href);
    if (resolved) {
      link.dataset.resolvedPath = resolved;
      const ext = resolved.split(".").pop()?.toLowerCase();
      if (ext === "pdf") {
        link.setAttribute("href", `/files?path=${encodeURIComponent(resolved)}`);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        return;
      }
      if (RAW_EXTENSIONS.has(ext)) {
        link.setAttribute("href", "#");
        return;
      }
    }

    if (isExternalLink(href)) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
};

const renderRaw = (content) => {
  if (!refs.docContent) return;
  refs.docContent.textContent = content;
  refs.docContent.classList.add("is-raw");
  refs.docContent.classList.remove("is-markdown");
};

const prepareMarkdownForRender = (content) => {
  if (!content) return "";
  let text = normalizeNewlines(content);
  text = convertWikiLinks(text);
  text = encodeMarkdownLinkDestinations(text);
  return text;
};

const convertWikiLinks = (text) => {
  if (!text) return text;
  return text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, target, alias) => {
    const label = (alias || target).trim();
    const href = target.trim();
    if (!href) return _match;
    return `[${label}](${href})`;
  });
};

const encodeMarkdownLinkDestinations = (text) => {
  if (!text) return text;
  return text.replace(/\[([^\]]+)\]\(([^)\n]+)\)/g, (_match, label, destination) => {
    const trimmed = destination.trim();
    if (!trimmed) return _match;
    if (hasScheme(trimmed) || trimmed.startsWith("data:")) return _match;
    const encodedUrl = trimmed.replace(/\s/g, "%20");
    return `[${label}](${encodedUrl})`;
  });
};

const injectClaimMarkup = (content, claims) => {
  if (!content || !Array.isArray(claims) || !claims.length) return content;
  let cursor = 0;
  let result = "";
  claims.forEach((claim) => {
    const claimIndex = claim.index;
    (claim.citations || []).forEach((citation) => {
      if (!citation) return;
      const idx = content.indexOf(citation, cursor);
      if (idx < 0) return;
      result += content.slice(cursor, idx);
      const token = `<span class="cr-claim-citation" data-claim-index="${claimIndex}" role="button" tabindex="0" aria-label="Trace lineage for citation">${escapeHtml(citation)}</span>`;
      result += token;
      cursor = idx + citation.length;
    });
  });
  result += content.slice(cursor);
  return result;
};

// =============================================================================
// CLAIMS & LINEAGE
// =============================================================================

const renderClaimsList = (claims = []) => {
  state.selectedClaims = Array.isArray(claims) ? claims : [];
  if (!state.selectedClaims.length) {
    state.explore.activeClaimIndex = null;
  }
  renderTraceEntrySummary(state.selectedClaims);
  if (refs.lineageDrawer?.classList.contains("is-open")) {
    const lineageMarkup = state.explore.tracePanelMode === "lineage" && state.explore.activeLineagePayload
      ? buildLineageMarkup(state.explore.activeLineagePayload)
      : "";
    renderExploreTraceDrawer(lineageMarkup);
  }
};

const isAnyDrawerOpen = () =>
  [refs.lineageDrawer, refs.ideaDrawer, refs.takeawayDrawer, refs.trendDrawer, refs.positionDrawer]
    .some((drawer) => drawer?.classList.contains("is-open"));

const syncDrawerState = () => {
  document.body.classList.toggle("is-drawer-open", isAnyDrawerOpen());
};

const openLineage = async (claimIndex) => {
  if (!refs.lineageDrawer || !refs.lineageDrawerBody || !state.selected?.path) return;
  const normalizedIndex = Number(claimIndex);
  const resolvedIndex = Number.isNaN(normalizedIndex) ? claimIndex : normalizedIndex;
  const requestId = state.explore.lineageRequestId + 1;
  state.explore.lineageRequestId = requestId;
  if (!Number.isNaN(normalizedIndex)) {
    state.explore.activeClaimIndex = normalizedIndex;
  }
  state.explore.tracePanelMode = "lineage";
  state.explore.isLineageLoading = true;
  const renderedLineageBody = refs.lineageDrawerBody.querySelector(".cr-trace-lineage-body");
  const hasRenderedLineage = Boolean(renderedLineageBody?.innerHTML?.trim());
  const preservedLineageMarkup = hasRenderedLineage
    ? renderedLineageBody.innerHTML
    : (state.explore.activeLineagePayload
      ? buildLineageMarkup(state.explore.activeLineagePayload)
      : '<div class="cr-empty-text">Loading lineage trace...</div>');
  renderExploreTraceDrawer(preservedLineageMarkup);
  refs.lineageDrawer.classList.add("is-open");
  syncDrawerState();
  if (!Number.isNaN(normalizedIndex)) {
    focusClaimInDrawer(normalizedIndex);
  }

  try {
    const res = await fetch(`/api/lineage?path=${encodeURIComponent(state.selected.path)}&claim=${encodeURIComponent(resolvedIndex)}`);
    if (!res.ok) {
      throw new Error(`Lineage request failed (${res.status})`);
    }
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    if (requestId !== state.explore.lineageRequestId) return;
    state.explore.activeLineagePayload = data;
    state.explore.isLineageLoading = false;
    renderExploreTraceDrawer(buildLineageMarkup(data));
    if (!Number.isNaN(normalizedIndex)) {
      focusClaimInDrawer(normalizedIndex);
    }
  } catch (error) {
    console.error(error);
    if (requestId !== state.explore.lineageRequestId) return;
    state.explore.isLineageLoading = false;
    if (state.explore.activeLineagePayload) {
      renderExploreTraceDrawer(buildLineageMarkup(state.explore.activeLineagePayload));
      return;
    }
    renderExploreTraceDrawer('<div class="cr-empty-text">Unable to load lineage trace for this claim.</div>');
  }
};

const openExploreClaimLineage = (claimIndex) => {
  const normalizedIndex = Number(claimIndex);
  if (Number.isNaN(normalizedIndex)) return false;
  openLineage(normalizedIndex);
  return true;
};

const openCitationLineage = (citation) => {
  if (!citation) return false;
  const idx = citation.dataset.claimIndex;
  if (idx == null) return false;
  return openExploreClaimLineage(idx);
};

const openExploreTracePanel = () => {
  if (!refs.lineageDrawer || !refs.lineageDrawerBody) return;
  state.explore.tracePanelMode = "claims";
  state.explore.activeLineagePayload = null;
  state.explore.isLineageLoading = false;
  state.explore.lineageRequestId += 1;
  renderExploreTraceDrawer("");
  refs.lineageDrawer.classList.add("is-open");
  syncDrawerState();
};

const closeLineage = () => {
  refs.lineageDrawer?.classList.remove("is-open");
  syncDrawerState();
};

const groupLineageNodes = (nodes = []) => {
  const allNodes = Array.isArray(nodes) ? nodes : [];
  const issues = allNodes.filter((node) => node?.type === "missing" || node?.type === "ambiguous");
  const dps = allNodes.filter((node) => node?.type === "dp");
  const extractions = allNodes.filter((node) => node?.type === "extraction");
  const raws = allNodes.filter((node) => node?.type === "raw");
  const hasMissingDp = dps.some((node) => Boolean(node?.metadata?.missing));
  const totals = {
    issues: issues.length,
    dps: dps.length,
    extractions: extractions.length,
    raws: raws.length,
    all: issues.length + dps.length + extractions.length + raws.length,
  };
  return {
    issues,
    dps,
    extractions,
    raws,
    totals,
    hasMissingDp,
    hasUnresolved: issues.length > 0 || hasMissingDp,
  };
};

const buildLineageOverviewMarkup = (claim, grouped) => {
  const claimText = cleanLineageText(claim?.text || "Claim");
  const compactClaim = claimText.length > 360 ? `${claimText.slice(0, 357)}...` : claimText;
  const statusClass = "is-warning";
  const statusText = "Needs review: unresolved lineage links";

  const countChips = [
    { key: "dps", label: "DPs", count: grouped.totals.dps },
    { key: "extractions", label: "Extractions", count: grouped.totals.extractions },
    { key: "raws", label: "Raw Sources", count: grouped.totals.raws },
    ...(grouped.totals.issues > 0 ? [{ key: "issues", label: "Issues", count: grouped.totals.issues }] : []),
  ];

  return `
    <section class="cr-lineage-overview cr-drawer-doc-lead">
      <div class="cr-lineage-overview-head">
        <span class="cr-lineage-overview-kicker cr-drawer-doc-kicker">Selected claim</span>
        ${grouped.hasUnresolved ? `<span class="cr-lineage-overview-status ${statusClass}">${escapeHtml(statusText)}</span>` : ""}
      </div>
      <p class="cr-lineage-overview-claim">${escapeHtml(compactClaim)}</p>
      <div class="cr-lineage-overview-counts">
        ${countChips.map((chip) => `
          <span class="cr-lineage-overview-chip" data-lineage-chip="${chip.key}">
            ${chip.count} ${chip.label}
          </span>
        `).join("")}
      </div>
    </section>
  `;
};

const normalizeEvidenceTraceFromLineagePayload = (payload, options = {}) => {
  const claimId = String(payload?.claim?.id || options.statementId || "lineage-claim");
  const lineage = payload?.lineage || {};
  const nodes = Array.isArray(lineage.nodes) ? lineage.nodes : [];
  const edges = Array.isArray(lineage.edges) ? lineage.edges : [];
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const extractionByPath = new Map(
    nodes
      .filter((node) => node?.type === "extraction" && node?.path)
      .map((node) => [node.path, node]),
  );

  const outgoing = new Map();
  const incoming = new Map();
  edges.forEach((edge = {}) => {
    const from = edge.from;
    const to = edge.to;
    if (!from || !to) return;
    if (!outgoing.has(from)) outgoing.set(from, []);
    if (!incoming.has(to)) incoming.set(to, []);
    outgoing.get(from).push(edge);
    incoming.get(to).push(edge);
  });

  const bundlesByKey = new Map();
  const unscopedIssues = [];

  const ensureBundle = ({ key, sourceLabel, sourcePath, sourceTitle }) => {
    const bundleKey = key || sourcePath || sourceLabel || `bundle-${bundlesByKey.size + 1}`;
    if (!bundlesByKey.has(bundleKey)) {
      bundlesByKey.set(bundleKey, {
        statementId: claimId,
        sourceLabel: cleanLineageText(sourceLabel || "Source"),
        sourcePath: sourcePath || null,
        rawSource: null,
        rawSourcePath: null,
        rawSourceUrl: null,
        status: "linked",
        dpIds: [],
        dpDetails: [],
        issues: [],
        candidates: [],
        sourceTitle: sourceTitle || sourceLabel || null,
        confidence: 1,
      });
    }
    return bundlesByKey.get(bundleKey);
  };

  const ensureBundleFromExtractionId = (extractionId) => {
    const extractionNode = nodesById.get(extractionId);
    if (!extractionNode) return null;
    const sourcePath = extractionNode.path || null;
    const sourceLabel = cleanLineageText(extractionNode.label || sourcePath || "Extraction");
    return ensureBundle({
      key: sourcePath || extractionId,
      sourceLabel,
      sourcePath,
      sourceTitle: sourceLabel,
    });
  };

  const addIssueToBundle = (bundle, issueText) => {
    if (!bundle || !issueText) return;
    if (!bundle.issues.includes(issueText)) bundle.issues.push(issueText);
  };

  nodes
    .filter((node) => node?.type === "extraction")
    .forEach((node) => {
      const sourcePath = node.path || null;
      const sourceLabel = cleanLineageText(node.label || sourcePath || "Extraction");
      ensureBundle({
        key: sourcePath || node.id,
        sourceLabel,
        sourcePath,
        sourceTitle: sourceLabel,
      });
    });

  nodes
    .filter((node) => node?.type === "dp")
    .forEach((node) => {
      const meta = node.metadata || {};
      const dpId = cleanLineageText(node.label || "DP");
      let sourcePath = typeof node.path === "string" ? node.path : "";
      if (!sourcePath) {
        const fromEdge = (outgoing.get(node.id) || []).find((edge) => edge.relation === "from");
        const extractionNode = fromEdge ? nodesById.get(fromEdge.to) : null;
        sourcePath = extractionNode?.path || "";
      }
      const extractionNode = sourcePath ? extractionByPath.get(sourcePath) : null;
      const sourceLabel = cleanLineageText(extractionNode?.label || sourcePath || "Extraction");
      const bundle = ensureBundle({
        key: sourcePath || `dp:${node.id}`,
        sourceLabel,
        sourcePath: sourcePath || null,
        sourceTitle: sourceLabel,
      });

      if (dpId && !bundle.dpIds.includes(dpId)) bundle.dpIds.push(dpId);
      if (!bundle.dpDetails.some((item) => item.dp_id === dpId)) {
        bundle.dpDetails.push({
          dp_id: dpId,
          claim: meta.claim || null,
          anchor: meta.anchor || null,
          citation: meta.citation || null,
        });
      }
      if (meta.missing) {
        addIssueToBundle(bundle, "DP detail is missing from the resolved extraction.");
      }
    });

  nodes
    .filter((node) => node?.type === "raw")
    .forEach((node) => {
      const meta = node.metadata || {};
      const rawFromNode = resolveRawSourceTarget(node.path || "");
      const rawFromMeta = resolveRawSourceTarget(meta.raw_source || "");
      const extractionIds = (incoming.get(node.id) || [])
        .map((edge) => edge.from)
        .filter((fromId) => nodesById.get(fromId)?.type === "extraction");
      extractionIds.forEach((extractionId) => {
        const bundle = ensureBundleFromExtractionId(extractionId);
        if (!bundle) return;
        bundle.rawSource = bundle.rawSource || rawFromMeta.rawSource || rawFromNode.rawSource || null;
        bundle.rawSourcePath = bundle.rawSourcePath || rawFromNode.rawSourcePath || rawFromMeta.rawSourcePath || null;
        bundle.rawSourceUrl = bundle.rawSourceUrl || rawFromNode.rawSourceUrl || rawFromMeta.rawSourceUrl || null;
      });
    });

  nodes
    .filter((node) => node?.type === "missing" || node?.type === "ambiguous")
    .forEach((node) => {
      const meta = node.metadata || {};
      const issueText = cleanLineageText(meta.reason || node.label || "Issue");
      const candidatePaths = Array.isArray(meta.candidates)
        ? meta.candidates.filter(Boolean)
        : [];
      const candidateEntries = candidatePaths.map((path) => ({
        path,
        title: state.fileMap.get(path)?.title || state.fileMap.get(path)?.stem || state.fileMap.get(path)?.name || path,
      }));
      const scopedKeys = new Set();

      (incoming.get(node.id) || []).forEach((edge) => {
        const fromNode = nodesById.get(edge.from);
        if (fromNode?.type === "extraction" && fromNode.path) scopedKeys.add(fromNode.path);
      });
      (outgoing.get(node.id) || []).forEach((edge) => {
        const toNode = nodesById.get(edge.to);
        if (toNode?.type === "extraction" && toNode.path) scopedKeys.add(toNode.path);
      });
      candidateEntries.forEach((candidate) => {
        if (candidate.path && extractionByPath.has(candidate.path)) scopedKeys.add(candidate.path);
      });

      if (scopedKeys.size) {
        scopedKeys.forEach((key) => {
          const extractionNode = extractionByPath.get(key);
          const bundle = ensureBundle({
            key,
            sourceLabel: cleanLineageText(extractionNode?.label || key),
            sourcePath: key,
            sourceTitle: extractionNode?.label || key,
          });
          addIssueToBundle(bundle, issueText);
          candidateEntries.forEach((candidate) => {
            if (!candidate.path) return;
            if (!bundle.candidates.some((item) => item.path === candidate.path)) {
              bundle.candidates.push(candidate);
            }
          });
          bundle.status = node.type === "ambiguous" ? "ambiguous" : "unresolved";
        });
      } else {
        unscopedIssues.push({
          text: issueText,
          candidates: candidateEntries,
        });
      }
    });

  const bundles = [...bundlesByKey.values()]
    .map((bundle) => {
      const normalized = {
        ...bundle,
        dpIds: [...new Set(bundle.dpIds)],
      };
      if (normalized.status === "linked" && normalized.candidates.length) {
        normalized.status = "ambiguous";
      }
      if (normalized.status === "linked" && normalized.issues.length) {
        normalized.status = "unresolved";
      }
      return normalized;
    })
    .sort((a, b) => a.sourceLabel.localeCompare(b.sourceLabel));

  return {
    bundles,
    issues: unscopedIssues,
  };
};

const renderUnscopedLineageIssues = (issues = []) => {
  if (!issues.length) return "";
  return `
    <section class="cr-drawer-doc-section">
      <h4 class="cr-drawer-doc-section-title">Issues</h4>
      <div class="cr-drawer-doc-section-body">
        <div class="cr-citation-dp-list">
          ${issues.map((issue) => `
            <article class="cr-citation-dp-item cr-citation-dp-item--note">
              <p class="cr-citation-note">${escapeHtml(issue.text || "Issue detected.")}</p>
              ${Array.isArray(issue.candidates) && issue.candidates.length ? `
                <div class="cr-citation-actions">
                  ${issue.candidates.map((candidate) =>
                    candidate.path
                      ? `<button class="cr-btn cr-btn--sm" data-open-path="${escapeHtml(candidate.path)}" type="button">View source</button>`
                      : ""
                  ).join("")}
                </div>
              ` : ""}
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
};

const buildLineageMarkup = (payload) => {
  const claim = payload?.claim;
  const lineage = payload?.lineage || {};
  const nodes = lineage.nodes || [];
  const grouped = groupLineageNodes(nodes);
  const evidenceTrace = normalizeEvidenceTraceFromLineagePayload(payload, {
    statementId: String(claim?.id || "lineage-claim"),
  });
  if (!claim && grouped.totals.all === 0) {
    return '<div class="cr-empty-text">No lineage data available.</div>';
  }
  const sourceCount = evidenceTrace.bundles.length;
  const supportingLabel = `${sourceCount} source${sourceCount === 1 ? "" : "s"} · ${grouped.totals.dps} DP${grouped.totals.dps === 1 ? "" : "s"}`;
  const bundlesMarkup = renderEvidenceTraceBundles(evidenceTrace.bundles, {
    emptyText: "No evidence trace linked for this claim.",
    expandFirst: true,
  });

  return `
    <article class="cr-drawer-doc cr-drawer-doc--lineage">
      ${claim ? buildLineageOverviewMarkup(claim, grouped) : ""}
      <div class="cr-drawer-doc-identity-row">
        <span class="cr-drawer-doc-section-title">Evidence trace</span>
        <span class="cr-drawer-doc-meta">${supportingLabel}</span>
      </div>
      <div class="cr-lineage-groups">
        ${bundlesMarkup}
      </div>
      ${renderUnscopedLineageIssues(evidenceTrace.issues)}
    </article>
  `;
};

const renderLineageTrace = (payload) => {
  if (!refs.lineageDrawerBody) return;
  renderExploreTraceDrawer(buildLineageMarkup(payload));
};

// =============================================================================
// IDEA DRAWER
// =============================================================================

const openIdeaDrawer = (idea, highlightQuestion = "") => {
  if (!idea || !refs.ideaDrawer || !refs.ideaDrawerBody) return;

  const ideaTitle = cleanLineageText(idea.title || "Active Idea");

  if (refs.ideaDrawerTitle) refs.ideaDrawerTitle.textContent = "Active Idea";

  const highlightedKey = highlightQuestion ? normalizeLookupKey(highlightQuestion) : "";

  const driversHtml = idea.drivers?.length
    ? `<ul class="cr-idea-inline-list">${idea.drivers.map((d) => `<li>${renderInlineMarkdownBold(d)}</li>`).join("")}</ul>`
    : '<div class="cr-empty-text">No drivers listed.</div>';

  const evidenceInputs = (idea.evidence || [])
    .map((item) => `${item.source || ""}${item.dp ? ` ${item.dp}` : ""}`.trim())
    .filter(Boolean);

  const questionsHtml = idea.openQuestions?.length
    ? `<ul class="cr-idea-inline-list">${idea.openQuestions.map((q) => {
      const isHighlight = highlightedKey && normalizeLookupKey(q) === highlightedKey;
      return `<li class="${isHighlight ? "is-highlight" : ""}">${renderInlineMarkdownBold(q)}</li>`;
    }).join("")}</ul>`
    : '<div class="cr-empty-text">No open questions listed.</div>';

  const evidenceCount = idea.evidence?.length || 0;
  const questionCount = idea.openQuestions?.length || 0;
  const citationCountLabel = `${evidenceCount} citation${evidenceCount === 1 ? "" : "s"}`;

  refs.ideaDrawerBody.innerHTML = `
    <article class="cr-drawer-doc cr-drawer-doc--idea">
      <div class="cr-drawer-doc-identity-row">
        <span class="cr-drawer-doc-kicker">Idea synthesis</span>
        <span class="cr-drawer-doc-meta">${citationCountLabel} · ${questionCount} open questions</span>
      </div>
      <h3 class="cr-drawer-doc-item-title">${escapeHtml(ideaTitle)}</h3>

      <section class="cr-drawer-doc-lead">
        <div class="cr-drawer-doc-kicker">Summary</div>
        <div class="cr-drawer-doc-lead-text">${renderInlineMarkdownBold(idea.summary || "Summary pending.")}</div>
      </section>

      <section class="cr-drawer-doc-section">
        <h4 class="cr-drawer-doc-section-title">Drivers</h4>
        <div class="cr-drawer-doc-section-body">${driversHtml}</div>
      </section>
      <section class="cr-drawer-doc-section">
        <h4 class="cr-drawer-doc-section-title">Supporting Citations</h4>
        <div class="cr-drawer-doc-section-body">
          <div class="cr-citation-host" data-citation-host="idea-drawer"></div>
        </div>
      </section>
      <section class="cr-drawer-doc-section">
        <h4 class="cr-drawer-doc-section-title">Open Questions</h4>
        <div class="cr-drawer-doc-section-body">${questionsHtml}</div>
      </section>
    </article>
  `;

  refs.ideaDrawer.classList.add("is-open");
  syncDrawerState();

  const evidenceHost = refs.ideaDrawerBody.querySelector('[data-citation-host="idea-drawer"]');
  hydrateCitationHost(evidenceHost, evidenceInputs, "06_Current_Understanding/Active_Ideas.md", {
    emptyText: "No citations listed.",
    compact: true,
  });
};

const closeIdeaDrawer = () => {
  refs.ideaDrawer?.classList.remove("is-open");
  syncDrawerState();
};

const resolveEvidencePath = (source) => {
  if (!source) return null;
  const normalized = normalizeLookupKey(source);
  if (state.fileNameMap.has(normalized)) {
    return state.fileNameMap.get(normalized);
  }
  const direct = state.fileMap.get(source);
  if (direct) return source;
  return null;
};

const EVIDENCE_MATCH_STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "citation", "citations",
  "for", "from", "in", "is", "of", "on", "or", "section", "source", "sources",
  "that", "the", "to", "was", "were", "with",
]);

const normalizeEvidenceLookup = (value) => cleanLineageText(value || "")
  .toLowerCase()
  .replace(/[_/\\-]+/g, " ")
  .replace(/[^\w\s]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const tokenizeEvidenceLookup = (value) => normalizeEvidenceLookup(value)
  .split(" ")
  .map((token) => token.trim())
  .filter((token) => token && !EVIDENCE_MATCH_STOPWORDS.has(token))
  .filter((token) => !/^dp\d+[a-z0-9-]*$/i.test(token))
  .filter((token) => token.length >= 3 || /\d/.test(token));

const scoreCitationCandidate = (citationNorm, citationTokens, file) => {
  if (!file?.path || !isMarkdownFile(file)) return 0;

  const haystacks = [
    file.path,
    file.name,
    file.stem,
    stripProcessingDate(file.stem || ""),
    file.title,
  ]
    .filter(Boolean)
    .map((value) => normalizeEvidenceLookup(value))
    .filter(Boolean);

  if (!haystacks.length) return 0;

  let score = 0;
  if (haystacks.some((value) => value === citationNorm)) score += 40;
  if (haystacks.some((value) => value.startsWith(citationNorm))) score += 14;
  if (haystacks.some((value) => value.includes(citationNorm))) score += 10;

  const haystackTokens = new Set();
  haystacks.forEach((value) => {
    tokenizeEvidenceLookup(value).forEach((token) => haystackTokens.add(token));
  });

  let overlap = 0;
  citationTokens.forEach((token) => {
    if (!haystackTokens.has(token)) return;
    overlap += 1;
    score += token.length >= 6 ? 4 : 3;
  });

  if (citationTokens.length > 1 && overlap === citationTokens.length) score += 8;
  if (overlap === 0) score -= 3;

  if (file.path.startsWith("02_Extractions/")) score += 6;
  else if (file.path.startsWith("01_Raw_Inputs/")) score += 3;
  else if (file.path.startsWith("06_Current_Understanding/")) score += 2;

  return score;
};

const resolveCitationPathFuzzy = (citation, options = {}) => {
  const citationNorm = normalizeEvidenceLookup(citation);
  if (!citationNorm) return null;
  const onlyExtractions = Boolean(options.onlyExtractions);

  const citationTokens = tokenizeEvidenceLookup(citation);
  if (!citationTokens.length) return null;

  let best = null;

  (state.files || []).forEach((file) => {
    if (onlyExtractions && !file.path.startsWith("02_Extractions/")) return;
    const score = scoreCitationCandidate(citationNorm, citationTokens, file);
    if (score <= 0) return;

    const candidate = {
      path: file.path,
      score,
      isExtraction: file.path.startsWith("02_Extractions/") ? 1 : 0,
      mtime: file.mtime || 0,
    };

    if (!best
      || candidate.score > best.score
      || (candidate.score === best.score && candidate.isExtraction > best.isExtraction)
      || (candidate.score === best.score && candidate.isExtraction === best.isExtraction && candidate.mtime > best.mtime)) {
      best = candidate;
    }
  });

  if (!best || best.score < 12) return null;
  return best.path;
};

const resolveCitationPath = (citation) => {
  if (!citation) return null;
  const normalizedCitation = cleanLineageText(citation);
  const hasDpRefs = parseDpIdsFromCitation(normalizedCitation).length > 0;
  const candidates = [];

  candidates.push(normalizedCitation);

  const beforeDp = normalizedCitation
    .split(/\bDP\d+/i)[0]
    .replace(/[,:;()\-\s]+$/g, "")
    .trim();
  if (beforeDp) candidates.push(beforeDp);

  const withoutDp = normalizedCitation
    .replace(/\bDP\d+[A-Za-z0-9-]*\b/gi, " ")
    .replace(/[,:;()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (withoutDp) candidates.push(withoutDp);

  for (const candidate of candidates) {
    const path = resolveEvidencePath(candidate);
    if (!path) continue;
    if (hasDpRefs && !path.startsWith("02_Extractions/")) continue;
    return path;
  }

  for (const candidate of candidates) {
    const path = resolveCitationPathFuzzy(candidate, { onlyExtractions: hasDpRefs });
    if (path) return path;
  }

  return null;
};

const parseDpIdsFromCitation = (value) => {
  const matches = [...String(value || "").matchAll(/\bDP\s*(\d+)\b/gi)];
  const seen = new Set();
  const ids = [];
  matches.forEach((match) => {
    const raw = match[1];
    if (!raw || seen.has(raw)) return;
    seen.add(raw);
    ids.push(`DP${raw}`);
  });
  return ids;
};

const extractCitationSourceLabel = (citation) => {
  const cleaned = stripCitationMetadataBlocks(citation || "");
  const bare = cleaned.startsWith("[") && cleaned.endsWith("]") ? cleaned.slice(1, -1).trim() : cleaned.trim();
  if (!bare) return "Citation";
  const beforeDp = bare.split(/\bDP\d+/i)[0].replace(/[,:;()\-\s]+$/g, "").trim();
  return beforeDp || bare;
};

const expandCitationInputs = (citation) => {
  const raw = String(citation || "").trim();
  if (!raw) return [];
  const metadataBlocks = extractCitationMetadataBlocks(raw);
  const segments = splitCitationSegments(raw);
  if (!segments.length) return [];
  return segments.map((segment, index) => {
    const metadata = metadataBlocks[index];
    return metadata ? `${segment} <!-- cite:${metadata} -->` : segment;
  });
};

const citationCacheKey = (citation, contextPath = "") =>
  `${contextPath || ""}::${citation || ""}`;

const normalizeCitationContextEntry = (citation, entry = {}) => {
  const status = entry.status || "unresolved";
  return {
    original_text: citation,
    status,
    reference_type: entry.reference_type || "extraction",
    source_label: entry.source_label || extractCitationSourceLabel(citation),
    source_path: entry.source_path || null,
    source_title: entry.source_title || null,
    dp_ids: Array.isArray(entry.dp_ids) ? entry.dp_ids : [],
    dp_context: Array.isArray(entry.dp_context) ? entry.dp_context : [],
    candidates: Array.isArray(entry.candidates) ? entry.candidates : [],
    raw_source: typeof entry.raw_source === "string" ? entry.raw_source : null,
    raw_source_path: typeof entry.raw_source_path === "string" ? entry.raw_source_path : null,
    raw_source_url: typeof entry.raw_source_url === "string" ? entry.raw_source_url : null,
    confidence: typeof entry.confidence === "number" ? entry.confidence : (status === "linked" ? 0.8 : 0),
    reason: entry.reason || null,
  };
};

const buildFallbackCitationContextEntry = (citation) => {
  const path = resolveCitationPath(citation);
  const dpIds = parseDpIdsFromCitation(citation);
  const sourceLabel = extractCitationSourceLabel(citation);
  if (!path) {
    return normalizeCitationContextEntry(citation, {
      status: "unresolved",
      source_label: sourceLabel,
      source_path: null,
      dp_ids: dpIds,
      reason: "No indexed extraction match",
      confidence: 0,
    });
  }

  const file = state.fileMap.get(path);
  return normalizeCitationContextEntry(citation, {
    status: "linked",
    source_label: sourceLabel,
    source_path: path,
    source_title: file?.title || file?.stem || file?.name || path,
    dp_ids: dpIds,
    dp_context: [],
    confidence: 0.75,
    reason: null,
  });
};

const toDpNumericId = (value) => String(value || "")
  .trim()
  .replace(/^DP/i, "");

const pickBestPathByMtime = (paths = []) => {
  if (!Array.isArray(paths) || !paths.length) return null;
  return paths
    .slice()
    .sort((left, right) => {
      const leftMtime = Number(state.fileMap.get(left)?.mtime || 0);
      const rightMtime = Number(state.fileMap.get(right)?.mtime || 0);
      return rightMtime - leftMtime;
    })[0] || null;
};

const resolveRawSourcePath = (normalizedPath) => {
  if (!normalizedPath) return null;
  if (state.fileMap.has(normalizedPath)) return normalizedPath;

  const directAlias = state.aliasMap.get(normalizedPath);
  if (directAlias) return directAlias;

  const rawRangeMatch = normalizedPath.match(RAW_INPUTS_RANGE_RE);
  if (rawRangeMatch) {
    const aliasPath = `01_Raw_Inputs/${rawRangeMatch[1]}/${rawRangeMatch[2]}`;
    if (state.fileMap.has(aliasPath)) return aliasPath;
    const aliasResolved = state.aliasMap.get(aliasPath);
    if (aliasResolved) return aliasResolved;
  }

  const monthMatch = normalizedPath.match(/^01_Raw_Inputs\/(\d{4}-\d{2})\//);
  const basename = normalizedPath.split("/").pop();
  if (basename) {
    const byName = [];
    const byNameInMonth = [];
    state.fileMap.forEach((_, path) => {
      if (!path.startsWith("01_Raw_Inputs/")) return;
      if (!path.endsWith(`/${basename}`)) return;
      byName.push(path);
      if (monthMatch && path.startsWith(`01_Raw_Inputs/${monthMatch[1]}/`)) {
        byNameInMonth.push(path);
      }
    });

    if (byNameInMonth.length === 1) return byNameInMonth[0];
    if (byNameInMonth.length > 1) return pickBestPathByMtime(byNameInMonth);
    if (byName.length === 1) return byName[0];
    if (byName.length > 1) return pickBestPathByMtime(byName);
  }

  return resolveEvidencePath(normalizedPath);
};

const resolveRawSourceTarget = (rawSource) => {
  const rawValue = cleanLineageText(rawSource || "");
  if (!rawValue) {
    return { rawSource: null, rawSourcePath: null, rawSourceUrl: null };
  }
  if (/^https?:\/\//i.test(rawValue)) {
    return { rawSource: rawValue, rawSourcePath: null, rawSourceUrl: rawValue };
  }

  const normalizedPath = rawValue.replace(/^\/+/, "");
  const resolvedPath = resolveRawSourcePath(normalizedPath);
  if (resolvedPath) {
    return { rawSource: rawValue, rawSourcePath: resolvedPath, rawSourceUrl: null };
  }

  return { rawSource: rawValue, rawSourcePath: null, rawSourceUrl: null };
};

const fetchCitationSourceFile = async (path) => {
  if (!path) return null;
  if (state.citationSourceCache.has(path)) {
    return state.citationSourceCache.get(path);
  }
  try {
    const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
    if (!res.ok) {
      state.citationSourceCache.set(path, null);
      return null;
    }
    const data = await res.json();
    state.citationSourceCache.set(path, data);
    return data;
  } catch {
    state.citationSourceCache.set(path, null);
    return null;
  }
};

const enrichCitationEntryWithSourceDetails = (entry, sourceFile) => {
  if (!entry || entry.status !== "linked") return entry;
  if (!sourceFile) return entry;

  const rawTarget = resolveRawSourceTarget(sourceFile?.raw_source);
  const baseEntry = {
    ...entry,
    raw_source: rawTarget.rawSource || entry.raw_source || null,
    raw_source_path: rawTarget.rawSourcePath || entry.raw_source_path || null,
    raw_source_url: rawTarget.rawSourceUrl || entry.raw_source_url || null,
  };

  if (!entry.source_path || !Array.isArray(entry.dp_ids) || !entry.dp_ids.length) return baseEntry;
  if (Array.isArray(entry.dp_context) && entry.dp_context.length) return baseEntry;

  const dpDetails = Array.isArray(sourceFile?.dp_details) ? sourceFile.dp_details : [];
  if (!dpDetails.length) return baseEntry;

  const byId = new Map(dpDetails.map((dp) => [String(dp?.dp_id || "").trim(), dp]));
  const dpContext = entry.dp_ids.map((dp) => {
    const numericId = toDpNumericId(dp);
    const detail = byId.get(numericId);
    if (!detail) {
      return {
        dp_id: `DP${numericId || "?"}`,
        claim: null,
        anchor: null,
        citation: null,
      };
    }
    return {
      dp_id: `DP${numericId}`,
      claim: detail.claim || null,
      anchor: detail.anchor || null,
      citation: detail.citation || null,
    };
  });

  const found = dpContext.some((item) => item.claim || item.anchor || item.citation);
  if (!found) return baseEntry;

  const missingCount = dpContext.filter((item) => !item.claim && !item.anchor && !item.citation).length;
  const nextReason = missingCount > 0
    ? `${missingCount} referenced DP snippet${missingCount > 1 ? "s are" : " is"} still unavailable in this source.`
    : null;

  return {
    ...baseEntry,
    dp_context: dpContext,
    reason: nextReason,
  };
};

const fetchCitationContextMap = async (citations = [], contextPath = "") => {
  const expanded = citations.flatMap(expandCitationInputs).filter(Boolean);
  const unique = [];
  const seen = new Set();
  expanded.forEach((citation) => {
    const key = citationCacheKey(citation, contextPath);
    if (seen.has(key)) return;
    seen.add(key);
    unique.push(citation);
  });

  const pending = unique.filter((citation) => !state.citationContextCache.has(citationCacheKey(citation, contextPath)));
  if (pending.length) {
    try {
      const response = await fetch("/api/citation-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citations: pending,
          context_path: contextPath || undefined,
        }),
      });

      if (!response.ok) throw new Error(`Citation context request failed (${response.status})`);

      const payload = await response.json();
      const results = Array.isArray(payload.results) ? payload.results : [];

      pending.forEach((citation, index) => {
        const rawEntry = results[index] || {};
        const normalized = normalizeCitationContextEntry(citation, rawEntry);
        state.citationContextCache.set(citationCacheKey(citation, contextPath), normalized);
      });
    } catch (error) {
      console.error(error);
      pending.forEach((citation) => {
        state.citationContextCache.set(
          citationCacheKey(citation, contextPath),
          buildFallbackCitationContextEntry(citation),
        );
      });
    }
  }

  const resultMap = new Map();
  unique.forEach((citation) => {
    const key = citationCacheKey(citation, contextPath);
    const entry = state.citationContextCache.get(key) || buildFallbackCitationContextEntry(citation);
    resultMap.set(citation, entry);
  });
  return resultMap;
};

const resolveCitationContexts = async (citations = [], contextPath = "") => {
  const expanded = citations.flatMap(expandCitationInputs).filter(Boolean);
  if (!expanded.length) return [];
  const contextMap = await fetchCitationContextMap(expanded, contextPath);
  const contexts = expanded.map((citation) => contextMap.get(citation) || buildFallbackCitationContextEntry(citation));

  const sourcePaths = [...new Set(
    contexts
      .filter((entry) =>
        entry?.status === "linked"
        && entry.source_path
      )
      .map((entry) => entry.source_path),
  )];

  if (!sourcePaths.length) return contexts;

  const sourceEntries = await Promise.all(sourcePaths.map((path) => fetchCitationSourceFile(path)));
  const sourceMap = new Map();
  sourcePaths.forEach((path, index) => {
    sourceMap.set(path, sourceEntries[index]);
  });

  return contexts.map((entry) => enrichCitationEntryWithSourceDetails(entry, sourceMap.get(entry.source_path)));
};

const mergeCitationContextsBySource = (contexts = []) => {
  if (!Array.isArray(contexts) || !contexts.length) return [];

  const statusPriority = {
    linked: 1,
    ambiguous: 2,
    unresolved: 3,
  };

  const groups = new Map();
  contexts.forEach((entry = {}) => {
    const sourcePath = entry.source_path || "";
    const sourceLabel = cleanLineageText(entry.source_label || extractCitationSourceLabel(entry.original_text));
    const fallbackLabel = sourceLabel || cleanLineageText(entry.original_text || "Source");
    const key = sourcePath
      ? `path:${sourcePath}`
      : `label:${normalizeLookupKey(fallbackLabel) || fallbackLabel}`;

    if (!groups.has(key)) {
      groups.set(key, {
        status: entry.status || "linked",
        source_label: sourceLabel || fallbackLabel,
        source_path: sourcePath || null,
        source_title: entry.source_title || null,
        raw_source: entry.raw_source || null,
        raw_source_path: entry.raw_source_path || null,
        raw_source_url: entry.raw_source_url || null,
        confidence: Number.isFinite(entry.confidence) ? Number(entry.confidence) : 0,
        dp_ids: [],
        dp_context: [],
        candidates: [],
        reasons: [],
      });
    }

    const group = groups.get(key);
    const nextStatus = entry.status || "linked";
    if ((statusPriority[nextStatus] || 1) > (statusPriority[group.status] || 1)) {
      group.status = nextStatus;
    }

    if (!group.source_path && sourcePath) group.source_path = sourcePath;
    if (!group.source_title && entry.source_title) group.source_title = entry.source_title;
    if (!group.raw_source && entry.raw_source) group.raw_source = entry.raw_source;
    if (!group.raw_source_path && entry.raw_source_path) group.raw_source_path = entry.raw_source_path;
    if (!group.raw_source_url && entry.raw_source_url) group.raw_source_url = entry.raw_source_url;
    group.confidence = Math.max(group.confidence, Number.isFinite(entry.confidence) ? Number(entry.confidence) : 0);

    (Array.isArray(entry.dp_ids) ? entry.dp_ids : []).forEach((dpId) => {
      const normalizedDp = cleanLineageText(dpId);
      if (!normalizedDp) return;
      if (!group.dp_ids.includes(normalizedDp)) group.dp_ids.push(normalizedDp);
    });

    (Array.isArray(entry.dp_context) ? entry.dp_context : []).forEach((dpContext = {}) => {
      const dpId = cleanLineageText(dpContext.dp_id);
      if (!dpId) return;
      const existing = group.dp_context.find((item) => cleanLineageText(item.dp_id) === dpId);
      if (!existing) {
        group.dp_context.push({
          dp_id: dpId,
          claim: dpContext.claim || null,
          anchor: dpContext.anchor || null,
          citation: dpContext.citation || null,
        });
        return;
      }
      if (!existing.claim && dpContext.claim) existing.claim = dpContext.claim;
      if (!existing.anchor && dpContext.anchor) existing.anchor = dpContext.anchor;
      if (!existing.citation && dpContext.citation) existing.citation = dpContext.citation;
    });

    (Array.isArray(entry.candidates) ? entry.candidates : []).forEach((candidate = {}) => {
      const candidatePath = candidate.path || "";
      const candidateTitle = candidate.title || candidate.path || "Candidate source";
      const exists = group.candidates.some((item) => item.path === candidatePath && item.title === candidateTitle);
      if (!exists) {
        group.candidates.push({
          path: candidatePath,
          title: candidateTitle,
        });
      }
    });

    const reason = cleanLineageText(entry.reason || "");
    if (reason && !group.reasons.includes(reason)) {
      group.reasons.push(reason);
    }
  });

  return [...groups.values()].map((group) => ({
    status: group.status,
    source_label: group.source_label,
    source_path: group.source_path,
    source_title: group.source_title,
    raw_source: group.raw_source,
    raw_source_path: group.raw_source_path,
    raw_source_url: group.raw_source_url,
    confidence: group.confidence,
    dp_ids: group.dp_ids,
    dp_context: group.dp_context,
    candidates: group.candidates,
    reason: group.reasons.join(" • "),
  }));
};

/**
 * @typedef {Object} EvidenceTraceBundle
 * @property {string} statementId
 * @property {string} sourceLabel
 * @property {string | null} sourcePath
 * @property {string | null} rawSource
 * @property {string | null} rawSourcePath
 * @property {string | null} rawSourceUrl
 * @property {"linked" | "ambiguous" | "unresolved"} status
 * @property {string[]} dpIds
 * @property {Array<{dp_id: string, claim: string | null, anchor: string | null, citation: string | null}>} dpDetails
 * @property {string[]} issues
 * @property {Array<{path: string, title: string}>} candidates
 * @property {string | null} sourceTitle
 * @property {number} confidence
 */

const normalizeEvidenceTraceFromCitationContexts = (contexts = [], options = {}) =>
  (Array.isArray(contexts) ? contexts : []).map((item = {}, index) => {
    const status = item.status === "ambiguous" || item.status === "unresolved" ? item.status : "linked";
    const issues = [];
    if (item.reason && !String(item.reason).toLowerCase().startsWith("using local citation fallback")) {
      issues.push(cleanLineageText(item.reason));
    }
    return {
      statementId: `${options.statementId || "statement"}:${index + 1}`,
      sourceLabel: item.source_label || extractCitationSourceLabel(item.original_text),
      sourcePath: item.source_path || null,
      rawSource: item.raw_source || null,
      rawSourcePath: item.raw_source_path || null,
      rawSourceUrl: item.raw_source_url || null,
      status,
      dpIds: Array.isArray(item.dp_ids) ? item.dp_ids : [],
      dpDetails: Array.isArray(item.dp_context) ? item.dp_context.map((dpContext = {}) => ({
        dp_id: cleanLineageText(dpContext.dp_id || "DP"),
        claim: dpContext.claim || null,
        anchor: dpContext.anchor || null,
        citation: dpContext.citation || null,
      })) : [],
      issues,
      candidates: Array.isArray(item.candidates)
        ? item.candidates
          .map((candidate = {}) => ({
            path: candidate.path || "",
            title: candidate.title || candidate.path || "Candidate source",
          }))
          .filter((candidate) => candidate.path || candidate.title)
        : [],
      sourceTitle: item.source_title || null,
      confidence: Number.isFinite(item.confidence) ? Number(item.confidence) : 0,
    };
  });

const buildEvidenceTraceActionsMarkup = (bundle) => {
  const actions = [];
  if (bundle.sourcePath) {
    actions.push(`<button class="cr-btn cr-btn--sm" data-open-path="${escapeHtml(bundle.sourcePath)}" type="button">View source</button>`);
  }
  if (bundle.rawSourcePath) {
    actions.push(`<button class="cr-btn cr-btn--sm" data-open-path="${escapeHtml(bundle.rawSourcePath)}" type="button">View original</button>`);
  } else if (bundle.rawSourceUrl) {
    actions.push(`<a class="cr-btn cr-btn--sm" href="${escapeHtml(bundle.rawSourceUrl)}" target="_blank" rel="noopener noreferrer">View original</a>`);
  }
  if (!actions.length) return "";
  return `<div class="cr-citation-actions">${actions.join("")}</div>`;
};

const renderEvidenceTraceBundles = (bundles = [], options = {}) => {
  const emptyText = options.emptyText || "No citations available.";
  if (!bundles.length) {
    return `<div class="cr-empty-text">${escapeHtml(emptyText)}</div>`;
  }

  const listClassParts = ["cr-citation-list"];
  if (options.compact) listClassParts.push("is-compact");
  const listClass = listClassParts.join(" ");
  const showConfidence = options.showConfidence === true;
  const showLinkedStatus = options.showLinkedStatus === true;

  const rows = bundles.map((bundle, index) => {
    const statusClass = `is-${bundle.status}`;
    const statusLabel = bundle.status === "linked"
      ? "Linked"
      : (bundle.status === "ambiguous" ? "Ambiguous" : "Unresolved");
    const sourceLabelMarkup = `<span class="cr-citation-source">${escapeHtml(bundle.sourceLabel || "Source")}</span>`;
    const dpChips = bundle.dpIds.length
      ? `<div class="cr-citation-dp-chips">${bundle.dpIds.map((dp) => `<span class="cr-citation-dp-chip">${escapeHtml(dp)}</span>`).join("")}</div>`
      : '<div class="cr-citation-dp-chips"><span class="cr-citation-dp-chip is-empty">No DP</span></div>';

    const confidenceLabel = showConfidence && Number.isFinite(bundle.confidence)
      ? `${Math.round(bundle.confidence * 100)}%`
      : "";
    const statusMeta = confidenceLabel
      ? `<span class="cr-citation-status-meta">${escapeHtml(confidenceLabel)}</span>`
      : "";
    const shouldRenderStatus = bundle.status !== "linked" || showLinkedStatus || Boolean(statusMeta);
    const statusMarkup = shouldRenderStatus
      ? `
        <span class="cr-citation-status">
          <span class="cr-citation-status-badge ${statusClass}">${statusLabel}</span>
          ${statusMeta}
        </span>
      `
      : "";
    const toggleMarkup = '<span class="cr-citation-summary-toggle" aria-hidden="true">▾</span>';

    let bodyParts = "";
    if (bundle.dpDetails.length) {
      bodyParts += `
        <div class="cr-citation-dp-list">
          ${bundle.dpDetails.map((dpContext) => {
            const claim = dpContext.claim || "";
            const anchor = dpContext.anchor || "";
            const citation = dpContext.citation || "";
            return `
              <article class="cr-citation-dp-item">
                <div class="cr-citation-dp-header">
                  <span class="cr-citation-dp-id">${escapeHtml(dpContext.dp_id || "DP")}</span>
                </div>
                ${claim ? `<p class="cr-citation-dp-claim">${escapeHtml(claim)}</p>` : '<p class="cr-citation-dp-claim is-missing">DP claim unavailable</p>'}
                ${anchor ? `<p class="cr-citation-dp-anchor">Anchor: "${escapeHtml(anchor)}"</p>` : ""}
                ${citation ? `<p class="cr-citation-dp-citation">${escapeHtml(citation)}</p>` : ""}
              </article>
            `;
          }).join("")}
        </div>
      `;
    } else if (bundle.status === "linked" && bundle.dpIds.length) {
      bodyParts += `
        <div class="cr-citation-dp-list">
          <article class="cr-citation-dp-item cr-citation-dp-item--note">
            <p class="cr-citation-note">DP ids were found, but this source does not expose DP snippets in the current format yet.</p>
          </article>
        </div>
      `;
    }

    if (bundle.issues.length) {
      bodyParts += `
        <div class="cr-citation-dp-list">
          ${bundle.issues.map((issue) => `
            <article class="cr-citation-dp-item cr-citation-dp-item--note">
              <p class="cr-citation-note">${escapeHtml(issue)}</p>
            </article>
          `).join("")}
        </div>
      `;
    }

    if (bundle.candidates.length) {
      bodyParts += `
        <div class="cr-citation-dp-list">
          ${bundle.candidates.map((candidate) => `
            <article class="cr-citation-dp-item cr-citation-candidate-item">
              <p class="cr-citation-dp-claim cr-citation-candidate-title">${escapeHtml(candidate.title || "Candidate source")}</p>
              ${candidate.path ? `
                <div class="cr-citation-actions cr-citation-actions--candidate">
                  <button class="cr-btn cr-btn--sm" data-open-path="${escapeHtml(candidate.path)}" type="button">View source</button>
                </div>
              ` : ""}
            </article>
          `).join("")}
        </div>
      `;
    }

    if (bundle.rawSource && !bundle.rawSourcePath && !bundle.rawSourceUrl) {
      bodyParts += `
        <div class="cr-citation-dp-list">
          <article class="cr-citation-dp-item cr-citation-dp-item--note">
            <p class="cr-citation-note">Raw source: ${escapeHtml(bundle.rawSource)}</p>
          </article>
        </div>
      `;
    }

    bodyParts += buildEvidenceTraceActionsMarkup(bundle);

    return `
      <li class="cr-citation-item ${statusClass}">
        <details class="cr-citation-details"${index === 0 && options.expandFirst ? " open" : ""}>
          <summary class="cr-citation-summary" data-citation-interactive="true">
            ${sourceLabelMarkup}
            ${toggleMarkup}
            <span class="cr-citation-summary-meta">
              ${dpChips}
              ${statusMarkup}
            </span>
          </summary>
          <div class="cr-citation-body">
            ${bodyParts || `
              <div class="cr-citation-dp-list">
                <article class="cr-citation-dp-item cr-citation-dp-item--note">
                  <p class="cr-citation-note">No additional citation details.</p>
                </article>
              </div>
            `}
          </div>
        </details>
      </li>
    `;
  }).join("");

  return `<ul class="${listClass}">${rows}</ul>`;
};

const renderCitationContextList = (items = [], options = {}) => {
  const bundles = normalizeEvidenceTraceFromCitationContexts(items, options);
  return renderEvidenceTraceBundles(bundles, options);
};

const hydrateCitationHost = async (host, citations, contextPath, options = {}) => {
  if (!host) return;
  if (!citations?.length) {
    host.innerHTML = renderCitationContextList([], options);
    return;
  }
  const requestToken = `${Date.now()}-${Math.random()}`;
  host.dataset.citationToken = requestToken;
  host.innerHTML = '<div class="cr-empty-text">Loading citation context...</div>';
  const contexts = await resolveCitationContexts(citations, contextPath);
  const renderContexts = options.groupBySource
    ? mergeCitationContextsBySource(contexts)
    : contexts;
  if (host.dataset.citationToken !== requestToken) return;
  host.innerHTML = renderCitationContextList(renderContexts, options);
};

// =============================================================================
// DATA LOADING
// =============================================================================

const fetchIndex = async () => {
  const res = await fetch("/api/index");
  const data = await res.json();
  state.index = data;
  state.files = data.files || [];
  buildFileMap(state.files);

  if (refs.fileCount) refs.fileCount.textContent = data.total_files || 0;

  renderCompressionList();
  renderTagsList();
  renderSortOptions();
  applyFilters();

  return data;
};

const reindex = async () => {
  if (refs.reindexBtn) refs.reindexBtn.textContent = "Syncing...";
  await fetch("/api/reindex", { method: "POST" });
  await fetchIndex();
  await loadHomeData();
  if (refs.reindexBtn) refs.reindexBtn.textContent = "↻ Sync";
};

const getLatestWeeklyFile = () => {
  const weeklyFiles = [...(state.files || [])]
    .filter((file) =>
      file.type === "Weekly Learnings" || (file.path || "").startsWith("03_Weekly_Learnings/")
    );

  if (!weeklyFiles.length) return null;

  const nonArchiveFiles = weeklyFiles.filter((file) => !(file.path || "").includes("/archive/"));
  const candidates = nonArchiveFiles.length ? nonArchiveFiles : weeklyFiles;

  const extractDateKey = (file) => {
    const match = (file.path || "").match(/(?:^|\/)WL_(\d{4}-\d{2}-\d{2})\.md$/i);
    if (!match) return 0;
    return Number(match[1].replace(/-/g, "")) || 0;
  };

  return candidates
    .sort((a, b) => {
      const dateDiff = extractDateKey(b) - extractDateKey(a);
      if (dateDiff !== 0) return dateDiff;
      return (b.mtime || 0) - (a.mtime || 0);
    })[0] || null;
};

const getLatestTalkingPointsFile = () => {
  const talkingPointsFiles = [...(state.files || [])]
    .filter((file) =>
      file.type === "Talking Points" || (file.path || "").startsWith("09_Deliverables/Talking_Points/")
    );

  if (!talkingPointsFiles.length) return null;

  const nonArchiveFiles = talkingPointsFiles.filter((file) => !(file.path || "").includes("/archive/"));
  const candidates = nonArchiveFiles.length ? nonArchiveFiles : talkingPointsFiles;

  const extractDateKey = (file) => {
    const match = (file.path || "").match(/(?:^|\/)TP_(\d{4}-\d{2}-\d{2})\.md$/i);
    if (!match) return 0;
    return Number(match[1].replace(/-/g, "")) || 0;
  };

  return candidates
    .sort((a, b) => {
      const dateDiff = extractDateKey(b) - extractDateKey(a);
      if (dateDiff !== 0) return dateDiff;
      return (b.mtime || 0) - (a.mtime || 0);
    })[0] || null;
};

const loadHomeData = async () => {
  const fetchFile = async (path) => {
    try {
      const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const latestWeeklyFile = getLatestWeeklyFile();
  const latestTalkingPointsFile = getLatestTalkingPointsFile();
  const [synthesisFile, ideasFile, talkingPointsFile] = await Promise.all([
    fetchFile("06_Current_Understanding/Current_Synthesis.md"),
    fetchFile("06_Current_Understanding/Active_Ideas.md"),
    latestTalkingPointsFile ? fetchFile(latestTalkingPointsFile.path) : Promise.resolve(null),
  ]);
  const weeklyFile = latestWeeklyFile ? await fetchFile(latestWeeklyFile.path) : null;

  const synthesis = parseCurrentSynthesis(synthesisFile?.content || "");
  const ideasDocument = parseActiveIdeasDocument(ideasFile?.content || "");
  const ideas = ideasDocument.ideas || [];
  const talkingPointsDocument = parseTalkingPointsDocument(talkingPointsFile?.content || "");
  const baseTalkingPoints = talkingPointsDocument.points || [];
  const conversationStarterGroups = Array.isArray(talkingPointsDocument.conversationStarterGroups)
    ? talkingPointsDocument.conversationStarterGroups
    : [];
  const conversationStarterCount = conversationStarterGroups
    .reduce((total, group) => total + ((group?.starters || []).length), 0);
  const conversationStartersCard = conversationStarterGroups.length
    ? {
      kind: "conversation-starters",
      number: null,
      title: "Conversation Starters",
      key: "conversation-starters",
      conversationStarterGroups,
      conversationStarterCount,
      pointParagraphs: [],
      whyItMattersItems: [],
      whoCaresRows: [],
      evidenceItems: [],
      evidenceCitations: [],
      yourAngleParagraphs: [],
      pivotPhrases: [],
    }
    : null;
  const talkingPoints = conversationStartersCard
    ? [conversationStartersCard, ...baseTalkingPoints]
    : baseTalkingPoints;
  const weeklyInsights = parseWeeklyInsights(weeklyFile?.content || "");

  const ideasByKey = new Map();
  ideas.forEach((idea) => ideasByKey.set(idea.key, idea));
  const talkingPointsByKey = new Map();
  talkingPoints.forEach((point) => talkingPointsByKey.set(point.key, point));
  const ideaUpdated = new Map();
  if (ideasDocument.meta?.lastUpdated) {
    ideas.forEach((idea) => {
      ideaUpdated.set(idea.key, ideasDocument.meta.lastUpdated);
    });
  }

  const talkingPointsMeta = {
    title: "",
    subtitle: "",
    date: "",
    preparedBy: "",
    nextUpdate: "",
    dataPointsSynthesized: "",
    researchPeriod: "",
    keyFrameworks: "",
    ...(talkingPointsDocument.meta || {}),
    sourcePath: latestTalkingPointsFile?.path || talkingPointsDocument.meta?.sourcePath || "",
  };

  state.home = {
    synthesis,
    synthesisPath: synthesisFile?.path || "06_Current_Understanding/Current_Synthesis.md",
    ideasMeta: ideasDocument.meta || {
      lastUpdated: "",
      totalActiveIdeas: "",
      evidenceBase: "",
    },
    weeklyInsights: {
      ...weeklyInsights,
      sourcePath: latestWeeklyFile?.path || "",
    },
    weeklyFile: latestWeeklyFile,
    ideas,
    ideasByKey,
    ideaUpdated,
    talkingPointsMeta,
    talkingPoints,
    talkingPointsByKey,
    activity: [],
  };
  state.pulse.activeTrendIndex = null;

  renderPulsePosition(synthesis);
  renderPulseTakeaways(synthesis.takeaways);
  renderPulseTrends(weeklyInsights.trends);
  renderPulseWeeklyOpenThreads(weeklyInsights.openThreads);
  renderPulseReflection(weeklyInsights.reflectionParagraphs);
  if (state.view === "ideas") renderIdeasView();
  if (state.view === "talking-points") renderTalkingPointsView();
};

// =============================================================================
// EVENT HANDLERS
// =============================================================================

const setupEventListeners = () => {
  window.addEventListener("popstate", () => {
    setView(getViewFromUrl(), { syncUrl: false });
    applyCompressionFilterFromUrl({ normalizeUrl: true, replaceHistory: true });
    renderCompressionList();
    applyFilters();
  });

  // Navigation
  refs.mainNav?.addEventListener("click", (e) => {
    const link = e.target.closest(".cr-shell-nav-link");
    if (!link) return;
    e.preventDefault();
    const view = link.dataset.view;
    if (view) setView(view);
  });

  // Reindex
  refs.reindexBtn?.addEventListener("click", reindex);

  // Compression chain filter
  refs.compressionList?.addEventListener("click", (e) => {
    const item = e.target.closest(".cr-filter-item");
    if (!item) return;
    const type = item.dataset.type;
    setCompressionTypeFilter(type);
    syncCompressionUrlFromState(false);
    renderCompressionList();
    applyFilters();
  });

  // Tags filter
  refs.tagsList?.addEventListener("click", (e) => {
    const tag = e.target.closest(".cr-filter-tag");
    if (!tag) return;
    const tagName = tag.dataset.tag;
    if (state.activeFilters.tags.has(tagName)) {
      state.activeFilters.tags.delete(tagName);
    } else {
      state.activeFilters.tags.add(tagName);
    }
    renderTagsList();
    applyFilters();
  });

  // Sort
  refs.sortList?.addEventListener("click", (e) => {
    const item = e.target.closest(".cr-filter-item");
    if (!item) return;
    state.sortOrder = item.dataset.sort || "newest";
    renderSortOptions();
    applyFilters();
  });

  // Search
  refs.searchInput?.addEventListener("input", applyFilters);
  refs.clearFiltersBtn?.addEventListener("click", () => {
    state.activeFilters.types.clear();
    state.activeFilters.tags.clear();
    state.sortOrder = "newest";
    if (refs.searchInput) refs.searchInput.value = "";
    syncCompressionUrlFromState(false);
    renderCompressionList();
    renderTagsList();
    renderSortOptions();
    applyFilters();
  });

  refs.docTagsToggleBtn?.addEventListener("click", () => {
    setDocTagsExpanded(!state.explore.tagsExpanded);
  });

  refs.openTraceBtn?.addEventListener("click", () => {
    openExploreTracePanel();
  });

  // Toggle raw/rendered
  refs.toggleRawBtn?.addEventListener("click", () => {
    state.viewMode = state.viewMode === "rendered" ? "raw" : "rendered";
    refs.toggleRawBtn.textContent = state.viewMode === "rendered" ? "View Markdown" : "View Preview";
    if (state.selectedData) renderDocContent(state.selectedData);
  });

  // Markdown / file actions
  refs.copyMarkdownBtn?.addEventListener("click", async () => {
    const raw = state.selectedData?.content;
    if (!raw) return;
    try {
      await navigator.clipboard.writeText(raw);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = raw;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  });

  refs.copyFilenameBtn?.addEventListener("click", async () => {
    const path = state.selectedData?.path || state.selected?.path;
    if (!path) return;
    const fileUrl = `/files?path=${encodeURIComponent(path)}`;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  });

  // Lineage drawer
  refs.closeLineageDrawer?.addEventListener("click", closeLineage);
  refs.lineageBackdrop?.addEventListener("click", closeLineage);
  refs.lineageDrawerBody?.addEventListener("click", (e) => {
    const claimBtn = e.target.closest("[data-trace-claim-index]");
    if (claimBtn) {
      e.preventDefault();
      const idx = claimBtn.dataset.traceClaimIndex;
      if (idx != null) openExploreClaimLineage(idx);
      return;
    }

    const btn = e.target.closest("[data-open-path]");
    if (!btn) return;
    const path = btn.dataset.openPath;
    const file = state.fileMap.get(path);
    if (file) {
      selectFile(file);
      closeLineage();
    }
  });

  window.addEventListener("resize", () => {
    if (!state.selectedData) return;
    renderDocTags(state.selectedData.tags || []);
  });

  // Idea drawer
  refs.closeIdeaDrawer?.addEventListener("click", closeIdeaDrawer);
  refs.ideaBackdrop?.addEventListener("click", closeIdeaDrawer);
  refs.ideaDrawerBody?.addEventListener("click", (e) => {
    const sourceBtn = e.target.closest("[data-open-path]");
    if (sourceBtn) {
      e.preventDefault();
      const path = sourceBtn.dataset.openPath;
      const file = state.fileMap.get(path);
      if (file) {
        setView("explore");
        selectFile(file);
        closeIdeaDrawer();
      }
      return;
    }

    const link = e.target.closest("[data-evidence-path]");
    if (!link) return;
    e.preventDefault();
    const path = link.dataset.evidencePath;
    const file = state.fileMap.get(path);
    if (file) {
      setView("explore");
      selectFile(file);
      closeIdeaDrawer();
    }
  });

  refs.synthesisMeta?.addEventListener("click", (e) => {
    const openBtn = e.target.closest('[data-action="open-position-sources"]');
    if (!openBtn) return;
    openPositionDrawer();
  });

  refs.closePositionDrawer?.addEventListener("click", closePositionDrawer);
  refs.positionBackdrop?.addEventListener("click", closePositionDrawer);
  refs.positionDrawerBody?.addEventListener("click", (e) => {
    const sourceBtn = e.target.closest("[data-open-path]");
    if (sourceBtn) {
      e.preventDefault();
      const path = sourceBtn.dataset.openPath;
      const file = state.fileMap.get(path);
      if (file) {
        setView("explore");
        selectFile(file);
        closePositionDrawer();
      }
      return;
    }

    const link = e.target.closest("[data-evidence-path]");
    if (!link) return;
    e.preventDefault();
    const path = link.dataset.evidencePath;
    const file = state.fileMap.get(path);
    if (file) {
      setView("explore");
      selectFile(file);
      closePositionDrawer();
    }
  });

  // Takeaway interactions
  refs.synthesisTakeaways?.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-takeaway-index]");
    if (!openBtn) return;
    const idx = Number(openBtn.dataset.takeawayIndex);
    if (Number.isNaN(idx)) return;
    openTakeawayDrawer(idx);
  });

  refs.closeTakeawayDrawer?.addEventListener("click", closeTakeawayDrawer);
  refs.takeawayBackdrop?.addEventListener("click", closeTakeawayDrawer);
  refs.takeawayDrawerBody?.addEventListener("click", (e) => {
    const sourceBtn = e.target.closest("[data-open-path]");
    if (sourceBtn) {
      e.preventDefault();
      const path = sourceBtn.dataset.openPath;
      const file = state.fileMap.get(path);
      if (file) {
        setView("explore");
        selectFile(file);
        closeTakeawayDrawer();
      }
      return;
    }

    const link = e.target.closest("[data-evidence-path]");
    if (!link) return;
    e.preventDefault();
    const path = link.dataset.evidencePath;
    const file = state.fileMap.get(path);
    if (file) {
      setView("explore");
      selectFile(file);
      closeTakeawayDrawer();
    }
  });

  // Trend interactions
  refs.pulseTrendsList?.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-trend-index]");
    if (!openBtn) return;
    const trendIndex = Number(openBtn.dataset.trendIndex);
    if (Number.isNaN(trendIndex)) return;
    openTrendDrawer(trendIndex);
  });

  refs.closeTrendDrawer?.addEventListener("click", closeTrendDrawer);
  refs.trendBackdrop?.addEventListener("click", closeTrendDrawer);
  refs.trendDrawerBody?.addEventListener("click", (e) => {
    const sourceBtn = e.target.closest("[data-open-path]");
    if (!sourceBtn) return;
    e.preventDefault();
    const path = sourceBtn.dataset.openPath;
    const file = state.fileMap.get(path);
    if (file) {
      setView("explore");
      selectFile(file);
      closeTrendDrawer();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (refs.positionDrawer?.classList.contains("is-open")) {
      e.preventDefault();
      closePositionDrawer();
      return;
    }
    if (refs.trendDrawer?.classList.contains("is-open")) {
      e.preventDefault();
      closeTrendDrawer();
      return;
    }
    if (refs.takeawayDrawer?.classList.contains("is-open")) {
      e.preventDefault();
      closeTakeawayDrawer();
      return;
    }
    if (refs.ideaDrawer?.classList.contains("is-open")) {
      e.preventDefault();
      closeIdeaDrawer();
      return;
    }
    if (refs.lineageDrawer?.classList.contains("is-open")) {
      e.preventDefault();
      closeLineage();
    }
  });

  // Ideas list interactions
  refs.ideasList?.addEventListener("click", (e) => {
    const item = e.target.closest(".cr-idea-list-item");
    if (!item) return;
    const key = item.dataset.ideaKey;
    if (!key) return;
    setSelectedIdea(key);
  });

  refs.ideaDetailContent?.addEventListener("click", (e) => {
    const actionBtn = e.target.closest("[data-action]");
    if (actionBtn?.dataset.action === "jump-related-idea") {
      const relatedKey = actionBtn.dataset.ideaKey || "";
      setSelectedIdea(relatedKey, { scrollIntoView: true });
      return;
    }

    const sourceBtn = e.target.closest("[data-open-path]");
    if (sourceBtn) {
      e.preventDefault();
      const path = sourceBtn.dataset.openPath;
      const file = state.fileMap.get(path);
      if (file) {
        setView("explore");
        selectFile(file);
      }
      return;
    }

    const evidenceLink = e.target.closest("[data-evidence-path]");
    if (evidenceLink) {
      e.preventDefault();
      const path = evidenceLink.dataset.evidencePath;
      const file = state.fileMap.get(path);
      if (file) {
        setView("explore");
        selectFile(file);
      }
      return;
    }

  });

  refs.talkingPointsList?.addEventListener("click", (e) => {
    const item = e.target.closest(".cr-talking-point-list-item");
    if (!item) return;
    const key = item.dataset.talkingPointKey;
    if (!key) return;
    setSelectedTalkingPoint(key);
  });

  refs.talkingPointDetailContent?.addEventListener("click", (e) => {
    const sourceBtn = e.target.closest("[data-open-path]");
    if (sourceBtn) {
      e.preventDefault();
      const path = sourceBtn.dataset.openPath;
      const file = state.fileMap.get(path);
      if (file) {
        setView("explore");
        selectFile(file);
      }
      return;
    }

    const evidenceLink = e.target.closest("[data-evidence-path]");
    if (!evidenceLink) return;
    e.preventDefault();
    const path = evidenceLink.dataset.evidencePath;
    const file = state.fileMap.get(path);
    if (file) {
      setView("explore");
      selectFile(file);
    }
  });

  // Document content link clicks
  refs.docContent?.addEventListener("click", (e) => {
    const citation = e.target.closest(".cr-claim-citation");
    if (citation) {
      e.preventDefault();
      openCitationLineage(citation);
      return;
    }

    const link = e.target.closest("a");
    if (!link) return;

    const href = link.dataset.originalHref || link.getAttribute("href") || "";
    const resolved = link.dataset.resolvedPath || resolveLocalFile(state.selectedData?.path, href);

    if (resolved) {
      const ext = resolved.split(".").pop()?.toLowerCase();
      if (RAW_EXTENSIONS.has(ext)) {
        e.preventDefault();
        const file = state.fileMap.get(resolved);
        if (file) selectFile(file);
      }
    }
  });

  refs.docContent?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    const citation = e.target.closest(".cr-claim-citation");
    if (!citation) return;
    e.preventDefault();
    openCitationLineage(citation);
  });

};

// =============================================================================
// INIT
// =============================================================================

const init = async () => {
  setView(getViewFromUrl(), { replaceHistory: true });
  applyCompressionFilterFromUrl({ normalizeUrl: true, replaceHistory: true });
  syncDrawerState();
  setupEventListeners();
  await fetchIndex();
  await loadHomeData();
};

init();
