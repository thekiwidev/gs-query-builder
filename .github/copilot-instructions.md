# Copilot Instructions: Google Scholar Query Translator (QTM)

## Project Goal

The primary goal is to translate an arbitrary number of structured search inputs (Field, Term, Boolean Operator), modeled after Scopus/advanced search interfaces, into a single, valid, and URL-encoded query string (`q`) for redirection to the Google Scholar (GS) search results page.

## I. Core Architecture and Data Layer

### 1. Define Search Field Data (`/data/SearchWithin.ts`)

The available search fields and their corresponding GS syntax must be centrally defined.

**Instruction:** Create a TypeScript file exporting the `GS_SEARCH_FIELDS` array. Each object in this array **must** include the following properties:

| Property     | Type             | Usage                                                                                                                                                                                                             |
| ------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | `string`         | Unique key (e.g., `article_title`).                                                                                                                                                                               |
| `label`      | `string`         | User-facing label (e.g., "Article Title").                                                                                                                                                                        |
| `gsOperator` | `string \| null` | The GS operator prefix (`intitle:`, `author:`, `source:`). Use `null` for general full-text search ("All Fields"). [1]                                                                                            |
| `mustQuote`  | `boolean`        | **MANDATORY:** Set to `true` for all phrases or non-native GS fields (e.g., ISSN, Abstract, Keywords, DOI, multi-word authors) to force exact phrase matching and high precision within the full-text search. [2] |

### 2. Define Mandatory Parameters (`/config/GSConfig.ts`)

The base URL and constant parameters required for all GS queries must be defined.

**Instruction:** Include the following required constants:

- `BASE_URL`: `https://scholar.google.com/scholar?`
- `DEFAULT_HL`: `en` (Host Language). [3]
- `DEFAULT_AS_SDT`: `0%2C5` (Academic/Standard Document Type). [3]

## II. Frontend & Input Handling

### 3. Build Dynamic Query Block Component

The UI must allow for dynamic, repeatable search blocks.

**Instruction:** Develop a React component that manages the state for each search block, capturing three primary inputs:

- **Field Selection:** Uses `id` from `GS_SEARCH_FIELDS`.
- **Search Term:** The string input by the user.
- **Exclusion Flag (NOT):** A boolean state indicating if the search term should be excluded (prefixed with `-`). [4]

### 4. Implement Redirection on Submit

The final action **must** be a redirect.

**Instruction:** Upon form submission, the application **must not** attempt to fetch search results directly. It **must** execute the `buildScholarUrl` function (Step 5) and perform a programmatic redirection (e.g., `Next.js useRouter().push()`) to the resulting URL.

## III. The Query Translation Module (QTM) Logic

Create the central `buildScholarUrl(blocks)` function responsible for synthesis and encoding.

### 5. Synthesize Individual Search Blocks (Iteration)

The QTM function **must** iterate over the input blocks and translate them into GS-compliant search fragments:

1.  **Apply Exclusion:** If the block's exclusion flag is set, prepend the synthesized term with the exclusion operator: `-`. [4]
2.  **Determine Quoting:** If the selected field's `mustQuote` flag is `true`, wrap the user's `Search Term` in double quotes (`"`). This overrides any other quoting. [2]
3.  **Apply GS Operator:** Prepend the final term/phrase with the `gsOperator` (e.g., `intitle:`).
    - _Example:_ (Title, "AI Agent", No) → `intitle:"AI Agent"`
    - _Example:_ (ISSN, "1234-5678", No) → `"1234-5678"` (Quotes required because `mustQuote` is true).

#### 6. Assemble the Primary Query (`q`) and URL Encode (Critical Step)

This step dictates how multiple blocks interact (implicit AND logic).

1.  **Concatenate with AND:** Join all synthesized blocks from Step 5 using a single space. This space represents the implicit **AND** logic in Google search. [4]
2.  **Full URL Encoding:** The resultant raw query string **MUST** be passed through `encodeURIComponent()` to handle spaces and special characters. This encoding converts the space separators into `+` or `%20`, ensuring the entire query is transmitted correctly within the URL. [1]

### 7. Final URL Construction

Assemble all components into the final URL string:

` + hl= + &as_sdt= + &[optional_filters] + &q=`

## IV. Development and Maintenance Standards

### 8. Adherence to TypeScript and Interfaces

**Instruction:** Maintain strict type checking. All data structures, including input block definitions and the `SearchFieldDefinition`, **must** be defined using TypeScript interfaces to enforce data integrity.

### 9. Mandatory Changelog Updates

The project **must** maintain a history of significant changes.

**Instruction:** Every time a change is deployed that affects the QTM logic, the core data layer, or public interface features, the developer **MUST** update the `CHANGELOG.md` file located at the project root.

- **Standard:** Use the "Keep a Changelog" standard (Unreleased, Added, Changed, Fixed, Removed).
- **Trigger for Update:** Any modification to the `GS_SEARCH_FIELDS` data, logic within the `buildScholarUrl` function, or the introduction of new optional filters (e.g., date ranges). [5]

### 10. Defensive Programming

**Instruction:** Implement input sanitization and URL length checks. While unlikely to hit the limit with standard queries, include a mechanism to validate that the final URL length does not exceed 2048 characters to ensure compatibility across all environments. [2]
