/**
 * Search Block Row Component
 * Displays a single-line search block with field selector, term input, and action buttons
 */

"use client";

import React from "react";
import { Plus, X, CheckCircle, Circle } from "lucide-react";
import type { SearchBlock, SearchField } from "@/types/search";

interface SearchBlockRowProps {
  block: SearchBlock & { showOperators?: boolean };
  fields: SearchField[];
  onFieldChange: (fieldId: string) => void;
  onTermChange: (term: string) => void;
  onIsExactChange: (isExact: boolean) => void;
  onToggleOperators: () => void;
  onRemove: () => void;
}

export function SearchBlockRow({
  block,
  fields,
  onFieldChange,
  onTermChange,
  onIsExactChange,
  onToggleOperators,
  onRemove,
}: SearchBlockRowProps) {
  return (
    <div className="flex gap-3 items-center h-12">
      {/* Field Selector Dropdown */}
      <select
        value={block.fieldId}
        onChange={(e) => onFieldChange(e.target.value)}
        className="w-40 px-3 py-2 border border-gray-300 rounded text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Field</option>
        {fields.map((field) => (
          <option key={field.id} value={field.id}>
            {field.label}
          </option>
        ))}
      </select>

      {/* Search Term Input */}
      <input
        type="text"
        value={block.term}
        onChange={(e) => onTermChange(e.target.value)}
        placeholder="Enter search term..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Is Exact Checkbox (Icon) */}
      <button
        onClick={() => onIsExactChange(!block.isExact)}
        className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
        title="Exact match"
        type="button"
      >
        {block.isExact ? (
          <CheckCircle className="w-5 h-5 text-blue-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expand Operators Button */}
      <button
        onClick={onToggleOperators}
        className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
        title={block.showOperators ? "Hide operators" : "Show operators"}
        type="button"
      >
        {block.showOperators ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Plus className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="w-10 h-10 flex items-center justify-center rounded hover:bg-red-50 transition-colors"
        title="Remove block"
        type="button"
      >
        <X className="w-5 h-5 text-gray-400 hover:text-red-600" />
      </button>
    </div>
  );
}
