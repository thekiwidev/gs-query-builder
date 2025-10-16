/**
 * Query Preview Component
 *
 * Shows the final encoded query string, human-readable explanation,
 * and step-by-step query construction breakdown with validation.
 */

"use client";

import React, { useMemo } from "react";
import { SearchBlock, GlobalFilters, buildScholarUrl } from "../lib/qtm";
import { JournalSelectionBlock } from "../types/journal";
import {
  validateCompleteQuery,
  getValidationSeverityColor,
} from "../lib/queryValidator";
import { getSearchFieldById } from "../data/SearchWithin";
import { Button } from "./ui/button";
import {
  Eye,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Code,
  MessageSquare,
  Layers,
  Link,
  ArrowRight,
  BookOpen,
  Filter,
} from "lucide-react";

interface QueryPreviewProps {
  /** Search blocks to preview */
  searchBlocks: SearchBlock[];
  /** Journal selection blocks */
  journalBlocks?: JournalSelectionBlock[];
  /** Global filters */
  globalFilters?: GlobalFilters;
  /** Whether to show detailed breakdown */
  showDetails?: boolean;
  /** Callback when user wants to execute search */
  onExecuteSearch?: () => void;
}

export function QueryPreview({
  searchBlocks,
  journalBlocks = [],
  globalFilters,
  showDetails = true,
  onExecuteSearch,
}: QueryPreviewProps) {
  // Build the complete query
  const queryResult = useMemo(() => {
    // Extract selected journal ISSNs from journal blocks
    const selectedJournalISSNs = journalBlocks.flatMap(
      (block) => block.selectedISSNs
    );

    const enhancedFilters: GlobalFilters = {
      excludeCitations: false,
      includeCitations: true,
      ...globalFilters,
      ...(selectedJournalISSNs.length > 0 && { selectedJournalISSNs }),
    };
    return buildScholarUrl(searchBlocks, enhancedFilters);
  }, [searchBlocks, journalBlocks, globalFilters]);

  // Validate the query
  const validation = useMemo(() => {
    if (!queryResult.success) {
      return {
        isValid: false,
        errors: [{ type: "syntax" as const, message: "Failed to build query" }],
        explanation: "Query could not be constructed",
      };
    }
    return validateCompleteQuery(searchBlocks, queryResult.rawQuery);
  }, [searchBlocks, queryResult]);

  // Copy query to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Get query breakdown
  const queryBreakdown = useMemo(() => {
    const parts: Array<{
      type: "search" | "journal" | "filter";
      label: string;
      query: string;
      description: string;
    }> = [];

    // Add search block parts with operator relationship descriptions
    searchBlocks.forEach((block, index) => {
      const fieldDef = getSearchFieldById(block.fieldId);
      if (fieldDef && block.term?.trim()) {
        // Determine the operator description
        let operatorDescription = "";

        if (block.operator) {
          if (block.operator.type === "EXCLUDE") {
            operatorDescription = " (excluded)";
          } else if (block.operator.type === "AND_NEXT") {
            operatorDescription = " AND connected with next block";
          } else if (block.operator.type === "AND_PREV") {
            operatorDescription = " AND connected with previous block";
          } else if (block.operator.type === "OR_NEXT") {
            operatorDescription = " OR connected with next block";
          } else if (block.operator.type === "OR_PREV") {
            operatorDescription = " OR connected with previous block";
          }
        } else if (block.booleanOperator === "NOT") {
          // Legacy support
          operatorDescription = " (excluded)";
        }

        parts.push({
          type: "search",
          label: `${fieldDef.label} ${index + 1}`,
          query: block.term,
          description: `Search ${fieldDef.label.toLowerCase()} for "${
            block.term
          }"${operatorDescription}`,
        });
      }
    });

    // Add journal parts
    journalBlocks.forEach((block, index) => {
      if (block.selectedISSNs.length > 0) {
        parts.push({
          type: "journal",
          label: `Journal Filter ${index + 1}`,
          query: `${block.selectedISSNs.length} journals from ${block.fieldOfStudy.name}`,
          description: `Filter to journals in ${block.fieldOfStudy.name} (${block.selectedISSNs.length} selected)`,
        });
      }
    });

    // Add global filter parts
    if (globalFilters) {
      if (globalFilters.yearFrom || globalFilters.yearTo) {
        const yearRange =
          globalFilters.yearFrom && globalFilters.yearTo
            ? `${globalFilters.yearFrom}-${globalFilters.yearTo}`
            : globalFilters.yearFrom
            ? `${globalFilters.yearFrom}+`
            : `up to ${globalFilters.yearTo}`;

        parts.push({
          type: "filter",
          label: "Year Filter",
          query: yearRange,
          description: `Limit to publications from ${yearRange}`,
        });
      }

      if (globalFilters.excludeCitations) {
        parts.push({
          type: "filter",
          label: "Citation Filter",
          query: "Exclude citations",
          description: "Remove citations from results",
        });
      }
    }

    return parts;
  }, [searchBlocks, journalBlocks, globalFilters]);

  // Check if we have any content to preview
  const hasContent =
    searchBlocks.some((b) => b.term?.trim()) ||
    journalBlocks.some((b) => b.selectedISSNs.length > 0);

  if (!hasContent) {
    return (
      <div className="bg-muted/50 border border-dashed border-muted-foreground/25 rounded-xl p-8 text-center">
        <Eye className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No Query to Preview
        </h3>
        <p className="text-sm text-muted-foreground">
          Add search terms or select journals to see the generated query
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Query Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 ${
              validation.isValid
                ? "text-green-700"
                : validation.errors.some((e) => e.type !== "warning")
                ? "text-red-700"
                : "text-yellow-700"
            }`}
          >
            {validation.isValid ? (
              <CheckCircle className="h-5 w-5" />
            ) : validation.errors.some((e) => e.type !== "warning") ? (
              <XCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <span className="font-medium">
              {validation.isValid
                ? "Query Ready"
                : validation.errors.some((e) => e.type !== "warning")
                ? "Query Has Errors"
                : "Query Has Warnings"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(queryResult.rawQuery)}
            disabled={!queryResult.success}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy Query
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(queryResult.url)}
            disabled={!queryResult.success}
          >
            <Link className="h-4 w-4 mr-1" />
            Copy URL
          </Button>

          {onExecuteSearch && (
            <Button
              onClick={onExecuteSearch}
              disabled={!validation.isValid || !queryResult.success}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Execute Search
            </Button>
          )}
        </div>
      </div>

      {/* Validation Messages */}
      {validation.errors.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Validation Messages
          </h4>
          <div className="space-y-2">
            {validation.errors.map((error, index) => (
              <div
                key={index}
                className={`text-sm ${getValidationSeverityColor(error.type)}`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-medium capitalize">{error.type}:</span>
                  <span>{error.message}</span>
                </div>
                {error.suggestion && (
                  <div className="ml-6 text-xs opacity-80">
                    Suggestion: {error.suggestion}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Query Explanation */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          What This Query Does
        </h4>
        <p className="text-sm text-muted-foreground">
          {validation.explanation}
        </p>
      </div>

      {/* Query Breakdown */}
      {showDetails && queryBreakdown.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Query Construction Breakdown
          </h4>
          <div className="space-y-3">
            {queryBreakdown.map((part, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div
                  className={`p-1 rounded ${
                    part.type === "search"
                      ? "bg-blue-100 text-blue-700"
                      : part.type === "journal"
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {part.type === "search" ? (
                    <Code className="h-3 w-3" />
                  ) : part.type === "journal" ? (
                    <BookOpen className="h-3 w-3" />
                  ) : (
                    <Filter className="h-3 w-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{part.label}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {part.query}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {part.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Query Display */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Code className="h-4 w-4" />
          Generated Query String
        </h4>

        {/* Syntax Highlighted Query Display */}
        {queryResult.success && (
          <div
            className="bg-muted rounded p-3 font-mono text-sm break-all"
            dangerouslySetInnerHTML={{
              __html: queryResult.rawQuery
                .replace(
                  /\(/g,
                  "<span class='text-blue-600 font-bold'>(</span>"
                )
                .replace(
                  /\)/g,
                  "<span class='text-blue-600 font-bold'>)</span>"
                )
                .replace(
                  / AND /g,
                  "<span class='text-green-600 font-semibold'> AND </span>"
                )
                .replace(
                  / OR /g,
                  "<span class='text-orange-600 font-semibold'> OR </span>"
                )
                .replace(
                  /-([^ ]+)/g,
                  "<span class='text-red-600 font-semibold'>-$1</span>"
                )
                .replace(
                  /"([^"]*)"/g,
                  "<span class='text-purple-600'>&quot;$1&quot;</span>"
                ),
            }}
          />
        )}

        {!queryResult.success && (
          <div className="bg-muted rounded p-3 font-mono text-sm break-all text-red-500">
            Query generation failed
          </div>
        )}

        {validation.correctedQuery && (
          <div className="mt-3">
            <h5 className="text-sm font-medium text-green-700 mb-1">
              Suggested Correction:
            </h5>
            <div className="bg-green-50 border border-green-200 rounded p-3 font-mono text-sm break-all">
              {validation.correctedQuery}
            </div>
          </div>
        )}
      </div>

      {/* Full URL Display */}
      {queryResult.success && (
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Link className="h-4 w-4" />
            Complete Google Scholar URL
          </h4>
          <div className="bg-muted rounded p-3 font-mono text-xs break-all overflow-x-auto">
            {queryResult.url}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            URL Length: {queryResult.url.length} characters
            {queryResult.url.length > 2000 && (
              <span className="text-yellow-600 ml-2">
                ⚠️ Very long URL may not work in all browsers
              </span>
            )}
          </p>
        </div>
      )}

      {/* Query Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">
            {searchBlocks.filter((b) => b.term?.trim()).length}
          </div>
          <div className="text-xs text-muted-foreground">Search Terms</div>
        </div>

        <div className="bg-card border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">
            {journalBlocks.reduce(
              (sum, block) => sum + block.selectedISSNs.length,
              0
            )}
          </div>
          <div className="text-xs text-muted-foreground">Journals Selected</div>
        </div>

        <div className="bg-card border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">
            {validation.errors.filter((e) => e.type !== "warning").length}
          </div>
          <div className="text-xs text-muted-foreground">Errors</div>
        </div>

        <div className="bg-card border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">
            {validation.errors.filter((e) => e.type === "warning").length}
          </div>
          <div className="text-xs text-muted-foreground">Warnings</div>
        </div>
      </div>
    </div>
  );
}
