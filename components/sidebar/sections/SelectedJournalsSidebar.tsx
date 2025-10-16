"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { loadJournalsFromCSV } from "../../../lib/journalLoader";
import { type JournalRecord } from "../../../types/journal";
import { BookOpen } from "lucide-react";

interface SelectedJournalsSidebarProps {
  selectedJournalISSNs: string[];
  onJournalsChange: (issns: string[]) => void;
  selectedFieldCodes: string[];
  selectedRatings: string[];
}

export function SelectedJournalsSidebar({
  selectedJournalISSNs,
  onJournalsChange,
  selectedFieldCodes,
  selectedRatings,
}: SelectedJournalsSidebarProps) {
  const [journals, setJournals] = useState<JournalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load journals on mount
  useEffect(() => {
    const loadJournals = async () => {
      try {
        setIsLoading(true);
        const result = await loadJournalsFromCSV("/data/journals.csv");
        setJournals(result.validJournals);
      } catch (err) {
        console.error("Failed to load journals:", err);
        setJournals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadJournals();
  }, []);

  // Get journals available for selected fields, sorted by rating
  const availableJournals = useMemo(() => {
    if (selectedFieldCodes.length === 0) {
      return [];
    }

    const filtered = journals.filter(
      (j) =>
        selectedFieldCodes.includes(j.fieldCode) &&
        selectedRatings.includes(j.rating)
    );

    // Sort by rating: A* -> A -> B -> C
    const ratingOrder = { "A*": 0, A: 1, B: 2, C: 3 };
    return filtered.sort(
      (a, b) =>
        (ratingOrder[a.rating as keyof typeof ratingOrder] ?? 4) -
        (ratingOrder[b.rating as keyof typeof ratingOrder] ?? 4)
    );
  }, [journals, selectedFieldCodes, selectedRatings]);

  const RATING_BADGE_COLORS: Record<string, string> = {
    "A*": "bg-red-500 text-white",
    A: "bg-green-500 text-white",
    B: "bg-blue-500 text-white",
    C: "bg-orange-500 text-white",
  };

  const handleJournalToggle = (issn: string, checked: boolean) => {
    if (checked) {
      onJournalsChange([...selectedJournalISSNs, issn]);
    } else {
      onJournalsChange(selectedJournalISSNs.filter((i) => i !== issn));
    }
  };

  const handleSelectAll = () => {
    onJournalsChange(availableJournals.map((j) => j.issn));
  };

  const handleClearAll = () => {
    onJournalsChange([]);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Available Journals
        </h3>
        <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-16">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        Available Journals ({availableJournals.length})
      </h3>

      {/* Journals List */}
      <div className="border border-gray-300 rounded max-h-3/5 overflow-y-auto bg-white">
        {availableJournals.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {availableJournals.map((journal) => (
              <div
                key={journal.issn}
                className="flex items-start gap-2 p-3 hover:bg-gray-50"
              >
                <Checkbox
                  id={`journal-${journal.issn}`}
                  checked={selectedJournalISSNs.includes(journal.issn)}
                  onCheckedChange={(checked) =>
                    handleJournalToggle(journal.issn, checked as boolean)
                  }
                  className="mt-0.5 flex-shrink-0"
                />
                <label
                  htmlFor={`journal-${journal.issn}`}
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
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500 text-center py-6 px-3">
            {selectedFieldCodes.length === 0
              ? "Select a field of research to see available journals"
              : "No journals available for selected fields"}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {availableJournals.length > 0 && (
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
