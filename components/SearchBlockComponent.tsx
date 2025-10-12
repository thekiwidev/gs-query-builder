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

  const handleBooleanChange = (operator: "AND" | "OR" | "NOT") => {
    onChange({ ...block, booleanOperator: operator });
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
          <Input
            id={`term-${index}`}
            type="text"
            value={block.term}
            onChange={(e) => handleTermChange(e.target.value)}
            placeholder="Enter your search term..."
            className="w-full"
          />
        </div>
      </div>

      {/* Logic toggles and Preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Logic toggles */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {index === 0 ? "Exclusion:" : "Connect to Previous:"}
            </Label>
            <Select
              value={block.booleanOperator}
              onValueChange={(value) =>
                handleBooleanChange(value as "AND" | "OR" | "NOT")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {index === 0 ? (
                  <>
                    <SelectItem value="AND">Include this term</SelectItem>
                    <SelectItem value="NOT">Exclude this term</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="AND">AND (must have both)</SelectItem>
                    <SelectItem value="OR">OR (either term)</SelectItem>
                    <SelectItem value="NOT">NOT (exclude this)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
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
                block.booleanOperator === "NOT"
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : block.booleanOperator === "OR" && index > 0
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {generatePreview(block)}
              {!isOnlyBlock && block.booleanOperator === "OR" && (
                <span className="text-orange-500 ml-1">
                  {index === 0 ? "OR with next" : "OR with previous"}
                </span>
              )}
              {!isOnlyBlock && block.booleanOperator === "AND" && (
                <span className="text-blue-500 ml-1">
                  {index === 0 ? "AND with next" : "AND with previous"}
                </span>
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

  if (field.mustQuote && !term.startsWith('"')) {
    term = `"${term}"`;
  }

  if (field.gsOperator) {
    term = `${field.gsOperator}${term}`;
  }

  if (block.booleanOperator === "NOT") {
    term = `-${term}`;
  }

  return term;
}
