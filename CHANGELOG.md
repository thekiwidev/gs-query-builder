# Changelog

All notable changes to the Google Scholar Query Translator (QTM) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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