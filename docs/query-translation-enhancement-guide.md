# Query Translation Enhancement Guide

This guide outlines the implementation requirements for enhancing the Google Scholar Query Builder with improved boolean operations, journal selection handling, and operator controls.

## 1. Proper Parenthetical Grouping for Boolean Operations

### Current Implementation Issue

Currently, the query builder concatenates search blocks without proper parenthetical grouping, which affects how Google Scholar interprets boolean relationships between terms.

### Implementation Requirements

#### 1.1. Parentheses for Boolean Operations

When using boolean operators (AND/OR) between search blocks, the related terms must be enclosed in parentheses to define clear operational boundaries:

- **AND Operations**: `(term1 AND term2)`
- **OR Operations**: `(term1 OR term2)`

#### 1.2. Update the Query Synthesis Logic

Modify the `buildScholarUrl()` function in `lib/qtm.ts` to properly group related terms based on their boolean relationship:

```
// Example of desired output format - not actual implementation code
// For OR operations:
const orGroup = `(${block1} OR ${block2})`;

// For AND operations:
const andGroup = `(${block1} AND ${block2})`;
```

## 2. Journal Selection Enhancement

### Current Implementation Issue

Selecting journals in the field of study currently breaks the query building process, resulting in an error.

### Implementation Requirements

#### 2.1. Use ISSNs Instead of Journal Names

Replace journal names with their corresponding ISSNs in the query:

- For each selected journal, use its ISSN in the query instead of the display name
- Ensure the ISSNs are quoted for exact matching: `"1234-5678"`

#### 2.2. Parenthetical Grouping for Multiple Journals

When multiple journals are selected, group their ISSNs with OR operators inside parentheses:

```
("1234-5678" OR "2345-6789" OR "3456-7890")
```

If only one journal is selected, no parentheses are needed:

```
"1234-5678"
```

#### 2.3. Integration with Main Query

The journal ISSN(s) should be appended to the main query with an implicit AND (space):

```
main_query_terms ("ISSN1" OR "ISSN2")
```

## 3. Enhanced Operator Controls

### Current Implementation Issue

The current UI only offers exclusion options on search blocks without clear control over boolean relationships.

### Implementation Requirements

#### 3.1. Create an "Operators" Dropdown

Replace the current "include/exclude" toggle with a comprehensive operators dropdown on each search block:

| Option Label             | Functionality                                  |
| ------------------------ | ---------------------------------------------- |
| AND next block           | Connect this block with the next using AND     |
| AND previous block       | Connect this block with the previous using AND |
| OR next block            | Connect this block with the next using OR      |
| OR previous block        | Connect this block with the previous using OR  |
| Exclude this block (NOT) | Apply NOT logic to this block                  |

#### 3.2. Data Structure Update

Modify the `SearchBlock` interface in `lib/qtm.ts` to accommodate the new operator options:

```typescript
export interface SearchBlock {
  fieldId: string;
  term: string;
  operator: {
    type: "AND_NEXT" | "AND_PREV" | "OR_NEXT" | "OR_PREV" | "EXCLUDE" | "NONE";
  };
}
```

#### 3.3. Query Building Logic

Update the `synthesizeSearchBlock()` and `buildScholarUrl()` functions to interpret these new operator types and generate proper Google Scholar syntax.

## 4. Implementation Steps

### Step 1: Update Data Structures

1. Modify the `SearchBlock` interface to support the new operator types
2. Add ISSN information to the journal data structure
3. Ensure journal data includes proper ISSN values for all entries

### Step 2: Update UI Components

1. Replace the exclusion checkboxes with operator dropdowns
2. Ensure all search blocks have the same operator options regardless of position
3. Update the `SearchBlockComponent.tsx` to use the new operator selection instead of exclusion toggle

### Step 3: Enhance Query Synthesis

1. Update `synthesizeSearchBlock()` to handle the new operator types
2. Modify `buildScholarUrl()` to properly group terms with parentheses based on operators
3. Implement special handling for journal selections to use ISSNs
4. Add logic to handle the relationship between adjacent blocks based on operator selection

### Step 4: Test and Validate

1. Verify proper formatting of queries with different operator combinations
2. Ensure journal selections properly use ISSNs in the expected format
3. Validate that the generated Google Scholar URLs produce the expected search results
4. Test edge cases like single blocks, multiple blocks with mixed operators, and multiple journal selections

## 5. Expected Query Formats

### Example 1: Simple AND Query with Multiple Blocks

```
(intitle:"artificial intelligence" AND author:"Smith")
```

### Example 2: Query with OR Operations

```
(intitle:"machine learning" OR intitle:"deep learning")
```

### Example 3: Query with Journal Selection

```
neural networks ("1234-5678" OR "2345-6789")
```

### Example 4: Complex Query with Mixed Operators

```
(intitle:"robotics") AND (author:"Johnson" OR author:"Williams") NOT "survey"
```

### Example 5: Query with Field of Study and Journal

```
quantum computing ("0022-1007" OR "0033-2909")
```

## 6. Algorithm for Query Building

1. Group search blocks based on their operator relationships
2. For each group:
   - If the group contains blocks connected by AND, wrap them in parentheses with AND operator
   - If the group contains blocks connected by OR, wrap them in parentheses with OR operator
   - If a block has EXCLUDE set, prepend it with NOT
3. Handle journal selections separately:
   - Collect all selected journal ISSNs
   - If multiple journals are selected, group them with OR operators inside parentheses
   - If only one journal is selected, use its ISSN without parentheses
   - Append the journal part to the main query with an implicit AND (space)

## 7. Implementation Considerations

- Update the UI to clearly show the operator relationships between search blocks
- Consider adding visual cues to indicate how blocks are grouped by operators
- Ensure backward compatibility with existing saved queries
- Add proper error handling for invalid operator combinations
- Update the query preview component to accurately reflect the new formatting with parentheses
