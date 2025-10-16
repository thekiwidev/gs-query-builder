# Real-Time Query Preview - Implementation Guide

## Overview

The Real-Time Query Preview is a simplified, focused query display component that shows only the generated Google Scholar query string. It updates instantly as users interact with the interface—typing search terms, selecting operators, filtering journals, or adjusting global filters.

## Why This Approach?

**Eliminated Complexity:**
- ❌ Removed verbose explanations ("What This Query Does")
- ❌ Removed query breakdown sections
- ❌ Removed validation messages panel
- ❌ Removed query statistics cards
- ❌ Removed slow-to-render complexity

**Focused on What Matters:**
- ✅ Single, clear query string display
- ✅ Instant updates with every change
- ✅ Color-coded syntax for readability
- ✅ Quick copy/share buttons
- ✅ Minimal UI footprint

## Component Props

```typescript
interface RealTimeQueryPreviewProps {
  /** Search blocks to preview */
  searchBlocks: SearchBlock[];
  
  /** Journal selection blocks */
  journalBlocks?: JournalSelectionBlock[];
  
  /** Global filters (year range, citations, etc.) */
  globalFilters?: GlobalFilters;
  
  /** Callback when user wants to execute search */
  onExecuteSearch?: () => void;
}
```

## Basic Usage

```tsx
import { RealTimeQueryPreview } from '@/components/RealTimeQueryPreview';

export function QueryBuilder() {
  const [searchBlocks, setSearchBlocks] = useState<SearchBlock[]>([]);
  const [journalBlocks, setJournalBlocks] = useState<JournalSelectionBlock[]>([]);
  const [globalFilters, setGlobalFilters] = useState<GlobalFilters>({});

  return (
    <div className="space-y-4">
      {/* Search controls */}
      <SearchBlockManager
        blocks={searchBlocks}
        onChange={setSearchBlocks}
      />

      {/* Real-time query preview */}
      <RealTimeQueryPreview
        searchBlocks={searchBlocks}
        journalBlocks={journalBlocks}
        globalFilters={globalFilters}
        onExecuteSearch={() => {
          // Redirect to Google Scholar with query
          window.open(buildSearchUrl(searchBlocks, journalBlocks, globalFilters));
        }}
      />
    </div>
  );
}
```

## Real-Time Update Examples

### Example 1: User Types Search Term

```
User types: "machine learning"
Time: T+0ms - User presses "m"
Display: intitle:machine
Time: T+50ms - User continues typing
Display: intitle:"machine learning"
Time: T+100ms - Syntax highlight updates
Display: intitle:"machine learning" (with purple quotes)
```

### Example 2: User Selects Operator

```
Block 1: title:ai (existing)
Block 2: author:smith (no operator)
User selects: AND with previous
Time: T+0ms - OperatorSelector shows selection
Time: T+50ms - Component re-renders with new operator
Display: intitle:ai AND author:smith (with green AND)
```

### Example 3: User Filters Journals

```
Query state: intitle:ai author:smith
User selects journals from field "Commerce"
Time: T+0ms - Journal filter changes
Time: T+50ms - Query rebuilds with journal ISSNs
Display: intitle:ai AND author:smith AND (issn:1234-5678 OR issn:2345-6789...)
```

### Example 4: User Excludes Term

```
Query state: intitle:ai author:smith
User marks Block 2 as EXCLUDE
Time: T+0ms - Exclusion flag set
Time: T+50ms - Query regenerates
Display: intitle:ai -author:smith (with red exclusion)
```

## Component Features

### Syntax Highlighting

The component automatically colors different query elements:

```
Colors:
- Parentheses: Blue (bold) - for grouping
- AND operator: Green (bold) - combines results
- OR operator: Orange (bold) - expands results
- Quotes: Purple - exact phrase matching
- Exclusions (-): Red (bold) - removes results
```

**Example Display:**
```
<span class="text-blue-600">(</span>
<span class="text-purple-600">"machine learning"</span>
<span class="text-green-600 font-semibold"> AND </span>
author:smith
<span class="text-red-600 font-semibold">-</span>
year:2020
<span class="text-blue-600">)</span>
```

### Action Buttons

**Copy Query Button:**
- Copies raw query string to clipboard
- Useful for sharing or debugging
- Example: `intitle:"AI" AND author:Smith -year:2020`

**Copy URL Button:**
- Copies full Google Scholar URL
- Users can paste into browser or email
- Example: `https://scholar.google.com/scholar?q=intitle%3A...`

**Search Button:**
- Triggers `onExecuteSearch` callback
- Usually opens results in new tab
- Only enabled when query is valid

### Empty State

When no search terms or journals selected:

```
🔍 Your query will appear here as you build your search
```

Simple guidance for new users.

### URL Length Indicator

Displays character count and warns if URL exceeds 2000 characters:

```
URL Length: 1,847 characters

URL Length: 2,145 characters ⚠️ URL is very long
```

## Integration with Search Blocks

### Automatic Updates

The component uses `useMemo` to optimize rendering:

```typescript
const queryResult = useMemo(() => {
  // Rebuilds only when searchBlocks, journalBlocks, or globalFilters change
  return buildScholarUrl(searchBlocks, enhancedFilters);
}, [searchBlocks, journalBlocks, globalFilters]);
```

**Update Triggers:**
- ✅ User types in search term input
- ✅ User selects different field
- ✅ User changes operator
- ✅ User marks block as EXCLUDE
- ✅ User selects journals
- ✅ User changes year range
- ✅ User toggles citation filter
- ✅ Any other data change

### Performance Optimization

- Only recalculates when dependencies change
- Syntax highlighting done with regex (fast)
- No expensive DOM operations
- Smooth, instant updates

## Placement in UI

### Recommended Placement

```
┌─────────────────────────────────┐
│  Main Query Builder Interface   │
├─────────────────────────────────┤
│                                 │
│  Search Blocks                  │
│  [Field] [Term] [×]             │
│  [Field] [Term] [×]             │
│                                 │
├─────────────────────────────────┤
│                                 │
│  Real-Time Query Preview ← HERE │
│  Generated Query Display        │
│  [Copy] [URL] [Search]          │
│                                 │
├─────────────────────────────────┤
│                                 │
│  Advanced Filters (Collapsible) │
│  Global filters if needed       │
│                                 │
└─────────────────────────────────┘
```

### Alternative Placements

1. **Bottom of page** - After all inputs
2. **Right sidebar** - Floating on desktop
3. **Modal** - Open on demand
4. **Sticky bottom** - Always visible while scrolling

## Error Handling

### Query Generation Fails

```
┌─────────────────────────────────┐
│  Generated Query                │
├─────────────────────────────────┤
│  Error generating query         │  (Red background)
└─────────────────────────────────┘
```

When `buildScholarUrl` returns `success: false`:
- Display error message
- Disable copy/URL/Search buttons
- Guide user to fix their search

### Edge Cases

**No search terms:**
- Shows empty state
- Buttons disabled
- Friendly message displayed

**Very long URL:**
- Still displays normally
- Warning badge shown
- Advises user to simplify query

**Invalid operators:**
- Query still generates (best effort)
- May show validation error elsewhere
- Preview shows generated attempt

## Code Example: Full Implementation

```tsx
import { RealTimeQueryPreview } from '@/components/RealTimeQueryPreview';
import { SearchBlockComponent } from '@/components/SearchBlockComponent';
import { useState } from 'react';

export function SimplifiedQueryBuilder() {
  const [searchBlocks, setSearchBlocks] = useState<SearchBlock[]>([
    {
      id: '1',
      fieldId: 'article_title',
      term: '',
      isExact: false,
      booleanOperator: 'AND',
    },
  ]);

  const [journalBlocks, setJournalBlocks] = useState<JournalSelectionBlock[]>([]);

  const [globalFilters, setGlobalFilters] = useState<GlobalFilters>({
    yearFrom: undefined,
    yearTo: undefined,
    includeCitations: true,
    excludeCitations: false,
  });

  const handleAddBlock = () => {
    setSearchBlocks([
      ...searchBlocks,
      {
        id: `block-${Date.now()}`,
        fieldId: 'article_title',
        term: '',
        isExact: false,
        booleanOperator: 'AND',
      },
    ]);
  };

  const handleExecuteSearch = () => {
    const url = buildScholarUrl(searchBlocks, {
      ...globalFilters,
      selectedJournalISSNs: journalBlocks.flatMap(b => b.selectedISSNs),
    });
    
    if (url.success) {
      window.open(url.url, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Search Blocks */}
      <div className="space-y-2">
        {searchBlocks.map((block, idx) => (
          <SearchBlockComponent
            key={block.id}
            block={block}
            blockIndex={idx}
            totalBlocks={searchBlocks.length}
            onUpdate={(updated) => {
              const newBlocks = [...searchBlocks];
              newBlocks[idx] = updated;
              setSearchBlocks(newBlocks);
            }}
            onRemove={() => {
              setSearchBlocks(searchBlocks.filter((_, i) => i !== idx));
            }}
          />
        ))}
      </div>

      {/* Add Block Button */}
      <button onClick={handleAddBlock} className="px-4 py-2 bg-blue-600 text-white rounded">
        + Add Search Block
      </button>

      {/* Real-Time Query Preview */}
      <RealTimeQueryPreview
        searchBlocks={searchBlocks}
        journalBlocks={journalBlocks}
        globalFilters={globalFilters}
        onExecuteSearch={handleExecuteSearch}
      />
    </div>
  );
}
```

## Benefits

✅ **Cleaner UI** - Less visual clutter, focused experience  
✅ **Instant Feedback** - Users see results of changes immediately  
✅ **Better Performance** - No expensive calculations or DOM operations  
✅ **Improved UX** - Users understand what they're building in real-time  
✅ **Easy Integration** - Drop-in replacement for complex preview component  
✅ **Mobile Friendly** - Takes minimal space on small screens  

## Conclusion

The Real-Time Query Preview provides users with immediate, clear feedback on their search query without overwhelming them with details. It's the sweet spot between "nothing" and "too much information."
