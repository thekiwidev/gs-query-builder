"use client";

import React from "react";
import { Checkbox } from "../../ui/checkbox";
import { Star, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "../../ui/button";

const RATING_ICONS: Record<string, React.ReactNode> = {
  "A*": <Star className="h-4 w-4 fill-current" />,
  A: <Star className="h-4 w-4" />,
  B: <GraduationCap className="h-4 w-4" />,
  C: <BookOpen className="h-4 w-4" />,
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
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <Star className="h-4 w-4" />
        Journal Ratings
      </h3>
      <div className="flex items-center justify-between">
        {["A*", "A", "B", "C"].map((rating) => (
          <div key={rating} className="flex items-center gap-x-2">
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
        <Button
          onClick={handleShowAll}
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          Show All
        </Button>
        <Button
          onClick={handleShowNone}
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          Show None
        </Button>
      </div>
    </div>
  );
}
