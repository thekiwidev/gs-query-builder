/**
 * Journal CSV Loader and Processing Utilities
 *
 * Handles loading, parsing, and validation of the journals.csv file
 * with proper error handling and data transformation.
 */

import {
  JournalRecord,
  JournalValidationResult,
  JournalsByField,
  JournalRating,
  validateISSN,
  validateRating,
  getFieldOfStudyByCode,
  RATING_PRIORITY,
} from "../types/journal";

/**
 * Raw CSV row interface based on the actual CSV structure
 */
interface RawCSVRow {
  Title: string;
  Publisher: string;
  "Field of Research": string;
  Rating: string;
  ISSN: string;
  "ISSN Online"?: string;
  Website?: string;
}

/**
 * Load and parse journals from CSV data
 */
export async function loadJournalsFromCSV(
  csvFilePath: string = "/data/journals.csv"
): Promise<JournalValidationResult> {
  try {
    const response = await fetch(csvFilePath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV file: ${response.statusText}`);
    }

    const csvText = await response.text();
    return parseJournalCSV(csvText);
  } catch (error) {
    console.error("Error loading journals CSV:", error);
    throw error;
  }
}

/**
 * Parse CSV text into journal records with validation
 */
export function parseJournalCSV(csvText: string): JournalValidationResult {
  const result: JournalValidationResult = {
    validJournals: [],
    invalidJournals: [],
    summary: {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      fieldDistribution: {},
      ratingDistribution: { "A*": 0, A: 0, B: 0, C: 0 },
    },
  };

  // Simple CSV parsing (consider using a proper CSV library for production)
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) {
    throw new Error(
      "CSV file must contain at least a header row and one data row"
    );
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

  // Validate required headers
  const requiredHeaders = [
    "Title",
    "Publisher",
    "Field of Research",
    "Rating",
    "ISSN",
  ];
  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
  }

  // Process each data row
  for (let i = 1; i < lines.length; i++) {
    const rowNumber = i + 1;
    result.summary.totalRows++;

    try {
      const values = parseCSVRow(lines[i]);
      if (values.length !== headers.length) {
        result.invalidJournals.push({
          rowNumber,
          data: { raw: lines[i] },
          errors: [
            `Column count mismatch. Expected ${headers.length}, got ${values.length}`,
          ],
        });
        result.summary.invalidRows++;
        continue;
      }

      // Create row object
      const rowData: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index] || "";
      });

      const rawRow = rowData as unknown as RawCSVRow;
      const validationResult = validateJournalRow(rawRow);

      if (validationResult.isValid && validationResult.journal) {
        result.validJournals.push(validationResult.journal);
        result.summary.validRows++;

        // Update distribution counters
        const fieldCode = validationResult.journal.fieldCode;
        result.summary.fieldDistribution[fieldCode] =
          (result.summary.fieldDistribution[fieldCode] || 0) + 1;
        result.summary.ratingDistribution[validationResult.journal.rating]++;
      } else {
        result.invalidJournals.push({
          rowNumber,
          data: rowData,
          errors: validationResult.errors,
        });
        result.summary.invalidRows++;
      }
    } catch (error) {
      result.invalidJournals.push({
        rowNumber,
        data: { raw: lines[i] },
        errors: [
          `Parse error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        ],
      });
      result.summary.invalidRows++;
    }
  }

  return result;
}

/**
 * Parse a single CSV row, handling quoted values
 */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Validate a single journal row and convert to JournalRecord
 */
function validateJournalRow(row: RawCSVRow): {
  isValid: boolean;
  journal?: JournalRecord;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate required fields
  if (!row.Title?.trim()) {
    errors.push("Title is required");
  }

  if (!row.Publisher?.trim()) {
    errors.push("Publisher is required");
  }

  if (!row["Field of Research"]?.trim()) {
    errors.push("Field of Research is required");
  }

  // Validate ISSN
  const issnValidation = validateISSN(row.ISSN);
  if (!issnValidation.isValid) {
    errors.push(`ISSN validation failed: ${issnValidation.error}`);
  }

  // Validate rating
  const ratingValidation = validateRating(row.Rating);
  if (!ratingValidation.isValid) {
    errors.push(`Rating validation failed: ${ratingValidation.error}`);
  }

  // Validate field code exists in our mappings
  const fieldCode = row["Field of Research"].trim();
  const fieldOfStudy = getFieldOfStudyByCode(fieldCode);
  if (!fieldOfStudy) {
    errors.push(
      `Unknown field of research code: ${fieldCode}. Please add mapping for this field.`
    );
  }

  // If there are errors, return early
  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Create the journal record
  const journal: JournalRecord = {
    title: row.Title.trim(),
    publisher: row.Publisher.trim(),
    fieldCode: fieldCode,
    rating: ratingValidation.rating!,
    issn: issnValidation.formatted!,
    issnOnline: row["ISSN Online"]?.trim() || undefined,
    website: row.Website?.trim() || undefined,
  };

  return { isValid: true, journal, errors: [] };
}

/**
 * Group journals by field of study and rating
 */
export function groupJournalsByField(
  journals: JournalRecord[]
): JournalsByField[] {
  const fieldGroups = new Map<string, JournalRecord[]>();

  // Group journals by field code
  journals.forEach((journal) => {
    const fieldCode = journal.fieldCode;
    if (!fieldGroups.has(fieldCode)) {
      fieldGroups.set(fieldCode, []);
    }
    fieldGroups.get(fieldCode)!.push(journal);
  });

  // Convert to structured format with rating subgroups
  const result: JournalsByField[] = [];

  fieldGroups.forEach((journalList, fieldCode) => {
    const fieldOfStudy = getFieldOfStudyByCode(fieldCode);
    if (!fieldOfStudy) return; // Skip unknown fields

    // Group by rating
    const journalsByRating = {
      "A*": [] as JournalRecord[],
      A: [] as JournalRecord[],
      B: [] as JournalRecord[],
      C: [] as JournalRecord[],
    };

    journalList.forEach((journal) => {
      journalsByRating[journal.rating].push(journal);
    });

    // Sort journals within each rating by title
    Object.keys(journalsByRating).forEach((rating) => {
      journalsByRating[rating as JournalRating].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    });

    result.push({
      field: fieldOfStudy,
      journals: journalList.sort((a, b) => {
        // First sort by rating priority, then by title
        const ratingDiff =
          RATING_PRIORITY[a.rating] - RATING_PRIORITY[b.rating];
        if (ratingDiff !== 0) return ratingDiff;
        return a.title.localeCompare(b.title);
      }),
      journalsByRating,
    });
  });

  // Sort fields by name
  result.sort((a, b) => a.field.name.localeCompare(b.field.name));

  return result;
}

/**
 * Search journals by title, ISSN, or other criteria
 */
export function searchJournals(
  journals: JournalRecord[],
  query: string,
  filters: {
    fieldCodes?: string[];
    ratings?: JournalRating[];
  } = {}
): JournalRecord[] {
  const normalizedQuery = query.toLowerCase().trim();

  return journals.filter((journal) => {
    // Apply field filter
    if (filters.fieldCodes && filters.fieldCodes.length > 0) {
      if (!filters.fieldCodes.includes(journal.fieldCode)) {
        return false;
      }
    }

    // Apply rating filter
    if (filters.ratings && filters.ratings.length > 0) {
      if (!filters.ratings.includes(journal.rating)) {
        return false;
      }
    }

    // Apply text search
    if (normalizedQuery) {
      const searchableText = [
        journal.title,
        journal.publisher,
        journal.issn,
        journal.issnOnline || "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    }

    return true;
  });
}

/**
 * Get validation summary in human-readable format
 */
export function getValidationSummary(result: JournalValidationResult): string {
  const { summary } = result;
  const successRate = Math.round((summary.validRows / summary.totalRows) * 100);

  let report = `Journal CSV Validation Summary:\n`;
  report += `Total Rows: ${summary.totalRows}\n`;
  report += `Valid Journals: ${summary.validRows} (${successRate}%)\n`;
  report += `Invalid Journals: ${summary.invalidRows}\n\n`;

  if (summary.invalidRows > 0) {
    report += `Common Issues:\n`;
    const errorCounts = new Map<string, number>();

    result.invalidJournals.forEach((invalid) => {
      invalid.errors.forEach((error) => {
        errorCounts.set(error, (errorCounts.get(error) || 0) + 1);
      });
    });

    errorCounts.forEach((count, error) => {
      report += `- ${error}: ${count} occurrences\n`;
    });

    report += `\n`;
  }

  report += `Field Distribution:\n`;
  Object.entries(summary.fieldDistribution)
    .sort(([, a], [, b]) => b - a)
    .forEach(([field, count]) => {
      const fieldInfo = getFieldOfStudyByCode(field);
      const fieldName = fieldInfo ? fieldInfo.name : field;
      report += `- ${fieldName} (${field}): ${count} journals\n`;
    });

  report += `\nRating Distribution:\n`;
  Object.entries(summary.ratingDistribution).forEach(([rating, count]) => {
    report += `- ${rating}: ${count} journals\n`;
  });

  return report;
}
