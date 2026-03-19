#!/usr/bin/env python3
"""Generate canonical CRIS citation snippets from indexed extraction sources.

Outputs a bracket citation line plus metadata comment lines that include:
- exact extraction path
- canonical source_id
- dp list
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

DATE_SUFFIX_RE = re.compile(r"_\d{4}-\d{2}-\d{2}$")
DATE_CAPTURE_RE = re.compile(r"_(\d{4}-\d{2}-\d{2})$")


def canonical_source_id(path: str) -> str:
    return DATE_SUFFIX_RE.sub("", Path(path).stem)


def parse_ref(value: str) -> tuple[str, list[str]]:
    if ":" in value:
        source_id, dp_raw = value.split(":", 1)
    else:
        source_id, dp_raw = value, ""
    source_id = source_id.strip()
    dp_ids: list[str] = []
    for token in re.split(r"[\s,]+", dp_raw):
        cleaned = token.strip()
        if not cleaned:
            continue
        cleaned = re.sub(r"^DP", "", cleaned, flags=re.IGNORECASE)
        if cleaned.isdigit():
            dp_ids.append(cleaned)
    return source_id, dp_ids


def pick_preferred_path(paths: list[str]) -> str:
    def date_key(path: str) -> int:
        stem = Path(path).stem
        match = DATE_CAPTURE_RE.search(stem)
        if not match:
            return 0
        return int(match.group(1).replace("-", ""))

    return sorted(paths, key=lambda p: (date_key(p), p), reverse=True)[0]


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate canonical citation snippet")
    parser.add_argument(
        "--ref",
        action="append",
        required=True,
        help="Reference in form source_id:dp1,dp2 (repeatable)",
    )
    args = parser.parse_args()

    index = server.build_index()
    files = index.get("files", [])
    source_id_aliases = server._build_source_id_aliases(files)

    refs = [parse_ref(raw) for raw in args.ref]

    bracket_parts: list[str] = []
    metadata_lines: list[str] = []
    errors: list[str] = []

    for source_id, dp_ids in refs:
        if not source_id:
            errors.append("empty source_id in --ref")
            continue
        candidates = source_id_aliases.get(server._normalize_key(source_id), [])
        if not candidates:
            errors.append(f"source_id not found in index: {source_id}")
            continue
        if len(candidates) > 1:
            path = pick_preferred_path(candidates)
        else:
            path = candidates[0]

        canonical_id = canonical_source_id(path)
        if dp_ids:
            dp_label = ", ".join([f"DP{dp}" for dp in dp_ids])
            bracket_parts.append(f"{canonical_id} {dp_label}")
            metadata_lines.append(f"<!-- cite:path={path};source_id={canonical_id};dp={','.join(dp_ids)} -->")
        else:
            bracket_parts.append(canonical_id)
            metadata_lines.append(f"<!-- cite:path={path};source_id={canonical_id} -->")

    if errors:
        print("Citation snippet generation failed")
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    print(f"[{'; '.join(bracket_parts)}]")
    for line in metadata_lines:
        print(line)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
