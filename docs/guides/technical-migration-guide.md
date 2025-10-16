# Technical Migration Guide

**Version:** 1.0.0  
**Date:** October 16, 2025

---

## Architecture Overview

### Two-Column Layout

**Frontend Structure:**
```
┌─────────────────────────────────────────────────┐
│ MainLayout (Client Component)                   │
├─────────────────────┬──────────────────────────┤
│  Sidebar (Fixed)    │  Main Content (Flexible) │
│  300-600px          │  Flex-1                  │
│                     │                          │
│ ◄ Collapse Button   │ Search Blocks            │
│ • Year Range        │ • Query Building         │
│ • Field Research    │ • Results Preview        │
│ • Journal Ratings   │                          │
│ • Available Journals│                          │
└─────────────────────┴──────────────────────────┘
```

### State Management

**Sidebar State (MainLayout.tsx)**
```typescript
const [sidebarWidth, setSidebarWidth] = useState(420);
const [isCollapsed, setIsCollapsed] = useState(false);
const [isDragging, setIsDragging] = useState(false);
```

**Main State (QueryBuilder.tsx)**
```typescript
const [selectedFieldCodes, setSelectedFieldCodes] = useState([]);
const [selectedJournalISSNs, setSelectedJournalISSNs] = useState([]);
```

---

## Key Components

### MainLayout
- Manages sidebar width and collapse state
- Handles drag resize events
- Persists width to localStorage
- Renders sidebar and main content

### SidebarContainer
- Orchestrates all sidebar sections
- Passes props to filter components
- Manages sidebar content layout

### QueryBuilder
- Main app component
- Manages search blocks
- Handles global filters
- Executes Google Scholar redirects

---

## Data Flow

```
QueryBuilder (State)
  ↓
MainLayout (Props)
  ↓
  ├─ SidebarContainer (Props)
  │  ├─ YearRangeFiltersSidebar
  │  ├─ FieldOfResearchSidebar (Multi-select)
  │  ├─ JournalRatingsSidebar
  │  └─ SelectedJournalsSidebar (Interactive)
  │
  └─ MainContentArea
     ├─ SearchBlocksContainer
     └─ QueryPreview
```

---

## Multi-Select Implementation

### FieldOfResearchSidebar.tsx
```typescript
// Allows selecting multiple fields
const [selectedFieldCodes, setSelectedFieldCodes] = useState([]);

// Multi-select handler
const handleFieldToggle = (fieldCode, checked) => {
  if (checked) {
    setSelectedFieldCodes([...selectedFieldCodes, fieldCode]);
  } else {
    setSelectedFieldCodes(selectedFieldCodes.filter(code => code !== fieldCode));
  }
};
```

### Auto-Population
```typescript
// Filter journals by selected fields
const availableJournals = journals.filter(j =>
  selectedFieldCodes.includes(j.fieldCode)
);
```

---

## Resizable Sidebar Implementation

### Drag Handling
```typescript
// On mouse down on divider
const handleDividerMouseDown = () => {
  setIsDragging(true);
};

// On mouse move during drag
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging) return;
  const newWidth = e.clientX - containerRect.left;
  if (newWidth >= MIN && newWidth <= MAX) {
    setSidebarWidth(newWidth);
  }
};
```

### Persistence
```typescript
// Save to localStorage
localStorage.setItem(STORAGE_KEY, sidebarWidth.toString());

// Load on mount
const savedWidth = localStorage.getItem(STORAGE_KEY);
if (savedWidth) setSidebarWidth(parseInt(savedWidth, 10));
```

---

## Component Props Flow

### MainLayout
```typescript
interface MainLayoutProps {
  children: ReactNode;
  sidebarProps?: {
    selectedFieldCodes: string[];
    onFieldCodesChange: (codes: string[]) => void;
    selectedJournalISSNs: string[];
    onJournalsChange: (issns: string[]) => void;
    yearLow?: number;
    yearHigh?: number;
    onYearChange?: (low?: number, high?: number) => void;
  };
}
```

---

## URL Query Building

### Query Translation Module (QTM)
```typescript
buildScholarUrl(
  searchBlocks,
  {
    ...globalFilters,
    selectedJournalISSNs,
    selectedFieldCode
  }
)
```

Returns:
```
https://scholar.google.com/scholar?
q=intitle%3A%22search+term%22+...
&hl=en
&as_sdt=0%2C5
```

---

## Type Definitions

### SearchBlock
```typescript
interface SearchBlock {
  fieldId: string;
  term: string;
  isExact: boolean;
  booleanOperator: "AND" | "OR";
  operator: {
    type: "NONE" | "AND_NEXT" | "OR_NEXT" | "AND_PREV" | "OR_PREV";
  };
}
```

### GlobalFilters
```typescript
interface GlobalFilters {
  yearFrom?: number;
  yearTo?: number;
  selectedJournalISSNs: string[];
  selectedFieldCode?: string;
}
```

---

## Build & Performance

### Build Output
- **Time:** 6.2-8.5 seconds
- **Bundle:** ~163 kB First Load JS
- **Pages:** 5/5 static generated
- **Errors:** 0
- **Warnings:** 0

### Optimizations
- Event listeners cleanup
- Efficient re-renders
- localStorage with error handling
- Proper CSS animations (300ms)

---

## Testing

### Run Tests
```bash
bun test
```

### Type Checking
```bash
bun run type-check
```

### Linting
```bash
bun run lint
```

---

## Deployment

See [deployment-guide.md](deployment-guide.md) for deployment procedures.

---

## Troubleshooting

**Sidebar not saving width?**
- Check localStorage is enabled
- Check browser console for errors
- Verify STORAGE_KEY constant

**Multi-select not working?**
- Ensure selectedFieldCodes is array
- Check field codes in data
- Verify checkbox handlers

**Journals not populating?**
- Ensure fields are selected
- Check journal fieldCode mapping
- Verify CSV data loaded

---

Last Updated: October 16, 2025
