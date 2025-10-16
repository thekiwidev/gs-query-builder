"use client";

import React from "react";
import { Checkbox } from "../../ui/checkbox";
import { Star, GraduationCap, BookOpen } from "lucide-react";

const RATING_ICONS: Record<string, React.ReactNode> = {
  "A*": <Star className="h-4 w-4 fill-current" />,
  A: <Star className="h-4 w-4" />,
  B: <GraduationCap className="h-4 w-4" />,
  C: <BookOpen className="h-4 w-4" />,
};

export function JournalRatingsSidebar() {
  const [selectedRatings, setSelectedRatings] = React.useState<string[]>([
    "A*",
    "A",
    "B",
    "C",
  ]);

  const handleRatingToggle = (rating: string, checked: boolean) => {
    if (checked) {
      setSelectedRatings([...selectedRatings, rating]);
    } else {
      setSelectedRatings(selectedRatings.filter((r) => r !== rating));
    }
  };

  const handleShowAll = () => {
    setSelectedRatings(["A*", "A", "B", "C"]);
  };

  const handleShowNone = () => {
    setSelectedRatings([]);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <Star className="h-4 w-4" />
        Journal Ratings
      </h3>
      <div className="space-y-2 flex items-center justify-evenly">
        {["A*", "A", "B", "C"].map((rating) => (
          <div key={rating} className="flex items-center space-x-2">
            <Checkbox
              id={`rating-${rating}`}
              checked={selectedRatings.includes(rating)}
              onCheckedChange={(checked) =>
                handleRatingToggle(rating, checked as boolean)
              }
            />
            <label
              htmlFor={`rating-${rating}`}
              className="text-xs cursor-pointer text-gray-700 flex items-center gap-1"
            >
              {RATING_ICONS[rating]}
              {rating}
            </label>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <button
          onClick={handleShowAll}
          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Show All
        </button>
        <button
          onClick={handleShowNone}
          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Show None
        </button>
      </div>
    </div>
  );
}
