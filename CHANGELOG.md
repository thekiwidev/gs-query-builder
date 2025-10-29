# Changelog

All notable changes to the Scholarle Query Builder project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2025-10-29 - Complete UI Overhaul: Modern Design System, Enhanced UX, and Scholarle Branding

### Added

- **Comprehensive UI Enhancement Package** - Major visual and interaction improvements across the entire application

  - **Enhanced Search Terms Container** with structured layout

    - Dedicated header section with "Search Terms" title inside container
    - Individual search blocks with white backgrounds and `rounded-2xl` styling
    - "Add Another" button integrated within the container for better UX
    - Search button positioned in its own bordered section at the bottom
    - Faint border separators (`border-gray-100`) between all sections
    - Gray background container (`bg-gray-50`) with prominent `rounded-xl` styling

  - **Improved Button System** with enhanced interactions

    - "Add Another" button as clean text + icon (blue color, no borders)
    - Hover effects with scaling (`hover:scale-105`) and color transitions
    - Search button with proper enabled/disabled states and cursor feedback
    - Enhanced reset form button with red hover states and clean styling
    - All buttons use primary brand blue (`#4D90FD`) consistently

  - **Enhanced Journal Ratings Interface** - Fully clickable, color-coded rating cards
    - 2x2 grid layout with individual colored cards for each rating
    - Full card click area (not just checkbox) for better usability
    - Color-themed ratings: A\* (amber), A (blue), B (green), C (gray)
    - Hover scaling effects and smooth transitions
    - Enhanced "Select All" and "Clear All" buttons with color-coded hover states

- **Scholarle Branding Implementation** - Complete rebrand from Google Scholar to Scholarle

  - **New Brand Identity** with Library icon integration

    - Library icon (`lucide-react`) as primary brand symbol
    - Consistent icon usage in header and footer with brand blue color
    - Very close icon-to-text spacing (`gap-0.5`) for cohesive logo appearance
    - Proper icon sizing: `w-7 h-7` in header, `w-6 h-6` in footer

  - **Complete Name Migration** - All references updated throughout codebase

    - "Google Scholar Query Builder" → "Scholarle Query Builder"
    - Updated in metadata, headers, footers, documentation, and comments
    - Package name changed to "scholarle-query-builder"
    - Maintained backward compatibility with functionality

  - **Enhanced Brand Presentation**
    - Professional description: "Build sophisticated academic search queries with advanced field targeting and precision filtering for comprehensive literature discovery"
    - Library icon integrated into all headers and brand mentions
    - Consistent brand color (`#4D90FD`) used throughout interface

- **Modern Form Controls** with consistent rounded styling

  - **Enhanced Border Radius System** - Balanced visual hierarchy

    - Input fields and select dropdowns: `rounded-lg` (optimal balance)
    - Search block containers: `rounded-2xl` (prominent modern look)
    - Checkbox containers: `rounded-lg` (consistent with form elements)
    - Button components: `rounded-lg` baseline with size-specific overrides

  - **Sidebar Component Enhancements**
    - Field of Research dropdown: `rounded-lg` trigger and menu
    - Journal selector container: `rounded-lg` for modern appearance
    - Action buttons: Enhanced with `rounded-lg` and improved hover states
    - Year range inputs: Proper sizing and styling consistency

- **Automatic Section Highlighting** on How to Use page
  - Intersection Observer API implementation for scroll-based highlighting
  - Real-time sidebar navigation updates as user scrolls through sections
  - Smart viewport detection (middle third triggering) for accurate highlighting
  - Smooth transitions between active section states

### Changed

- **Complete UI Design System Overhaul**

  - **Search Interface Redesign** - Containerized, structured layout

    - Search terms now contained within a bordered, rounded container
    - Three distinct sections: header, search blocks, action buttons
    - Improved visual hierarchy with consistent spacing and borders
    - Enhanced mobile responsiveness and desktop usability

  - **Button Styling Standardization** - Professional, consistent interactions

    - Primary buttons use solid brand blue instead of gradients
    - Consistent hover states with proper cursor feedback
    - Enhanced disabled states with clear visual indicators
    - Removed excessive visual effects, focused on functionality

  - **Form Input Enhancements** - Modern, accessible controls
    - Increased border radius from `rounded-md` to `rounded-lg` for inputs
    - Select components updated with consistent styling
    - Checkbox components enhanced with proper border radius
    - Improved focus states and hover interactions throughout

- **Brand Identity Migration** - Complete transition to Scholarle

  - **Header and Footer Updates** - Consistent branding elements

    - Header: Library icon + "Scholarle" with minimal spacing
    - Footer: Brand section updated with icon integration
    - Removed "ScholarGO" legacy branding completely
    - Professional typography and spacing improvements

  - **Metadata and Configuration Updates**
    - App title: "Scholarle Query Builder"
    - Package configuration: Updated name and branding
    - All user-facing text migrated to new brand
    - Technical documentation updated for new identity

- **Enhanced User Experience** - Improved interactions and feedback

  - **Cursor States and Hover Effects** - Professional interaction design

    - Proper cursor states: `cursor-pointer` for clickable, `cursor-not-allowed` for disabled
    - Hover scaling and color transitions on interactive elements
    - Enhanced button feedback with `hover:scale-105` and `active:scale-95`
    - Smooth transitions with consistent timing (200ms duration)

  - **Sidebar Improvements** - Better usability and visual appeal
    - Journal rating cards fully clickable with clear visual feedback
    - Enhanced dropdown styling with improved border radius
    - Better button interactions without excessive visual effects
    - Improved spacing and typography throughout sidebar sections

### Fixed

- **React Hooks Compliance** - Proper hook usage patterns

  - Fixed `useCallback` hook violation in HowToUsePage component
  - Moved callback definition outside `useEffect` to component top level
  - Proper dependency array management for intersection observer
  - Eliminated "Invalid hook call" runtime errors

- **Border Radius Balance** - Consistent visual design

  - Reduced overly rounded elements from `rounded-xl` to `rounded-lg`
  - Achieved optimal balance between modern appearance and usability
  - Consistent form element styling throughout application
  - Professional appearance without excessive roundness

- **Icon and Text Alignment** - Cohesive brand presentation
  - Proper spacing between Library icon and text in all locations
  - Consistent icon sizing relative to text elements
  - Eliminated background containers on icons for cleaner appearance
  - Improved visual balance in header and footer sections

### Technical Improvements

- **Component Architecture Enhancements**

  - **SearchBlocksContainer** - Complete restructure for better UX

    - Self-contained component with internal header, blocks, and actions
    - Proper prop management for search and block operations
    - Enhanced error handling and validation states
    - Improved accessibility with proper ARIA labels

  - **Button Component System** - Unified styling and behavior

    - Base button styles updated with `rounded-lg` default
    - Consistent size variants with proper border radius inheritance
    - Enhanced disabled and active states across all button types
    - Improved TypeScript interfaces for better type safety

  - **UI Component Updates** - Modern design system implementation
    - Input components: Enhanced with `rounded-lg` and better hover states
    - Select components: Consistent styling with improved dropdown appearance
    - Checkbox components: Better border radius and interaction feedback
    - Form elements: Unified styling approach across all input types

- **Performance Optimizations**

  - **Intersection Observer Implementation** - Efficient scroll tracking

    - Optimized viewport detection with proper root margins
    - Efficient cleanup and memory management
    - Minimal re-renders with proper callback optimization
    - Smooth performance even with multiple sections

  - **State Management Improvements** - Better component efficiency
    - Optimized re-rendering patterns in enhanced components
    - Proper dependency management in useEffect hooks
    - Efficient prop drilling and state updates
    - Reduced unnecessary component updates

### Browser Compatibility

- ✅ All modern browsers with CSS Grid, Flexbox, and Intersection Observer support
- ✅ Enhanced mobile responsiveness with improved touch targets
- ✅ Proper accessibility with ARIA labels and keyboard navigation
- ✅ Smooth animations and transitions across all supported browsers

### Migration Notes

- **Branding Migration** - All external references updated

  - Documentation files maintain Google Scholar references where historically relevant
  - API endpoints and external integrations use new Scholarle branding
  - User-facing elements completely migrated to Scholarle identity
  - Technical implementation remains compatible with Google Scholar backend

- **UI Component Compatibility** - Backward compatible enhancements
  - All existing component APIs maintained for easy adoption
  - Enhanced styling doesn't break existing implementations
  - Gradual migration path for any custom styling overrides
  - No breaking changes to component interfaces

### Build Status

- ✅ TypeScript compilation passes (strict mode, zero errors)
- ✅ All pages render correctly with new branding and styling
- ✅ Enhanced components maintain full functionality
- ✅ Automatic section highlighting works smoothly
- ✅ All interactive elements properly functional with enhanced UX
- ✅ Complete brand migration successful across all touchpoints

### Notes

- This release represents a major visual and branding overhaul while maintaining full functional compatibility
- Enhanced user experience with modern design principles and improved interaction patterns
- Scholarle branding provides a unique identity while maintaining academic search functionality
- All UI enhancements focus on usability, accessibility, and professional appearance
- Future development will build upon this enhanced design system foundation

---

## [1.4.0] - 2025-10-29 - UI Refinements, Button Styling Standardization, and Layout Improvements

### Added

- **Hero-Style Section on How-to-Use Page** (`components/help/HowToUsePage.tsx`)
  - Transformed header into hero section with gradient background
  - Added badge label "Complete Learning Guide"
  - Large gradient text title matching design system
  - Enhanced subtitle with better descriptive copy
  - Gradient blur effects for visual depth (blue and purple)
  - Increased padding for more spacious feel (pt-32 pb-20)

### Changed

- **Global Button Styling Standardization** - Unified primary button appearance

  - Updated default button variant in `components/ui/button.tsx` to use solid blue color
  - Changed from gradient (`bg-linear-to-r from-blue-500 to-blue-700`) to solid color (`bg-[#4D90FD]`)
  - White text color for all primary buttons (`text-white`)
  - Darker hover state (`hover:bg-[#3D7CDB]`) for better interaction feedback
  - Applied changes to:
    - `components/layout/Header.tsx` - Get Started button
    - `app/about/page.tsx` - Hero section and CTA buttons (2 instances)
  - Removed all inline gradient classes from button elements

- **Header Scrolling Behavior** (`components/layout/Header.tsx`)

  - Changed header from fixed positioning to scrolling naturally with page content
  - Removed `fixed top-0 left-0 right-0 z-50` classes
  - Header now part of normal document flow
  - Improves user experience by not obscuring content

- **How-to-Use Page Navigation** (`components/help/HowToUsePage.tsx`)

  - Removed Home button and Close button from hero section
  - Simplified header to focus on content title and description
  - Cleaner hero section without action buttons

- **How-to-Use Page Sidebar Sticky Positioning** (`components/help/HowToUsePage.tsx`)
  - Adjusted sticky top position from `top-32` to `top-6`
  - Sidebar now sticks much closer to viewport top when scrolling
  - Reduced unnecessary padding gap between header and sidebar
  - Improved vertical space utilization

### Fixed

- **Duplicate Footer on Help Page** (`components/help/HowToUsePage.tsx`)

  - Removed duplicate `Footer` component import and rendering
  - Now uses global footer from `LayoutWrapper` instead of page-specific footer
  - Prevents double footer appearance on `/how-to-use` route

- **Duplicate Footer on About Page** (`app/about/page.tsx`)

  - Removed duplicate `Footer` component import and rendering
  - Now uses global footer from `LayoutWrapper` instead of page-specific footer
  - Prevents double footer appearance on `/about` route

- **JSX Syntax Error on About Page** (`app/about/page.tsx`)
  - Fixed extra closing `</div>` tag in CTA section
  - Resolved parsing error that prevented build completion
  - Removed one extra `</div>` from lines 407-408

### Technical Details

- Button color `#4D90FD` chosen as primary brand blue across all UI elements
- Hover state `#3D7CDB` provides ~20% darker shade for clear interaction feedback
- Header scroll behavior improves page real-estate utilization
- Sidebar sticky positioning now accounts for scrolling header with minimal gap
- Global footer system prevents duplication issues across page variants
- All changes maintain backward compatibility with existing component structure

### Build Status

- ✅ TypeScript compilation passes (no errors)
- ✅ All pages render without errors
- ✅ Button styling applied consistently across codebase
- ✅ Header scrolling functional on all pages
- ✅ Footer appears exactly once on each page

### Notes

- Solid blue button styling provides more professional appearance than gradients
- Header now scrolls with content, improving UX on long pages
- Hero section on help page better matches about page design system
- Sidebar positioning optimized for pages with scrolling headers
- All UI refinements maintain responsive design across mobile and desktop

---

## [1.3.1] - 2025-10-20 - Fixed Operator Chaining Validation Logic

### Fixed

- **Critical: Operator Chaining Validation Flaws** - Fixed two major validation issues in `lib/operatorValidator.ts`

  - **Issue 1: First block not validated against next block**

    - Forward-chain validation (checking current block's `next` direction against next block's operator) was incorrectly nested within `blockIndex > 0` condition
    - This skipped validation of the first block (index 0), allowing invalid operator chains starting at position 0
    - Fixed by implementing forward check that runs for all blocks from index 0 to n-2

  - **Issue 2: Overly broad conflict detection**
    - Conflict checks were flagging valid operator sequences as errors (e.g., `AND with next` followed by `OR with next`)
    - This incorrectly rejected cases where one chain ends and another begins (perfectly valid in Boolean logic)
    - Fixed by implementing precise rules: only flag direct conflicts (e.g., `AND with next` followed by `OR with previous`)

- **Implementation Changes:**

  1. **Backward Check (for blocks 1 to n-1):**

     - Validates blocks with `operator="AND/OR"` and `operatorDirection="previous"`
     - Compares against previous block's `operatorDirection="next"` and operator type
     - Only flags error if operators differ (AND paired with OR or vice versa)

  2. **Forward Check (for blocks 0 to n-2):**

     - Validates blocks with `operator="AND/OR"` and `operatorDirection="next"`
     - Compares against next block's operator type and direction
     - Only flags error for direct incompatible pairs:
       - `(operator: AND, direction: next)` followed by `(operator: OR, direction: previous)` → ERROR
       - `(operator: OR, direction: next)` followed by `(operator: AND, direction: previous)` → ERROR
     - Allows chain boundaries (e.g., AND→next followed by OR→next)

  3. **Enhanced error messages:**
     - Messages now explain exactly which block has which operator
     - Suggestions guide users to fix the specific incompatibility
     - Example: "Cannot use OR with previous when the previous block uses AND with next"

### Technical Details

- Rule 4 in `operatorValidator.ts` completely rewritten for correctness (lines 73-108)
- Backward check runs for blocks with `operatorDirection="previous"` (blocks 1 to n-1)
- Forward check runs for blocks with `operatorDirection="next"` (blocks 0 to n-2)
- No block validation is skipped; coverage is complete from index 0 to last block
- Direct conflicts are the only errors flagged; valid chain transitions are allowed
- `ValidationResult` interface updated to include optional `suggestion` property

### Validation Examples

**Valid (before was incorrectly marked as error):**

- Block 0: `(AND, next)` | Block 1: `(OR, next)` | Block 2: ... ✅ (AND chain, then OR chain)
- Block 0: `(OR, next)` | Block 1: `(AND, next)` | Block 2: ... ✅ (OR chain, then AND chain)

**Invalid (now correctly caught at position 0):**

- Block 0: `(AND, next)` | Block 1: `(OR, previous)` ❌ (direct conflict - caught by forward check)

**Invalid (still correctly caught):**

- Block 0: `(AND, next)` | Block 1: `(AND, next)` | Block 2: `(OR, previous)` ❌ (OR mismatch - caught by backward check)

---

## [1.3.0] - 2025-10-20 - UI Polish, Footer Integration, and Responsive Layout Improvements

### Added

- **Light-Themed Footer Component** - Consistent branding across all pages

  - `components/layout/Footer.tsx` - Production-ready footer (185 lines)
  - Four-column grid layout with responsive design (1 col mobile, 4 cols desktop)
  - Sections: Brand, Product, Resources, Contact & Feedback
  - Social media links (Github, Twitter, LinkedIn) with hover effects
  - Dynamic copyright year calculation
  - Clean light theme matching website design (white background, gray text)
  - Links to Help & Documentation, Features, Pricing, Citation, Terms, Privacy
  - Contact section with email link and feedback options
  - Responsive Tailwind styling with smooth transitions

- **"How to Use" Page Footer Integration**

  - Added Footer component to HowToUsePage
  - Footer now appears at bottom of all pages via MainLayout
  - Consistent footer appearance across main site and documentation pages

- **"Go Back Home" Button on Help Page**

  - Added Home button next to X close button in HowToUsePage header
  - Blue-themed button with Home icon and text label
  - Direct navigation to homepage (`/`)
  - Complements existing X button (router.back())
  - Provides users with both back-navigation and home-navigation options

- **Help Page Quotation Error Fixes**

  - Fixed 78 compilation errors in HowToUsePage.tsx
  - Converted all straight quotes to HTML entities (`&quot;`)
  - Converted all apostrophes to HTML entities (`&apos;`)
  - Examples fixed: "Does Not Include", "machine learning", "artificial intelligence", "Jennifer Doudna", "Nature", etc.
  - All operator descriptions and examples now use proper entity encoding

- **Responsive Content Container with Max-Width**
  - `MainContentArea.tsx` updated with centered layout
  - Added `max-w-6xl` constraint for optimal readability
  - Content centered with `mx-auto` (auto margins)
  - Search block container no longer stretches too wide
  - Proper spacing on both sidebar open and collapsed states
  - Works seamlessly with collapsible/expanded sidebar

### Changed

- **Footer Styling** - Updated from dark to light theme

  - Background: `bg-gray-900` → `bg-white`
  - Text: `text-gray-100` → `text-gray-900`
  - Headers: `text-white` → `text-gray-900`
  - Links: `text-gray-400 hover:text-white` → `text-gray-600 hover:text-gray-900`
  - Borders: `border-gray-800` → `border-gray-200`
  - Consistent with website light theme

- **MainContentArea Component Architecture**

  - Changed from simple full-width `main` to structured layout
  - Added inner `div` with `max-w-6xl mx-auto` for content constraining
  - Implemented `flex-1 overflow-y-auto` for proper scrolling
  - Maintains `p-8 space-y-8` spacing within constrained container
  - Better responsive behavior across all screen sizes

- **HowToUsePage Imports** - Added Header navigation support

  - Added `Link` import from `next/link`
  - Added `Home` icon from `lucide-react`
  - Added `Footer` import from `@/components/layout/Footer`

- **HowToUsePage Header Section**
  - Updated button layout to use flex container with gap-2
  - Home button positioned next to X close button
  - Home button styling: blue border, blue text, blue hover background
  - Responsive button group with proper alignment

### Fixed

- **Search block container too-wide issue** - Now respects maximum width on all screen sizes
- **Quotation syntax errors in HowToUsePage** - All 78 errors resolved with proper HTML entities
- **Footer theme mismatch** - Footer now uses light theme consistent with website
- **Content centering** - Main content area now properly centered with auto margins

### Technical Details

- Footer uses `next/link` for internal navigation and `mailto:` for email
- Light theme colors follow consistent palette: gray-900 (text), gray-600 (secondary), gray-200 (borders)
- Home button uses `router.push()` in MainLayout and `Link` component in HowToUsePage
- `max-w-6xl` (64rem / 1024px) chosen as optimal content width for readability
- MainContentArea structure: `main (flex-1 overflow) → div (max-w-6xl mx-auto) → children`
- Footer responsive: 1 column on mobile (stack), 4 columns on desktop (grid)

### Browser Support

- ✅ All modern browsers with CSS Grid and Flexbox support
- ✅ Responsive design tested on mobile (< 768px) and desktop (≥ 768px)
- ✅ Light theme renders correctly on all browsers

### Notes

- Footer appears on all pages with consistent styling
- HowToUsePage now has complete navigation options (home + back buttons)
- Content width constraint improves readability on ultra-wide displays
- All HTML entities in HowToUsePage use standard ampersand notation (&quot;, &apos;)
- Light theme provides better visual hierarchy and readability
- Search blocks container width optimized for better UX on narrow sidebar state

---

## [1.2.0] - 2025-10-20 - Advanced Operator Chaining and Parenthetical Grouping

### Added

- **Advanced Operator Chaining Validation** - Sophisticated operator relationship enforcement

  - Directional operator types: AND_NEXT, AND_PREV, OR_NEXT, OR_PREV, EXCLUDE
  - Prevents invalid operator combinations (e.g., AND_NEXT followed by OR_PREV)
  - Context-aware operator filtering in SearchBlockComponent
  - PREV operator must match previous block's NEXT operator to maintain chain integrity
  - Comprehensive validation in operatorValidator.ts Rule 4

- **Intelligent Parenthetical Grouping** - Automatic chain detection and grouping

  - Identifies complete chains by checking forward (NEXT) and backward (PREV) connections
  - All connected blocks stay in same parenthesis group regardless of intermediate blocks
  - Chain breaking: Blocks disconnect only when operators don't connect
  - Example: Block1(AND_NEXT) Block2(OR_NEXT) Block3() Block4(AND_PREV) = (Block1 AND Block2 OR Block3 AND Block4)
  - Rewritten groupBlocksByOperator() function in qtm.ts with full chain detection logic

### Changed

- **SearchBlockComponent Operator Validation** (`components/SearchBlockComponent.tsx`)

  - Added allBlocks prop for context-aware validation
  - Implemented getValidOperators() function filtering operators based on previous block
  - Only shows valid operator options in dropdown that don't conflict with chain
  - PREV operator options disabled when incompatible with previous block's NEXT

- **Search Blocks Container** (`components/search/SearchBlocksContainer.tsx`)

  - Now passes allBlocks prop to SearchBlockComponent
  - Enables context-aware operator validation for entire query

- **Query Translation Module** (`lib/qtm.ts`)

  - Complete rewrite of groupBlocksByOperator() function
  - New chain identification algorithm: backward traversal to find chain start, forward traversal to find chain end
  - Helper function getOperatorType() to extract operator from block (supports new and legacy formats)
  - Proper handling of blocks with no explicit operators that are part of a chain
  - Chains properly wrapped in parentheses for all grouped blocks

- **Operator Validator Enhancement** (`lib/operatorValidator.ts`)

  - Added comprehensive Rule 4 for operator chaining validation
  - Bidirectional checking: validates both previous block's connection and next block's connection
  - Specific error messages for AND_NEXT/OR_PREV conflicts and OR_NEXT/AND_PREV conflicts
  - Suggestions provided for fixing operator conflicts

- **Terminology Updates** (Multiple files)

  - Changed "EXCLUDE" to "Does Not Include" for user clarity
  - Updated in SearchBlockComponent operator descriptions
  - Updated in SmartOperatorValidator.tsx description
  - Updated in booleanOperators.ts (NOT operator description)
  - Updated in HowToUsePage.tsx with better "Does Not Include" examples

- **Help Documentation Enhancement** (`components/help/HowToUsePage.tsx`)

  - Added new section: "Understanding Operator Grouping"
  - Replaced query format examples with English behavior descriptions
  - New examples show concrete use cases instead of configuration steps
  - Better explanation of what AND, OR, and "Does Not Include" actually do
  - Improved Example 1, 2, 3 with outcome-focused descriptions
  - Added visual example of operator chaining with expected results

- **Query Builder** (`components/QueryBuilder.tsx`)

  - Removed "Generated Query Display" section showing query string
  - Focus shifted from query syntax to query behavior and results

### Fixed

- Operator chaining no longer allows invalid AND/OR combinations within a chain
- Parenthetical grouping now correctly handles chains with blocks containing no forward operator
- Operator validation now prevents users from selecting incompatible operators
- Help page no longer shows technical query format syntax that confused users

### Technical Details

- Operator chaining uses directional indicators (NEXT/PREV) to create bidirectional connections
- Chain detection is O(n²) but acceptable for typical query sizes (<10 blocks)
- All blocks in a chain must use compatible operators: AND_NEXT must pair with AND_PREV (or AND_NEXT for forwarding)
- Empty blocks (no search term) don't break chains - they're filtered out during query building

### Validation Rules Summary

1. **PREV must match NEXT:** If Block 1 has AND_NEXT, Block 2 must use AND_PREV (not OR_PREV)
2. **All operators valid forward:** Block can have AND_NEXT OR OR_NEXT for next connection, independent of PREV
3. **First block no operators:** Cannot have AND_PREV or OR_PREV on first block
4. **Last block no forward:** Cannot have AND_NEXT or OR_NEXT on last block
5. **EXCLUDE at end only:** "Does Not Include" blocks typically at end of query
6. **No mixing in chain:** All blocks in same parenthesis group must use same operator type for that group

### User Experience Improvements

- Operator dropdown only shows valid choices eliminating user confusion
- Help page explains what operators do instead of how to format them
- Error messages guide users to valid operator configurations
- Consistent terminology ("Does Not Include" instead of "EXCLUDE")

### Notes

- This release makes the operator system much more sophisticated and user-friendly
- Prevents entire categories of invalid queries that would confuse users
- Help documentation now focuses on outcomes rather than syntax
- All changes are backward compatible - legacy booleanOperator still supported

---

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
