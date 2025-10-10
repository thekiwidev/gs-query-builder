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
}

export const GS_SEARCH_FIELDS: SearchFieldDefinition[] = [
  {
    id: 'all_fields',
    label: 'All Fields',
    gsOperator: null,
    mustQuote: false,
    notes: 'General full-text search across all document content'
  },
  {
    id: 'article_title',
    label: 'Article Title',
    gsOperator: 'intitle:',
    mustQuote: true,
    notes: 'Restricts search to document titles only. High precision.'
  },
  {
    id: 'author',
    label: 'Author',
    gsOperator: 'author:',
    mustQuote: true,
    notes: 'Searches for papers by specific authors. Multi-word names require quotes.'
  },
  {
    id: 'source_title',
    label: 'Source Title (Journal/Conference)',
    gsOperator: 'source:',
    mustQuote: true,
    notes: 'Restricts to papers published in specific journals or conferences'
  },
  {
    id: 'abstract',
    label: 'Abstract',
    gsOperator: null,
    mustQuote: true,
    notes: 'Approximation: Uses exact phrase matching in full-text search. No dedicated abstract field in GS.'
  },
  {
    id: 'keywords',
    label: 'Keywords',
    gsOperator: null,
    mustQuote: true,
    notes: 'Approximation: Uses exact phrase matching in full-text search. No dedicated keywords field in GS.'
  },
  {
    id: 'affiliation',
    label: 'Affiliation',
    gsOperator: null,
    mustQuote: true,
    notes: 'Approximation: Searches institution name as exact phrase in full-text'
  },
  {
    id: 'issn',
    label: 'ISSN',
    gsOperator: null,
    mustQuote: true,
    notes: 'Critical: Not an indexed field in GS. Must use exact phrase matching for identifier strings.'
  },
  {
    id: 'doi',
    label: 'DOI',
    gsOperator: null,
    mustQuote: true,
    notes: 'Critical: Not an indexed field in GS. Must use exact phrase matching for identifier strings.'
  },
  {
    id: 'orcid',
    label: 'ORCID',
    gsOperator: null,
    mustQuote: true,
    notes: 'Critical: Not an indexed field in GS. Must use exact phrase matching for identifier strings.'
  }
];

/**
 * Helper function to get a search field definition by ID
 */
export function getSearchFieldById(id: string): SearchFieldDefinition | undefined {
  return GS_SEARCH_FIELDS.find(field => field.id === id);
}

/**
 * Helper function to get all available search field IDs
 */
export function getAllSearchFieldIds(): string[] {
  return GS_SEARCH_FIELDS.map(field => field.id);
}