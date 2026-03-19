#!/usr/bin/env python3
"""
CRIS Snapshot Generator
=======================
Produces a single self-contained HTML file from the CRIS Research System.
The output opens in any browser with no server, no Python, no installation.

Views included: Pulse, Ideas, Talking Points  (read-only)
Views omitted:  Explore  (requires live file system access)

Usage:
    cd poc/
    python3 generate_snapshot.py
    python3 generate_snapshot.py --output ~/Desktop/cris_snapshot.html
"""

import argparse
import base64
import json
import re
import sys
from datetime import datetime
from pathlib import Path

# ── Paths ─────────────────────────────────────────────────────────────────────
POC_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = POC_DIR / "public"
REPO_ROOT = POC_DIR.parent

# ── Import server logic (it doesn't auto-start; guarded by __main__) ──────────
sys.path.insert(0, str(POC_DIR))
from server import (  # noqa: E402
    load_index,
    load_lineage,
    _read_text,
    _detect_type,
    _parse_markdown,
    _parse_claim_refs,
    _parse_supporting_evidence,
    _parse_extraction_details,
    _hash_text,
    _build_extraction_aliases,
    _build_source_id_aliases,
    _load_citation_source_aliases,
    _build_extraction_candidates,
    _build_weekly_aliases,
    _resolve_citation_context_entry,
    CLAIM_CITATION_RE,
    REPO_ROOT as SERVER_ROOT,
)


# ── File entry builder (mirrors server /api/file response) ────────────────────

def build_file_entry(rel_path: str) -> dict | None:
    full = SERVER_ROOT / rel_path
    if not full.exists():
        print(f"  [warn] File not found: {rel_path}")
        return None

    stat = full.stat()
    entry: dict = {
        "path": rel_path,
        "type": _detect_type(full),
        "name": full.name,
        "stem": full.stem,
        "ext": full.suffix.lower(),
        "mtime": stat.st_mtime,
        "size": stat.st_size,
    }

    text = _read_text(full)
    entry.update(_parse_markdown(text, full))
    entry["content"] = text
    entry["hash"] = _hash_text(text)
    entry["claim_refs"] = _parse_claim_refs(text)
    entry["claim_count"] = len(entry["claim_refs"])
    entry["evidence_links"] = _parse_supporting_evidence(text)
    entry["evidence_links_count"] = len(entry["evidence_links"])

    if rel_path.startswith("02_Extractions/"):
        details = _parse_extraction_details(text)
        entry["raw_source"] = details["raw_source"]
        entry["dp_details"] = details["dps"]
    else:
        entry["raw_source"] = None
        entry["dp_details"] = []

    return entry


# ── Latest-file helpers (mirrors app.js logic) ────────────────────────────────

def get_latest_file(files: list[dict], type_check, date_re: str) -> dict | None:
    candidates = [f for f in files if type_check(f)]
    non_archive = [f for f in candidates if "/archive/" not in f.get("path", "")]
    pool = non_archive or candidates
    if not pool:
        return None

    def date_key(f: dict) -> int:
        m = re.search(date_re, f.get("path", ""))
        return int(m.group(1).replace("-", "")) if m else 0

    return sorted(pool, key=lambda f: (date_key(f), f.get("mtime", 0)), reverse=True)[0]


# ── Citation pre-resolution ───────────────────────────────────────────────────

def prebake_citations(key_file_entries: dict, index: dict) -> tuple[dict, set]:
    """
    Pre-resolve all citations found in the key files using server logic.

    Returns:
        citation_map  – dict mapping raw citation string -> resolved context entry
        extra_paths   – set of extraction file paths that were resolved (to pre-bake)
    """
    files = index.get("files", [])
    files_by_path = {f["path"]: f for f in files if f.get("path")}

    extraction_aliases   = _build_extraction_aliases(files)
    source_id_aliases    = _build_source_id_aliases(files)
    source_aliases       = _load_citation_source_aliases(files_by_path)
    extraction_candidates = _build_extraction_candidates(files)
    weekly_aliases       = _build_weekly_aliases(files)

    lineage = load_lineage()
    dps_by_extraction = lineage.get("dps_by_extraction", {})

    def resolve_one(citation: str) -> dict:
        return _resolve_citation_context_entry(
            citation=citation,
            files_by_path=files_by_path,
            extraction_aliases=extraction_aliases,
            source_id_aliases=source_id_aliases,
            source_aliases=source_aliases,
            extraction_candidates=extraction_candidates,
            dps_by_extraction=dps_by_extraction,
            weekly_aliases=weekly_aliases,
        )

    # Collect every raw bracket citation from every key file
    raw_citations: set[str] = set()
    for entry in key_file_entries.values():
        content = entry.get("content", "")
        in_code = False
        for line in content.splitlines():
            stripped = line.strip()
            if stripped.startswith("```"):
                in_code = not in_code
                continue
            if in_code:
                continue
            for m in CLAIM_CITATION_RE.finditer(line):
                raw_citations.add(m.group(0))

    # Also generate the "expanded" variants that app.js actually sends.
    # Mirrors app.js expandCitationInputs exactly:
    #   1. extractCitationMetadataBlocks  → collect <!-- cite:... --> bodies
    #   2. splitCitationSegments          → strip metadata, strip brackets,
    #                                       split on ";", apply SOURCE_DP_SEGMENT_RE
    #   3. reattach metadata to each segment (NO outer brackets in output)
    CITE_COMMENT_RE_EXP  = re.compile(r"<!--\s*cite:([^>]+?)\s*-->", re.IGNORECASE)
    SOURCE_DP_SEG_RE_EXP = re.compile(
        r"([A-Za-z0-9_]+)\s+(DP\s*\d+(?:\s*,\s*DP\s*\d+)*)", re.IGNORECASE
    )

    def expand_citation(raw: str) -> list[str]:
        """Exact Python port of app.js expandCitationInputs."""
        # 1. Extract metadata block bodies
        meta_blocks = [m.group(1).strip() for m in CITE_COMMENT_RE_EXP.finditer(raw)]

        # 2a. Strip all cite metadata
        stripped = CITE_COMMENT_RE_EXP.sub(" ", raw).strip()
        # 2b. Remove outer brackets
        if stripped.startswith("[") and stripped.endswith("]"):
            stripped = stripped[1:-1].strip()
        # 2c. Split on ";"
        coarse = [s.strip() for s in stripped.split(";") if s.strip()]

        # 2d. Apply SOURCE_DP_SEGMENT_RE to each coarse segment
        segments: list[str] = []
        for seg in coarse:
            matches = SOURCE_DP_SEG_RE_EXP.findall(seg)
            # (Python re is stateless; no lastIndex reset needed)
            if matches:
                segments.extend(f"{src} {dp}" for src, dp in matches)
            else:
                segments.append(seg)

        if not segments:
            return []

        # 3. Reattach metadata — NO brackets around segment
        result = []
        for i, seg in enumerate(segments):
            meta = meta_blocks[i] if i < len(meta_blocks) else None
            result.append(f"{seg} <!-- cite:{meta} -->" if meta else seg)
        return result

    all_to_resolve: set[str] = set()
    for raw in raw_citations:
        all_to_resolve.add(raw)
        for expanded in expand_citation(raw):
            all_to_resolve.add(expanded)

    # Resolve everything and collect referenced extraction paths
    citation_map: dict[str, dict] = {}
    extra_paths: set[str] = set()

    for citation in sorted(all_to_resolve):
        result = resolve_one(citation)
        citation_map[citation] = result
        if result.get("status") == "linked" and result.get("source_path"):
            extra_paths.add(result["source_path"])

    linked = sum(1 for r in citation_map.values() if r.get("status") == "linked")
    print(f"  {len(citation_map)} citations resolved — {linked} linked, "
          f"{len(citation_map) - linked} unresolved.")
    print(f"  {len(extra_paths)} extraction file(s) referenced.")

    return citation_map, extra_paths


# ── CSS assembly: concatenate + inline fonts as base64 ───────────────────────

CSS_ORDER = [
    "styles/tokens.css",
    "styles/foundation.css",
    "styles/layout.css",
    "styles/shell.css",
    "styles/components.css",
    "styles/views.css",
    "styles/responsive.css",
]

# Snapshot-mode override CSS appended after the main styles
SNAPSHOT_CSS = """
/* ── Snapshot mode overrides ────────────────────────────────────────── */
.cr-snapshot-banner {
  background: var(--color-accent-amber, #d97706);
  color: #fff;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 6px 16px;
  position: relative;
  z-index: 0;
}
.cr-snapshot-banner a {
  color: #fff;
  text-decoration: underline;
  opacity: 0.85;
}
.cr-explore-snapshot-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 12px;
  color: var(--color-neutral-400, #9ca3af);
  text-align: center;
  padding: 40px;
}
.cr-explore-snapshot-notice h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-neutral-200, #e5e7eb);
  margin: 0;
}
.cr-explore-snapshot-notice p {
  max-width: 340px;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}
"""


def _b64_file(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode("ascii")


def load_css() -> str:
    font_dir = PUBLIC_DIR / "assets/fonts/uncut"
    font_map: dict[str, str] = {}
    for woff2 in sorted(font_dir.glob("*.woff2")):
        b64 = _b64_file(woff2)
        font_map[woff2.name] = f"data:font/woff2;base64,{b64}"

    parts: list[str] = []
    for css_file in CSS_ORDER:
        raw = (PUBLIC_DIR / css_file).read_text(encoding="utf-8")

        # Strip @import lines referencing peer CSS files (already concatenated)
        raw = re.sub(r"@import\s+url\(['\"]styles/[^'\"]+['\"]\)\s*;", "", raw)
        # Strip @import for the Google Fonts CDN — we re-add it in <head>
        raw = re.sub(r"@import\s+url\(['\"]https://fonts\.googleapis[^'\"]+['\"]\)\s*;", "", raw)

        # Replace every woff2 font URL with its base64 data URI
        for fname, data_uri in font_map.items():
            # Handles both single and double-quoted url() patterns
            raw = raw.replace(f"../assets/fonts/uncut/{fname}", data_uri)

        parts.append(raw)

    parts.append(SNAPSHOT_CSS)
    return "\n".join(parts)


# ── HTML template ─────────────────────────────────────────────────────────────

def build_html(
    index: dict,
    prebaked_files: dict,
    citation_map: dict,
    snapshot_date: str,
    css: str,
    avatar_data_uri: str,
    app_js: str,
) -> str:

    # Embed data that the fetch mock returns
    snapshot_data_json = json.dumps(
        {
            "index": index,
            "files": prebaked_files,
            "citationMap": citation_map,
            "snapshotDate": snapshot_date,
        },
        ensure_ascii=False,
    )

    # Pre-loader + fetch mock injected before app.js
    # The mock intercepts all /api/ calls and returns pre-baked data.
    pre_app_js = r"""
// ── CRIS Snapshot Mode ──────────────────────────────────────────────────────
// Intercepts fetch() calls so the UI runs without a live server.
// Injected by generate_snapshot.py — do not edit by hand.

const __CRIS_SNAPSHOT__ = """ + snapshot_data_json + r""";

(function () {
  const _realFetch = window.fetch.bind(window);

  window.fetch = async function (resource, init) {
    const url = typeof resource === "string" ? resource : resource.toString();
    const method = (init && init.method ? init.method : "GET").toUpperCase();

    // ── GET /api/index ─────────────────────────────────────────────────────
    if (url === "/api/index" || url.startsWith("/api/index?")) {
      return _jsonResponse(__CRIS_SNAPSHOT__.index);
    }

    // ── GET /api/file?path=... ─────────────────────────────────────────────
    if (url.startsWith("/api/file?")) {
      const qs = url.split("?")[1] || "";
      const path = decodeURIComponent((qs.match(/path=([^&]*)/) || [])[1] || "");
      const entry = __CRIS_SNAPSHOT__.files[path];
      if (entry) return _jsonResponse(entry);
      return _jsonResponse({ error: "File not available in this snapshot" }, 404);
    }

    // ── POST /api/citation-context ─────────────────────────────────────────
    // Look up each requested citation in the pre-resolved map.
    // Unrecognised citations fall back to an unresolved stub.
    if (url === "/api/citation-context" && method === "POST") {
      const CITATION_MAP = __CRIS_SNAPSHOT__.citationMap || {};
      let citations = [];
      try {
        const body = JSON.parse(init.body || "{}");
        citations = body.citations || [];
      } catch (_) {}

      // Strip <!-- cite:... --> metadata annotations from a lookup key.
      // App.js attaches out-of-band metadata (from adjacent comment lines) to citation
      // strings before sending them to the API, but our pre-baked map uses bare keys.
      const stripCiteMeta = (s) =>
        s.replace(/\s*<!--\s*cite:[^>]*-->/gi, "").replace(/\s+/g, " ").trim();

      const results = citations.map((c) => {
        // 1. Exact key match
        let resolved = CITATION_MAP[c];
        if (resolved) return resolved;
        // 2. Strip metadata and try bare key
        const bare = stripCiteMeta(c);
        if (bare !== c) {
          resolved = CITATION_MAP[bare];
          if (resolved) return resolved;
        }
        // Genuinely unresolvable
        console.warn("[CRIS snapshot] ✗ unresolvable citation:", JSON.stringify(bare || c));
        return {
          original_text: c,
          status: "unresolved",
          reference_type: "extraction",
          source_label: bare || c,
          source_path: null,
          source_title: null,
          dp_ids: [],
          dp_context: [],
          candidates: [],
          confidence: 0,
          reason: "Citation not available in this snapshot.",
        };
      });
      console.debug("[CRIS snapshot] citation-context batch:", citations.length, "requested,", results.filter(r => r.status === "linked").length, "linked");
      return _jsonResponse({ results });
    }

    // ── GET /api/lineage ───────────────────────────────────────────────────
    if (url.startsWith("/api/lineage")) {
      return _jsonResponse({ claim: null, lineage: { nodes: [], edges: [] } });
    }

    // ── GET /api/activity ──────────────────────────────────────────────────
    if (url.startsWith("/api/activity")) {
      return _jsonResponse({ generated_at: __CRIS_SNAPSHOT__.snapshotDate, total: 0, items: [] });
    }

    // ── POST /api/reindex ─────────────────────────────────────────────────
    if (url === "/api/reindex" && method === "POST") {
      const total = (__CRIS_SNAPSHOT__.index.files || []).length;
      return _jsonResponse({ status: "ok", total });
    }

    // ── POST /api/open-file ───────────────────────────────────────────────
    if (url === "/api/open-file" && method === "POST") {
      // Silently succeed — can't open files in snapshot mode
      return _jsonResponse({ status: "ok" });
    }

    // Fall through to real fetch (for CDN libs, Google Fonts, etc.)
    return _realFetch(resource, init);
  };

  function _jsonResponse(payload, status = 200) {
    const body = JSON.stringify(payload);
    return Promise.resolve(
      new Response(body, {
        status,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      })
    );
  }
})();
"""

    # Post-app JS: snapshot UI patches applied after the DOM is ready.
    # We use a MutationObserver on #app to inject the banner and patch Explore
    # as soon as the app shell renders.
    post_app_js = f"""
// ── Snapshot UI patches ──────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {{
  // 1. Inject snapshot banner at the very top of #app
  const app = document.getElementById("app");
  if (app) {{
    const banner = document.createElement("div");
    banner.className = "cr-snapshot-banner";
    banner.innerHTML = `📸 Snapshot — {snapshot_date} &nbsp;|&nbsp; Read-only. Explore and citation traces are not available.`;
    app.insertBefore(banner, app.firstChild);
  }}

  // 2. Disable the Sync button (it would no-op anyway, but this is clearer)
  const syncBtn = document.getElementById("reindexBtn");
  if (syncBtn) {{
    syncBtn.disabled = true;
    syncBtn.title = "Sync is not available in snapshot mode";
    syncBtn.style.opacity = "0.4";
    syncBtn.style.cursor = "default";
  }}

  // 3. Replace Explore view content with a polite notice
  //    We do this after a short delay so app.js has had time to render.
  const patchExplore = () => {{
    const exploreView = document.getElementById("exploreView");
    if (!exploreView) return;

    const notice = document.createElement("div");
    notice.className = "cr-explore-snapshot-notice";
    notice.innerHTML = `
      <h2>Explore is not available in this snapshot</h2>
      <p>The full file browser requires a live CRIS server. This snapshot includes
         Pulse, Ideas, and Talking Points — the final synthesized output.</p>
    `;

    // Clear existing children and replace
    while (exploreView.firstChild) exploreView.removeChild(exploreView.firstChild);
    exploreView.appendChild(notice);
  }};

  // Patch immediately and again after a brief delay (in case app.js re-renders)
  patchExplore();
  setTimeout(patchExplore, 800);
  setTimeout(patchExplore, 2000);

  // 4. Also intercept Explore nav link clicks to show the notice again
  const navLinks = document.querySelectorAll(".cr-shell-nav-link");
  navLinks.forEach((link) => {{
    if (link.dataset.view === "explore") {{
      link.addEventListener("click", () => setTimeout(patchExplore, 100));
    }}
  }});
}});
"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CRIS — Research Observatory (Snapshot {snapshot_date})</title>
  <!-- Google Fonts: Instrument Serif + JetBrains Mono (needs internet; falls back gracefully) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="icon" href="{avatar_data_uri}" type="image/png">
  <style>
{css}
  </style>
</head>
<body>
  <div class="cr-app" id="app">
    <!-- Header -->
    <header class="cr-shell-topbar">
      <div class="cr-shell-brand">
        <img src="{avatar_data_uri}" alt="CRIS" class="cr-shell-brand-logo">
        <span class="cr-shell-brand-wordmark">CRIS</span>
      </div>

      <nav class="cr-shell-nav" id="mainNav">
        <a href="/?view=pulse" class="cr-shell-nav-link is-active" data-view="pulse" aria-current="page">Pulse</a>
        <a href="/?view=ideas" class="cr-shell-nav-link" data-view="ideas">Ideas</a>
        <a href="/?view=talking-points" class="cr-shell-nav-link" data-view="talking-points">Talking Points</a>
        <a href="/?view=explore" class="cr-shell-nav-link" data-view="explore">Explore</a>
      </nav>

      <div class="cr-shell-actions">
        <div class="cr-shell-status" id="statusIndicator">
          <span class="cr-shell-status-dot"></span>
          <span id="fileCount">0</span> files
        </div>
        <button class="cr-btn cr-btn--ghost" id="reindexBtn" title="Sync index">↻ Sync</button>
      </div>
    </header>

    <!-- Main Layout -->
    <main class="cr-main-layout" id="mainLayout">

      <!-- Dark Control Panel (Left Sidebar) -->
      <aside class="cr-filter-panel" id="controlPanel">
        <div class="cr-filter-section">
          <div class="cr-filter-section-title">Compression Chain</div>
          <div class="cr-filter-list" id="compressionList"></div>
        </div>

        <div class="cr-filter-section">
          <div class="cr-filter-section-title">Tags</div>
          <div class="cr-filter-list cr-filter-list--tags" id="tagsList"></div>
        </div>

        <div class="cr-filter-section">
          <div class="cr-filter-section-title">Sort</div>
          <div class="cr-filter-list" id="sortList">
            <button type="button" class="cr-filter-item is-active" data-sort="newest" aria-pressed="true">
              <span class="cr-filter-item-label">
                <span class="cr-filter-item-radio"></span>
                Newest first
              </span>
            </button>
            <button type="button" class="cr-filter-item" data-sort="oldest" aria-pressed="false">
              <span class="cr-filter-item-label">
                <span class="cr-filter-item-radio"></span>
                Oldest first
              </span>
            </button>
            <button type="button" class="cr-filter-item" data-sort="name" aria-pressed="false">
              <span class="cr-filter-item-label">
                <span class="cr-filter-item-radio"></span>
                By name
              </span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Content Area -->
      <div class="cr-content-area">

        <!-- Pulse View (Home) -->
        <div class="cr-view-pulse" id="pulseView">
          <div class="cr-pulse-layout">
            <div class="cr-pulse-main">
              <section class="cr-pulse-section cr-pulse-position" id="synthesisHero">
                <div class="cr-synthesis-kicker">Current Position</div>
                <h1 class="cr-synthesis-headline" id="synthesisHeadline">Loading current synthesis...</h1>
                <p class="cr-synthesis-lede" id="synthesisLede"></p>
                <div class="cr-synthesis-summary" id="synthesisSummary"></div>
                <div class="cr-synthesis-meta cr-meta-cluster" id="synthesisMeta"></div>
              </section>

              <section class="cr-pulse-section cr-pulse-takeaways" id="pulseTakeawaysSection">
                <div class="cr-section-header">
                  <h2 class="cr-section-title">Key Takeaways</h2>
                </div>
                <div class="cr-synthesis-takeaways" id="synthesisTakeaways"></div>
              </section>

              <section class="cr-pulse-section cr-pulse-trends" id="pulseTrendsSection">
                <div class="cr-section-header">
                  <h2 class="cr-section-title">Trends</h2>
                </div>
                <div class="cr-trends-list" id="pulseTrendsList"></div>
              </section>

              <section class="cr-pulse-section cr-pulse-open-threads" id="pulseWeeklyOpenThreadsSection">
                <div class="cr-section-header">
                  <h2 class="cr-section-title">Open Threads</h2>
                </div>
                <ol class="cr-weekly-open-threads-list" id="pulseWeeklyOpenThreadsList"></ol>
              </section>

              <section class="cr-pulse-section cr-pulse-reflection" id="pulseReflectionSection">
                <div class="cr-section-header">
                  <h2 class="cr-section-title">Reflection</h2>
                </div>
                <div class="cr-reflection-body" id="pulseReflectionContent"></div>
              </section>
            </div>
          </div>
        </div>

        <!-- Explore View (disabled in snapshot) -->
        <div class="cr-view-explore" id="exploreView">
          <div class="cr-explore-browser">
            <div class="cr-explore-browser-header">
              <input type="text" class="cr-search-input" id="searchInput" placeholder="Search file names, tags, and paths...">
              <div class="cr-filter-summary" id="filterSummary">
                <div class="cr-filter-summary-left">
                  <span class="cr-filter-count" id="filterCount">0 files</span>
                  <span class="cr-filter-hint" id="filterHint">All files</span>
                </div>
                <button class="cr-btn cr-btn--sm cr-btn--ghost" id="clearFiltersBtn" type="button">Clear</button>
              </div>
              <div class="cr-filter-chips" id="filterChips"></div>
            </div>
            <div class="cr-file-list" id="fileList"></div>
          </div>

          <div class="cr-doc-preview" id="docPreview">
            <div class="cr-empty" id="emptyPreview">
              <div class="cr-empty-title">Select a document</div>
              <div class="cr-empty-text">Choose a file from the list to preview its contents</div>
            </div>
            <div class="cr-doc-header" id="docHeader" style="display: none;">
              <div class="cr-doc-header-top">
                <div class="cr-doc-header-main">
                  <div class="cr-doc-eyebrow" id="docType"></div>
                  <h1 class="cr-doc-title" id="docTitle"></h1>
                </div>
                <div class="cr-doc-actions">
                  <button class="cr-btn cr-btn--sm" id="toggleRawBtn">View Markdown</button>
                  <button class="cr-btn cr-btn--sm" id="copyMarkdownBtn">Copy Markdown</button>
                </div>
              </div>
              <div class="cr-inset-tray cr-doc-meta-tray">
                <div class="cr-inset-tray-grid">
                  <div class="cr-inset-tray-item cr-doc-meta-file">
                    <div class="cr-doc-meta-line cr-doc-meta-file-path" id="docPath"></div>
                    <button class="cr-doc-meta-copy-btn" id="copyFilenameBtn" type="button" aria-label="Open file on computer" title="Open file on computer">
                      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                        <path d="M2.5 5.5v8h8"></path>
                        <path d="M6 2.5h7.5V10"></path>
                        <path d="M13.5 2.5L6.5 9.5"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="cr-inset-tray-item">
                    <div class="cr-doc-meta-line" id="docStats"></div>
                  </div>
                </div>
                <div class="cr-doc-tags-wrap" id="docTagsWrap">
                  <div class="cr-doc-tags" id="docTags"></div>
                  <button class="cr-btn cr-btn--sm cr-btn--ghost cr-doc-tags-toggle" id="docTagsToggleBtn" type="button" aria-expanded="false" hidden>Show all tags</button>
                </div>
                <div class="cr-doc-trace-row">
                  <button class="cr-btn cr-btn--sm" id="openTraceBtn" type="button">Trace claims/citations</button>
                  <span class="cr-doc-trace-summary" id="traceSummary">No claims detected</span>
                </div>
              </div>
            </div>
            <div class="cr-doc-content" id="docContent"></div>
          </div>
        </div>

        <!-- Ideas View -->
        <div class="cr-view-ideas" id="ideasView">
          <div class="cr-ideas-layout">
            <aside class="cr-ideas-list-panel">
              <div class="cr-ideas-list-header">
                <h2 class="cr-section-title">Active Ideas</h2>
                <div class="cr-ideas-list-meta" id="ideasListMeta"></div>
              </div>
              <div class="cr-ideas-list" id="ideasList"></div>
            </aside>

            <section class="cr-ideas-detail" id="ideasDetail">
              <div class="cr-empty" id="ideasEmpty">
                <div class="cr-empty-title">Select an idea</div>
                <div class="cr-empty-text">Choose an idea from the list to view full detail.</div>
              </div>
              <div class="cr-idea-detail-content" id="ideaDetailContent" style="display: none;"></div>
            </section>
          </div>
        </div>

        <!-- Talking Points View -->
        <div class="cr-view-talking-points" id="talkingPointsView">
          <div class="cr-ideas-layout">
            <aside class="cr-ideas-list-panel">
              <div class="cr-ideas-list-header">
                <h2 class="cr-section-title">Talking Points</h2>
                <div class="cr-ideas-list-meta" id="talkingPointsListMeta"></div>
              </div>
              <div class="cr-ideas-list" id="talkingPointsList"></div>
            </aside>

            <section class="cr-ideas-detail" id="talkingPointsDetail">
              <div class="cr-empty" id="talkingPointsEmpty">
                <div class="cr-empty-title">Select a talking point</div>
                <div class="cr-empty-text">Choose a talking point from the list to view full detail.</div>
              </div>
              <div class="cr-idea-detail-content cr-talking-point-detail-content" id="talkingPointDetailContent" style="display: none;"></div>
            </section>
          </div>
        </div>

      </div>
    </main>

    <!-- Lineage Drawer -->
    <div class="cr-drawer cr-drawer--lineage" id="lineageDrawer">
      <div class="cr-drawer-backdrop" id="lineageBackdrop"></div>
      <div class="cr-drawer-panel">
        <div class="cr-drawer-header">
          <h2 class="cr-drawer-title">Lineage Trace</h2>
          <button class="cr-btn cr-btn--ghost" id="closeLineageDrawer">✕</button>
        </div>
        <div class="cr-drawer-body" id="lineageDrawerBody"></div>
      </div>
    </div>

    <!-- Idea Drawer -->
    <div class="cr-drawer cr-drawer--idea" id="ideaDrawer">
      <div class="cr-drawer-backdrop" id="ideaBackdrop"></div>
      <div class="cr-drawer-panel">
        <div class="cr-drawer-header">
          <h2 class="cr-drawer-title" id="ideaDrawerTitle">Idea</h2>
          <button class="cr-btn cr-btn--ghost" id="closeIdeaDrawer">✕</button>
        </div>
        <div class="cr-drawer-body" id="ideaDrawerBody"></div>
      </div>
    </div>

    <!-- Takeaway Drawer -->
    <div class="cr-drawer cr-drawer--takeaway" id="takeawayDrawer">
      <div class="cr-drawer-backdrop" id="takeawayBackdrop"></div>
      <div class="cr-drawer-panel">
        <div class="cr-drawer-header">
          <h2 class="cr-drawer-title" id="takeawayDrawerTitle">Takeaway</h2>
          <button class="cr-btn cr-btn--ghost" id="closeTakeawayDrawer">✕</button>
        </div>
        <div class="cr-drawer-body" id="takeawayDrawerBody"></div>
      </div>
    </div>

    <!-- Trend Drawer -->
    <div class="cr-drawer cr-drawer--trend" id="trendDrawer">
      <div class="cr-drawer-backdrop" id="trendBackdrop"></div>
      <div class="cr-drawer-panel">
        <div class="cr-drawer-header">
          <h2 class="cr-drawer-title" id="trendDrawerTitle">Trend</h2>
          <button class="cr-btn cr-btn--ghost" id="closeTrendDrawer">✕</button>
        </div>
        <div class="cr-drawer-body" id="trendDrawerBody"></div>
      </div>
    </div>

    <!-- Current Position Drawer -->
    <div class="cr-drawer cr-drawer--position" id="positionDrawer">
      <div class="cr-drawer-backdrop" id="positionBackdrop"></div>
      <div class="cr-drawer-panel">
        <div class="cr-drawer-header">
          <h2 class="cr-drawer-title" id="positionDrawerTitle">Current Position Sources</h2>
          <button class="cr-btn cr-btn--ghost" id="closePositionDrawer">✕</button>
        </div>
        <div class="cr-drawer-body" id="positionDrawerBody"></div>
      </div>
    </div>
  </div>

  <!-- CDN deps (same as live server) -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>

  <!-- Fetch mock + snapshot data (must run before app.js) -->
  <script>
{pre_app_js}
  </script>

  <!-- CRIS app (unmodified) -->
  <script>
{app_js}
  </script>

  <!-- Post-load snapshot UI patches -->
  <script>
{post_app_js}
  </script>
</body>
</html>"""


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Generate a self-contained CRIS snapshot HTML file.")
    parser.add_argument(
        "--output", "-o",
        type=str,
        default=None,
        help="Output file path (default: CRIS_Snapshot_YYYY-MM-DD.html in the repo root)",
    )
    args = parser.parse_args()

    snapshot_date = datetime.now().strftime("%Y-%m-%d")
    default_output = REPO_ROOT / f"CRIS_Snapshot_{snapshot_date}.html"
    output_path = Path(args.output) if args.output else default_output

    print("CRIS Snapshot Generator")
    print("=" * 40)

    # ── Step 1: Build/load index ───────────────────────────────────────────
    print("→ Building file index...")
    index = load_index()
    files = index.get("files", [])
    print(f"  {len(files)} files indexed.")

    # ── Step 2: Identify key files ─────────────────────────────────────────
    latest_weekly = get_latest_file(
        files,
        lambda f: f.get("type") == "Weekly Learnings" or f.get("path", "").startswith("03_Weekly_Learnings/"),
        r"(?:^|/)WL_(\d{4}-\d{2}-\d{2})\.md$",
    )
    latest_tp = get_latest_file(
        files,
        lambda f: f.get("type") == "Talking Points" or f.get("path", "").startswith("09_Deliverables/Talking_Points/"),
        r"(?:^|/)TP_(\d{4}-\d{2}-\d{2})\.md$",
    )

    key_paths = [
        "06_Current_Understanding/Current_Synthesis.md",
        "06_Current_Understanding/Active_Ideas.md",
    ]
    if latest_weekly:
        print(f"  Latest weekly: {latest_weekly['path']}")
        key_paths.append(latest_weekly["path"])
    else:
        print("  [warn] No weekly learnings file found.")

    if latest_tp:
        print(f"  Latest talking points: {latest_tp['path']}")
        key_paths.append(latest_tp["path"])
    else:
        print("  [warn] No talking points file found.")

    # ── Step 3: Pre-bake key file content ─────────────────────────────────
    print("→ Pre-baking key file content...")
    prebaked_files: dict = {}
    for rel_path in key_paths:
        print(f"  Reading: {rel_path}")
        entry = build_file_entry(rel_path)
        if entry:
            prebaked_files[rel_path] = entry

    print(f"  {len(prebaked_files)} key files pre-baked.")

    # ── Step 4: Pre-resolve citations + pre-bake extraction files ──────────
    print("→ Resolving citations...")
    citation_map, extra_extraction_paths = prebake_citations(prebaked_files, index)

    print("→ Pre-baking referenced extraction files...")
    for rel_path in sorted(extra_extraction_paths):
        if rel_path in prebaked_files:
            continue
        entry = build_file_entry(rel_path)
        if entry:
            prebaked_files[rel_path] = entry
            print(f"  + {rel_path}")

    print(f"  {len(prebaked_files)} total files pre-baked (key + extractions).")

    # ── Step 6: Assemble CSS with inlined fonts ────────────────────────────
    print("→ Assembling CSS and inlining fonts...")
    css = load_css()
    print(f"  CSS: {len(css):,} chars")

    # ── Step 7: Load avatar and app.js ────────────────────────────────────
    print("→ Loading static assets...")
    avatar_data_uri = f"data:image/png;base64,{_b64_file(PUBLIC_DIR / 'CRIS_avatar.png')}"
    app_js = (PUBLIC_DIR / "app.js").read_text(encoding="utf-8")
    print(f"  app.js: {len(app_js):,} chars")

    # ── Step 8: Build HTML ────────────────────────────────────────────────
    print("→ Assembling HTML...")
    html = build_html(
        index=index,
        prebaked_files=prebaked_files,
        citation_map=citation_map,
        snapshot_date=snapshot_date,
        css=css,
        avatar_data_uri=avatar_data_uri,
        app_js=app_js,
    )

    # ── Step 7: Write output ──────────────────────────────────────────────
    output_path.write_text(html, encoding="utf-8")
    size_kb = output_path.stat().st_size / 1024
    size_mb = size_kb / 1024

    print()
    print("✓ Snapshot generated!")
    print(f"  File: {output_path}")
    print(f"  Size: {size_mb:.1f} MB ({size_kb:,.0f} KB)")
    print()
    print("Share this file as an email attachment.")
    print("Recipients open it in any browser — no installation required.")


if __name__ == "__main__":
    main()
