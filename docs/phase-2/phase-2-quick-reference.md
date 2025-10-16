# Phase 2 - Search Block Simplification: Quick Reference

## What Is Phase 2?

Phase 2 transforms complex search blocks into clean, single-line interfaces with **hidden advanced operators**.

### Before (Phase 1)

```
┌──────────────────────────────────────┐
│ Field: [Select] Term: [Input]        │
│ Operators: [AND▼] Direction: [Prev▼] │
│ [Remove Button]                      │
└──────────────────────────────────────┘
```

### After (Phase 2)

```
┌──────────────────────────────────────┐
│ [Field▼] | [Term...] | ✓ | + | ×    │
└──────────────────────────────────────┘
```

When user clicks `+`, operators panel expands below.

---

## Core Concepts

### 1. Single-Line Search Block

- **Field Selector:** 160px dropdown
- **Search Term:** Flexible input
- **Is Exact:** Checkbox icon (✓ or ◯)
- **Expand Button:** `+` icon (shows operators when clicked)
- **Remove Button:** `×` icon

### 2. Hidden Operators Panel

- **Visibility:** Hidden by default, expands when `+` clicked
- **Content:**
  - Operator type: AND / OR / EXCLUDE (radio buttons)
  - Direction: with previous / with next (radio buttons)
  - Error message (if validation fails)
- **Animation:** Smooth 250ms fade-in

### 3. Operator Validation

- Validates all operator combinations
- Shows clear error messages
- Prevents invalid search logic
- Disables Submit if errors exist

---

## Key Files to Create/Update

| File                                            | Action   | Purpose                     |
| ----------------------------------------------- | -------- | --------------------------- |
| `components/search/SearchBlockRow.tsx`          | CREATE   | Single-line layout          |
| `components/search/SearchBlockOperatorsRow.tsx` | CREATE   | Collapsible operators panel |
| `components/search/SearchBlockErrorRow.tsx`     | CREATE   | Error display               |
| `components/search/SearchBlockComponent.tsx`    | REFACTOR | Unified block component     |
| `lib/operatorValidator.ts`                      | CREATE   | Validation logic            |
| `types/search.ts`                               | CREATE   | TypeScript interfaces       |

---

## Component Hierarchy

```
SearchBlockComponent (State Manager)
├── SearchBlockRow (Main layout)
│   ├── Field Selector
│   ├── Term Input
│   ├── Is Exact Button
│   ├── Expand Operators Button (+)
│   └── Remove Button (×)
├── SearchBlockOperatorsRow (Conditional - hidden by default)
│   ├── Operator Selection (AND/OR/EXCLUDE)
│   ├── Direction Selection (previous/next)
│   └── Error Message (if validation fails)
└── SearchBlockErrorRow (Conditional - shows if errors)
    └── Error message display
```

---

## Validation Rules

### ✅ Valid Scenarios

- Block 1: No operator (first block)
- Block 2+: AND/OR with direction (previous/next)
- EXCLUDE: Standalone (no direction)
- Last block: Can't use "with next"

### ❌ Invalid Scenarios

- Block 1 with operator
- AND/OR with excluded block
- EXCLUDE with direction
- "with next" on last block
- "with previous" on first block

---

## Implementation Order

1. **Create Types** → `types/search.ts`
2. **Create Validator** → `lib/operatorValidator.ts`
3. **Create Row Components** → `SearchBlockRow.tsx`, `SearchBlockOperatorsRow.tsx`, `SearchBlockErrorRow.tsx`
4. **Create Unified Component** → `SearchBlockComponent.tsx`
5. **Update Container** → `SearchBlocksContainer.tsx`
6. **Update QueryBuilder** → `QueryBuilder.tsx`
7. **Test & Polish** → Styling, animations, accessibility

---

## Code Templates

### SearchBlockRow Template

```typescript
export function SearchBlockRow({
  block,
  fields,
  onFieldChange,
  onTermChange,
  onIsExactChange,
  onToggleOperators,
  onRemove,
}) {
  return (
    <div className="flex gap-3 items-center h-12">
      {/* Field Selector */}
      <select onChange={(e) => onFieldChange(e.target.value)}>
        {fields.map((f) => (
          <option key={f.id}>{f.label}</option>
        ))}
      </select>

      {/* Term Input */}
      <input
        value={block.term}
        onChange={(e) => onTermChange(e.target.value)}
        placeholder="Enter search term..."
      />

      {/* Is Exact Button */}
      <button onClick={() => onIsExactChange(!block.isExact)}>
        {block.isExact ? "✓" : "◯"}
      </button>

      {/* Expand Operators */}
      <button onClick={onToggleOperators}>
        {block.showOperators ? "−" : "+"}
      </button>

      {/* Remove Button */}
      <button onClick={onRemove}>×</button>
    </div>
  );
}
```

### SearchBlockOperatorsRow Template

```typescript
export function SearchBlockOperatorsRow({
  block,
  isFirst,
  isLast,
  onOperatorChange,
  onDirectionChange,
}) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
      {/* Operator Selection */}
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            value="AND"
            onChange={(e) => onOperatorChange(e.target.value)}
          />
          AND
        </label>
        <label>
          <input
            type="radio"
            value="OR"
            onChange={(e) => onOperatorChange(e.target.value)}
          />
          OR
        </label>
        <label>
          <input
            type="radio"
            value="EXCLUDE"
            onChange={(e) => onOperatorChange(e.target.value)}
          />
          EXCLUDE
        </label>
      </div>

      {/* Direction Selection */}
      {!isFirst && (
        <label>
          <input
            type="radio"
            value="previous"
            onChange={(e) => onDirectionChange(e.target.value)}
          />
          with previous
        </label>
      )}
      {!isLast && (
        <label>
          <input
            type="radio"
            value="next"
            onChange={(e) => onDirectionChange(e.target.value)}
          />
          with next
        </label>
      )}
    </div>
  );
}
```

### Validation Template

```typescript
export function validateSearchBlock(block, index, allBlocks) {
  // Check if fields filled
  if (!block.fieldId || !block.term.trim()) {
    return {
      valid: false,
      message: "Field and term are required.",
    };
  }

  // Check first block
  if (index === 0 && block.operator && block.operator !== "EXCLUDE") {
    return {
      valid: false,
      message: "First block cannot use AND/OR.",
    };
  }

  // Check if AND/OR with excluded
  if (block.operator === "AND" || block.operator === "OR") {
    const refBlock =
      block.operatorDirection === "previous"
        ? allBlocks[index - 1]
        : allBlocks[index + 1];

    if (refBlock?.operator === "EXCLUDE") {
      return {
        valid: false,
        message: `Cannot ${block.operator} with excluded block.`,
      };
    }
  }

  return { valid: true };
}
```

---

## Styling Checklist

- [ ] Icon buttons: 40px × 40px, 4px radius, hover gray background
- [ ] Focus states: 2px blue ring around buttons
- [ ] Operators row: Smooth 250ms expand animation
- [ ] Error states: Red border left, light red background
- [ ] Error text: 13px, bold header + detail message
- [ ] Radio buttons: Standard browser styling (or custom if needed)
- [ ] Spacing: 12px between rows, 16px between sections

---

## Testing Checklist

- [ ] Can expand/collapse operators with + button
- [ ] Operators hidden by default on first view
- [ ] All operator combinations validate correctly
- [ ] Error messages display clearly
- [ ] Error prevents form submission
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen readers announce operators correctly
- [ ] Mobile layout looks good (if responsive)

---

## Common Pitfalls to Avoid

❌ **Don't:** Show operators by default  
✅ **Do:** Hide by default, show on request

❌ **Don't:** Validate every keystroke  
✅ **Do:** Validate when operators change

❌ **Don't:** Mix validation and UI logic  
✅ **Do:** Keep validation in separate module

❌ **Don't:** Show generic errors  
✅ **Do:** Show specific, actionable error messages

❌ **Don't:** Disable remove on last block  
✅ **Do:** Allow user to remove all blocks (show message when empty)

---

## Helpful Resources

- **Phase 1 Docs:** `docs/phase-1/phase-1-implementation.md`
- **Layout Guide:** `docs/ui-layout-guide.md`
- **Type Definitions:** `types/search.ts`
- **Validator Module:** `lib/operatorValidator.ts`

---

## Questions to Ask During Implementation

1. Should EXCLUDE blocks show all operators or just exclusion?
2. Should we support nested operators? (Phase 3)
3. How to handle long search terms in UI?
4. Should operators have tooltips explaining each option?
5. Should we save operator preferences in localStorage?

---

## Success Criteria

✅ Users can create valid search queries without seeing operator UI  
✅ Operators panel is non-intrusive and easy to access  
✅ Invalid configurations are prevented with clear feedback  
✅ Mobile experience is smooth and accessible  
✅ Build completes with 0 errors and 0 warnings  
✅ All validation rules pass automated tests

---

**Created:** October 16, 2025  
**Status:** Ready for Implementation  
**Next Phase:** Phase 3 - Advanced Filters & Query Preview
