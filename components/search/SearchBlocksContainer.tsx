"use client";

import React from "react";
import { SearchBlock } from "../../lib/qtm";
import { SearchBlockComponent } from "../SearchBlockComponent";

interface SearchBlocksContainerProps {
  blocks: SearchBlock[];
  onBlockChange: (index: number, block: SearchBlock) => void;
  onBlockRemove: (index: number) => void;
}

export function SearchBlocksContainer({
  blocks,
  onBlockChange,
  onBlockRemove,
}: SearchBlocksContainerProps) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {blocks.map((block, index) => (
        <div
          key={index}
          className={
            index < blocks.length - 1 ? "border-b border-gray-200" : ""
          }
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
    </div>
  );
}
