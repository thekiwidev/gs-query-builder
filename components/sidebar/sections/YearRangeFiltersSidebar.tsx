"use client";

import React from "react";
import { Input } from "../../ui/input";
import { Calendar } from "lucide-react";

interface YearRangeFiltersSidebarProps {
  yearLow?: number;
  yearHigh?: number;
  onYearChange?: (yearLow?: number, yearHigh?: number) => void;
}

export function YearRangeFiltersSidebar({
  yearLow,
  yearHigh,
  onYearChange,
}: YearRangeFiltersSidebarProps) {
  const handleYearLowChange = (value: string) => {
    const newYearLow = value ? parseInt(value) : undefined;
    onYearChange?.(newYearLow, yearHigh);
  };

  const handleYearHighChange = (value: string) => {
    const newYearHigh = value ? parseInt(value) : undefined;
    onYearChange?.(yearLow, newYearHigh);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Year Range
      </h3>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="From"
            value={yearLow || ""}
            onChange={(e) => handleYearLowChange(e.target.value)}
            min="1900"
            max={new Date().getFullYear()}
            className="h-8 text-sm"
          />
        </div>
        <div className="flex-1">
          <Input
            type="number"
            placeholder="To"
            value={yearHigh || ""}
            onChange={(e) => handleYearHighChange(e.target.value)}
            min="1900"
            max={new Date().getFullYear()}
            className="h-8 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
