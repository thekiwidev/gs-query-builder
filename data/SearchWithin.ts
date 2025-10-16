/**
 * Google Scholar Search Field Definitions
 *
 * Defines the available search fields and their corresponding Google Scholar syntax.
 * This is the core data layer for the Query Translation Module (QTM).
 */

export interface SearchFieldDefinition {
  /** Unique identifier for the field (internal use) */
  id: string;
  /** User-facing label (for the dropdown) */
  label: string;
  /** The Google Scholar operator prefix (e.g., "intitle:", "author:", "source:")
   * If null, it defaults to searching the main 'q' parameter. */
  gsOperator: string | null;
  /** If true, the user's term MUST be wrapped in double quotes (e.g., "Term")
   * This is used for exact phrase matching or non-indexed fields. */
  mustQuote: boolean;
  /** Explanatory note for developer and/or user guidance */
  notes: string;
  /** Category for UI organization */
  category: "field" | "proximity" | "phrase";
  /** Whether this operator requires special input handling */
  requiresSpecialInput?: boolean;
  /** Placeholder text for the input field */
  placeholder?: string;
}

// Clean, focused search fields based on meeting feedback
export const GS_SEARCH_FIELDS: SearchFieldDefinition[] = [
  // === BASIC FIELD SEARCHES ===
  {
    id: "all_fields",
    label: "All Fields",
    gsOperator: null,
    mustQuote: false,
    notes: "General full-text search across all document content",
    category: "field",
    placeholder: "Enter search terms",
  },
  {
    id: "article_title",
    label: "Article Title",
    gsOperator: "intitle:",
    mustQuote: true,
    notes:
      "Restricts search to document titles only. High precision. Uses Google Scholar's intitle: operator.",
    category: "field",
    placeholder: "Title keywords or phrase",
  },
  {
    id: "author",
    label: "Author",
    gsOperator: "author:",
    mustQuote: true,
    notes:
      "Searches for papers by specific authors. Multi-word names require quotes.",
    category: "field",
    placeholder: "First Name Last Name",
  },
  {
    id: "abstract",
    label: "Abstract",
    gsOperator: "intext:",
    mustQuote: true,
    notes:
      "Searches within article abstracts and body text. Uses Google Scholar's intext: operator.",
    category: "field",
    placeholder: "Abstract keywords",
  },
  // {
  //   id: "source_title",
  //   label: "Source Title (Journal/Conference)",
  //   gsOperator: "source:",
  //   mustQuote: true,
  //   notes: "Restricts to papers published in specific journals or conferences",
  //   category: "field",
  //   placeholder: "Journal or conference name",
  // },
  // {
  //   id: "affiliation",
  //   label: "Affiliation",
  //   gsOperator: null,
  //   mustQuote: true,
  //   notes: "Searches institution name as exact phrase in full-text",
  //   category: "field",
  //   placeholder: "University or institution name",
  // },
  {
    id: "site_search",
    label: "Site/Domain",
    gsOperator: "site:",
    mustQuote: false,
    notes:
      "Restrict search to specific website or domain. Example: site:arxiv.org or site:.edu",
    category: "field",
    placeholder: "domain.com or .edu",
  },
  {
    id: "filetype_search",
    label: "File Type",
    gsOperator: "filetype:",
    mustQuote: false,
    notes: "Filter by document type. Common types: pdf, doc, ppt.",
    category: "field",
    placeholder: "pdf",
  },

  // === PHRASE MATCHING ===
  // {
  //   id: "exact_phrase",
  //   label: "Exact Phrase",
  //   gsOperator: null,
  //   mustQuote: true,
  //   notes:
  //     "Exact phrase matching using quotation marks. Ensures all words appear in exact order.",
  //   category: "phrase",
  //   placeholder: "exact phrase to search",
  // },
  // {
  //   id: "wildcard_phrase",
  //   label: "Wildcard Phrase",
  //   gsOperator: null,
  //   mustQuote: true,
  //   notes:
  //     "Use * as wildcard for unknown words in phrases. Example: 'John * Smith'",
  //   category: "phrase",
  //   placeholder: "word * wildcard phrase",
  // },

  // === PROXIMITY SEARCH ===
  // {
  //   id: "around_operator",
  //   label: "Proximity Search (AROUND)",
  //   gsOperator: "AROUND",
  //   mustQuote: false,
  //   notes:
  //     "Words within specified distance. Must be CAPITAL. Example: 'climate AROUND (5) change'",
  //   category: "proximity",
  //   requiresSpecialInput: true,
  //   placeholder: "word1 word2 (with distance setting)",
  // },
];

/**
 * Helper function to get a search field definition by ID
 */

/**
 * Helper function to get a search field definition by ID
 */
export function getSearchFieldById(
  id: string
): SearchFieldDefinition | undefined {
  return GS_SEARCH_FIELDS.find((field) => field.id === id);
}

/**
 * Helper function to get all available search field IDs
 */
export function getAllSearchFieldIds(): string[] {
  return GS_SEARCH_FIELDS.map((field) => field.id);
}

/**
 * Helper function to get fields by category
 */
export function getSearchFieldsByCategory(
  category: SearchFieldDefinition["category"]
): SearchFieldDefinition[] {
  return GS_SEARCH_FIELDS.filter((field) => field.category === category);
}

/**
 * Group fields for UI organization
 */
export const FIELD_CATEGORIES = {
  field: "Field-Specific Search",
  proximity: "Proximity Search",
  phrase: "Phrase Matching",
} as const;

/**
 * Get grouped fields for UI display
 */
export function getGroupedFields(): Record<string, SearchFieldDefinition[]> {
  const grouped: Record<string, SearchFieldDefinition[]> = {};

  Object.keys(FIELD_CATEGORIES).forEach((category) => {
    grouped[category] = getSearchFieldsByCategory(
      category as SearchFieldDefinition["category"]
    );
  });

  return grouped;
}
