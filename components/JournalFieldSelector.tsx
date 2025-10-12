/**
 * Journal Field Selector Component
 *
 * Allows users to select fields of study and then select multiple journals
 * within those fields, grouped by rating (A*, A, B, C).
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  JournalRecord,
  JournalsByField,
  JournalRating,
  JournalSelectionBlock,
} from "../types/journal";
import {
  loadJournalsFromCSV,
  groupJournalsByField,
  searchJournals,
} from "../lib/journalLoader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  X,
  Plus,
  Search,
  BookOpen,
  GraduationCap,
  Star,
  AlertCircle,
  CheckSquare,
  Square,
} from "lucide-react";

interface JournalFieldSelectorProps {
  /** Current journal selection blocks */
  selectionBlocks: JournalSelectionBlock[];
  /** Callback when selection blocks change */
  onSelectionChange: (blocks: JournalSelectionBlock[]) => void;
  /** Whether the component is in loading state */
  isLoading?: boolean;
}

interface JournalLoadState {
  isLoading: boolean;
  journalsByField: JournalsByField[];
  error: string | null;
  totalJournals: number;
}

const RATING_COLORS: Record<JournalRating, string> = {
  "A*": "bg-yellow-100 text-yellow-800 border-yellow-300",
  A: "bg-green-100 text-green-800 border-green-300",
  B: "bg-blue-100 text-blue-800 border-blue-300",
  C: "bg-gray-100 text-gray-800 border-gray-300",
};

const RATING_ICONS: Record<JournalRating, React.ReactNode> = {
  "A*": <Star className="h-3 w-3 fill-current" />,
  A: <Star className="h-3 w-3" />,
  B: <GraduationCap className="h-3 w-3" />,
  C: <BookOpen className="h-3 w-3" />,
};

export function JournalFieldSelector({
  selectionBlocks,
  onSelectionChange,
  isLoading = false,
}: JournalFieldSelectorProps) {
  const [journalState, setJournalState] = useState<JournalLoadState>({
    isLoading: true,
    journalsByField: [],
    error: null,
    totalJournals: 0,
  });

  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );

  // Load journals on component mount
  useEffect(() => {
    const loadJournals = async () => {
      try {
        setJournalState((prev) => ({ ...prev, isLoading: true, error: null }));

        const result = await loadJournalsFromCSV("/data/journals.csv");

        if (result.summary.invalidRows > 0) {
          console.warn(
            `Loaded ${result.summary.validRows} journals with ${result.summary.invalidRows} invalid entries`
          );
        }

        const groupedJournals = groupJournalsByField(result.validJournals);

        setJournalState({
          isLoading: false,
          journalsByField: groupedJournals,
          error: null,
          totalJournals: result.summary.validRows,
        });
      } catch (error) {
        console.error("Error loading journals:", error);
        setJournalState({
          isLoading: false,
          journalsByField: [],
          error:
            error instanceof Error ? error.message : "Failed to load journals",
          totalJournals: 0,
        });
      }
    };

    loadJournals();
  }, []);

  const addSelectionBlock = () => {
    if (journalState.journalsByField.length === 0) return;

    const newBlock: JournalSelectionBlock = {
      id: Date.now().toString(),
      fieldOfStudy: journalState.journalsByField[0].field,
      selectedISSNs: [],
      ratingFilter: ["A*", "A", "B", "C"],
      logicOperator: "AND",
    };

    onSelectionChange([...selectionBlocks, newBlock]);
  };

  const removeSelectionBlock = (blockId: string) => {
    if (selectionBlocks.length <= 1) return;
    onSelectionChange(selectionBlocks.filter((block) => block.id !== blockId));
  };

  const updateSelectionBlock = (
    blockId: string,
    updates: Partial<JournalSelectionBlock>
  ) => {
    const updatedBlocks = selectionBlocks.map((block) =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    onSelectionChange(updatedBlocks);
  };

  const toggleJournalSelection = (blockId: string, issn: string) => {
    const block = selectionBlocks.find((b) => b.id === blockId);
    if (!block) return;

    const isSelected = block.selectedISSNs.includes(issn);
    const newSelectedISSNs = isSelected
      ? block.selectedISSNs.filter((id) => id !== issn)
      : [...block.selectedISSNs, issn];

    updateSelectionBlock(blockId, { selectedISSNs: newSelectedISSNs });
  };

  const toggleRatingFilter = (blockId: string, rating: JournalRating) => {
    const block = selectionBlocks.find((b) => b.id === blockId);
    if (!block) return;

    const isIncluded = block.ratingFilter.includes(rating);
    const newRatingFilter = isIncluded
      ? block.ratingFilter.filter((r) => r !== rating)
      : [...block.ratingFilter, rating];

    updateSelectionBlock(blockId, { ratingFilter: newRatingFilter });
  };

  const getFilteredJournals = (blockId: string): JournalRecord[] => {
    const block = selectionBlocks.find((b) => b.id === blockId);
    if (!block) return [];

    const fieldJournals = journalState.journalsByField.find(
      (f) => f.field.code === block.fieldOfStudy.code
    );

    if (!fieldJournals) return [];

    // Apply rating filter
    let filtered = fieldJournals.journals.filter((journal) =>
      block.ratingFilter.includes(journal.rating)
    );

    // Apply search filter
    const searchQuery = searchQueries[blockId];
    if (searchQuery?.trim()) {
      filtered = searchJournals(filtered, searchQuery, {
        fieldCodes: [block.fieldOfStudy.code],
        ratings: block.ratingFilter,
      });
    }

    return filtered;
  };

  const selectAllInRating = (blockId: string, rating: JournalRating) => {
    const filtered = getFilteredJournals(blockId);
    const ratingJournals = filtered.filter((j) => j.rating === rating);
    const ratingISSNs = ratingJournals.map((j) => j.issn);

    const block = selectionBlocks.find((b) => b.id === blockId);
    if (!block) return;

    // Add all rating ISSNs to selection (avoid duplicates)
    const newSelectedISSNs = [
      ...new Set([...block.selectedISSNs, ...ratingISSNs]),
    ];
    updateSelectionBlock(blockId, { selectedISSNs: newSelectedISSNs });
  };

  const deselectAllInRating = (blockId: string, rating: JournalRating) => {
    const filtered = getFilteredJournals(blockId);
    const ratingISSNs = filtered
      .filter((j) => j.rating === rating)
      .map((j) => j.issn);

    const block = selectionBlocks.find((b) => b.id === blockId);
    if (!block) return;

    const newSelectedISSNs = block.selectedISSNs.filter(
      (issn) => !ratingISSNs.includes(issn)
    );
    updateSelectionBlock(blockId, { selectedISSNs: newSelectedISSNs });
  };

  // Show loading state
  if (journalState.isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading journal database...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (journalState.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h3 className="font-semibold text-red-800">
            Failed to Load Journals
          </h3>
        </div>
        <p className="text-red-700 text-sm">{journalState.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Journal Field Selection</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            {journalState.totalJournals} journals across{" "}
            {journalState.journalsByField.length} fields
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Select fields of study and then choose specific journals within those
          fields. Journals are grouped by rating (A*, A, B, C) for easy
          identification.
        </p>

        <Button
          onClick={addSelectionBlock}
          disabled={journalState.journalsByField.length === 0 || isLoading}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Field Block
        </Button>
      </div>

      {/* Selection Blocks */}
      {selectionBlocks.map((block, index) => (
        <div
          key={block.id}
          className="bg-card border border-border rounded-xl p-6"
        >
          {/* Block Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">
              Field Block {index + 1}
            </h4>
            <div className="flex items-center gap-2">
              {index > 0 && (
                <Select
                  value={block.logicOperator}
                  onValueChange={(value) =>
                    updateSelectionBlock(block.id, {
                      logicOperator: value as "AND" | "OR",
                    })
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSelectionBlock(block.id)}
                disabled={selectionBlocks.length <= 1}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Field Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Field of Study
              </Label>
              <Select
                value={block.fieldOfStudy.code}
                onValueChange={(value) => {
                  const newField = journalState.journalsByField.find(
                    (f) => f.field.code === value
                  )?.field;
                  if (newField) {
                    updateSelectionBlock(block.id, {
                      fieldOfStudy: newField,
                      selectedISSNs: [], // Clear selections when field changes
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {journalState.journalsByField.map((fieldGroup) => (
                    <SelectItem
                      key={fieldGroup.field.code}
                      value={fieldGroup.field.code}
                    >
                      {fieldGroup.field.name} ({fieldGroup.journals.length}{" "}
                      journals)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Search Journals
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, ISSN..."
                  value={searchQueries[block.id] || ""}
                  onChange={(e) =>
                    setSearchQueries((prev) => ({
                      ...prev,
                      [block.id]: e.target.value,
                    }))
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">
              Rating Filter
            </Label>
            <div className="flex flex-wrap gap-2">
              {(["A*", "A", "B", "C"] as JournalRating[]).map((rating) => (
                <Button
                  key={rating}
                  variant={
                    block.ratingFilter.includes(rating) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => toggleRatingFilter(block.id, rating)}
                  className={`flex items-center gap-1 ${RATING_COLORS[rating]}`}
                >
                  {RATING_ICONS[rating]}
                  {rating}
                </Button>
              ))}
            </div>
          </div>

          {/* Journal Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Select Journals ({block.selectedISSNs.length} selected)
              </Label>
            </div>

            {(["A*", "A", "B", "C"] as JournalRating[])
              .filter((rating) => block.ratingFilter.includes(rating))
              .map((rating) => {
                const ratingJournals = getFilteredJournals(block.id).filter(
                  (j) => j.rating === rating
                );
                if (ratingJournals.length === 0) return null;

                const selectedInRating = ratingJournals.filter((j) =>
                  block.selectedISSNs.includes(j.issn)
                ).length;
                const allSelected = selectedInRating === ratingJournals.length;
                const someSelected = selectedInRating > 0;

                return (
                  <div key={rating} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            allSelected
                              ? deselectAllInRating(block.id, rating)
                              : selectAllInRating(block.id, rating)
                          }
                          className="flex items-center gap-2"
                        >
                          {allSelected ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : someSelected ? (
                            <Square className="h-4 w-4 bg-primary/20" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </Button>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${RATING_COLORS[rating]}`}
                        >
                          {RATING_ICONS[rating]}
                          {rating} Rating
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {selectedInRating}/{ratingJournals.length} selected
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {ratingJournals.map((journal) => (
                        <div
                          key={journal.issn}
                          className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded"
                        >
                          <Checkbox
                            id={`${block.id}-${journal.issn}`}
                            checked={block.selectedISSNs.includes(journal.issn)}
                            onCheckedChange={() =>
                              toggleJournalSelection(block.id, journal.issn)
                            }
                          />
                          <Label
                            htmlFor={`${block.id}-${journal.issn}`}
                            className="flex-1 text-sm cursor-pointer"
                          >
                            <div className="font-medium">{journal.title}</div>
                            <div className="text-muted-foreground text-xs">
                              ISSN: {journal.issn} • {journal.publisher}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* Selection Summary */}
      {selectionBlocks.some((block) => block.selectedISSNs.length > 0) && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h4 className="font-medium text-primary mb-2">Selection Summary</h4>
          <div className="text-sm text-primary/80 space-y-1">
            {selectionBlocks.map((block, index) => (
              <div key={block.id}>
                <strong>Block {index + 1}:</strong> {block.selectedISSNs.length}{" "}
                journals from {block.fieldOfStudy.name}
              </div>
            ))}
            <div className="pt-2 border-t border-primary/20">
              <strong>Total:</strong>{" "}
              {selectionBlocks.reduce(
                (sum, block) => sum + block.selectedISSNs.length,
                0
              )}{" "}
              journals selected
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
