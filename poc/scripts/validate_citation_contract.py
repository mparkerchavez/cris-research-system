#!/usr/bin/env python3
"""Validate synthesis citation contract compliance.

Blocking preflight for citation integrity:
- every cited source has a matching metadata block
- metadata path exists and is indexed extraction
- metadata source_id matches canonical source_id from extraction path
- dp ids referenced in metadata exist in extraction DP set
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

SCRIPT_PATH = Path(__file__).resolve()
POC_ROOT = SCRIPT_PATH.parents[1]
REPO_ROOT = POC_ROOT.parents[0]

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from poc import server  # noqa: E402

BRACKET_CITATION_RE = re.compile(
    r"\[([^\]]*(?:DP\s*\d+|WL_\d{4}-\d{2}-\d{2}|[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)+)[^\]]*)\]",
    re.IGNORECASE,
)
METADATA_LINE_RE = re.compile(r"^\s*<!--\s*cite:[^>]+-->\s*$", re.IGNORECASE)


def canonical_source_id_from_path(path: str) -> str:
    stem = Path(path).stem
    return re.sub(r"_\d{4}-\d{2}-\d{2}$", "", stem)


def normalize_source_token(value: str) -> str:
    return re.sub(r"_\d{4}-\d{2}-\d{2}$", "", (value or "").strip())


def default_targets() -> list[Path]:
    return [REPO_ROOT / "06_Current_Understanding" / "Current_Synthesis.md"]


def collect_targets(all_synthesis: bool, explicit: list[str]) -> list[Path]:
    if explicit:
        return [Path(p).resolve() if Path(p).is_absolute() else (REPO_ROOT / p).resolve() for p in explicit]
    if all_synthesis:
        roots = [
            REPO_ROOT / "03_Weekly_Learnings",
            REPO_ROOT / "06_Current_Understanding",
            REPO_ROOT / "04_Monthly_Synthesis",
            REPO_ROOT / "05_Quarterly_Synthesis",
        ]
        files: list[Path] = []
        for root in roots:
            if not root.exists():
                continue
            files.extend(sorted(root.rglob("*.md")))
        return files
    return default_targets()


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate citation contract for synthesis markdown files.")
    parser.add_argument("--all-synthesis", action="store_true", help="Validate weekly/current/monthly/quarterly synthesis files")
    parser.add_argument("--file", action="append", default=[], help="Specific repo-relative markdown file to validate (repeatable)")
    args = parser.parse_args()

    targets = collect_targets(args.all_synthesis, args.file)
    if not targets:
        print("No target files found.")
        return 0

    index = server.build_index()
    files = index.get("files", [])
    files_by_path = {entry.get("path"): entry for entry in files if entry.get("path")}
    source_id_aliases = server._build_source_id_aliases(files)
    lineage = server.load_lineage()
    dps_by_extraction = lineage.get("dps_by_extraction", {})

    failures: list[str] = []

    for target in targets:
        if not target.exists():
            failures.append(f"{target}: file does not exist")
            continue
        text = target.read_text(encoding="utf-8", errors="ignore")
        lines = text.splitlines()

        for idx, line in enumerate(lines):
            bracket_matches = list(BRACKET_CITATION_RE.finditer(line))
            if not bracket_matches:
                continue

            expected_sources: list[str] = []
            for match in bracket_matches:
                bracket = f"[{match.group(1)}]"
                refs = server._extract_source_dp_refs(bracket)
                for ref in refs:
                    if ref.get("kind") == "weekly":
                        continue
                    source = str(ref.get("source") or "").strip()
                    if source:
                        expected_sources.append(normalize_source_token(source))

            if not expected_sources:
                continue

            metadata_lines: list[str] = []
            cursor = idx + 1
            while cursor < len(lines):
                candidate = lines[cursor]
                if not candidate.strip():
                    cursor += 1
                    continue
                if METADATA_LINE_RE.match(candidate):
                    metadata_lines.append(candidate.strip())
                    cursor += 1
                    continue
                break

            if len(metadata_lines) < len(expected_sources):
                failures.append(
                    f"{target}:line {idx+1}: expected {len(expected_sources)} metadata blocks, found {len(metadata_lines)}"
                )
                continue

            for source_index, expected_source in enumerate(expected_sources):
                metadata_line = metadata_lines[source_index]
                metadata = server._parse_cite_metadata(metadata_line)
                path = str(metadata.get("path") or "").strip()
                source_id = normalize_source_token(str(metadata.get("source_id") or ""))
                dp_ids = [str(x) for x in (metadata.get("dp_ids") or [])]

                if not path and not source_id:
                    failures.append(
                        f"{target}:line {idx+1}: metadata #{source_index+1} missing both path and source_id"
                    )
                    continue

                resolved_path = ""
                if path:
                    normalized_path = server._normalize_path(path)
                    resolved_path = normalized_path
                    if normalized_path not in files_by_path:
                        failures.append(
                            f"{target}:line {idx+1}: metadata path not indexed: {path}"
                        )
                        continue
                    if not normalized_path.startswith("02_Extractions/"):
                        failures.append(
                            f"{target}:line {idx+1}: metadata path must be extraction path: {path}"
                        )
                        continue

                    canonical_id = canonical_source_id_from_path(normalized_path)
                    if source_id and source_id != canonical_id:
                        failures.append(
                            f"{target}:line {idx+1}: source_id mismatch (got {source_id}, expected {canonical_id})"
                        )

                    if expected_source and expected_source != canonical_id:
                        failures.append(
                            f"{target}:line {idx+1}: bracket source '{expected_source}' does not match canonical source_id '{canonical_id}'"
                        )

                if source_id and not resolved_path:
                    candidates = source_id_aliases.get(server._normalize_key(source_id), [])
                    if len(candidates) != 1:
                        failures.append(
                            f"{target}:line {idx+1}: source_id '{source_id}' resolved to {len(candidates)} candidates"
                        )
                    else:
                        resolved_path = candidates[0]
                        if expected_source and expected_source != source_id:
                            failures.append(
                                f"{target}:line {idx+1}: bracket source '{expected_source}' does not match source_id '{source_id}'"
                            )

                if dp_ids and resolved_path:
                    known_dp_ids = {
                        str(dp.get("dp_id"))
                        for dp in dps_by_extraction.get(resolved_path, [])
                        if dp.get("dp_id") is not None
                    }
                    missing = [f"DP{dp}" for dp in dp_ids if dp not in known_dp_ids]
                    if missing:
                        failures.append(
                            f"{target}:line {idx+1}: unresolved DP ids for {resolved_path}: {', '.join(missing)}"
                        )

    if failures:
        print("Citation contract validation failed")
        print("=================================")
        for failure in failures:
            print(f"FAIL: {failure}")
        print("---------------------------------")
        print(f"Total failures: {len(failures)}")
        return 1

    print("Citation contract validation passed.")
    print(f"Files validated: {len(targets)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
