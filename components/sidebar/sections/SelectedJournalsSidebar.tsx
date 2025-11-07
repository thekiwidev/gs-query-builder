"use client";

import React, { useMemo } from "react";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { type JournalRecord } from "../../../types/journal";
import { BookOpen } from "lucide-react";

interface SelectedJournalsSidebarProps {
  availableJournals: JournalRecord[];
  selectedJournals: JournalRecord[];
  onJournalsChange: (journals: JournalRecord[]) => void;
  selectedRatings: string[];
}

export function SelectedJournalsSidebar({
  availableJournals,
  selectedJournals,
  onJournalsChange,
  selectedRatings,
}: SelectedJournalsSidebarProps) {
  // Filter and sort available journals by rating
  const filteredJournals = useMemo(() => {
    const filtered = availableJournals.filter((j) =>
      selectedRatings.includes(j.rating)
    );

    // Sort by rating: A* -> A -> B -> C
    const ratingOrder = { "A*": 0, A: 1, B: 2, C: 3 };
    return filtered.sort(
      (a, b) =>
        (ratingOrder[a.rating as keyof typeof ratingOrder] ?? 4) -
        (ratingOrder[b.rating as keyof typeof ratingOrder] ?? 4)
    );
  }, [availableJournals, selectedRatings]);

  const RATING_BADGE_COLORS: Record<string, string> = {
    "A*": "bg-red-500 text-white",
    A: "bg-green-500 text-white",
    B: "bg-blue-500 text-white",
    C: "bg-orange-500 text-white",
  };

  const handleJournalToggle = (journal: JournalRecord, checked: boolean) => {
    if (checked) {
      onJournalsChange([...selectedJournals, journal]);
    } else {
      // Filter by both ISSN and title to handle journals with duplicate ISSNs (like "-")
      onJournalsChange(
        selectedJournals.filter(
          (j) => !(j.issn === journal.issn && j.title === journal.title)
        )
      );
    }
  };

  const handleSelectAll = () => {
    onJournalsChange(filteredJournals);
  };

  const handleClearAll = () => {
    onJournalsChange([]);
  };

  return (
    <div className="space-y-3 pb-16">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        Available Journals ({filteredJournals.length})
      </h3>

      {/* Journals List */}
      <div className="border border-gray-300 rounded-lg max-h-3/5 overflow-y-auto bg-white">
        {filteredJournals.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredJournals.map((journal, index) => {
              // Use ISSN as key, but fallback to title if ISSN is placeholder or duplicate
              const uniqueKey =
                journal.issn === "-"
                  ? `journal-${index}-${journal.title}`
                  : journal.issn;
              const uniqueId =
                journal.issn === "-"
                  ? `journal-${index}`
                  : `journal-${journal.issn}`;

              return (
                <div
                  key={uniqueKey}
                  className="flex items-start gap-2 p-3 hover:bg-gray-50"
                >
                  <Checkbox
                    id={uniqueId}
                    checked={selectedJournals.some(
                      (j) =>
                        j.issn === journal.issn && j.title === journal.title
                    )}
                    onCheckedChange={(checked) =>
                      handleJournalToggle(journal, checked as boolean)
                    }
                    className="mt-0.5 shrink-0"
                  />
                  <label
                    htmlFor={uniqueId}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-gray-900 truncate">
                      {journal.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        ISSN: {journal.issn}
                      </span>
                      <span
                        className={`text-xs font-bold p-1 py-[0.4px] rounded ${
                          RATING_BADGE_COLORS[journal.rating] ||
                          "bg-gray-500 text-white"
                        }`}
                      >
                        {journal.rating}
                      </span>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-gray-500 text-center py-6 px-3">
            {availableJournals.length === 0
              ? "Select a department to see available journals"
              : "No journals match the selected ratings"}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {filteredJournals.length > 0 && (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="flex-1 text-xs"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="flex-1 text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
