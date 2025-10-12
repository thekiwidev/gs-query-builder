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
      booleanOperator: "AND",
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
    setSearchBlocks([
      ...searchBlocks,
      {
        fieldId: "all_fields",
        term: "",
        booleanOperator: "AND",
      },
    ]);
  };

  const updateSearchBlock = (index: number, updatedBlock: SearchBlock) => {
    const newBlocks = [...searchBlocks];
    newBlocks[index] = updatedBlock;
    setSearchBlocks(newBlocks);
  };

  const removeSearchBlock = (index: number) => {
    if (searchBlocks.length > 1) {
      const newBlocks = searchBlocks.filter((_, i) => i !== index);
      setSearchBlocks(newBlocks);
    }
  };

  const handleSearch = () => {
    const result = buildScholarUrl(searchBlocks, globalFilters);
    setLastResult(result);

    if (result.success) {
      // Perform the redirect to Google Scholar
      window.open(result.url, "_blank");
    }
  };

  const resetForm = () => {
    setSearchBlocks([
      {
        fieldId: "all_fields",
        term: "",
        booleanOperator: "AND",
      },
    ]);
    setGlobalFilters({
      excludeCitations: false,
      includeCitations: true,
    });
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
        <div className="mb-6 p-4 bg-gray-50 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                <strong>Field Notes:</strong>
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
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
                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
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
                  lastResult.success
                    ? "text-green-800 dark:text-green-300"
                    : "text-red-800 dark:text-red-300"
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
                  lastResult.success
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                {message}
              </p>
            ))}

            {lastResult.success && (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                    Generated Query:
                  </p>
                  <code className="block p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded border break-all font-mono">
                    {lastResult.rawQuery}
                  </code>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                    Full URL:
                  </p>
                  <code className="block p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded border break-all font-mono">
                    {lastResult.url}
                  </code>
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
              Use Boolean operators: space for AND, OR for alternatives, hyphen
              (-) to exclude
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
              <strong className="text-foreground">Key Improvement:</strong>{" "}
              Journal filtering by ISSN provides much higher precision than
              Google Scholar&apos;s basic source: operator, making this tool
              more powerful than the basic interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
