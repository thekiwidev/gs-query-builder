/**
 * Unified Search Block Component (Phase 2)
 * Combines SearchBlockRow, SearchBlockOperatorsRow, and error handling
 */

"use client";

import React, { useState } from "react";
import { SearchBlockRow } from "./SearchBlockRow";
import { SearchBlockOperatorsRow } from "./SearchBlockOperatorsRow";
import { SearchBlockErrorRow } from "./SearchBlockErrorRow";
import type { SearchBlock, SearchField } from "@/types/search";

interface SearchBlockComponentProps {
  block: SearchBlock;
  blockIndex: number;
  totalBlocks: number;
  fields: SearchField[];
  validationError?: string;
  onBlockChange: (block: SearchBlock) => void;
  onBlockRemove: () => void;
}

export function SearchBlockComponentPhase2({
  block,
  blockIndex,
  totalBlocks,
  fields,
  validationError,
  onBlockChange,
  onBlockRemove,
}: SearchBlockComponentProps) {
  const [showOperators, setShowOperators] = useState(false);

  const handleFieldChange = (fieldId: string) => {
    onBlockChange({ ...block, fieldId });
  };

  const handleTermChange = (term: string) => {
    onBlockChange({ ...block, term });
  };

  const handleIsExactChange = (isExact: boolean) => {
    onBlockChange({ ...block, isExact });
  };

  const handleOperatorChange = (operator: "AND" | "OR" | "EXCLUDE") => {
    onBlockChange({ ...block, operator });
  };

  const handleDirectionChange = (direction: "previous" | "next") => {
    onBlockChange({ ...block, operatorDirection: direction });
  };

  const isFirst = blockIndex === 0;
  const isLast = blockIndex === totalBlocks - 1;
  const hasError = !!validationError;

  return (
    <div
      className={`p-4 transition-all ${
        hasError
          ? "bg-red-50 border-l-4 border-red-600"
          : "bg-white border-b border-gray-200 last:border-b-0"
      }`}
    >
      {/* Main Row */}
      <SearchBlockRow
        block={{ ...block, showOperators }}
        fields={fields}
        onFieldChange={handleFieldChange}
        onTermChange={handleTermChange}
        onIsExactChange={handleIsExactChange}
        onToggleOperators={() => setShowOperators(!showOperators)}
        onRemove={onBlockRemove}
      />

      {/* Operators Row (Collapsible) */}
      {showOperators && !isFirst && (
        <SearchBlockOperatorsRow
          operator={block.operator}
          operatorDirection={block.operatorDirection}
          isFirst={isFirst}
          isLast={isLast}
          hasError={hasError}
          errorMessage={validationError}
          onOperatorChange={handleOperatorChange}
          onDirectionChange={handleDirectionChange}
        />
      )}

      {/* Error Message Row */}
      {hasError && !showOperators && (
        <SearchBlockErrorRow error={validationError || ""} />
      )}
    </div>
  );
}
