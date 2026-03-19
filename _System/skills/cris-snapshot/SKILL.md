---
name: cris-snapshot
description: Generate a shareable, self-contained HTML snapshot of the CRIS frontend that anyone can open in a browser with no server or installation required. Use this skill whenever the user wants to share CRIS content, export a snapshot, create a shareable version, send CRIS to someone, or generate a read-only view of the current research state. Triggers on phrases like "generate a snapshot", "share CRIS", "create a shareable file", "export CRIS", "make a snapshot", or any mention of sharing or distributing the current CRIS content.
---

# CRIS Snapshot

Generates a single self-contained HTML file from the live CRIS research system. Recipients open it in any browser — no Python, no server, no installation needed.

## What the snapshot includes

- **Pulse view** — Current synthesis, takeaways, trends, and key findings
- **Ideas view** — Active research positions with evidence
- **Talking Points view** — Latest talking points document
- **Citations** — Pre-resolved and working (linked to source extraction files)
- **Fonts and styles** — Fully embedded, no internet required for layout

## What it omits

- **Explore view** — Requires live file system access (replaced with a polite notice)
- **Citation lineage traces** — Requires live server
- **Sync button** — Disabled in snapshot mode

---

## How to run

This is a one-command operation. No phases, no decisions needed.

```bash
cd /path/to/CRIS_Research_System/poc/
python3 generate_snapshot.py
```

The output file lands at:
```
CRIS_Research_System/CRIS_Snapshot_YYYY-MM-DD.html
```

### Steps

1. Confirm the `poc/generate_snapshot.py` script exists at `CRIS_Research_System/poc/generate_snapshot.py`
2. Run the command above (using the actual absolute path to the `poc/` directory)
3. Wait for the confirmation line: `✓ Snapshot generated!`
4. Present the output `.html` file to the user using `present_files`

That's it. The script handles everything — indexing, citation resolution, font embedding, and HTML assembly.

---

## Output summary (for your reference)

When the script finishes, it prints a summary like:

```
495 files indexed.
4 key files pre-baked.
817 citations resolved — 734 linked, 83 unresolved.
94 total files pre-baked (key + extractions).
✓ Snapshot generated!
  File: .../CRIS_Snapshot_2026-02-24.html
  Size: 5.3 MB
```

Report these numbers to the user so they know the snapshot is fresh and complete.

---

## Sharing instructions (tell the user)

> The snapshot is a single `.html` file. Share it as an email attachment or via any file-sharing link. Recipients open it directly in Chrome, Safari, Firefox, or Edge — no setup required. The banner at the top confirms the snapshot date and read-only status.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `ModuleNotFoundError: server` | Script run from wrong directory | `cd` into `poc/` first, or use the absolute path |
| Citations show as unresolved | Running an old cached `.html` | Confirm the file is the newly generated one (check file size and date) |
| Fonts look wrong | Google Fonts CDN blocked (offline) | Layout still works; local Uncut Sans fonts are embedded as fallback |
