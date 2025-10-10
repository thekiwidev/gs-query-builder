# Build guide

This guide provides a directive, step-by-step roadmap for building the Next.js application, focusing on the functional Query Translation Module (QTM) logic required to construct the final Google Scholar URL.

## Step-by-Step Guide for Google Scholar Query Builder

The entire application relies on constructing a single, correctly formatted URL query string (`q`) and redirecting the user to the standard Google Scholar search page.

### Phase 1: Data and Setup

#### 1. Define the Search Field Mapping (Data File)
Create a data structure (e.g., `SearchWithin.ts` or a JSON file) that dictates the available "search within" options in your dropdowns and how they translate to Google Scholar syntax. Each entry needs:

*   **Label:** The user-facing name (e.g., "Article Title").
*   **GS Operator:** The specific Google Scholar prefix (e.g., `intitle:` or `author:`). Use `null` for "All Fields." [1]
*   **Must Quote Flag:** A boolean flag that is **true** for fields requiring strict phrase matching (like ISSN, DOI, Abstract, or multi-word Authors) to ensure precision, forcing the term to be wrapped in double quotes (`""`). [2]

#### 2. Define Mandatory URL Parameters
Establish the fixed parameters required for every search URL. These should be kept in a constants file (e.g., `MandatoryQueryParams.ts`).

| Parameter | Value | Purpose |
|---|---|---|
| `baseURL` | `https://scholar.google.com/scholar?` | The target search endpoint. |
| `hl` | `en` | Host language. [3] |
| `as_sdt` | `0%2C5` | Filters to the standard Academic corpus (Default). [3] |

### Phase 2: User Interface (UI) Development

#### 3. Build the Dynamic Query Blocks
Implement the component structure that mimics the Scopus interface, allowing users to add multiple search blocks:

*   **Dropdown:** Uses the `Label` from the data mapping (Step 1).
*   **Text Input:** For the user's search term (e.g., "AI Agent").
*   **Boolean/Connector Control:** A mechanism (e.g., a button or dropdown) to define the relationship between the *previous* block and the *current* block (e.g., always default to implicit AND, but allow for an explicit "NOT" prefix). [4]
*   **Add/Remove Block Functionality:** Allows the user to dynamically create an unlimited number of search blocks.

### Phase 3: The Query Translation Module (QTM) Function

Create the central JavaScript/TypeScript function (`buildScholarUrl(blocks)`) that processes the array of user inputs (`blocks`) and assembles the final URL.

#### 4. Process Each Search Block Iteratively
Loop through the user-defined search blocks to synthesize the individual search components:

*   **a. Apply Exclusion (NOT):** Check the block's connector logic. If the user selected **NOT**, prepend a minus sign (`-`) to the synthesized term. [4]
*   **b. Enforce Quoting:** If the `Must Quote Flag` is set for the selected field (e.g., Abstract, ISSN), wrap the user's search term in double quotes (`"`). This is critical for high-precision, non-native field searching. [2]
*   **c. Apply Field Operator:** If a `GS Operator` exists (e.g., `author:`), prepend it to the quoted or unquoted search term.
    *   *Example:* If the user searched `Author: John Smith`, the block becomes `author:"John Smith"`.

#### 5. Assemble the Primary Query String (`q` parameter)
The Google search engine uses implicit **AND** logic when terms are separated by a space.

*   **Concatenate Blocks:** Join all the synthesized search blocks (from Step 4) together using a single space.
    *   *Example:* Combining `author:"Smith"` and `intitle:Quantum` yields the raw string: `author:"Smith" intitle:Quantum`.

#### 6. Final URL Encoding (Critical Step)
This is the most crucial technical step for production readiness. The raw query string must be correctly URL-encoded before being appended to the base URL:

*   **URL Encode the `q` String:** Apply a URL encoding function (e.g., `encodeURIComponent()` in JavaScript) to the entire raw query string (from Step 5). This converts spaces into the URL-safe plus sign (`+`) or `%20`. [5]
    *   *Resulting encoded string:* `q=author%3A%22Smith%22+intitle%3AQuantum`

#### 7. Construct and Execute Final Redirection
Combine the mandatory parameters and the fully encoded `q` string to form the complete URL:

*   **Final URL:** Concatenate the base URL, mandatory parameters, and the encoded query.
    *   *Structure:* `hl=en&as_sdt=0%2C5&[optional_filters]&q=[encoded_q_string]`
*   **Redirect:** Perform a client-side (e.g., using `window.location.href`) or server-side redirect to this final, fully constructed URL. The user is instantly transported to the Google Scholar search results page. [6]