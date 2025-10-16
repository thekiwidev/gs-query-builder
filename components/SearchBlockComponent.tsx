/**
 * Search Block Component
 *
 * A React component that represents a single search block with field selection,
 * search term input, and exclusion toggle.
 */

"use client";

import React from "react";
import { SearchBlock } from "../lib/qtm";
import { GS_SEARCH_FIELDS } from "../data/SearchWithin";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Trash2 } from "lucide-react";

interface SearchBlockComponentProps {
  /** The search block data */
  block: SearchBlock;
  /** Callback when the block is updated */
  onChange: (block: SearchBlock) => void;
  /** Callback when the block should be removed */
  onRemove: () => void;
  /** Whether this is the only block (remove button should be disabled) */
  isOnlyBlock: boolean;
  /** Block index for display purposes */
  index: number;
}

export function SearchBlockComponent({
  block,
  onChange,
  onRemove,
  isOnlyBlock,
  index,
}: SearchBlockComponentProps) {
  const handleFieldChange = (fieldId: string) => {
    onChange({ ...block, fieldId });
  };

  const handleTermChange = (term: string) => {
    onChange({ ...block, term });
  };

  // New handler for the enhanced operator options
  const handleOperatorChange = (
    operatorType:
      | "AND_NEXT"
      | "AND_PREV"
      | "OR_NEXT"
      | "OR_PREV"
      | "EXCLUDE"
      | "NONE"
  ) => {
    // For backward compatibility, map to legacy booleanOperator as well
    let legacyOperator: "AND" | "OR" | "NOT" = "AND";

    if (operatorType === "EXCLUDE") {
      legacyOperator = "NOT";
    } else if (operatorType === "OR_NEXT" || operatorType === "OR_PREV") {
      legacyOperator = "OR";
    }

    onChange({
      ...block,
      operator: { type: operatorType },
      booleanOperator: legacyOperator,
    });
  };

  return (
    <div className="p-4 bg-white">
      {/* Main search inputs - Single Row Layout */}
      <div className="flex gap-3 items-center h-10 mb-3">
        {/* Field selection */}
        <div className="w-1/4">
          <Select value={block.fieldId} onValueChange={handleFieldChange}>
            <SelectTrigger id={`field-${index}`} className="h-10 text-sm">
              <SelectValue placeholder="Select field..." />
            </SelectTrigger>
            <SelectContent>
              {GS_SEARCH_FIELDS.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search term input */}
        <div className="flex-1">
          <Input
            id={`term-${index}`}
            type="text"
            value={block.term}
            onChange={(e) => handleTermChange(e.target.value)}
            placeholder="Enter search term..."
            className="h-10 text-sm"
          />
        </div>

        {/* @note: removing redundant is exact button */}
        {/* Is Exact Checkbox */}
        {/* <div className="flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100 cursor-pointer">
          <input
            type="checkbox"
            id={`exact-${index}`}
            checked={block.isExact || false}
            onChange={(e) => onChange({ ...block, isExact: e.target.checked })}
            className="w-4 h-4 cursor-pointer"
            title="Is Exact"
          />
        </div> */}

        {/* Remove Button */}
        <Button
          onClick={onRemove}
          disabled={isOnlyBlock}
          variant="ghost"
          size="sm"
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 p-0"
        >
          <span className="text-lg">
            <Trash2 />
          </span>
        </Button>
      </div>

      {/* Operators Row - Below main row */}
      <div className="mt-2 pt-2 border-t border-gray-200 flex gap-3 items-center text-xs">
        <div className="w-1/4">
          <Select
            value={block.operator?.type || "NONE"}
            onValueChange={(value) =>
              handleOperatorChange(
                value as
                  | "AND_NEXT"
                  | "AND_PREV"
                  | "OR_NEXT"
                  | "OR_PREV"
                  | "EXCLUDE"
                  | "NONE"
              )
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">No special operator</SelectItem>

              {/* AND operators - adds parenthetical grouping */}
              {!isOnlyBlock && (
                <SelectItem value="AND_NEXT">
                  AND with next block - (this AND next)
                </SelectItem>
              )}
              {index > 0 && (
                <SelectItem value="AND_PREV">
                  AND with previous block - (prev AND this)
                </SelectItem>
              )}

              {/* OR operators - adds parenthetical grouping */}
              {!isOnlyBlock && (
                <SelectItem value="OR_NEXT">
                  OR with next block - (this OR next)
                </SelectItem>
              )}
              {index > 0 && (
                <SelectItem value="OR_PREV">
                  OR with previous block - (prev OR this)
                </SelectItem>
              )}

              {/* Exclude operator - adds NOT logic */}
              <SelectItem value="EXCLUDE">Exclude this block (NOT)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* <div className="flex-1" /> */}

        <label
          htmlFor={`exact-ops-${index}`}
          className="flex items-center justify-center gap-x-2 h-8 rounded-xl hover:bg-gray-100 cursor-pointer px-3"
        >
          <input
            type="checkbox"
            id={`exact-ops-${index}`}
            checked={block.isExact || false}
            onChange={(e) => onChange({ ...block, isExact: e.target.checked })}
            className="w-4 h-4 cursor-pointer"
            title="Is Exact"
          />
          <label htmlFor={`exact-ops-${index}`} className="cursor-pointer">
            Is exact phrase
          </label>
        </label>
      </div>
    </div>
  );
}
