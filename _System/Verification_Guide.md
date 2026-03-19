# Verification Guide

How to verify claims in CRIS outputs.

## The Verification Chain

Every claim should be traceable:

```
Talking Point / Active Idea
    ↓
Weekly Synthesis [Source DP#]
    ↓
Extraction DP# with Anchor quote
    ↓
Source document (Cmd+F anchor)
```

## Quick Verification Workflow

**Time: 30-60 seconds per claim**

1. **Find the DP reference** in synthesis/idea
   - Look for `[Source_Name DP#]` citations

2. **Open the extraction file**
   - Navigate to `02_Extractions/YYYY-MM/Source_Name.md`
   - Find the DP# (e.g., DP3)

3. **Copy the anchor quote**
   - The anchor is the verbatim text in quotes

4. **Search in source**
   - Open the PDF/doc in `01_Raw_Inputs/`
   - Cmd+F (or Ctrl+F) the anchor text
   - Verify the context matches the interpretation

## What to Check

| Check | Question |
|-------|----------|
| **Quote accuracy** | Does the anchor appear verbatim in the source? |
| **Context accuracy** | Does the surrounding context support the interpretation? |
| **Citation accuracy** | Is it on the cited page/timestamp? |
| **Interpretation accuracy** | Does the DP statement fairly represent the source? |

## Red Flags

Watch for these during verification:

| Red Flag | What It Means |
|----------|---------------|
| Anchor not found | Quote may be paraphrased or from wrong source |
| Context changes meaning | Interpretation may be misleading |
| Multiple anchors combined | Check if combination is fair synthesis |
| Page number wrong | May be from different section with different context |

## Multi-Anchor Claims

When a DP combines multiple anchors:

```markdown
**DP7:** Training moves workers from novice to experimenter but rarely to practitioner
- **Anchor 1:** "28% at novice level" (p. 8)
- **Anchor 2:** "70% reach experimenter" (p. 12)
- **Anchor 3:** "only 2.7% achieve practitioner" (p. 15)
```

**Verify each anchor separately**, then ask:
- Is combining these three findings into one interpretation fair?
- Does the source draw this same connection, or is this my synthesis?

If it's your synthesis (source doesn't connect them), that's fine—just be aware that's interpretation, not direct finding.

## Verification Sampling

You don't need to verify everything. Use sampling:

| Situation | Sample Rate |
|-----------|-------------|
| High-stakes claim (will publish) | Verify 100% |
| Weekly synthesis review | Verify 2-3 key claims |
| Spot-check for quality | Random 10-20% |

## Flagging Issues

If verification reveals problems:

1. **Minor (wrong page):** Fix citation, continue
2. **Moderate (context changes meaning):** Revise DP interpretation
3. **Major (quote doesn't exist):** Flag as potential hallucination, re-extract from source

## Prevention vs. Detection

This system is designed for **detection** (verification after the fact).

**Prevention** happens at extraction time:
- Verbatim anchors (not paraphrased)
- Distinctive phrases (searchable)
- Multiple anchors for combined claims

The better the extraction, the easier the verification.
