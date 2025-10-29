"use client";

import React from "react";
import { SearchBlock } from "../../lib/qtm";
import { SearchBlockComponent } from "../SearchBlockComponent";
import { CirclePlus } from "lucide-react";
import { Button } from "../ui/button";

interface SearchBlocksContainerProps {
  blocks: SearchBlock[];
  onBlockChange: (index: number, block: SearchBlock) => void;
  onBlockRemove: (index: number) => void;
  onAddBlock: () => void;
  onSearch: () => void;
  hasErrors: boolean;
}

export function SearchBlocksContainer({
  blocks,
  onBlockChange,
  onBlockRemove,
  onAddBlock,
  onSearch,
  hasErrors,
}: SearchBlocksContainerProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Search Terms</h3>
      </div>

      {/* Search Blocks */}
      <div className="p-6 space-y-4">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 p-4"
          >
            <SearchBlockComponent
              block={block}
              onChange={(updatedBlock) => onBlockChange(index, updatedBlock)}
              onRemove={() => onBlockRemove(index)}
              isOnlyBlock={blocks.length === 1}
              index={index}
              allBlocks={blocks}
            />
          </div>
        ))}

        {/* Add Another Button */}
        <button
          onClick={onAddBlock}
          className="flex items-center gap-2 text-sm text-[#4D90FD] hover:text-[#3D7CDB] font-medium  pt-2 cursor-pointer hover:scale-105 duration-150 ml-2"
        >
          <CirclePlus className="h-4 w-4" />
          Add Another
        </button>
      </div>

      {/* Search Button Section */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
        <Button
          onClick={onSearch}
          disabled={hasErrors}
          className={`flex items-center gap-2 font-medium px-8 py-2 rounded-lg transition-all duration-200 ${
            hasErrors
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:scale-105 active:scale-95"
          }`}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
