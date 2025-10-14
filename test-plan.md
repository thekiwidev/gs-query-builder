# Google Scholar Query Builder Implementation Test Plan

This document outlines the test cases for verifying our enhanced query builder implementation works correctly, especially for the specific examples requested.

## Test Case 1: Author "John Smith" AND title "machine learning"

### Setup

1. Create two search blocks:
   - Block 1: Field = "Author", Term = "John Smith"
   - Block 2: Field = "Article Title", Term = "machine learning"
   - Operator between blocks = "AND" (implicit default)

### Expected Results

- Raw Query: `author:"John Smith" intitle:"machine learning"`
- The query combines both terms with an implicit AND (space)
- Both terms should be properly quoted according to field requirements
- Google Scholar URL should contain the encoded query

### Validation Points

- Ensure proper field operators are applied (`author:` and `intitle:`)
- Verify quotes are added correctly to multi-word author name
- Check that the implicit AND relationship works correctly

## Test Case 2: Title contains "neural networks" OR "deep learning"

### Setup

1. Create two search blocks:
   - Block 1: Field = "Article Title", Term = "neural networks"
   - Operator = "OR_NEXT"
   - Block 2: Field = "Article Title", Term = "deep learning"

### Expected Results

- Raw Query: `(intitle:"neural networks" OR intitle:"deep learning")`
- The terms should be grouped with parentheses
- Both terms should use the `intitle:` operator
- The OR operator should be explicit between terms
- Google Scholar URL should contain the encoded query

### Validation Points

- Check that parentheses are placed correctly
- Verify the OR operator is explicitly included
- Ensure both terms use the correct field operator
- Verify quotes are added correctly for multi-word phrases

## Test Case 3: Papers about "blockchain" but exclude "cryptocurrency"

### Setup

1. Create two search blocks:
   - Block 1: Field = "All Fields", Term = "blockchain"
   - Block 2: Field = "All Fields", Term = "cryptocurrency"
   - Operator for Block 2 = "EXCLUDE" (NOT)

### Expected Results

- Raw Query: `blockchain -cryptocurrency`
- The second term should be prefixed with a minus sign for exclusion
- Google Scholar URL should contain the encoded query

### Validation Points

- Check that the exclusion operator (minus sign) is correctly applied
- Verify that no quotes are added to single-word terms in general search
- Ensure the implicit AND relationship works with exclusions

## Test Case 4: Author "Johnson" in "Information Systems" field journals

### Setup

1. Create one search block:
   - Block 1: Field = "Author", Term = "Johnson"
2. Select field of study filter "Information Systems"
3. Select multiple journals from that field

### Expected Results

- Raw Query: `author:"Johnson" ("1234-5678" OR "8765-4321" OR "2468-1357")`
  - (with actual ISSN numbers from selected journals)
- The journals should be grouped with parentheses
- Multiple journals should be connected with OR operators
- Google Scholar URL should contain the encoded query

### Validation Points

- Verify author search works correctly
- Check that journal ISSNs are formatted correctly with quotes
- Ensure multiple journals are combined with OR operators
- Verify parentheses are correctly placed around the journal group
- Check that the author and journal group are combined with implicit AND

## Execution Steps

1. For each test case:

   - Set up the search blocks as specified
   - Check the query preview before submission
   - Verify the raw query matches expectations
   - Check the generated Google Scholar URL
   - Verify URL encoding is correct

2. Additional verification:
   - Copy the raw query and paste into a Google Scholar search box directly
   - Verify search results match expectations
   - Check that the URL parameters are correctly formed

## Edge Cases to Consider

- Empty search terms
- Special characters in search terms
- Extremely long search terms
- Invalid field selections
- Mixed operator types
