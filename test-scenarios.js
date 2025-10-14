/**
 * Manual Test Scenarios for Google Scholar Query Builder
 *
 * This file contains manual test scenarios for the query builder.
 * Run this file with `bun test-scenarios.js` to see the results.
 */

import { buildScholarUrl } from "./lib/qtm.js";

// Set up test scenarios
const testScenarios = [
  {
    name: "Basic Search",
    blocks: [
      {
        fieldId: "all_fields",
        term: "machine learning",
        operator: { type: "NONE" },
      },
    ],
    expectedContains: ["machine learning"],
  },
  {
    name: "Exclusion Operator",
    blocks: [
      {
        fieldId: "all_fields",
        term: "machine learning",
        operator: { type: "EXCLUDE" },
      },
    ],
    expectedContains: ["-machine learning"],
  },
  {
    name: "AND_NEXT Relationship",
    blocks: [
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
    ],
    expectedContains: ["(artificial intelligence AND deep learning)"],
  },
  {
    name: "OR_NEXT Relationship",
    blocks: [
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
    ],
    expectedContains: ["(chatbot OR conversational agent)"],
  },
  {
    name: "Complex Three Block Relationships",
    blocks: [
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
    ],
    expectedContains: [
      "(artificial intelligence AND deep learning)",
      "(deep learning OR neural networks)",
    ],
  },
  {
    name: "AND_PREV Relationship",
    blocks: [
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
    ],
    expectedContains: ["(machine learning AND classification)"],
  },
  {
    name: "OR_PREV Relationship",
    blocks: [
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
    ],
    expectedContains: ["(deep learning OR neural networks)"],
  },
  {
    name: "Mixed Relationships",
    blocks: [
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
    ],
    expectedContains: [
      "intitle:artificial intelligence",
      "AND ethics",
      "-regulation",
    ],
  },
  {
    name: "Journal Selection Single",
    blocks: [
      {
        fieldId: "all_fields",
        term: "machine learning",
        operator: { type: "NONE" },
      },
    ],
    globalFilters: {
      excludeCitations: false,
      includeCitations: true,
      selectedJournalISSNs: ["1234-5678"],
    },
    expectedContains: ["machine learning", "1234-5678"],
  },
  {
    name: "Journal Selection Multiple",
    blocks: [
      {
        fieldId: "all_fields",
        term: "machine learning",
        operator: { type: "NONE" },
      },
    ],
    globalFilters: {
      excludeCitations: false,
      includeCitations: true,
      selectedJournalISSNs: ["1234-5678", "8765-4321"],
    },
    expectedContains: ["machine learning", "(1234-5678 OR 8765-4321)"],
  },
  {
    name: "Complex Query with Journal Selection",
    blocks: [
      {
        fieldId: "article_title",
        term: "machine learning",
        operator: { type: "AND_NEXT" },
      },
      {
        fieldId: "author",
        term: "Hinton",
        operator: { type: "NONE" },
      },
    ],
    globalFilters: {
      excludeCitations: false,
      includeCitations: true,
      selectedJournalISSNs: ["1234-5678"],
      yearFrom: 2020,
      yearTo: 2025,
    },
    expectedContains: [
      "(intitle:machine learning AND author:Hinton)",
      "1234-5678",
    ],
    expectedQueryParams: ["as_ylo=2020", "as_yhi=2025"],
  },
];

// Run the tests
console.log("Running Google Scholar Query Builder Test Scenarios\n");

let passedTests = 0;
let failedTests = 0;

testScenarios.forEach((scenario, index) => {
  console.log(`\nTest ${index + 1}: ${scenario.name}`);
  console.log("-----------------------------------------------");

  try {
    // Build the query
    const result = buildScholarUrl(scenario.blocks, scenario.globalFilters);

    console.log(`Raw Query: ${result.rawQuery}`);
    console.log(`URL: ${result.url}`);

    // Check if the query contains the expected patterns
    let passed = true;

    // Check raw query patterns
    if (scenario.expectedContains) {
      scenario.expectedContains.forEach((pattern) => {
        if (!result.rawQuery.includes(pattern)) {
          console.log(
            `❌ FAIL: Raw query does not contain expected pattern: "${pattern}"`
          );
          passed = false;
        }
      });
    }

    // Check URL parameters
    if (scenario.expectedQueryParams) {
      scenario.expectedQueryParams.forEach((param) => {
        if (!result.url.includes(param)) {
          console.log(
            `❌ FAIL: URL does not contain expected parameter: "${param}"`
          );
          passed = false;
        }
      });
    }

    if (passed) {
      console.log("✅ PASS: All expectations met");
      passedTests++;
    } else {
      failedTests++;
    }
  } catch (error) {
    console.log(`❌ FAIL: Error executing test: ${error.message}`);
    failedTests++;
  }
});

// Summary
console.log("\n-----------------------------------------------");
console.log(`Test Summary: ${passedTests} passed, ${failedTests} failed`);
console.log(`Total: ${testScenarios.length} tests`);

if (failedTests === 0) {
  console.log("\n✅ All tests passed!");
} else {
  console.log(`\n❌ ${failedTests} test(s) failed.`);
}
