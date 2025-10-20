/**
 * Boolean Operators for Google Scholar Queries
 *
 * Handles Boolean logic (AND, OR, NOT) separately from field searches.
 * These are query-level operators, not field selectors.
 */

export type BooleanOperator = "AND" | "OR" | "NOT";

export interface BooleanOperation {
  /** Type of boolean operation */
  operator: BooleanOperator;
  /** Description of what this operator does */
  description: string;
  /** Example usage */
  example: string;
  /** Syntax rules */
  rules: string[];
}

export const BOOLEAN_OPERATORS: Record<BooleanOperator, BooleanOperation> = {
  AND: {
    operator: "AND",
    description: "All terms must appear in results (default behavior)",
    example: "machine AND learning",
    rules: [
      "Must be in CAPITAL letters",
      "Space is implied AND - usually not needed explicitly",
      "Use when you need all terms to appear",
    ],
  },
  OR: {
    operator: "OR",
    description: "Any of the terms can appear in results",
    example: '(AI OR "artificial intelligence")',
    rules: [
      "Must be in CAPITAL letters",
      "Use parentheses for grouping when combining with other terms",
      "Useful for synonyms or alternative terms",
    ],
  },
  NOT: {
    operator: "NOT",
    description: "Does not include terms from results",
    example: "machine learning -review",
    rules: [
      "Use hyphen (-) directly before term, no space",
      'Can be combined with field operators: -intitle:"systematic review"',
      "Use to filter out unwanted content types",
    ],
  },
};

/**
 * Validate Boolean operator syntax
 */
export function validateBooleanSyntax(query: string): {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
} {
  const errors: string[] = [];
  const suggestions: string[] = [];

  // Check for lowercase AND/OR
  if (query.match(/\band\b/g)) {
    errors.push("Boolean AND must be in CAPITAL letters");
    suggestions.push(query.replace(/\band\b/g, "AND"));
  }

  if (query.match(/\bor\b/g)) {
    errors.push("Boolean OR must be in CAPITAL letters");
    suggestions.push(query.replace(/\bor\b/g, "OR"));
  }

  // Check for spaces around NOT operator (hyphen)
  if (query.match(/\s-\s/)) {
    errors.push("NOT operator (hyphen) should not have spaces around it");
    suggestions.push(query.replace(/\s-\s/g, " -"));
  }

  // Check for unbalanced parentheses
  const openParens = (query.match(/\(/g) || []).length;
  const closeParens = (query.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(
      "Unbalanced parentheses - ensure all parentheses are properly closed"
    );
  }

  // Check for complex OR without parentheses
  if (
    query.includes("OR") &&
    !query.includes("(") &&
    query.split(" ").length > 3
  ) {
    suggestions.push(
      "Consider using parentheses to group OR terms: (term1 OR term2) AND term3"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
  };
}

/**
 * Build proper Boolean query syntax
 */
export function buildBooleanQuery(
  terms: string[],
  operator: BooleanOperator
): string {
  if (terms.length === 0) return "";
  if (terms.length === 1) return terms[0];

  switch (operator) {
    case "AND":
      // AND is implicit with spaces, but can be explicit
      return terms.join(" AND ");

    case "OR":
      // OR requires parentheses when used with other terms
      return `(${terms.join(" OR ")})`;

    case "NOT":
      // NOT uses hyphen prefix
      return terms.map((term) => `-${term}`).join(" ");

    default:
      return terms.join(" ");
  }
}

/**
 * Fix common Boolean syntax errors in a query
 */
export function fixBooleanSyntax(query: string): string {
  let fixed = query;

  // Fix lowercase boolean operators
  fixed = fixed.replace(/\band\b/gi, "AND");
  fixed = fixed.replace(/\bor\b/gi, "OR");

  // Fix spaces around NOT operator
  fixed = fixed.replace(/\s+-\s+/g, " -");
  fixed = fixed.replace(/^-\s+/g, "-");

  // Remove duplicate spaces
  fixed = fixed.replace(/\s+/g, " ").trim();

  return fixed;
}
