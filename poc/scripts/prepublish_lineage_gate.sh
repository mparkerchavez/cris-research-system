#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="/Users/macbooksmacbookpromax/Downloads/CRIS_Research_System"
VALIDATOR="$REPO_ROOT/poc/scripts/validate_citation_contract.py"
REGRESSION="$REPO_ROOT/poc/scripts/regression_citation_parser.py"

if [[ ! -f "$VALIDATOR" ]]; then
  echo "ERROR: Missing validator: $VALIDATOR" >&2
  exit 1
fi
if [[ ! -f "$REGRESSION" ]]; then
  echo "ERROR: Missing regression script: $REGRESSION" >&2
  exit 1
fi

echo "CRIS prepublish lineage gate"
echo "============================"

echo "[1/3] Resolve current publish targets..."
LATEST_WL="$(find "$REPO_ROOT/03_Weekly_Learnings" -type f -name 'WL_*.md' ! -path '*/archive/*' | sort | tail -n 1)"
CURRENT_SYN="$REPO_ROOT/06_Current_Understanding/Current_Synthesis.md"
LATEST_TP="$(find "$REPO_ROOT/09_Deliverables/Talking_Points" -type f -name 'TP_*.md' ! -path '*/archive/*' | sort | tail -n 1)"

if [[ -z "${LATEST_WL:-}" || ! -f "$LATEST_WL" ]]; then
  echo "ERROR: Could not resolve latest Weekly Learnings file." >&2
  exit 1
fi
if [[ ! -f "$CURRENT_SYN" ]]; then
  echo "ERROR: Missing Current Synthesis file: $CURRENT_SYN" >&2
  exit 1
fi
if [[ -z "${LATEST_TP:-}" || ! -f "$LATEST_TP" ]]; then
  echo "ERROR: Could not resolve latest Talking Points file." >&2
  exit 1
fi

REL_WL="${LATEST_WL#$REPO_ROOT/}"
REL_SYN="${CURRENT_SYN#$REPO_ROOT/}"
REL_TP="${LATEST_TP#$REPO_ROOT/}"

echo "  - Weekly Learnings: $REL_WL"
echo "  - Current Synthesis: $REL_SYN"
echo "  - Talking Points: $REL_TP"

echo "[2/3] Validate citation contract for current publish targets..."
python3 "$VALIDATOR" --file "$REL_WL"
python3 "$VALIDATOR" --file "$REL_SYN"
python3 "$VALIDATOR" --file "$REL_TP"

echo "[3/3] Run citation parser regression checks..."
python3 "$REGRESSION"

echo "--------------------------------------------"
echo "PASS: Prepublish lineage gate completed with no blocking issues."
