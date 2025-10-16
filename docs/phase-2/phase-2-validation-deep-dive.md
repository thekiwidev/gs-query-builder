# Phase 2 - Validation Deep Dive

## Overview

This document provides detailed specifications for the operator validation system that powers Phase 2's intelligent error detection.

---

## Validation Architecture

### Three-Layer Validation Model

```
Layer 1: Input Validation
  ↓
Layer 2: Logic Validation
  ↓
Layer 3: Relationship Validation
```

### Layer 1: Input Validation

**What:** Check if required fields are populated

**Rules:**

- Field ID must be selected (not empty)
- Search term must not be empty or whitespace-only
- Term should have reasonable length (6-255 characters recommended)

**Error Messages:**

```
❌ "Field is required - please select a search field."
❌ "Search term is required - please enter a term."
❌ "Search term is too long (max 255 characters)."
```

**When:** On every term/field change

### Layer 2: Logic Validation

**What:** Check if operator configuration is logically sound

**Rules:**

#### Rule 2.1: First Block No Operator

- **Condition:** Block is at index 0 AND has operator (AND/OR/EXCLUDE)
- **Why:** First block has no previous block to relate to
- **Error:** "First block cannot use AND/OR operators - it's the first term."
- **Fix:** Remove operator or move block to position 2+

#### Rule 2.2: EXCLUDE Cannot Use Direction

- **Condition:** Operator is EXCLUDE AND direction is set (previous/next)
- **Why:** NOT/EXCLUDE is standalone, doesn't reference other blocks
- **Error:** "Excluded (NOT) blocks do not use directional logic."
- **Fix:** Remove direction or change operator to AND/OR

#### Rule 2.3: AND/OR Must Have Valid Direction

- **Condition:** Operator is AND/OR but no direction specified
- **Why:** AND/OR must reference previous OR next block
- **Error:** "Please select a direction: 'with previous' or 'with next'."
- **Fix:** Select a direction

#### Rule 2.4: Last Block Cannot Use "with next"

- **Condition:** Block is at last index AND direction is "next"
- **Why:** There is no next block to reference
- **Error:** "Last block cannot use 'with next' - there is no next block."
- **Fix:** Change direction to "previous" or add a new block

#### Rule 2.5: First Block Cannot Use "with previous"

- **Condition:** Block is at index 0 AND direction is "previous"
- **Why:** There is no previous block to reference
- **Error:** "First block cannot use 'with previous' - there is no previous block."
- **Fix:** Remove direction or move to position 2+

### Layer 3: Relationship Validation

**What:** Check interactions between multiple blocks

**Rules:**

#### Rule 3.1: Cannot AND with Excluded

- **Condition:** Current operator is AND/OR AND referenced block has operator EXCLUDE
- **Why:** Cannot logically AND with an excluded term
- **Error:** "Cannot AND with Block N because it's excluded (NOT). EXCLUDE blocks must stand alone."
- **Example:**
  ```
  Block 1: field=title term=machine operator=EXCLUDE
  Block 2: field=author term=Smith operator=AND direction=previous
  ❌ ERROR: Cannot AND with excluded Block 1
  ```
- **Fix:** Change operator to EXCLUDE or move AND'd term elsewhere

#### Rule 3.2: Cannot OR with Excluded

- **Condition:** Current operator is OR AND referenced block has operator EXCLUDE
- **Why:** OR with an excluded term creates invalid logic
- **Error:** "Cannot OR with Block N because it's excluded (NOT). EXCLUDE blocks must stand alone."
- **Fix:** Use AND instead or restructure query

#### Rule 3.3: Circular Logic Check

- **Condition:** Block A references Block B, Block B references Block A
- **Why:** Creates circular/ambiguous logic
- **Error:** "Circular logic detected: Block N → Block M → Block N. Please resolve."
- **Fix:** Change one block's direction to break cycle

#### Rule 3.4: Dangling Operator

- **Condition:** Last block has AND/OR operator but no following block
- **Why:** Operator hangs with nothing to reference
- **Error:** "Last block has 'AND with next' but there's no next block. Add a block or change direction."
- **Fix:** Add another block or change operator

---

## Validation State Machine

```
┌─────────────────────┐
│  Block Initialized  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────┐
│ Layer 1: Input Valid?   │
├─────────────────────────┤
│ NO  → Show error 1      │ (block.error = message)
│ YES → Continue          │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Layer 2: Logic Valid?   │
├─────────────────────────┤
│ NO  → Show error 2      │ (block.error = message)
│ YES → Continue          │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Layer 3: Relations OK?  │
├─────────────────────────┤
│ NO  → Show error 3      │ (block.error = message)
│ YES → Valid ✓           │
└─────────────────────────┘
```

---

## Validation Triggers

### When Validation Runs

```typescript
// Trigger 1: Block field changes
onChange({ ...block, fieldId: newField })
  → validateAllBlocks()

// Trigger 2: Block term changes
onChange({ ...block, term: newTerm })
  → validateAllBlocks()

// Trigger 3: Operator changes
onChange({ ...block, operator: 'AND' })
  → validateAllBlocks()

// Trigger 4: Direction changes
onChange({ ...block, operatorDirection: 'previous' })
  → validateAllBlocks()

// Trigger 5: Block added
addBlock()
  → validateAllBlocks()

// Trigger 6: Block removed
removeBlock(id)
  → validateAllBlocks()
```

### Debouncing Strategy

```typescript
// For term input: debounce 300ms (don't validate on every keystroke)
const handleTermChange = debounce((term) => {
  onChange({ ...block, term });
}, 300);

// For operator changes: validate immediately (2ms)
const handleOperatorChange = (operator) => {
  onChange({ ...block, operator });
};
```

---

## Error Message Taxonomy

### Error Categories

| Category           | Severity | Block Disabled | Submit Disabled |
| ------------------ | -------- | -------------- | --------------- |
| **Input Error**    | High     | Yes            | Yes             |
| **Logic Error**    | High     | Yes            | Yes             |
| **Relation Error** | Critical | Yes            | Yes             |
| **Warning**        | Low      | No             | No              |

### Error Message Structure

```
[EMOJI] [TITLE]
[DESCRIPTION]
[SUGGESTION/ACTION]

Example:
⚠️ Invalid Operator Configuration
You cannot AND with Block 1 because it's excluded (NOT).
Suggestion: Change to EXCLUDE, OR, or move this term elsewhere.
```

### Standard Error Messages

```markdown
## Input Errors

❌ **Field Required**
"Please select a search field."

❌ **Term Required**
"Please enter a search term."

❌ **Term Too Long**
"Search term exceeds 255 characters (current: {length})."

---

## Logic Errors

❌ **First Block Cannot Use Operator**
"First block cannot use AND/OR operators - it's the initial term."
Suggestion: Keep this as your starting term, or move to position 2+.

❌ **EXCLUDE Cannot Use Direction**
"Excluded (NOT) blocks do not use directional logic - they stand alone."
Suggestion: Remove the direction setting.

❌ **Missing Direction**
"Please select a direction: 'with previous' or 'with next'."

❌ **Last Block with Next Direction**
"Last block cannot use 'with next' - there is no following block."
Suggestion: Add another block, or change direction to 'with previous'.

❌ **First Block with Previous Direction**
"First block cannot use 'with previous' - there is no prior block."
Suggestion: This is your first block, no direction needed.

---

## Relationship Errors

❌ **Cannot AND with Excluded**
"Cannot AND with Block N because it's excluded (NOT)."
Explanation: Excluded terms must stand alone and cannot be combined with AND/OR.
Suggestion: Change to EXCLUDE operator, or restructure your query.

❌ **Cannot OR with Excluded**
"Cannot OR with Block N because it's excluded (NOT)."
Explanation: Excluded terms create ambiguous logic when combined with OR.
Suggestion: Use AND instead, or restructure your query.

❌ **Circular Logic Detected**
"Circular logic: Block A → Block B → Block A. Please resolve."
Explanation: Blocks reference each other in a loop, creating ambiguous intent.
Suggestion: Change one block's direction to break the cycle.

---

## Warnings (Non-blocking)

⚠️ **Potential Ambiguity**
"Your query might be interpreted differently than intended."
Suggestion: Consider adding parentheses or restructuring.

⚠️ **Excluded Terms Only**
"This query only contains excluded (NOT) terms."
Suggestion: Add at least one positive search term for better results.
```

---

## Implementation Reference

### Validation Function Signature

```typescript
function validateSearchBlock(
  block: SearchBlockForValidation,
  blockIndex: number,
  allBlocks: SearchBlockForValidation[]
): ValidationError {
  // Returns { valid: true } or { valid: false, message: string }
}
```

### Helper Functions

```typescript
// Check if block can reference another
function canReferenceBlock(
  operator: OperatorType,
  targetBlock: SearchBlockForValidation
): boolean {
  // Returns false if target is EXCLUDE and operator is AND/OR
}

// Get available directions for position
function getAvailableDirections(
  blockIndex: number,
  totalBlocks: number
): OperatorDirection[] {
  // Returns ['previous', 'next'] or subset based on position
}

// Get suggested operator for position
function getSuggestedOperator(
  blockIndex: number
): OperatorType | null {
  // First block: null, others: 'AND'
}

// Format error message with context
function formatErrorMessage(
  errorCode: string,
  context: { blockIndex: number; operator?: OperatorType; ... }
): string {
  // Returns localized, context-aware error message
}
```

---

## Edge Cases & Handling

### Edge Case 1: Single Block

```
Block 0: field=title term=AI operator=undefined
✅ Valid: First block needs no operator
```

### Edge Case 2: Two Blocks, First is EXCLUDE

```
Block 0: field=title term=crypto operator=EXCLUDE
Block 1: field=author term=Smith operator=AND direction=previous
❌ Invalid: Cannot AND with excluded
```

### Edge Case 3: Empty Term with Operator Selected

```
Block 0: field=title term="" operator=AND direction=next
❌ Invalid: Term required (Layer 1)
```

### Edge Case 4: Changing Operator Changes Validity

```
Before: Block 0 operator=AND (invalid - first block)
After: Block 0 operator=EXCLUDE (valid)
→ Re-validate immediately
```

### Edge Case 5: Removing Block Changes Validity

```
Before: Block 2 (last) operator=AND direction=next (invalid)
Remove Block 3
After: Block 2 is no longer last, becomes valid
→ Re-validate remaining blocks
```

---

## Testing Validation

### Unit Test Scenarios

```typescript
describe("Operator Validation", () => {
  test("First block cannot use AND", () => {
    const block = { fieldId: "title", term: "AI", operator: "AND" };
    const result = validateSearchBlock(block, 0, [block]);
    expect(result.valid).toBe(false);
    expect(result.message).toContain("First block");
  });

  test("Cannot AND with excluded", () => {
    const blocks = [
      { fieldId: "title", term: "crypto", operator: "EXCLUDE" },
      {
        fieldId: "author",
        term: "Smith",
        operator: "AND",
        direction: "previous",
      },
    ];
    const result = validateSearchBlock(blocks[1], 1, blocks);
    expect(result.valid).toBe(false);
  });

  // ... more tests
});
```

### Integration Test Scenarios

```typescript
describe("Full Query Validation", () => {
  test("Valid 3-block query", () => {
    const blocks = [
      { fieldId: "title", term: "AI", operator: undefined },
      {
        fieldId: "author",
        term: "Smith",
        operator: "AND",
        direction: "previous",
      },
      {
        fieldId: "source",
        term: "Nature",
        operator: "OR",
        direction: "previous",
      },
    ];
    const errors = validateAllBlocks(blocks);
    expect(errors.size).toBe(0);
  });

  test("Multiple errors detected", () => {
    const blocks = [
      { fieldId: "", term: "", operator: "AND" }, // Multiple errors
      {
        fieldId: "author",
        term: "Smith",
        operator: "OR",
        direction: undefined,
      },
    ];
    const errors = validateAllBlocks(blocks);
    expect(errors.size).toBeGreaterThan(1);
  });
});
```

---

## Localization Considerations

### Message Keys

```json
{
  "validation.field_required": "Field is required - please select a search field.",
  "validation.term_required": "Search term is required - please enter a term.",
  "validation.first_block_no_operator": "First block cannot use AND/OR operators - it's the initial term.",
  "validation.exclude_no_direction": "Excluded (NOT) blocks do not use directional logic.",
  "validation.cannot_and_excluded": "Cannot AND with Block {blockNum} because it's excluded (NOT)."
}
```

---

## Performance Optimization

### Avoid Unnecessary Re-validation

```typescript
// ❌ Don't: Validate on every keystroke
const handleTermChange = (term: string) => {
  onChange({ ...block, term });
  // This triggers validateAllBlocks() in parent
};

// ✅ Do: Debounce for text input
const handleTermChange = debounce((term: string) => {
  onChange({ ...block, term });
}, 300);

// ✅ Do: Validate immediately for operator changes
const handleOperatorChange = (operator: OperatorType) => {
  onChange({ ...block, operator });
};
```

### Memoization Strategy

```typescript
// Use useMemo to cache validation results
const validationErrors = useMemo(() => validateAllBlocks(blocks), [blocks]);

// Validation only runs when blocks change
```

---

## Accessibility in Error Display

### Screen Reader Announcements

```typescript
// Announce errors immediately
<div role="alert" aria-live="polite">
  {error.message}
</div>

// Associate error with form field
<input
  id="search-term"
  aria-invalid={!!error}
  aria-describedby={error ? "error-msg" : undefined}
/>
<span id="error-msg" role="alert">
  {error.message}
</span>
```

### Keyboard Navigation

```
Tab → Focus field
Enter → Toggle operators
Tab → Next control
Shift+Tab → Previous control
Escape → Collapse operators
```

---

## Summary

| Aspect               | Details                                           |
| -------------------- | ------------------------------------------------- |
| **Layers**           | 3 (Input, Logic, Relationship)                    |
| **Total Rules**      | 10+ comprehensive rules                           |
| **Triggers**         | 6 (field, term, operator, direction, add, remove) |
| **Error Categories** | 4 (Input, Logic, Relation, Warning)               |
| **Performance**      | Optimized with debounce + memoization             |
| **Accessibility**    | ARIA labels, screen reader support                |

---

**Last Updated:** October 16, 2025  
**Status:** Complete  
**Next:** Phase 3 - Advanced Filters Implementation
