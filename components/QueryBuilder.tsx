/**
 * Google Scholar Query Builder
 *
 * Main component that manages multiple search blocks and handles the query generation.
 */

"use client";

import React, { useState } from "react";
import {
  SearchBlock,
  buildScholarUrl,
  QTMResult,
  GlobalFilters,
} from "../lib/qtm";
import { SearchBlockComponent } from "./SearchBlockComponent";

import { SimplifiedJournalSelector } from "./SimplifiedJournalSelector";
import { QueryPreview } from "./QueryPreview";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Plus,
  Search,
  RotateCcw,
  ExternalLink,
  BookOpen,
  Info,
  CheckCircle,
  XCircle,
  Calendar,
  Filter,
} from "lucide-react";

export function QueryBuilder() {
  const [searchBlocks, setSearchBlocks] = useState<SearchBlock[]>([
    {
      fieldId: "all_fields",
      term: "",
      isExact: false, // Default to not exact
      booleanOperator: "AND", // Legacy support
      operator: {
        type: "NONE",
      },
    },
  ]);

  const [globalFilters, setGlobalFilters] = useState<GlobalFilters>({
    excludeCitations: false,
    includeCitations: true,
  });

  const [selectedFieldCode, setSelectedFieldCode] = useState<string>();
  const [selectedJournalISSNs, setSelectedJournalISSNs] = useState<string[]>(
    []
  );

  const [lastResult, setLastResult] = useState<QTMResult | null>(null);

  const addSearchBlock = () => {
    const newBlocks = [...searchBlocks];

    // If the last block has a relationship with the "next" block (which didn't exist yet),
    // we need to update that relationship now that we're adding a new block
    if (newBlocks.length > 0) {
      const lastBlock = newBlocks[newBlocks.length - 1];
      if (
        lastBlock.operator?.type === "AND_NEXT" ||
        lastBlock.operator?.type === "OR_NEXT"
      ) {
        // The new block should have the corresponding backward relationship
        setSearchBlocks([
          ...newBlocks,
          {
            fieldId: "all_fields",
            term: "",
            isExact: false, // Default to not exact
            booleanOperator: lastBlock.operator.type.startsWith("AND")
              ? "AND"
              : "OR", // Legacy support
            operator: {
              type:
                lastBlock.operator.type === "AND_NEXT" ? "AND_PREV" : "OR_PREV",
            },
          },
        ]);
        return;
      }
    }

    // Default case, just add a new block with no special relationship
    setSearchBlocks([
      ...searchBlocks,
      {
        fieldId: "all_fields",
        term: "",
        isExact: false, // Default to not exact
        booleanOperator: "AND", // Legacy support
        operator: {
          type: "NONE",
        },
      },
    ]);
  };

  const updateSearchBlock = (index: number, updatedBlock: SearchBlock) => {
    const newBlocks = [...searchBlocks];
    newBlocks[index] = updatedBlock;

    // Ensure consistent operator state for special cases

    // If the current block has a relationship with the next block,
    // update the next block's relationship to be consistent if needed
    if (
      updatedBlock.operator?.type === "AND_NEXT" ||
      updatedBlock.operator?.type === "OR_NEXT"
    ) {
      if (index < newBlocks.length - 1) {
        const nextBlock = newBlocks[index + 1];
        // Check if next block has a relationship pointing backwards to a different block
        if (
          nextBlock.operator?.type === "AND_PREV" ||
          nextBlock.operator?.type === "OR_PREV"
        ) {
          // Update next block to ensure relationship is consistent
          newBlocks[index + 1] = {
            ...nextBlock,
            operator: {
              type:
                updatedBlock.operator.type === "AND_NEXT"
                  ? "AND_PREV"
                  : "OR_PREV",
            },
            // Update legacy support as well
            booleanOperator: updatedBlock.operator.type.startsWith("AND")
              ? "AND"
              : "OR",
          };
        }
      }
    }

    // If the current block has a relationship with the previous block,
    // update the previous block's relationship to be consistent if needed
    if (
      updatedBlock.operator?.type === "AND_PREV" ||
      updatedBlock.operator?.type === "OR_PREV"
    ) {
      if (index > 0) {
        const prevBlock = newBlocks[index - 1];
        // Check if prev block has a relationship pointing forward to a different block
        if (
          prevBlock.operator?.type === "AND_NEXT" ||
          prevBlock.operator?.type === "OR_NEXT"
        ) {
          // Update prev block to ensure relationship is consistent
          newBlocks[index - 1] = {
            ...prevBlock,
            operator: {
              type:
                updatedBlock.operator.type === "AND_PREV"
                  ? "AND_NEXT"
                  : "OR_NEXT",
            },
            // Update legacy support as well
            booleanOperator: updatedBlock.operator.type.startsWith("AND")
              ? "AND"
              : "OR",
          };
        }
      }
    }

    setSearchBlocks(newBlocks);
  };

  const removeSearchBlock = (index: number) => {
    if (searchBlocks.length > 1) {
      const blockToRemove = searchBlocks[index];

      // Create a copy of blocks without the removed one
      const newBlocks = searchBlocks.filter((_, i) => i !== index);

      // Handle special cases for operator relationships

      // Case 1: Block being removed has a relationship with the next block
      if (
        blockToRemove.operator?.type === "AND_NEXT" ||
        blockToRemove.operator?.type === "OR_NEXT"
      ) {
        if (index + 1 < searchBlocks.length) {
          // Update the next block to remove its backward relationship
          const nextBlockIndex =
            index < newBlocks.length ? index : newBlocks.length - 1;
          if (nextBlockIndex >= 0) {
            newBlocks[nextBlockIndex] = {
              ...newBlocks[nextBlockIndex],
              operator: { type: "NONE" },
            };
          }
        }
      }

      // Case 2: Block being removed has a relationship with the previous block
      else if (
        blockToRemove.operator?.type === "AND_PREV" ||
        blockToRemove.operator?.type === "OR_PREV"
      ) {
        if (index > 0) {
          // Update the previous block to remove its forward relationship
          const prevBlockIndex = index - 1;
          if (prevBlockIndex >= 0) {
            newBlocks[prevBlockIndex] = {
              ...newBlocks[prevBlockIndex],
              operator: { type: "NONE" },
            };
          }
        }
      }

      // Case 3: Block after the removed one had a relationship with it
      if (index + 1 < searchBlocks.length) {
        const nextBlock = searchBlocks[index + 1];
        if (
          nextBlock.operator?.type === "AND_PREV" ||
          nextBlock.operator?.type === "OR_PREV"
        ) {
          // This block would be left pointing to the wrong block, so reset its operator
          const nextBlockIndex =
            index < newBlocks.length ? index : newBlocks.length - 1;
          if (nextBlockIndex >= 0) {
            newBlocks[nextBlockIndex] = {
              ...newBlocks[nextBlockIndex],
              operator: { type: "NONE" },
            };
          }
        }
      }

      // Case 4: Block before the removed one had a relationship with it
      if (index > 0) {
        const prevBlock = searchBlocks[index - 1];
        if (
          prevBlock.operator?.type === "AND_NEXT" ||
          prevBlock.operator?.type === "OR_NEXT"
        ) {
          // This block would be left pointing to the wrong block, so reset its operator
          const prevBlockIndex = index - 1;
          if (prevBlockIndex >= 0 && prevBlockIndex < newBlocks.length) {
            newBlocks[prevBlockIndex] = {
              ...newBlocks[prevBlockIndex],
              operator: { type: "NONE" },
            };
          }
        }
      }

      setSearchBlocks(newBlocks);
    }
  };

  const handleSearch = () => {
    // Create enhanced filters with selectedJournalISSNs for the search
    const enhancedFilters = {
      ...globalFilters,
      selectedJournalISSNs,
      selectedFieldCode,
    };

    const result = buildScholarUrl(searchBlocks, enhancedFilters);
    setLastResult(result);

    if (result.success) {
      // Perform the redirect to Google Scholar
      window.open(result.url, "_blank");
    }
  };

  const resetForm = () => {
    // Reset to a single block with the new operator structure
    setSearchBlocks([
      {
        fieldId: "all_fields",
        term: "",
        booleanOperator: "AND", // Legacy support
        operator: {
          type: "NONE",
        },
      },
    ]);

    // Reset global filters
    setGlobalFilters({
      excludeCitations: false,
      includeCitations: true,
    });

    // Clear any journal selections
    setSelectedJournalISSNs([]);
    setSelectedFieldCode(undefined);

    // Clear any previous search results
    setLastResult(null);
  };

  // Check if we have any valid search terms
  const hasValidTerms = searchBlocks.some(
    (block) => block.fieldId && block.term && block.term.trim().length > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Google Scholar Query Builder
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create advanced searches using Scopus-style field restrictions, then
            redirect to Google Scholar.
          </p>
        </div>

        {/* Global Information Note */}
        <div className="mb-6 p-4 bg-gray-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 mb-2">
                <strong>Field Notes:</strong>
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>
                  •{" "}
                  <strong>
                    All Fields, Abstract, Keywords, Affiliation, ISSN, DOI,
                    ORCID:
                  </strong>{" "}
                  Use exact phrase matching in full-text search (no dedicated
                  indexed fields)
                </li>
                <li>
                  • <strong>Article Title:</strong> Uses Google Scholar&apos;s{" "}
                  <code>intitle:</code> operator for title-specific search
                </li>
                <li>
                  • <strong>Author:</strong> Uses <code>author:</code> operator
                  for author name search
                </li>
                <li>
                  • <strong>Source Title:</strong> Uses <code>source:</code>{" "}
                  operator for journal/conference search
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Global Filters */}
        <div className="mb-6 p-4 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Global Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Year Range */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 cursor-pointer hover:text-foreground/80 transition-colors">
                <Calendar className="h-4 w-4" />
                From Year
              </Label>
              <Input
                type="number"
                placeholder="e.g., 2020"
                value={globalFilters.yearFrom || ""}
                onChange={(e) =>
                  setGlobalFilters({
                    ...globalFilters,
                    yearFrom: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                min="1900"
                max={new Date().getFullYear()}
                className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 cursor-pointer hover:text-foreground/80 transition-colors">
                <Calendar className="h-4 w-4" />
                To Year
              </Label>
              <Input
                type="number"
                placeholder="e.g., 2024"
                value={globalFilters.yearTo || ""}
                onChange={(e) =>
                  setGlobalFilters({
                    ...globalFilters,
                    yearTo: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                min="1900"
                max={new Date().getFullYear()}
                className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-citations"
                checked={globalFilters.includeCitations}
                onCheckedChange={(checked) =>
                  setGlobalFilters({
                    ...globalFilters,
                    includeCitations: checked as boolean,
                    excludeCitations: checked
                      ? false
                      : globalFilters.excludeCitations,
                  })
                }
              />
              <Label
                htmlFor="include-citations"
                className="text-sm cursor-pointer hover:text-foreground/80 transition-colors"
              >
                Include citations
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="exclude-citations"
                checked={globalFilters.excludeCitations}
                onCheckedChange={(checked) =>
                  setGlobalFilters({
                    ...globalFilters,
                    excludeCitations: checked as boolean,
                    includeCitations: checked
                      ? false
                      : globalFilters.includeCitations,
                  })
                }
              />
              <Label
                htmlFor="exclude-citations"
                className="text-sm cursor-pointer hover:text-foreground/80 transition-colors"
              >
                Exclude citations
              </Label>
            </div>
          </div>

          {/* Journal Selection */}
          <div className="mt-6">
            <SimplifiedJournalSelector
              selectedFieldCode={selectedFieldCode}
              selectedJournalISSNs={selectedJournalISSNs}
              onFieldChange={setSelectedFieldCode}
              onJournalsChange={setSelectedJournalISSNs}
            />
          </div>
        </div>

        {/* Search Blocks */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Search Terms
          </h3>
          {searchBlocks.map((block, index) => (
            <SearchBlockComponent
              key={index}
              block={block}
              onChange={(updatedBlock) =>
                updateSearchBlock(index, updatedBlock)
              }
              onRemove={() => removeSearchBlock(index)}
              isOnlyBlock={searchBlocks.length === 1}
              index={index}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <Button
            onClick={addSearchBlock}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Search Block
          </Button>

          <Button
            onClick={handleSearch}
            disabled={!hasValidTerms}
            size="lg"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search Google Scholar
            <ExternalLink className="h-4 w-4" />
          </Button>

          <Button
            onClick={resetForm}
            variant="secondary"
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Results/Messages */}
        {lastResult && (
          <div
            className={`rounded-lg p-6 mb-8 border ${
              lastResult.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {lastResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <h3
                className={`font-semibold ${
                  lastResult.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {lastResult.success
                  ? "Query Generated Successfully"
                  : "Query Generation Failed"}
              </h3>
            </div>

            {lastResult.messages.map((message, index) => (
              <p
                key={index}
                className={`text-sm mb-2 ${
                  lastResult.success ? "text-green-700" : "text-red-700"
                }`}
              >
                {message}
              </p>
            ))}

            {lastResult.success && (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Generated Query:
                  </p>
                  <pre className="block p-3 bg-green-100 text-green-800 text-sm rounded border break-all font-mono whitespace-pre-wrap">
                    {lastResult.rawQuery}
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Full URL:
                  </p>
                  <pre className="block p-3 bg-green-100 text-green-800 text-xs rounded border break-all font-mono whitespace-pre-wrap">
                    {lastResult.url}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Query Preview */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Query Preview
          </h3>
          <QueryPreview
            searchBlocks={searchBlocks}
            journalBlocks={[]}
            globalFilters={{
              ...globalFilters,
              selectedFieldCode,
              selectedJournalISSNs,
            }}
            onExecuteSearch={handleSearch}
          />
        </div>

        {/* Help/Instructions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">How it works:</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Choose a search field from the dropdown (e.g., &quot;Article
              Title&quot;, &quot;Author&quot;)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Select journals by field of study and rating (A*, A only for
              precision)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Use enhanced operators to create relationships between blocks:
              <ul className="ml-4 mt-1">
                <li className="text-xs">
                  - AND next/previous: Groups terms with parentheses (term1 AND
                  term2)
                </li>
                <li className="text-xs">
                  - OR next/previous: Creates alternatives (term1 OR term2)
                </li>
                <li className="text-xs">
                  - Exclude: Applies NOT logic to exclude results
                </li>
              </ul>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Preview shows real-time validation and query explanation
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Click &quot;Execute Search&quot; in the preview to search Google
              Scholar
            </li>
          </ul>
          <div className="p-3 bg-muted rounded border-l-4 border-primary">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Key Improvements:</strong>
              <ul className="mt-1 space-y-1">
                <li>
                  • Enhanced operator system for precise control of boolean
                  logic and parenthetical grouping
                </li>
                <li>
                  • Journal filtering by ISSN provides much higher precision
                  than Google Scholar&apos;s basic source: operator
                </li>
                <li>
                  • Explicit relationship controls between search blocks for
                  complex queries
                </li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
