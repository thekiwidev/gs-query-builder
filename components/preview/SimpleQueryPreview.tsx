"use client";

import React from "react";

interface SimpleQueryPreviewProps {
  query: string;
}

/**
 * Minimal query preview component
 * Shows only the generated query string that updates in real-time
 * Positioned at the bottom of search blocks for immediate visual feedback
 */
export function SimpleQueryPreview({ query }: SimpleQueryPreviewProps) {
  if (!query) {
    return null;
  }

  return (
    <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
      <p className="text-xs text-gray-600 font-mono break-all">{query}</p>
    </div>
  );
}
