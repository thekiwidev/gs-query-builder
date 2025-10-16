/**
 * Search Module Type Definitions
 * Defines all types for search blocks, validation, and query building
 */

export type OperatorType = "AND" | "OR" | "EXCLUDE";
export type OperatorDirection = "previous" | "next";

/**
 * Represents a single search block
 */
export interface SearchBlock {
  id: string;
  fieldId: string;
  term: string;
  isExact?: boolean;
  operator?: OperatorType;
  operatorDirection?: OperatorDirection;
}

/**
 * Search field definition for dropdown
 */
export interface SearchField {
  id: string;
  label: string;
  gsOperator?: string | null;
  mustQuote?: boolean;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Search block for validation (alias for SearchBlock)
 */
export type SearchBlockForValidation = SearchBlock;

/**
 * Query builder state
 */
export interface QueryBuilderState {
  blocks: SearchBlock[];
  selectedFields: string[];
  selectedJournals: string[];
  yearFrom?: number;
  yearTo?: number;
}
