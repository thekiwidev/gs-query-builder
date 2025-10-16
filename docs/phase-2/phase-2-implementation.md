# Phase 2 Implementation Guide - Search Block Simplification

## Overview

Phase 2 focuses on **simplifying individual search blocks** and **hiding advanced boolean operators** behind collapsible toggles. This guide provides detailed implementation steps building on the Phase 1 layout foundation.

## Current State vs Target State

### Current Layout (After Phase 1)

```
┌─────────────────────────────────────────────────┐
│ Field ──────────── │ Term ──────────────────   │
│ [Operators dropdown] [is exact checkbox]       │
│ [Remove] button                                │
├─────────────────────────────────────────────────┤
│ Field ──────────── │ Term ──────────────────   │
│ [Operators dropdown] [is exact checkbox]       │
│ [Remove] button                                │
└─────────────────────────────────────────────────┘
```

### Target Layout (After Phase 2)

```
┌─────────────────────────────────────────────────┐
│ [Field ▼] │ [Search Term...] │ ✓ │ + │ ×      │
├─────────────────────────────────────────────────┤
│ [Field ▼] │ [Search Term...] │ ✓ │ + │ ×      │
│                                                  │
│ When + clicked, expands to:                    │
│ Operators: ○ AND  ○ OR  ○ EXCLUDE             │
│ Direction: (○ with previous / ○ with next)    │
│ ⚠️ Invalid logic error (if applicable)         │
├─────────────────────────────────────────────────┤
│ [Field ▼] │ [Search Term...] │ ✓ │ + │ ×      │
└─────────────────────────────────────────────────┘
```

---

## Implementation Tasks (Phase 2)

### Task 1: Refactor Single Search Block Row

**File:** `components/search/SearchBlockRow.tsx`

**Purpose:** Create a clean, single-line search block without operators visible

**Key Changes:**

- Remove operator dropdowns from main view
- Use icon buttons instead of text labels
- Compact layout: `[Field] [Term] [IsExact] [Expand] [Remove]`
- All controls on single row (h-10 or h-12)
- No secondary row by default

**Implementation:**

```typescript
import React from "react";
import { ChevronDown, Plus, X, CheckCircle, Circle } from "lucide-react";

interface SearchBlockRowProps {
  block: {
    fieldId: string;
    term: string;
    isExact?: boolean;
    showOperators?: boolean;
    hasError?: boolean;
    error?: string;
  };
  fields: Array<{ id: string; label: string }>;
  onFieldChange: (fieldId: string) => void;
  onTermChange: (term: string) => void;
  onIsExactChange: (isExact: boolean) => void;
  onToggleOperators: () => void;
  onRemove: () => void;
}

export function SearchBlockRow({
  block,
  fields,
  onFieldChange,
  onTermChange,
  onIsExactChange,
  onToggleOperators,
  onRemove,
}: SearchBlockRowProps) {
  return (
    <div className="flex gap-3 items-center h-12">
      {/* Field Selector Dropdown */}
      <select
        value={block.fieldId}
        onChange={(e) => onFieldChange(e.target.value)}
        className="w-40 px-3 py-2 border border-gray-300 rounded text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Field</option>
        {fields.map((field) => (
          <option key={field.id} value={field.id}>
            {field.label}
          </option>
        ))}
      </select>

      {/* Search Term Input */}
      <input
        type="text"
        value={block.term}
        onChange={(e) => onTermChange(e.target.value)}
        placeholder="Enter search term..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Is Exact Checkbox (Icon) */}
      <button
        onClick={() => onIsExactChange(!block.isExact)}
        className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
        title="Exact match"
      >
        {block.isExact ? (
          <CheckCircle className="w-5 h-5 text-blue-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expand Operators Button */}
      <button
        onClick={onToggleOperators}
        className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
        title={block.showOperators ? "Hide operators" : "Show operators"}
      >
        {block.showOperators ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Plus className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="w-10 h-10 flex items-center justify-center rounded hover:bg-red-50 transition-colors"
        title="Remove block"
      >
        <X className="w-5 h-5 text-gray-400 hover:text-red-600" />
      </button>
    </div>
  );
}
```

---

### Task 2: Create Collapsible Operators Row

**File:** `components/search/SearchBlockOperatorsRow.tsx`

**Purpose:** Display operators in a secondary row (only when expanded via + button)

**Key Features:**

- Conditional rendering based on `showOperators` state
- Three operator types: AND, OR, EXCLUDE
- Direction selector: "with previous" / "with next"
- Error validation inline
- Smooth expand/collapse animation

**Implementation:**

```typescript
import React from "react";
import { AlertCircle } from "lucide-react";

interface SearchBlockOperatorsRowProps {
  block: {
    operator?: "AND" | "OR" | "EXCLUDE";
    operatorDirection?: "previous" | "next";
    hasError?: boolean;
    errorMessage?: string;
  };
  isFirst: boolean;
  isLast: boolean;
  onOperatorChange: (operator: "AND" | "OR" | "EXCLUDE") => void;
  onDirectionChange: (direction: "previous" | "next") => void;
}

export function SearchBlockOperatorsRow({
  block,
  isFirst,
  isLast,
  onOperatorChange,
  onDirectionChange,
}: SearchBlockOperatorsRowProps) {
  const operator = block.operator || "AND";
  const direction = block.operatorDirection || "next";

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
      {/* Operator Selection */}
      <div className="flex gap-4 items-center">
        <label className="text-xs font-semibold text-gray-700 w-16">
          Operator:
        </label>

        <div className="flex gap-3">
          {/* AND Option */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="operator"
              value="AND"
              checked={operator === "AND"}
              onChange={(e) => onOperatorChange(e.target.value as "AND")}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">AND</span>
          </label>

          {/* OR Option */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="operator"
              value="OR"
              checked={operator === "OR"}
              onChange={(e) => onOperatorChange(e.target.value as "OR")}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">OR</span>
          </label>

          {/* EXCLUDE Option */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="operator"
              value="EXCLUDE"
              checked={operator === "EXCLUDE"}
              onChange={(e) => onOperatorChange(e.target.value as "EXCLUDE")}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">NOT</span>
          </label>
        </div>
      </div>

      {/* Direction Selection (if not first or last) */}
      {!isFirst || !isLast ? (
        <div className="flex gap-4 items-center">
          <label className="text-xs font-semibold text-gray-700 w-16">
            Direction:
          </label>

          <div className="flex gap-3">
            {/* With Previous */}
            {!isFirst && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  value="previous"
                  checked={direction === "previous"}
                  onChange={(e) =>
                    onDirectionChange(e.target.value as "previous")
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">with previous</span>
              </label>
            )}

            {/* With Next */}
            {!isLast && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  value="next"
                  checked={direction === "next"}
                  onChange={(e) => onDirectionChange(e.target.value as "next")}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">with next</span>
              </label>
            )}
          </div>
        </div>
      ) : null}

      {/* Error Message */}
      {block.hasError && block.errorMessage && (
        <div className="flex gap-2 items-start p-3 bg-red-50 rounded border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{block.errorMessage}</p>
        </div>
      )}
    </div>
  );
}
```

---

### Task 3: Create Complete Search Block Component (Unified)

**File:** `components/search/SearchBlockComponent.tsx` (REFACTOR)

**Purpose:** Combine row + operators into single component with state management

**Key Features:**

- Manages `showOperators` state locally
- Handles operator validation
- Displays error states
- Smooth animations for expand/collapse

**Implementation:**

```typescript
import React, { useState } from "react";
import { SearchBlockRow } from "./SearchBlockRow";
import { SearchBlockOperatorsRow } from "./SearchBlockOperatorsRow";
import { SearchBlockErrorRow } from "./SearchBlockErrorRow";

interface SearchBlock {
  id: string;
  fieldId: string;
  term: string;
  isExact?: boolean;
  operator?: "AND" | "OR" | "EXCLUDE";
  operatorDirection?: "previous" | "next";
}

interface SearchBlockComponentProps {
  block: SearchBlock;
  blockIndex: number;
  totalBlocks: number;
  fields: Array<{ id: string; label: string }>;
  validationError?: string;
  onBlockChange: (block: SearchBlock) => void;
  onBlockRemove: () => void;
}

export function SearchBlockComponent({
  block,
  blockIndex,
  totalBlocks,
  fields,
  validationError,
  onBlockChange,
  onBlockRemove,
}: SearchBlockComponentProps) {
  const [showOperators, setShowOperators] = useState(false);

  const handleFieldChange = (fieldId: string) => {
    onBlockChange({ ...block, fieldId });
  };

  const handleTermChange = (term: string) => {
    onBlockChange({ ...block, term });
  };

  const handleIsExactChange = (isExact: boolean) => {
    onBlockChange({ ...block, isExact });
  };

  const handleOperatorChange = (operator: "AND" | "OR" | "EXCLUDE") => {
    onBlockChange({ ...block, operator });
  };

  const handleDirectionChange = (direction: "previous" | "next") => {
    onBlockChange({ ...block, operatorDirection: direction });
  };

  const isFirst = blockIndex === 0;
  const isLast = blockIndex === totalBlocks - 1;
  const hasError = !!validationError;

  return (
    <div
      className={`p-4 transition-all ${
        hasError
          ? "bg-red-50 border-l-4 border-red-600"
          : "bg-white border-b border-gray-200 last:border-b-0"
      }`}
    >
      {/* Main Row */}
      <SearchBlockRow
        block={{ ...block, showOperators, hasError }}
        fields={fields}
        onFieldChange={handleFieldChange}
        onTermChange={handleTermChange}
        onIsExactChange={handleIsExactChange}
        onToggleOperators={() => setShowOperators(!showOperators)}
        onRemove={onBlockRemove}
      />

      {/* Operators Row (Collapsible) */}
      {showOperators && !isFirst && (
        <SearchBlockOperatorsRow
          block={{
            operator: block.operator,
            operatorDirection: block.operatorDirection,
            hasError,
            errorMessage: validationError,
          }}
          isFirst={isFirst}
          isLast={isLast}
          onOperatorChange={handleOperatorChange}
          onDirectionChange={handleDirectionChange}
        />
      )}

      {/* Error Message Row */}
      {hasError && !showOperators && (
        <SearchBlockErrorRow error={validationError || ""} />
      )}
    </div>
  );
}
```

---

### Task 4: Create Error Row Component

**File:** `components/search/SearchBlockErrorRow.tsx`

**Purpose:** Display validation errors with clear visual feedback

**Implementation:**

```typescript
import React from "react";
import { AlertCircle } from "lucide-react";

interface SearchBlockErrorRowProps {
  error: string;
}

export function SearchBlockErrorRow({ error }: SearchBlockErrorRowProps) {
  return (
    <div className="mt-3 p-3 bg-red-50 border-t border-red-200 rounded flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-900">
          Invalid Configuration
        </p>
        <p className="text-sm text-red-700 mt-1">{error}</p>
      </div>
    </div>
  );
}
```

---

### Task 5: Enhanced Operator Validation Module

**File:** `lib/operatorValidator.ts` (CREATE NEW)

**Purpose:** Centralized validation logic for operator combinations

**Key Validations:**

1. Cannot AND/OR with an excluded (NOT) block
2. Cannot reference non-existent previous/next block
3. First block cannot use "with previous"
4. Last block cannot use "with next" without following block
5. EXCLUDE blocks cannot have direction (standalone only)

**Implementation:**

```typescript
export interface ValidationError {
  valid: boolean;
  message?: string;
}

export interface SearchBlockForValidation {
  id: string;
  fieldId: string;
  term: string;
  operator?: "AND" | "OR" | "EXCLUDE";
  operatorDirection?: "previous" | "next";
  isExact?: boolean;
}

/**
 * Validate a single search block against all blocks in the query
 */
export function validateSearchBlock(
  block: SearchBlockForValidation,
  blockIndex: number,
  allBlocks: SearchBlockForValidation[]
): ValidationError {
  // Rule 1: Check if required fields are filled
  if (!block.fieldId || !block.term.trim()) {
    return {
      valid: false,
      message: "Please select a field and enter a search term.",
    };
  }

  // Rule 2: First block shouldn't have operator logic
  if (blockIndex === 0) {
    if (block.operator && block.operator !== "EXCLUDE") {
      return {
        valid: false,
        message: "First block cannot use AND/OR operators.",
      };
    }
  }

  // Rule 3: Cannot AND/OR with excluded block
  if (block.operator === "AND" || block.operator === "OR") {
    if (block.operatorDirection === "previous" && blockIndex > 0) {
      const previousBlock = allBlocks[blockIndex - 1];
      if (previousBlock.operator === "EXCLUDE") {
        return {
          valid: false,
          message: `Cannot ${block.operator} with previous block because it's excluded (NOT).`,
        };
      }
    }

    if (
      block.operatorDirection === "next" &&
      blockIndex < allBlocks.length - 1
    ) {
      const nextBlock = allBlocks[blockIndex + 1];
      if (nextBlock.operator === "EXCLUDE") {
        return {
          valid: false,
          message: `Cannot ${block.operator} with next block because it's excluded (NOT).`,
        };
      }
    }
  }

  // Rule 4: EXCLUDE cannot have direction
  if (block.operator === "EXCLUDE" && block.operatorDirection) {
    return {
      valid: false,
      message: "Excluded (NOT) blocks do not use directional logic.",
    };
  }

  // Rule 5: Last block cannot use "with next"
  if (
    blockIndex === allBlocks.length - 1 &&
    block.operatorDirection === "next"
  ) {
    return {
      valid: false,
      message: 'Last block cannot use "with next" operator.',
    };
  }

  // All validations passed
  return { valid: true };
}

/**
 * Validate entire query structure
 */
export function validateAllBlocks(
  blocks: SearchBlockForValidation[]
): Map<string, ValidationError> {
  const errors = new Map<string, ValidationError>();

  blocks.forEach((block, index) => {
    const validation = validateSearchBlock(block, index, blocks);
    if (!validation.valid) {
      errors.set(block.id, validation);
    }
  });

  return errors;
}

/**
 * Get suggested operator for a block
 */
export function getSuggestedOperator(
  blockIndex: number,
  totalBlocks: number
): "AND" | "OR" | null {
  // First block: no operator needed
  if (blockIndex === 0) {
    return null;
  }

  // Default to AND for subsequent blocks
  return "AND";
}

/**
 * Get available directions for a block
 */
export function getAvailableDirections(
  blockIndex: number,
  totalBlocks: number
): Array<"previous" | "next"> {
  const directions: Array<"previous" | "next"> = [];

  if (blockIndex > 0) {
    directions.push("previous");
  }

  if (blockIndex < totalBlocks - 1) {
    directions.push("next");
  }

  return directions;
}
```

---

### Task 6: Update QueryBuilder Main Component

**File:** `components/QueryBuilder.tsx` (REFACTOR)

**Purpose:** Integrate new search block components with validation

**Key Changes:**

- Use new `SearchBlockComponent` with validation
- Pass validation errors to each block
- Display validation errors in UI
- Disable search button if validation errors exist

**Implementation Snippet:**

```typescript
import React, { useState, useMemo } from "react";
import { SearchBlockComponent } from "./search/SearchBlockComponent";
import { ActionButtonsSection } from "./search/ActionButtonsSection";
import { QueryPreviewSection } from "./preview/QueryPreviewSection";
import { validateAllBlocks } from "@/lib/operatorValidator";
import type { SearchBlockForValidation } from "@/lib/operatorValidator";

interface SearchBlock extends SearchBlockForValidation {
  id: string;
}

export function QueryBuilder() {
  const [blocks, setBlocks] = useState<SearchBlock[]>([
    {
      id: "1",
      fieldId: "",
      term: "",
      isExact: false,
      operator: "AND",
      operatorDirection: "next",
    },
  ]);

  const [fields] = useState([
    { id: "all", label: "All Fields" },
    { id: "article_title", label: "Article Title" },
    { id: "author", label: "Author" },
    // ... more fields
  ]);

  // Validate all blocks
  const validationErrors = useMemo(() => validateAllBlocks(blocks), [blocks]);

  const hasErrors = validationErrors.size > 0;

  const handleBlockChange = (blockId: string, updatedBlock: SearchBlock) => {
    setBlocks(blocks.map((b) => (b.id === blockId ? updatedBlock : b)));
  };

  const handleBlockRemove = (blockId: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter((b) => b.id !== blockId));
    }
  };

  const handleAddBlock = () => {
    const newBlock: SearchBlock = {
      id: Date.now().toString(),
      fieldId: "",
      term: "",
      isExact: false,
      operator: "AND",
      operatorDirection: "next",
    };
    setBlocks([...blocks, newBlock]);
  };

  return (
    <main className="p-8 space-y-8">
      {/* Search Blocks Container */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {blocks.map((block, index) => (
          <SearchBlockComponent
            key={block.id}
            block={block}
            blockIndex={index}
            totalBlocks={blocks.length}
            fields={fields}
            validationError={validationErrors.get(block.id)?.message}
            onBlockChange={(updated) => handleBlockChange(block.id, updated)}
            onBlockRemove={() => handleBlockRemove(block.id)}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <ActionButtonsSection
        onAddBlock={handleAddBlock}
        onSearch={() => {
          // Handle search
        }}
        hasErrors={hasErrors}
      />

      {/* Query Preview */}
      <QueryPreviewSection blocks={blocks} />
    </main>
  );
}
```

---

### Task 7: Update SearchBlocksContainer

**File:** `components/search/SearchBlocksContainer.tsx` (UPDATE)

**Purpose:** Ensure container properly wraps all blocks with unified styling

**Updated Implementation:**

```typescript
import React from "react";
import { SearchBlockComponent } from "./SearchBlockComponent";
import type { SearchBlock } from "@/types/search";

interface SearchBlocksContainerProps {
  blocks: SearchBlock[];
  fields: Array<{ id: string; label: string }>;
  validationErrors: Map<string, string>;
  onBlockChange: (blockId: string, block: SearchBlock) => void;
  onBlockRemove: (blockId: string) => void;
}

export function SearchBlocksContainer({
  blocks,
  fields,
  validationErrors,
  onBlockChange,
  onBlockRemove,
}: SearchBlocksContainerProps) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      {blocks.map((block, index) => (
        <SearchBlockComponent
          key={block.id}
          block={block}
          blockIndex={index}
          totalBlocks={blocks.length}
          fields={fields}
          validationError={validationErrors.get(block.id)}
          onBlockChange={(updated) => onBlockChange(block.id, updated)}
          onBlockRemove={() => onBlockRemove(block.id)}
        />
      ))}
    </div>
  );
}
```

---

### Task 8: Create/Update Types

**File:** `types/search.ts` (CREATE or UPDATE)

**Purpose:** Define TypeScript interfaces for search blocks

**Implementation:**

```typescript
export type OperatorType = "AND" | "OR" | "EXCLUDE";
export type OperatorDirection = "previous" | "next";

export interface SearchBlock {
  id: string;
  fieldId: string;
  term: string;
  isExact?: boolean;
  operator?: OperatorType;
  operatorDirection?: OperatorDirection;
}

export interface SearchField {
  id: string;
  label: string;
  gsOperator?: string | null;
  mustQuote?: boolean;
}

export interface ValidationError {
  valid: boolean;
  message?: string;
}

export interface QueryBuilderState {
  blocks: SearchBlock[];
  selectedFields: string[];
  selectedJournals: string[];
  yearFrom?: number;
  yearTo?: number;
}
```

---

### Task 9: Styling Guidelines for Phase 2

**File:** `styles/phase2-components.css` (or use Tailwind utilities)

**Key Styling Updates:**

```css
/* Search Block Container */
.search-blocks-container {
  @apply border border-gray-300 rounded-lg overflow-hidden shadow-sm;
}

/* Individual Search Block */
.search-block {
  @apply p-4 border-b border-gray-200 transition-all;
}

.search-block:last-child {
  @apply border-b-0;
}

.search-block.error {
  @apply bg-red-50 border-l-4 border-red-600;
}

.search-block.error .search-block-row {
  @apply bg-white;
}

/* Operators Row (Expanded) */
.operators-row {
  @apply mt-3 pt-3 border-t border-gray-200 space-y-3 animate-fadeIn;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 200px;
  }
}

/* Icon Buttons */
.icon-button {
  @apply w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 transition-colors;
}

.icon-button:focus {
  @apply ring-2 ring-blue-500 outline-none;
}

/* Error Display */
.error-row {
  @apply mt-3 p-3 bg-red-50 border-t border-red-200 rounded flex items-start gap-3;
}
```

---

## File Structure Summary

### New Components Created

```
components/
├── search/
│   ├── SearchBlockRow.tsx (NEW - single line row)
│   ├── SearchBlockOperatorsRow.tsx (NEW - collapsible operators)
│   ├── SearchBlockErrorRow.tsx (NEW - error display)
│   ├── SearchBlockComponent.tsx (REFACTOR - unified component)
│   └── SearchBlocksContainer.tsx (UPDATE - wrapper with validation)
├── QueryBuilder.tsx (REFACTOR - integrate validation)
└── preview/
    └── QueryPreviewSection.tsx (no changes needed)
```

### New Libraries/Modules

```
lib/
└── operatorValidator.ts (NEW - comprehensive validation logic)

types/
└── search.ts (NEW or UPDATE - TypeScript interfaces)
```

---

## Implementation Checklist

### Step 1: Create New Components

- [ ] Create `SearchBlockRow.tsx` with icon buttons
- [ ] Create `SearchBlockOperatorsRow.tsx` with radio selections
- [ ] Create `SearchBlockErrorRow.tsx` with error display
- [ ] Create/Update `types/search.ts` with interfaces

### Step 2: Create Validation Module

- [ ] Create `lib/operatorValidator.ts` with all validation rules
- [ ] Implement `validateSearchBlock()` function
- [ ] Implement `validateAllBlocks()` function
- [ ] Add helper functions for suggestions

### Step 3: Refactor Components

- [ ] Update `SearchBlockComponent.tsx` to use new row components
- [ ] Update `SearchBlocksContainer.tsx` with validation integration
- [ ] Update `QueryBuilder.tsx` main component to use validation
- [ ] Remove old operator dropdown code

### Step 4: Styling & Polish

- [ ] Apply Tailwind classes to all new components
- [ ] Add focus states and accessibility features
- [ ] Test error states visually
- [ ] Add smooth animations for expand/collapse

### Step 5: Testing & Validation

- [ ] Test all validation rules
- [ ] Verify error messages are clear
- [ ] Test operator combinations
- [ ] Test expand/collapse functionality
- [ ] Test on different screen sizes
- [ ] Test keyboard navigation
- [ ] Test accessibility with screen readers

---

## Visual Comparison - Before & After

### Before Phase 2 (After Phase 1)

```
┌─────────────────────────────────────────────┐
│ Field: [Select Field ▼]                     │
│ Term: [Enter search term...]                │
│ Is Exact: [checkbox]                        │
│ Operators: [AND ▼] [Previous/Next ▼]        │
│ [Remove]                                    │
├─────────────────────────────────────────────┤
│ Field: [Select Field ▼]                     │
│ Term: [Enter search term...]                │
│ Is Exact: [checkbox]                        │
│ Operators: [AND ▼] [Previous/Next ▼]        │
│ [Remove]                                    │
└─────────────────────────────────────────────┘
```

### After Phase 2 (Simplified)

```
┌─────────────────────────────────────────────┐
│ [Select Field ▼] | [search...] | ✓ | + | × │
├─────────────────────────────────────────────┤
│ [Select Field ▼] | [search...] | ✓ | + | × │
│                                              │
│ When + clicked:                             │
│ Operator: (◉) AND  (◯) OR  (◯) NOT         │
│ Direction: (◉) previous (◯) next           │
└─────────────────────────────────────────────┘
```

---

## Validation Rule Examples

### Valid Configurations

✅ Block 1: field="title", term="AI", operator=N/A (first block)
✅ Block 2: field="author", term="Smith", operator="AND", direction="previous"
✅ Block 3: field="source", term="Nature", operator="OR", direction="previous"

### Invalid Configurations

❌ Block 1: operator="AND" (first block cannot have operator)
❌ Block 1: operator="EXCLUDE"
Block 2: operator="AND", direction="previous" (cannot AND with excluded)
❌ Block 3 (last block): operator="OR", direction="next" (no next block exists)

---

## Animation Preferences

### Expand/Collapse Operators

```css
Duration: 250ms
Easing: ease-in-out
Effect: Max-height + opacity fade
```

### Error Appearance

```css
Duration: 200ms
Easing: ease-out
Effect: Slide down + fade in
```

### Block Removal

```css
Duration: 200ms
Easing: ease-in
Effect: Slide out + fade out
```

---

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Accessibility Considerations

- All buttons have proper `title` attributes for tooltips
- Keyboard navigation: Tab through fields, Enter to toggle operators
- Screen reader: Proper labels and ARIA attributes on radio buttons
- Focus states: Visible blue ring around focused elements
- Error messages: Associated with error elements
- Color not sole indicator: Use icons + text for error states

---

## Performance Notes

- Component re-renders optimized with `useMemo` for validation
- Event handlers use proper closure to avoid prop drilling
- No unnecessary state updates
- Validation runs only when blocks change
- Icons from lucide-react (tree-shakeable)

---

## Migration Path from Phase 1

1. **Backward Compatibility:** Phase 2 components can coexist with Phase 1
2. **Gradual Rollout:** Update one search block at a time
3. **Fallback:** If validation fails, show clear error message
4. **Data Preservation:** All user input is preserved during refactor

---

## Next Phase (Phase 3) Preview

Phase 3 will focus on:

- Hidden advanced filters toggle
- Year range and document type filters
- Enhanced query preview with syntax highlighting
- Smooth transitions and animations throughout

---

## Notes & Considerations

- **Scope:** Phase 2 focuses on UI simplification only
- **Logic Preservation:** All existing validation rules remain
- **User Intent:** Prioritize clarity over feature density
- **Progressive Disclosure:** Show complexity only when needed
- **Mobile First:** Consider mobile layouts for all new components
