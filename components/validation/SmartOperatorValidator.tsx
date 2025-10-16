"use client";

import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export interface OperatorValidation {
  isValid: boolean;
  message: string;
  type: "error" | "warning" | "success";
}

interface SmartOperatorValidatorProps {
  currentOperator: string;
  previousOperator?: string;
}

const OPERATOR_RULES = {
  AND: {
    canFollowOperators: ["OR", "NOT"],
    description: "Narrows results by requiring all conditions",
  },
  OR: {
    canFollowOperators: ["AND", "NOT"],
    description: "Expands results by including any condition",
  },
  NOT: {
    canFollowOperators: ["AND", "OR"],
    description: "Excludes results matching the condition",
  },
};

export function SmartOperatorValidator({
  currentOperator,
  previousOperator,
}: SmartOperatorValidatorProps): OperatorValidation {
  // If there's no previous operator, current operator is valid
  if (!previousOperator) {
    return {
      isValid: true,
      message: "Valid operator",
      type: "success",
    };
  }

  // Check if current operator can follow previous operator
  const currentRules =
    OPERATOR_RULES[currentOperator as keyof typeof OPERATOR_RULES];
  if (!currentRules) {
    return {
      isValid: false,
      message: `Unknown operator: ${currentOperator}`,
      type: "error",
    };
  }

  if (!currentRules.canFollowOperators.includes(previousOperator)) {
    return {
      isValid: false,
      message: `${currentOperator} cannot follow ${previousOperator}`,
      type: "error",
    };
  }

  // Warn about AND after OR (less common pattern)
  if (previousOperator === "OR" && currentOperator === "AND") {
    return {
      isValid: true,
      message: "AND after OR: Consider grouping with parentheses for clarity",
      type: "warning",
    };
  }

  // Warn about NOT after NOT (double negative)
  if (previousOperator === "NOT" && currentOperator === "NOT") {
    return {
      isValid: true,
      message: "Double NOT creates double negative - verify this is intended",
      type: "warning",
    };
  }

  return {
    isValid: true,
    message: `${currentOperator} properly follows ${previousOperator}`,
    type: "success",
  };
}

interface OperatorValidationDisplayProps {
  validation: OperatorValidation;
}

export function OperatorValidationDisplay({
  validation,
}: OperatorValidationDisplayProps) {
  const bgColor = {
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    success: "bg-green-50 border-green-200",
  }[validation.type];

  const textColor = {
    error: "text-red-700",
    warning: "text-yellow-700",
    success: "text-green-700",
  }[validation.type];

  const icon =
    validation.type === "success" ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-600" />
    );

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded border ${bgColor} ${textColor} text-xs`}
    >
      {icon}
      <span>{validation.message}</span>
    </div>
  );
}
