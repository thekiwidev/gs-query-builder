/**
 * Simplified Journal Selector Component
 *
 * Compact dropdown-based journal selection for global filters.
 * Single field selection with automatic rating segmentation.
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  JournalRecord,
  FIELD_OF_STUDY_MAPPINGS,
  JournalRating,
  getAllFieldsOfStudy,
} from "../types/journal";
import { loadJournalsFromCSV } from "../lib/journalLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  BookOpen,
  Star,
  GraduationCap,
  AlertCircle,
  ChevronDown,
  X,
} from "lucide-react";

interface SimplifiedJournalSelectorProps {
  /** Selected field of study code */
  selectedFieldCode?: string;
  /** Selected journal ISSNs */
  selectedJournalISSNs?: string[];
  /** Callback when field selection changes */
  onFieldChange: (fieldCode?: string) => void;
  /** Callback when journal selection changes */
  onJournalsChange: (issnList: string[]) => void;
}

const RATING_ICONS: Record<JournalRating, React.ReactNode> = {
  "A*": <Star className="h-3 w-3 fill-current" />,
  A: <Star className="h-3 w-3" />,
  B: <GraduationCap className="h-3 w-3" />,
  C: <BookOpen className="h-3 w-3" />,
};

const RATING_COLORS: Record<JournalRating, string> = {
  "A*": "text-yellow-700 bg-yellow-50 border-yellow-200",
  A: "text-green-700 bg-green-50 border-green-200",
  B: "text-blue-700 bg-blue-50 border-blue-200",
  C: "text-gray-700 bg-gray-50 border-gray-200",
};

export function SimplifiedJournalSelector({
  selectedFieldCode,
  selectedJournalISSNs = [],
  onFieldChange,
  onJournalsChange,
}: SimplifiedJournalSelectorProps) {
  const [journals, setJournals] = useState<JournalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load journals on mount
  useEffect(() => {
    const loadJournals = async () => {
      try {
        setIsLoading(true);
        const result = await loadJournalsFromCSV("/data/journals.csv");
        setJournals(result.validJournals);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load journals"
        );
        setJournals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadJournals();
  }, []);

  // Get journals for selected field
  const fieldJournals = useMemo(() => {
    if (!selectedFieldCode) return [];
    return journals.filter(
      (journal) => journal.fieldCode === selectedFieldCode
    );
  }, [journals, selectedFieldCode]);

  // Group journals by rating
  const journalsByRating = useMemo(() => {
    const grouped = {
      "A*": [] as JournalRecord[],
      A: [] as JournalRecord[],
      B: [] as JournalRecord[],
      C: [] as JournalRecord[],
    };

    fieldJournals.forEach((journal) => {
      grouped[journal.rating].push(journal);
    });

    // Sort within each rating by title
    Object.keys(grouped).forEach((rating) => {
      grouped[rating as JournalRating].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    });

    return grouped;
  }, [fieldJournals]);

  const handleFieldSelection = (fieldCode: string) => {
    onFieldChange(fieldCode === "none" ? undefined : fieldCode);
    onJournalsChange([]); // Clear journal selections when field changes
  };

  const handleJournalToggle = (issn: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedJournalISSNs, issn]
      : selectedJournalISSNs.filter((id) => id !== issn);

    onJournalsChange(newSelection);
  };

  const handleRatingToggle = (rating: JournalRating, selectAll: boolean) => {
    const ratingJournals = journalsByRating[rating];
    const ratingISSNs = ratingJournals.map((j) => j.issn);

    let newSelection: string[];
    if (selectAll) {
      // Add all journals of this rating
      newSelection = [...new Set([...selectedJournalISSNs, ...ratingISSNs])];
    } else {
      // Remove all journals of this rating
      newSelection = selectedJournalISSNs.filter(
        (issn) => !ratingISSNs.includes(issn)
      );
    }

    onJournalsChange(newSelection);
  };

  const clearAllSelections = () => {
    onJournalsChange([]);
  };

  const selectedField = selectedFieldCode
    ? FIELD_OF_STUDY_MAPPINGS[selectedFieldCode]
    : null;
  const hasSelection = selectedJournalISSNs.length > 0;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm">
        <AlertCircle className="h-4 w-4" />
        <span>Failed to load journals: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Field of Study Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Journal Field Filter</Label>
        <Select
          value={selectedFieldCode || "none"}
          onValueChange={handleFieldSelection}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select field of study..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No journal filter</SelectItem>
            {getAllFieldsOfStudy().map((field) => {
              const journalCount = journals.filter(
                (j) => j.fieldCode === field.code
              ).length;
              return (
                <SelectItem key={field.code} value={field.code}>
                  {field.name} ({journalCount} journals)
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Journal Selection */}
      {selectedField && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Journals in {selectedField.name}
            </Label>
            {hasSelection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllSelections}
                className="text-xs h-6 px-2"
              >
                <X className="h-3 w-3 mr-1" />
                Clear ({selectedJournalISSNs.length})
              </Button>
            )}
          </div>

          {/* Dropdown for Journal Selection */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full justify-between text-sm transform-none hover:scale-100 active:scale-100"
            >
              <span>
                {hasSelection
                  ? `${selectedJournalISSNs.length} journal${
                      selectedJournalISSNs.length !== 1 ? "s" : ""
                    } selected`
                  : "Select journals..."}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </Button>

            {isDropdownOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
                <div className="divide-y divide-gray-100">
                  {/* Continuous Journal List with Inline Rating Headers */}
                  {(["A*", "A"] as JournalRating[]).map((rating) => {
                    const ratingJournals = journalsByRating[rating];
                    if (ratingJournals.length === 0) return null;

                    const selectedInRating = ratingJournals.filter((j) =>
                      selectedJournalISSNs.includes(j.issn)
                    ).length;
                    const allSelected =
                      selectedInRating === ratingJournals.length;

                    return (
                      <React.Fragment key={rating}>
                        {/* Inline Rating Header */}
                        <div className="flex items-center justify-between p-3 bg-gray-50">
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${RATING_COLORS[rating]}`}
                          >
                            {RATING_ICONS[rating]}
                            {rating} Rating ({ratingJournals.length})
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRatingToggle(rating, !allSelected)
                            }
                            className="text-xs h-6 px-2"
                          >
                            {allSelected ? "Deselect All" : "Select All"}
                          </Button>
                        </div>

                        {/* Individual Journals - continuous list */}
                        {ratingJournals.map((journal) => (
                          <div
                            key={journal.issn}
                            className="flex items-center space-x-2 p-3 hover:bg-gray-50 text-xs border-l-2 border-transparent hover:border-gray-300"
                          >
                            <Checkbox
                              id={`journal-${journal.issn}`}
                              checked={selectedJournalISSNs.includes(
                                journal.issn
                              )}
                              onCheckedChange={(checked) =>
                                handleJournalToggle(
                                  journal.issn,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={`journal-${journal.issn}`}
                              className="flex-1 cursor-pointer"
                              title={journal.title}
                            >
                              <div className="truncate font-medium">
                                {journal.title}
                              </div>
                              <div className="text-gray-500 text-xs">
                                ISSN: {journal.issn}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </React.Fragment>
                    );
                  })}

                  {fieldJournals.length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-4">
                      No journals available in this field
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Selection Summary */}
          {hasSelection && (
            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border">
              <strong>{selectedJournalISSNs.length}</strong> journal
              {selectedJournalISSNs.length !== 1 ? "s" : ""} selected from{" "}
              <strong>{selectedField.name}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
