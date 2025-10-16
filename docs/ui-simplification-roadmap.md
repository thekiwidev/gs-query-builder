# UI Simplification Roadmap

## Overview

This document outlines a comprehensive series of prompts and implementation steps to transform the Google Scholar Query Builder into a clean, user-friendly interface that prioritizes simplicity while maintaining advanced functionality behind toggles and progressive disclosure.

---

## Phase 1: Layout & Architecture Restructuring

### Step 1.1: Redesign Main Layout with Sidebar

**Objective:** Introduce a two-column layout with sidebar for filters and journal selection.

**Requirements:**

- Left sidebar (250-300px) containing:
  - Field of Research filter (accordion/collapsible)
  - Journal rating filter (checkbox group: A\*, A, B, C)
  - Selected journals display (read-only or quick remove)
- Main content area containing:
  - Search blocks (simplified)
  - Global filters (advanced toggle to hide/show)
  - Query preview
  - Search button

**Implementation Tasks:**

1. Create new `AdvancedLayout.tsx` component with sidebar
2. Move journal selection logic to sidebar
3. Implement responsive design (sidebar collapses on mobile)
4. Add toggle button to show/hide advanced filters

**UI Notes:**

- Use consistent spacing (16px, 24px, 32px)
- Sidebar background: subtle gray (#F5F5F5)
- Main content: white background
- Clear visual hierarchy with proper font weights

---

### Step 1.2: Unify Search Block Container

**Objective:** Display all search blocks within a single bordered container without internal separators.

**Requirements:**

- Single card/container with rounded corners (8px border-radius)
- No internal borders between blocks
- Each block uses only padding for separation (12-16px vertical)
- Border color: light gray (#E0E0E0)
- Optional: subtle background color alternation for readability

**Implementation Tasks:**

1. Redesign `SearchBlockComponent` to remove individual borders
2. Create wrapper component `SearchBlocksContainer.tsx`
3. Adjust padding and spacing to maintain readability
4. Add subtle visual separators (thin lines or spacing only) between blocks

**UI Design:**

```
┌─────────────────────────────────────────┐
│  Search Block 1                         │
│  [Field] | [Term] | [Is Exact?] | [×]  │
├─────────────────────────────────────────┤
│  Search Block 2                         │
│  [Field] | [Term] | [Is Exact?] | [×]  │
└─────────────────────────────────────────┘
```

---

## Phase 2: Search Block Simplification

### Step 2.1: Simplify Individual Search Block Layout

**Objective:** Make each search block compact and intuitive.

**Requirements:**

- Single-line layout: `[Field Selector] | [Search Term] | [Is Exact?] | [Remove]`
- Remove unnecessary labels
- Use icons instead of text where possible
- Field selector: dropdown with search capability
- Search term: text input with placeholder
- Is Exact: checkbox (no label, just icon or visual indicator)
- Remove: trash icon button
- Boolean operators: hidden by default, revealed on hover/focus or via toggle

**Implementation Tasks:**

1. Refactor `SearchBlockComponent` layout to single line
2. Replace boolean operator dropdowns with collapsible section
3. Add icon buttons for actions (remove, expand operators)
4. Implement "Is Exact" as icon checkbox with tooltip

**Visual Layout:**

```
[ All Fields ▼ ] | [ Enter search term... ] | [ ✓ ] | [ × ]
```

---

### Step 2.2: Advanced Boolean Operators - Hidden by Default

**Objective:** Move operator complexity out of the main view, accessible via toggle.

**Requirements:**

- Boolean operators hidden by default
- Click on block or click "+" icon to expand operators
- When expanded, show:
  - Operator type (AND/OR/EXCLUDE) with clear radio buttons
  - Direction (if applicable): "with previous" / "with next"
  - Visual feedback showing relationship to adjacent blocks
- When collapsed: show operator hint on hover (e.g., "AND with next")
- Invalid operator combinations trigger inline error message

**Implementation Tasks:**

1. Create `BooleanOperatorPanel.tsx` component (collapsible)
2. Add expand/collapse toggle to `SearchBlockComponent`
3. Implement operator validation with error messages
4. Add visual indicators for operator relationships

---

## Phase 3: Journal Selection & Field of Research

### Step 3.1: Implement Field of Research Sidebar Filter

**Objective:** Allow users to select multiple fields of research, which automatically populates journal list.

**Requirements:**

- Sidebar section: "Field of Research"
- Display as accordion/expandable list
- Checkbox for each field (e.g., Commerce, Management, Economics, etc.)
- Allow multiple selections
- When field(s) selected, automatically filter available journals
- Show count of journals per field (e.g., "Commerce (87 journals)")
- "Select All" option to select all fields

**Implementation Tasks:**

1. Create `FieldOfResearchFilter.tsx` component
2. Update `journalLoader.ts` to support field-based filtering
3. Implement checkbox logic for multi-select
4. Add reactive filtering: when fields change, update available journals
5. Create `useFieldOfResearchFilter` hook for state management

**Data Flow:**

```
User selects Field of Research
    ↓
Filter journals by selected fields
    ↓
Update journal dropdown in main area
    ↓
Update main query automatically (if journals already selected)
```

---

### Step 3.2: Implement Journal Rating Filter in Sidebar

**Objective:** Allow users to filter and display journals by rating (A\*, A, B, C).

**Requirements:**

- Sidebar section: "Journal Ratings"
- Display as checkbox group (A\*, A, B, C)
- Initially show all ratings checked
- When unchecked, filter out journals with that rating
- Work in conjunction with Field of Research filter
- Show count of journals for each rating (e.g., "A\* (12 journals)")
- "Show All" and "Show None" quick actions

**Implementation Tasks:**

1. Create `JournalRatingFilter.tsx` component
2. Implement rating filter logic in journal selection
3. Add intersection of field + rating filters
4. Update journal display to respect both filters
5. Persist filter preferences (optional: localStorage)

**Visual Design:**

```
Journal Ratings
☑ A* (12)
☑ A (45)
☑ B (78)
☑ C (23)

[Show All] [Show None]
```

---

### Step 3.3: Multi-Journal Selection with Auto-Update

**Objective:** Allow selecting multiple journals from multiple fields of research.

**Requirements:**

- Sidebar section: "Selected Journals"
- Display selected journals in organized list (by rating or field)
- Each journal shows: name, ISSN, rating badge
- Quick remove button (×) for each journal
- "Clear All" button to deselect all journals
- Selected journals automatically added to main query
- Show total count of selected journals
- Drag-to-reorder journals (optional enhancement)

**Implementation Tasks:**

1. Create `SelectedJournalsPanel.tsx` component
2. Implement multi-journal selection logic
3. Auto-add selected journals to query
4. Show visual feedback when journals are added/removed
5. Update query preview in real-time

---

## Phase 4: Error Handling & Validation

### Step 4.1: Implement Smart Operator Validation

**Objective:** Detect invalid operator combinations and provide real-time feedback.

**Requirements:**

- Validate operator combinations:
  - Cannot reference an excluded (NOT) block in AND/OR operators
  - Cannot create circular references or invalid nesting
  - First block cannot have "AND/OR with previous"
  - Last block cannot have "AND/OR with next" without a following block
- Show inline error messages with explanations
- Style errors: red outline on affected blocks + error tooltip
- Suggestion: "Did you mean...?" with quick fix option
- Block errors prevent form submission

**Invalid Scenarios Examples:**

```
Block 1: EXCLUDE (NOT)
Block 2: AND with previous Block 1 ❌ ERROR: Cannot AND with excluded term
```

```
Block 1: OR_NEXT
Block 2: [empty] ❌ ERROR: OR operator requires next block
```

**Implementation Tasks:**

1. Create `operatorValidator.ts` with comprehensive validation rules
2. Implement `useOperatorValidation` hook
3. Update `SearchBlockComponent` to display error states
4. Create `ErrorMessage.tsx` component with tooltips
5. Add validation on every operator change

---

### Step 4.2: Visual Error Indicators

**Objective:** Display validation errors with clear visual feedback.

**Requirements:**

- Error states:
  - Red outline (2px) around affected input
  - Red icon/badge on block header
  - Inline error message below block or in tooltip
  - Light red background on error section (optional)
- Error message format:
  - **Header:** "Invalid Logic Configuration"
  - **Details:** Specific explanation of the issue
  - **Suggestion:** How to fix it
  - **Example:** "You cannot AND with Block 1 because it's excluded (NOT)"
- Errors clear when fixed
- Form submit button disabled if errors exist

**Implementation Tasks:**

1. Update `SearchBlockComponent` styling for error states
2. Create reusable error display component
3. Implement error state management in `QueryBuilder`
4. Add validation feedback on all user interactions

---

## Phase 5: Advanced Features (Progressive Disclosure)

### Step 5.1: Hide Advanced Filters Behind Toggle

**Objective:** Simplify main view by hiding advanced options.

**Requirements:**

- Main view shows only essential controls
- "Advanced Options" toggle in header or top-right
- When toggled ON, reveals:
  - Year range filters
  - Citation filtering (include/exclude)
  - Language selection
  - Document type filtering
- Default state: OFF (hidden)
- Preserve toggle state across sessions (localStorage)

**Implementation Tasks:**

1. Create `AdvancedFiltersToggle.tsx` component
2. Refactor global filters section
3. Implement conditional rendering based on toggle
4. Add smooth animations for show/hide
5. Store preference in localStorage

---

### Step 5.2: Query Preview & Explanation

**Objective:** Show users the exact query being sent to Google Scholar.

**Requirements:**

- Query preview panel (bottom of main area or floating)
- Show both raw query and formatted URL
- Syntax highlighting:
  - Field operators: blue (intitle:, author:)
  - Boolean operators: green (AND, OR)
  - Excluded terms: red (-)
  - Quoted phrases: bold
  - ISSNs: purple
- Copy-to-clipboard button for query
- "View Results" button that opens Google Scholar in new tab
- Real-time updates as user modifies search

**Implementation Tasks:**

1. Enhance `QueryPreview.tsx` component
2. Add syntax highlighting with custom styling
3. Implement copy functionality
4. Add "View Results" button that redirects to Google Scholar
5. Make preview panel toggleable (show/hide)

---

## Phase 6: Responsive & Mobile Design

### Step 6.1: Mobile-Friendly Layout

**Objective:** Ensure the interface works well on mobile and tablet devices.

**Requirements:**

- Sidebar collapses into hamburger menu on mobile
- Single-column layout on phones
- Touch-friendly buttons (minimum 44x44px)
- Simplified search block layout for small screens
- Optimized keyboard handling for mobile
- Drawer/modal for journal selection on mobile

**Implementation Tasks:**

1. Implement responsive breakpoints (mobile, tablet, desktop)
2. Create mobile navigation menu
3. Optimize search block layout for small screens
4. Test on various devices and screen sizes

---

## Phase 7: Styling & Visual Refinement

### Step 7.1: Design System Update

**Objective:** Create a clean, modern visual design.

**Requirements:**

- Color scheme:
  - Primary: Google Scholar blue (#0066CC or similar)
  - Success: Green (#22C55E)
  - Error: Red (#EF4444)
  - Warning: Amber (#F59E0B)
  - Neutral: Gray scale (#F5F5F5, #E5E5E5, #999999, #333333)
- Typography:
  - Headings: Bold, 18px/20px
  - Body: Regular, 14px/16px
  - Small text: 12px/14px
  - Mono for code: 13px
- Spacing: Use 4px grid (4, 8, 12, 16, 24, 32, 48px)
- Shadows: Subtle, 1-2px blur only
- Borders: 1px, light gray

**Implementation Tasks:**

1. Update Tailwind configuration with custom colors
2. Create CSS custom properties for colors, spacing, typography
3. Update all components with new design system
4. Create component storybook examples (optional)

---

### Step 7.2: Animations & Transitions

**Objective:** Add subtle, purposeful animations to enhance UX.

**Requirements:**

- Smooth transitions: 200-300ms duration
- Entrance animations for modals/drawers: 150-200ms
- Hover effects on interactive elements
- Focus states with visible outline (accessibility)
- Loading states with spinner/skeleton
- Success/error feedback animations

**Implementation Tasks:**

1. Add Framer Motion or CSS animations
2. Implement for: expand/collapse, show/hide, route changes
3. Add accessibility considerations (prefers-reduced-motion)
4. Test performance impact

---

## Implementation Checklist

### Priority 1 (MVP - Essential)

- [ ] Step 1.1: Main layout with sidebar
- [ ] Step 1.2: Unified search block container
- [ ] Step 2.1: Simplified search block layout
- [ ] Step 3.1: Field of Research filter
- [ ] Step 3.2: Journal rating filter
- [ ] Step 4.1: Operator validation
- [ ] Step 4.2: Visual error indicators

### Priority 2 (High - Important)

- [ ] Step 2.2: Hidden boolean operators
- [ ] Step 3.3: Multi-journal selection
- [ ] Step 5.1: Advanced filters toggle
- [ ] Step 5.2: Enhanced query preview
- [ ] Step 7.1: Design system update

### Priority 3 (Medium - Nice to Have)

- [ ] Step 6.1: Mobile responsiveness
- [ ] Step 7.2: Animations & transitions

---

## Testing Strategy

### User Testing

- [ ] Conduct usability testing with 5-10 users
- [ ] Gather feedback on new layout
- [ ] Test operator validation comprehension
- [ ] Test journal selection workflow

### Functional Testing

- [ ] All search blocks work correctly
- [ ] Operator validation catches all invalid cases
- [ ] Journal filters work across fields and ratings
- [ ] Query preview accurately reflects user input
- [ ] Error messages are clear and helpful

### Visual Testing

- [ ] Layout looks good on all screen sizes
- [ ] Colors meet accessibility standards (WCAG AA)
- [ ] Typography is readable and consistent
- [ ] Spacing is consistent throughout

### Performance Testing

- [ ] Page loads in under 2 seconds
- [ ] Interactions respond instantly (< 100ms)
- [ ] No layout shifts (CLS < 0.1)
- [ ] Mobile performance acceptable

---

## Success Metrics

1. **Usability**

   - Time to complete search reduced by 50%
   - Error rate in operator selection < 5%
   - User satisfaction score > 4/5

2. **Engagement**

   - Increase in multi-field searches
   - Higher adoption of journal filters
   - Reduced abandonment rate

3. **Performance**
   - Page load < 2s
   - Interaction latency < 100ms
   - Mobile usability score > 90

---

## Notes & Considerations

- **Backward Compatibility:** Ensure new UI works with existing data structures
- **Accessibility:** Test with screen readers and keyboard navigation
- **Browser Support:** Support last 2 versions of major browsers
- **Localization:** Design with i18n in mind (variable text lengths)
- **Dark Mode:** Consider dark mode support in future iteration
