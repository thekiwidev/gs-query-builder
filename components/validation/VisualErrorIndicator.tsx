"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export type ErrorSeverity = "error" | "warning" | "info";

interface SearchBlockError {
  id: string;
  field: string;
  message: string;
  severity: ErrorSeverity;
  suggestion?: string;
}

interface VisualErrorIndicatorProps {
  errors: SearchBlockError[];
  blockIndex: number;
}

const severityConfig = {
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: AlertCircle,
    iconColor: "text-red-600",
  },
  warning: {
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
    icon: AlertCircle,
    iconColor: "text-yellow-600",
  },
  info: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    icon: Info,
    iconColor: "text-blue-600",
  },
};

export function VisualErrorIndicator({
  errors,
  blockIndex,
}: VisualErrorIndicatorProps) {
  if (errors.length === 0) {
    return null;
  }

  const hasErrors = errors.some((e) => e.severity === "error");
  const hasWarnings = errors.some((e) => e.severity === "warning");

  return (
    <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      {/* Summary indicator */}
      <div className="flex items-center gap-2">
        {hasErrors && (
          <div className="flex items-center gap-1 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Errors in Block {blockIndex}
            </span>
          </div>
        )}
        {hasWarnings && !hasErrors && (
          <div className="flex items-center gap-1 text-yellow-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Warnings in Block {blockIndex}
            </span>
          </div>
        )}
      </div>

      {/* Individual errors */}
      <div className="space-y-2">
        {errors.map((error) => {
          const config = severityConfig[error.severity];
          const Icon = config.icon;

          return (
            <div
              key={error.id}
              className={`flex gap-2 p-2 rounded border ${config.bgColor} ${config.borderColor}`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 mt-0.5 ${config.iconColor}`}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${config.textColor}`}>
                  {error.field}: {error.message}
                </p>
                {error.suggestion && (
                  <p className={`text-xs mt-1 ${config.textColor} opacity-75`}>
                    💡 {error.suggestion}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action indicator */}
      {hasErrors && (
        <div className="flex items-center gap-2 pt-2 mt-2 border-t border-gray-200 text-xs text-gray-600">
          <CheckCircle2 className="w-4 h-4 text-gray-400" />
          <span>Resolve errors before proceeding</span>
        </div>
      )}
    </div>
  );
}

export function ErrorBadge({ severity }: { severity: ErrorSeverity }) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.bgColor} ${config.textColor} text-xs font-medium`}
    >
      <Icon className={`w-3 h-3 ${config.iconColor}`} />
      <span>{severity.charAt(0).toUpperCase() + severity.slice(1)}</span>
    </div>
  );
}
