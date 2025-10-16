/**
 * Journal Data Types and Interfaces
 *
 * Defines the structure for journal data, field mappings, and validation rules
 * based on the provided journals.csv structure.
 */

export interface JournalRecord {
  /** Journal title/name */
  title: string;
  /** Publisher name */
  publisher: string;
  /** Field of research code (numeric) */
  fieldCode: string;
  /** Journal rating: A*, A, B, or C */
  rating: JournalRating;
  /** Print ISSN */
  issn: string;
  /** Online ISSN */
  issnOnline?: string;
  /** Journal website URL */
  website?: string;
}

export type JournalRating = "A*" | "A" | "B" | "C";

export interface FieldOfStudy {
  /** Field code (e.g., "3507") */
  code: string;
  /** Human-readable field name */
  name: string;
  /** Description of the field */
  description?: string;
}

export interface JournalsByField {
  field: FieldOfStudy;
  journals: JournalRecord[];
  journalsByRating: {
    "A*": JournalRecord[];
    A: JournalRecord[];
    B: JournalRecord[];
    C: JournalRecord[];
  };
}

export interface JournalSelectionBlock {
  /** Unique ID for this selection block */
  id: string;
  /** Selected field of study */
  fieldOfStudy: FieldOfStudy;
  /** Selected journal ISSNs */
  selectedISSNs: string[];
  /** Selected ratings filter */
  ratingFilter: JournalRating[];
  /** Logic operator with next block (AND/OR) */
  logicOperator: "AND" | "OR";
}

/**
 * Field of Study mappings based on common research classification codes
 * This maps the numeric codes found in the CSV to human-readable names
 */
export const FIELD_OF_STUDY_MAPPINGS: Record<string, FieldOfStudy> = {
  // Commerce, Management, Tourism and Services (3500 series)
  "3501": {
    code: "3501",
    name: "Accounting, auditing and accountability",
    description:
      "Financial accounting, auditing, and corporate accountability research",
  },
  "3502": {
    code: "3502",
    name: "Banking, finance and investment",
    description: "Banking, financial markets, and investment research",
  },
  "3503": {
    code: "3503",
    name: "Business systems in context",
    description: "Business systems and contextual management",
  },
  "3504": {
    code: "3504",
    name: "Commercial services",
    description: "Commercial and professional services research",
  },
  "3505": {
    code: "3505",
    name: "Human resources and industrial relations",
    description: "HR management and labor relations",
  },
  "3506": {
    code: "3506",
    name: "Marketing",
    description: "Marketing research and consumer behavior",
  },
  "3507": {
    code: "3507",
    name: "Strategy, management and organisational behaviour",
    description:
      "Strategic management, organizational behavior, and business strategy",
  },
  "3508": {
    code: "3508",
    name: "Tourism",
    description: "Tourism and hospitality management",
  },
  "3509": {
    code: "3509",
    name: "Transportation, logistics and supply chains",
    description: "Supply chain and logistics research",
  },
  "3599": {
    code: "3599",
    name: "Other commerce, management, tourism and services",
    description: "Other business and management research",
  },

  // Economics (3800 series)
  "3801": {
    code: "3801",
    name: "Applied economics",
    description: "Applied economic analysis and policy research",
  },
  "3802": {
    code: "3802",
    name: "Econometrics",
    description: "Econometric analysis and quantitative economics",
  },
  "3803": {
    code: "3803",
    name: "Economic theory",
    description: "Theoretical economics and economic modeling",
  },
  "3899": {
    code: "3899",
    name: "Other economics",
    description: "Economic research not elsewhere classified",
  },

  // Information Systems
  "4609": {
    code: "4609",
    name: "Information systems",
    description: "Information systems and technology management",
  },

  // Law
  "4801": {
    code: "4801",
    name: "Commercial law",
    description: "Commercial and business law",
  },

  // Statistics
  "4905": {
    code: "4905",
    name: "Statistics",
    description: "Statistical analysis and methodology",
  },
};

/**
 * Journal rating priority for sorting
 */
export const RATING_PRIORITY: Record<JournalRating, number> = {
  "A*": 1,
  A: 2,
  B: 3,
  C: 4,
};

/**
 * ISSN validation regex patterns
 */
export const ISSN_PATTERNS = {
  /** Standard ISSN format: XXXX-XXXX */
  STANDARD: /^\d{4}-\d{3}[\dX]$/,
  /** Flexible ISSN format allowing various separators */
  FLEXIBLE: /^(\d{4})[-\s]?(\d{3}[\dXx])$/,
};

/**
 * Validation result for CSV parsing
 */
export interface JournalValidationResult {
  /** Successfully parsed journals */
  validJournals: JournalRecord[];
  /** Journals with issues */
  invalidJournals: Array<{
    rowNumber: number;
    data: Record<string, unknown>;
    errors: string[];
  }>;
  /** Summary statistics */
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    fieldDistribution: Record<string, number>;
    ratingDistribution: Record<JournalRating, number>;
  };
}

/**
 * Helper function to validate ISSN format
 */
export function validateISSN(issn: string): {
  isValid: boolean;
  formatted?: string;
  error?: string;
} {
  if (!issn || typeof issn !== "string") {
    return { isValid: false, error: "ISSN is required" };
  }

  const trimmed = issn.trim();

  // Check standard format first
  if (ISSN_PATTERNS.STANDARD.test(trimmed)) {
    return { isValid: true, formatted: trimmed };
  }

  // Try flexible format and reformat
  const flexibleMatch = trimmed.match(ISSN_PATTERNS.FLEXIBLE);
  if (flexibleMatch) {
    const formatted = `${flexibleMatch[1]}-${flexibleMatch[2].toUpperCase()}`;
    return { isValid: true, formatted };
  }

  return {
    isValid: false,
    error: `Invalid ISSN format. Expected XXXX-XXXX, got: ${trimmed}`,
  };
}

/**
 * Helper function to validate journal rating
 */
export function validateRating(rating: string): {
  isValid: boolean;
  rating?: JournalRating;
  error?: string;
} {
  if (!rating || typeof rating !== "string") {
    return { isValid: false, error: "Rating is required" };
  }

  const normalizedRating = rating.trim().toUpperCase() as JournalRating;

  // Accept all valid ratings: A*, A, B, C
  if (["A*", "A", "B", "C"].includes(normalizedRating)) {
    return { isValid: true, rating: normalizedRating };
  }

  return {
    isValid: false,
    error: `Invalid rating. Expected A*, A, B, or C, got: ${rating}`,
  };
}

/**
 * Helper function to get field of study by code
 */
export function getFieldOfStudyByCode(code: string): FieldOfStudy | null {
  return FIELD_OF_STUDY_MAPPINGS[code] || null;
}

/**
 * Helper function to get all available fields of study
 */
export function getAllFieldsOfStudy(): FieldOfStudy[] {
  return Object.values(FIELD_OF_STUDY_MAPPINGS);
}
