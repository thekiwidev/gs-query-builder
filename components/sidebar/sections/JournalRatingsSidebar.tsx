"use client";

import React from "react";
import { Checkbox } from "../../ui/checkbox";
import { Star, BookOpen, Award } from "lucide-react";
import { Button } from "../../ui/button";

const RATING_ICONS: Record<string, React.ReactNode> = {
  "A*": <Star className="h-4 w-4 fill-amber-400 text-amber-400" />,
  A: <Star className="h-4 w-4 text-blue-500" />,
  B: <Award className="h-4 w-4 text-green-500" />,
  C: <BookOpen className="h-4 w-4 text-gray-500" />,
};

const RATING_COLORS: Record<string, string> = {
  "A*": "border-amber-200 bg-amber-50",
  A: "border-blue-200 bg-blue-50",
  B: "border-green-200 bg-green-50",
  C: "border-gray-200 bg-gray-50",
};

interface JournalRatingsSidebarProps {
  selectedRatings: string[];
  onRatingsChange: (ratings: string[]) => void;
}

export function JournalRatingsSidebar({
  selectedRatings,
  onRatingsChange,
}: JournalRatingsSidebarProps) {
  const handleRatingToggle = (rating: string, checked: boolean) => {
    if (checked) {
      onRatingsChange([...selectedRatings, rating]);
    } else {
      onRatingsChange(selectedRatings.filter((r) => r !== rating));
    }
  };

  const handleShowAll = () => {
    onRatingsChange(["A*", "A", "B", "C"]);
  };

  const handleShowNone = () => {
    onRatingsChange([]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <Star className="h-4 w-4 text-amber-500" />
        Journal Ratings
      </h3>

      {/* Rating Options Grid */}
      <div className="grid grid-cols-2 gap-2">
        {["A*", "A", "B", "C"].map((rating) => (
          <div
            key={rating}
            className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 select-none ${
              selectedRatings.includes(rating)
                ? RATING_COLORS[rating] + " border-opacity-100"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
            onClick={() =>
              handleRatingToggle(rating, !selectedRatings.includes(rating))
            }
          >
            <Checkbox
              id={`rating-${rating}`}
              checked={selectedRatings.includes(rating)}
              className="pointer-events-none"
            />
            <div className="text-sm text-gray-700 flex items-center gap-2 font-medium flex-1">
              {RATING_ICONS[rating]}
              {rating}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleShowAll}
          variant="outline"
          size="sm"
          className="flex-1 text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
        >
          Select All
        </Button>
        <Button
          onClick={handleShowNone}
          variant="outline"
          size="sm"
          className="flex-1 text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-600"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
