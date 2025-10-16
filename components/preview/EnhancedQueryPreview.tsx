"use client";

import React, { useState } from "react";
import { Copy, ExternalLink, Eye, EyeOff } from "lucide-react";

interface EnhancedQueryPreviewProps {
  query: string;
  queryUrl: string;
  blockCount: number;
  filterCount: number;
}

export function EnhancedQueryPreview({
  query,
  queryUrl,
  blockCount,
  filterCount,
}: EnhancedQueryPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(queryUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Truncate display if URL is long
  const displayQuery = showFull ? queryUrl : queryUrl.substring(0, 80);
  const isLongUrl = queryUrl.length > 80;

  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white space-y-3">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900">Generated Query</h3>
          <p className="text-xs text-gray-500">
            {blockCount} search block{blockCount !== 1 ? "s" : ""} •{" "}
            {filterCount} filter{filterCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Query text */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">
          Search Terms:
        </label>
        <div className="p-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700 break-words">
          {query || <span className="text-gray-400">No search terms yet</span>}
        </div>
      </div>

      {/* URL preview */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">
          Generated URL:
        </label>
        <div className="flex items-start gap-2">
          <div className="flex-1 p-2 bg-gray-50 rounded border border-gray-200 text-xs text-gray-600 break-all font-mono">
            {displayQuery}
            {isLongUrl && !showFull && "..."}
          </div>
          {isLongUrl && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded transition-colors"
              title={showFull ? "Show less" : "Show more"}
            >
              {showFull ? (
                <EyeOff className="w-4 h-4 text-gray-600" />
              ) : (
                <Eye className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
        >
          <Copy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy URL"}
        </button>

        <a
          href={queryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open
        </a>
      </div>

      {/* Info note */}
      <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
        💡 Click &quot;Open&quot; to view results on Google Scholar in a new
        tab, or &quot;Copy URL&quot; to share the query
      </div>
    </div>
  );
}
