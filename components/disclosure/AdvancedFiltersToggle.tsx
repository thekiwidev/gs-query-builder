"use client";

import React from "react";
import { ChevronDown, Sliders } from "lucide-react";

interface AdvancedFiltersToggleProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  filterCount: number;
}

export function AdvancedFiltersToggle({
  isOpen,
  onToggle,
  filterCount,
}: AdvancedFiltersToggleProps) {
  return (
    <button
      onClick={() => onToggle(!isOpen)}
      className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
    >
      <div className="flex items-center gap-2">
        <Sliders className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
        <span className="font-medium text-gray-900">
          Advanced Filters
          {filterCount > 0 && (
            <span className="ml-2 inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {filterCount}
            </span>
          )}
        </span>
      </div>

      <ChevronDown
        className={`w-5 h-5 text-gray-600 transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

interface AdvancedFiltersContainerProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export function AdvancedFiltersContainer({
  isOpen,
  children,
}: AdvancedFiltersContainerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
      {children}
    </div>
  );
}
