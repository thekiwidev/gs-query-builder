/**
 * Advanced Query Validation System
 *
 * Provides real-time validation for Google Scholar query syntax,
 * including Boolean operators, parentheses grouping, and malformed syntax detection.
 */

import { SearchBlock } from "./qtm";
import { getSearchFieldById } from "../data/SearchWithin";

export interface ValidationError {
  /** Type of validation error */
  type:
    | "syntax"
    | "operator"
    | "field"
    | "parentheses"
    | "proximity"
    | "warning";
  /** Error message */
  message: string;
  /** Suggested correction */
  suggestion?: string;
  /** Field ID where error occurred (if applicable) */
  fieldId?: string;
  /** Position in query where error occurred */
  position?: number;
}

export interface QueryValidationResult {
  /** Whether the query is valid */
  isValid: boolean;
  /** List of validation errors and warnings */
  errors: ValidationError[];
  /** Corrected version of the query */
  correctedQuery?: string;
  /** Human-readable explanation of what the query does */
  explanation: string;
}

/**
 * Validate a complete query built from search blocks
 */
export function validateCompleteQuery(
  blocks: SearchBlock[],
  rawQuery: string
): QueryValidationResult {
  const result: QueryValidationResult = {
    isValid: true,
    errors: [],
    explanation: "",
  };

  // Validate individual blocks first
  blocks.forEach((block, index) => {
    const blockErrors = validateSearchBlock(block);
    result.errors.push(
      ...blockErrors.map((error) => ({
        ...error,
        fieldId: block.fieldId,
        position: index,
      }))
    );
  });

  // Validate raw query syntax
  const syntaxErrors = validateQuerySyntax(rawQuery);
  result.errors.push(...syntaxErrors);

  // Check for common issues
  const commonIssues = checkCommonIssues(rawQuery, blocks);
  result.errors.push(...commonIssues);

  // Generate corrected query if there are fixable errors
  if (result.errors.some((e) => e.suggestion)) {
    result.correctedQuery = generateCorrectedQuery(rawQuery, result.errors);
  }

  // Generate human-readable explanation
  result.explanation = generateQueryExplanation(blocks);

  // Set overall validity
  result.isValid =
    result.errors.filter((e) => e.type !== "warning").length === 0;

  return result;
}

/**
 * Validate individual search block
 */
export function validateSearchBlock(block: SearchBlock): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check if field exists
  const fieldDef = getSearchFieldById(block.fieldId);
  if (!fieldDef) {
    errors.push({
      type: "field",
      message: `Unknown field ID: ${block.fieldId}`,
      suggestion: "Please select a valid search field",
    });
    return errors;
  }

  // Check if term is provided
  if (!block.term?.trim()) {
    errors.push({
      type: "field",
      message: "Search term is required",
      suggestion: "Enter a search term",
    });
    return errors;
  }

  const term = block.term.trim();

  // Validate based on field type
  switch (fieldDef.id) {
    case "around_operator":
      errors.push(...validateProximitySearch(term, block.proximityDistance));
      break;

    case "and_operator":
    case "or_operator":
      errors.push(...validateBooleanOperator(term, fieldDef.id));
      break;

    case "exact_phrase":
    case "wildcard_phrase":
      errors.push(...validatePhraseSearch(term));
      break;

    case "connected_terms":
      errors.push(...validateConnectedTerms(term));
      break;

    case "issn":
      errors.push(...validateISSN(term));
      break;

    case "doi":
      errors.push(...validateDOI(term));
      break;

    case "orcid":
      errors.push(...validateORCID(term));
      break;

    case "site_search":
      errors.push(...validateSiteSearch(term));
      break;

    case "filetype_search":
      errors.push(...validateFileType(term));
      break;

    default:
      // Standard field validation
      errors.push(...validateStandardField(term, fieldDef));
  }

  return errors;
}

/**
 * Validate proximity search (AROUND operator)
 */
function validateProximitySearch(
  term: string,
  distance?: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  const words = term.split(/\s+/).filter((w) => w.trim());

  if (words.length < 2) {
    errors.push({
      type: "proximity",
      message: "Proximity search requires at least 2 words",
      suggestion: "Enter at least two words for proximity search",
    });
  }

  if (distance && (distance < 1 || distance > 100)) {
    errors.push({
      type: "proximity",
      message: "Proximity distance should be between 1 and 100",
      suggestion: "Use a distance value between 1 and 100",
    });
  }

  return errors;
}

/**
 * Validate Boolean operators
 */
function validateBooleanOperator(
  term: string,
  operatorType: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (operatorType === "and_operator" && !term.includes("AND")) {
    errors.push({
      type: "operator",
      message: "AND operator must be in CAPITAL letters",
      suggestion: term.replace(/\band\b/gi, "AND"),
    });
  }

  if (operatorType === "or_operator" && !term.includes("OR")) {
    errors.push({
      type: "operator",
      message: "OR operator must be in CAPITAL letters",
      suggestion: term.replace(/\bor\b/gi, "OR"),
    });
  }

  return errors;
}

/**
 * Validate phrase searches
 */
function validatePhraseSearch(term: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (term.length < 2) {
    errors.push({
      type: "syntax",
      message: "Phrase search requires at least 2 characters",
      suggestion: "Enter a longer search phrase",
    });
  }

  // Check for unbalanced quotes
  const quoteCount = (term.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    errors.push({
      type: "syntax",
      message: "Unbalanced quotation marks in phrase",
      suggestion: "Ensure quotes are properly closed",
    });
  }

  return errors;
}

/**
 * Validate connected terms
 */
function validateConnectedTerms(term: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!term.includes("-")) {
    errors.push({
      type: "syntax",
      message: "Connected terms should use hyphens",
      suggestion: term.replace(/\s+/g, "-"),
    });
  }

  if (term.includes(" - ") || term.includes("- ") || term.includes(" -")) {
    errors.push({
      type: "syntax",
      message: "No spaces around hyphens in connected terms",
      suggestion: term.replace(/\s*-\s*/g, "-"),
    });
  }

  return errors;
}

/**
 * Validate ISSN format
 */
function validateISSN(term: string): ValidationError[] {
  const errors: ValidationError[] = [];

  const issnPattern = /^\d{4}-\d{3}[\dX]$/;
  if (!issnPattern.test(term)) {
    errors.push({
      type: "syntax",
      message: "Invalid ISSN format",
      suggestion: "Use format: 1234-567X",
    });
  }

  return errors;
}

/**
 * Validate DOI format
 */
function validateDOI(term: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!term.startsWith("10.")) {
    errors.push({
      type: "syntax",
      message: 'DOI should start with "10."',
      suggestion: `10.${term}`,
    });
  }

  return errors;
}

/**
 * Validate ORCID format
 */
function validateORCID(term: string): ValidationError[] {
  const errors: ValidationError[] = [];

  const orcidPattern = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
  if (!orcidPattern.test(term)) {
    errors.push({
      type: "syntax",
      message: "Invalid ORCID format",
      suggestion: "Use format: 0000-0000-0000-0000",
    });
  }

  return errors;
}

/**
 * Validate site search
 */
function validateSiteSearch(term: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (term.includes(" ")) {
    errors.push({
      type: "syntax",
      message: "Site search should not contain spaces",
      suggestion: term.replace(/\s+/g, ""),
    });
  }

  if (!term.includes(".") && !term.startsWith(".")) {
    errors.push({
      type: "syntax",
      message: "Site search should be a domain or TLD",
      suggestion: `${term}.com (or specify correct domain)`,
    });
  }

  return errors;
}

/**
 * Validate file type
 */
function validateFileType(term: string): ValidationError[] {
  const errors: ValidationError[] = [];

  const validTypes = [
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "txt",
    "rtf",
  ];
  if (!validTypes.includes(term.toLowerCase())) {
    errors.push({
      type: "warning",
      message: `"${term}" is not a common file type`,
      suggestion: `Try: ${validTypes.join(", ")}`,
    });
  }

  return errors;
}

/**
 * Validate standard field
 */
function validateStandardField(
  term: string,
  fieldDef: { mustQuote: boolean }
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (fieldDef.mustQuote && term.length > 50) {
    errors.push({
      type: "warning",
      message: "Very long search terms may not work well with exact matching",
      suggestion: "Consider using shorter, more specific terms",
    });
  }

  return errors;
}

/**
 * Validate overall query syntax
 */
function validateQuerySyntax(query: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for unbalanced parentheses
  const openParens = (query.match(/\(/g) || []).length;
  const closeParens = (query.match(/\)/g) || []).length;

  if (openParens !== closeParens) {
    errors.push({
      type: "parentheses",
      message: "Unbalanced parentheses in query",
      suggestion: "Ensure all parentheses are properly closed",
    });
  }

  // Check for malformed AROUND syntax
  const aroundMatches = query.match(/AROUND\s*\(\s*(\d+)\s*\)/g);
  if (query.includes("AROUND") && !aroundMatches) {
    errors.push({
      type: "operator",
      message: "Malformed AROUND operator",
      suggestion: "Use format: word1 AROUND (5) word2",
    });
  }

  // Check for double operators
  if (query.match(/(AND\s+AND|OR\s+OR)/)) {
    errors.push({
      type: "operator",
      message: "Duplicate Boolean operators detected",
      suggestion: "Remove duplicate AND/OR operators",
    });
  }

  return errors;
}

/**
 * Check for common query issues
 */
function checkCommonIssues(
  query: string,
  blocks: SearchBlock[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check query length
  if (query.length > 500) {
    errors.push({
      type: "warning",
      message: "Very long queries may not work reliably",
      suggestion: "Consider simplifying the query",
    });
  }

  // Check for too many blocks
  if (blocks.length > 10) {
    errors.push({
      type: "warning",
      message: "Many search blocks may result in overly complex queries",
      suggestion: "Consider combining related terms",
    });
  }

  // Check for conflicting exclusions
  const hasOnlyExclusions = blocks.every((b) => b.booleanOperator === "NOT");

  if (hasOnlyExclusions) {
    errors.push({
      type: "syntax",
      message: "Query contains only exclusions",
      suggestion: "Add at least one positive search term",
    });
  }

  return errors;
}

/**
 * Generate corrected query from error suggestions
 */
function generateCorrectedQuery(
  originalQuery: string,
  errors: ValidationError[]
): string {
  let corrected = originalQuery;

  // Apply suggestions in order of specificity
  errors.forEach((error) => {
    if (error.suggestion && error.type !== "warning") {
      // This is a simplified correction - in practice, you'd need more sophisticated logic
      if (error.type === "operator") {
        corrected = corrected
          .replace(/\band\b/gi, "AND")
          .replace(/\bor\b/gi, "OR");
      }
    }
  });

  return corrected;
}

/**
 * Generate human-readable explanation of query
 */
function generateQueryExplanation(blocks: SearchBlock[]): string {
  if (blocks.length === 0) {
    return "No search criteria specified";
  }

  const explanationParts: string[] = [];

  blocks.forEach((block, index) => {
    const fieldDef = getSearchFieldById(block.fieldId);
    if (!fieldDef) return;

    let part = "";

    if (block.booleanOperator === "NOT") {
      part += "Exclude ";
    } else if (index > 0) {
      part += block.booleanOperator === "OR" ? "OR find " : "AND find ";
    } else {
      part += "Find ";
    }

    switch (fieldDef.id) {
      case "around_operator":
        part += `documents where "${block.term}" appear within ${
          block.proximityDistance || 5
        } words`;
        break;
      case "exact_phrase":
      case "wildcard_phrase":
        part += `documents containing the exact phrase "${block.term}"`;
        break;
      default:
        part += `documents where ${fieldDef.label.toLowerCase()} contains "${
          block.term
        }"`;
    }

    explanationParts.push(part);
  });

  return explanationParts.join(", ");
}

/**
 * Get validation severity color for UI
 */
export function getValidationSeverityColor(
  type: ValidationError["type"]
): string {
  switch (type) {
    case "syntax":
    case "operator":
    case "field":
    case "parentheses":
      return "text-red-600";
    case "proximity":
      return "text-orange-600";
    case "warning":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
}
