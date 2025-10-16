"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const JOURNAL_RATINGS = [
  { id: "a-star", label: "A*", count: 12 },
  { id: "a", label: "A", count: 45 },
  { id: "b", label: "B", count: 78 },
  { id: "c", label: "C", count: 23 },
];

interface JournalRatingFilterProps {
  selectedRatings: string[];
  onRatingsChange: (ratings: string[]) => void;
}

export function JournalRatingFilter({
  selectedRatings,
  onRatingsChange,
}: JournalRatingFilterProps) {
  const [expanded, setExpanded] = useState(true);

  const handleRatingToggle = (ratingId: string) => {
    if (selectedRatings.includes(ratingId)) {
      onRatingsChange(selectedRatings.filter((r) => r !== ratingId));
    } else {
      onRatingsChange([...selectedRatings, ratingId]);
    }
  };

  const handleShowAll = () => {
    onRatingsChange(JOURNAL_RATINGS.map((r) => r.id));
  };

  const handleShowNone = () => {
    onRatingsChange([]);
  };

  return (
    <div className="space-y-3 pt-4 border-t border-gray-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full p-3 hover:bg-white rounded-lg transition-colors"
      >
        <h3 className="font-semibold text-sm text-gray-900">Journal Ratings</h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="space-y-2 px-3 pb-3">
          <div className="space-y-2">
            {JOURNAL_RATINGS.map((rating) => (
              <label
                key={rating.id}
                className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(rating.id)}
                  onChange={() => handleRatingToggle(rating.id)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 flex-1">
                  {rating.label}
                </span>
                <span className="text-xs text-gray-500">({rating.count})</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleShowAll}
              className="flex-1 text-xs font-medium text-blue-600 hover:text-blue-700 py-2 px-2 hover:bg-blue-50 rounded transition-colors"
            >
              Show All
            </button>
            <button
              onClick={handleShowNone}
              className="flex-1 text-xs font-medium text-gray-600 hover:text-gray-700 py-2 px-2 hover:bg-gray-100 rounded transition-colors"
            >
              Show None
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
