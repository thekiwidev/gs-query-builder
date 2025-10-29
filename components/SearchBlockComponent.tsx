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
  /** All blocks for operator validation */
  allBlocks?: SearchBlock[];
}

export function SearchBlockComponent({
  block,
  onChange,
  onRemove,
  isOnlyBlock,
  index,
  allBlocks = [],
}: SearchBlockComponentProps) {
  const handleFieldChange = (fieldId: string) => {
    onChange({ ...block, fieldId });
  };

  const handleTermChange = (term: string) => {
    onChange({ ...block, term });
  };

  // Determine which operators are valid based on surrounding blocks
  const getValidOperators = () => {
    const previousBlock = index > 0 ? allBlocks[index - 1] : null;
    const valid: {
      and_next: boolean;
      and_prev: boolean;
      or_next: boolean;
      or_prev: boolean;
      exclude: boolean;
    } = {
      and_next: !isOnlyBlock,
      and_prev: index > 0,
      or_next: !isOnlyBlock,
      or_prev: index > 0,
      exclude: true,
    };

    // CRITICAL RULE: The current block's PREV operator MUST match the previous block's NEXT operator
    // This keeps all blocks in the same parenthesis group until the chain is broken

    // If previous block has AND_NEXT, current block MUST use AND_PREV (cannot use OR_PREV)
    if (previousBlock?.operator?.type === "AND_NEXT") {
      valid.or_prev = false;
    }

    // If previous block has OR_NEXT, current block MUST use OR_PREV (cannot use AND_PREV)
    if (previousBlock?.operator?.type === "OR_NEXT") {
      valid.and_prev = false;
    }

    return valid;
  };

  const validOperators = getValidOperators();

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
          className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-red-100 text-gray-400 hover:text-red-600 p-0"
        >
          <span className="text-lg">
            <Trash2 className="h-4 w-4" />
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
              {validOperators.and_next && (
                <SelectItem value="AND_NEXT">
                  AND with next block - (this AND next)
                </SelectItem>
              )}
              {validOperators.and_prev && (
                <SelectItem value="AND_PREV">
                  AND with previous block - (prev AND this)
                </SelectItem>
              )}

              {/* OR operators - adds parenthetical grouping */}
              {validOperators.or_next && (
                <SelectItem value="OR_NEXT">
                  OR with next block - (this OR next)
                </SelectItem>
              )}
              {validOperators.or_prev && (
                <SelectItem value="OR_PREV">
                  OR with previous block - (prev OR this)
                </SelectItem>
              )}

              {/* Does Not Include operator - adds NOT logic */}
              {validOperators.exclude && (
                <SelectItem value="EXCLUDE">
                  Does Not Include this block (NOT)
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* <div className="flex-1" /> */}

        <label
          htmlFor={`exact-ops-${index}`}
          className="flex items-center justify-center gap-x-2 h-8 rounded-lg hover:bg-gray-100 cursor-pointer px-3 transition-colors"
        >
          <input
            type="checkbox"
            id={`exact-ops-${index}`}
            checked={block.isExact || false}
            onChange={(e) => onChange({ ...block, isExact: e.target.checked })}
            className="w-4 h-4 cursor-pointer rounded-md"
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
