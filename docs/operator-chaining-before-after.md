# Operator Chaining Validation - Before & After Comparison

## Visual Comparison: The Inspector Analogy

### Before: One Confused Inspector

```
The Flawed Process:
┌─────────────────────────────────────────────────────┐
│  START AT BLOCK 1 (skips checking block 0!)         │
│  ├─ IF (blockIndex > 0) {  ← This excludes block 0  │
│  │  // forward check runs starting here             │
│  │  // BUT block 0 is never checked forward!        │
│  │  }                                               │
│  └─ Checks ALL combinations: AND→OR, AND→AND, etc. │
│     (too strict, flags valid sequences as errors)   │
└─────────────────────────────────────────────────────┘

Result:
✗ Misses errors at block 0 (skipped location)
✗ Creates false errors (AND_NEXT → OR_NEXT marked invalid)
✗ Invalid chains like [Block0: AND_NEXT, Block1: OR_PREV] PASS
```

### After: Two Specialized Inspectors

```
The Corrected Process:
┌──────────────────────────────────────────────────────┐
│  INSPECTOR #1: BACKWARD CHECK (blocks 1 to n-1)      │
│  ├─ Looks at this block's _PREV operator            │
│  ├─ Compares against previous block's _NEXT         │
│  └─ ONLY flags direct conflicts:                    │
│     AND_NEXT → OR_PREV  ❌                           │
│     OR_NEXT → AND_PREV  ❌                           │
│                                                      │
│  INSPECTOR #2: FORWARD CHECK (blocks 0 to n-2)      │
│  ├─ Looks at this block's _NEXT operator            │
│  ├─ Compares against next block's operator          │
│  └─ ONLY flags direct conflicts:                    │
│     AND_NEXT → OR_PREV  ❌                           │
│     OR_NEXT → AND_PREV  ❌                           │
└──────────────────────────────────────────────────────┘

Result:
✓ Catches all errors (no positions skipped)
✓ Allows valid chain transitions (AND→OR, OR→AND)
✓ Invalid chains like [Block0: AND_NEXT, Block1: OR_PREV] FAIL
```

## Code Comparison

### BEFORE

```typescript
// Rule 4: FLAWED LOGIC
if (
  (block.operator === "AND_NEXT" || block.operator === "OR_NEXT") &&
  blockIndex > 0 // ← PROBLEM 1: Skips block 0!
) {
  // Only check next block if previous block has operator
  if (previousBlock && previousBlock.operator) {
    if (previousBlock.operator === "AND_NEXT") {
      if (block.operator === "OR_PREV" || block.operator === "OR_NEXT") {
        // ↑ PROBLEM 2: Flags OR_NEXT as error (should be valid!)
        return { valid: false, message: "..." };
      }
    }
    // ... more overly broad checks
  }

  // Also nested inside blockIndex > 0, so still skipped for block 0!
  if (
    (block.operator === "AND_NEXT" || block.operator === "OR_NEXT") &&
    blockIndex < allBlocks.length - 1
  ) {
    const nextBlock = allBlocks[blockIndex + 1];
    if (nextBlock && nextBlock.operator) {
      // Still too broad: flags AND_NEXT followed by OR_PREV as error
      // (which IS error, but also flags OR_NEXT wrongly)
    }
  }
}
```

### AFTER

```typescript
// Rule 4: CORRECT LOGIC
// Backward Check (blocks 1 to n-1)
if (
  (block.operator === "AND_PREV" || block.operator === "OR_PREV") &&
  blockIndex > 0 // ← Safe here: only checking _PREV for non-first blocks
) {
  const previousBlock = allBlocks[blockIndex - 1];

  if (previousBlock && previousBlock.operator) {
    // ONLY flag direct conflicts
    if (
      previousBlock.operator === "AND_NEXT" &&
      block.operator === "OR_PREV" // ← Direct conflict ONLY
    ) {
      return { valid: false, message: "..." };
    }
    if (
      previousBlock.operator === "OR_NEXT" &&
      block.operator === "AND_PREV" // ← Direct conflict ONLY
    ) {
      return { valid: false, message: "..." };
    }
  }
}

// Forward Check (blocks 0 to n-2)
if (
  (block.operator === "AND_NEXT" || block.operator === "OR_NEXT") &&
  blockIndex < allBlocks.length - 1 // ← Starts at block 0! Problem 1 fixed
) {
  const nextBlock = allBlocks[blockIndex + 1];

  if (nextBlock && nextBlock.operator) {
    // ONLY flag direct conflicts
    if (block.operator === "AND_NEXT" && nextBlock.operator === "OR_PREV") {
      return { valid: false, message: "..." };
    }
    if (block.operator === "OR_NEXT" && nextBlock.operator === "AND_PREV") {
      return { valid: false, message: "..." };
    }
    // Note: OR_NEXT followed by OR_PREV is NOT checked here
    // because it's not a direct conflict - allows chain boundaries
  }
}
```

## Validation Coverage

### BEFORE: Incomplete Coverage

```
Block 0 (AND_NEXT)    ← ✗ Forward check SKIPPED (blockIndex > 0 is false)
    ↓
Block 1 (OR_PREV)     ← ✓ Backward check runs, but flags as error
    ↓
Block 2 (OR_NEXT)     ← ✓ Forward check runs
    ↓
Block 3 (AND_NEXT)    ← ✓ Forward check runs

Result:
- Block 0 → Block 1: ERROR MISSED ✗ (no forward check for block 0)
- Block 1 → Block 2: ERROR (or false positive)
- Block 2 → Block 3: May be false positive if OR_NEXT → AND_NEXT
```

### AFTER: Complete Coverage

```
Block 0 (AND_NEXT)    ← ✓ Forward check RUNS (blockIndex < len-1 is true)
    ↓
Block 1 (OR_PREV)     ← ✓ Backward check RUNS + ✓ Forward check if needed
    ↓
Block 2 (OR_NEXT)     ← ✓ Backward check RUNS + ✓ Forward check if needed
    ↓
Block 3 (AND_NEXT)    ← ✓ Backward check RUNS

Result:
- Block 0 → Block 1: ERROR CAUGHT ✓ (forward check detects AND_NEXT → OR_PREV)
- Block 1 → Block 2: ALLOWED ✓ (OR_PREV after AND_NEXT is the error, not after AND)
- Block 2 → Block 3: ALLOWED ✓ (OR_NEXT → AND_NEXT is a valid chain boundary)
```

## Real-World Scenario Examples

### Scenario 1: Research on AI Ethics and Machine Learning

**User's Intent:**

```
(Title: AI AND Title: Ethics) OR (Title: Machine Learning)
```

**Block Configuration:**

```
Block 0: field=Title, term=AI, operator=AND_NEXT
Block 1: field=Title, term=Ethics, operator=OR_NEXT
Block 2: field=Title, term=Machine Learning
```

**BEFORE:** ❌ ERROR - "Cannot use OR operators when previous block uses AND"

- False positive: User wanted to chain two independent searches

**AFTER:** ✅ VALID - Correctly allows chaining AND within first group, then OR

---

### Scenario 2: Invalid Configuration (Should Fail)

**User's Mistake:**

```
Block 0: field=Title, term=AI, operator=AND_NEXT
Block 1: field=Title, term=Ethics, operator=OR_PREV
```

**Configuration:** AND_NEXT followed by OR_PREV (incompatible pair)

**BEFORE:** ❌ ERROR - But message is confusing and overly broad

**AFTER:** ✓ ERROR - Clear message: "Cannot use OR with previous when the previous block uses AND with next"

- Suggests: 'Use "AND with previous" to continue the AND chain.'

---

### Scenario 3: Complex Multi-Chain Query

**User's Intent:**

```
(Author: Smith OR Author: Johnson) AND (Year: 2023 OR Year: 2024)
```

**Block Configuration:**

```
Block 0: field=Author, term=Smith, operator=OR_NEXT
Block 1: field=Author, term=Johnson, operator=AND_NEXT
Block 2: field=Year, term=2023, operator=OR_NEXT
Block 3: field=Year, term=2024
```

**BEFORE:** ❌ MULTIPLE ERRORS - Too strict about operator transitions

**AFTER:** ✓ VALID - Correctly interprets:

- OR_NEXT at Block 0 (start of OR chain)
- AND_NEXT at Block 1 (end OR, start AND)
- OR_NEXT at Block 2 (within new OR chain)
- Block 3 (end of chain)

---

## Detailed Validation Rules

### Forward Check Rules (Applied to Block's \_NEXT Operator)

| Current Block | Next Block | Allowed? | Reason                |
| ------------- | ---------- | -------- | --------------------- |
| AND_NEXT      | AND_PREV   | ✅       | Continues AND chain   |
| AND_NEXT      | AND_NEXT   | ✅       | Chains forward in AND |
| AND_NEXT      | OR_PREV    | ❌       | Direct conflict       |
| AND_NEXT      | OR_NEXT    | ✅       | Ends AND, starts OR   |
| OR_NEXT       | AND_PREV   | ❌       | Direct conflict       |
| OR_NEXT       | AND_NEXT   | ✅       | Ends OR, starts AND   |
| OR_NEXT       | OR_PREV    | ✅       | Continues OR chain    |
| OR_NEXT       | OR_NEXT    | ✅       | Chains forward in OR  |

### Backward Check Rules (Applied to Block's \_PREV Operator)

| Previous Block | Current Block | Allowed? | Reason                                       |
| -------------- | ------------- | -------- | -------------------------------------------- |
| AND_NEXT       | AND_PREV      | ✅       | Continues AND chain                          |
| AND_NEXT       | AND_NEXT      | ✅       | Previous already connects forward            |
| AND_NEXT       | OR_PREV       | ❌       | Direct conflict                              |
| AND_NEXT       | OR_NEXT       | ✅       | Previous chains forward, this starts new OR  |
| OR_NEXT        | AND_PREV      | ❌       | Direct conflict                              |
| OR_NEXT        | AND_NEXT      | ✅       | Previous chains forward, this starts new AND |
| OR_NEXT        | OR_PREV       | ✅       | Continues OR chain                           |
| OR_NEXT        | OR_NEXT       | ✅       | Previous already connects forward            |

## Key Differences Summary

| Aspect                  | BEFORE                | AFTER                     |
| ----------------------- | --------------------- | ------------------------- |
| **Block 0 Coverage**    | Forward check skipped | Forward check runs ✓      |
| **Chain Boundaries**    | Rejected as errors    | Allowed ✓                 |
| **Error Messages**      | Generic/broad         | Specific and actionable ✓ |
| **Valid Query Support** | Limited               | Full ✓                    |
| **User Experience**     | Confusing             | Clear ✓                   |
| **Completion Status**   | Incomplete            | Production-ready ✓        |
