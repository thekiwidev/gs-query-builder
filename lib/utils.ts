import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { JournalRecord } from "../types/journal";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats journal ISSNs for use in Google Scholar queries
 *
 * @param journals Array of journal records
 * @returns Formatted string of ISSNs for use in a query
 */
export function formatJournalISSNsForQuery(journals: JournalRecord[]): string {
  if (!journals || journals.length === 0) {
    return "";
  }

  // Extract and quote all ISSNs
  const issnQueries = journals.map((journal) => `"${journal.issn}"`);

  // If only one journal, return it directly
  if (issnQueries.length === 1) {
    return issnQueries[0];
  }

  // Otherwise, group with OR operators inside parentheses
  return `(${issnQueries.join(" OR ")})`;
}

/**
 * Groups search terms by boolean relationship with proper parentheses
 *
 * @param terms Array of search terms to be grouped
 * @param operator The boolean operator to use ("AND" or "OR")
 * @returns Grouped terms with proper parenthetical notation
 */
export function groupTermsWithParentheses(
  terms: string[],
  operator: "AND" | "OR"
): string {
  if (!terms || terms.length === 0) {
    return "";
  }

  if (terms.length === 1) {
    return terms[0];
  }

  return `(${terms.join(` ${operator} `)})`;
}

/**
 * Helper function to convert legacy booleanOperator to the new operator format
 * This aids in backward compatibility during the transition period
 *
 * @param booleanOperator Legacy boolean operator ("AND", "OR", "NOT")
 * @returns New operator object with appropriate type
 */
export function convertLegacyOperator(booleanOperator: "AND" | "OR" | "NOT"): {
  type: "AND_NEXT" | "OR_NEXT" | "EXCLUDE" | "NONE";
} {
  switch (booleanOperator) {
    case "AND":
      return { type: "AND_NEXT" };
    case "OR":
      return { type: "OR_NEXT" };
    case "NOT":
      return { type: "EXCLUDE" };
    default:
      return { type: "NONE" };
  }
}

export const googleFormFeedbackLink: string =
  "https://docs.google.com/forms/d/e/1FAIpQLScFIe4gBmthQ3KAgboWnyUdUEQ62O2ijEnfxSkCZX5XOz1M1w/viewform?usp=preview";
