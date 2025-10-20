# Operator Chaining Validation - Test Cases

## Quick Reference: Test Your Fixes

Run these test cases to verify the operator chaining validation is working correctly.

## Test Suite 1: First Block Validation (Previously Missed)

### Test Case 1.1: AND_NEXT → OR_PREV at Position 0

```typescript
const blocks = [
  { id: '0', fieldId: 'title', term: 'AI', operator: 'AND_NEXT' },
  { id: '1', fieldId: 'title', term: 'Ethics', operator: 'OR_PREV' }
];

Expected: ❌ ERROR (direct conflict)
Before: ✅ PASSED (bug: forward check skipped block 0)
After: ❌ ERROR (fixed: forward check catches it)
```

### Test Case 1.2: OR_NEXT → AND_PREV at Position 0

```typescript
const blocks = [
  { id: '0', fieldId: 'author', term: 'Smith', operator: 'OR_NEXT' },
  { id: '1', fieldId: 'author', term: 'Johnson', operator: 'AND_PREV' }
];

Expected: ❌ ERROR (direct conflict)
Before: ✅ PASSED (bug: forward check skipped)
After: ❌ ERROR (fixed)
```

---

## Test Suite 2: Valid Chain Boundaries (Previously Rejected)

### Test Case 2.1: AND_NEXT → OR_NEXT (End AND, Start OR)

```typescript
const blocks = [
  { id: '0', fieldId: 'title', term: 'AI', operator: 'AND_NEXT' },
  { id: '1', fieldId: 'title', term: 'Ethics', operator: 'OR_NEXT' },
  { id: '2', fieldId: 'year', term: '2023', operator: 'AND_NEXT' }
];

Expected: ✅ VALID
Before: ❌ ERROR (bug: overly strict rules)
After: ✅ VALID (fixed: allows chain boundaries)

Interpretation: (Title: AI AND Title: Ethics) OR (Year: 2023 AND ...)
```

### Test Case 2.2: OR_NEXT → AND_NEXT (End OR, Start AND)

```typescript
const blocks = [
  { id: '0', fieldId: 'author', term: 'Smith', operator: 'OR_NEXT' },
  { id: '1', fieldId: 'author', term: 'Johnson', operator: 'AND_NEXT' },
  { id: '2', fieldId: 'year', term: '2023', operator: 'OR_NEXT' }
];

Expected: ✅ VALID
Before: ❌ ERROR (bug: overly strict)
After: ✅ VALID (fixed)

Interpretation: (Author: Smith OR Author: Johnson) AND (Year: 2023 OR ...)
```

### Test Case 2.3: Multiple Chain Transitions

```typescript
const blocks = [
  { id: '0', fieldId: 'title', term: 'AI', operator: 'AND_NEXT' },
  { id: '1', fieldId: 'title', term: 'Ethics', operator: 'AND_NEXT' },
  { id: '2', fieldId: 'source', term: 'Nature', operator: 'OR_NEXT' },
  { id: '3', fieldId: 'source', term: 'Science', operator: 'OR_NEXT' },
  { id: '4', fieldId: 'year', term: '2023', operator: 'AND_NEXT' }
];

Expected: ✅ VALID
Before: ❌ ERROR (bug: rejects multiple transitions)
After: ✅ VALID (fixed)

Interpretation: (Title: AI AND Ethics) OR (Source: Nature OR Science) AND (Year: 2023 AND ...)
```

---

## Test Suite 3: Invalid Operator Combinations (Should Still Fail)

### Test Case 3.1: AND_NEXT → OR_PREV (Mid-Chain)

```typescript
const blocks = [
  { id: '0', fieldId: 'title', term: 'AI', operator: 'AND_NEXT' },
  { id: '1', fieldId: 'title', term: 'Ethics', operator: 'AND_NEXT' },
  { id: '2', fieldId: 'title', term: 'Machine Learning', operator: 'OR_PREV' }
];

Expected: ❌ ERROR (direct conflict)
Before: ❌ ERROR (correct but for wrong reason)
After: ❌ ERROR (correctly caught: OR_PREV after AND chain)
```

### Test Case 3.2: OR_NEXT → AND_PREV (Mid-Chain)

```typescript
const blocks = [
  { id: '0', fieldId: 'author', term: 'Smith', operator: 'OR_NEXT' },
  { id: '1', fieldId: 'author', term: 'Johnson', operator: 'OR_NEXT' },
  { id: '2', fieldId: 'author', term: 'Davis', operator: 'AND_PREV' }
];

Expected: ❌ ERROR (direct conflict)
Before: ❌ ERROR (correct but for wrong reason)
After: ❌ ERROR (correctly caught: AND_PREV after OR chain)
```

---

## Test Suite 4: Continuous Chains (Should Pass)

### Test Case 4.1: Long AND Chain

```typescript
const blocks = [
  { id: '0', fieldId: 'title', term: 'AI', operator: 'AND_NEXT' },
  { id: '1', fieldId: 'title', term: 'Ethics', operator: 'AND_NEXT' },
  { id: '2', fieldId: 'title', term: 'Society', operator: 'AND_NEXT' },
  { id: '3', fieldId: 'title', term: 'Impact', operator: 'AND_PREV' }
];

Expected: ✅ VALID
Before: ✅ VALID (correct)
After: ✅ VALID (still correct)

Interpretation: (Title: AI AND Title: Ethics AND Title: Society AND Title: Impact)
```

### Test Case 4.2: Long OR Chain

```typescript
const blocks = [
  { id: '0', fieldId: 'author', term: 'Smith', operator: 'OR_NEXT' },
  { id: '1', fieldId: 'author', term: 'Johnson', operator: 'OR_NEXT' },
  { id: '2', fieldId: 'author', term: 'Davis', operator: 'OR_PREV' },
  { id: '3', fieldId: 'author', term: 'Wilson', operator: 'OR_PREV' }
];

Expected: ✅ VALID
Before: ✅ VALID (correct)
After: ✅ VALID (still correct)

Interpretation: (Author: Smith OR Author: Johnson OR Author: Davis OR Author: Wilson)
```

---

## Test Suite 5: Symmetric Chains

### Test Case 5.1: Bidirectional Validation for AND

```typescript
// Block validation from left:
Block 0 (AND_NEXT) → Block 1 (AND_PREV) = ✅
// Validation from right:
Block 1 (AND_PREV) ← Block 0 (AND_NEXT) = ✅

Expected: ✅ VALID from both directions
After: ✅ Both forward and backward checks pass
```

### Test Case 5.2: Bidirectional Validation for OR

```typescript
// Block validation from left:
Block 0 (OR_NEXT) → Block 1 (OR_PREV) = ✅
// Validation from right:
Block 1 (OR_PREV) ← Block 0 (OR_NEXT) = ✅

Expected: ✅ VALID from both directions
After: ✅ Both forward and backward checks pass
```

### Test Case 5.3: Bidirectional Validation for Conflict

```typescript
// Block validation from left:
Block 0 (AND_NEXT) → Block 1 (OR_PREV) = ❌
// Validation from right:
Block 1 (OR_PREV) ← Block 0 (AND_NEXT) = ❌

Expected: ❌ ERROR from both directions
After: ❌ Both forward and backward checks detect it
```

---

## Edge Cases

### Edge Case 1: Single Block (No Operators)

```typescript
const blocks = [
  { id: '0', fieldId: 'title', term: 'AI' }
];

Expected: ✅ VALID (no operators to validate)
After: ✅ No checks run (blockIndex > 0 is false, blockIndex < len-1 is false)
```

### Edge Case 2: Two Blocks with Partial Operators

```typescript
const blocks = [
  { id: '0', fieldId: 'title', term: 'AI', operator: 'AND_NEXT' },
  { id: '1', fieldId: 'title', term: 'Ethics' } // No operator
];

Expected: ✅ VALID (orphaned block with no operator is treated as standalone)
After: ✅ Forward check finds next block has no operator, doesn't flag error
```

### Edge Case 3: Blocks with EXCLUDE (No Direction)

```typescript
const blocks = [
  { id: '0', fieldId: 'title', term: 'AI', operator: 'AND_NEXT' },
  { id: '1', fieldId: 'title', term: 'Ethics', operator: 'EXCLUDE' }
];

Expected: ❌ ERROR (EXCLUDE after AND should be invalid per Rule 3)
After: ❌ ERROR (Rule 3 catches it before Rule 4)
```

---

## Manual Testing Checklist

- [ ] **Test Block 0 Validation:** Run Test Case 1.1 - Should now properly error
- [ ] **Test Valid Transitions:** Run Test Case 2.1 - Should allow AND→OR
- [ ] **Test Complex Chains:** Run Test Case 2.3 - Should allow multiple transitions
- [ ] **Test Continuous Chains:** Run Test Case 4.1 - Should still pass long chains
- [ ] **Test Both Directions:** Run Test Case 5.3 - Both checks should catch conflict
- [ ] **Test Edge Cases:** Run all edge cases - Should handle gracefully

## Expected Results Summary

| Test Suite                   | BEFORE     | AFTER      | Status             |
| ---------------------------- | ---------- | ---------- | ------------------ |
| 1.1 (Block 0 validation)     | ✅ PASS ❌ | ❌ FAIL ✅ | **FIXED**          |
| 1.2 (Block 0 validation)     | ✅ PASS ❌ | ❌ FAIL ✅ | **FIXED**          |
| 2.1 (Valid boundary)         | ❌ FAIL ✅ | ✅ PASS ✅ | **FIXED**          |
| 2.2 (Valid boundary)         | ❌ FAIL ✅ | ✅ PASS ✅ | **FIXED**          |
| 2.3 (Multiple transitions)   | ❌ FAIL ✅ | ✅ PASS ✅ | **FIXED**          |
| 3.1 (Invalid combination)    | ❌ FAIL ✅ | ❌ FAIL ✅ | Unchanged          |
| 3.2 (Invalid combination)    | ❌ FAIL ✅ | ❌ FAIL ✅ | Unchanged          |
| 4.1 (Long AND chain)         | ✅ PASS ✅ | ✅ PASS ✅ | Unchanged          |
| 4.2 (Long OR chain)          | ✅ PASS ✅ | ✅ PASS ✅ | Unchanged          |
| 5.1 (Bidirectional AND)      | ✅ PASS ✅ | ✅ PASS ✅ | Unchanged          |
| 5.2 (Bidirectional OR)       | ✅ PASS ✅ | ✅ PASS ✅ | Unchanged          |
| 5.3 (Bidirectional conflict) | ❌ FAIL ✅ | ❌ FAIL ✅ | Improved detection |

---

## How to Run Tests Programmatically

```typescript
import { validateSearchBlock } from "@/lib/operatorValidator";

// Test Case 1.1
const result = validateSearchBlock(blocks[0], 0, blocks);

console.log(`Test 1.1: ${result.valid ? "FAIL" : "PASS"} (expected: false)`);
console.log(`Message: ${result.message}`);

// Should output:
// Test 1.1: PASS (expected: false)
// Message: Invalid operator combination: You selected AND with next, but the next block uses OR with previous...
```

---

## Documentation Files

- `lib/operatorValidator.ts` - Implementation
- `docs/operator-chaining-validation-fix.md` - Technical details
- `docs/operator-chaining-before-after.md` - Comparison guide
- `CHANGELOG.md` - Version 1.3.1 entry
