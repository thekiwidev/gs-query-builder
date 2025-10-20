/**
 * Google Scholar Query Builder
 *
 * Main component that manages multiple search blocks and handles the query generation.
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBlock, buildScholarUrl, GlobalFilters } from "../lib/qtm";
import { MainLayout } from "./layouts/MainLayout";
import { MainContentArea } from "./layouts/MainContentArea";
import { SearchBlocksContainer } from "./search/SearchBlocksContainer";
import { ActionButtonsSection } from "./search/ActionButtonsSection";
import { Button } from "./ui/button";

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
  const [selectedJournalRatings, setSelectedJournalRatings] = useState<
    string[]
  >(["A*"]);

  const router = useRouter();

  // Generate query in real-time
  const generateCurrentQuery = () => {
    const enhancedFilters = {
      ...globalFilters,
      selectedJournalISSNs,
      selectedFieldCode,
    };
    return buildScholarUrl(searchBlocks, enhancedFilters);
  };

  const currentQuery = generateCurrentQuery();

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
    const result = currentQuery;

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
        selectedJournalRatings,
        onJournalRatingsChange: setSelectedJournalRatings,
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Google Scholar Query Builder
              </h1>
              <p className="text-gray-600">
                Create advanced searches using Scopus-style field restrictions
              </p>
            </div>
            <Button
              onClick={() => router.push("/how-to-use")}
              variant="outline"
              className="gap-2"
              title="Open help and documentation"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Help
            </Button>
          </div>
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
