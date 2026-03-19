#!/bin/bash
# CRIS Extraction Filename Validator
# Usage: bash validate_filename.sh "filename.md"
# Returns: 0 if valid, 1 if invalid

filename="$1"

if [ -z "$filename" ]; then
    echo "Usage: bash validate_filename.sh \"filename.md\""
    exit 1
fi

# Pattern: SourceNameDescriptiveSlug_YYYY-MM-DD.md
# - Must start with capital letter
# - SourceName and DescriptiveSlug in PascalCase (no internal underscores)
# - EXACTLY 2 underscores (both before date)
# - Date format: YYYY-MM-DD
# - Extension: .md

pattern='^[A-Z][a-zA-Z0-9]+_[A-Z][a-zA-Z0-9]+_[0-9]{4}-[0-9]{2}-[0-9]{2}\.md$'

if echo "$filename" | grep -qE "$pattern"; then
    echo "✅ VALID: $filename"
    exit 0
else
    echo "❌ INVALID: $filename"
    echo ""
    echo "Expected format: SourceName_DescriptiveSlug_YYYY-MM-DD.md"
    echo "Requirements:"
    echo "  - EXACTLY 2 underscores (both before date)"
    echo "  - PascalCase for SourceName and DescriptiveSlug (no internal underscores)"
    echo "  - Date format: YYYY-MM-DD"
    echo ""

    # Diagnose the issue
    underscore_count=$(echo "$filename" | tr -cd '_' | wc -c)
    echo "Underscore count: $underscore_count (should be exactly 2)"

    if [ "$underscore_count" -gt 2 ]; then
        echo "Issue: Too many underscores. Remove underscores from SourceName/DescriptiveSlug."
        echo "Example: 'Financial_Times' → 'FinancialTimes'"
    fi

    if [ "$underscore_count" -lt 2 ]; then
        echo "Issue: Not enough underscores. Need one between Source and Slug, one before date."
    fi

    echo ""
    echo "Valid examples:"
    echo "  ✅ FinancialTimes_MustafaSuleymanAI_2026-02-13.md"
    echo "  ✅ Every_ClaudeCodeFinance_2026-02-12.md"
    echo "  ✅ A16z_AIAgentEconomy_2026-02-10.md"
    echo ""
    echo "Invalid examples:"
    echo "  ❌ Financial_Times_MustafaSuleymanAI_2026-02-13.md (3 underscores)"
    echo "  ❌ FinancialTimes_Mustafa_Suleyman_AI_2026-02-13.md (5 underscores)"

    exit 1
fi
