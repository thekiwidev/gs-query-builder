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
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Trash2, Search, Filter, Code } from "lucide-react";
import { cn } from "../lib/utils";

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
    <div className="border border-border rounded-xl p-4 bg-card">
      {/* Block header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Search Block {index + 1}
          </h3>
        </div>
        <Button
          onClick={onRemove}
          disabled={isOnlyBlock}
          variant={isOnlyBlock ? "secondary" : "destructive"}
          size="sm"
          className="h-8 hover:cursor-pointer disabled:cursor-not-allowed transition-all duration-200"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>

      {/* Main search inputs - Horizontal Layout */}
      <div className="flex flex-col sm:flex-row gap-4 mb-3">
        {/* Field selection */}
        <div className="flex-1">
          <Label
            htmlFor={`field-${index}`}
            className="flex items-center gap-2 mb-2"
          >
            <Filter className="h-4 w-4" />
            Search In:
          </Label>
          <Select value={block.fieldId} onValueChange={handleFieldChange}>
            <SelectTrigger id={`field-${index}`}>
              <SelectValue placeholder="Select a field..." />
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
        <div className="flex-2">
          <Label
            htmlFor={`term-${index}`}
            className="flex items-center gap-2 mb-2"
          >
            <Search className="h-4 w-4" />
            Search Term:
          </Label>
          <div className="flex gap-2">
            <Input
              id={`term-${index}`}
              type="text"
              value={block.term}
              onChange={(e) => handleTermChange(e.target.value)}
              placeholder="Enter your search term..."
              className="w-full"
            />
            <div className="flex items-center border border-input rounded-md px-3 whitespace-nowrap">
              <input
                type="checkbox"
                id={`exact-${index}`}
                checked={block.isExact || false}
                onChange={(e) =>
                  onChange({ ...block, isExact: e.target.checked })
                }
                className="mr-2"
              />
              <label
                htmlFor={`exact-${index}`}
                className="text-sm cursor-pointer"
              >
                Is Exact
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Logic toggles and Preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Enhanced Operators with clear descriptions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Code className="h-4 w-4" />
              Logical Operator:
              <span className="ml-1 text-xs text-muted-foreground">
                (Defines relationship with other blocks)
              </span>
            </Label>
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
              <SelectTrigger className="w-full">
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
                <SelectItem value="EXCLUDE">
                  Exclude this block (NOT)
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Operator explanation tooltip */}
            {block.operator?.type !== "NONE" && (
              <p className="text-xs text-muted-foreground mt-1">
                {block.operator?.type === "AND_NEXT" &&
                  "Groups this term with the next term using AND logic"}
                {block.operator?.type === "AND_PREV" &&
                  "Groups this term with the previous term using AND logic"}
                {block.operator?.type === "OR_NEXT" &&
                  "Groups this term with the next term using OR logic"}
                {block.operator?.type === "OR_PREV" &&
                  "Groups this term with the previous term using OR logic"}
                {block.operator?.type === "EXCLUDE" &&
                  "Excludes results containing this term"}
              </p>
            )}
          </div>
        </div>

        {/* Preview of what will be generated */}
        {block.fieldId && block.term && (
          <div className="flex items-center gap-2 text-xs">
            <Code className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Preview:</span>
            <code
              className={cn(
                "px-2 py-1 rounded text-xs font-mono transition-colors",
                block.operator?.type === "EXCLUDE" ||
                  block.booleanOperator === "NOT"
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : block.operator?.type === "OR_NEXT" ||
                    block.operator?.type === "OR_PREV" ||
                    block.booleanOperator === "OR"
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {generatePreview(block)}
              {/* Show relationship based on new operator property */}
              {block.operator?.type === "AND_NEXT" && (
                <span className="text-blue-500 ml-1">AND with next</span>
              )}
              {block.operator?.type === "AND_PREV" && (
                <span className="text-blue-500 ml-1">AND with previous</span>
              )}
              {block.operator?.type === "OR_NEXT" && (
                <span className="text-orange-500 ml-1">OR with next</span>
              )}
              {block.operator?.type === "OR_PREV" && (
                <span className="text-orange-500 ml-1">OR with previous</span>
              )}
              {block.operator?.type === "EXCLUDE" && (
                <span className="text-destructive ml-1">excluded</span>
              )}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Generates a preview of how the search block will be translated
 */
function generatePreview(block: SearchBlock): string {
  const field = GS_SEARCH_FIELDS.find((f) => f.id === block.fieldId);
  if (!field || !block.term.trim()) return "";

  let term = block.term.trim();

  // Only add quotes if "Is Exact" is checked
  if (block.isExact && !term.startsWith('"')) {
    term = `"${term}"`;
  }

  if (field.gsOperator) {
    term = `${field.gsOperator}${term}`;
  }

  // Check for exclusion (NOT) using either the new operator or legacy booleanOperator
  const isExclusion =
    block.operator?.type === "EXCLUDE" || block.booleanOperator === "NOT";

  if (isExclusion) {
    term = `-${term}`;
  }

  return term;
}
