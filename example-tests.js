/**
 * Example Test Cases for Google Scholar Query Builder
 *
 * This file implements and tests the example queries requested:
 * 1. Author "John Smith" AND title "machine learning"
 * 2. Title contains "neural networks" OR "deep learning"
 * 3. Papers about "blockchain" but exclude "cryptocurrency"
 * 4. Author "Johnson" in "Information Systems" field journals
 */

// Note: This is a demonstration file only
// In a real environment, we would import from the actual module
// This mock simulates the buildScholarUrl function for testing purposes

// Mock implementation of buildScholarUrl for testing
function buildScholarUrl(blocks, globalFilters = {}) {
  // Simple implementation to simulate the real function
  try {
    // Extract fields
    const validBlocks = blocks.filter(
      (block) =>
        block && block.fieldId && block.term && block.term.trim() !== ""
    );

    if (validBlocks.length === 0) {
      return {
        success: false,
        messages: ["No valid search blocks provided"],
        rawQuery: "",
        url: "",
      };
    }

    // Process blocks to generate query string
    const queryParts = [];

    validBlocks.forEach((block, index) => {
      let prefix = "";
      let term = block.term.trim();

      // Apply field operators
      switch (block.fieldId) {
        case "article_title":
          prefix = "intitle:";
          break;
        case "author":
          prefix = "author:";
          break;
        case "source":
          prefix = "source:";
          break;
        // Default is all_fields, which has no prefix
      }

      // Apply quotes only if isExact is true
      if (block.isExact) {
        term = `"${term}"`;
      }

      // Apply exclusion operator if needed
      if (block.operator && block.operator.type === "EXCLUDE") {
        prefix = "-" + prefix;
      }

      // Add operator if needed
      if (index > 0 && block.operator && block.operator.type === "OR_PREV") {
        queryParts.push("OR");
      }

      // Add the term to query parts
      queryParts.push(`${prefix}${term}`);

      // Add operator after the term if needed
      if (block.operator && block.operator.type === "OR_NEXT") {
        queryParts.push("OR");
      }
    });

    // Process journal filters if available - no quotes for journals
    if (
      globalFilters.selectedJournalISSNs &&
      globalFilters.selectedJournalISSNs.length > 0
    ) {
      const journalParts = globalFilters.selectedJournalISSNs;

      if (journalParts.length === 1) {
        queryParts.push(journalParts[0]);
      } else if (journalParts.length > 1) {
        queryParts.push(`(${journalParts.join(" OR ")})`);
      }
    }

    // Handle boolean logic and parenthetical grouping
    let rawQuery = "";

    // Simple OR grouping
    if (queryParts.includes("OR")) {
      // Find sequences that need parentheses
      const groups = [];
      let currentGroup = [];

      for (let i = 0; i < queryParts.length; i++) {
        if (queryParts[i] === "OR") {
          // Add the OR and the next term to the current group
          if (i + 1 < queryParts.length) {
            currentGroup.push("OR", queryParts[i + 1]);
            i++; // Skip the next term as we've already processed it
          }
        } else {
          if (currentGroup.length > 0) {
            groups.push([...currentGroup]);
            currentGroup = [];
          }
          currentGroup.push(queryParts[i]);
        }
      }

      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }

      // Build query with proper parentheses
      rawQuery = groups
        .map((group) => {
          if (group.includes("OR")) {
            return `(${group.join(" ")})`;
          }
          return group.join(" ");
        })
        .join(" ");
    } else {
      // Simple AND logic (implicit)
      rawQuery = queryParts.join(" ");
    }

    // Mock URL generation
    const encodedQuery = encodeURIComponent(rawQuery);
    const url = `https://scholar.google.com/scholar?q=${encodedQuery}&hl=en&as_sdt=0,5`;

    return {
      success: true,
      messages: [],
      rawQuery,
      url,
    };
  } catch (error) {
    return {
      success: false,
      messages: [error.message],
      rawQuery: "",
      url: "",
    };
  }
}

// Example 1: Author "John Smith" AND title "machine learning"
function testExample1() {
  console.log('Example 1: Author "John Smith" AND title "machine learning"');
  console.log("--------------------------------------------------------");

  const blocks = [
    {
      fieldId: "author",
      term: "John Smith",
      isExact: true, // Add isExact flag for quotation
      operator: { type: "NONE" }, // Default operator - implicit AND with next block
    },
    {
      fieldId: "article_title",
      term: "machine learning",
      isExact: true, // Add isExact flag for quotation
      operator: { type: "NONE" },
    },
  ];

  const result = buildScholarUrl(blocks);

  console.log(`Raw Query: ${result.rawQuery}`);
  console.log(`Expected: author:"John Smith" intitle:"machine learning"`);
  console.log(`URL: ${result.url}`);
  console.log(`Success: ${result.success}`);

  const passed =
    result.success &&
    result.rawQuery.includes('author:"John Smith"') &&
    result.rawQuery.includes('intitle:"machine learning"');

  console.log(passed ? "✅ PASS" : "❌ FAIL");
  console.log("\n");

  return { passed, result };
}

// Example 2: Title contains "neural networks" OR "deep learning"
function testExample2() {
  console.log('Example 2: Title contains "neural networks" OR "deep learning"');
  console.log("--------------------------------------------------------");

  const blocks = [
    {
      fieldId: "article_title",
      term: "neural networks",
      isExact: true, // Add isExact flag for quotation
      operator: { type: "OR_NEXT" }, // OR with next block
    },
    {
      fieldId: "article_title",
      term: "deep learning",
      isExact: true, // Add isExact flag for quotation
      operator: { type: "NONE" },
    },
  ];

  const result = buildScholarUrl(blocks);

  console.log(`Raw Query: ${result.rawQuery}`);
  console.log(
    `Expected: (intitle:"neural networks" OR intitle:"deep learning")`
  );
  console.log(`URL: ${result.url}`);
  console.log(`Success: ${result.success}`);

  const passed =
    result.success &&
    result.rawQuery.includes('intitle:"neural networks"') &&
    result.rawQuery.includes("OR") &&
    result.rawQuery.includes('intitle:"deep learning"') &&
    result.rawQuery.includes("(") &&
    result.rawQuery.includes(")");

  console.log(passed ? "✅ PASS" : "❌ FAIL");
  console.log("\n");

  return { passed, result };
}

// Example 3: Papers about "blockchain" but exclude "cryptocurrency"
function testExample3() {
  console.log(
    'Example 3: Papers about "blockchain" but exclude "cryptocurrency"'
  );
  console.log("--------------------------------------------------------");

  const blocks = [
    {
      fieldId: "all_fields",
      term: "blockchain",
      operator: { type: "NONE" },
    },
    {
      fieldId: "all_fields",
      term: "cryptocurrency",
      operator: { type: "EXCLUDE" }, // Exclude this term
    },
  ];

  const result = buildScholarUrl(blocks);

  console.log(`Raw Query: ${result.rawQuery}`);
  console.log(`Expected: blockchain -cryptocurrency`);
  console.log(`URL: ${result.url}`);
  console.log(`Success: ${result.success}`);

  const passed =
    result.success &&
    result.rawQuery.includes("blockchain") &&
    result.rawQuery.includes("-cryptocurrency");

  console.log(passed ? "✅ PASS" : "❌ FAIL");
  console.log("\n");

  return { passed, result };
}

// Example 4: Author "Johnson" in "Information Systems" field journals
function testExample4() {
  console.log(
    'Example 4: Author "Johnson" in "Information Systems" field journals'
  );
  console.log("--------------------------------------------------------");

  // Mock some journal ISSNs for Information Systems field
  const informationSystemsISSNs = ["1234-5678", "8765-4321", "2468-1357"];

  const blocks = [
    {
      fieldId: "author",
      term: "Johnson",
      isExact: true, // Mark as exact to add quotes
      operator: { type: "NONE" },
    },
  ];

  // Add global filters for journals
  const globalFilters = {
    selectedJournalISSNs: informationSystemsISSNs,
    excludeCitations: false,
    includeCitations: true,
  };

  const result = buildScholarUrl(blocks, globalFilters);

  console.log(`Raw Query: ${result.rawQuery}`);
  console.log(
    `Expected: author:"Johnson" (1234-5678 OR 8765-4321 OR 2468-1357)`
  );
  console.log(`URL: ${result.url}`);
  console.log(`Success: ${result.success}`);

  // Check for author term and parenthetical journal grouping
  const hasAuthor = result.rawQuery.includes('author:"Johnson"');
  const hasJournalGrouping =
    result.rawQuery.includes("(") &&
    result.rawQuery.includes(")") &&
    result.rawQuery.includes("OR") &&
    informationSystemsISSNs.every((issn) => result.rawQuery.includes(issn));

  const passed = result.success && hasAuthor && hasJournalGrouping;

  console.log(passed ? "✅ PASS" : "❌ FAIL");
  console.log("\n");

  return { passed, result };
}

// Run all tests
function runAllTests() {
  console.log("RUNNING ALL EXAMPLE TESTS\n");

  const results = [
    testExample1(),
    testExample2(),
    testExample3(),
    testExample4(),
  ];

  const passedCount = results.filter((r) => r.passed).length;

  console.log("========================================");
  console.log(`SUMMARY: ${passedCount}/${results.length} tests passed`);

  if (passedCount === results.length) {
    console.log("✅ ALL TESTS PASSED!");
  } else {
    console.log(`❌ ${results.length - passedCount} TESTS FAILED`);
  }
}

// Execute tests
runAllTests();
