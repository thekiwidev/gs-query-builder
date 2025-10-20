# Operator Chaining Validation Fix

## Overview

Fixed two critical flaws in the operator chaining validation logic that prevented proper detection of invalid operator chains and incorrectly flagged valid sequences as errors.

## Problems Identified

### Problem 1: First Block Not Validated Against Next Block

**Root Cause:** Forward-chain validation was nested inside `if (blockIndex > 0)`, causing the very first block to skip validation against its successor.

**Impact:** Invalid operator chains starting at position 0 were silently allowed.

**Example of Missed Error:**

```
Block 0: AND_NEXT | Block 1: OR_PREV ← ERROR NOT DETECTED
```

The inspector would never look at this connection because the check starts from block 1 instead of block 0.

### Problem 2: Overly Broad Conflict Detection

**Root Cause:** The original validator flagged ANY mismatch between blocks, even when starting new chains.

**Impact:** Valid sequences like `AND_NEXT` followed by `OR_NEXT` were incorrectly rejected, preventing users from having multiple independent operator chains.

**Examples of Incorrectly Flagged Errors:**

```
Block 0: AND_NEXT | Block 1: OR_NEXT | Block 2: ...     ← VALID, but marked ERROR
Block 0: OR_NEXT  | Block 1: AND_NEXT | Block 2: ...    ← VALID, but marked ERROR
```

These sequences represent: "(Block 0 AND Block 1) OR Block 2" and "(Block 0 OR Block 1) AND Block 2", which are perfectly valid Boolean expressions.

## Solution: Bidirectional Validation with Precise Rules

### Architecture

Split validation into two specialized, independent checks:

```typescript
// BACKWARD CHECK (all blocks except first)
if (block.operator === "AND_PREV" || block.operator === "OR_PREV") {
  // Check compatibility with previous block's _NEXT operator
  if (previousBlock.operator === "AND_NEXT" && block.operator === "OR_PREV") {
    // ERROR: Direct conflict
  }
}

// FORWARD CHECK (all blocks except last)
if (block.operator === "AND_NEXT" || block.operator === "OR_NEXT") {
  // Check compatibility with next block's operator
  if (block.operator === "AND_NEXT" && nextBlock.operator === "OR_PREV") {
    // ERROR: Direct conflict
  }
}
```

### Key Improvements

1. **Complete Coverage:** Both first and last blocks are properly validated

   - Forward check runs for blocks 0 to n-2 (can look at next block)
   - Backward check runs for blocks 1 to n-1 (can look at previous block)
   - No block is skipped

2. **Precise Conflict Rules:** Only flag direct impossibilities
   - ❌ `AND_NEXT` followed by `OR_PREV` (incompatible pair)
   - ❌ `OR_NEXT` followed by `AND_PREV` (incompatible pair)
   - ✅ `AND_NEXT` followed by `OR_NEXT` (valid chain boundary)
   - ✅ `OR_NEXT` followed by `AND_NEXT` (valid chain boundary)

## Validation Matrix

### Valid Sequences (Now Allowed)

| Block 0  | Block 1  | Block 2  | Interpretation                   | Status |
| -------- | -------- | -------- | -------------------------------- | ------ |
| AND_NEXT | OR_NEXT  | ...      | (Block0 AND Block1) OR Block2... | ✅     |
| OR_NEXT  | AND_NEXT | ...      | (Block0 OR Block1) AND Block2... | ✅     |
| AND_NEXT | AND_PREV | OR_PREV  | (Block0 AND Block1) OR Block2    | ✅     |
| AND_NEXT | AND_NEXT | AND_PREV | (Block0 AND Block1 AND Block2)   | ✅     |

### Invalid Sequences (Now Correctly Caught)

| Block 0  | Block 1  | Issue                           | Status                                   |
| -------- | -------- | ------------------------------- | ---------------------------------------- | -------- |
| AND_NEXT | OR_PREV  | Incompatible pair at position 0 | ❌ ERROR                                 |
| AND_NEXT | AND_PREV | AND_PREV                        | Valid chain (AND0 AND1) but Block2 is OR | ✅       |
| AND_NEXT | OR_PREV  | OR_PREV                         | Cannot have OR_PREV after AND_NEXT       | ❌ ERROR |

## Implementation Details

### Rule 4: Operator Chaining Validation

Located in `/lib/operatorValidator.ts` lines 73-126

```typescript
// BACKWARD CHECK: Validate block's _PREV against previous block's _NEXT
// Runs for blocks 1 to n-1 (all except first)
if (
  (block.operator === "AND_PREV" || block.operator === "OR_PREV") &&
  blockIndex > 0
) {
  const previousBlock = allBlocks[blockIndex - 1];

  if (previousBlock?.operator) {
    // AND_NEXT → OR_PREV is a direct conflict
    if (previousBlock.operator === "AND_NEXT" && block.operator === "OR_PREV") {
      return { valid: false, message: "...", suggestion: "..." };
    }

    // OR_NEXT → AND_PREV is a direct conflict
    if (previousBlock.operator === "OR_NEXT" && block.operator === "AND_PREV") {
      return { valid: false, message: "...", suggestion: "..." };
    }
  }
}

// FORWARD CHECK: Validate block's _NEXT against next block's operator
// Runs for blocks 0 to n-2 (all except last)
if (
  (block.operator === "AND_NEXT" || block.operator === "OR_NEXT") &&
  blockIndex < allBlocks.length - 1
) {
  const nextBlock = allBlocks[blockIndex + 1];

  if (nextBlock?.operator) {
    // AND_NEXT → OR_PREV is a direct conflict
    if (block.operator === "AND_NEXT" && nextBlock.operator === "OR_PREV") {
      return { valid: false, message: "...", suggestion: "..." };
    }

    // OR_NEXT → AND_PREV is a direct conflict
    if (block.operator === "OR_NEXT" && nextBlock.operator === "AND_PREV") {
      return { valid: false, message: "...", suggestion: "..." };
    }
  }
}
```

## Testing Scenarios

### Test 1: First Block Validation (Previously Missed)

```typescript
blocks: [
  { id: '0', operator: 'AND_NEXT', ... },
  { id: '1', operator: 'OR_PREV', ... }
]
// Expected: ERROR at block 0
// Before: PASSED (incorrectly)
// After: ERROR (correctly caught by forward check)
```

### Test 2: Chain Boundary (Previously Incorrectly Flagged)

```typescript
blocks: [
  { id: '0', operator: 'AND_NEXT', ... },
  { id: '1', operator: 'OR_NEXT', ... },
  { id: '2', operator: 'AND_NEXT', ... }
]
// Expected: VALID (AND chain ends, OR starts, then AND)
// Before: ERROR (incorrectly)
// After: VALID (correctly allowed)
```

### Test 3: Mid-Chain Validation (Now Properly Checked)

```typescript
blocks: [
  { id: '0', operator: 'AND_NEXT', ... },
  { id: '1', operator: 'AND_NEXT', ... },
  { id: '2', operator: 'OR_PREV', ... }
]
// Expected: ERROR at block 2
// Before: ERROR (correct but for wrong reason)
// After: ERROR (correctly caught by backward check)
```

## Error Messages

All error messages now clearly indicate:

1. Which block and operator are involved
2. What the conflict is
3. How to fix it

Example:

```
"Invalid operator combination: You selected AND with next, but the next block
uses OR with previous. Operators must match in a chain."

Suggestion: 'Change the next block to "OR with next" to start a new chain.'
```

## Migration Notes

- ✅ **Backward Compatible:** No changes to SearchBlock interface
- ✅ **No Breaking Changes:** Existing valid queries continue to work
- ✅ **Improved Accuracy:** Invalid queries now properly detected
- ✅ **Better UX:** Users get clearer error messages with actionable suggestions

## Files Modified

- `lib/operatorValidator.ts` - Rule 4 rewritten (lines 73-126)
- `CHANGELOG.md` - Version 1.3.1 entry added

## Related Documentation

- `/docs/operator-validation-system.md` - Complete validation system overview
- `/CHANGELOG.md` - Full version history with this fix documented
