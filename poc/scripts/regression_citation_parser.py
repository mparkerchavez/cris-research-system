#!/usr/bin/env python3
"""Regression checks for citation parsing and lineage resolution.

Purpose:
- Catch naming-contract and citation-parser regressions early.
- Validate resolver behavior for extraction and weekly references.
"""

from __future__ import annotations

import json
import re
import sys
import tempfile
from pathlib import Path

SCRIPT_PATH = Path(__file__).resolve()
POC_ROOT = SCRIPT_PATH.parents[1]
REPO_ROOT = POC_ROOT.parents[0]

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from poc import server  # noqa: E402


FAILURES: list[str] = []


def check(condition: bool, label: str, detail: str | None = None) -> None:
    if condition:
        print(f"PASS: {label}")
        return
    message = f"FAIL: {label}"
    if detail:
        message = f"{message} ({detail})"
    print(message)
    FAILURES.append(message)


def mapping_expected_count() -> int | None:
    mapping_path = REPO_ROOT / "_System/Extraction_Name_Mapping.md"
    if not mapping_path.exists():
        return None
    text = mapping_path.read_text(encoding="utf-8")
    rows = re.findall(r"^\|\s*\d+\s*\|", text, flags=re.MULTILINE)
    return len(rows) or None


def mapping_expected_paths() -> list[str]:
    mapping_path = REPO_ROOT / "_System/Extraction_Name_Mapping.md"
    if not mapping_path.exists():
        return []
    text = mapping_path.read_text(encoding="utf-8")
    rows = re.findall(
        r"^\|\s*\d+\s*\|\s*[^|]+?\|\s*([^|]+?)\s*\|\s*[^|]+?\|",
        text,
        flags=re.MULTILINE,
    )
    paths: list[str] = []
    for filename in rows:
        cleaned = filename.strip()
        match = re.search(r"_(\d{4}-\d{2}-\d{2})\.md$", cleaned)
        if not match:
            continue
        month_key = match.group(1)[:7]
        paths.append(f"02_Extractions/{month_key}/{cleaned}")
    return paths


def build_resolution_context() -> dict:
    index = server.build_index()
    files = index.get("files", [])
    files_by_path = {entry.get("path"): entry for entry in files if entry.get("path")}
    return {
        "index": index,
        "files": files,
        "files_by_path": files_by_path,
        "extraction_aliases": server._build_extraction_aliases(files),
        "source_id_aliases": server._build_source_id_aliases(files),
        "source_aliases": server._load_citation_source_aliases(files_by_path),
        "extraction_candidates": server._build_extraction_candidates(files),
        "weekly_aliases": server._build_weekly_aliases(files),
        "lineage": server.load_lineage(),
    }


def resolve_citation(citation: str, ctx: dict) -> dict:
    return server._resolve_citation_context_entry(
        citation=citation,
        files_by_path=ctx["files_by_path"],
        extraction_aliases=ctx["extraction_aliases"],
        source_id_aliases=ctx["source_id_aliases"],
        source_aliases=ctx["source_aliases"],
        extraction_candidates=ctx["extraction_candidates"],
        dps_by_extraction=ctx["lineage"].get("dps_by_extraction", {}),
        weekly_aliases=ctx["weekly_aliases"],
    )


def run_cache_version_rebuild_check() -> None:
    original_cache_dir = server.CACHE_DIR
    original_index_path = server.INDEX_PATH
    original_lineage_path = server.LINEAGE_PATH
    try:
        with tempfile.TemporaryDirectory(prefix="cris-regression-cache-") as tmp_dir:
            cache_dir = Path(tmp_dir)
            server.CACHE_DIR = cache_dir
            server.INDEX_PATH = cache_dir / "index.json"
            server.LINEAGE_PATH = cache_dir / "lineage.json"

            stale_index = {"type_version": "stale", "files": [], "total_files": 0}
            server.INDEX_PATH.write_text(json.dumps(stale_index), encoding="utf-8")
            rebuilt_index = server.load_index()
            check(
                rebuilt_index.get("type_version") == server.TYPE_VERSION,
                "load_index rebuilds stale cache by type_version",
                f"type_version={rebuilt_index.get('type_version')!r}",
            )
            check(
                int(rebuilt_index.get("total_files") or 0) > 0,
                "rebuilt index contains files",
                f"total_files={rebuilt_index.get('total_files')}",
            )
            check(
                bool(rebuilt_index.get("source_fingerprint")),
                "rebuilt index includes source_fingerprint",
            )

            stale_fingerprint_index = {
                "type_version": server.TYPE_VERSION,
                "source_fingerprint": "stale-fingerprint",
                "files": [],
                "total_files": 0,
            }
            server.INDEX_PATH.write_text(json.dumps(stale_fingerprint_index), encoding="utf-8")
            refreshed_index = server.load_index()
            check(
                int(refreshed_index.get("total_files") or 0) > 0,
                "load_index rebuilds stale cache by source_fingerprint",
                f"total_files={refreshed_index.get('total_files')}",
            )

            stale_lineage = {"version": "stale", "claims_by_file": {}, "lineage_by_claim": {}}
            server.LINEAGE_PATH.write_text(json.dumps(stale_lineage), encoding="utf-8")
            rebuilt_lineage = server.load_lineage()
            check(
                rebuilt_lineage.get("version") == server.TYPE_VERSION,
                "load_lineage rebuilds stale cache by version",
                f"version={rebuilt_lineage.get('version')!r}",
            )
            check(
                bool(rebuilt_lineage.get("source_fingerprint")),
                "rebuilt lineage includes source_fingerprint",
            )

            stale_fingerprint_lineage = {
                "version": server.TYPE_VERSION,
                "source_fingerprint": "stale-fingerprint",
                "claims_by_file": {},
                "lineage_by_claim": {},
            }
            server.LINEAGE_PATH.write_text(json.dumps(stale_fingerprint_lineage), encoding="utf-8")
            refreshed_lineage = server.load_lineage()
            check(
                bool(refreshed_lineage.get("claims_by_file")),
                "load_lineage rebuilds stale cache by source_fingerprint",
                f"claims={len(refreshed_lineage.get('claims_by_file') or {})}",
            )
    finally:
        server.CACHE_DIR = original_cache_dir
        server.INDEX_PATH = original_index_path
        server.LINEAGE_PATH = original_lineage_path


def main() -> int:
    print("CRIS citation parser regression checks")
    print("====================================")

    check(".mdx" in server.TEXT_EXTENSIONS, "backend text extensions include .mdx")
    check(server._is_text_file(Path("dummy.mdx")), "_is_text_file recognizes .mdx")

    ctx = build_resolution_context()
    files = ctx["files"]

    extraction_files = [
        entry
        for entry in files
        if (entry.get("path") or "").startswith("02_Extractions/")
        and not (entry.get("name") or "").startswith("_")
        and not (entry.get("name") or "").startswith("EXTRACTION_SUMMARY_")
    ]

    filename_pattern = re.compile(r"^[A-Za-z0-9_]+_[A-Za-z0-9_]+_\d{4}-\d{2}-\d{2}\.md$")
    invalid_names = [entry.get("name") for entry in extraction_files if not filename_pattern.match(entry.get("name") or "")]
    check(
        len(invalid_names) == 0,
        "extraction filenames match Source_DescriptiveSlug_YYYY-MM-DD.md",
        f"invalid={invalid_names[:3]}",
    )

    expected_count = mapping_expected_count()
    if expected_count is not None:
        check(
            expected_count > 0,
            "mapping table contains extraction rename rows",
            f"expected_count={expected_count}",
        )
        expected_paths = mapping_expected_paths()
        indexed_paths = {entry.get("path") for entry in extraction_files}
        missing_paths = [path for path in expected_paths if path not in indexed_paths]
        check(
            len(missing_paths) == 0,
            "all mapped extraction targets are present in index",
            f"missing={missing_paths[:3]}",
        )

    claim_sample = "Claim [WL_2026-02-06; Section_AIProficiencyReportJan2026 DP3, KPMG_AIPulseQ4_2025 DP12]"
    claim_refs = server._parse_claim_refs(claim_sample)
    check(len(claim_refs) == 1, "_parse_claim_refs extracts one claim from sample")
    if claim_refs:
        claim = claim_refs[0]
        sources = sorted([ref.get("source") for ref in claim.get("dp_refs", []) if ref.get("source")])
        check(
            sources == ["KPMG_AIPulseQ4_2025", "Section_AIProficiencyReportJan2026"],
            "mixed citation segment splits into two source refs",
            f"sources={sources}",
        )
        wl_refs = sorted(claim.get("wl_refs") or [])
        check(
            wl_refs == ["WL_2026-02-06"],
            "WL reference extracted separately",
            f"wl_refs={wl_refs}",
        )

    wl_only_claim_sample = "Claim [WL_2026-02-07]"
    wl_only_claim_refs = server._parse_claim_refs(wl_only_claim_sample)
    check(len(wl_only_claim_refs) == 1, "_parse_claim_refs extracts WL-only claim citations")
    if wl_only_claim_refs:
        wl_only_claim = wl_only_claim_refs[0]
        check(
            wl_only_claim.get("dp_refs") == [],
            "WL-only claim keeps empty dp_refs",
            f"dp_refs={wl_only_claim.get('dp_refs')}",
        )
        check(
            wl_only_claim.get("wl_refs") == ["WL_2026-02-07"],
            "WL-only claim keeps WL reference",
            f"wl_refs={wl_only_claim.get('wl_refs')}",
        )

    section_entry = resolve_citation("Section_AIProficiencyReportJan2026 DP3, DP6", ctx)
    check(
        section_entry.get("status") == "linked" and section_entry.get("reference_type") == "extraction",
        "new extraction citation resolves as linked extraction",
        f"entry={section_entry.get('status')}/{section_entry.get('reference_type')}",
    )
    check(
        (section_entry.get("source_path") or "").endswith("Section_AIProficiencyReportJan2026_2026-02-04.md"),
        "Section citation resolves to dated extraction path",
        f"path={section_entry.get('source_path')}",
    )
    check(
        section_entry.get("dp_ids") == ["DP3", "DP6"],
        "Section citation keeps explicit DP ids",
        f"dp_ids={section_entry.get('dp_ids')}",
    )

    weekly_entry = resolve_citation("WL_2026-02-06", ctx)
    check(
        weekly_entry.get("status") == "linked" and weekly_entry.get("reference_type") == "weekly",
        "WL citation resolves as linked weekly reference",
        f"entry={weekly_entry.get('status')}/{weekly_entry.get('reference_type')}",
    )
    check(
        (weekly_entry.get("source_path") or "").endswith("WL_2026-02-06.md"),
        "WL citation resolves to weekly file path",
        f"path={weekly_entry.get('source_path')}",
    )

    metadata_path = next(
        (
            entry.get("path")
            for entry in extraction_files
            if entry.get("path")
        ),
        None,
    )
    check(metadata_path is not None, "at least one extraction path available for metadata override test")
    if metadata_path:
        metadata_source_id = Path(metadata_path).stem
        metadata_source_id = re.sub(r"_\d{4}-\d{2}-\d{2}$", "", metadata_source_id)
        metadata_entry = resolve_citation(
            f"[Placeholder DP9] <!-- cite:path={metadata_path};dp=1 -->",
            ctx,
        )
        check(
            metadata_entry.get("source_path") == metadata_path,
            "metadata path override resolves exact file",
            f"path={metadata_entry.get('source_path')}",
        )
        check(
            metadata_entry.get("dp_ids") == ["DP1"],
            "metadata dp override parsed into DP ids",
            f"dp_ids={metadata_entry.get('dp_ids')}",
        )
        source_id_entry = resolve_citation(
            f"[{metadata_source_id} DP1] <!-- cite:source_id={metadata_source_id};dp=1 -->",
            ctx,
        )
        check(
            source_id_entry.get("status") == "linked" and source_id_entry.get("source_path") == metadata_path,
            "canonical source_id metadata resolves exact extraction path",
            f"status={source_id_entry.get('status')} path={source_id_entry.get('source_path')}",
        )

    strict_entry = resolve_citation("DefinitelyMissing_SourceKey_2099-12-31", ctx)
    check(
        strict_entry.get("status") in {"unresolved", "ambiguous"},
        "strict resolver avoids unsafe fuzzy linking for unmatched extraction source keys",
        f"status={strict_entry.get('status')} reason={strict_entry.get('reason')}",
    )

    app_js = (POC_ROOT / "public" / "app.js").read_text(encoding="utf-8")
    check(
        "/api/citation-context" in app_js,
        "frontend citation context endpoint matches backend route",
    )
    check(
        "WL_\\d{4}-\\d{2}-\\d{2}" in app_js,
        "frontend uses strict WL_YYYY-MM-DD citation pattern",
    )
    check(
        "Last Updated:" in app_js and "([^\\n]+)" in app_js,
        "frontend Last Updated parser supports natural-language dates",
    )
    check(
        "summaryParagraphsClean" in app_js
        and "summaryParagraphEntries" in app_js
        and "summaryCitations" in app_js
        and "open-position-sources" in app_js,
        "Current Position summary parser exposes clean text and paragraph-scoped citations",
    )
    check(
        "replace(/\\[[^\\]]*(?:DP\\s*\\d+|WL_\\d{4}-\\d{2}-\\d{2})[^\\]]*\\]/gi, \" \")" in app_js,
        "Current Position summary parser strips inline DP/WL citation tokens from display copy",
    )
    check(
        "#{3,6}\\s+" in app_js and "isTakeawayHeaderLine" in app_js,
        "Pulse takeaway parser supports markdown subheader format (### ...)",
    )
    check(
        "A-Za-z0-9]*(?:_[A-Za-z0-9]+)+_\\d{4}-\\d{2}-\\d{2}" in app_js
        and "buildMetadataOnlyTakeawayCitationInput" in app_js,
        "Pulse takeaway parser supports source-slug citations and metadata-only citation fallback",
    )
    check(
        "data-takeaway-index" in app_js
        and "data-trend-index" in app_js
        and "View Sources</button>" in app_js,
        "Pulse takeaway and trend source actions use View Sources label",
    )

    index_html = (POC_ROOT / "public" / "index.html").read_text(encoding="utf-8")
    check(
        "id=\"positionDrawer\"" in index_html
        and "id=\"positionBackdrop\"" in index_html
        and "id=\"positionDrawerBody\"" in index_html,
        "Current Position sources drawer is wired in frontend markup",
    )

    run_cache_version_rebuild_check()

    print("------------------------------------")
    if FAILURES:
        print(f"Regression checks failed: {len(FAILURES)}")
        return 1
    print("All regression checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
