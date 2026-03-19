# CRIS Folder Structure

```
📂 CRIS_Research_System/
│
├── 📂 _System/                    ← System documentation
│   ├── 📂 Workflows/              ← Workflow-specific guides
│   ├── 📂 cris/                   ← CRIS skill (installed copy)
│   ├── Overview.md
│   ├── Folder_Structure.md        ← You're here
│   ├── Style_Guide.md             ← Tone of voice, punctuation, formatting
│   ├── Data_Point_Normalization.md ← Metric normalization strategy
│   ├── Citation_Contract.md
│   ├── Idea_Lifecycle.md
│   ├── Starter_Prompts.md
│   └── Verification_Guide.md
│
├── 📂 01_Raw_Inputs/
│   └── 📂 YYYY-MM/
│       └── 📂 YYYY-MM-DD_to_DD/   ← Date-range subfolders
│
├── 📂 02_Extractions/
│   ├── 📄 _Extraction_Index.md    ← HEADER: Quick ref to all extractions
│   └── 📂 YYYY-MM/                ← Organized by month processed
│
├── 📂 03_Weekly_Learnings/
│   ├── 📄 _Weekly_Header.md       ← HEADER: Recent context, open threads
│   └── 📂 YYYY-QN/                ← Organized by quarter
│       ├── 📄 WL_YYYY-MM-DD.md    ← Active (dated by production date)
│       └── 📂 archive/            ← Superseded weekly learnings
│
├── 📂 04_Monthly_Synthesis/
│   └── 📂 YYYY/
│
├── 📂 05_Quarterly_Synthesis/
│
├── 📂 06_Current_Understanding/
│   ├── _Index.md                  ← HEADER: Idea status, counts
│   ├── Current_Synthesis.md       ← Cumulative position statement (one active version)
│   ├── Active_Ideas.md            ← Living ideas document (one active version)
│   ├── User_Observations.md       ← Personal insights (accumulates, rarely archived)
│   ├── Stable_Ideas.md            ← Created at month 3+
│   ├── Dormant_Ideas.md           ← Created at month 3+
│   └── 📂 archive/               ← Dated snapshots (Current Synthesis, Active Ideas)
│
├── 📂 07_Archive/
│
├── 📂 08_Templates/
│
├── 📂 09_Deliverables/
│   └── 📂 Talking_Points/
│       ├── 📄 TP_YYYY-MM-DD.md    ← Active (dated by production date)
│       └── 📂 archive/            ← Superseded talking points
│
├── 📄 Tags.md
└── 📄 Research_System_Architecture.md  ← Legacy reference (full detail)
```

## Progressive Disclosure Index Files

**Principle:** Load lightweight headers first; drill into detail only when needed.

| Index File | Location | Purpose | Update Frequency |
|------------|----------|---------|------------------|
| `_Extraction_Index.md` | `02_Extractions/` | Quick ref to all extractions with DP counts, key topics | After each extraction |
| `_Weekly_Header.md` | `03_Weekly_Learnings/` | Recent weeks, open threads, active ideas summary | After each weekly synthesis |
| `_Index.md` | `06_Current_Understanding/` | Idea status, counts, last updated | After idea changes |

**Loading pattern:**
1. Always load relevant header file(s) first
2. Identify which detail files are needed
3. Load only those specific files

## Folder Purposes

| Folder | Contents | Retention |
|--------|----------|-----------|
| 01_Raw_Inputs | Original PDFs, transcripts, articles | Permanent |
| 02_Extractions | Per-document markdown extractions | Permanent |
| 03_Weekly_Learnings | Weekly synthesis documents | Permanent |
| 04_Monthly_Synthesis | Monthly rollup narratives | Permanent |
| 05_Quarterly_Synthesis | Quarterly reflections | Permanent |
| 06_Current_Understanding | Living position documents + Current Synthesis | Active working files |
| 06_Current_Understanding/archive | Dated snapshots of previous Current Synthesis versions | Permanent |
| 07_Archive | Timestamped snapshots of significant shifts | Permanent |
| 08_Templates | Document templates | Reference files |
| 09_Deliverables | Talking points, briefs, pitch materials | Permanent |

## Weekly Subfolder Convention

Within `01_Raw_Inputs/YYYY-MM/`, use date-range subfolders:

- `YYYY-MM-01_to_07/` — Days 1-7 of month
- `YYYY-MM-08_to_14/` — Days 8-14
- `YYYY-MM-15_to_21/` — Days 15-21
- `YYYY-MM-22_to_28/` — Days 22-28
- `YYYY-MM-29_to_31/` — Days 29-31 (if applicable)

**Cross-month weeks:** If a week spans two months, use the start date's month. Example: A week spanning Jan 29 - Feb 4 would be `2026-01/2026-01-29_to_04/`.

This keeps monthly folders navigable while preserving temporal organization.

## File Naming Convention

**Core rule: Date by production, not by coverage period.**

| File Type | Format | Date Meaning |
|-----------|--------|-------------|
| Weekly Learnings | `WL_YYYY-MM-DD.md` | Date synthesis was written |
| Talking Points | `TP_YYYY-MM-DD.md` | Date talking points were produced |
| Extractions | `[Source_Name]_YYYY-MM-DD.md` | Date extraction was processed |
| Current Synthesis | `Current_Synthesis.md` | No date in filename (one active) |
| Active Ideas | `Active_Ideas.md` | No date in filename (one active) |
| Archives | `[Original_Name]_YYYY-MM-DD.md` | Last Updated date from inside the archived doc |

Coverage periods live inside the document header, not in the filename.

**No version suffixes** — use archive folders instead of `_v2`, `_v3` suffixes.

See `_System/Workflows/Versioning_and_File_Management.md` for the full update workflow.

## Extraction File Naming

All extraction files must include a processing date:

`[Source_Name]_YYYY-MM-DD.md`

Examples:
- `McKinsey_AI_Report_2026-02-03.md`
- `a16z_Big_Ideas_Part_1_2026-02-03.md`
