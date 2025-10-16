# UI Layout Implementation - Phase 1: Repositioning Only

## Overview

This document focuses on **rearranging the existing UI components** to match the desired layout from your sketch. No new features will be added at this stage - only repositioning of existing functionality.

## Current State vs Target State

### Current Layout

```
Single column layout with:
- Search blocks stacked vertically with individual borders
- Global filters mixed with search interface
- Journal selection embedded in components
- Query preview at bottom
```

### Target Layout (From Your Sketch)

```
Two-column layout:
LEFT SIDEBAR (300px fixed):
  - Year Range Filters (top)
  - Field of Research Selector
  - Journal Ratings Filter
  - Selected Journals List

RIGHT MAIN CONTENT (flexible):
  - Year Low | Year High | Field | [×]
  - Operators | is exact checkbox
  - Unified Search Blocks Container (single border, no internal separators)
    - Block 1: [Field] [Term] [○] [×]
    -         [Operators] [is exact checkbox]
    - Block 2: [Field] [Term] [○] [×]
    -         [Operators] [is exact checkbox]
    - Block N with ERROR STATE (red border + message)
  - [Add Another] [Search Button]
  - Query Preview (bottom)
```

---

## Implementation Tasks (Phase 1 - Layout Only)

### Task 1: Create Main Layout Component

**File:** `components/layouts/MainLayout.tsx`

**Purpose:** Create the two-column layout container

**Requirements:**

- Fixed 300px left sidebar
- Flexible right main content area
- Responsive: sidebar becomes hamburger on mobile (defer to Phase 2)
- No functional changes - pure layout

**Pseudo-structure:**

```typescript
export function MainLayout() {
  return (
    <div className="flex h-screen">
      {/* LEFT SIDEBAR - 300px fixed */}
      <aside className="w-80 fixed h-screen bg-gray-50 border-r border-gray-200">
        {/* Sidebar sections go here */}
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main className="flex-1 ml-80 bg-white">
        {/* Main content goes here */}
      </main>
    </div>
  );
}
```

---

### Task 2: Refactor Sidebar Components

**File:** `components/sidebar/SidebarContainer.tsx`

**Purpose:** Container for all sidebar sections

**Sections to move into sidebar:**

1. Year Range Filters (move from main content)
2. Field of Research Selector (move from global filters)
3. Journal Ratings Filter (move from journal selector)
4. Selected Journals List (move from journal selector display)

**Pseudo-structure:**

```typescript
export function SidebarContainer() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* 1. Year Range Filters */}
      <YearRangeFiltersSidebar />

      {/* 2. Field of Research */}
      <FieldOfResearchSidebar />

      {/* 3. Journal Ratings */}
      <JournalRatingsSidebar />

      {/* 4. Selected Journals */}
      <SelectedJournalsSidebar />
    </div>
  );
}
```

---

### Task 3: Create Sidebar Section Components

#### 3.1 Year Range Filters Sidebar

**File:** `components/sidebar/sections/YearRangeFiltersSidebar.tsx`

**Current location:** Global filters in main content
**New location:** Top of sidebar
**Changes:** Only layout adjustment (side-by-side inputs in 300px width)

```typescript
export function YearRangeFiltersSidebar() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900">Year Range</h3>
      <div className="flex gap-1">
        <input
          type="number"
          placeholder="From"
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
        />
        <input
          type="number"
          placeholder="To"
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
        />
      </div>
    </div>
  );
}
```

#### 3.2 Field of Research Sidebar

**File:** `components/sidebar/sections/FieldOfResearchSidebar.tsx`

**Current location:** Not currently in UI (new collection, existing data source)
**New location:** Sidebar below year filters
**Changes:** Display existing field data with checkboxes

```typescript
export function FieldOfResearchSidebar() {
  // Use existing field data from journalLoader
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900">Field of Research</h3>
      <div className="border border-gray-300 rounded">
        {/* Checkbox list of fields */}
        {/* Each with count badge */}
      </div>
      <div className="flex gap-1">
        <button className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
          Select All
        </button>
        <button className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
          Clear All
        </button>
      </div>
    </div>
  );
}
```

#### 3.3 Journal Ratings Filter Sidebar

**File:** `components/sidebar/sections/JournalRatingsSidebar.tsx`

**Current location:** Not in primary UI position
**New location:** Sidebar below field selector
**Changes:** Display ratings (A\*, A, B, C) with checkboxes

```typescript
export function JournalRatingsSidebar() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900">Journal Ratings</h3>
      <div className="space-y-2">
        {/* A* checkbox */}
        {/* A checkbox */}
        {/* B checkbox */}
        {/* C checkbox */}
      </div>
      <div className="flex gap-1">
        <button className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
          Show All
        </button>
        <button className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
          Show None
        </button>
      </div>
    </div>
  );
}
```

#### 3.4 Selected Journals Sidebar

**File:** `components/sidebar/sections/SelectedJournalsSidebar.tsx`

**Current location:** SimplifiedJournalSelector component
**New location:** Sidebar, bottom section
**Changes:** Display list format instead of dropdown

```typescript
export function SelectedJournalsSidebar({ selectedJournals, onRemove }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900">
        Selected Journals ({selectedJournals.length})
      </h3>
      <div className="border border-gray-300 rounded max-h-64 overflow-y-auto">
        {selectedJournals.map((journal) => (
          <div
            key={journal.issn}
            className="p-3 border-b last:border-b-0 flex justify-between items-start"
          >
            <div className="flex-1">
              <div className="text-sm font-semibold">{journal.name}</div>
              <div className="text-xs text-gray-600">ISSN: {journal.issn}</div>
            </div>
            <div className="flex gap-2 ml-2">
              <span className="text-xs font-bold px-2 py-1 rounded bg-red-100 text-red-700">
                {journal.rating}
              </span>
              <button className="text-gray-400 hover:text-red-600">×</button>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full px-2 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50">
        Clear All Selected
      </button>
    </div>
  );
}
```

---

### Task 4: Refactor Main Content Layout

**File:** `components/layouts/MainContentArea.tsx`

**Purpose:** Restructure the main content area

**New structure:**

```
1. Header Section (Year Low, Year High, Field, Remove button)
2. Unified Search Blocks Container
3. Action Buttons (Add Another, Search)
4. Query Preview
```

**Pseudo-structure:**

```typescript
export function MainContentArea() {
  return (
    <main className="p-8 space-y-8">
      {/* HEADER SECTION */}
      <SearchHeaderSection />

      {/* UNIFIED SEARCH BLOCKS CONTAINER */}
      <SearchBlocksContainer />

      {/* ACTION BUTTONS */}
      <ActionButtonsSection />

      {/* QUERY PREVIEW */}
      <QueryPreviewSection />
    </main>
  );
}
```

---

### Task 5: Create Search Header Section

**File:** `components/search/SearchHeaderSection.tsx`

**Purpose:** Display year inputs and field selector in header row

**Layout:** `[Year Low (100px)] [Year High (120px)] [Field Selector (flex)]`

**Pseudo-structure:**

```typescript
export function SearchHeaderSection() {
  return (
    <div className="flex gap-4 items-center pb-4 border-b border-gray-200">
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Year Low</label>
        <input
          type="number"
          placeholder="From"
          className="w-24 px-3 py-2 border border-gray-300 rounded text-sm"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Year High</label>
        <input
          type="number"
          placeholder="To"
          className="w-28 px-3 py-2 border border-gray-300 rounded text-sm"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Field</label>
        <select className="px-3 py-2 border border-gray-300 rounded text-sm bg-white">
          {/* Field options */}
        </select>
      </div>

      <button className="mt-5 text-gray-400 hover:text-red-600 text-xl">
        ×
      </button>
    </div>
  );
}
```

---

### Task 6: Create Unified Search Blocks Container

**File:** `components/search/SearchBlocksContainer.tsx`

**Purpose:** Wrap all search blocks in single border container with NO internal separators

**Key changes:**

- Single outer border (8px radius, light gray)
- No borders between blocks
- Padding between blocks only (12-16px)
- Subtle horizontal lines or just spacing between blocks

**Pseudo-structure:**

```typescript
export function SearchBlocksContainer({
  blocks,
  onBlockChange,
  onBlockRemove,
}) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {blocks.map((block, index) => (
        <div
          key={index}
          className={`p-4 ${
            index !== blocks.length - 1 ? "border-b border-gray-200" : ""
          }`}
        >
          <SearchBlockRow
            block={block}
            index={index}
            onChange={(updated) => onBlockChange(index, updated)}
            onRemove={() => onBlockRemove(index)}
          />

          {block.showOperators && (
            <SearchBlockOperatorsRow
              block={block}
              onChange={(updated) => onBlockChange(index, updated)}
            />
          )}

          {block.hasError && <ErrorMessageRow error={block.error} />}
        </div>
      ))}
    </div>
  );
}
```

---

### Task 7: Refactor SearchBlockComponent

**File:** `components/search/SearchBlockRow.tsx`

**Purpose:** Single-line search block layout

**Current:** Separate borders, labels visible
**New:** Clean row without labels, compact layout

**Pseudo-structure:**

```typescript
export function SearchBlockRow({
  block,
  onRemove,
  onChange,
  showOperators,
  onToggleOperators,
}) {
  return (
    <div className="flex gap-3 items-center h-10">
      {/* Field Selector */}
      <select
        value={block.fieldId}
        onChange={(e) => onChange({ ...block, fieldId: e.target.value })}
        className="w-1/4 px-3 py-2 border border-gray-300 rounded text-sm bg-white"
      >
        {/* Options */}
      </select>

      {/* Search Term */}
      <input
        type="text"
        value={block.term}
        onChange={(e) => onChange({ ...block, term: e.target.value })}
        placeholder="Enter search term..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
      />

      {/* Is Exact Checkbox (icon only) */}
      <div className="flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100 cursor-pointer">
        <input
          type="checkbox"
          checked={block.isExact || false}
          onChange={(e) => onChange({ ...block, isExact: e.target.checked })}
          className="w-5 h-5"
          title="Exact match"
        />
      </div>

      {/* Expand Operators Button (optional icon or +) */}
      <button
        onClick={onToggleOperators}
        className="flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100"
        title="Toggle operators"
      >
        {showOperators ? "−" : "+"}
      </button>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
      >
        ×
      </button>
    </div>
  );
}
```

---

### Task 8: Create Search Block Operators Row

**File:** `components/search/SearchBlockOperatorsRow.tsx`

**Purpose:** Display operators in secondary row (only when expanded)

**Pseudo-structure:**

```typescript
export function SearchBlockOperatorsRow({ block, onChange }) {
  return (
    <div className="mt-2 pt-2 border-t border-gray-200 flex gap-3 items-center text-xs">
      <span className="text-gray-600 w-20 text-right">Operators</span>

      {/* Operator controls - radio buttons or select */}
      <div className="flex gap-2">
        {/* AND option */}
        {/* OR option */}
        {/* EXCLUDE option */}
      </div>

      <span className="ml-auto text-gray-600">is exact checkbox</span>
    </div>
  );
}
```

---

### Task 9: Create Error State Component

**File:** `components/search/SearchBlockErrorRow.tsx`

**Purpose:** Display error message for invalid search block

**Pseudo-structure:**

```typescript
export function SearchBlockErrorRow({ error }) {
  return (
    <div className="mt-2 p-3 bg-red-50 border-t border-red-200 flex items-center gap-2 text-sm text-red-700">
      <span className="text-lg">⚠️</span>
      <span>{error}</span>
    </div>
  );
}
```

---

### Task 10: Create Action Buttons Section

**File:** `components/search/ActionButtonsSection.tsx`

**Purpose:** Display Add Another and Search buttons

**Pseudo-structure:**

```typescript
export function ActionButtonsSection({ onAddBlock, onSearch, hasErrors }) {
  return (
    <div className="flex gap-4 justify-center pt-4">
      <button
        onClick={onAddBlock}
        className="px-8 py-3 border border-gray-300 rounded text-sm font-semibold hover:bg-gray-50"
      >
        Add Another
      </button>

      <button
        onClick={onSearch}
        disabled={hasErrors}
        className="px-12 py-3 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Search Button
      </button>
    </div>
  );
}
```

---

### Task 11: Refactor Query Preview Section

**File:** `components/preview/QueryPreviewSection.tsx`

**Purpose:** Keep query preview at bottom of main content

**No functional changes - only ensure it's positioned at bottom of main content**

**Positioning:** After action buttons

---

### Task 12: Update Main App/Page Component

**File:** `app/page.tsx` or `components/QueryBuilder.tsx`

**Purpose:** Update root component to use new layout structure

**Changes:**

- Import MainLayout
- Move state management to MainLayout level or pass through
- Remove old layout structure
- Ensure all existing functionality is preserved

**Pseudo-structure:**

```typescript
export default function QueryBuilder() {
  return <MainLayout>{/* All existing components repositioned */}</MainLayout>;
}
```

---

## File Structure Summary

### New Components to Create

```
components/
├── layouts/
│   ├── MainLayout.tsx (NEW - main two-column layout)
│   └── MainContentArea.tsx (NEW - right column content)
├── sidebar/
│   ├── SidebarContainer.tsx (NEW - sidebar wrapper)
│   └── sections/
│       ├── YearRangeFiltersSidebar.tsx (NEW - moved from main)
│       ├── FieldOfResearchSidebar.tsx (NEW - moved/reorganized)
│       ├── JournalRatingsSidebar.tsx (NEW - moved from filters)
│       └── SelectedJournalsSidebar.tsx (NEW - moved from journal selector)
├── search/
│   ├── SearchHeaderSection.tsx (NEW - year/field header)
│   ├── SearchBlocksContainer.tsx (NEW - unified container)
│   ├── SearchBlockRow.tsx (REFACTOR - simplified single row)
│   ├── SearchBlockOperatorsRow.tsx (NEW - collapsible operators)
│   ├── SearchBlockErrorRow.tsx (NEW - error display)
│   └── ActionButtonsSection.tsx (NEW - buttons row)
└── preview/
    └── QueryPreviewSection.tsx (REFACTOR - reposition only)
```

### Components to Refactor

```
components/
├── SearchBlockComponent.tsx (update to use new SearchBlockRow)
├── QueryBuilder.tsx (update to use MainLayout)
└── QueryPreview.tsx (no changes to logic, only positioning)
```

---

## Migration Checklist

- [ ] Create MainLayout component with sidebar + main content
- [ ] Create SidebarContainer with all sections
- [ ] Create YearRangeFiltersSidebar
- [ ] Create FieldOfResearchSidebar
- [ ] Create JournalRatingsSidebar
- [ ] Create SelectedJournalsSidebar
- [ ] Create MainContentArea
- [ ] Create SearchHeaderSection
- [ ] Create SearchBlocksContainer (unified border)
- [ ] Create SearchBlockRow (simplified single line)
- [ ] Create SearchBlockOperatorsRow (collapsible)
- [ ] Create SearchBlockErrorRow (error display)
- [ ] Create ActionButtonsSection
- [ ] Update main page/app to use new layout
- [ ] Test that all existing functionality still works
- [ ] Verify layout matches sketch positioning
- [ ] Test responsive behavior (defer hamburger to Phase 2)

---

## Styling Guidelines (Tailwind CSS)

### Colors

```
Borders: gray-300 (#D0D0D0), gray-200 (#E5E5E5)
Background: gray-50 (#F5F5F5), white
Text: gray-900 (#333333), gray-600 (#666666), gray-400 (#999999)
Error: red-600 (#EF4444), red-50 (#FEF2F2)
Primary button: blue-600 (#0066CC), hover: blue-700 (#0052A3)
```

### Spacing

```
XS: 1 (4px)
SM: 2 (8px)
MD: 3 (12px)
LG: 4 (16px)
XL: 6 (24px)
2XL: 8 (32px)
```

### Borders & Radius

```
Border width: 1px (border)
Border radius: 4px (rounded), 8px (rounded-lg)
Input height: 40px (h-10), 32px (h-8)
```

---

## Testing Checklist

### Layout Verification

- [ ] Sidebar is 300px fixed width
- [ ] Main content area is flexible and uses remaining space
- [ ] All sidebar sections are stacked vertically
- [ ] Year inputs are in header and sidebar (check if duplicate needed)
- [ ] Search blocks are in single container with no internal borders
- [ ] Each search block displays: [Field] [Term] [○] [+/-] [×]
- [ ] Error state shows red border and message
- [ ] Buttons are centered below search blocks
- [ ] Query preview is at bottom
- [ ] Overall layout matches your sketch

### Functionality Preservation

- [ ] All search block functionality works
- [ ] Operators still function (hidden/shown)
- [ ] Is Exact checkbox works
- [ ] Add Another button adds blocks
- [ ] Remove button removes blocks
- [ ] Error validation still triggers
- [ ] Query building still works
- [ ] Search redirect to Google Scholar works

---

## Notes

- **No new features added** - only repositioning existing ones
- **Maintain all current functionality** - no logic changes
- **Use existing state management** - no changes to data flow
- **Tailwind CSS only** - use utility classes for styling
- **Keep components modular** - easy to refactor later
- **Phase 2 will add:** Mobile responsiveness, animations, advanced features toggle
