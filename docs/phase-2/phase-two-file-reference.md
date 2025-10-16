# Phase two Implementation - File Reference Guide

## All Created Files (Ready to Use)

### 1. Type System

**File:** `/components/types/search.ts`

```typescript
// Import in your components like:
import type {
  SearchBlock,
  OperatorType,
  OperatorDirection,
  ValidationResult,
  SearchField,
} from "@/types/search";
```

**Exports:**

- `OperatorType` - Type: `'AND' | 'OR' | 'EXCLUDE'`
- `OperatorDirection` - Type: `'previous' | 'next'`
- `SearchBlock` - Interface
- `SearchField` - Interface
- `ValidationResult` - Interface

---

### 2. Validation System

**File:** `/lib/operatorValidator.ts`

```typescript
// Import in your components like:
import {
  validateSearchBlock,
  validateAllBlocks,
  getSuggestedOperator,
  getAvailableDirections,
} from "@/lib/operatorValidator";
```

**Functions:**

```typescript
// Validate single block
const result = validateSearchBlock(block, 0, 3);
// Returns: { isValid: boolean, message?: string }

// Validate all blocks
const results = validateAllBlocks(blocks);
// Returns: Map<blockId, ValidationResult>

// Get suggested operator for position
const op = getSuggestedOperator(0);
// Returns: 'AND' | null (null for first block)

// Get available directions for position
const dirs = getAvailableDirections(1, 3);
// Returns: ['previous', 'next'] | ['previous'] | []
```

---

### 3. Components

#### A. SearchBlockRow

**File:** `/components/search/SearchBlockRow.tsx`

```typescript
import { SearchBlockRow } from "@/components/search/SearchBlockRow";
import type { SearchField } from "@/types/search";

// Usage:
<SearchBlockRow
  fieldId="article_title"
  term="AI Agent"
  isExact={false}
  showOperators={false}
  onFieldChange={(id) => console.log(id)}
  onTermChange={(term) => console.log(term)}
  onIsExactChange={(exact) => console.log(exact)}
  onShowOperatorsChange={(show) => console.log(show)}
  onRemove={() => console.log("removed")}
  fields={GS_SEARCH_FIELDS}
/>;
```

**Props:**

- `fieldId: string` - Selected search field ID
- `term: string` - User input term
- `isExact: boolean` - Exact phrase flag
- `showOperators: boolean` - Operators panel visibility
- `onFieldChange: (fieldId: string) => void` - Field change handler
- `onTermChange: (term: string) => void` - Term change handler
- `onIsExactChange: (isExact: boolean) => void` - Exact flag handler
- `onShowOperatorsChange: (show: boolean) => void` - Operators visibility toggle
- `onRemove: () => void` - Remove block handler
- `fields: SearchField[]` - Available fields list

**Features:**

- Single-line layout with 5 controls
- Field dropdown
- Term input (flex-1)
- Exact phrase toggle (Circle/CheckCircle icon)
- Operators toggle (+/✕ icon)
- Remove button (× icon)

---

#### B. SearchBlockOperatorsRow

**File:** `/components/search/SearchBlockOperatorsRow.tsx`

```typescript
import { SearchBlockOperatorsRow } from "@/components/search/SearchBlockOperatorsRow";
import type { OperatorType, OperatorDirection } from "@/types/search";

// Usage:
<SearchBlockOperatorsRow
  operator="AND"
  operatorDirection="next"
  isFirst={false}
  isLast={false}
  onOperatorChange={(op) => console.log(op)}
  onDirectionChange={(dir) => console.log(dir)}
  hasError={false}
  errorMessage="Error message"
/>;
```

**Props:**

- `operator?: OperatorType` - Current operator ('AND' | 'OR' | 'EXCLUDE')
- `operatorDirection?: OperatorDirection` - Current direction ('previous' | 'next')
- `isFirst: boolean` - Is this the first block?
- `isLast: boolean` - Is this the last block?
- `onOperatorChange: (operator: OperatorType) => void` - Operator change handler
- `onDirectionChange: (direction: OperatorDirection) => void` - Direction change handler
- `hasError: boolean` - Show error styling?
- `errorMessage?: string` - Error message to display

**Features:**

- Operator selection (AND/OR/EXCLUDE radio buttons)
- Direction selection (conditional based on position)
- Error display with AlertCircle icon
- Smooth expand animation

---

#### C. SearchBlockErrorRow

**File:** `/components/search/SearchBlockErrorRow.tsx`

```typescript
import { SearchBlockErrorRow } from "@/components/search/SearchBlockErrorRow";

// Usage:
<SearchBlockErrorRow
  title="Invalid Configuration"
  message="Field and search term are required"
/>;
```

**Props:**

- `title?: string` - Error title (default: "Invalid Configuration")
- `message: string` - Error message text

**Features:**

- Red background styling
- AlertCircle icon
- Bold title, regular message

---

#### D. SearchBlockComponentPhase two (UNIFIED COMPONENT)

**File:** `/components/search/SearchBlockComponentPhase two.tsx`

```typescript
import { SearchBlockComponentPhase two } from '@/components/search/SearchBlockComponentPhase two';
import type { SearchBlock, SearchField } from '@/types/search';

// Usage:
<SearchBlockComponentPhase two
  block={block}
  onChange={(updatedBlock) => console.log(updatedBlock)}
  onRemove={() => console.log('removed')}
  isOnlyBlock={false}
  index={0}
  fields={GS_SEARCH_FIELDS}
  totalBlocks={3}
/>
```

**Props:**

- `block: SearchBlock` - Current block data
- `onChange: (block: SearchBlock) => void` - Block change handler
- `onRemove: () => void` - Remove handler
- `isOnlyBlock: boolean` - Is this the only block?
- `index: number` - Block index (0-based)
- `fields: SearchField[]` - Available search fields
- `totalBlocks: number` - Total blocks in query

**Features:**

- Combines SearchBlockRow + SearchBlockOperatorsRow + SearchBlockErrorRow
- Manages `showOperators` state internally
- Handles all validation
- Automatic error display
- Clean API for parent components

**This is the PRIMARY component to use!**

---

#### E. SearchBlocksContainer (UPDATED)

**File:** `/components/search/SearchBlocksContainer.tsx`

```typescript
import { SearchBlocksContainer } from "@/components/search/SearchBlocksContainer";

// Usage (existing SearchBlockComponent):
<SearchBlocksContainer
  blocks={blocks}
  onBlockChange={handleChange}
  onBlockRemove={handleRemove}
/>;
```

**Props:**

- `blocks: SearchBlock[]` - Array of blocks
- `onBlockChange: (index: number, block: SearchBlock) => void` - Change handler
- `onBlockRemove: (index: number) => void` - Remove handler

**Note:** Currently uses legacy `SearchBlockComponent` for compatibility. Will be updated in Phase three.

---

## Import Paths Reference

### From Type Definitions

```typescript
import type {
  SearchBlock,
  OperatorType,
  OperatorDirection,
  ValidationResult,
  SearchField,
} from "@/types/search";
```

### From Validation System

```typescript
import {
  validateSearchBlock,
  validateAllBlocks,
  getSuggestedOperator,
  getAvailableDirections,
} from "@/lib/operatorValidator";
```

### From Components (Individual)

```typescript
import { SearchBlockRow } from '@/components/search/SearchBlockRow';
import { SearchBlockOperatorsRow } from '@/components/search/SearchBlockOperatorsRow';
import { SearchBlockErrorRow } from '@/components/search/SearchBlockErrorRow';
import { SearchBlockComponentPhase two } from '@/components/search/SearchBlockComponentPhase two';
import { SearchBlocksContainer } from '@/components/search/SearchBlocksContainer';
```

### From Existing Code

```typescript
import { GS_SEARCH_FIELDS } from "@/data/SearchWithin";
import { SearchBlock } from "@/lib/qtm";
```

---

## File Structure Summary

```
/Users/adedotungabriel/work/me/gs-search-kit/

types/
└── search.ts (NEW - 43 lines)
    Types and interfaces

lib/
├── operatorValidator.ts (NEW - 153 lines)
│   Validation logic and suggestions
└── (existing files)

components/
└── search/
    ├── SearchBlockRow.tsx (NEW - 93 lines)
    ├── SearchBlockOperatorsRow.tsx (NEW - 128 lines)
    ├── SearchBlockErrorRow.tsx (NEW - 25 lines)
    ├── SearchBlockComponentPhase two.tsx (NEW - 97 lines)
    ├── SearchBlocksContainer.tsx (MODIFIED)
    └── (existing files)

docs/phase-2/
├── phase-two-implementation-changelist.md (NEW)
├── phase-two-file-reference.md (THIS FILE)
├── phase-two-quick-summary.md (NEW)
└── (existing files)
```

---

## Complete Code Statistics

| Category       | Count | Lines   |
| -------------- | ----- | ------- |
| New Type Files | 1     | 43      |
| New Lib Files  | 1     | 153     |
| New Components | 4     | 343     |
| Modified Files | 1     | 29      |
| **TOTAL**      | **7** | **568** |

---

## Quick Start Guide

### 1. Use Phase two in Your Form

```tsx
import { SearchBlockComponentPhase two } from '@/components/search/SearchBlockComponentPhase two';
import type { SearchBlock } from '@/types/search';
import { GS_SEARCH_FIELDS } from '@/data/SearchWithin';

export function QueryBuilder() {
  const [blocks, setBlocks] = useState<SearchBlock[]>([
    { id: '0', fieldId: 'article_title', term: '', isExact: false }
  ]);

  return (
    <div>
      {blocks.map((block, idx) => (
        <SearchBlockComponentPhase two
          key={block.id}
          block={block}
          onChange={(updated) => {
            const newBlocks = [...blocks];
            newBlocks[idx] = updated;
            setBlocks(newBlocks);
          }}
          onRemove={() => {
            setBlocks(blocks.filter((_, i) => i !== idx));
          }}
          isOnlyBlock={blocks.length === 1}
          index={idx}
          fields={GS_SEARCH_FIELDS}
          totalBlocks={blocks.length}
        />
      ))}
      <button onClick={() => {
        setBlocks([...blocks, {
          id: String(blocks.length),
          fieldId: '',
          term: '',
          isExact: false,
        }]);
      }}>
        + Add Search
      </button>
    </div>
  );
}
```

### 2. Validate Before Submit

```tsx
import { validateAllBlocks } from "@/lib/operatorValidator";

function handleSubmit() {
  const errors = validateAllBlocks(blocks);

  if (errors.size > 0) {
    errors.forEach((result, blockId) => {
      if (!result.isValid) {
        console.error(`Block ${blockId}: ${result.message}`);
      }
    });
    return;
  }

  // All valid, proceed with search
  const q = buildScholarUrl(blocks);
  window.location.href = q;
}
```

### 3. Get Suggestions

```tsx
import {
  getSuggestedOperator,
  getAvailableDirections,
} from "@/lib/operatorValidator";

// Suggest AND for block 2
const op = getSuggestedOperator(1); // Returns 'AND'

// Get directions for middle block
const dirs = getAvailableDirections(1, 3); // Returns ['previous', 'next']
```

---

## File Dependency Graph

```
SearchBlockComponentPhase two (MAIN)
├── SearchBlockRow
├── SearchBlockOperatorsRow
├── SearchBlockErrorRow
└── operatorValidator (for validation)

operatorValidator
└── types/search.ts

SearchBlocksContainer
├── SearchBlockComponent (Phase I - legacy)
└── (to be updated in Phase three)

QueryBuilder (to be updated in Phase three)
└── SearchBlockComponentPhase two (will use this)
```

---

## Next Steps

1. ✅ Phase two Foundation Complete
2. ⏳ Phase three: Update QueryBuilder to use Phase two
3. ⏳ Phase IV: Testing and documentation

**Ready to proceed to Phase three integration!**
