# Rebuild Protocol Updates: Evidence Density & Metadata Requirements

**Date:** February 9, 2026
**Purpose:** Ensure future syntheses include rich evidence density and metadata for Pulse screen display

---

## Summary of Changes

Updated the Rebuild Protocol (Chat Sessions 4 & 5) and templates to require:

1. **Evidence Density:** Minimum 3-5 citations per insight/takeaway (targeting 5-7 for major claims)
2. **Metadata Sections:** "Key Developments" and "Connection to Active Ideas" for each tag in Weekly Learnings
3. **Narrative Flow:** Summary must preview and connect to Key Takeaways
4. **Quality Checklists:** Explicit verification steps before completion

---

## Files Modified

### 1. `_System/Workflows/Rebuild_Protocol.md`

#### Chat Session 4 (Lines 442-454) - Weekly Learnings Requirements

**Added:**
- Evidence density requirements (3-5+ sources per tag section)
- Required metadata sections per tag:
  - **Key Developments:** Most significant findings
  - **Connection to Active Ideas:** Explicit evidence links
- Structure template showing proper citation format
- Quality standards referencing Style Guide

**Updated "Done When" checklist:**
- Each tag section has 3-5+ source citations minimum
- Each tag section includes "Key Developments" subsection
- Each tag section includes "Connection to Active Ideas" subsection
- Evidence density feels comprehensive, not shallow

#### Chat Session 5 (Lines 529-591) - Current Synthesis Requirements

**Added:**
- Summary structure requirements (3 paragraphs with specific purposes)
- Key Takeaways evidence density requirements:
  - **MINIMUM:** 3-5+ citations per takeaway
  - **TARGET:** 5-7 citations for major claims
- Example takeaway showing proper evidence density
- Quality checklist before saving:
  - Every Key Takeaway has minimum 3 citations
  - Summary narratively connects to takeaways
  - No single-source claims
  - Evidence shows convergence across sources

**Updated "Done When" checklist:**
- Summary narratively previews the Key Takeaways
- Each Key Takeaway has 3-5+ citations minimum
- No single-source claims in Key Takeaways
- Evidence density shows convergence across multiple sources

---

### 2. `08_Templates/Weekly_Template.md`

#### Updated "Synthesis by Tag" Section (Lines 22-61)

**Added to comment block:**
- Evidence density requirements
- Required metadata sections explanation

**Replaced tag section template with:**
```markdown
### #tag1

[Comprehensive synthesis paragraph 1 with multiple citations]
[Source1 DP#, DP#; Source2 DP#; Source3 DP#]
<!-- citation metadata comments -->

[Comprehensive synthesis paragraph 2]
[Source4 DP#; Source5 DP#, DP#]
<!-- citation metadata comments -->

**Key Developments:**
- [Most significant finding from this synthesis]

**Connection to Active Ideas:**
- Idea X (Name): [How evidence supports/challenges/expands this idea]
- Idea Y (Name): [How evidence relates to this idea]
```

**Impact:**
- Template now shows proper structure for evidence-rich synthesis
- Makes metadata sections required, not optional
- Shows how to format multi-source citations

---

### 3. `08_Templates/Current_Synthesis_Template.md`

#### Updated Summary Section (Lines 5-10)

**Added:**
- Structure requirements (3 paragraphs with specific purposes)
- Writing guidelines emphasizing narrative flow into Key Takeaways
- Guidance that Summary should preview takeaways, not just describe landscape

#### Updated Key Takeaways Section (Lines 11-24)

**Added:**
- Evidence density requirements section:
  - Minimum: 3-5+ sources per takeaway
  - Target: 5-7 citations for major claims
  - Avoid single-source claims
  - Format: embed citations throughout narrative
- Structure per takeaway guidelines
- Full example showing proper evidence density with 5 sources cited throughout

**Impact:**
- Makes evidence density requirements explicit and measurable
- Provides concrete example to follow
- Shows how to embed citations naturally in prose

---

## Why These Changes Matter

### For the Pulse Screen

The Pulse screen displays:
- **Summary** (from Current Synthesis)
- **Key Takeaways** (from Current Synthesis)
- **Trends** (from Weekly Learnings)
- **Open Threads** (from Weekly Learnings)
- **Reflection** (from Weekly Learnings)

**Previous gaps:**
1. Single citations per takeaway felt shallow, didn't show evidence chain
2. No "Connection to Active Ideas" metadata → couldn't link trends to ideas
3. No "Key Developments" → couldn't show what shifted or what's significant
4. Summary didn't preview takeaways → felt disconnected

**These updates ensure:**
1. ✅ Each takeaway shows convergence across 3-5+ sources
2. ✅ Each trend explicitly links to Active Ideas it supports
3. ✅ Each trend highlights key developments for quick scanning
4. ✅ Summary narratively flows into takeaways

### For Synthesis Quality

**Evidence density prevents:**
- Shallow, single-source claims
- Over-reliance on one perspective
- Missing the convergence patterns across research

**Metadata sections provide:**
- Clear navigation from trends to Active Ideas
- Understanding of what's most significant (Key Developments)
- Traceability of how evidence supports ideas

---

## Next Steps for You

### Running Chat Sessions 4 & 5 Again

When you run these sessions, Claude will now:

**Chat Session 4:**
1. Read the updated protocol requirements
2. Write Weekly Learnings with:
   - 3-5+ citations per tag section
   - "Key Developments" for each tag
   - "Connection to Active Ideas" for each tag
3. Verify checklists before marking complete

**Chat Session 5:**
1. Read the updated protocol requirements
2. Write Current Synthesis with:
   - Summary that previews takeaways narratively
   - Each takeaway citing 3-5+ sources (targeting 5-7)
   - Evidence embedded throughout, not just at end
3. Verify checklists before marking complete

### Expected Outcomes

**Weekly Learnings will have:**
```markdown
### #agentic-workflows

The architectural consensus... [Cursor DP4, DP5; Anthropic DP11; github DP4, DP5]
...citation metadata...

The productionization evidence... [AI_Jason DP1, DP3; Vercel DP1; Andrew_Pignanelli DP10]
...citation metadata...

**Key Developments:**
- Agent Teams architecture moved from consensus to productionized SDK

**Connection to Active Ideas:**
- Idea 7 (Agent-Native Development): Productionized tooling confirms paradigm is operational
- Idea 2 (Coordination Tax): Architecture confirms overhead managed through bounded autonomy
```

**Current Synthesis will have:**
```markdown
**1. Agentic AI Breaks Employment Taxonomy**

Organizations must resolve four tensions [BCG DP2, DP5, DP22]. 76% view as
coworker [BCG DP2], with 95% satisfaction embracing duality [BCG DP22; McKinsey DP14].
Traditional structures assume binary classification [McKinsey DP7; Anthropic DP11],
but agentic systems force ambiguity management [BCG DP5; Google_DeepMind DP14].
```

---

## Verification

After running Chat Sessions 4 & 5, verify:

**Weekly Learnings:**
- [ ] Each tag section cites 3-5+ sources
- [ ] Each tag has "Key Developments" subsection
- [ ] Each tag has "Connection to Active Ideas" subsection
- [ ] Citations show convergence across sources

**Current Synthesis:**
- [ ] Summary previews the takeaways narratively
- [ ] Each Key Takeaway cites 3-5+ sources (targeting 5-7)
- [ ] Citations embedded throughout prose, not just at end
- [ ] No single-source claims in takeaways

**Pulse Screen Display:**
- [ ] Trends show which Active Ideas they support
- [ ] Key Takeaways feel evidence-rich, not shallow
- [ ] Summary flows naturally into takeaways
- [ ] Overall narrative is cohesive and traceable

---

## Rollback Plan (If Needed)

If these requirements prove too restrictive or create other issues, the previous versions are archived at:
- Rebuild Protocol: `git log` or manual diff
- Templates: `git log` or manual diff

To rollback, restore the previous "Key differences from normal weekly synthesis" block in Chat Session 4 and the simpler "Key sections" list in Chat Session 5.

---

## Questions or Adjustments

If you find during Chat Sessions 4 & 5 that:
- Evidence density targets feel too high/low
- Metadata sections need different structure
- Templates need refinement

We can adjust these requirements. The goal is rich, traceable synthesis that serves the Pulse screen, not rigid compliance with arbitrary numbers.
