# CRIS Implementation Guide: From Local to Online

**Date:** 2026-02-22
**For:** Maicol (citizen developer, implementing with AI assistance)
**Purpose:** Step-by-step guide with exact prompts, files to provide, and decisions to make at each stage

---

## How to Use This Document

Each stage below includes:
- **What you're building** (plain language)
- **Decisions you need to make first** (things the AI can't decide for you)
- **Files to provide** (what to share with Claude/Codex at the start of each session)
- **The prompt** (copy-paste ready, with blanks for your decisions)
- **What "done" looks like** (how to know the stage is complete)
- **Estimated effort** (rough hours with AI assistance)

---

## Before You Start: Key Decisions

These decisions affect everything downstream. Make them before Stage 1.

### Decision 1: Hosting Platform

You need a platform that can run a Python server, serve static files, and host a PostgreSQL database. All three of these work well for citizen developers:

| Platform | Strengths | Rough Cost | Best If... |
|----------|-----------|-----------|------------|
| **Railway** | Simplest deploy, built-in Postgres, good free tier | ~$5-20/mo | You want the easiest path |
| **Render** | Good docs, free Postgres (90 days), auto-deploy from Git | ~$7-25/mo | You want clear documentation |
| **Supabase + Vercel** | Supabase gives you Postgres + auth + vector search built in; Vercel hosts the frontend | ~$0-25/mo | You want vector search with minimal setup |

**Recommendation for your case:** Supabase + Vercel. Supabase gives you managed Postgres with the pgvector extension already available, built-in auth (for the curator vs. reader split), and a nice dashboard for inspecting your data. Vercel handles the frontend. This avoids you having to manage database infrastructure yourself.

### Decision 2: Domain Name

Do you want a custom domain (like `cris.superbydesign.com`) or are you fine with a platform subdomain (`cris-research.vercel.app`) to start? You can always add a custom domain later, but it's easier to set up from the beginning.

### Decision 3: Authentication Approach

For the curator vs. reader split, you need some form of login. Options:
- **Simple password:** One shared password for curator access, everything else is public reader view
- **Supabase Auth:** Email/password login, easy to set up, supports invite-only curator access
- **OAuth:** Login with Google/GitHub (more complex, probably overkill for now)

**Recommendation:** Start with Supabase Auth. It's built into the platform and gives you a real auth system without complexity.

### Decision 4: Source Code Repository

You need your code in a Git repository for deployment. If you don't already have one:
- Create a GitHub account (if you don't have one)
- Create a private repository for the CRIS site code

---

## Stage 1: Deploy the Current Site Online

### What You're Building

Take the existing CRIS site (the Python server + vanilla JS frontend in `poc/`) and deploy it to the internet. No database yet. No new features. Just the same site, accessible via a URL.

### Why This Comes First

- You get a working URL immediately (shareable, testable)
- You learn the deployment pipeline with low risk (nothing has changed)
- Every subsequent stage deploys the same way (you only learn this once)
- If anything breaks, you know it's a deployment issue, not a data issue

### Decisions Needed

- Which hosting platform (see Decision 1 above)
- Domain name (see Decision 2 above)

### Files to Provide to Claude/Codex

```
poc/server.py          -- The Python backend
poc/public/app.js      -- The frontend application
poc/public/index.html  -- The HTML skeleton
poc/public/styles/     -- All CSS files
CLAUDE.md              -- System architecture context
```

Also provide: your hosting platform choice and whether you have a GitHub repo set up.

### The Prompt

```
I have a local CRIS research site that I want to deploy online. Here's the current architecture:

- Backend: Python HTTP server (server.py, ~1,770 lines) that indexes markdown files on startup and serves JSON APIs
- Frontend: Vanilla JS SPA (app.js, ~5,754 lines) with HTML and CSS
- Data: ~498 markdown files in a directory structure that the server indexes

The site currently runs locally at http://127.0.0.1:5179/

I want to deploy this to [Railway / Render / Vercel+Supabase] with minimal changes to the existing code. The goal is to get the exact same site running at a public URL.

Please start in plan mode. I need you to:
1. Review the server.py and app.js to understand the current architecture
2. Identify what needs to change for deployment (environment variables, file paths, port binding, static file serving)
3. Create a deployment configuration (Dockerfile or platform-specific config)
4. Set up the deployment pipeline

I am a citizen developer working with AI assistance. Please explain each step clearly.

[Attach: server.py, app.js, index.html, CLAUDE.md]
```

### What "Done" Looks Like

- The site loads at a public URL
- All four views work (Pulse, Ideas, Talking Points, Explore)
- The Sync button works (or is disabled for the deployed version)
- File count shows 498 files
- Citation tracing works in the Explore view

### Estimated Effort

4-8 hours with AI assistance (most time spent on debugging deployment issues)

### Potential Complications

- **Large file set:** 498 markdown files need to be included in the deployment. Some platforms have file size limits. You may need to use a persistent volume or object storage.
- **Server startup time:** The indexing step on startup might be slow. You may need to pre-build the index and include the cache file.
- **Environment differences:** The server may use hardcoded paths that need to become environment variables.

---

## Stage 2: Set Up the Database and Migrate Data

### What You're Building

A PostgreSQL database populated with all your existing CRIS data. The site still reads from markdown files at this point -- the database is being filled in the background. This stage is about getting the data right before you switch over.

### Why This Order

- You can validate the database against the live site (compare API responses)
- If the migration script has bugs, the site keeps working from markdown
- You can iterate on the migration script without downtime

### Decisions Needed

- Confirm Supabase (or your chosen platform) for database hosting
- Decide on embedding model for vector search (can defer to Stage 4, but good to pick now)

### Files to Provide to Claude/Codex

```
CRIS_Database_Schema_Migration.md    -- Original schema document
CRIS_Schema_Amendments_v2.md         -- Updated schema with your requirements
CLAUDE.md                            -- System architecture context
poc/server.py                        -- Current parsing logic (the AI needs to see how markdown is currently parsed)

-- Example data files (one of each type):
02_Extractions/[any extraction file].md
06_Current_Understanding/Active_Ideas.md
06_Current_Understanding/Current_Synthesis.md
09_Deliverables/Talking_Points/[any TP file].md
03_Weekly_Learnings/[any WL file].md
09_Deliverables/Language_Assets/Language_Asset_Library.md
Tags.md
_System/Data_Point_Normalization.md
_System/Citation_Contract.md
```

### The Prompt

```
I'm migrating my CRIS research system from markdown files to a PostgreSQL database hosted on Supabase. I have two schema documents that describe the target database design.

Please start in plan mode. Here's what I need:

**Phase 2A: Create the database schema**
- Read both schema documents (the original and the amendments v2)
- Generate the complete SQL migration script that creates all tables, indexes, and constraints
- The amendments document takes priority where the two conflict
- Include the pgvector extension setup for future vector search

**Phase 2B: Write the data migration scripts**
- Read server.py to understand how markdown files are currently parsed
- Read the example data files to understand the actual markdown format
- Write Python migration scripts that:
  1. Parse each source file in 01_Raw_Inputs/ and populate the SOURCES table (including storing the full text)
  2. Parse each extraction file in 02_Extractions/ and populate DATA_POINTS (with structured location fields)
  3. Parse Tags.md and populate the TAGS table, then link tags to data points
  4. Parse Active_Ideas.md and populate IDEAS and all related tables
  5. Parse Current_Synthesis.md and populate CURRENT_SYNTHESIS
  6. Parse talking point files and populate TALKING_POINTS and related tables
  7. Parse weekly learning files and populate WEEKLY_LEARNINGS
  8. Parse Language_Asset_Library.md and populate LANGUAGE_ASSETS
  9. Build the universal CITATIONS table by parsing all citation metadata comments (<!-- cite:path=...;dp=... -->)
  10. Run validation: count records in each table and compare against expected counts

**Important parsing context:**
- The current server.py already has working parsers for all of these formats
- Citation format in markdown: [SourceName DP1, DP2] with metadata in <!-- cite:path=...;dp=... --> HTML comments
- Data points in extractions follow the pattern: **DP1:** claim text, with **Anchor:**, **Citation:**, and **Tags:** on subsequent lines
- The file naming convention is: SourceName_DescriptiveSlug_YYYY-MM-DD.md (exactly 2 underscores before date)

I am a citizen developer. Please make the migration scripts robust with clear error handling and progress logging so I can see what's happening.

[Attach: both schema docs, CLAUDE.md, server.py, example files listed above]
```

### What "Done" Looks Like

- All tables created in Supabase with correct schema
- Migration scripts run without errors
- Validation report shows:
  - ~140 sources loaded
  - ~2,350+ data points loaded
  - ~148 extraction files tracked
  - 18 ideas with evidence tables populated
  - 5 talking points with audiences and evidence
  - 8 weekly learnings
  - All tags linked
  - Citation count matches expected (check against current site's citation counts)
- You can query the database in Supabase dashboard and see your data

### Estimated Effort

8-16 hours with AI assistance (the parsing and validation is the most time-consuming part)

### Potential Complications

- **Parsing edge cases:** Your markdown may have inconsistencies that break the parser. The existing server.py handles these with fallbacks -- make sure the migration scripts do too.
- **Citation resolution:** Some citations in the current system resolve to "ambiguous" or "unresolved." The migration script needs to handle these gracefully (flag them, don't skip them).
- **Duplicate detection:** Some data points or sources might have slight variations. The migration script should warn about near-duplicates rather than failing.

---

## Stage 3: Switch the Site to Read from the Database

### What You're Building

Rewriting the API layer (server.py) to query PostgreSQL instead of indexing markdown files. The frontend stays the same -- it still calls the same endpoints, they just return data from the database now.

### Why This Approach

- The frontend doesn't change, so you're only debugging one thing at a time
- You can A/B test: run both backends and compare responses
- If something is wrong, you switch back to the markdown backend in minutes

### Files to Provide to Claude/Codex

```
poc/server.py                        -- Current API implementation (to match endpoint signatures)
poc/public/app.js                    -- Frontend (to understand what the API needs to return)
CRIS_Schema_Amendments_v2.md         -- Database schema (so the AI knows the table structure)
```

### The Prompt

```
I've migrated my CRIS data into a PostgreSQL database on Supabase. Now I need to rewrite the backend API to read from the database instead of indexing markdown files.

Please start in plan mode.

**Current state:**
- server.py is a Python HTTP server that builds an in-memory index of markdown files on startup
- It serves these API endpoints: /api/index, /api/activity, /api/file, /api/citation-context, /api/lineage, /api/reindex
- The frontend (app.js) calls these endpoints and expects specific response shapes

**Target state:**
- A new Python API server (FastAPI or similar) that queries PostgreSQL via Supabase
- Same endpoint signatures and response shapes so the frontend works without changes
- Add connection pooling and basic caching for frequently-accessed queries

**Requirements:**
1. Map each existing endpoint to equivalent SQL queries
2. Maintain the exact same JSON response format for each endpoint (the frontend depends on these)
3. The /api/reindex endpoint should trigger a re-parse of any new markdown files and insert them into the database
4. Add a health check endpoint
5. Handle the dual-audience model: default to "reader" access level, with a way to switch to "curator" (we'll add auth later)

Please review server.py to understand each endpoint's response shape, then design the new API layer.

[Attach: server.py, app.js, CRIS_Schema_Amendments_v2.md]
```

### What "Done" Looks Like

- All four views load correctly from the database-backed API
- Pulse view shows Current Position, Key Takeaways with citation counts
- Ideas view shows all 18 ideas with evidence tables and counterarguments
- Talking Points view shows all TPs with audiences and evidence
- Explore view shows file browser, search, and document preview
- Citation tracing works (clicking "View Sources" shows the right data points)
- Performance is equal to or better than the markdown-backed version

### Estimated Effort

12-20 hours with AI assistance (this is the most complex stage)

### Potential Complications

- **Response shape mismatches:** The frontend parses API responses in specific ways. Even small differences in field names or nesting will break things. Test each view carefully.
- **Pagination:** The current API doesn't paginate (it loads everything). The database version should add pagination, but the first version should match the current behavior.
- **Lineage queries:** The lineage/citation-context endpoints are the most complex. These involve multi-table joins and may need optimization.

---

## Stage 4: Build New Capabilities

### What You're Building

The features that motivated the migration: vector search, curator notes, universal citations, linguistic asset traceability, and the verification deep-linking experience.

### Suggested Order (each is a separate AI session)

#### 4A: Curator Notes

**Why first:** Simplest new feature, high personal value, and it teaches you the pattern of "add a feature to the database-backed site."

**Prompt:**
```
I want to add curator notes to my CRIS research site. The database already has a CURATOR_NOTES table (see schema). I need:

1. An API endpoint to create a note (POST /api/curator-notes)
2. An API endpoint to list notes for an entity (GET /api/curator-notes?entity_type=source&entity_id=...)
3. A small UI component in the Explore view that shows a "Add Note" button when viewing a source or data point, and displays existing notes below the content

Notes are immutable (no edit, no delete). They have a note_type: 'upload_reaction', 'extraction_note', 'synthesis_reflection', 'verification_note', 'general'.

[Attach: current app.js, CRIS_Schema_Amendments_v2.md (Amendment 4 section)]
```

**Estimated effort:** 4-6 hours

#### 4B: Universal Citations

**Why second:** This strengthens the existing citation system and makes everything traceable.

**Prompt:**
```
I want to implement universal citations across my CRIS site. The database has a CITATIONS table that can link any entity to any data point. I need:

1. A migration script that reads all existing citation metadata comments (<!-- cite:path=...;dp=... -->) from ideas, talking points, weekly learnings, and synthesis, and populates the CITATIONS table
2. Update the API endpoints to return citation data from the CITATIONS table instead of parsing markdown
3. Update the "View Sources" panel to show citations from the database
4. Add citation counts to talking points (they currently don't have them)
5. A curator UI to manually add/verify citations

[Attach: current server.py (citation parsing sections), app.js, CRIS_Schema_Amendments_v2.md (Amendment 3)]
```

**Estimated effort:** 8-12 hours

#### 4C: Vector Search

**Why third:** This is the biggest capability addition and builds on the stable database.

**Prompt:**
```
I want to add semantic search to my CRIS research site using pgvector on Supabase. I need:

1. Enable the pgvector extension in my Supabase database
2. A script to generate embeddings for all existing data points, ideas, and source chunks using [OpenAI/chosen embedding model]
3. A chunking strategy for full source texts (break into ~500 token passages with overlap)
4. A search API endpoint (POST /api/search) that takes a natural language query, converts it to an embedding, and returns the most relevant data points, ideas, and source chunks with similarity scores
5. Two search modes:
   - "reader" mode: searches data points and ideas only
   - "curator" mode: searches everything including source chunks and curator notes
6. A search UI: a search bar accessible from all views, results displayed as cards with source attribution

The database schema for source_chunks and embedding columns is in the amendments document (Amendment 6).

Important context: I want to use this for meeting prep -- I should be able to paste in context about a potential client and get back relevant insights from my knowledge base.

[Attach: CRIS_Schema_Amendments_v2.md (Amendment 6), current app.js]
```

**Estimated effort:** 12-20 hours

#### 4D: Verification Deep-Linking

**Why fourth:** Builds on vector search (uses source chunks) and curator notes.

**Prompt:**
```
I want to add a verification experience to my CRIS site. When I'm in curator mode viewing a data point, I want to click a "Verify in Source" button that takes me directly to the relevant passage in the original source document.

The data points have structured location fields (location_type, location_start, location_end, location_char_offset) and the sources table has full_text stored.

I need:
1. A source viewer component that renders the full text of a source with the relevant passage highlighted
2. The viewer should scroll to and highlight the anchor_quote within the full text
3. Navigation from any data point to this viewer
4. If the location_char_offset is populated, use it for precise highlighting. Otherwise, fall back to text search for the anchor_quote within the full_text.

This is curator-only -- readers never see the full source text.

[Attach: CRIS_Schema_Amendments_v2.md (Amendments 2 and 7), current app.js]
```

**Estimated effort:** 8-12 hours

#### 4E: Authentication and Dual Audience

**Why last:** Everything else works for you as curator first. Auth adds the reader layer on top.

**Prompt:**
```
I want to add authentication to my CRIS site using Supabase Auth to support two access levels: reader (public) and curator (me).

Requirements:
1. Readers see the site without logging in. They can view data points, ideas, talking points, and search -- but never see full source text, curator notes, or source chunks.
2. Curator access requires login. When logged in, I see everything: full source text, curator notes, verification deep-links, and full-depth search.
3. Use Supabase Auth with email/password. I'm the only curator, so no need for role management -- just "logged in = curator, not logged in = reader."
4. Add a small "Curator Login" link in the site footer.
5. The API should check the auth token and adjust response depth accordingly (per Amendment 7 in the schema doc).

[Attach: CRIS_Schema_Amendments_v2.md (Amendment 7), current API code, app.js]
```

**Estimated effort:** 6-10 hours

---

## Stage 5: Retire the Markdown Backend

### What You're Building

Nothing new. You're removing the old system and confirming everything works from the database.

### The Prompt

```
The CRIS site is now fully running on the database. I want to:

1. Remove all markdown-file-indexing code from the server
2. Archive the markdown files (keep them in a backup, but the site no longer reads them)
3. Update the /api/reindex endpoint to work with the database (re-sync from source files if needed, or remove it entirely)
4. Clean up any dead code in app.js that referenced the old file-based system
5. Run a final validation: compare every API endpoint's response against the archived responses from the markdown version

[Attach: current server code, app.js]
```

### Estimated Effort

4-6 hours

---

## Summary: Total Estimated Effort

| Stage | What | Hours (with AI) |
|-------|------|-----------------|
| 1 | Deploy current site online | 4-8 |
| 2 | Database setup + data migration | 8-16 |
| 3 | Switch API to database | 12-20 |
| 4A | Curator notes | 4-6 |
| 4B | Universal citations | 8-12 |
| 4C | Vector search | 12-20 |
| 4D | Verification deep-linking | 8-12 |
| 4E | Authentication + dual audience | 6-10 |
| 5 | Retire markdown backend | 4-6 |
| **Total** | | **66-110 hours** |

At ~10 hours/week of focused implementation time, this is roughly **7-11 weeks** of work.

You don't have to do all of it. **Stages 1-3 give you a working database-driven site.** Everything in Stage 4 is additive and can be done in any order (except 4E depends on 4C being done first for the search scoping).

---

## Tips for Working with AI on This

### General Approach

1. **Always start in plan mode.** Ask the AI to review the files and propose an approach before writing code. This catches misunderstandings early.
2. **One stage per session.** Don't try to do everything at once. Each stage has a clear "done" state.
3. **Test as you go.** After each stage, manually verify that the site works before moving on.
4. **Save working states.** After each successful stage, commit your code to Git. This gives you a rollback point.

### When Things Go Wrong

- **"The site loads but data is missing"** -- Check the migration validation counts. Something didn't parse correctly. Look at the error logs from the migration script.
- **"The frontend shows errors"** -- The API response shape probably changed. Compare the old and new API responses for the failing endpoint.
- **"The database query is slow"** -- Check if the relevant index exists. Most performance issues in this system will be missing indexes.
- **"Citations aren't resolving"** -- The citation parsing is the most complex part. Check the CITATIONS table for entries with low confidence scores or "unresolved" status.

### What to Keep in Your Git Repository

```
cris-site/
├── api/                    # Backend API code
│   ├── server.py           # (or main.py if using FastAPI)
│   ├── requirements.txt
│   └── migrations/         # SQL migration scripts
├── public/                 # Frontend (from poc/public/)
│   ├── app.js
│   ├── index.html
│   └── styles/
├── scripts/
│   ├── migrate_data.py     # Data migration scripts
│   └── generate_embeddings.py
├── docs/                   # Your schema docs
│   ├── CRIS_Database_Schema_Migration.md
│   ├── CRIS_Schema_Amendments_v2.md
│   └── CRIS_Implementation_Guide.md
├── .env.example            # Environment variables template (never commit .env itself)
├── Dockerfile              # (if using container deployment)
└── README.md
```

### Environment Variables You'll Need

```
DATABASE_URL=postgresql://...        # Supabase connection string
SUPABASE_URL=https://...             # Supabase project URL
SUPABASE_ANON_KEY=...                # Supabase anonymous key (for reader access)
SUPABASE_SERVICE_KEY=...             # Supabase service key (for server-side operations)
OPENAI_API_KEY=...                   # For generating embeddings (Stage 4C)
PORT=5179                            # Server port
ENVIRONMENT=production               # 'development' or 'production'
```

---

## Decision Checkpoint

Before you start Stage 1, confirm these decisions:

- [ ] Hosting platform chosen (recommendation: Supabase + Vercel)
- [ ] GitHub repository created
- [ ] Domain name decided (or using platform default)
- [ ] Auth approach chosen (recommendation: Supabase Auth)
- [ ] Embedding model chosen for future vector search (recommendation: OpenAI text-embedding-3-small, can defer)

Once these are decided, you're ready to copy the Stage 1 prompt and start building.
