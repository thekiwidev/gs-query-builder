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
import { MainLayout } from "./layouts/MainLayout";
import { MainContentArea } from "./layouts/MainContentArea";
import { SearchBlocksContainer } from "./search/SearchBlocksContainer";
import { ActionButtonsSection } from "./search/ActionButtonsSection";
import { QueryPreview } from "./QueryPreview";
import { Button } from "./ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export function QueryBuilder() {
  const [searchBlocks, setSearchBlocks] = useState<SearchBlock[]>([
    {
      fieldId: "all_fields",
      term: "",
      isExact: false,
      booleanOperator: "AND",
      operator: {
        type: "NONE",
      },
    },
  ]);

  const [globalFilters, setGlobalFilters] = useState<GlobalFilters>({
    excludeCitations: false,
    includeCitations: true,
  });

  // Track selected field codes (for multi-select)
  const [selectedFieldCodes, setSelectedFieldCodes] = useState<string[]>([]);
  const [selectedFieldCode, setSelectedFieldCode] = useState<string>();
  const [selectedJournalISSNs, setSelectedJournalISSNs] = useState<string[]>(
    []
  );
  const [lastResult, setLastResult] = useState<QTMResult | null>(null);

  const addSearchBlock = () => {
    const newBlocks = [...searchBlocks];

    if (newBlocks.length > 0) {
      const lastBlock = newBlocks[newBlocks.length - 1];
      if (
        lastBlock.operator?.type === "AND_NEXT" ||
        lastBlock.operator?.type === "OR_NEXT"
      ) {
        setSearchBlocks([
          ...newBlocks,
          {
            fieldId: "all_fields",
            term: "",
            isExact: false,
            booleanOperator: lastBlock.operator.type.startsWith("AND")
              ? "AND"
              : "OR",
            operator: {
              type:
                lastBlock.operator.type === "AND_NEXT" ? "AND_PREV" : "OR_PREV",
            },
          },
        ]);
        return;
      }
    }

    setSearchBlocks([
      ...searchBlocks,
      {
        fieldId: "all_fields",
        term: "",
        isExact: false,
        booleanOperator: "AND",
        operator: {
          type: "NONE",
        },
      },
    ]);
  };

  const updateSearchBlock = (index: number, updatedBlock: SearchBlock) => {
    const newBlocks = [...searchBlocks];
    newBlocks[index] = updatedBlock;

    if (
      updatedBlock.operator?.type === "AND_NEXT" ||
      updatedBlock.operator?.type === "OR_NEXT"
    ) {
      if (index < newBlocks.length - 1) {
        const nextBlock = newBlocks[index + 1];
        if (
          nextBlock.operator?.type === "AND_PREV" ||
          nextBlock.operator?.type === "OR_PREV"
        ) {
          newBlocks[index + 1] = {
            ...nextBlock,
            operator: {
              type:
                updatedBlock.operator.type === "AND_NEXT"
                  ? "AND_PREV"
                  : "OR_PREV",
            },
            booleanOperator: updatedBlock.operator.type.startsWith("AND")
              ? "AND"
              : "OR",
          };
        }
      }
    }

    if (
      updatedBlock.operator?.type === "AND_PREV" ||
      updatedBlock.operator?.type === "OR_PREV"
    ) {
      if (index > 0) {
        const prevBlock = newBlocks[index - 1];
        if (
          prevBlock.operator?.type === "AND_NEXT" ||
          prevBlock.operator?.type === "OR_NEXT"
        ) {
          newBlocks[index - 1] = {
            ...prevBlock,
            operator: {
              type:
                updatedBlock.operator.type === "AND_PREV"
                  ? "AND_NEXT"
                  : "OR_NEXT",
            },
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
      const newBlocks = searchBlocks.filter((_, i) => i !== index);

      if (
        blockToRemove.operator?.type === "AND_NEXT" ||
        blockToRemove.operator?.type === "OR_NEXT"
      ) {
        if (index + 1 < searchBlocks.length) {
          const nextBlockIndex =
            index < newBlocks.length ? index : newBlocks.length - 1;
          if (nextBlockIndex >= 0) {
            newBlocks[nextBlockIndex] = {
              ...newBlocks[nextBlockIndex],
              operator: { type: "NONE" },
            };
          }
        }
      } else if (
        blockToRemove.operator?.type === "AND_PREV" ||
        blockToRemove.operator?.type === "OR_PREV"
      ) {
        if (index > 0) {
          const prevBlockIndex = index - 1;
          if (prevBlockIndex >= 0) {
            newBlocks[prevBlockIndex] = {
              ...newBlocks[prevBlockIndex],
              operator: { type: "NONE" },
            };
          }
        }
      }

      if (index + 1 < searchBlocks.length) {
        const nextBlock = searchBlocks[index + 1];
        if (
          nextBlock.operator?.type === "AND_PREV" ||
          nextBlock.operator?.type === "OR_PREV"
        ) {
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

      if (index > 0) {
        const prevBlock = searchBlocks[index - 1];
        if (
          prevBlock.operator?.type === "AND_NEXT" ||
          prevBlock.operator?.type === "OR_NEXT"
        ) {
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
    const enhancedFilters = {
      ...globalFilters,
      selectedJournalISSNs,
      selectedFieldCode,
    };

    const result = buildScholarUrl(searchBlocks, enhancedFilters);
    setLastResult(result);

    if (result.success) {
      window.open(result.url, "_blank");
    }
  };

  const resetForm = () => {
    setSearchBlocks([
      {
        fieldId: "all_fields",
        term: "",
        booleanOperator: "AND",
        operator: {
          type: "NONE",
        },
      },
    ]);

    setGlobalFilters({
      excludeCitations: false,
      includeCitations: true,
    });

    setSelectedJournalISSNs([]);
    setSelectedFieldCode(undefined);
    setLastResult(null);
  };

  const hasValidTerms = searchBlocks.some(
    (block) => block.fieldId && block.term && block.term.trim().length > 0
  );

  return (
    <MainLayout
      sidebarProps={{
        selectedFieldCodes,
        onFieldCodesChange: setSelectedFieldCodes,
        selectedJournalISSNs,
        onJournalsChange: setSelectedJournalISSNs,
        yearLow: globalFilters.yearFrom,
        yearHigh: globalFilters.yearTo,
        onYearChange: (yearLow, yearHigh) => {
          setGlobalFilters({
            ...globalFilters,
            yearFrom: yearLow,
            yearTo: yearHigh,
          });
        },
      }}
    >
      <MainContentArea>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Scholar Query Builder
          </h1>
          <p className="text-gray-600">
            Create advanced searches using Scopus-style field restrictions
          </p>
        </div>

        {/* Search Blocks Container */}
        <div className="my-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Search Terms
          </h3>
          <SearchBlocksContainer
            blocks={searchBlocks}
            onBlockChange={updateSearchBlock}
            onBlockRemove={removeSearchBlock}
          />
        </div>

        {/* Action Buttons */}
        <ActionButtonsSection
          onAddBlock={addSearchBlock}
          onSearch={handleSearch}
          hasErrors={!hasValidTerms}
        />

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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
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

        {/* Reset Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={resetForm}
            variant="outline"
            className="flex items-center gap-2"
          >
            Reset Form
          </Button>
        </div>
      </MainContentArea>
    </MainLayout>
  );
}
