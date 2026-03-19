#!/usr/bin/env python3
"""
CRIS Status Script
Scans the research system and outputs a formatted status report.

Usage: python3 status.py [cris_root_path]
"""

import os
import sys
from datetime import datetime
from pathlib import Path
import re

def get_cris_root():
    """Get CRIS root path from argument or try common locations."""
    if len(sys.argv) > 1:
        return Path(sys.argv[1])

    # Try common locations
    candidates = [
        Path.cwd() / "CRIS_Research_System",
        Path.home() / "CRIS_Research_System",
        Path("/sessions") / os.environ.get("SESSION_NAME", "") / "mnt" / "CRIS_Research_System"
    ]

    for candidate in candidates:
        if candidate.exists():
            return candidate

    print("Error: Could not find CRIS_Research_System folder")
    print("Usage: python3 status.py /path/to/CRIS_Research_System")
    sys.exit(1)

def count_files(folder: Path, extensions: list = None) -> int:
    """Count files in folder, optionally filtering by extension."""
    if not folder.exists():
        return 0

    count = 0
    for item in folder.rglob("*"):
        if item.is_file() and not item.name.startswith("."):
            if extensions is None or item.suffix.lower() in extensions:
                count += 1
    return count

def get_latest_file(folder: Path, pattern: str = "*") -> tuple:
    """Get the most recently modified file matching pattern."""
    if not folder.exists():
        return None, None

    latest = None
    latest_time = None

    for item in folder.rglob(pattern):
        if item.is_file() and not item.name.startswith("."):
            mtime = item.stat().st_mtime
            if latest_time is None or mtime > latest_time:
                latest = item
                latest_time = mtime

    if latest_time:
        return latest.name, datetime.fromtimestamp(latest_time)
    return None, None

def count_ideas(active_ideas_path: Path) -> dict:
    """Count ideas and their statuses from Active_Ideas.md."""
    result = {"total": 0, "developing": 0, "ready": 0, "revisiting": 0}

    if not active_ideas_path.exists():
        return result

    content = active_ideas_path.read_text()

    # Count idea headers (## followed by idea name)
    ideas = re.findall(r'^## (?!Evolution|Open|Supporting|Current|Drivers)', content, re.MULTILINE)
    result["total"] = len(ideas)

    # Count by status
    result["developing"] = len(re.findall(r'\*\*Status:\*\*.*Developing', content, re.IGNORECASE))
    result["ready"] = len(re.findall(r'\*\*Status:\*\*.*Ready to Share', content, re.IGNORECASE))
    result["revisiting"] = len(re.findall(r'\*\*Status:\*\*.*Needs Revisiting', content, re.IGNORECASE))

    return result

def count_tags(tags_path: Path) -> dict:
    """Count tags from Tags.md."""
    result = {"total": 0, "established": 0, "emerging": 0}

    if not tags_path.exists():
        return result

    content = tags_path.read_text()

    # Count tags (lines starting with #tag or - #tag)
    tags = re.findall(r'#[a-z][a-z0-9-]+', content)
    result["total"] = len(set(tags))  # Unique tags

    # Try to identify established vs emerging based on section headers
    if "## Established" in content and "## Emerging" in content:
        parts = content.split("## Emerging")
        established_section = parts[0] if len(parts) > 0 else ""
        emerging_section = parts[1] if len(parts) > 1 else ""

        result["established"] = len(set(re.findall(r'#[a-z][a-z0-9-]+', established_section)))
        result["emerging"] = len(set(re.findall(r'#[a-z][a-z0-9-]+', emerging_section)))

    return result

def get_current_month_folder():
    """Get the current month's folder name (YYYY-MM format)."""
    return datetime.now().strftime("%Y-%m")

def suggest_action(raw_count: int, extracted_count: int, last_weekly: datetime) -> str:
    """Suggest next action based on system state."""
    unextracted = raw_count - extracted_count

    if unextracted > 5:
        return f"Extract {unextracted} pending files"

    if last_weekly:
        days_since = (datetime.now() - last_weekly).days
        if days_since >= 7:
            return "Create Weekly Learnings (7+ days since last)"
    else:
        return "Create first Weekly Learnings"

    if unextracted > 0:
        return f"Extract {unextracted} pending files"

    return "Add new sources to Raw_Inputs or explore Open Threads"

def main():
    root = get_cris_root()
    today = datetime.now()
    current_month = get_current_month_folder()

    # Paths
    raw_inputs = root / "01_Raw_Inputs" / current_month
    extractions = root / "02_Extractions" / current_month
    weekly_folder = root / "03_Weekly_Learnings"
    active_ideas = root / "06_Current_Understanding" / "Active_Ideas.md"
    tags_file = root / "Tags.md"

    # Counts
    raw_count = count_files(raw_inputs, [".pdf", ".md", ".txt", ".html"])
    extraction_count = count_files(extractions, [".md"])
    unextracted = max(0, raw_count - extraction_count)

    # Latest files
    last_extraction_name, last_extraction_date = get_latest_file(extractions, "*.md")
    last_weekly_name, last_weekly_date = get_latest_file(weekly_folder, "*.md")

    # Ideas and tags
    ideas = count_ideas(active_ideas)
    tags = count_tags(tags_file)

    # Suggested action
    suggestion = suggest_action(raw_count, extraction_count, last_weekly_date)

    # Format output
    print(f"""
📊 CRIS Status — {today.strftime("%B %d, %Y")}

📥 Raw Inputs ({current_month}): {raw_count} files
   └─ {unextracted} unextracted (need processing)

📝 Extractions ({current_month}): {extraction_count} files
   └─ Last: {last_extraction_name or 'None'} ({last_extraction_date.strftime('%b %d') if last_extraction_date else 'N/A'})

📚 Weekly Learnings: {count_files(weekly_folder, ['.md'])} total
   └─ Last: {last_weekly_name or 'None'} ({last_weekly_date.strftime('%b %d') if last_weekly_date else 'N/A'})

💡 Active Ideas: {ideas['total']} ideas
   └─ {ideas['developing']} developing, {ideas['ready']} ready to share

🏷️ Tags: {tags['total']} total
   └─ {tags['established']} established, {tags['emerging']} emerging

⚡ Suggested action: {suggestion}
""")

if __name__ == "__main__":
    main()
