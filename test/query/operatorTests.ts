/**
 * Operator Relationship Tests
 *
 * This file contains test cases for different operator combinations in the
 * Google Scholar Query Builder. It tests the proper generation of parenthetical
 * grouping and boolean operator relationships.
 */

import { SearchBlock, buildScholarUrl } from "../../lib/qtm";
import { describe, it, expect } from "@jest/globals";

describe("Boolean Operator Relationship Tests", () => {
  // Test helper to check if the raw query includes expected patterns
  function expectQueryToInclude(blocks: SearchBlock[], patterns: string[]) {
    const result = buildScholarUrl(blocks);
    expect(result.success).toBe(true);

    // For each pattern, check that it appears in the raw query
    patterns.forEach((pattern) => {
      expect(result.rawQuery).toContain(pattern);
    });

    return result; // Return for additional assertions if needed
  }

  it("should handle a single search block correctly", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "all_fields",
        term: "machine learning",
        operator: { type: "NONE" },
      },
    ];

    const result = buildScholarUrl(blocks);
    expect(result.success).toBe(true);
    expect(result.rawQuery).toBe("machine learning");
  });

  it("should handle exclusion (NOT) operator correctly", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "all_fields",
        term: "machine learning",
        operator: { type: "EXCLUDE" },
      },
    ];

    const result = buildScholarUrl(blocks);
    expect(result.success).toBe(true);
    expect(result.rawQuery).toBe("-machine learning");
  });

  it("should group AND_NEXT relationship with parentheses", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "all_fields",
        term: "artificial intelligence",
        operator: { type: "AND_NEXT" },
      },
      {
        fieldId: "all_fields",
        term: "deep learning",
        operator: { type: "NONE" },
      },
    ];

    expectQueryToInclude(blocks, [
      "(artificial intelligence AND deep learning)",
    ]);
  });

  it("should group OR_NEXT relationship with parentheses", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "all_fields",
        term: "chatbot",
        operator: { type: "OR_NEXT" },
      },
      {
        fieldId: "all_fields",
        term: "conversational agent",
        operator: { type: "NONE" },
      },
    ];

    expectQueryToInclude(blocks, ["(chatbot OR conversational agent)"]);
  });

  it("should handle complex relationships with three blocks", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "all_fields",
        term: "artificial intelligence",
        operator: { type: "AND_NEXT" },
      },
      {
        fieldId: "all_fields",
        term: "deep learning",
        operator: { type: "OR_NEXT" },
      },
      {
        fieldId: "all_fields",
        term: "neural networks",
        operator: { type: "NONE" },
      },
    ];

    const result = expectQueryToInclude(blocks, [
      "(artificial intelligence AND deep learning)",
      "(deep learning OR neural networks)",
    ]);

    // Check that these patterns are ordered correctly
    const aiAndDlIndex = result.rawQuery.indexOf(
      "(artificial intelligence AND deep learning)"
    );
    const dlOrNnIndex = result.rawQuery.indexOf(
      "(deep learning OR neural networks)"
    );
    expect(aiAndDlIndex).toBeLessThan(dlOrNnIndex);
  });

  it("should handle backward references with AND_PREV", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "all_fields",
        term: "machine learning",
        operator: { type: "NONE" },
      },
      {
        fieldId: "all_fields",
        term: "classification",
        operator: { type: "AND_PREV" },
      },
    ];

    expectQueryToInclude(blocks, ["(machine learning AND classification)"]);
  });

  it("should handle backward references with OR_PREV", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "all_fields",
        term: "deep learning",
        operator: { type: "NONE" },
      },
      {
        fieldId: "all_fields",
        term: "neural networks",
        operator: { type: "OR_PREV" },
      },
    ];

    expectQueryToInclude(blocks, ["(deep learning OR neural networks)"]);
  });

  it("should handle mixed relationships correctly", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "article_title",
        term: "artificial intelligence",
        operator: { type: "AND_NEXT" },
      },
      {
        fieldId: "all_fields",
        term: "ethics",
        operator: { type: "OR_NEXT" },
      },
      {
        fieldId: "all_fields",
        term: "regulation",
        operator: { type: "EXCLUDE" },
      },
    ];

    const result = expectQueryToInclude(blocks, [
      '(intitle:"artificial intelligence" AND ethics)',
      "(ethics OR -regulation)",
    ]);

    // The excluded term should be properly formatted
    expect(result.rawQuery).toContain("-regulation");
  });

  it("should handle multiple consecutive relationship pairs", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "all_fields",
        term: "term1",
        operator: { type: "AND_NEXT" },
      },
      {
        fieldId: "all_fields",
        term: "term2",
        operator: { type: "AND_NEXT" },
      },
      {
        fieldId: "all_fields",
        term: "term3",
        operator: { type: "OR_NEXT" },
      },
      {
        fieldId: "all_fields",
        term: "term4",
        operator: { type: "NONE" },
      },
    ];

    expectQueryToInclude(blocks, [
      "(term1 AND term2)",
      "(term2 AND term3)",
      "(term3 OR term4)",
    ]);
  });

  it("should handle field-specific operators correctly", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "article_title",
        term: "deep learning",
        operator: { type: "AND_NEXT" },
      },
      {
        fieldId: "author",
        term: "Hinton",
        operator: { type: "NONE" },
      },
    ];

    expectQueryToInclude(blocks, [
      '(intitle:"deep learning" AND author:Hinton)',
    ]);
  });

  it("should handle exclusion with field-specific operators", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "article_title",
        term: "artificial intelligence",
        operator: { type: "NONE" },
      },
      {
        fieldId: "article_title",
        term: "survey",
        operator: { type: "EXCLUDE" },
      },
    ];

    expectQueryToInclude(blocks, [
      'intitle:"artificial intelligence"',
      "-intitle:survey",
    ]);
  });

  it("should handle legacy booleanOperator property correctly", () => {
    const blocks: SearchBlock[] = [
      {
        fieldId: "all_fields",
        term: "machine learning",
        booleanOperator: "AND",
      },
      {
        fieldId: "all_fields",
        term: "neural networks",
        booleanOperator: "OR",
      },
      {
        fieldId: "all_fields",
        term: "survey",
        booleanOperator: "NOT",
      },
    ];

    const result = buildScholarUrl(blocks);
    expect(result.success).toBe(true);
    expect(result.rawQuery).toContain("machine learning");
    expect(result.rawQuery).toContain("neural networks");
    expect(result.rawQuery).toContain("-survey");
  });
});
