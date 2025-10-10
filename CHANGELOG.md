# Changelog

All notable changes to the Google Scholar Query Translator (QTM) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2025-10-10

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

## [0.1.0] - 2025-10-10

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
