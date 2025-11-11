/**
 * Scholarle Query Builder
 *
 * Main component that manages multiple search blocks and handles the query generation.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Library } from "lucide-react";
import { SearchBlock, buildScholarUrl, GlobalFilters } from "../lib/qtm";
import { MainLayout } from "./layouts/MainLayout";
import { MainContentArea } from "./layouts/MainContentArea";
import { SearchBlocksContainer } from "./search/SearchBlocksContainer";
import { Department, JournalRecord, FieldOfStudy } from "@/types/journal";
import { loadJournalsForDepartments } from "@/lib/journalLoader";

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

  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>(
    []
  );
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [availableJournals, setAvailableJournals] = useState<JournalRecord[]>(
    []
  );
  const [availableFields, setAvailableFields] = useState<FieldOfStudy[]>([]);

  useEffect(() => {
    const loadJournals = async () => {
      if (selectedDepartments.length === 0) {
        setAvailableJournals([]);
        setAvailableFields([]);
        return;
      }

      const { journals, fields } = await loadJournalsForDepartments(
        selectedDepartments
      );

      setAvailableJournals(journals);
      setAvailableFields(fields);
    };

    loadJournals();
  }, [selectedDepartments]);

  // Track selected field codes (for multi-select)
  const [selectedFieldCode, setSelectedFieldCode] = useState<string>();
  const [selectedJournals, setSelectedJournals] = useState<JournalRecord[]>([]);
  const [selectedJournalRatings, setSelectedJournalRatings] = useState<
    string[]
  >(["A*"]);

  // Generate query in real-time
  const generateCurrentQuery = () => {
    const enhancedFilters = {
      ...globalFilters,
      selectedJournalISSNs: selectedJournals.map((j) => j.issn),
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

    setSelectedDepartments([]);
    setSelectedFields([]);
    setSelectedJournals([]);
    setSelectedFieldCode(undefined);
  };

  const hasValidTerms = searchBlocks.some(
    (block) => block.fieldId && block.term && block.term.trim().length > 0
  );

  // Determine which journals to show in the selector
  const journalsForSelector = availableJournals.filter((journal) => {
    // Find the department this journal belongs to
    const journalDepartment = selectedDepartments.find(
      (dep) => dep.id === journal.departmentId
    );

    if (!journalDepartment) {
      return false; // Journal doesn't belong to any selected department
    }

    // If the department has subcategories (Field of Research)
    if (journalDepartment.hasSubcategories) {
      // Only show journals if a field is explicitly selected
      if (selectedFields.length === 0) {
        return false; // Don't show journals from departments with subcategories until a field is selected
      }
      // Show journal if its field is selected
      return selectedFields.includes(journal.fieldCode);
    }

    // If department doesn't have subcategories, always show all its journals
    return true;
  });

  return (
    <MainLayout
      sidebarProps={{
        selectedDepartments,
        onDepartmentsChange: setSelectedDepartments,
        availableFields,
        selectedFields,
        onFieldsChange: setSelectedFields,
        availableJournals: journalsForSelector,
        selectedJournals,
        onJournalsChange: setSelectedJournals,
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
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Library className="h-9 w-9 text-[#4D90FD]" />
              <h1 className="text-3xl font-bold text-gray-900">
                Scholarle: Designed for Smarter Academic Research
              </h1>
            </div>
            <p className="text-gray-600">
              Discover relevant studies faster through structured field-specific
              queries.
            </p>
          </div>
        </div>

        {/* Search Blocks Container */}
        <div className="my-8">
          <SearchBlocksContainer
            blocks={searchBlocks}
            onBlockChange={updateSearchBlock}
            onBlockRemove={removeSearchBlock}
            onAddBlock={addSearchBlock}
            onSearch={handleSearch}
            hasErrors={!hasValidTerms}
          />
        </div>

        {/* Reset Button - Bottom right, plain style */}
        <div className="flex justify-end mb-8">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Form
          </button>
        </div>
      </MainContentArea>
    </MainLayout>
  );
}
