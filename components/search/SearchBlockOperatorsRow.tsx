/**
 * Search Block Operators Row Component
 * Displays operator selection and direction when expanded
 */

"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import type { OperatorType, OperatorDirection } from "@/types/search";

interface SearchBlockOperatorsRowProps {
  operator?: OperatorType;
  operatorDirection?: OperatorDirection;
  isFirst: boolean;
  isLast: boolean;
  hasError?: boolean;
  errorMessage?: string;
  onOperatorChange: (operator: OperatorType) => void;
  onDirectionChange: (direction: OperatorDirection) => void;
}

export function SearchBlockOperatorsRow({
  operator = "AND",
  operatorDirection = "next",
  isFirst,
  isLast,
  hasError = false,
  errorMessage,
  onOperatorChange,
  onDirectionChange,
}: SearchBlockOperatorsRowProps) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
      {/* Operator Selection */}
      <div className="flex gap-4 items-center">
        <label className="text-xs font-semibold text-gray-700 w-16">
          Operator:
        </label>

        <div className="flex gap-3">
          {/* AND Option */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="operator"
              value="AND"
              checked={operator === "AND"}
              onChange={(e) => onOperatorChange(e.target.value as OperatorType)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">AND</span>
          </label>

          {/* OR Option */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="operator"
              value="OR"
              checked={operator === "OR"}
              onChange={(e) => onOperatorChange(e.target.value as OperatorType)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">OR</span>
          </label>

          {/* EXCLUDE Option */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="operator"
              value="EXCLUDE"
              checked={operator === "EXCLUDE"}
              onChange={(e) => onOperatorChange(e.target.value as OperatorType)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">NOT</span>
          </label>
        </div>
      </div>

      {/* Direction Selection (if not first or last) */}
      {!isFirst || !isLast ? (
        <div className="flex gap-4 items-center">
          <label className="text-xs font-semibold text-gray-700 w-16">
            Direction:
          </label>

          <div className="flex gap-3">
            {/* With Previous */}
            {!isFirst && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  value="previous"
                  checked={operatorDirection === "previous"}
                  onChange={(e) =>
                    onDirectionChange(e.target.value as OperatorDirection)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">with previous</span>
              </label>
            )}

            {/* With Next */}
            {!isLast && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  value="next"
                  checked={operatorDirection === "next"}
                  onChange={(e) =>
                    onDirectionChange(e.target.value as OperatorDirection)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">with next</span>
              </label>
            )}
          </div>
        </div>
      ) : null}

      {/* Error Message */}
      {hasError && errorMessage && (
        <div className="flex gap-2 items-start p-3 bg-red-50 rounded border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
