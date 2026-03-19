#!/usr/bin/env python3
"""Local read-only CRIS PoC server.

- Serves a lightweight UI from ./public
- Builds and serves a local index cache in ../.cris_cache/index.json
- Reads markdown from the CRIS folder structure
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
import sys
import time
import mimetypes
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

REPO_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = Path(__file__).resolve().parent / "public"
CACHE_DIR = REPO_ROOT / ".cris_cache"
INDEX_PATH = CACHE_DIR / "index.json"
LINEAGE_PATH = CACHE_DIR / "lineage.json"
SOURCE_ALIAS_PATH = REPO_ROOT / "_System" / "Citation_Source_Aliases.json"

TYPE_VERSION = "2026-02-16-types-v9"
STRICT_CITATION_RESOLUTION = True

DISPLAY_TYPES = [
    "Raw Inputs",
    "Extractions",
    "Weekly Learnings",
    "Monthly Synthesis",
    "Quarterly Synthesis",
    "Current Understanding",
    "Archive",
    "Talking Points",
    "Deliverables",
    "System Docs",
    "Templates",
    "Other",
]

ALL_TYPES = DISPLAY_TYPES

TYPE_BY_TOP_FOLDER = {
    "_System": "System Docs",
    "01_Raw_Inputs": "Raw Inputs",
    "02_Extractions": "Extractions",
    "03_Weekly_Learnings": "Weekly Learnings",
    "04_Monthly_Synthesis": "Monthly Synthesis",
    "05_Quarterly_Synthesis": "Quarterly Synthesis",
    "06_Current_Understanding": "Current Understanding",
    "07_Archive": "Archive",
    "08_Templates": "Templates",
    "09_Deliverables": "Deliverables",
}

IGNORE_DIRS = {
    ".git",
    ".cris_cache",
    "poc",
    "__pycache__",
    "node_modules",
    ".DS_Store",
}

TEXT_EXTENSIONS = {".md", ".markdown", ".mdx", ".txt"}

TAG_RE = re.compile(r"(?<![\w-])#([a-z0-9][a-z0-9-]*)", re.IGNORECASE)
WIKI_LINK_RE = re.compile(r"\[\[([^\]]+)\]\]")
MD_LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
DP_RE = re.compile(r"^\s*(?:[-*]\s*)?(?:\*\*)?DP(\d+)(?:\*\*)?\s*:", re.IGNORECASE)
EXTRACTION_DATE_SUFFIX_RE = re.compile(r"_(\d{4}-\d{2}-\d{2})$")
CLAIM_CITATION_RE = re.compile(
    r"\[(?=[^\]]*(?:DP\s*\d+|WL_\d{4}-\d{2}-\d{2}))[^\]]+\]",
    re.IGNORECASE,
)
DP_TOKEN_RE = re.compile(r"DP\s*(\d+)", re.IGNORECASE)
WL_REF_RE = re.compile(r"^WL_\d{4}-\d{2}-\d{2}$", re.IGNORECASE)
SOURCE_DP_SEGMENT_RE = re.compile(
    r"([A-Za-z0-9_]+)\s+(DP\s*\d+(?:\s*,\s*DP\s*\d+)*)",
    re.IGNORECASE,
)
ORIGINAL_LOCATION_RE = re.compile(r"(?:Original Location|URL/Location):\s*(.+)", re.IGNORECASE)
SUPPORTING_EVIDENCE_RE = re.compile(r"(?:→|->)\s*Source:\s*(.+)$", re.IGNORECASE)

CITATION_RES = [
    re.compile(r"\(p\.?\s*\d+(?:-\d+)?\)", re.IGNORECASE),
    re.compile(r"\(para\.?\s*\d+\)", re.IGNORECASE),
    re.compile(r"\(section\s+[^)]+\)", re.IGNORECASE),
    re.compile(r"\(\d{1,2}:\d{2}(?:,[^)]+)?\)"),
]

HEADING_RE = re.compile(r"^(#{1,6})\s+(.+)$")

STOPWORDS = {
    "the",
    "a",
    "an",
    "report",
    "study",
    "paper",
    "overview",
    "analysis",
    "summary",
    "brief",
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "notes",
    "edition",
}


def _safe_relpath(path: Path) -> str:
    return path.relative_to(REPO_ROOT).as_posix()


def _detect_type(path: Path) -> str:
    rel = path.relative_to(REPO_ROOT)
    top = rel.parts[0] if rel.parts else ""
    if top == "09_Deliverables" and "Talking_Points" in rel.parts:
        return "Talking Points"
    return TYPE_BY_TOP_FOLDER.get(top, "Other")


def _is_text_file(path: Path) -> bool:
    return path.suffix.lower() in TEXT_EXTENSIONS


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def _hash_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()


def _normalize_key(value: str) -> str:
    cleaned = re.sub(r"[_\-]+", " ", value or "")
    cleaned = re.sub(r"[^\w\s]+", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip().lower()
    return cleaned


def _strip_processing_date(value: str) -> str:
    return EXTRACTION_DATE_SUFFIX_RE.sub("", value or "")


def _canonical_extraction_source_id(stem: str) -> str:
    return _strip_processing_date(stem or "")


def _normalize_path(value: str) -> str:
    cleaned = (value or "").replace("\\", "/")
    parts = [p for p in cleaned.split("/") if p and p != "."]
    stack = []
    for part in parts:
        if part == "..":
            if stack:
                stack.pop()
            continue
        stack.append(part)
    return "/".join(stack)


def _tokenize(value: str, drop_stopwords: bool = True) -> set[str]:
    normalized = _normalize_key(value)
    if not normalized:
        return set()
    tokens = []
    for token in normalized.split(" "):
        if not token:
            continue
        if drop_stopwords and token in STOPWORDS:
            continue
        if len(token) < 3 and not any(ch.isdigit() for ch in token):
            continue
        tokens.append(token)
    return set(tokens)


def _strip_inline_markdown(value: str) -> str:
    cleaned = (value or "").replace("\r\n", "\n")
    cleaned = re.sub(r"^\s*\*\*\s*", "", cleaned)
    cleaned = re.sub(r"\*\*([^*]+)\*\*", r"\1", cleaned)
    cleaned = cleaned.replace("**", "")
    cleaned = re.sub(r"__([^_]+)__", r"\1", cleaned)
    cleaned = re.sub(r"`([^`]+)`", r"\1", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip()


def _parse_supporting_evidence(text: str) -> list[str]:
    links = []
    for line in text.splitlines():
        match = SUPPORTING_EVIDENCE_RE.search(line)
        if not match:
            continue
        tail = match.group(1)
        wiki_match = WIKI_LINK_RE.search(tail)
        if wiki_match:
            links.append(wiki_match.group(1).strip())
            continue
        md_match = MD_LINK_RE.search(tail)
        if md_match:
            links.append(md_match.group(1).strip())
            continue
        if "02_Extractions/" in tail:
            links.append(tail.strip())
    return links


def _split_citation_segments(value: str | None) -> list[str]:
    cleaned = _strip_citation_markup(value)
    if not cleaned:
        return []
    return [segment.strip() for segment in cleaned.split(";") if segment.strip()]


def _extract_source_dp_refs(value: str | None) -> list[dict]:
    refs: list[dict] = []
    for segment in _split_citation_segments(value):
        if WL_REF_RE.fullmatch(segment):
            refs.append({
                "source": segment,
                "dp_ids": [],
                "raw": segment,
                "kind": "weekly",
            })
            continue

        matches = list(SOURCE_DP_SEGMENT_RE.finditer(segment))
        if matches:
            for match in matches:
                source = match.group(1).strip()
                dp_ids = _parse_dp_ids(match.group(2))
                refs.append({
                    "source": source or None,
                    "dp_ids": dp_ids,
                    "raw": match.group(0).strip(),
                    "kind": "extraction",
                })
            continue

        dp_ids = _parse_dp_ids(segment)
        source = DP_TOKEN_RE.sub("", segment).replace(",", " ")
        source = re.sub(r"\s+", " ", source).strip(" -:;") or None
        if not source and not dp_ids:
            continue
        ref_kind = "weekly" if source and WL_REF_RE.fullmatch(source) else "extraction"
        refs.append({
            "source": source,
            "dp_ids": dp_ids,
            "raw": segment,
            "kind": ref_kind,
        })
    return refs


def _parse_claim_refs(text: str) -> list[dict]:
    claims = []
    in_code = False
    for line in text.splitlines():
        if line.strip().startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        if "DP" not in line.upper() and not re.search(r"WL_\d{4}-\d{2}-\d{2}", line, flags=re.IGNORECASE):
            continue
        matches = list(CLAIM_CITATION_RE.finditer(line))
        if not matches:
            continue
        dp_refs = []
        wl_refs: list[str] = []
        citations = []
        for match in matches:
            bracket = match.group(0)
            citations.append(bracket)
            for ref in _extract_source_dp_refs(bracket):
                source = ref.get("source")
                if ref.get("kind") == "weekly":
                    if source:
                        wl_refs.append(source)
                    continue
                dp_ids = ref.get("dp_ids") or []
                if not dp_ids:
                    continue
                dp_refs.append({
                    "source": source,
                    "dp_ids": [str(dp) for dp in dp_ids],
                    "raw": ref.get("raw") or "",
                })
        claim_text = line
        for match in reversed(matches):
            claim_text = claim_text[:match.start()] + claim_text[match.end():]
        claim_text = re.sub(r"<!--\s*cite:[^>]+?-->", " ", claim_text, flags=re.IGNORECASE)
        claim_text = _strip_inline_markdown(claim_text.strip().lstrip("-").strip())
        if claim_text:
            claims.append({
                "text": claim_text,
                "dp_refs": dp_refs,
                "wl_refs": sorted({item for item in wl_refs if item}),
                "citations": citations,
                "line": line,
            })
    return claims


def _parse_extraction_details(text: str) -> dict:
    dps = []
    raw_source = None
    current = None
    for line in text.splitlines():
        loc_match = ORIGINAL_LOCATION_RE.search(line)
        if loc_match and not raw_source:
            tail = loc_match.group(1)
            wiki_match = WIKI_LINK_RE.search(tail)
            if wiki_match:
                raw_source = wiki_match.group(1).strip()
            else:
                md_match = MD_LINK_RE.search(tail)
                if md_match:
                    raw_source = md_match.group(1).strip()
                else:
                    raw_source = tail.strip()

        dp_match = DP_RE.match(line)
        if dp_match:
            if current:
                dps.append(current)
            dp_id = dp_match.group(1)
            claim = line.split(":", 1)[1].strip() if ":" in line else ""
            claim = _strip_inline_markdown(claim)
            current = {
                "dp_id": dp_id,
                "claim": claim,
                "anchors": [],
                "citations": [],
                "tags": [],
            }
            continue

        if not current:
            continue

        anchor_match = re.match(r"^\s*-\s*\*\*Anchor(?:\s*\d+)?\s*:\*\*\s*\"?(.+?)\"?\s*$", line, re.IGNORECASE)
        if anchor_match:
            current["anchors"].append(anchor_match.group(1).strip())
            continue

        citation_match = re.match(r"^\s*-\s*\*\*Citation\s*:\*\*\s*(.+)$", line, re.IGNORECASE)
        if citation_match:
            current["citations"].append(citation_match.group(1).strip())
            continue

        tags_match = re.match(r"^\s*-\s*\*\*Tags\s*:\*\*\s*(.+)$", line, re.IGNORECASE)
        if tags_match:
            tags = [t.strip() for t in tags_match.group(1).split(",") if t.strip()]
            current["tags"].extend(tags)

    if current:
        dps.append(current)

    if not raw_source:
        fallback_match = re.search(r"(01_Raw_Inputs/[^\s)>\"]+)", text)
        if fallback_match:
            raw_source = fallback_match.group(1).strip()
        else:
            absolute_match = re.search(r"(/[^\\s)>\"]*01_Raw_Inputs/[^\s)>\"]+)", text)
            if absolute_match:
                raw_source = absolute_match.group(1).strip()

    for dp in dps:
        if dp["anchors"]:
            dp["anchor"] = dp["anchors"][0]
        if dp["citations"]:
            dp["citation"] = dp["citations"][0]

    return {"dps": dps, "raw_source": raw_source}


def _build_extraction_aliases(files: list[dict]) -> dict[str, list[str]]:
    alias_map: dict[str, list[str]] = {}
    for entry in files:
        if not entry["path"].startswith("02_Extractions/"):
            continue
        stem = entry.get("stem") or Path(entry["path"]).stem
        stripped = _strip_processing_date(stem)
        source_id = entry.get("source_id") or _canonical_extraction_source_id(stem)
        keys = {stem, stripped, source_id, entry.get("title") or ""}
        for key in keys:
            normalized = _normalize_key(key)
            if not normalized:
                continue
            alias_map.setdefault(normalized, []).append(entry["path"])
    return alias_map


def _build_source_id_aliases(files: list[dict]) -> dict[str, list[str]]:
    alias_map: dict[str, list[str]] = {}
    for entry in files:
        path = entry.get("path") or ""
        if not path.startswith("02_Extractions/"):
            continue
        stem = entry.get("stem") or Path(path).stem
        source_id = entry.get("source_id") or _canonical_extraction_source_id(stem)
        key = _normalize_key(source_id)
        if not key:
            continue
        alias_map.setdefault(key, []).append(path)
    return alias_map


def _load_citation_source_aliases(files_by_path: dict[str, dict]) -> dict[str, str]:
    alias_map: dict[str, str] = {}
    if not SOURCE_ALIAS_PATH.exists():
        return alias_map
    try:
        payload = json.loads(SOURCE_ALIAS_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return alias_map
    if not isinstance(payload, dict):
        return alias_map

    for raw_key, raw_path in payload.items():
        key = str(raw_key or "").strip()
        path = _normalize_path(str(raw_path or "").strip())
        if not key or not path or path not in files_by_path:
            continue
        key_norm = _normalize_key(key)
        if key_norm:
            alias_map[key_norm] = path
        stripped_norm = _normalize_key(_strip_processing_date(key))
        if stripped_norm and stripped_norm not in alias_map:
            alias_map[stripped_norm] = path
    return alias_map


def _build_weekly_aliases(files: list[dict]) -> dict[str, list[str]]:
    alias_map: dict[str, list[str]] = {}
    for entry in files:
        path = entry.get("path") or ""
        if not path.startswith("03_Weekly_Learnings/"):
            continue
        stem = entry.get("stem") or Path(path).stem
        keys = {stem}
        wl_match = re.search(r"(WL_\d{4}-\d{2}-\d{2})", stem, flags=re.IGNORECASE)
        if wl_match:
            keys.add(wl_match.group(1))
        for key in keys:
            normalized = _normalize_key(key)
            if not normalized:
                continue
            alias_map.setdefault(normalized, []).append(path)
    return alias_map


def _select_preferred_weekly_path(paths: list[str]) -> str | None:
    if not paths:
        return None
    return sorted(
        paths,
        key=lambda path: ("/archive/" in path.lower(), path),
    )[0]


def _build_extraction_candidates(files: list[dict]) -> list[dict]:
    candidates = []
    for entry in files:
        if not entry["path"].startswith("02_Extractions/"):
            continue
        stem = entry.get("stem") or Path(entry["path"]).stem
        stripped = _strip_processing_date(stem)
        title = entry.get("title") or ""
        tokens = set()
        raw_tokens = set()
        for key in {stem, stripped, title}:
            tokens.update(_tokenize(key, drop_stopwords=True))
            raw_tokens.update(_tokenize(key, drop_stopwords=False))
        candidates.append({
            "path": entry["path"],
            "key": _normalize_key(stem),
            "tokens": tokens,
            "raw_tokens": raw_tokens or tokens,
        })
    return candidates


def _resolve_extraction_candidates(
    source: str | None,
    alias_map: dict[str, list[str]],
    candidates: list[dict],
    allow_fuzzy: bool = True,
) -> list[str]:
    if not source:
        return []
    source_key = _normalize_key(source)
    exact = alias_map.get(source_key)
    if exact:
        return exact
    if not allow_fuzzy:
        return []

    tokens = _tokenize(source, drop_stopwords=True)
    raw_tokens = _tokenize(source, drop_stopwords=False)
    use_tokens = tokens or raw_tokens
    if not use_tokens:
        return []

    scored: list[tuple[float, str]] = []
    for candidate in candidates:
        candidate_tokens = candidate["tokens"] if tokens else candidate["raw_tokens"]
        overlap = len(use_tokens & candidate_tokens)
        if overlap == 0:
            continue
        score = overlap / max(1, len(use_tokens))
        if source_key and source_key in candidate["key"]:
            score += 0.2
        if source_key and candidate["key"].startswith(source_key):
            score += 0.15
        score += 0.05 * overlap / max(1, len(candidate_tokens))
        scored.append((score, candidate["path"]))

    if not scored:
        return []

    scored.sort(key=lambda item: item[0], reverse=True)
    top_score = scored[0][0]
    min_threshold = 0.9 if len(use_tokens) == 1 else 0.7
    if top_score < min_threshold:
        return []

    return [
        path for score, path in scored
        if score >= top_score - 0.08 and score >= min_threshold
    ]


def _parse_dp_ids(value: str | None) -> list[str]:
    if not value:
        return []
    ids = DP_TOKEN_RE.findall(value)
    deduped = []
    seen = set()
    for item in ids:
        key = str(item).strip()
        if not key or key in seen:
            continue
        seen.add(key)
        deduped.append(key)
    return deduped


def _parse_cite_metadata(citation: str) -> dict:
    result: dict[str, str | list[str]] = {}
    if not citation:
        return result

    for block in re.findall(r"<!--\s*cite:([^>]+?)\s*-->", citation, flags=re.IGNORECASE):
        for token in [part.strip() for part in block.split(";") if part.strip()]:
            if "=" not in token:
                continue
            key, raw_value = token.split("=", 1)
            key = key.strip().lower()
            raw_value = raw_value.strip()
            if not key:
                continue
            result[key] = raw_value

    if "dp" in result:
        dp_raw = str(result["dp"])
        dp_ids = []
        for token in re.split(r"[,\s]+", dp_raw):
            cleaned = token.strip()
            if not cleaned:
                continue
            cleaned = re.sub(r"^DP", "", cleaned, flags=re.IGNORECASE)
            if cleaned.isdigit():
                dp_ids.append(cleaned)
        result["dp_ids"] = dp_ids
    if "source_id" in result:
        result["source_id"] = str(result["source_id"]).strip()

    return result


def _strip_citation_markup(value: str | None) -> str:
    cleaned = str(value or "").strip()
    cleaned = re.sub(r"<!--\s*cite:[^>]+?-->", "", cleaned, flags=re.IGNORECASE).strip()
    if cleaned.startswith("[") and cleaned.endswith("]"):
        cleaned = cleaned[1:-1].strip()
    return cleaned


def _parse_citation_source_and_dp(citation: str) -> tuple[str | None, list[str], str]:
    refs = _extract_source_dp_refs(citation)
    if not refs:
        cleaned = _strip_citation_markup(citation)
        if not cleaned:
            return None, [], "unknown"
        source = cleaned or None
        ref_kind = "weekly" if source and WL_REF_RE.fullmatch(source) else "extraction"
        return source, [], ref_kind

    primary = next((ref for ref in refs if ref.get("kind") == "extraction"), refs[0])
    source = primary.get("source")
    dp_ids = [str(dp) for dp in (primary.get("dp_ids") or [])]
    ref_kind = str(primary.get("kind") or "unknown")
    return source, dp_ids, ref_kind


def _resolve_citation_context_entry(
    citation: str,
    files_by_path: dict[str, dict],
    extraction_aliases: dict[str, list[str]],
    source_id_aliases: dict[str, list[str]],
    source_aliases: dict[str, str],
    extraction_candidates: list[dict],
    dps_by_extraction: dict[str, list[dict]],
    weekly_aliases: dict[str, list[str]],
) -> dict:
    original_text = str(citation or "")
    metadata = _parse_cite_metadata(original_text)
    source_hint = str(metadata.get("source") or "").strip() or None
    source_id_hint = str(metadata.get("source_id") or "").strip() or None
    path_hint = str(metadata.get("path") or "").strip() or None
    metadata_dp_ids = metadata.get("dp_ids") if isinstance(metadata.get("dp_ids"), list) else []
    source_from_text, text_dp_ids, source_kind = _parse_citation_source_and_dp(original_text)
    source = source_hint or source_id_hint or source_from_text
    dp_ids = metadata_dp_ids or text_dp_ids
    if source_hint and WL_REF_RE.fullmatch(source_hint):
        source_kind = "weekly"

    # Metadata with an explicit unresolved status should surface directly.
    if str(metadata.get("status") or "").lower() == "unresolved":
        return {
            "original_text": original_text,
            "status": "unresolved",
            "reference_type": source_kind,
            "source_label": source or _strip_citation_markup(original_text) or "Citation",
            "source_path": None,
            "source_title": None,
            "dp_ids": [f"DP{dp}" for dp in dp_ids],
            "dp_context": [],
            "candidates": [],
            "confidence": 0.0,
            "reason": "Marked unresolved by citation metadata",
        }

    if not source and not path_hint:
        return {
            "original_text": original_text,
            "status": "unresolved",
            "reference_type": source_kind,
            "source_label": _strip_citation_markup(original_text) or "Citation",
            "source_path": None,
            "source_title": None,
            "dp_ids": [f"DP{dp}" for dp in dp_ids],
            "dp_context": [],
            "candidates": [],
            "confidence": 0.0,
            "reason": "No parseable source key in citation",
        }

    candidates: list[str] = []
    if path_hint:
        normalized_path = _normalize_path(path_hint)
        if normalized_path in files_by_path:
            candidates = [normalized_path]
            if normalized_path.startswith("03_Weekly_Learnings/"):
                source_kind = "weekly"
        elif source_id_hint:
            source_id_candidates = source_id_aliases.get(_normalize_key(source_id_hint), [])
            if len(source_id_candidates) == 1:
                candidates = source_id_candidates
            else:
                candidates = source_id_candidates
        elif source:
            alias_path = source_aliases.get(_normalize_key(source)) or source_aliases.get(_normalize_key(_strip_processing_date(source)))
            if alias_path:
                candidates = [alias_path]
            else:
            # Exact path not found — fall through to source-based matching.
            # This handles cases where the date suffix in the metadata is wrong
            # (e.g. cite says 2026-02-03 but file is 2026-02-04).
                if source_kind == "weekly" or WL_REF_RE.fullmatch(source):
                    source_kind = "weekly"
                    weekly_candidates = weekly_aliases.get(_normalize_key(source), [])
                    preferred = _select_preferred_weekly_path(weekly_candidates)
                    candidates = [preferred] if preferred else []
                else:
                    candidates = _resolve_extraction_candidates(
                        source,
                        extraction_aliases,
                        extraction_candidates,
                        allow_fuzzy=not STRICT_CITATION_RESOLUTION,
                    )
        if not candidates and not source:
            return {
                "original_text": original_text,
                "status": "unresolved",
                "reference_type": source_kind,
                "source_label": source or path_hint,
                "source_path": None,
                "source_title": None,
                "dp_ids": [f"DP{dp}" for dp in dp_ids],
                "dp_context": [],
                "candidates": [],
                "confidence": 0.0,
                "reason": f"Metadata path not found: {path_hint}",
            }
    elif source:
        if source_kind != "weekly":
            alias_path = source_aliases.get(_normalize_key(source)) or source_aliases.get(_normalize_key(_strip_processing_date(source)))
            if alias_path:
                candidates = [alias_path]
        if source_id_hint:
            candidates = source_id_aliases.get(_normalize_key(source_id_hint), [])
            if not candidates:
                return {
                    "original_text": original_text,
                    "status": "unresolved",
                    "reference_type": source_kind,
                    "source_label": source or _strip_citation_markup(original_text) or "Citation",
                    "source_path": None,
                    "source_title": None,
                    "dp_ids": [f"DP{dp}" for dp in dp_ids],
                    "dp_context": [],
                    "candidates": [],
                    "confidence": 0.0,
                    "reason": "No extraction matched canonical source_id",
                }
        if source_kind == "weekly" or WL_REF_RE.fullmatch(source):
            source_kind = "weekly"
            weekly_candidates = weekly_aliases.get(_normalize_key(source), [])
            preferred = _select_preferred_weekly_path(weekly_candidates)
            candidates = [preferred] if preferred else []
        elif not candidates:
            candidates = _resolve_extraction_candidates(
                source,
                extraction_aliases,
                extraction_candidates,
                allow_fuzzy=not STRICT_CITATION_RESOLUTION,
            )

    if not candidates:
        reason = "No extraction candidate matched source key"
        if source_kind == "weekly":
            reason = "No Weekly Learnings candidate matched reference key"
        return {
            "original_text": original_text,
            "status": "unresolved",
            "reference_type": source_kind,
            "source_label": source or _strip_citation_markup(original_text) or "Citation",
            "source_path": None,
            "source_title": None,
            "dp_ids": [f"DP{dp}" for dp in dp_ids],
            "dp_context": [],
            "candidates": [],
            "confidence": 0.0,
            "reason": reason,
        }

    if len(candidates) > 1:
        candidate_payload = []
        for path in candidates[:8]:
            meta = files_by_path.get(path, {})
            candidate_payload.append({
                "path": path,
                "title": meta.get("title") or meta.get("stem") or meta.get("name") or path,
            })
        return {
            "original_text": original_text,
            "status": "ambiguous",
            "reference_type": source_kind,
            "source_label": source or _strip_citation_markup(original_text) or "Citation",
            "source_path": None,
            "source_title": None,
            "dp_ids": [f"DP{dp}" for dp in dp_ids],
            "dp_context": [],
            "candidates": candidate_payload,
            "confidence": 0.45,
            "reason": "Multiple extraction candidates matched source key",
        }

    resolved_path = candidates[0]
    file_meta = files_by_path.get(resolved_path, {})
    resolved_kind = source_kind
    if resolved_path.startswith("03_Weekly_Learnings/"):
        resolved_kind = "weekly"
    elif not resolved_kind or resolved_kind == "unknown":
        resolved_kind = "extraction"

    if resolved_kind == "weekly":
        confidence = 0.99 if path_hint else 0.94
        return {
            "original_text": original_text,
            "status": "linked",
            "reference_type": "weekly",
            "source_label": source or file_meta.get("stem") or file_meta.get("name") or resolved_path,
            "source_path": resolved_path,
            "source_title": file_meta.get("title") or file_meta.get("stem") or file_meta.get("name") or resolved_path,
            "dp_ids": [f"DP{dp}" for dp in dp_ids],
            "dp_context": [],
            "candidates": [],
            "confidence": confidence,
            "reason": "Weekly reference resolved",
        }

    dps = dps_by_extraction.get(resolved_path, [])
    dps_lookup = {str(item.get("dp_id")): item for item in dps}

    dp_context = []
    missing_dp = False
    for dp in dp_ids:
        detail = dps_lookup.get(str(dp))
        if detail:
            dp_context.append({
                "dp_id": f"DP{dp}",
                "claim": _strip_inline_markdown(detail.get("claim") or ""),
                "anchor": detail.get("anchor"),
                "citation": detail.get("citation"),
            })
        else:
            missing_dp = True
            dp_context.append({
                "dp_id": f"DP{dp}",
                "claim": None,
                "anchor": None,
                "citation": None,
            })

    confidence = 0.92
    if path_hint:
        confidence = 0.99
    elif not dp_ids:
        confidence = 0.82
    elif missing_dp:
        confidence = 0.74

    reason = None
    if dp_ids and missing_dp:
        reason = "One or more DP ids were not found in the resolved extraction"
    elif not dp_ids:
        reason = "Citation resolved to source without explicit DP ids"

    return {
        "original_text": original_text,
        "status": "linked",
        "reference_type": "extraction",
        "source_label": source or file_meta.get("title") or file_meta.get("stem") or file_meta.get("name") or resolved_path,
        "source_path": resolved_path,
        "source_title": file_meta.get("title") or file_meta.get("stem") or file_meta.get("name") or resolved_path,
        "dp_ids": [f"DP{dp}" for dp in dp_ids],
        "dp_context": dp_context,
        "candidates": [],
        "confidence": confidence,
        "reason": reason,
    }


def _build_raw_input_aliases(files: list[dict]) -> dict[str, str]:
    alias_map: dict[str, str] = {}
    for entry in files:
        path = entry["path"]
        if not path.startswith("01_Raw_Inputs/"):
            continue
        parts = path.split("/")
        if len(parts) >= 4 and "_to_" in parts[2]:
            alias = "/".join([parts[0], parts[1], parts[3]])
            alias_map[alias] = path
    return alias_map


def _resolve_raw_source(raw_source: str | None, alias_map: dict[str, str], raw_inputs: set[str]) -> str | None:
    if not raw_source:
        return None
    candidate = raw_source.strip()
    if "01_Raw_Inputs/" in candidate:
        candidate = candidate.split("01_Raw_Inputs/", 1)[1]
        candidate = f"01_Raw_Inputs/{candidate}"
    if candidate.startswith("file://"):
        candidate = candidate[len("file://"):]
        if "01_Raw_Inputs/" in candidate:
            candidate = candidate.split("01_Raw_Inputs/", 1)[1]
            candidate = f"01_Raw_Inputs/{candidate}"
    candidate = candidate.lstrip("/").strip()
    candidate = _normalize_path(candidate)
    if candidate in raw_inputs:
        return candidate
    return alias_map.get(candidate)

def _parse_markdown(text: str, path: Path | None = None) -> dict:
    title = None
    headings = []
    dp_ids: set[str] = set()
    should_count_dp = bool(
        path
        and "02_Extractions" in path.parts
        and not path.name.startswith("_")
    )
    for line in text.splitlines():
        if should_count_dp:
            dp_match = DP_RE.match(line)
            if dp_match:
                dp_ids.add(dp_match.group(1))
        match = HEADING_RE.match(line.strip())
        if not match:
            continue
        level = len(match.group(1))
        value = match.group(2).strip()
        headings.append({"level": level, "text": value})
        if level == 1 and not title:
            title = value

    tags = sorted({f"#{t.lower()}" for t in TAG_RE.findall(text)})
    wiki_links = sorted({m.strip() for m in WIKI_LINK_RE.findall(text) if m.strip()})
    md_links = sorted({m.strip() for m in MD_LINK_RE.findall(text) if m.strip()})

    citations = set()
    for cre in CITATION_RES:
        citations.update(cre.findall(text))
    citations = sorted({c.strip() for c in citations if c.strip()})

    return {
        "title": title,
        "headings": headings,
        "tags": tags,
        "wiki_links": wiki_links,
        "md_links": md_links,
        "citations": citations,
        "dp_count": len(dp_ids),
    }


def _iter_files(root: Path):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS and not d.startswith(".")]
        for filename in filenames:
            if filename.startswith("."):
                continue
            path = Path(dirpath) / filename
            yield path


def _compute_source_fingerprint() -> str:
    """Compute a stable fingerprint of repository file state.

    Uses path + mtime + size so cache invalidates when files are added,
    removed, renamed, or edited.
    """
    records: list[str] = []
    for path in _iter_files(REPO_ROOT):
        rel_path = _safe_relpath(path)
        if rel_path.startswith(".cris_cache/") or rel_path.startswith("poc/"):
            continue
        try:
            stat = path.stat()
        except OSError:
            continue
        records.append(f"{rel_path}\t{stat.st_mtime_ns}\t{stat.st_size}")

    records.sort()
    payload = "\n".join(records)
    return hashlib.sha256(payload.encode("utf-8", errors="ignore")).hexdigest()


def build_index() -> dict:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    source_fingerprint = _compute_source_fingerprint()
    existing = {}
    if INDEX_PATH.exists():
        try:
            existing = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            existing = {}

    existing_files = {}
    if existing.get("type_version") == TYPE_VERSION:
        existing_files = {f["path"]: f for f in existing.get("files", [])}

    dps_by_extraction: dict[str, list[dict]] = {}
    raw_source_by_extraction: dict[str, str | None] = {}
    claims_by_file: dict[str, list[dict]] = {}
    evidence_by_file: dict[str, list[str]] = {}

    files = []
    for path in _iter_files(REPO_ROOT):
        rel_path = _safe_relpath(path)
        if rel_path.startswith(".cris_cache/") or rel_path.startswith("poc/"):
            continue

        stat = path.stat()
        sig = f"{stat.st_mtime}-{stat.st_size}"

        entry = {
            "path": rel_path,
            "type": _detect_type(path),
            "name": path.name,
            "stem": path.stem,
            "ext": path.suffix.lower(),
            "mtime": stat.st_mtime,
            "size": stat.st_size,
            "_sig": sig,
        }

        if _is_text_file(path):
            text = _read_text(path)
            parsed = _parse_markdown(text, path)
            entry.update(parsed)
            entry["hash"] = _hash_text(text)

            claim_refs = _parse_claim_refs(text)
            entry["claim_count"] = len(claim_refs)
            if claim_refs:
                claims_by_file[rel_path] = claim_refs

            evidence_links = _parse_supporting_evidence(text)
            entry["evidence_links_count"] = len(evidence_links)
            if evidence_links:
                evidence_by_file[rel_path] = evidence_links

            if rel_path.startswith("02_Extractions/"):
                details = _parse_extraction_details(text)
                entry["dp_detail_count"] = len(details["dps"])
                entry["raw_source"] = details["raw_source"]
                entry["source_id"] = _canonical_extraction_source_id(path.stem)
                dps_by_extraction[rel_path] = details["dps"]
                raw_source_by_extraction[rel_path] = details["raw_source"]
            else:
                entry["dp_detail_count"] = 0
                entry["raw_source"] = None
                entry["source_id"] = None
        else:
            prev = existing_files.get(rel_path)
            if prev and prev.get("_sig") == sig:
                entry.update(prev)
            else:
                entry.update({
                    "title": None,
                    "headings": [],
                    "tags": [],
                    "wiki_links": [],
                    "md_links": [],
                    "citations": [],
                    "dp_count": 0,
                    "hash": None,
                })
            entry["claim_count"] = entry.get("claim_count", 0)
            entry["evidence_links_count"] = entry.get("evidence_links_count", 0)
            entry["dp_detail_count"] = entry.get("dp_detail_count", 0)
            entry["raw_source"] = entry.get("raw_source")
            entry["source_id"] = entry.get("source_id")

        files.append(entry)

    files.sort(key=lambda f: (f["type"], f["path"]))

    stats = {t: 0 for t in ALL_TYPES}
    for f in files:
        stats[f["type"]] = stats.get(f["type"], 0) + 1

    index = {
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "root": str(REPO_ROOT),
        "stats": stats,
        "type_order": ALL_TYPES,
        "display_types": DISPLAY_TYPES,
        "type_version": TYPE_VERSION,
        "source_fingerprint": source_fingerprint,
        "files": files,
        "total_files": len(files),
    }

    lineage_cache = build_lineage_cache(
        files,
        dps_by_extraction,
        raw_source_by_extraction,
        claims_by_file,
        evidence_by_file,
        source_fingerprint,
    )
    index["status"] = lineage_cache.get("status", {})
    index["lineage_summary"] = lineage_cache.get("summary", {})

    INDEX_PATH.write_text(json.dumps(index, indent=2), encoding="utf-8")
    return index


def _build_claim_lineage(
    claim: dict,
    extraction_aliases: dict[str, list[str]],
    extraction_candidates: list[dict],
    dps_lookup: dict[str, dict[str, dict]],
    raw_source_by_extraction: dict[str, str | None],
    raw_input_aliases: dict[str, str],
    raw_inputs: set[str],
) -> dict:
    nodes: dict[str, dict] = {}
    edges: list[dict] = []

    def add_node(node: dict):
        nodes[node["id"]] = node

    def add_edge(from_id: str, to_id: str, relation: str, confidence: float | None = None):
        edge = {"from": from_id, "to": to_id, "relation": relation}
        if confidence is not None:
            edge["confidence"] = confidence
        edges.append(edge)

    claim_id = claim["id"]
    add_node({
        "id": claim_id,
        "type": "claim",
        "label": _strip_inline_markdown(claim.get("text") or "Claim"),
        "path": claim.get("source_path"),
        "metadata": {
            "line": claim.get("line"),
            "citations": claim.get("citations", []),
        },
    })

    def resolve_source(source: str | None) -> list[str]:
        return _resolve_extraction_candidates(source, extraction_aliases, extraction_candidates)

    def narrow_candidates_by_dp_ids(candidates: list[str], dp_ids: list[str]) -> list[str]:
        if len(candidates) <= 1 or not dp_ids:
            return candidates
        requested = {str(dp).strip() for dp in dp_ids if str(dp).strip()}
        if not requested:
            return candidates

        # Prefer candidates that explicitly contain every referenced DP id.
        narrowed = []
        for candidate in candidates:
            dp_lookup = dps_lookup.get(candidate, {})
            available = set(dp_lookup.keys())
            if requested.issubset(available):
                narrowed.append(candidate)

        return narrowed or candidates

    for ref in claim.get("dp_refs", []):
        source = ref.get("source")
        dp_ids = ref.get("dp_ids", [])
        candidates = resolve_source(source)
        candidates = narrow_candidates_by_dp_ids(candidates, dp_ids)

        if not source:
            missing_id = f"missing:{claim_id}:source"
            add_node({
                "id": missing_id,
                "type": "missing",
                "label": "Missing extraction source",
                "path": None,
                "metadata": {"reason": "No source provided"},
            })
            add_edge(claim_id, missing_id, "supports", 0.2)
            continue

        if not candidates:
            missing_id = f"missing:{claim_id}:{source}"
            add_node({
                "id": missing_id,
                "type": "missing",
                "label": f"Missing extraction: {source}",
                "path": None,
                "metadata": {"source": source},
            })
            add_edge(claim_id, missing_id, "supports", 0.2)
            continue

        if len(candidates) > 1:
            amb_id = f"ambiguous:{claim_id}:{source}"
            add_node({
                "id": amb_id,
                "type": "ambiguous",
                "label": f"Ambiguous source: {source}",
                "path": None,
                "metadata": {"source": source, "candidates": candidates},
            })
            add_edge(claim_id, amb_id, "supports", 0.4)
            for candidate in candidates:
                extraction_id = f"extraction:{candidate}"
                if extraction_id not in nodes:
                    add_node({
                        "id": extraction_id,
                        "type": "extraction",
                        "label": Path(candidate).stem,
                        "path": candidate,
                        "metadata": {},
                    })
                add_edge(amb_id, extraction_id, "candidate")
            continue

        extraction_path = candidates[0]
        extraction_id = f"extraction:{extraction_path}"
        if extraction_id not in nodes:
            add_node({
                "id": extraction_id,
                "type": "extraction",
                "label": Path(extraction_path).stem,
                "path": extraction_path,
                "metadata": {},
            })

        dp_lookup = dps_lookup.get(extraction_path, {})
        for dp_id in dp_ids:
            dp_key = f"dp:{extraction_path}:DP{dp_id}"
            dp_detail = dp_lookup.get(dp_id)
            metadata = {}
            if dp_detail:
                metadata = {
                    "anchor": dp_detail.get("anchor"),
                    "citation": dp_detail.get("citation"),
                    "claim": _strip_inline_markdown(dp_detail.get("claim") or ""),
                }
            else:
                metadata = {"missing": True}
            add_node({
                "id": dp_key,
                "type": "dp",
                "label": f"DP{dp_id}",
                "path": extraction_path,
                "metadata": metadata,
            })
            add_edge(claim_id, dp_key, "supports", 0.7)
            add_edge(dp_key, extraction_id, "from")

        raw_source = raw_source_by_extraction.get(extraction_path)
        resolved_raw = _resolve_raw_source(raw_source, raw_input_aliases, raw_inputs)
        if raw_source:
            raw_path = resolved_raw or raw_source
            raw_id = f"raw:{raw_path}"
            if raw_id not in nodes:
                add_node({
                    "id": raw_id,
                    "type": "raw",
                    "label": Path(raw_path).name if resolved_raw else raw_source,
                    "path": resolved_raw,
                    "metadata": {"raw_source": raw_source},
                })
            add_edge(extraction_id, raw_id, "derived_from")
        else:
            missing_raw_id = f"missing:{extraction_id}:raw"
            add_node({
                "id": missing_raw_id,
                "type": "missing",
                "label": "Unknown raw input",
                "path": None,
                "metadata": {"reason": "No Original Location"},
            })
            add_edge(extraction_id, missing_raw_id, "derived_from", 0.2)

    has_missing = any(node["type"] == "missing" for node in nodes.values())
    has_ambiguous = any(node["type"] == "ambiguous" for node in nodes.values())
    return {
        "nodes": list(nodes.values()),
        "edges": edges,
        "flags": {"missing": has_missing, "ambiguous": has_ambiguous},
    }


def build_lineage_cache(
    files: list[dict],
    dps_by_extraction: dict[str, list[dict]],
    raw_source_by_extraction: dict[str, str | None],
    claims_by_file: dict[str, list[dict]],
    evidence_by_file: dict[str, list[str]],
    source_fingerprint: str | None = None,
) -> dict:
    """Build lineage graph cache.

    LineageNode: {"type": str, "id": str, "label": str, "path": str | None, "metadata": dict}
    LineageEdge: {"from": str, "to": str, "relation": str, "confidence"?: float}
    ClaimRef: {"id": str, "text": str, "dp_refs": list, "source_path": str}
    """
    files_by_path = {f["path"]: f for f in files}
    extraction_aliases = _build_extraction_aliases(files)
    extraction_candidates = _build_extraction_candidates(files)
    raw_input_aliases = _build_raw_input_aliases(files)
    raw_inputs = {f["path"] for f in files if f["path"].startswith("01_Raw_Inputs/")}

    weekly_files = {f["path"] for f in files if f["type"] == "Weekly Learnings"}
    monthly_files = {f["path"] for f in files if f["type"] == "Monthly Synthesis"}
    extraction_files = {f["path"] for f in files if f["type"] == "Extractions"}
    current_understanding_files = {
        f["path"]
        for f in files
        if f["path"].startswith("06_Current_Understanding/")
        and f["ext"] in TEXT_EXTENSIONS
        and not Path(f["path"]).name.startswith("_")
    }

    dps_lookup: dict[str, dict[str, dict]] = {}
    for path, dps in dps_by_extraction.items():
        dps_lookup[path] = {dp["dp_id"]: dp for dp in dps}

    claims_by_file_with_ids: dict[str, list[dict]] = {}
    lineage_by_claim: dict[str, dict] = {}

    total_claims = 0
    for path, claims in claims_by_file.items():
        file_claims = []
        for idx, claim in enumerate(claims):
            claim_id = f"claim:{path}:{idx}"
            claim_entry = dict(claim)
            claim_entry["id"] = claim_id
            claim_entry["source_path"] = path
            file_claims.append(claim_entry)
            lineage_by_claim[claim_id] = _build_claim_lineage(
                claim_entry,
                extraction_aliases,
                extraction_candidates,
                dps_lookup,
                raw_source_by_extraction,
                raw_input_aliases,
                raw_inputs,
            )
            total_claims += 1
        claims_by_file_with_ids[path] = file_claims

    referenced_raw_inputs = set()
    for extraction_path, raw_source in raw_source_by_extraction.items():
        resolved = _resolve_raw_source(raw_source, raw_input_aliases, raw_inputs)
        if resolved:
            referenced_raw_inputs.add(resolved)

    referenced_extractions = set()
    for path, claims in claims_by_file.items():
        if path not in weekly_files:
            continue
        for claim in claims:
            for ref in claim.get("dp_refs", []):
                source = ref.get("source")
                if not source:
                    continue
                candidates = extraction_aliases.get(_normalize_key(source), [])
                referenced_extractions.update(candidates)

    referenced_weekly = set()
    for path in monthly_files:
        entry = files_by_path.get(path, {})
        links = (entry.get("wiki_links") or []) + (entry.get("md_links") or [])
        for link in links:
            if "03_Weekly_Learnings/" not in link:
                continue
            start = link.index("03_Weekly_Learnings/")
            weekly_path = link[start:]
            weekly_path = weekly_path.split("#")[0].split("?")[0]
            weekly_path = _normalize_path(weekly_path)
            if weekly_path in weekly_files:
                referenced_weekly.add(weekly_path)

    raw_inputs_missing = sorted(raw_inputs - referenced_raw_inputs)
    extractions_missing = sorted(extraction_files - referenced_extractions)
    weekly_missing = sorted(weekly_files - referenced_weekly)

    ideas_missing_dp = []
    for path in sorted(current_understanding_files):
        if not claims_by_file.get(path):
            ideas_missing_dp.append(path)

    status = {
        "raw_inputs_unextracted": {
            "count": len(raw_inputs_missing),
            "samples": raw_inputs_missing[:6],
        },
        "extractions_unreferenced": {
            "count": len(extractions_missing),
            "samples": extractions_missing[:6],
        },
        "weekly_unreferenced": {
            "count": len(weekly_missing),
            "samples": weekly_missing[:6],
        },
        "ideas_missing_dp_refs": {
            "count": len(ideas_missing_dp),
            "samples": ideas_missing_dp[:6],
        },
    }

    cache = {
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "version": TYPE_VERSION,
        "source_fingerprint": source_fingerprint or _compute_source_fingerprint(),
        "claims_by_file": claims_by_file_with_ids,
        "lineage_by_claim": lineage_by_claim,
        "dps_by_extraction": dps_by_extraction,
        "raw_source_by_extraction": raw_source_by_extraction,
        "status": status,
        "summary": {
            "total_claims": total_claims,
            "total_dps": sum(len(dps) for dps in dps_by_extraction.values()),
            "total_extractions": len(extraction_files),
        },
    }

    LINEAGE_PATH.write_text(json.dumps(cache, indent=2), encoding="utf-8")
    return cache


def load_index() -> dict:
    if INDEX_PATH.exists():
        try:
            cached = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
            current_fingerprint = _compute_source_fingerprint()
            if (
                cached.get("type_version") == TYPE_VERSION
                and cached.get("source_fingerprint") == current_fingerprint
            ):
                return cached
        except json.JSONDecodeError:
            pass
        return build_index()
    return build_index()


def load_lineage() -> dict:
    if LINEAGE_PATH.exists():
        try:
            cached = json.loads(LINEAGE_PATH.read_text(encoding="utf-8"))
            current_fingerprint = _compute_source_fingerprint()
            if (
                cached.get("version") == TYPE_VERSION
                and cached.get("source_fingerprint") == current_fingerprint
            ):
                return cached
        except json.JSONDecodeError:
            pass
    build_index()
    if LINEAGE_PATH.exists():
        return json.loads(LINEAGE_PATH.read_text(encoding="utf-8"))
    return {}


def _json_response(handler: SimpleHTTPRequestHandler, status: int, payload: dict):
    raw = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(raw)))
    handler.end_headers()
    handler.wfile.write(raw)


def _text_response(handler: SimpleHTTPRequestHandler, status: int, payload: str):
    raw = payload.encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "text/plain; charset=utf-8")
    handler.send_header("Content-Length", str(len(raw)))
    handler.end_headers()
    handler.wfile.write(raw)


def _read_json_body(handler: SimpleHTTPRequestHandler) -> dict:
    length = int(handler.headers.get("Content-Length", "0") or 0)
    if length <= 0:
        return {}
    raw = handler.rfile.read(length)
    if not raw:
        return {}
    try:
        return json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError:
        return {}


def _file_response(handler: SimpleHTTPRequestHandler, status: int, path: Path):
    mime, _ = mimetypes.guess_type(str(path))
    mime = mime or "application/octet-stream"
    data = path.read_bytes()
    handler.send_response(status)
    handler.send_header("Content-Type", mime)
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def _open_file_on_host(path: Path) -> None:
    target = str(path)
    if sys.platform == "darwin":
        subprocess.Popen(["open", target])
        return
    if os.name == "nt":
        os.startfile(target)  # type: ignore[attr-defined]
        return
    subprocess.Popen(["xdg-open", target])


class CRISHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/index":
            index = load_index()
            return _json_response(self, 200, index)

        if parsed.path == "/api/activity":
            index = load_index()
            files = index.get("files", [])
            recent = sorted(files, key=lambda f: f.get("mtime") or 0, reverse=True)[:20]
            items = []
            for file in recent:
                title = file.get("title") or file.get("stem") or file.get("name") or "Untitled"
                items.append({
                    "path": file.get("path"),
                    "title": title,
                    "type": file.get("type"),
                    "mtime": file.get("mtime"),
                    "tags": file.get("tags", []),
                    "dp_count": file.get("dp_count", 0),
                    "claim_count": file.get("claim_count", 0),
                })
            payload = {
                "generated_at": index.get("generated_at"),
                "total": len(items),
                "items": items,
            }
            return _json_response(self, 200, payload)

        if parsed.path == "/api/lineage":
            params = parse_qs(parsed.query)
            rel_path = params.get("path", [None])[0]
            claim_param = params.get("claim", [None])[0]
            dp_ref = params.get("dp_ref", [None])[0]

            lineage = load_lineage()
            claims_by_file = lineage.get("claims_by_file", {})
            lineage_by_claim = lineage.get("lineage_by_claim", {})

            if claim_param:
                if not rel_path:
                    return _json_response(self, 400, {"error": "Missing path"})
                claims = claims_by_file.get(rel_path, [])
                claim_entry = None
                if claim_param.isdigit():
                    idx = int(claim_param)
                    if 0 <= idx < len(claims):
                        claim_entry = claims[idx]
                else:
                    claim_entry = next((c for c in claims if c.get("id") == claim_param), None)
                if not claim_entry:
                    return _json_response(self, 404, {"error": "Claim not found"})
                lineage_entry = lineage_by_claim.get(claim_entry.get("id"))
                return _json_response(self, 200, {"claim": claim_entry, "lineage": lineage_entry})

            if dp_ref:
                match = re.match(r"(.+?)(?:#|\s+)DP(\d+)", dp_ref, re.IGNORECASE)
                if not match:
                    return _json_response(self, 400, {"error": "Invalid dp_ref format"})
                extraction_path = match.group(1).strip()
                dp_id = match.group(2)
                dps_by_extraction = lineage.get("dps_by_extraction", {})
                raw_source_by_extraction = lineage.get("raw_source_by_extraction", {})
                dps = dps_by_extraction.get(extraction_path, [])
                dp_detail = next((dp for dp in dps if dp.get("dp_id") == dp_id), None)
                extraction_id = f"extraction:{extraction_path}"
                dp_node = {
                    "id": f"dp:{extraction_path}:DP{dp_id}",
                    "type": "dp",
                    "label": f"DP{dp_id}",
                    "path": extraction_path,
                    "metadata": {
                        "anchor": dp_detail.get("anchor") if dp_detail else None,
                        "citation": dp_detail.get("citation") if dp_detail else None,
                        "claim": dp_detail.get("claim") if dp_detail else None,
                        "missing": dp_detail is None,
                    },
                }
                nodes = [
                    dp_node,
                    {
                        "id": extraction_id,
                        "type": "extraction",
                        "label": Path(extraction_path).stem,
                        "path": extraction_path,
                        "metadata": {},
                    },
                ]
                edges = [{"from": dp_node["id"], "to": extraction_id, "relation": "from"}]
                raw_source = raw_source_by_extraction.get(extraction_path)
                if raw_source:
                    raw_id = f"raw:{raw_source}"
                    nodes.append({
                        "id": raw_id,
                        "type": "raw",
                        "label": Path(raw_source).name,
                        "path": raw_source if raw_source.startswith("01_Raw_Inputs/") else None,
                        "metadata": {"raw_source": raw_source},
                    })
                    edges.append({"from": extraction_id, "to": raw_id, "relation": "derived_from"})
                return _json_response(self, 200, {"claim": None, "lineage": {"nodes": nodes, "edges": edges}})

            return _json_response(self, 400, {"error": "Missing claim or dp_ref"})

        if parsed.path == "/api/file":
            params = parse_qs(parsed.query)
            rel_path = params.get("path", [None])[0]
            if not rel_path:
                return _json_response(self, 400, {"error": "Missing path"})

            try:
                requested = (REPO_ROOT / rel_path).resolve()
                requested.relative_to(REPO_ROOT)
            except (ValueError, FileNotFoundError):
                return _json_response(self, 400, {"error": "Invalid path"})

            if not requested.exists() or not requested.is_file():
                return _json_response(self, 404, {"error": "File not found"})

            entry = {
                "path": _safe_relpath(requested),
                "type": _detect_type(requested),
                "name": requested.name,
                "stem": requested.stem,
                "ext": requested.suffix.lower(),
                "mtime": requested.stat().st_mtime,
                "size": requested.stat().st_size,
            }

            if _is_text_file(requested):
                text = _read_text(requested)
                entry.update(_parse_markdown(text, requested))
                entry["content"] = text
                entry["claim_refs"] = _parse_claim_refs(text)
                entry["claim_count"] = len(entry["claim_refs"])
                entry["evidence_links"] = _parse_supporting_evidence(text)
                entry["evidence_links_count"] = len(entry["evidence_links"])
                if entry["path"].startswith("02_Extractions/"):
                    details = _parse_extraction_details(text)
                    entry["raw_source"] = details["raw_source"]
                    entry["dp_details"] = details["dps"]
            else:
                entry.update({
                    "title": None,
                    "headings": [],
                    "tags": [],
                    "wiki_links": [],
                    "md_links": [],
                    "citations": [],
                    "dp_count": 0,
                    "content": None,
                })
                entry["claim_refs"] = []
                entry["claim_count"] = 0
                entry["evidence_links"] = []
                entry["evidence_links_count"] = 0
                entry["dp_details"] = []

            return _json_response(self, 200, entry)

        if parsed.path == "/files":
            params = parse_qs(parsed.query)
            rel_path = params.get("path", [None])[0]
            if not rel_path:
                return _json_response(self, 400, {"error": "Missing path"})

            try:
                safe_path = Path(rel_path.lstrip("/"))
                requested = (REPO_ROOT / safe_path).resolve()
                requested.relative_to(REPO_ROOT)
            except (ValueError, FileNotFoundError):
                return _json_response(self, 400, {"error": "Invalid path"})

            if not requested.exists() or not requested.is_file():
                return _json_response(self, 404, {"error": "File not found"})

            return _file_response(self, 200, requested)

        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/open-file":
            payload = _read_json_body(self)
            rel_path = payload.get("path")
            if not isinstance(rel_path, str) or not rel_path.strip():
                return _json_response(self, 400, {"error": "Missing path"})

            try:
                safe_path = Path(rel_path.lstrip("/"))
                requested = (REPO_ROOT / safe_path).resolve()
                requested.relative_to(REPO_ROOT)
            except (ValueError, FileNotFoundError):
                return _json_response(self, 400, {"error": "Invalid path"})

            if not requested.exists() or not requested.is_file():
                return _json_response(self, 404, {"error": "File not found"})

            try:
                _open_file_on_host(requested)
            except Exception as error:  # pragma: no cover - OS dependent
                return _json_response(self, 500, {"error": f"Could not open file: {error}"})

            return _json_response(self, 200, {"status": "ok"})

        if parsed.path == "/api/citation-context":
            payload = _read_json_body(self)
            citations = payload.get("citations", [])
            context_path = payload.get("context_path")

            if not isinstance(citations, list):
                return _json_response(self, 400, {"error": "citations must be an array"})

            index = load_index()
            files = index.get("files", [])
            files_by_path = {entry.get("path"): entry for entry in files if entry.get("path")}
            extraction_aliases = _build_extraction_aliases(files)
            source_id_aliases = _build_source_id_aliases(files)
            source_aliases = _load_citation_source_aliases(files_by_path)
            extraction_candidates = _build_extraction_candidates(files)
            weekly_aliases = _build_weekly_aliases(files)
            lineage = load_lineage()
            dps_by_extraction = lineage.get("dps_by_extraction", {})

            results = []
            for citation in citations:
                entry = _resolve_citation_context_entry(
                    citation=str(citation or ""),
                    files_by_path=files_by_path,
                    extraction_aliases=extraction_aliases,
                    source_id_aliases=source_id_aliases,
                    source_aliases=source_aliases,
                    extraction_candidates=extraction_candidates,
                    dps_by_extraction=dps_by_extraction,
                    weekly_aliases=weekly_aliases,
                )
                if context_path:
                    entry["context_path"] = context_path
                results.append(entry)

            return _json_response(self, 200, {"results": results})

        if parsed.path == "/api/reindex":
            index = build_index()
            return _json_response(self, 200, {"status": "ok", "total": index.get("total_files", 0)})

        return _json_response(self, 404, {"error": "Not found"})

    def log_message(self, format, *args):
        return


def run_server(host: str = "127.0.0.1", port: int = 5179):
    server = ThreadingHTTPServer((host, port), CRISHandler)
    print(f"CRIS PoC server running at http://{host}:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    host = "127.0.0.1"
    port = 5179
    if len(sys.argv) >= 2:
        host = sys.argv[1]
    if len(sys.argv) >= 3:
        port = int(sys.argv[2])
    run_server(host, port)
