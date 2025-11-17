# Implementation Plan: SEO Setup & Department-Grouped Journal Selection

## Overview

Two parallel initiatives to:
1. **Enhance SEO discoverability** - Add comprehensive metadata, generate sitemap.xml, implement keyword targeting for "Google Scholar" and common variations/misspellings
2. **Implement department-based journal hierarchy** - Add department grouping level above Field of Research with cascading multi-select filtering

---

## Task 1: SEO Implementation

### 1.1 Add Comprehensive SEO Metadata

**Files to modify:**
- `app/layout.tsx` - Root metadata with shared defaults
- `app/page.tsx` - Home page metadata  
- `app/about/page.tsx` - About page metadata
- `app/feedback/page.tsx` - Feedback page metadata

**Requirements:**
- Title, description for each page
- Keywords array targeting:
  - Primary: "google scholar", "scholarle search", "academic research"
  - Misspellings: "google schoolar", "google scolar", "scholarle"
  - Variations: "scholarle", "scholarle articles", "research queries"
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags (twitter:title, twitter:description, twitter:card)
- Canonical URLs (self-referential for each page)
- Structured JSON-LD schema (WebApplication type for root, BreadcrumbList for sub-pages)

**Implementation approach:**
Use Next.js 15.5.4 metadata API with `Metadata` type exported from `app/layout.tsx` and per-page `generateMetadata()` functions

### 1.2 Generate Dynamic Sitemap

**Files to create:**
- `app/sitemap.ts` - Dynamic sitemap generation
- `app/robots.txt` - Route handler for robots.txt

**Sitemap Requirements:**
- Include all 7 active routes:
  - `/` (home) - priority: 1.0, changefreq: weekly
  - `/about` - priority: 0.8, changefreq: monthly
  - `/how-to-use` - priority: 0.9, changefreq: monthly
  - `/feedback` - priority: 0.7, changefreq: monthly
  - `/privacy` - priority: 0.5, changefreq: yearly
  - `/terms` - priority: 0.5, changefreq: yearly
  - `/citations` - priority: 0.6, changefreq: monthly
- Use `lastModified` timestamp (current date for initial generation)
- Return array of objects conforming to Next.js `MetadataRoute.Sitemap` type

**Robots.txt Requirements:**
- Allow all user agents for public routes
- Point to sitemap location: `/sitemap.xml`
- Disallow: none (for main user agents)

### 1.3 Verify Deployment & Analytics

**Already configured:**
- ✅ Vercel deployment active
- ✅ Google Analytics (GA4: G-EHWHV6MB45) in layout.tsx
- ✅ Vercel Analytics via `@vercel/analytics`

**Post-implementation verification:**
1. Deploy changes to Vercel
2. Verify `sitemap.xml` accessible at `https://domain.com/sitemap.xml`
3. Verify `robots.txt` accessible at `https://domain.com/robots.txt`
4. Submit sitemap to Google Search Console
5. Monitor Search Console for crawl statistics and keyword impressions

---

## Task 2: Department-Based Journal Hierarchy

### 2.1 Extend Data Structure - Add Department Concept

**File: `types/journal.ts`**

Add new interface:
```typescript
interface DepartmentDefinition {
  code: string;        // e.g., "3500", "3800"
  name: string;        // e.g., "Commerce, Management, Tourism & Services"
  description?: string; // Optional detailed description
}
```

Extend `FieldOfStudy` interface:
```typescript
interface FieldOfStudy {
  code: string;
  name: string;
  description?: string;
  departmentCode: string;  // ← NEW: Links to parent department
}
```

Create department constants (add to `types/journal.ts` or new `data/Departments.ts`):
```typescript
export const DEPARTMENT_DEFINITIONS: Record<string, DepartmentDefinition> = {
  "3500": {
    code: "3500",
    name: "Commerce, Management, Tourism & Services",
    description: "Business, management, tourism, and commercial services research"
  },
  "3800": {
    code: "3800",
    name: "Economics",
    description: "Economic research and theory"
  },
  "4600": {
    code: "4600",
    name: "Information Systems",
    description: "Information technology and systems research"
  },
  "4800": {
    code: "4800",
    name: "Law",
    description: "Legal research and commercial law"
  },
  "4900": {
    code: "4900",
    name: "Statistics",
    description: "Statistical science and methods"
  }
};
```

**Update `data/SearchWithin.ts`:**
- Modify `FIELD_OF_STUDY_MAPPINGS` array to include `departmentCode` for each field
- Mapping logic:
  - Fields 3501-3599 → departmentCode: "3500"
  - Fields 3801-3899 → departmentCode: "3800"
  - Field 4609 → departmentCode: "4600"
  - Field 4801 → departmentCode: "4800"
  - Field 4905 → departmentCode: "4900"

### 2.2 Update Journal Loading Logic

**File: `lib/journalLoader.ts`**

Add new function:
```typescript
function groupJournalsByDepartment(
  journals: JournalRecord[],
  fields: FieldOfStudy[]
): Record<string, { fieldCodes: string[]; journals: JournalRecord[] }> {
  // Returns structure: 
  // {
  //   "3500": {
  //     fieldCodes: ["3501", "3502", ...],
  //     journals: [journals for all fields in this dept]
  //   },
  //   ...
  // }
}
```

Extend `JournalsByField` type to support nested grouping:
```typescript
interface JournalsByDepartment {
  [deptCode: string]: {
    department: DepartmentDefinition;
    fields: JournalsByField[]; // Existing structure
    journalCount: number;
  };
}
```

### 2.3 Extend QueryBuilder State

**File: `components/QueryBuilder.tsx`**

Add to state:
```typescript
const [selectedDepartmentCodes, setSelectedDepartmentCodes] = useState<string[]>([]);
```

Update journal filtering logic to include department filter:
```typescript
const filteredJournals = useMemo(() => {
  let filtered = allJournals;
  
  // Filter by department (if selected)
  if (selectedDepartmentCodes.length > 0) {
    filtered = filtered.filter(journal => {
      const field = getFieldForCode(journal.fieldCode);
      return selectedDepartmentCodes.includes(field.departmentCode);
    });
  }
  
  // Filter by field (if selected)
  if (selectedFieldCodes.length > 0) {
    filtered = filtered.filter(j => selectedFieldCodes.includes(j.fieldCode));
  }
  
  // Filter by rating (if selected)
  if (selectedRatings.length > 0) {
    filtered = filtered.filter(j => selectedRatings.includes(j.rating));
  }
  
  return filtered;
}, [allJournals, selectedDepartmentCodes, selectedFieldCodes, selectedRatings]);
```

**Cascading behavior:**
- If no departments selected → show all fields (current behavior)
- If departments selected → show only fields in those departments
- Journal list filtered by intersection of selected departments AND fields

### 2.4 Create DepartmentSidebar Component

**File: `components/sidebar/sections/DepartmentSidebar.tsx`**

Create new component with:
- Title: "Research Department"
- 5 checkboxes for each department (3500, 3800, 4600, 4800, 4900)
- Display department code + name (e.g., "3500 - Commerce, Management, Tourism & Services")
- "Select All" / "Clear All" buttons
- Count of available fields within each department: e.g., "10 Fields"
- Count of available journals within each department: e.g., "245 Journals"
- Multi-select with `onChange` handler updating `selectedDepartmentCodes`
- Optional: Tooltip with department description on hover

**Component state:**
```typescript
const [checkedDepartments, setCheckedDepartments] = useState<Set<string>>(new Set());
```

### 2.5 Integrate DepartmentSidebar into Layout

**File: `components/sidebar/SidebarContainer.tsx`**

Add `DepartmentSidebar` import and place it at the TOP of sidebar sections:
```tsx
<DepartmentSidebar 
  selectedDepartments={selectedDepartmentCodes}
  onDepartmentChange={setSelectedDepartmentCodes}
  departments={DEPARTMENT_DEFINITIONS}
  fieldsByDepartment={fieldsByDepartment}
/>

<FieldOfResearchSidebar 
  // ... existing props
  // Add new prop:
  filteredFields={visibleFieldsByDepartment}  // Only show fields in selected departments
/>
```

### 2.6 Update FieldOfResearchSidebar Logic

**File: `components/sidebar/sections/FieldOfResearchSidebar.tsx`**

Modifications:
- Accept `filteredFields` prop containing only fields matching selected departments
- When no departments selected, pass all 17 fields (backward compatible)
- Display count of journals per field (update existing count display if present)
- Auto-update selection when department filter changes (optional: clear field selections that don't match new department filter)

### 2.7 Update Journal CSV Structure (Future)

**File: `public/data/journals.csv`**

**Current structure:**
```
title,publisher,fieldCode,rating,issn,issnOnline,website
```

**Future structure (add column):**
```
title,publisher,fieldCode,departmentCode,rating,issn,issnOnline,website
```

**Mapping guide for CSV update:**
- 3501-3510, 3599 → departmentCode: 3500
- 3801-3803, 3899 → departmentCode: 3800
- 4609 → departmentCode: 4600
- 4801 → departmentCode: 4800
- 4905 → departmentCode: 4900

**Update approach:**
- Option A: Create migration script in `scripts/` to auto-populate based on `fieldCode` patterns
- Option B: Provide CSV template with mapping instructions for manual update
- Option C: Backwards compatibility - if `departmentCode` missing, derive from `fieldCode`

### 2.8 Update QueryBuilder Logic for ISSN Query Building

**File: `lib/queryBuilder.ts` or integration point**

Ensure cascading department → field → journal selection flows through to final Google Scholar query:
- Selected journals (via checkbox) are aggregated regardless of department/field level
- `buildScholarUrl()` receives same journal list structure
- No changes needed to core query building - department filtering is purely for UI presentation

---

## Implementation Order

1. **SEO Phase** (independent, can start immediately):
   - Add metadata to layout.tsx and page files
   - Create sitemap.ts and robots.txt
   - Deploy and verify in Search Console

2. **Department Hierarchy Phase** (sequential):
   - Step 1: Extend types in `types/journal.ts` and add `DEPARTMENT_DEFINITIONS`
   - Step 2: Update `data/SearchWithin.ts` with departmentCode mappings
   - Step 3: Add `groupJournalsByDepartment()` to `lib/journalLoader.ts`
   - Step 4: Create `DepartmentSidebar.tsx` component
   - Step 5: Extend QueryBuilder state with `selectedDepartmentCodes`
   - Step 6: Update filtering logic in QueryBuilder
   - Step 7: Integrate DepartmentSidebar into SidebarContainer
   - Step 8: Update FieldOfResearchSidebar to accept filtered fields
   - Step 9: Update journal CSV (defer to later or provide script)
   - Step 10: Test cascading behavior end-to-end

---

## Open Questions (Awaiting User Clarification)

### SEO Strategy
- Q1: Should keywords include specific academic disciplines (economics, management, tourism, law, statistics) or focus purely on "Google Scholar" and variations?
- Q2: Should we add dynamic Open Graph image generation for social media sharing?
- Q3: Are there specific keywords beyond "Google Scholar" variations you want to target (e.g., "journal finder", "academic database", "research query builder")?

### Department UI Behavior  
- Q4: When no departments selected, should the app:
  - A) Show all fields (current FoR behavior) - recommended for discoverability
  - B) Require at least one department selection (more guidance)
  - C) Show a simplified "all" view with no department focus

- Q5: Should selecting a department automatically expand/collapse accordion to show its fields, or keep as separate filter step?

- Q6: Should field selections auto-clear if user changes department selection such that previously-selected fields are no longer in scope (e.g., user selected fields 3501, 3801 then switches to only department 3500 - should 3801 deselect)?

### CSV Migration Strategy
- Q7: The note says departments "would be updated to have later" - does this mean:
  - A) You'll provide CSV with department column pre-populated
  - B) You want a migration script we build to auto-derive departments
  - C) We build the code to handle missing `departmentCode` gracefully (no CSV change needed immediately)
  - D) You'll handle CSV updates externally and manually

---

## Acceptance Criteria

### SEO Phase
- ✅ All 7 routes have unique, descriptive metadata (title, description)
- ✅ Keywords array includes "google scholar", misspellings ("schoolar", "scolar"), and variations ("scholarle")
- ✅ sitemap.xml generates dynamically with all routes
- ✅ robots.txt present and references sitemap
- ✅ Open Graph and Twitter Card tags populated
- ✅ JSON-LD structured data included
- ✅ Deployed to Vercel and verified in Search Console
- ✅ Search results preview shows correct title/description

### Department Hierarchy Phase
- ✅ `DepartmentDefinition` interface and 5 departments defined
- ✅ `FIELD_OF_STUDY_MAPPINGS` updated with `departmentCode` for all 17 fields
- ✅ DepartmentSidebar renders 5 departments with multi-select checkboxes
- ✅ Selecting departments filters displayed fields (only shows fields in selected departments)
- ✅ Selecting fields within filtered set further narrows journals
- ✅ Journal list reflects intersection of department + field selections
- ✅ "Select All" / "Clear All" work for departments
- ✅ Department/field counts accurate (e.g., "10 Fields", "245 Journals")
- ✅ Cascading clears: deselecting department hides its fields and journals
- ✅ Final Google Scholar query includes only journals selected via checkbox (regardless of which filter they were selected through)
- ✅ Backward compatibility: if CSV missing `departmentCode`, still functions (derived or all visible)

---

## Notes

- **No breaking changes** - All existing functionality (multi-select fields, multi-select ratings, text search) preserved
- **Backward compatible** - CSV can be updated gradually; code derives `departmentCode` if missing
- **Performance** - Grouping/filtering uses existing `useMemo` patterns; no new database queries required
- **Mobile-friendly** - Sidebar components already responsive; department selector uses same patterns as field selector
- **Analytics** - Google Analytics already configured; no additional tracking needed unless tracking department filter usage is desired

