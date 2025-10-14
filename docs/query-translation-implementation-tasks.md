# Query Translation Implementation Tasks

This document breaks down the implementation of the query translation enhancements into specific, actionable tasks. Use this as a checklist to track progress.

## Phase 1: Update Data Structures

### 1. Modify SearchBlock Interface

- [x] Update `lib/qtm.ts` to enhance the SearchBlock interface with new operator types
- [x] Add the operator property with type options: "AND_NEXT", "AND_PREV", "OR_NEXT", "OR_PREV", "EXCLUDE", "NONE"
- [x] Update any TypeScript types that depend on the SearchBlock interface
- [x] Add default value ("NONE") for operator in new blocks

### 2. Update Journal Data Structure

- [x] Review existing journal data format in `public/data/journals.csv`
- [x] Ensure ISSN data is available for all journals
- [x] Create helper functions in `lib/journalLoader.ts` to access journal ISSNs
- [x] Add ISSN extraction utility function in `lib/utils.ts`

## Phase 2: Enhance UI Components

### 3. Create Operator Selection Component

- [x] Design the operator dropdown UI component
- [x] Add operator options: "AND next block", "AND previous block", "OR next block", "OR previous block", "Exclude this block"
- [x] Style the operator dropdown to match the existing UI

### 4. Update SearchBlockComponent

- [x] Replace existing exclusion toggle with new operator dropdown in `components/SearchBlockComponent.tsx`
- [x] Add state management for operator selection
- [x] Enable/disable relevant operators based on block position (first/middle/last)
- [x] Add proper labeling for the operator dropdown ("Operators")

### 5. Update QueryBuilder Component

- [x] Modify `components/QueryBuilder.tsx` to handle the new operator options
- [x] Update logic for adding/removing search blocks with operator awareness
- [x] Add event handlers for operator changes
- [x] Ensure operator state is properly managed when blocks are added/removed

## Phase 3: Enhance Query Synthesis

### 6. Update Individual Block Synthesis

- [x] Modify `synthesizeSearchBlock()` in `lib/qtm.ts` to handle exclusion (NOT) operator
- [x] Add proper quoting and field operator application
- [x] Handle edge cases for different field types

### 7. Implement Boolean Grouping Logic

- [x] Create a new function `groupBlocksByOperator()` in `lib/qtm.ts`
- [x] Add logic to identify blocks connected by AND/OR relationships
- [x] Implement parenthetical grouping for related blocks
- [x] Handle mixed operator scenarios with proper precedence

### 8. Enhance Journal Selection Handling

- [x] Create a function `formatJournalSelection()` in `lib/qtm.ts`
- [x] Implement logic to extract ISSNs for selected journals
- [x] Add parenthetical grouping for multiple journals with OR operators
- [x] Handle single journal selection without parentheses
- [x] Ensure proper quotation of ISSNs

### 9. Update buildScholarUrl Function

- [x] Refactor `buildScholarUrl()` in `lib/qtm.ts` to use the new grouping logic
- [x] Integrate journal selection formatting
- [x] Add proper URL encoding for the enhanced query structure
- [x] Handle edge cases (empty blocks, invalid operators, etc.)

## Phase 4: Testing and Validation

### 10. Create Test Cases

- [x] Create test cases for different operator combinations
- [x] Add tests for journal selection scenarios
- [x] Develop tests for complex mixed operator queries
- [x] Create edge case tests (single block, empty blocks, etc.)

### 11. Update Query Preview Component

- [x] Enhance `components/QueryPreview.tsx` to display properly formatted queries
- [x] Add visual indication of parenthetical groupings
- [x] Update error handling for invalid queries
- [x] Ensure preview accurately reflects what will be sent to Google Scholar

### 12. Manual Testing

- [x] Test all operator combinations in the UI
- [x] Verify journal selection works with different field of study selections
- [x] Test URL encoding and decoding
- [x] Verify Google Scholar accepts the generated queries
- [x] Test edge cases and error handling

## Phase 5: Refinement and Documentation

### 13. Optimize Query Building Performance

- [x] Review query building logic for performance issues
- [x] Optimize parenthetical grouping for complex queries
- [x] Add memoization for expensive operations
- [x] Profile and fix any performance bottlenecks

### 14. Update Documentation

- [x] Update code comments to explain the new operator logic
- [x] Add JSDoc comments for new functions
- [x] Update README with information about the enhanced features
- [x] Add examples of properly formatted queries to documentation
- [x] Create comprehensive guide on building a Query Translator
- [x] Update implementation summary document
- [x] Create future enhancements document
- [x] Update CHANGELOG with documentation additions

### 15. Final Review and Launch

- [x] Conduct code review of all changes
- [x] Address any feedback from code review
- [x] Update CHANGELOG.md with the new features
- [x] Prepare for deployment
- [x] Finalize all documentation
- [x] Complete example tests and edge case tests
- [x] Mark all implementation tasks as complete

## Implementation Priorities

1. **High Priority**:

   - Update SearchBlock interface
   - Implement operator dropdown UI component
   - Update query synthesis for proper parenthetical grouping

2. **Medium Priority**:

   - Journal selection ISSN handling
   - Complex operator relationship handling
   - Query preview enhancements

3. **Lower Priority**:
   - Performance optimizations
   - Additional documentation
   - UI polish and visual cues

## Dependencies

- Task 3 (Operator Selection Component) depends on Task 1 (Modify SearchBlock Interface)
- Task 7 (Boolean Grouping Logic) depends on Task 1 (Modify SearchBlock Interface)
- Task 9 (Update buildScholarUrl) depends on Tasks 7 and 8
- Task 11 (Update Query Preview) depends on Task 9
