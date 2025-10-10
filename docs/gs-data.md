# Googole Schoolar Search data.

This blueprint provides the necessary structured data and logic definitions for implementing the Query Translation Module (QTM) within your Next.js application, enabling the translation of Scopus-style multi-block searches into a single, valid Google Scholar URL.

The architecture relies on two key components: the **Field Mapping**, which defines the user interface dropdown options and their corresponding GS syntax, and the **Query Construction Logic**, which governs how these blocks are concatenated and URL-encoded.

-----

## 1\. Google Scholar Search Field Mapping (SearchWithin.ts)

This TypeScript file defines the fields users can search within, mapping them directly to the appropriate Google Scholar query syntax (operators or the main `q` parameter).

```typescript
// Define the structure for each searchable field, including
// how it translates to a Google Scholar query string.

export interface SearchFieldDefinition {
  // Unique identifier for the field (internal use)
  id: string;
  // User-facing label (for the dropdown)
  label: string;
  // The Google Scholar operator prefix (e.g., "intitle:")
  // If null, it defaults to searching the main 'q' parameter.
  gsOperator: string | null;
  // If true, the user's term MUST be wrapped in double quotes (e.g., "Term")
  // This is used for exact phrase matching or non-indexed fields.
  mustQuote: boolean;
  // Explanatory note for developer and/or user guidance
  notes: string;
}

export const GS_SEARCH_FIELDS: SearchFieldDefinition =;
```

## 2\. Query Translation Module (QTM) Logic Specification

The QTM is the functional backbone responsible for assembling the query blocks and converting them into the final URL string.

### A. Core Search Parameters (MandatoryQueryParams.ts)

These parameters must be included in **every** generated Google Scholar URL.

```typescript
export interface MandatoryParameters {
  // The base Google Scholar endpoint
  baseURL: string; 
  // Host Language (Sets interface language)
  hl: string;
  // Search Document Type (0,5 = Academic Corpus; 4 = Case Law)
  as_sdt: string;
}

export const GS_MANDATORY_PARAMS: MandatoryParameters = {
  baseURL: "https://scholar.google.com/scholar?",
  hl: "en", 
  as_sdt: "0%2C5", // Default: Standard academic/patents search
};

// --- Optional Global Filters for Advanced UI Options ---
export const GS_GLOBAL_FILTERS = {
  // Date Range (Year Low / Year High)
  yearLow: (year: number) => `as_ylo=${year}`, // e.g., 2020
  yearHigh: (year: number) => `as_yhi=${year}`, // e.g., 2024
  // Quick Date Range (e.g., d10 for last 10 days)
  quickDateRange: (range: string) => `as_qdr=${range}`,
  // Exclude Citations (0 = include, 1 = exclude)
  excludeCitations: (exclude: boolean) => `as_vis=${exclude? 1 : 0}`,
  // Enable/Disable Clustering Filters (1 = enabled, 0 = disabled)
  filterClustering: (enable: boolean) => `filter=${enable? 1 : 0}`,
  // Search Type Filter (Case Law Courts)
  caseLawCourts: (courts: string) => `as_sdt=4,${courts}`, // Requires '4' as the first value [1]
}
```

### B. Boolean and Syntax Rules for Query Construction

The QTM must implement the following rules when concatenating multiple search blocks into the single final `q` parameter string:

| Logical Connector | Google Scholar Syntax | QTM Action | Example Block Translation |
|---|---|---|---|
| **AND** (Between Blocks) | `+` (URL-encoded space) | Concatenate the structured search blocks with a URL-encoded space. | `(block A) + (block B)` |
| **OR** (Within a Block) | `OR` (must be capitalized) | The QTM must manage the scope, often requiring parentheses `()` if operators are involved. | `(intitle:TermA OR intitle:TermB)` |
| **NOT** (Exclusion) | `-` (Minus sign) | Prepend the minus sign *immediately* before the term or operator. | `-source:"IEEE"` |
| **Exact Phrase** | `"` (Double quotes) | Wrap the term in double quotes, regardless of the operator, if `mustQuote: true` is set in the definition. | `author:"J Smith"` or `"1234-5678"` |

### C. The QTM Processing Pipeline (Step-by-Step)

The production code for the QTM function should follow this sequence for each search block:

1.  **Iterate Blocks:** Loop through the user-defined search blocks: `(Field: Term, Connector, Exclude)`.
2.  **Determine Exclusion:** If the user selected a "NOT" or exclusion flag, prepend a minus sign (`-`) to the output string for this block.
3.  **Retrieve Field Definition:** Look up the `SearchFieldDefinition` object using the selected field ID.
4.  **Enforce Quotes:** If `mustQuote: true`, wrap the user-supplied `Term` in double quotes (`"Term"`).
5.  **Apply Operator:** If `gsOperator` is not `null`, prepend the operator to the term (e.g., `intitle:"Term"`).
6.  **Synthesize Block:** The resulting string is the fully synthesized search block (e.g., `author:"D Knuth"`).
7.  **Concatenate with AND:** Join all synthesized blocks together using the URL-encoded space character (`+`). This is Google's implicit AND operator.
8.  **URL Encode:** The final string for the `q` parameter (e.g., `author:"J+Smith"+intitle:Nano`) must be fully URL-encoded to handle spaces, quotes, and special characters before being inserted into the final URL.

**Example of Final URL Generation:**

For the query: **(ISSN: 1234-3343) AND (All Fields: AI Agent)**

1.  **Block 1 (ISSN):** Requires quoting. `gsOperator` is null.
      * Synthesized: `"1234-3343"`
2.  **Block 2 (All Fields):** No required quoting. `gsOperator` is null.
      * Synthesized: `AI Agent`
3.  **Concatenation:** Join with `+`
      * Raw Query String: `"1234-3343" + AI Agent`
4.  **Final URL Construction:**
      * Base URL: `https://scholar.google.com/scholar?`
      * Mandatory Params: `hl=en&as_sdt=0%2C5`
      * Final Query: `&q="1234-3343"+AI+Agent`

**Resulting Production URL:**

`https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q="1234-3343"+AI+Agent`