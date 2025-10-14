/**
 * Journal Selection Tests
 *
 * This file contains test cases for journal selection functionality,
 * particularly testing ISSN-based filtering and formatting.
 */

import {
  buildScholarUrl,
  formatJournalSelection,
  GlobalFilters,
  SearchBlock,
} from "../../lib/qtm";
import { describe, it, expect } from "@jest/globals";

describe("Journal Selection Tests", () => {
  it("should format a single ISSN correctly", () => {
    const issns = ["1234-5678"];
    const formatted = formatJournalSelection(issns);

    expect(formatted).toBe("1234-5678");
    expect(formatted).not.toContain("OR"); // No OR operator for a single ISSN
    expect(formatted).not.toContain("("); // No parentheses for a single ISSN
  });

  it("should format multiple ISSNs with OR operators and parentheses", () => {
    const issns = ["1234-5678", "8765-4321", "2468-1357"];
    const formatted = formatJournalSelection(issns);

    expect(formatted).toBe("(1234-5678 OR 8765-4321 OR 2468-1357)");
  });

  it("should handle empty ISSN array", () => {
    const issns: string[] = [];
    const formatted = formatJournalSelection(issns);

    expect(formatted).toBe("");
  });

  it("should properly handle ISSNs and special characters", () => {
    const issns = ["1234-5678", "ISSN: 8765-4321", " 2468-1357 "];
    const formatted = formatJournalSelection(issns);

    expect(formatted).toContain("1234-5678");
    expect(formatted).toContain("ISSN: 8765-4321");
    expect(formatted).toContain("2468-1357");
  });

  it("should append journal selection to the query correctly", () => {
    // Set up search blocks
    const blocks: SearchBlock[] = [
      {
        fieldId: "all_fields",
        term: "machine learning",
        isExact: false,
        operator: { type: "NONE" as const },
      },
    ];

    // Set up global filters with journal selection
    const globalFilters: GlobalFilters = {
      excludeCitations: false,
      includeCitations: true,
      selectedJournalISSNs: ["1234-5678", "8765-4321"],
    };

    // Build the URL with journal filters
    const result = buildScholarUrl(blocks, globalFilters);

    // Verify results
    expect(result.success).toBe(true);
    expect(result.rawQuery).toContain("machine learning");
    expect(result.rawQuery).toContain("(1234-5678 OR 8765-4321)");
    expect(result.messages.some((msg) => msg.includes("journal filter"))).toBe(
      true
    );
  });

  it("should combine search blocks and journal selection properly", () => {
    // Set up search blocks with relationship
    const blocks: SearchBlock[] = [
      {
        fieldId: "article_title",
        term: "artificial intelligence",
        isExact: true,
        operator: { type: "AND_NEXT" as const },
      },
      {
        fieldId: "author",
        term: "Hinton",
        isExact: false,
        operator: { type: "NONE" as const },
      },
    ];

    // Set up global filters with journal selection
    const globalFilters: GlobalFilters = {
      excludeCitations: false,
      includeCitations: true,
      selectedJournalISSNs: ["1234-5678"],
    };

    // Build the URL with journal filters
    const result = buildScholarUrl(blocks, globalFilters);

    // Verify results
    expect(result.success).toBe(true);
    expect(result.rawQuery).toContain(
      '(intitle:"artificial intelligence" AND author:Hinton)'
    );
    expect(result.rawQuery).toContain("1234-5678");
  });
});
