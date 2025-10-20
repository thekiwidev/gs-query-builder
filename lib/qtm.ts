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
  /** Whether this term should be treated as an exact phrase (wrapped in quotes) */
  isExact?: boolean;
  /**
   * Operator for this block defining its relationship with other blocks
   * NONE: No special relationship
   * AND_NEXT: Connect with next block using AND
   * AND_PREV: Connect with previous block using AND
   * OR_NEXT: Connect with next block using OR
   * OR_PREV: Connect with previous block using OR
   * EXCLUDE: Apply NOT logic to this block
   */
  operator?: {
    type: "AND_NEXT" | "AND_PREV" | "OR_NEXT" | "OR_PREV" | "EXCLUDE" | "NONE";
  };
  /** Legacy boolean operator - will be deprecated */
  booleanOperator?: "AND" | "OR" | "NOT";
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
 * Groups search blocks based on their operator relationships with enhanced parenthetical grouping
 *
 * Core grouping logic:
 * - Blocks form an unbroken CHAIN if they are connected via operators
 * - A block connects FORWARD if it has AND_NEXT or OR_NEXT
 * - A block connects BACKWARD if it has AND_PREV or OR_PREV
 * - All chained blocks stay in the same parenthesis group
 * - The chain BREAKS only when a block has no forward operator AND the next block has no backward operator
 *
 * Example: Block1(AND_NEXT) Block2(OR_NEXT) Block3() Block4(AND_PREV)
 * - Block1 chains to Block2 via AND_NEXT
 * - Block2 chains forward to Block3 via OR_NEXT AND backward connects
 * - Block3 has no forward op BUT Block4 chains back via AND_PREV
 * - All 4 blocks stay in same group: (Block1 AND Block2 OR Block3 AND Block4)
 *
 * @param blocks Array of valid search blocks
 * @param synthesizedBlocks Array of synthesized block strings
 * @returns Properly formatted query string with parenthetical grouping
 */
function groupBlocksByOperator(
  blocks: SearchBlock[],
  synthesizedBlocks: string[]
): string {
  if (synthesizedBlocks.length === 0) {
    return "";
  }

  if (synthesizedBlocks.length === 1) {
    return synthesizedBlocks[0];
  }

  // Helper: Extract operator type from block
  const getOperatorType = (
    block: SearchBlock
  ): "AND_NEXT" | "AND_PREV" | "OR_NEXT" | "OR_PREV" | "EXCLUDE" | "NONE" => {
    if (block.operator && block.operator.type) {
      return block.operator.type;
    }
    if (block.booleanOperator === "OR") return "OR_NEXT";
    if (block.booleanOperator === "AND") return "AND_NEXT";
    if (block.booleanOperator === "NOT") return "EXCLUDE";
    return "NONE";
  };

  // Step 1: Identify all chains by finding connected groups
  const chains: number[][] = [];
  const processed = new Set<number>();

  for (let i = 0; i < blocks.length; i++) {
    if (processed.has(i)) continue;

    const chain: number[] = [];
    let current = i;

    // Find the start of this chain by going backwards
    while (current > 0) {
      const prevBlock = blocks[current - 1];
      const prevOp = getOperatorType(prevBlock);
      const currentOp = getOperatorType(blocks[current]);

      // Check if previous block chains forward to current block
      const prevChainsForward = prevOp === "AND_NEXT" || prevOp === "OR_NEXT";
      // Check if current block chains backward to previous block
      const currentChainsBackward =
        currentOp === "AND_PREV" || currentOp === "OR_PREV";

      // Chain continues backward if previous goes forward OR current comes back
      if (prevChainsForward || currentChainsBackward) {
        current--;
      } else {
        break;
      }
    }

    // Now current is the start of the chain, traverse forward
    const chainStart = current;
    chain.push(current);
    current = chainStart;

    while (current < blocks.length - 1) {
      const currentOp = getOperatorType(blocks[current]);
      const nextBlock = blocks[current + 1];
      const nextOp = getOperatorType(nextBlock);

      // Chain continues forward if current goes forward OR next comes back
      const currentChainsForward =
        currentOp === "AND_NEXT" || currentOp === "OR_NEXT";
      const nextChainsBackward = nextOp === "AND_PREV" || nextOp === "OR_PREV";

      if (currentChainsForward || nextChainsBackward) {
        chain.push(current + 1);
        current++;
      } else {
        break;
      }
    }

    // Mark all blocks in this chain as processed
    chain.forEach((idx) => processed.add(idx));
    chains.push(chain);
  }

  // Step 2: Build query from chains
  let resultQuery = "";

  for (const chain of chains) {
    if (chain.length === 0) continue;

    let chainQuery = "";

    // Build the query for this chain
    for (let i = 0; i < chain.length; i++) {
      const idx = chain[i];
      const block = blocks[idx];
      const synthesized = synthesizedBlocks[idx];
      const op = getOperatorType(block);

      if (i === 0) {
        // First block in chain
        chainQuery = synthesized;
      } else {
        // Subsequent blocks - use the previous block's NEXT operator or this block's PREV operator
        const prevBlock = blocks[chain[i - 1]];
        const prevOp = getOperatorType(prevBlock);

        if (prevOp === "AND_NEXT" || (prevOp === "NONE" && op === "AND_PREV")) {
          chainQuery += " AND " + synthesized;
        } else if (
          prevOp === "OR_NEXT" ||
          (prevOp === "NONE" && op === "OR_PREV")
        ) {
          chainQuery += " OR " + synthesized;
        } else {
          // Default to AND if unclear
          chainQuery += " AND " + synthesized;
        }
      }
    }

    // Wrap chain in parentheses if it has multiple blocks
    if (chain.length > 1) {
      chainQuery = `(${chainQuery})`;
    }

    // Add to result
    if (resultQuery) {
      resultQuery += " " + chainQuery;
    } else {
      resultQuery = chainQuery;
    }
  }

  return resultQuery;
}

/**
 * Main QTM function: Converts search blocks into a Google Scholar URL
 *
 * The heart of the Query Translation Module (QTM) that transforms structured search inputs
 * into a valid Google Scholar search URL. This function handles:
 * - Processing and validation of search blocks
 * - Parenthetical grouping for proper boolean logic
 * - Journal selection integration via ISSN
 * - Global filter application (years, citations, etc.)
 * - URL encoding and parameter formatting
 *
 * @param blocks Array of search blocks to process with field, term, and operator relationships
 * @param globalFilters Optional global filters (year range, citations, journals, etc.)
 * @returns QTMResult containing the final URL, success status, messages, and raw query
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

    // Group blocks by operator relationships with proper parentheses
    let mainQuery = groupBlocksByOperator(validBlocks, synthesizedBlocks);

    // Process journal selection if provided
    if (
      globalFilters?.selectedJournalISSNs &&
      globalFilters.selectedJournalISSNs.length > 0
    ) {
      // Use dedicated formatter for journal ISSNs
      const journalQuery = formatJournalSelection(
        globalFilters.selectedJournalISSNs
      );

      // Append journal query with implicit AND (space)
      mainQuery = mainQuery + " " + journalQuery;

      result.messages.push(
        `Added journal filter with ${globalFilters.selectedJournalISSNs.length} journals`
      );
    }

    if (!mainQuery) {
      result.messages.push("No valid search blocks could be processed");
      return result;
    }

    // Set raw query
    const rawQuery = mainQuery;
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
 *
 * @param block The search block to synthesize
 * @returns Properly formatted query string for this block
 */
function synthesizeSearchBlock(block: SearchBlock): string | null {
  const fieldDef = getSearchFieldById(block.fieldId);
  if (!fieldDef) {
    return null;
  }

  const term = sanitizeSearchTerm(block.term);
  if (!term) {
    return null;
  }

  // Determine if this is an exclusion (NOT) block
  // First check for the new operator, fall back to legacy booleanOperator if needed
  const isExclusion =
    (block.operator && block.operator.type === "EXCLUDE") ||
    block.booleanOperator === "NOT"; // For backwards compatibility

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
        return isExclusion ? `-${proximityQuery}` : proximityQuery;
      }
      // Fallback if not enough terms
      return isExclusion ? `-${term}` : term;

    case "exact_phrase":
    case "wildcard_phrase":
      // These field types always force exact phrase matching
      const quotedTerm = `"${term.replace(/"/g, "'")}"`;
      return isExclusion ? `-${quotedTerm}` : quotedTerm;

    case "doi":
      // Special handling for DOIs - respect isExact property
      const formattedDoi = term.replace(/^(doi:)?\s*/i, "").trim();
      const doiQuery = block.isExact ? `"${formattedDoi}"` : formattedDoi;
      return isExclusion ? `-${doiQuery}` : doiQuery;

    case "issn":
      // Special handling for ISSNs - never quote them per new requirements
      const formattedISSN = term.replace(/[^\dXx-]/g, "").trim();
      return isExclusion ? `-${formattedISSN}` : formattedISSN;

    default:
      // Handle standard field-specific searches
      return synthesizeStandardField(block, fieldDef, term, isExclusion);
  }
}

/**
 * Handle standard field-specific searches with enhanced processing
 *
 * This function applies the specific formatting rules for each search field:
 * 1. Determines if quotes are needed based on field settings and term content
 * 2. Applies Google Scholar field-specific operators like intitle:, author:, source:
 * 3. Handles exclusion logic with the NOT operator (-)
 *
 * @param block The search block being processed
 * @param fieldDef Field definition with settings like mustQuote and gsOperator
 * @param term The search term after basic sanitization
 * @param isExclusion Whether this block should use exclusion (NOT) logic
 * @param containsMultipleWords Whether the term contains multiple words
 * @returns Properly formatted query fragment for Google Scholar
 */

function synthesizeStandardField(
  block: SearchBlock,
  fieldDef: { mustQuote: boolean; gsOperator: string | null },
  term: string,
  isExclusion: boolean = false
): string {
  let processedTerm = term;

  // Step 1: Apply quoting based on the isExact property
  // Only apply quotes if the user has explicitly requested an exact match
  if (block.isExact) {
    // Don't add quotes if they're already present
    if (!processedTerm.startsWith('"') || !processedTerm.endsWith('"')) {
      // Replace existing quotes with single quotes to avoid syntax errors
      processedTerm = `"${processedTerm.replace(/"/g, "'")}"`;
    }
  }

  // Step 2: Apply Google Scholar operator if present
  if (fieldDef.gsOperator) {
    processedTerm = `${fieldDef.gsOperator}${processedTerm}`;
  }

  // Step 3: Apply NOT logic if specified
  if (isExclusion) {
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

  // Check if operator type is valid
  if (
    block.operator &&
    !["AND_NEXT", "AND_PREV", "OR_NEXT", "OR_PREV", "EXCLUDE", "NONE"].includes(
      block.operator.type
    )
  ) {
    errors.push(`Invalid operator type: ${block.operator.type}`);
  }

  return errors;
}

/**
 * Formats journal selection by ISSN for use in Google Scholar queries
 *
 * This specialized formatter creates a properly structured journal filter
 * using ISSNs instead of journal names. This provides much higher precision
 * than Google Scholar's native source: operator because:
 * 1. ISSNs are globally unique identifiers for journals
 * 2. Using exact match syntax with quotes prevents partial matches
 * 3. Proper OR logic grouping allows for multiple journal filtering
 *
 * @param issns Array of ISSNs to include in the query
 * @returns Properly formatted query string with OR logic and parenthetical grouping
 */

export function formatJournalSelection(issns: string[]): string {
  if (!issns || issns.length === 0) {
    return "";
  }

  // No quotation marks around ISSNs per new requirements
  const issnQueries = issns.map((issn) => issn.trim());

  // Single ISSN doesn't need parentheses
  if (issnQueries.length === 1) {
    return issnQueries[0];
  }

  // Multiple ISSNs need to be grouped with OR operators inside parentheses
  return `(${issnQueries.join(" OR ")})`;
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
