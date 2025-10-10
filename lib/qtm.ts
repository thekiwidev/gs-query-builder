/**
 * Query Translation Module (QTM)
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
  /** Whether this block should be excluded (NOT logic) */
  exclude: boolean;
  /** Whether this block uses OR logic with the next block */
  useOr: boolean;
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
 * @param globalFilters Optional global filters (year range, citations, etc.)
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

    if (synthesizedBlocks.length === 0) {
      result.messages.push("No valid search blocks could be processed");
      return result;
    }

    // Handle OR logic between blocks and concatenate
    let rawQuery = "";
    for (let i = 0; i < synthesizedBlocks.length; i++) {
      if (i > 0) {
        // Check if previous block has OR logic
        const prevBlock = validBlocks[i - 1];
        rawQuery += prevBlock.useOr ? " OR " : " ";
      }
      rawQuery += synthesizedBlocks[i];
    }
    result.rawQuery = rawQuery;

    // URL encode the query string
    const encodedQuery = encodeURIComponent(rawQuery);

    // Build the complete URL with global filters
    const baseUrl = buildBaseUrl();
    let finalUrl = `${baseUrl}&q=${encodedQuery}`;

    // Add global filters if provided
    if (globalFilters) {
      if (globalFilters.yearFrom && globalFilters.yearTo) {
        finalUrl += `&as_ylo=${globalFilters.yearFrom}&as_yhi=${globalFilters.yearTo}`;
      } else if (globalFilters.yearFrom) {
        finalUrl += `&as_ylo=${globalFilters.yearFrom}`;
      } else if (globalFilters.yearTo) {
        finalUrl += `&as_yhi=${globalFilters.yearTo}`;
      }

      if (globalFilters.excludeCitations) {
        finalUrl += `&as_vis=1`;
      }

      if (globalFilters.includeCitations) {
        finalUrl += `&as_vis=0`;
      }
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
 *
 * @param block The search block to process
 * @returns The synthesized search string, or null if processing fails
 */
function synthesizeSearchBlock(block: SearchBlock): string | null {
  // Get the field definition
  const fieldDef = getSearchFieldById(block.fieldId);
  if (!fieldDef) {
    return null;
  }

  let term = block.term.trim();
  if (!term) {
    return null;
  }

  // Step 1: Apply quoting if required by the field definition
  if (fieldDef.mustQuote) {
    // Ensure the term is wrapped in double quotes
    if (!term.startsWith('"') || !term.endsWith('"')) {
      term = `"${term.replace(/"/g, "'")}"`; // Replace internal quotes with single quotes
    }
  }

  // Step 2: Apply Google Scholar operator if present
  if (fieldDef.gsOperator) {
    term = `${fieldDef.gsOperator}${term}`;
  }

  // Step 3: Apply exclusion (NOT logic) if specified
  if (block.exclude) {
    term = `-${term}`;
  }

  return term;
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

  // Basic sanitization - remove or escape problematic characters
  return (
    term
      .trim()
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, "")
      // Limit length to prevent extremely long queries
      .substring(0, 500)
  );
}
