# Changelog

All notable changes to the Google Scholar Query Translator (QTM) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2025-10-20 - Enhanced Collapsible Sidebar with Mobile Responsiveness

### Added

- **Enhanced Collapsible Sidebar with Mobile Responsiveness**

  - Visible collapsed sidebar (50px spacebar width) that remains visible at all times
  - Hamburger menu icon at the top of collapsed sidebar for easy expansion
  - Rotated "FILTER" text centered vertically in collapsed sidebar
  - Smooth fade-in animation for sidebar content (0.2s delay) when expanded
  - Mobile-responsive sidebar overlay that doesn't shift page content
  - Fixed positioning on mobile that overlaps content without layout shift
  - Smooth transitions with 300ms duration for all sidebar state changes

### Changed

- **Sidebar Layout Architecture** (`components/layouts/MainLayout.tsx`)

  - Changed from `overflow-hidden` to `overflow-visible` to allow chevron to display outside sidebar bounds
  - Improved collapsed state UX with clear visual indicators
  - Mobile detection using 768px breakpoint (Tailwind `md` breakpoint)
  - Sidebar content visibility now controlled by state rather than just CSS classes
  - Main content now maintains proper spacing regardless of sidebar state

- **Animation System** (`app/globals.css`)

  - Added `fadeIn` CSS keyframe animation for smooth content appearance
  - Content fade-in triggered on sidebar expansion with 0.2s delay
  - Prevents jittery animation during sidebar resize transitions

- **Mobile UX Improvements**

  - Sidebar fixed positioning on mobile prevents content shifts
  - Added shadow effect to expanded sidebar on mobile for depth perception
  - Close button (X icon) visible in top-left when sidebar is open on mobile
  - Draggable divider hidden on mobile and when sidebar is collapsed

### Fixed

- Sidebar content appearing too early during expansion animation (now fades in smoothly after sidebar finishes expanding)
- Main content falling behind collapsed sidebar (now properly offset by COLLAPSED_SIDEBAR_WIDTH)
- Sidebar overflow issues preventing display of interactive elements beyond sidebar bounds

### Technical Details

- `COLLAPSED_SIDEBAR_WIDTH` constant set to 50px for spacebar-like appearance
- Mobile detection implemented with `window.innerWidth < 768` check on mount and resize
- Absolute positioning with `translate(50%, -50%)` for proper centering of interactive elements
- `overflow-visible` allows buttons positioned outside sidebar to be clickable
- Z-index layering: sidebar (z-40), close button (z-30), fixed buttons (z-50)

### Notes

- Sidebar remains visible even when collapsed, providing clear affordance for expansion
- Mobile overlay prevents accidental content interaction while sidebar is open
- Smooth animations improve perceived performance and UX fluidity
- Storage of sidebar width persists across sessions for desktop users

## [1.1.0] - In-App Help System, Advanced Operator Validation, and Real-Time Query Generation

### Added

- **In-App Help System with Page-Based Navigation** - Comprehensive user documentation accessible via routing

  - `components/help/HowToUsePage.tsx` - Full-page help component (765 lines)

    - 9 major sections: Getting Started, Search Blocks, Operators, Is Exact, Journals, Filters, Examples, Tips & Tricks, Common Issues
    - Collapsible sections with expand/collapse toggle UI
    - Sticky table of contents with smooth scroll navigation
    - Color-coded tips, warnings, and examples
    - 3 real-world scenario examples with step-by-step instructions
    - Responsive grid layout (1 col mobile, 4 cols desktop)
    - Close button with `router.back()` navigation
    - Production-ready component with TypeScript strict mode compliance

  - `app/how-to-use/page.tsx` - Next.js route for help page

    - SEO metadata (title and description)
    - Renders HowToUsePage component with showCloseButton prop
    - Enables `/how-to-use` URL routing for bookmarkable help

  - `components/help/index.ts` - Barrel export for help components

    - Exports HowToUsePage for clean imports

  - **Help Button Integration in QueryBuilder** (`components/QueryBuilder.tsx`)

    - Added help button in top-right header
    - Navigates to `/how-to-use` via `router.push()`
    - Uses `useRouter` from `next/navigation` for client-side navigation
    - Clean integration with existing UI

  - **9 Comprehensive Documentation Files** (~2,750 lines total)
    - `docs/HELP_PAGE_QUICK_REFERENCE.md` - Quick reference guide (200 lines)
    - `docs/HELP_PAGE_LINK_INTEGRATION.md` - Integration guide (300 lines)
    - `docs/HELP_PAGE_VISUAL_GUIDE.md` - Visual states and UX flows (500 lines)
    - `docs/HELP_PAGE_ARCHITECTURE.md` - Technical architecture (400 lines)
    - `docs/HELP_PAGE_CODE_REFERENCE.md` - Code implementation details (600 lines)
    - `docs/HELP_PAGE_IMPLEMENTATION_SUMMARY.md` - Implementation overview (200 lines)
    - `docs/HELP_PAGE_DOCUMENTATION_INDEX.md` - Documentation index (300 lines)
    - `HELP_PAGE_COMPLETION_REPORT.md` - Completion report (250 lines)
    - `HELP_PAGE_FINAL_SUMMARY.md` - Final summary (300 lines)

- **Journal Rating Filter Integration** - Dynamic filtering of journals by rating (A\*, A, B, C)

  - Connected `JournalRatingsSidebar` to parent state for active filtering
  - Added "Show All" and "Show None" buttons for rating selection
  - Real-time journal list updates when rating selection changes
  - Journals filter by BOTH field codes AND selected ratings

- **RFC 4180 Compliant CSV Parser** - Fixed journal loading to handle all 2,510 journals

  - Replaced simple line-based CSV parser with proper RFC 4180 compliant parser
  - Now correctly handles multi-line quoted fields (e.g., journal names with newlines)
  - Properly parses escaped quotes within quoted fields
  - Handles mixed line endings (CRLF and LF)
  - Supports all 2,510 journals across all rating types:
    - 193 A\* journals
    - 623 A journals
    - 800 B journals
    - 894 C journals

- **Advanced Operator Validation System** - Smart real-time operator validation with visual feedback

  - `lib/operatorValidationEngine.ts` - Core validation logic (~250 lines):

    - Comprehensive operator combination validation rules
    - Prevents invalid AND/OR/EXCLUDE operator sequences
    - Detects position-based errors (first/last block restrictions)
    - Double negation detection with warnings
    - Intelligent error messages with fix suggestions
    - Incompatible operator lists for UI highlighting

  - `components/operators/OperatorSelector.tsx` - Interactive operator chooser (~150 lines):

    - Expandable operator selection interface
    - Real-time red highlighting of incompatible operators
    - Red border on operator selector when errors exist
    - Radio button selection for operator type (AND, OR, EXCLUDE)
    - Direction selection (with_previous / with_next)
    - Disabled state for invalid operator choices
    - Built-in help text and explanations

  - `components/operators/OperatorValidationFeedback.tsx` - Validation display (~200 lines):

    - Real-time error messages below operator selector
    - Missing search term warnings
    - Valid state confirmation with green checkmarks
    - Block validation visual indicators (left border)
    - Comprehensive error panel with suggestions
    - Severity-based color coding (error/warning)

  - `lib/hooks/useOperatorValidation.ts` - React integration hooks (~100 lines):
    - `useOperatorValidation()` - Validates all blocks, provides submission readiness
    - `useOperatorSelector()` - Manages individual operator selection state
    - Per-block validation queries for targeted error display
    - Smart operator option filtering based on context

- **Real-Time Query Generation** - Query updates instantly with all user interactions

  - Removed "only on search button click" limitation
  - Query generates and displays immediately when user:
    - Types in search term fields
    - Changes field selection
    - Toggles exact match checkbox
    - Adds/removes search blocks
    - Changes operators
    - Selects filters (fields, journals, year range)
    - Toggles citation options
  - Streamlined UI with focus on generated query only

- **UI Simplification & Cleanup** - Focused interface

  - Removed all intermediate preview panels under search blocks
  - Removed legacy QueryPreview component
  - Kept only final query string display
  - Display shows immediately on any form interaction
  - Clean, distraction-free interface

- **Documentation Files Added:**

  - `docs/operator-validation-system.md` - Complete integration guide with examples
  - `docs/operator-validation-summary.md` - Quick reference and feature overview
  - `docs/operator-validation-visual-guide.md` - Visual states, error messages, UX flows

- **UI Simplification Roadmap - Complete Implementation (7 Phases, 12 New Components)**

  - **Phase 1: Layout Architecture** - Responsive two-column design

    - `AdvancedLayout.tsx` - Two-column layout with collapsible sidebar, mobile drawer support (71 lines)
    - `SearchBlocksContainerUnified.tsx` - Unified search block container without internal borders (59 lines)

  - **Phase 3: Advanced Filters** - Comprehensive filtering system

    - `FieldOfResearchFilter.tsx` - Research field multi-select accordion filter (95 lines)
    - `JournalRatingFilter.tsx` - Journal rating selector (A\*, A, B, C) with quick actions (92 lines)
    - `MultiJournalSelector.tsx` - Searchable journal picker with tags and bulk selection (120 lines)

  - **Phase 4: Smart Validation** - Operator and error handling

    - `SmartOperatorValidator.tsx` - Intelligent operator logic validation engine (98 lines)
    - `VisualErrorIndicator.tsx` - Error/warning/info display with severity badges (107 lines)

  - **Phase 5: Disclosure & Preview** - User-friendly query management

    - `AdvancedFiltersToggle.tsx` - Collapsible advanced filters section with counter badge (48 lines)
    - `EnhancedQueryPreview.tsx` - Query display with copy-to-clipboard and Google Scholar redirect (107 lines)

  - **Phase 6: Mobile Responsiveness** - Mobile-first navigation

    - `MobileSearchMenu.tsx` - Responsive mobile menu drawer with navigation items (142 lines)

  - **Phase 7: Design System** - Unified visual language
    - `tailwind.config.ts` - Enhanced with color tokens, spacing grid, animations, and durations
    - `AnimationUtilities.tsx` - Reusable animation components (fade, slide, scale) with stagger support (167 lines)

### Changed

- **Default Journal Rating Selection** - Changed from all ratings to A\* only

  - `QueryBuilder.tsx`: `selectedJournalRatings` now initializes with `["A*"]` instead of `["A*", "A", "B", "C"]`
  - Users can easily expand to other ratings via "Show All" button in sidebar

- **QueryBuilder Component** - Simplified for real-time updates
  - Removed `lastResult` state tracking
  - Implemented `generateCurrentQuery()` for continuous query generation
  - Updated `handleSearch()` to use real-time generated query
  - Removed all intermediate preview logic
  - Query displays instantly on any user interaction

### Fixed

- **Critical:** Journal rating validation was hardcoded to only accept A\* and A ratings, rejecting B and C journals during CSV parsing

  - Updated `validateRating()` in `types/journal.ts` to accept all four rating types
  - Now all 2,510 journals load correctly including B and C rated journals

- Journal loading now correctly parses all 2,510 journals from CSV (previously failed on entries with multi-line quoted fields)
- Journal filtering by rating now works correctly across all four rating categories
- CSV parser no longer rejects valid journals due to embedded newlines in quoted fields

- **Operator Validation** - Prevents invalid operator combinations before query generation
  - AND/OR operators no longer allowed after EXCLUDE blocks
  - First block correctly prevents "with previous" selection
  - Last block prevents invalid "with next" selection
  - Clear error messages guide users to valid configurations

### Technical Improvements

- **Operator Validation Architecture**

  - Pure validation logic with no UI dependencies (engine.ts)
  - Reusable across different UI implementations
  - Extensible rule system for future enhancements
  - Comprehensive TypeScript interfaces

- **Real-Time Performance**

  - Query generation on every render (optimized with React)
  - No state mutations or side effects
  - Immediate visual feedback to user actions
  - Efficient computation for large block sequences

- **CSV Parsing Robustness**

  - RFC 4180 compliant parser handles all edge cases
  - Proper state tracking for quoted fields and line endings
  - Character-by-character processing for accuracy
  - Full journal dataset now accessible

- **Code Quality**
  - Added ~2,000+ lines of production code
  - Zero TypeScript errors (strict mode)
  - Zero ESLint warnings
  - Complete documentation with examples
  - Modular, testable components

### UI/UX Improvements

- **Validation Feedback**

  - Real-time incompatible operator highlighting (red background)
  - Clear error messages next to operator field
  - Helpful suggestions for fixing errors
  - Valid state confirmation (green checkmarks)

- **Query Preview**

  - Instant updates as user types
  - No delay between input and output
  - Clean, focused display
  - Distraction-free interface

- **Journal Selection**
  - Dynamic filtering by field AND rating
  - Real-time list updates
  - Quick "Show All" / "Show None" actions
  - Clear visual indication of selected journals

### Notes

- Operator validation system is production-ready and fully integrated
- Real-time query generation improves user experience significantly
- All validation rules documented and tested
- System prevents invalid queries at the source
- Journal database now includes all 2,510 journals (previously only ~400)

---

## [1.0.0] - Advanced Query Controls, Resizable Sidebar, and UI Simplification

### Added

- **"Is Exact" Search Control**

  - Added new `isExact` property to SearchBlock interface
  - Implemented checkbox UI control for toggling exact phrase matching
  - Quotes are now only applied to terms when isExact is true
  - Changed ISSN formatting to never use quotes for better compatibility with Google Scholar

- **Enhanced Boolean Operator System**

  - New dropdown-based operator selection with clear relationship descriptions
  - Added explicit directional boolean operators: AND_NEXT, AND_PREV, OR_NEXT, OR_PREV, EXCLUDE
  - Smart operator display - conditional options based on block position
  - Proper parenthetical grouping in query construction for precise boolean logic
  - Improved operator explanations in UI with tooltips and context
  - Syntax highlighting for parentheses, boolean operators, and quoted phrases in query preview

- **Advanced Query Synthesis**

  - Enhanced block synthesis with specialized handling for different field types
  - Improved DOI and ISSN handling with dedicated formatting rules
  - Added formatJournalSelection function for proper ISSN-based OR query construction
  - Automatic detection and handling of multi-word terms requiring quotation
  - Smart relationship management between blocks with consistent operator handling

- **Comprehensive Documentation**

  - Added "Building a Google Scholar Query Translator" comprehensive guide
  - Created detailed future enhancement proposals document
  - Added implementation summary with technical details
  - Added example test guide with test scenarios
  - Enhanced README with detailed architecture overview

- **Phase 1 UI Simplification Implementation**

  - Complete two-column layout redesign: Fixed 300px sidebar + flexible main content
  - Sidebar sections: Year Range, Field of Research, Journal Ratings, Available Journals
  - Main content area: Search blocks with refined operators layout
  - Components: 10 new layout and sidebar components
  - Proper separation of concerns between layout and content

- **Phase 1 Refinements**

  - Multi-select Field of Research dropdown enabling users to select multiple research areas
  - Auto-populate Available Journals based on selected fields
  - Journal filtering: Only show journals from selected fields
  - Removed citations from global filters
  - Removed field notes/info sections for cleaner UI
  - Fixed search block operators layout alignment (1/4 width with proper spacing)

- **Available Journals Interface with Sorting**

  - Replaced "Selected Journals" display view with interactive "Available Journals" view
  - Multi-select checkboxes for journal selection
  - Select All / Clear All buttons for bulk operations
  - **Increased height** from `max-h-64` to `max-h-96` for better visibility
  - **Inline rating display** - Rating badges now appear next to ISSN on same line
  - **Rating-based sorting** - Journals automatically sorted A\* → A → B → C regardless of field
  - Scroll support for large journal lists

- **Advanced Sidebar Features**

  - **Draggable resize handle** - Users can drag the divider between sidebar and content
  - **Width constraints** - Resizable from 250px (minimum) to 600px (maximum)
  - **Default width increased** - From 384px to 420px for better readability
  - **Expand/Collapse buttons** - One-click toggle to hide/show sidebar
  - **Persistent width storage** - localStorage saves user's preferred sidebar width
  - **Smooth animations** - 300ms transitions for all width changes and collapse/expand
  - **Visual feedback** - Divider changes color on hover (gray → blue)

- **Dropdown Auto-Collapse**

  - Click-outside detection for Field of Research dropdown
  - Automatic closure when clicking anywhere outside the dropdown
  - Selection maintained after dropdown closes
  - Professional UX pattern implementation

- **Bottom Padding & Spacing**
  - Added `pb-24` to SidebarContainer for 96px bottom padding
  - Added `pb-16` to SelectedJournalsSidebar wrapper for 64px additional spacing
  - Comfortable breathing room at bottom of sidebar
  - Prevents content from being cramped near the footer

### Fixed

- Journal selection bug where selected journals were not included in the main query
- Improved display of generated query with proper pre formatting to prevent HTML rendering issues
- Changed quoting behavior: terms are only quoted when "Is Exact" checkbox is checked
- Removed quotation marks from journal ISSNs in query construction
- Sidebar UI/UX issues: dropdown staying open after selection
- Main content offset calculation to properly account for draggable divider
- Sidebar width persistence across page reloads

### Changed

- **Redesigned SearchBlockComponent**

  - Replaced simple boolean toggles with enhanced operator dropdown
  - Added visual indicators for operator relationships between blocks
  - Improved preview display to show relationships with adjacent blocks
  - Added detailed operator explanations in the UI

- **Updated QueryBuilder Component**

  - Enhanced block management with operator relationship awareness
  - Improved addSearchBlock logic to maintain proper relationships
  - Updated removeSearchBlock to handle operator relationship cleanup
  - Better documentation of operator functionality

- **Enhanced Query Translation Module (QTM)**

  - Added proper groupBlocksByOperator function for parenthetical grouping
  - Updated SearchBlock interface with new operator property structure and isExact flag
  - Updated synthesizeStandardField function to respect isExact property for quote handling
  - Maintained backward compatibility with legacy booleanOperator property
  - Improved query validation for complex operator relationships

- **Sidebar Width Management**

  - Changed from static `w-80/ml-80` to dynamic `w-96/ml-96` base width
  - Updated to fully responsive resizable system with state management
  - Implemented proper drag event handling with cleanup
  - Added fixed positioning for divider with proper z-index management

- **Layout Architecture**
  - Converted MainLayout to client component for state management
  - Added SidebarContainer wrapper for filter organization
  - Improved MainContentArea component for better content flexibility
  - Proper flex-based layout with transition animations

### Technical Improvements

- **Type Safety Enhancements**

  - Enhanced SearchBlock interface with optional operator property and isExact flag
  - Added operator type union with all possible relationship types
  - Improved compatibility between new and legacy operator systems
  - Better TypeScript validation across component boundaries

- **Code Quality Improvements**

  - Added comprehensive JSDoc documentation for all new functions
  - Enhanced query synthesis modularity with dedicated formatting functions
  - Implemented special case handling for different field types (DOI, ISSN, etc.)
  - Improved error handling and reporting throughout the query building process

- **State Management & Performance**

  - Optimized event listeners for drag operations (added/removed as needed)
  - Proper cleanup of event listeners to prevent memory leaks
  - Efficient re-rendering with strategic useState and useEffect usage
  - localStorage with error handling for width persistence

- **User Experience Enhancements**

  - Accessibility features: Full keyboard navigation, ARIA labels, screen reader support
  - Visual feedback: Hover states, cursor changes, color transitions
  - Smooth animations: 300ms transitions for all UI changes
  - Error handling: Graceful fallbacks when localStorage unavailable

- **Component Architecture**
  - Separation of concerns between layout (MainLayout) and content (MainContentArea)
  - Modular sidebar sections (YearRange, FieldOfResearch, JournalRatings, SelectedJournals)
  - Reusable UI components from shadcn/ui library
  - Proper prop drilling with TypeScript interfaces

### Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ All modern browsers with ES6+ and localStorage support

### Build & Deployment

- Build time: 6.2-8.5 seconds (bun optimized)
- Bundle size: ~163 kB First Load JS (optimal)
- Static pages: 5/5 generated successfully
- Zero TypeScript errors (strict mode)
- Zero ESLint warnings
- No breaking changes, fully backward compatible

---

## [0.3.0] - Advanced Journal Filtering and Enhanced Boolean Logic

### Added

- **Advanced Journal Filtering System**

  - Complete journal database integration with 2000+ journals from CSV data
  - Field-of-study categorization with 17+ research areas (Commerce, Management, Economics, etc.)
  - Journal rating system (A\*, A, B, C) with validation and filtering
  - ISSN-based precise journal filtering for higher accuracy than Google Scholar's basic source operator
  - SimplifiedJournalSelector component with dropdown-based selection interface

- **Enhanced Boolean Operator Logic**

  - Contextual boolean operators based on block position (first block vs. subsequent blocks)
  - "AND/OR with previous block" and "AND/OR with next block" directional relationships
  - NOT (exclusion) operator available for all blocks independent of position
  - Smart operator display - no operators shown for single blocks
  - Real-time preview showing proper operator relationships

- **Comprehensive Data Architecture**

  - Journal data types and interfaces (`types/journal.ts`) with full TypeScript support
  - CSV ingestion system (`lib/journalLoader.ts`) with validation and error handling
  - Field of study mappings for research classification codes
  - ISSN validation with flexible format support
  - Journal rating validation and sorting

- **Advanced Query Validation System**

  - Real-time query validation with error detection and suggestions
  - Syntax validation for Boolean operators, parentheses, and malformed queries
  - Query explanation generation for human-readable descriptions
  - Validation severity levels (errors, warnings, info)
  - Corrected query suggestions for common issues

- **Enhanced UI/UX Components**
  - Continuous scrollable journal lists with inline segment headers (no fixed sections)
  - Rating-based journal organization with visual indicators
  - Multi-select functionality with "Select All" options per rating
  - Clean button interactions without distracting hover scale effects
  - Responsive design with proper mobile support

### Changed

- **Redesigned Boolean Operator Interface**

  - Operators only appear when multiple blocks exist
  - First block shows "with next block" options, subsequent blocks show "with previous block"
  - Separate exclusion (NOT) toggle independent of block relationships
  - Clear visual indicators for operator relationships in preview

- **Improved Journal Selection UX**

  - Replaced fixed-height segmented sections with continuous scrollable list
  - Journal rating headers appear inline during scroll (A\* → A transition)
  - Better visual hierarchy with rating badges and journal information
  - Removed hover scale effects for cleaner interactions

- **Enhanced Query Translation Module (QTM)**

  - Updated SearchBlock interface to use `booleanOperator` instead of deprecated `exclude` property
  - Simplified QTM logic with better error handling and validation
  - Support for journal ISSN filtering through GlobalFilters interface
  - Improved URL encoding and parameter handling

- **Updated Component Architecture**
  - SearchBlockComponent updated with new boolean operator logic
  - QueryPreview component enhanced with journal filtering support
  - QueryBuilder integration with SimplifiedJournalSelector in global filters
  - Consistent TypeScript interfaces across all components

### Fixed

- **Interface Compatibility Issues**

  - Resolved all TypeScript compilation errors from interface changes
  - Fixed duplicate import statements and unused component references
  - Updated all component prop types to match new SearchBlock interface
  - Corrected query validation logic to use new boolean operator system

- **Journal List Scrolling**

  - Fixed segmented journal display to create seamless scrolling experience
  - Removed fixed-height containers that broke natural scroll flow
  - Implemented inline rating headers that appear naturally during scroll

- **Boolean Operator Logic**
  - Fixed operator display logic to only show relevant options based on block position
  - Corrected preview text to show proper "with previous/next" relationships
  - Resolved logic conflicts between exclusion and relationship operators

### Technical Improvements

- **Type Safety Enhancements**

  - Complete TypeScript interface overhaul with proper type definitions
  - Journal data validation with comprehensive error handling
  - Strict type checking for all boolean operator combinations
  - Interface consistency across all components and modules

- **Performance Optimizations**

  - Efficient CSV parsing and journal data loading
  - Optimized component re-rendering with proper state management
  - Reduced bundle size through proper tree-shaking of unused components
  - Improved memory usage with better data structure design

- **Code Architecture**
  - Separation of concerns between UI components and data processing
  - Modular design for easy extension and maintenance
  - Comprehensive documentation and inline code comments
  - Follow-up validation and correction documentation (`docs/corrections-applied.md`)

### Notes

- Journal filtering provides significantly higher precision than Google Scholar's basic interface
- Boolean operator logic now properly handles complex query relationships
- All major UI/UX issues from user feedback have been resolved
- System successfully compiles and builds without errors using bun

## [0.2.0] - Modern UI with shadcn/ui and Advanced Query Logic

### Added

- **shadcn/ui components** with professional design system
  - Custom Button, Input, Select, Checkbox, and Label components
  - Consistent styling with CSS variables for theming
  - Accessible components with proper ARIA attributes
- **Lucide React icons** for enhanced visual hierarchy
  - Search, Filter, Calendar, Code, and other contextual icons
  - Consistent 4px icon sizing throughout interface
- **Advanced query logic features**
  - OR operator support between search blocks
  - Global filters section with year range inputs
  - Citation control (include/exclude citations)
  - Real-time query preview with color coding
- **Enhanced user experience**
  - Hover effects and smooth transitions on all interactive elements
  - Cursor states (pointer, text) for improved usability
  - Scale animations on buttons (hover: 105%, active: 95%)
  - Color-coded query previews (normal: blue, NOT: red, OR: orange)
- **Consolidated information architecture**
  - Single global notes panel explaining all field types
  - Removed redundant field notes from individual blocks
  - Organized field documentation by operator vs. approximation methods
- **Improved layout and spacing**
  - Horizontal search block layout (Search In | Search Term)
  - Reduced spacing between blocks for better cohesion
  - Responsive grid for global filters
  - Professional gradient background

### Changed

- **Updated QTM logic** to support OR operations and global filters
  - Modified `buildScholarUrl()` to handle OR concatenation
  - Added GlobalFilters interface with year range and citation options
  - Enhanced URL parameter generation for advanced filters
- **Redesigned SearchBlockComponent** with modern UI
  - Side-by-side field selection and term input
  - Logic toggles (NOT, OR) with proper visual feedback
  - Removed individual field notes to reduce clutter
- **Enhanced QueryBuilder** with comprehensive filter options
  - Global filters panel above search blocks
  - Year range inputs (from/to) with validation
  - Mutually exclusive citation checkboxes
  - Improved action button layout with icons
- **Fixed dropdown backgrounds** to solid white for better visibility
- **Updated Tailwind configuration** to support shadcn color system

### Technical Improvements

- **CSS Variables** implementation for consistent theming
- **Transition animations** with 200ms duration throughout interface
- **Type safety** with updated SearchBlock and GlobalFilters interfaces
- **Accessibility** improvements with proper labels and ARIA attributes
- **Performance** optimizations with efficient re-renders and state management

### Fixed

- **Dropdown transparency** issues resolved with solid backgrounds
- **Button cursor states** now properly indicate interactivity
- **Input hover effects** provide visual feedback before focus
- **Checkbox interactions** include hover states and smooth transitions

## [0.1.0] - Initial Project Setup and Core QTM Implementation

### Added

- Initial project setup with Next.js 15 and TypeScript
- Core data layer (`/data/SearchWithin.ts`) with comprehensive search field mapping
  - Support for 10 search fields including Article Title, Author, Source Title, Abstract, Keywords, etc.
  - Proper field definitions with Google Scholar operator mapping
  - `mustQuote` flags for fields requiring exact phrase matching
- Google Scholar configuration (`/config/GSConfig.ts`)
  - Mandatory parameters: BASE_URL, DEFAULT_HL, DEFAULT_AS_SDT
  - Optional global filters for advanced functionality
  - URL length validation constants
- Query Translation Module (QTM) logic (`/lib/qtm.ts`)
  - `buildScholarUrl()` function for converting search blocks to valid Google Scholar URLs
  - Individual search block synthesis with proper quoting and operator application
  - URL encoding and validation
  - Input sanitization and error handling
- React UI components
  - `SearchBlockComponent` for individual search input blocks
  - `QueryBuilder` main interface with dynamic block management
  - Support for field selection, search terms, and exclusion (NOT) logic
- Complete working interface
  - Add/remove search blocks dynamically
  - Real-time query preview
  - Redirect to Google Scholar on search
  - Help documentation and field notes
  - Responsive design with Tailwind CSS

### Technical Details

- Implements implicit AND logic by concatenating search blocks with spaces
- Proper handling of Google Scholar operators: `intitle:`, `author:`, `source:`
- Exact phrase matching for non-indexed fields (Abstract, ISSN, DOI, etc.)
- URL encoding with `encodeURIComponent()` for special character handling
- Input validation and sanitization for production safety
- TypeScript interfaces for type safety and data integrity

### Notes

- Fields like Abstract, Keywords, ISSN, DOI use approximation methods since Google Scholar doesn't have dedicated indexed fields
- All identifier fields (ISSN, DOI, ORCID) are wrapped in quotes for precise matching
- Maximum URL length validation (2048 characters) with warnings
