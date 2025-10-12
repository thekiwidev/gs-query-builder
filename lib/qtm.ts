/**
 * Query Translation Module (QTM) - Simplified Version
 *
 * The core logic responsible for translating structured search inputs
 * into a single, valid, URL-encoded Google Scholar query string.
 */

import { getSearchFieldById } from "../data/SearchWithin";
import { buildBaseUrl, MAX_URL_LENGTH } from "../config/GSConfig";

export interface SearchBlock {
  /** The ID of the selected search field */
  fieldId: string;
  /** The user's search term */
  term: string;
  /** Boolean operator for this block: 'AND', 'OR', or 'NOT' */
  booleanOperator: "AND" | "OR" | "NOT";
  /** For proximity search (AROUND operator) - distance between terms */
  proximityDistance?: number;
}

export interface GlobalFilters {
  /** Year range - from year */
  yearFrom?: number;
  /** Year range - to year */
  yearTo?: number;
  /** Exclude citations */
  excludeCitations: boolean;
  /** Include citations */
  includeCitations: boolean;
  /** Selected field of study code */
  selectedFieldCode?: string;
  /** Selected journal ISSNs from the field */
  selectedJournalISSNs?: string[];
  /** Language preference */
  language?: string;
  /** Document type filtering (0,5 for articles, 4 for case law, etc.) */
  documentType?: string;
}

export interface QTMResult {
  /** The complete Google Scholar URL */
  url: string;
  /** Whether the URL was successfully generated */
  success: boolean;
  /** Any validation errors or warnings */
  messages: string[];
  /** The raw query string before encoding */
  rawQuery: string;
}

/**
 * Main QTM function: Converts search blocks into a Google Scholar URL
 *
 * @param blocks Array of search blocks to process
 * @param globalFilters Optional global filters (year range, citations, journals, etc.)
 * @returns QTMResult containing the final URL and metadata
 */
export function buildScholarUrl(
  blocks: SearchBlock[],
  globalFilters?: GlobalFilters
): QTMResult {
  const result: QTMResult = {
    url: "",
    success: false,
    messages: [],
    rawQuery: "",
  };

  // Validate input
  if (!blocks || blocks.length === 0) {
    result.messages.push("No search blocks provided");
    return result;
  }

  // Filter out empty blocks
  const validBlocks = blocks.filter(
    (block) => block.term && block.term.trim().length > 0 && block.fieldId
  );

  if (validBlocks.length === 0) {
    result.messages.push("No valid search terms provided");
    return result;
  }

  try {
    // Process each search block
    const synthesizedBlocks: string[] = [];

    for (const block of validBlocks) {
      const synthesizedBlock = synthesizeSearchBlock(block);
      if (synthesizedBlock) {
        synthesizedBlocks.push(synthesizedBlock);
      } else {
        result.messages.push(
          `Failed to process block with field ID: ${block.fieldId}`
        );
      }
    }

    // Process journal selection if provided
    if (
      globalFilters?.selectedJournalISSNs &&
      globalFilters.selectedJournalISSNs.length > 0
    ) {
      // Create ISSN-based OR query
      const issnQueries = globalFilters.selectedJournalISSNs.map(
        (issn) => `"${issn}"`
      );
      const journalQuery =
        issnQueries.length === 1
          ? issnQueries[0]
          : `(${issnQueries.join(" OR ")})`;

      synthesizedBlocks.push(journalQuery);
      result.messages.push(
        `Added journal filter with ${globalFilters.selectedJournalISSNs.length} journals`
      );
    }

    if (synthesizedBlocks.length === 0) {
      result.messages.push("No valid search blocks could be processed");
      return result;
    }

    // Build the query with proper boolean operators
    let rawQuery = "";
    for (let i = 0; i < synthesizedBlocks.length; i++) {
      if (i === 0) {
        rawQuery = synthesizedBlocks[i];
      } else {
        // Use current block's operator for connecting to previous block
        const currentBlock = validBlocks[i];
        const operator = currentBlock.booleanOperator === "OR" ? " OR " : " ";
        rawQuery += operator + synthesizedBlocks[i];
      }
    }

    result.rawQuery = rawQuery;

    // URL encode the query string
    const encodedQuery = encodeURIComponent(rawQuery);

    // Build the complete URL with global filters
    const baseUrl = buildBaseUrl();
    let finalUrl = `${baseUrl}&q=${encodedQuery}`;

    // Add global filters if provided
    if (globalFilters) {
      // Year range filters
      if (globalFilters.yearFrom && globalFilters.yearTo) {
        finalUrl += `&as_ylo=${globalFilters.yearFrom}&as_yhi=${globalFilters.yearTo}`;
      } else if (globalFilters.yearFrom) {
        finalUrl += `&as_ylo=${globalFilters.yearFrom}`;
      } else if (globalFilters.yearTo) {
        finalUrl += `&as_yhi=${globalFilters.yearTo}`;
      }

      // Citation filters
      if (globalFilters.excludeCitations) {
        finalUrl += `&as_vis=1`;
      } else if (globalFilters.includeCitations) {
        finalUrl += `&as_vis=0`;
      }

      // Language filter (default to English if not specified)
      const language = globalFilters.language || "en";
      finalUrl += `&hl=${language}`;

      // Document type filter (default to academic articles)
      const documentType = globalFilters.documentType || "0,5";
      finalUrl += `&as_sdt=${documentType}`;
    } else {
      // Default filters when no globalFilters provided
      finalUrl += "&hl=en&as_sdt=0,5";
    }

    // Validate URL length
    if (finalUrl.length > MAX_URL_LENGTH) {
      result.messages.push(
        `Warning: Generated URL length (${finalUrl.length}) exceeds recommended limit (${MAX_URL_LENGTH})`
      );
    }

    result.url = finalUrl;
    result.success = true;

    if (result.messages.length === 0) {
      result.messages.push(
        `Successfully generated query with ${synthesizedBlocks.length} search blocks`
      );
    }
  } catch (error) {
    result.messages.push(
      `Error building URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  return result;
}

/**
 * Synthesizes a single search block into Google Scholar syntax
 */
function synthesizeSearchBlock(block: SearchBlock): string | null {
  const fieldDef = getSearchFieldById(block.fieldId);
  if (!fieldDef) {
    return null;
  }

  const term = block.term.trim();
  if (!term) {
    return null;
  }

  // Handle special field types
  switch (fieldDef.id) {
    case "around_operator":
      // Handle proximity search with distance
      const terms = term.split(" ").filter((t) => t.trim());
      if (terms.length >= 2) {
        const distance = block.proximityDistance || 5;
        const proximityQuery = `${terms[0]} AROUND (${distance}) ${terms
          .slice(1)
          .join(" ")}`;
        return block.booleanOperator === "NOT"
          ? `-${proximityQuery}`
          : proximityQuery;
      }
      // Fallback if not enough terms
      return block.booleanOperator === "NOT" ? `-${term}` : term;

    case "exact_phrase":
    case "wildcard_phrase":
      // Force exact phrase matching with quotes
      const quotedTerm = `"${term.replace(/"/g, "'")}"`;
      return block.booleanOperator === "NOT" ? `-${quotedTerm}` : quotedTerm;

    default:
      // Handle standard field-specific searches
      return synthesizeStandardField(block, fieldDef, term);
  }
}

/**
 * Handle standard field-specific searches
 */
function synthesizeStandardField(
  block: SearchBlock,
  fieldDef: { mustQuote: boolean; gsOperator: string | null },
  term: string
): string {
  let processedTerm = term;

  // Step 1: Apply quoting if required by the field definition
  if (fieldDef.mustQuote) {
    if (!processedTerm.startsWith('"') || !processedTerm.endsWith('"')) {
      processedTerm = `"${processedTerm.replace(/"/g, "'")}"`;
    }
  }

  // Step 2: Apply Google Scholar operator if present
  if (fieldDef.gsOperator) {
    processedTerm = `${fieldDef.gsOperator}${processedTerm}`;
  }

  // Step 3: Apply NOT logic if specified
  if (block.booleanOperator === "NOT") {
    processedTerm = `-${processedTerm}`;
  }

  return processedTerm;
}

/**
 * Validates a search block
 */
export function validateSearchBlock(block: SearchBlock): string[] {
  const errors: string[] = [];

  if (!block.fieldId) {
    errors.push("Field selection is required");
  } else {
    const fieldDef = getSearchFieldById(block.fieldId);
    if (!fieldDef) {
      errors.push(`Invalid field ID: ${block.fieldId}`);
    }
  }

  if (!block.term || block.term.trim().length === 0) {
    errors.push("Search term is required");
  }

  return errors;
}

/**
 * Sanitizes user input to prevent injection and handle special characters
 */
export function sanitizeSearchTerm(term: string): string {
  if (!term) return "";

  return (
    term
      .trim()
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, "")
      // Limit length to prevent extremely long queries
      .substring(0, 500)
  );
}
