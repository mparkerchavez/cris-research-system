# Frontend Parsing Analysis: Pulse Screen & Weekly Learnings Format

## Overview

This document analyzes how the Pulse screen frontend currently parses Weekly Learnings documents, identifies gaps introduced by the new rebuild format, and outlines what needs to be updated to support both current and future formats.

---

## Current Architecture

### Data Flow

```
Weekly Learnings .md file
    ↓
server.py (/api/file endpoint)
    ↓
app.js (parseWeeklyInsights function)
    ↓
Pulse Screen Render Functions:
  - renderPulsePosition (from Current Synthesis)
  - renderPulseTakeaways (from Current Synthesis)
  - renderPulseTrends (from Weekly Insights)
  - renderPulseWeeklyOpenThreads (from Weekly Insights)
  - renderPulseReflection (from Weekly Insights)
```

### Key Components

1. **File Selection**: `getLatestWeeklyFile()` (lines 3045-3068)
   - Filters for files in `03_Weekly_Learnings/`
   - Excludes `/archive/` files unless no non-archive files exist
   - Sorts by date in filename (WL_YYYY-MM-DD.md pattern)
   - Falls back to mtime if dates are equal

2. **Parsing**: `parseWeeklyInsights()` (lines 930-1189)
   - Extracts title, trends, openThreads, reflectionParagraphs
   - Uses H2 section headers to identify content blocks
   - Parses H3 tags as trend tags (#tag-name)

3. **Synthesis Parsing**: `parseCurrentSynthesis()` (lines 661-930)
   - Extracts headline, lede, takeaways, active ideas snapshot
   - Provides "Position" content for Pulse screen

---

## Pulse Screen Content Mapping

### What Comes from Current Synthesis:
- **Position** (headline + lede from Summary section)
- **Key Takeaways** (bulleted list from Key Takeaways section)
- **Updated date** (Last Updated field)

### What Comes from Weekly Learnings:
- **Trends** (from "Synthesis by Tag" H2 section)
- **Open Threads** (from "Open Threads" H2 section)
- **Reflection** (from "Reflection" H2 section)

---

## parseWeeklyInsights() — Detailed Analysis

### Expected Document Structure

The parser expects this exact structure:

```markdown
# Weekly Learnings: [Title]

## Synthesis by Tag

### #tag1

[Paragraphs of content]
[Citation lines]

**What shifted:** [Text]
**What held steady:** [Text]

**Connection to Current Understanding:**
- Bullet point connection
- Another connection

### #tag2
[Same structure]

## Open Threads

1. **Thread Title** — Thread detail text
2. **Another Thread** — Detail

## Reflection

[Paragraphs of reflection text]
```

### Parsing Logic for Trends (Lines 1010-1164)

#### 1. Section Identification
```javascript
const trendLines = getSection("synthesis by tag");
```
- Uses `normalizeSectionKey()` to match section headers
- Normalizes: removes special chars, lowercases, collapses whitespace
- Will match "Synthesis by Tag", "synthesis-by-tag", etc.

#### 2. Trend Block Structure
For each `### #tag-name` heading, creates a trend object:

```javascript
{
  tag: "#tag-name",
  summary: "",                    // Auto-generated from first subtrend paragraph
  whatShiftedOrNew: "",           // From **What shifted:** or **What is new:**
  whatShiftedOrNewLabel: "",      // The label used ("What shifted" or "What is new")
  whatHeldSteady: "",             // From **What held steady:**
  connections: [],                // From **Connection to Current Understanding:**
  subtrends: []                   // Auto-generated from paragraph-citation groupings
}
```

#### 3. Subtrend Auto-Generation (Critical Logic)

**Key Insight**: The parser automatically creates "subtrends" by grouping:
1. One or more paragraphs
2. Followed by citation lines (lines matching `/^\[[^\]]+\]$/`)

```javascript
const ensureSubtrendForParagraph = () => {
  if (!activeSubtrend) return startSubtrend();
  // If current subtrend has both paragraphs AND citations, start a new one
  if (activeSubtrend.paragraphs.length && activeSubtrend.citations.length) {
    return startSubtrend();
  }
  return activeSubtrend;
};
```

**Subtrend structure**:
```javascript
{
  title: "",        // Auto-extracted from first sentence of first paragraph
  paragraphs: [],   // Array of paragraph text
  citations: []     // Array of citation strings with metadata
}
```

#### 4. Special Line Patterns Recognized

| Pattern | Purpose | Parsing Logic |
|---------|---------|---------------|
| `**What shifted:**` or `**What is new:**` | Change marker | Lines 1087-1094: Captures text after colon, stores label |
| `**What held steady:**` | Stability marker | Lines 1096-1102: Captures text after colon |
| `**Connection to Current Understanding:**` | Idea links | Lines 1104-1118: Enables bullet point parsing mode |
| `- Bullet point` or `* Bullet point` | Connection items | Lines 1111-1117: Only parsed when in connection mode |
| `[Source DP#, DP#]` | Citation line | Lines 1120-1129: Triggers paragraph flush, starts new citation |
| `<!-- cite:path=... -->` | Citation metadata | Lines 1077-1084: Appends to most recent citation |

#### 5. Title Auto-Generation for Subtrends (Lines 1136-1154)

```javascript
const firstParagraph = (subtrend.paragraphs || []).find(Boolean) || "";
let title = "";
if (firstParagraph) {
  // Try to extract first sentence (up to 120 chars)
  const sentenceMatch = firstParagraph.match(/^(.{1,120}?[.!?])(?:\s|$)/);
  title = (sentenceMatch ? sentenceMatch[1] : firstParagraph)
    .replace(/[.!?]+$/g, "")
    .trim();
  // Truncate if > 96 chars
  if (title.length > 96) {
    title = `${title.slice(0, 93).trimEnd()}...`;
  }
}
if (!title) title = `Subtrend ${index + 1}`;
```

### Parsing Logic for Open Threads (Lines 1166-1185)

Expects numbered list format:
```markdown
1. **Thread Title** — Thread detail
2. **Another Thread** — More detail
```

Regex patterns:
1. `^\d+\.\s+\*\*([^*]+)\*\*\s*[—-]\s*(.+)$` → title + detail
2. `^\d+\.\s+(.+)$` → fallback for simpler format

### Parsing Logic for Reflection (Line 1187)

Simple paragraph extraction:
```javascript
result.reflectionParagraphs = toParagraphs(getSection("reflection"));
```

Uses `toParagraphs()` helper (lines 977-997):
- Splits on blank lines
- Strips citation metadata comments
- Cleans markdown inline formatting
- Filters empty paragraphs

---

## Current Synthesis Parsing — What Pulse Needs

### parseCurrentSynthesis() (Lines 661-930)

The Pulse screen pulls from Current Synthesis:

#### Position Section (Lines 865-898)
```javascript
// From ## Summary section
result.headline = firstSentence;      // First sentence
result.lede = remainderOfFirstPara;   // Rest of first paragraph
result.summaryText = allParagraphs;   // Full summary text
result.summaryParagraphs = [];        // Remaining paragraphs
```

#### Takeaways Section (Lines 900-905)
```javascript
// From ## Key Takeaways section
result.takeaways = parseTakeawayLine(each bullet);
```

Each takeaway becomes:
```javascript
{
  title: "Leading bold or first sentence",
  detail: "Remaining text",
  fullText: "Complete text",
  citationRaw: "[Source DP#]",
  citations: ["Source DP#", "Another DP#"]
}
```

---

## Gaps Introduced by Rebuild Format

### Gap 1: Missing Explicit Change Markers

**Pre-Rebuild Format:**
```markdown
### #agentic-workflows

[Context paragraph from prior synthesis]

New this week: [Explicit delta]

**What shifted:** The Agent Teams reverse-engineering moved...

**Connection to Current Understanding:**
- Reinforces Idea 7
- Reinforces Idea 2
```

**Rebuild Format:**
```markdown
### #agentic-workflows

The fundamental nature of agentic AI is becoming clearer...
[Multiple comprehensive paragraphs]

[Next section separator]
```

**Impact:**
- ✅ Parser will still identify `#agentic-workflows` as a trend tag
- ✅ Parser will still auto-generate subtrends from paragraph-citation groupings
- ❌ **No `whatShiftedOrNew` content** (parser looks for `**What shifted:**` or `**What is new:**`)
- ❌ **No `whatHeldSteady` content** (parser looks for `**What held steady:**`)
- ❌ **No `connections` array** (parser looks for `**Connection to Current Understanding:**`)

**Frontend Display Impact:**
- Trends will appear but without change markers
- No explicit connections to Active Ideas shown
- Harder for user to see "what's new" vs. "what's comprehensive synthesis"

---

### Gap 2: Connection to Current Understanding Format

**Pre-Rebuild Format:**
```markdown
**Connection to Current Understanding:**
- Reinforces Idea 7 (Agent-Native Development Paradigm): productionized tooling confirms...
- Reinforces Idea 2 (Coordination Tax): Agent Teams architecture confirms...
```

**Rebuild Format:**
Connections are embedded in narrative prose, not structured bullets:
```markdown
**Connection to Current Understanding:**
- Reinforces Idea 7 (Agent-Native Development Paradigm): productionized tooling confirms the paradigm is operational, not aspirational
- Reinforces Idea 2 (Coordination Tax): Agent Teams architecture confirms coordination overhead is managed through bounded autonomy with human oversight
```

Wait, actually looking at the rebuild document more carefully:

**Actual Rebuild Format:**
There is NO "Connection to Current Understanding" section at all in the synthesis sections! Connections are mentioned in the "Updates Made to Current Understanding" section at the end:

```markdown
## Updates Made to Current Understanding

### Ideas Modified

**Idea 1 (Tool-Coworker Duality Thesis):** Confirmed and expanded...

**Idea 2 (Coordination Tax & Autonomy Paradox):** Strengthened with Agent Teams...
```

**Impact:**
- ❌ **No per-tag connections parsed** (connections are in separate section)
- ❌ **Parser cannot link specific trends to specific ideas** (metadata not in trend sections)
- Frontend cannot show "this trend reinforces Idea X" for each tag

---

### Gap 3: Open Threads Format Change

**Pre-Rebuild Format:**
```markdown
## Open Threads

1. **Shadow IT governance for autonomous agents** — VentureBeat documents...
2. **Bot-to-bot negotiation and decentralized coordination** — Steinberger describes...
```

**Rebuild Format:**
```markdown
## Open Threads

1. **Measurement Framework Emergence (Time-Bounded):** 78 percent of leaders...
2. **Skill Portability Boundaries (Ongoing):** What makes some skills portable...
```

**Difference:**
- Pre-rebuild: `**Title** — detail` (em-dash separator)
- Rebuild: `**Title (Category):** detail` (colon separator, category in parens)

**Impact:**
- ⚠️ **Parser may not split title/detail correctly**
  - Regex expects: `\*\*([^*]+)\*\*\s*[—-]\s*(.+)`
  - Rebuild has: `**Title (Category):** detail`
  - The colon `:` is not in the separator pattern!

**Current regex**: `[—-]` (em-dash or hyphen)
**Rebuild uses**: `:` (colon)

This will likely result in:
- Title = "Measurement Framework Emergence (Time-Bounded): 78 percent of leaders..."
- Detail = "" (empty, because no em-dash separator found)

**Fallback regex**: `^\d+\.\s+(.+)$`
- This will capture the entire line as title, then try to split on ` — ` or ` - `
- Since there's no em-dash, detail will be empty

---

### Gap 4: Subtrend Title Generation

**Pre-Rebuild Example:**
```markdown
### #agentic-workflows

The architectural consensus that emerged in the prior synthesis held steady...
[Cursor_ScalingAutonomousCoding DP4; ...]

New this week: AI Jason's reverse-engineering reveals...
[AI_Jason_ClaudeCodeAgentTeams DP1, DP3]
```

**Auto-generated subtrends:**
1. Title: "The architectural consensus that emerged in the prior synthesis held steady"
   - Paragraphs: [full paragraph text]
   - Citations: ["Cursor_ScalingAutonomousCoding DP4", ...]

2. Title: "New this week: AI Jason's reverse-engineering reveals"
   - Paragraphs: [full paragraph text]
   - Citations: ["AI_Jason_ClaudeCodeAgentTeams DP1, DP3"]

**Rebuild Example:**
```markdown
### #agentic-workflows

The fundamental nature of agentic AI is becoming clearer: it is not a tool that can be managed through traditional technology deployment frameworks.
[BCG_EmergingAgenticEnterprise DP2]

The operational consequence is the emergence of four irreducible tensions...
[BCG_EmergingAgenticEnterprise DP5, DP22]

Multi-agent coordination, however, reveals a hard economic constraint...
[Google_DeepMind_ScienceOfScalingAgents DP3, DP4]
```

**Auto-generated subtrends:**
1. Title: "The fundamental nature of agentic AI is becoming clearer"
   - Paragraphs: ["The fundamental nature of agentic AI is becoming clearer: it is not a tool..."]
   - Citations: ["BCG_EmergingAgenticEnterprise DP2"]

2. Title: "The operational consequence is the emergence of four irreducible tensions"
   - Paragraphs: ["The operational consequence is the emergence..."]
   - Citations: ["BCG_EmergingAgenticEnterprise DP5, DP22"]

3. Title: "Multi-agent coordination, however, reveals a hard economic constraint"
   - Paragraphs: ["Multi-agent coordination, however, reveals..."]
   - Citations: ["Google_DeepMind_ScienceOfScalingAgents DP3, DP4"]

**Impact:**
- ✅ Subtrend auto-generation will work correctly
- ✅ Titles will be meaningful first sentences
- ⚠️ **More subtrends per tag** (rebuild has more granular paragraph-citation pairings)
- Frontend may need better handling for tags with 10+ subtrends

---

### Gap 5: Tags Table Format Change

**Pre-Rebuild Format:**
```markdown
## Tags Active This Week

| Tag | Data Points | Status |
|-----|-------------|--------|
| #agentic-workflows | 80+ | Established |
```

**Rebuild Format:**
```markdown
## Tags Active This Period

| Tag | New DPs | Status | Trend |
|-----|---------|--------|-------|
| #agentic-workflows | 80+ | Established | Deepening (coordination tax quantified) |
```

**Differences:**
1. Section header: "This Week" → "This Period"
2. Column rename: "Data Points" → "New DPs"
3. New column: "Trend" with qualitative assessment

**Impact:**
- ⚠️ **Parser currently doesn't use this section**
  - No code in `parseWeeklyInsights()` extracts tags table
  - If future features want to display tag momentum, they'll need to parse this
- ✅ No breaking changes for current Pulse screen
- 💡 **Opportunity**: New "Trend" column could power visualizations

---

## Summary of Breaking Changes

### Critical (Breaks Current Functionality)

1. **Open Threads Title/Detail Parsing**
   - Rebuild uses `:` separator instead of `—` em-dash
   - Parser will put entire line in title, leave detail empty
   - **Fix Required**: Update regex to handle both formats

### Moderate (Reduces Information Richness)

2. **Missing "What Shifted" / "What Held Steady"**
   - Rebuild format doesn't include these markers
   - Pulse screen has dedicated display for these (though not currently rendered visibly?)
   - **Decision Required**:
     - Option A: Remove these fields from parser output
     - Option B: Keep fields but mark as optional
     - Option C: Add heuristic to detect "what's new" from document type

3. **Missing "Connection to Current Understanding" Per-Tag**
   - Rebuild moves connections to separate "Updates Made to Current Understanding" section
   - Per-tag connections not available during trend parsing
   - **Fix Required**: Either:
     - Parse "Updates Made" section and map back to tags
     - Accept that connections won't show per-tag in rebuild format

### Minor (No Breaking Impact)

4. **More Subtrends Per Tag**
   - Rebuild format has more paragraph-citation pairs
   - Auto-generation will create more subtrends
   - **Enhancement Opportunity**: Better UI for many subtrends

5. **Tags Table Enhancement**
   - New "Trend" column available in rebuild format
   - Current parser doesn't use this section
   - **Enhancement Opportunity**: Parse and visualize tag momentum

---

## Recommended Parser Updates

### Priority 1: Fix Breaking Changes

#### 1. Update Open Threads Regex (Lines 1166-1185)

**Current Logic:**
```javascript
const numbered = line.match(/^\d+\.\s+\*\*([^*]+)\*\*\s*[—-]\s*(.+)$/);
```

**Updated Logic:**
```javascript
// Try em-dash separator first (pre-rebuild format)
let match = line.match(/^\d+\.\s+\*\*([^*]+)\*\*\s*[—-]\s*(.+)$/);
if (match) {
  title = cleanMarkdownInline(match[1]);
  detail = cleanMarkdownInline(match[2]);
}

// Try colon separator (rebuild format)
if (!match) {
  match = line.match(/^\d+\.\s+\*\*([^*]+)\*\*:\s*(.+)$/);
  if (match) {
    title = cleanMarkdownInline(match[1]);
    detail = cleanMarkdownInline(match[2]);
  }
}

// Existing fallback logic continues...
```

### Priority 2: Handle Optional Fields

#### 2. Make Change Markers Optional

**Current Logic:**
```javascript
record.whatShiftedOrNew = ""; // Expected to be populated
record.whatHeldSteady = "";   // Expected to be populated
record.connections = [];      // Expected to be populated
```

**Updated Logic:**
No code change needed, but documentation should clarify:
- These fields will be empty strings/arrays for rebuild format
- Frontend should check for empty values before rendering
- Consider adding `hasChangeMarkers` boolean flag to result

#### 3. Parse "Updates Made to Current Understanding"

**New Function:**
```javascript
const parseUpdatesToIdeas = (text) => {
  // Parse the "Updates Made to Current Understanding" section
  // Return map of Idea Number → {status: "modified"|"new", description: "..."}
  // Frontend can use this for different visualization
};
```

### Priority 3: Enhancements

#### 4. Parse Tags Table for Trend Momentum

**New Function:**
```javascript
const parseTagsTable = (lines) => {
  // Parse "Tags Active This Week/Period" table
  // Return array of { tag, dataPoints, status, trend? }
};
```

#### 5. Detect Document Type (Rebuild vs. Incremental)

**New Function:**
```javascript
const detectWeeklyType = (text) => {
  if (text.includes('REBUILD NOTE:') || text.includes('Rebuild Edition')) {
    return 'rebuild';
  }
  return 'incremental';
};

// Use in parseWeeklyInsights:
result.documentType = detectWeeklyType(text);
```

This allows frontend to:
- Show different UI for rebuild vs. incremental
- Apply different parsing strategies
- Render appropriate context ("This is a comprehensive synthesis" vs. "New this week")

---

## Frontend Display Implications

### Current Pulse Screen Rendering

Based on line 3110-3114:
```javascript
renderPulsePosition(synthesis);                          // Current Synthesis: headline + lede
renderPulseTakeaways(synthesis.takeaways);               // Current Synthesis: key takeaways
renderPulseTrends(weeklyInsights.trends);                // Weekly Learnings: trends
renderPulseWeeklyOpenThreads(weeklyInsights.openThreads);// Weekly Learnings: open threads
renderPulseReflection(weeklyInsights.reflectionParagraphs); // Weekly Learnings: reflection
```

### What Needs UI Adaptation?

#### 1. Trends Display (renderPulseTrends, line 1422)

**Current expectations:**
- Each trend has `whatShiftedOrNew` or `whatHeldSteady`
- Connections to ideas are available per-trend

**Rebuild format:**
- No change markers
- No per-trend connections

**Recommended UI Changes:**
- Check for empty `whatShiftedOrNew` before rendering change section
- If no connections, hide connections section
- Consider showing document type badge ("Comprehensive Synthesis" vs. "Weekly Update")

#### 2. Open Threads Display (renderPulseWeeklyOpenThreads, line 1475)

**Current expectations:**
- Title and detail are separated

**Rebuild format:**
- Category may be in parentheses in title
- Detail may be full paragraph

**Recommended UI Changes:**
- Handle empty detail gracefully (show only title if detail is empty)
- Consider parsing category from title (extract text in parentheses)
- Show category as tag or badge

#### 3. Reflection Display (renderPulseReflection, line 1498)

**Current expectations:**
- Personal, narrative tone
- Weekly cadence

**Rebuild format:**
- Strategic synthesis
- System-level assessment

**Recommended UI Changes:**
- No changes needed for rendering
- Consider adding visual distinction (icon, header text) based on documentType

---

## Testing Strategy

### Test Cases for Parser Updates

#### 1. Open Threads Parsing

**Test Input 1 (Pre-Rebuild Format):**
```markdown
## Open Threads

1. **Shadow IT governance** — How do organizations detect unauthorized deployment?
2. **Bot-to-bot negotiation** — Complementary or competing models?
```

**Expected Output:**
```javascript
[
  { title: "Shadow IT governance", detail: "How do organizations detect unauthorized deployment?" },
  { title: "Bot-to-bot negotiation", detail: "Complementary or competing models?" }
]
```

**Test Input 2 (Rebuild Format):**
```markdown
## Open Threads

1. **Measurement Framework Emergence (Time-Bounded):** 78 percent of leaders acknowledge traditional metrics insufficient.
2. **Skill Portability Boundaries (Ongoing):** What makes some skills portable across contexts?
```

**Expected Output:**
```javascript
[
  {
    title: "Measurement Framework Emergence (Time-Bounded)",
    detail: "78 percent of leaders acknowledge traditional metrics insufficient."
  },
  {
    title: "Skill Portability Boundaries (Ongoing)",
    detail: "What makes some skills portable across contexts?"
  }
]
```

#### 2. Subtrend Auto-Generation

**Test Input:**
```markdown
### #agentic-workflows

The fundamental nature of agentic AI is becoming clearer.
[BCG_EmergingAgenticEnterprise DP2]

The operational consequence is the emergence of four irreducible tensions.
[BCG_EmergingAgenticEnterprise DP5, DP22]
```

**Expected Output:**
```javascript
{
  tag: "#agentic-workflows",
  subtrends: [
    {
      title: "The fundamental nature of agentic AI is becoming clearer",
      paragraphs: ["The fundamental nature of agentic AI is becoming clearer."],
      citations: ["BCG_EmergingAgenticEnterprise DP2"]
    },
    {
      title: "The operational consequence is the emergence of four irreducible tensions",
      paragraphs: ["The operational consequence is the emergence of four irreducible tensions."],
      citations: ["BCG_EmergingAgenticEnterprise DP5, DP22"]
    }
  ]
}
```

#### 3. Optional Fields Handling

**Test Input (Rebuild Format - No Change Markers):**
```markdown
### #adoption-barriers

The 85 percent "use case desert" persists.
[Section_AIProficiencyReportJan2026 DP3, DP6]
```

**Expected Output:**
```javascript
{
  tag: "#adoption-barriers",
  summary: "The 85 percent \"use case desert\" persists.",
  whatShiftedOrNew: "",      // Empty - no marker found
  whatShiftedOrNewLabel: "", // Empty
  whatHeldSteady: "",        // Empty
  connections: [],           // Empty array
  subtrends: [...]
}
```

**Test Input (Pre-Rebuild Format - With Change Markers):**
```markdown
### #adoption-barriers

The use case desert persists.

**What shifted:** Shadow IT deployment is a new barrier dimension.

**Connection to Current Understanding:**
- Reinforces Idea 3
```

**Expected Output:**
```javascript
{
  tag: "#adoption-barriers",
  summary: "The use case desert persists.",
  whatShiftedOrNew: "Shadow IT deployment is a new barrier dimension.",
  whatShiftedOrNewLabel: "What shifted",
  whatHeldSteady: "",
  connections: ["Reinforces Idea 3"],
  subtrends: [...]
}
```

---

## Backward Compatibility Strategy

### Support Both Formats Simultaneously

The parser should:
1. **Always work** with both pre-rebuild and rebuild formats
2. **Gracefully degrade** when optional fields are missing
3. **Populate all available fields** regardless of format

### Implementation Approach

```javascript
const parseWeeklyInsights = (text) => {
  const result = {
    title: "",
    documentType: detectWeeklyType(text), // 'rebuild' or 'incremental'
    trends: [],
    openThreads: [],
    reflectionParagraphs: [],
  };

  // Existing parsing logic continues...
  // All optional field checks remain (they already handle empty values)

  return result;
};
```

### Frontend Display Logic

```javascript
const renderPulseTrends = (trends = []) => {
  trends.forEach(trend => {
    // Render trend tag
    renderTrendTag(trend.tag);

    // Render subtrends (always available)
    renderSubtrends(trend.subtrends);

    // Only render change markers if present
    if (trend.whatShiftedOrNew) {
      renderChangeMarker(trend.whatShiftedOrNewLabel, trend.whatShiftedOrNew);
    }

    if (trend.whatHeldSteady) {
      renderSteadyMarker(trend.whatHeldSteady);
    }

    // Only render connections if present
    if (trend.connections.length > 0) {
      renderConnections(trend.connections);
    }
  });
};
```

---

## Migration Path

### Phase 1: Fix Breaking Changes (Immediate)
- [ ] Update Open Threads regex to handle colon separator
- [ ] Test with both WL_2026-02-07 and WL_2026-02-09
- [ ] Verify no regressions on existing weekly learnings

### Phase 2: Add Document Type Detection (Short-term)
- [ ] Add `detectWeeklyType()` function
- [ ] Add `documentType` to parseWeeklyInsights result
- [ ] Update frontend to show document type context

### Phase 3: Enhance Features (Medium-term)
- [ ] Parse "Updates Made to Current Understanding" section
- [ ] Parse Tags table for trend momentum
- [ ] Add visual indicators for rebuild vs. incremental docs

### Phase 4: Optimize Display (Long-term)
- [ ] Improve subtrend navigation for tags with 10+ subtrends
- [ ] Add tag momentum visualization
- [ ] Create comparison view for weekly deltas

---

## Conclusion

### Key Findings

1. **The parser is mostly robust**: Auto-generation of subtrends works with both formats
2. **One critical bug**: Open Threads regex doesn't handle colon separators
3. **Three semantic gaps**: Change markers, connections, and tag context are missing in rebuild format
4. **No fundamental redesign needed**: The parsing architecture supports both formats with minor updates

### Recommended Next Steps

1. **Immediate**: Fix Open Threads regex (Priority 1)
2. **This week**: Add document type detection and graceful degradation
3. **This month**: Parse "Updates Made" section for idea connections
4. **Future**: Enhance UI for rebuild-specific features (tag momentum, comprehensive synthesis context)

### File Change Summary

**Files needing updates:**
- `/poc/public/app.js` — parseWeeklyInsights function (lines 930-1189)
  - Open Threads regex (lines 1170-1185)
  - Optional: Add documentType detection

**Files NOT needing changes:**
- `/poc/server.py` — No changes needed (just serves content)
- `/poc/public/index.html` — No changes needed
- Current Synthesis parsing — Already works correctly

### Testing Files to Use

**Test with both formats:**
1. `03_Weekly_Learnings/2026-Q1/archive/WL_2026-02-07_pre_rebuild.md` (Pre-rebuild)
2. `03_Weekly_Learnings/2026-Q1/WL_2026-02-09.md` (Rebuild)
3. `03_Weekly_Learnings/2026-Q1/WL_2026-02-07.md` (Latest incremental)

**Validation criteria:**
- Both formats load without errors
- Trends display with subtrends
- Open Threads parse correctly with title/detail separation
- Reflection paragraphs display
- No console errors
